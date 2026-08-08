import urllib.request
import json
import os

def fetch_openf1_circuits():
    # 1. Fetch meetings from OpenF1 to get all circuit_key values
    meetings_url = 'https://api.openf1.org/v1/meetings?year=2024'
    req = urllib.request.Request(meetings_url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        res = urllib.request.urlopen(req)
        meetings = json.loads(res.read().decode('utf-8'))
    except Exception as e:
        print(f"Error fetching meetings: {e}")
        return

    circuits_dict = {}
    print(f"Found {len(meetings)} meetings in OpenF1 2024 calendar.")

    for m in meetings:
        ckey = m.get('circuit_key')
        cname = m.get('circuit_short_name') or m.get('location') or m.get('country_name')
        if not ckey or ckey in circuits_dict:
            continue
        
        info_url = m.get('circuit_info_url') or f'https://api.multiviewer.app/api/v1/circuits/{ckey}/2024'
        print(f"Fetching geometry for circuitKey {ckey} ({cname})...")
        
        try:
            creq = urllib.request.Request(info_url, headers={'User-Agent': 'Mozilla/5.0'})
            cres = urllib.request.urlopen(creq)
            cdata = json.loads(cres.read().decode('utf-8'))
            
            raw_x = cdata.get('x', [])
            raw_y = cdata.get('y', [])
            raw_corners = cdata.get('corners', [])

            if not raw_x or not raw_y:
                print(f"  Skipping {ckey}: empty coordinates")
                continue

            # Normalize coordinates into a 1000x700 viewBox canvas
            min_x, max_x = min(raw_x), max(raw_x)
            min_y, max_y = min(raw_y), max(raw_y)
            
            width = max_x - min_x if max_x != min_x else 1
            height = max_y - min_y if max_y != min_y else 1
            
            # Target box inside 1000x700 canvas with 80px padding
            target_w = 840.0
            target_h = 540.0
            scale = min(target_w / width, target_h / height)
            
            offset_x = 80.0 + (target_w - width * scale) / 2.0
            # Flip Y axis because SVG Y goes downward
            offset_y = 620.0 - (target_h - height * scale) / 2.0

            normalized_points = []
            path_cmds = []

            for idx, (px, py) in enumerate(zip(raw_x, raw_y)):
                nx = round(offset_x + (px - min_x) * scale, 1)
                ny = round(offset_y - (py - min_y) * scale, 1)
                normalized_points.append({'x': nx, 'y': ny})
                if idx == 0:
                    path_cmds.append(f"M {nx} {ny}")
                else:
                    path_cmds.append(f"L {nx} {ny}")
            
            path_cmds.append("Z")
            svg_path = " ".join(path_cmds)

            # Normalize corner markers
            normalized_corners = []
            for corner in raw_corners:
                num = corner.get('number')
                tp = corner.get('trackPosition', {})
                cx = tp.get('x')
                cy = tp.get('y')
                if cx is not None and cy is not None:
                    cnx = round(offset_x + (cx - min_x) * scale, 1)
                    cny = round(offset_y - (cy - min_y) * scale, 1)
                    normalized_corners.append({
                        'number': num,
                        'name': f"Turn {num}",
                        'type': 'Apex Corner',
                        'x': cnx,
                        'y': cny
                    })

            # Start/Finish is first point
            sf_point = normalized_points[0] if normalized_points else {'x': 200, 'y': 500}

            circuit_obj = {
                'circuitKey': ckey,
                'circuitId': cname.lower().replace(' ', '_'),
                'name': m.get('meeting_official_name') or m.get('meeting_name') or cname,
                'locality': m.get('location'),
                'country': m.get('country_name'),
                'viewBox': '0 0 1000 700',
                'path': svg_path,
                'startFinish': {'x': sf_point['x'], 'y': sf_point['y'], 'label': 'Start / Finish'},
                'turnsCount': len(normalized_corners),
                'turns': normalized_corners,
                'drsZones': [
                  { 'id': 'DRS1', 'name': 'DRS Zone 1', 'path': f"M {sf_point['x']} {sf_point['y']} L {normalized_points[min(60, len(normalized_points)-1)]['x']} {normalized_points[min(60, len(normalized_points)-1)]['y']}" }
                ],
                'sectors': [
                  { 'id': 'S1', 'name': 'Sector 1', 'color': '#00F0FF', 'startPercent': 0, 'endPercent': 33 },
                  { 'id': 'S2', 'name': 'Sector 2', 'color': '#FF00EA', 'startPercent': 33, 'endPercent': 66 },
                  { 'id': 'S3', 'name': 'Sector 3', 'color': '#FFD600', 'startPercent': 66, 'endPercent': 100 }
                ]
            }

            circuits_dict[str(ckey)] = circuit_obj
            print(f"  Successfully processed {cname} ({len(normalized_points)} points, {len(normalized_corners)} turns)")

        except Exception as err:
            print(f"  Failed for circuitKey {ckey}: {err}")

    # Output file
    output_path = os.path.join('frontend', 'src', 'data', 'circuitLayouts', 'openf1Layouts.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(circuits_dict, f, indent=2)
    
    print(f"\nSaved {len(circuits_dict)} OpenF1 track layouts to {output_path}")

if __name__ == '__main__':
    fetch_openf1_circuits()
