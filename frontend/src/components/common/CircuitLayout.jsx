import React, { useState, useEffect } from 'react';
import { Flag, Navigation, Zap, Info, Shield, Layers, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { getCircuitLayout } from '../../data/circuitLayouts';
import { useTheme } from '../../context/ThemeContext';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function CircuitLayout({
  circuit,
  circuitId,
  interactive = true,
  showTurns: initialShowTurns = true,
  showDRS: initialShowDRS = true,
  showSectors: initialShowSectors = true,
  compact = false,
  className = '',
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Determine target circuit ID string
  const targetId = circuitId || circuit?.id || circuit?.circuit_id || circuit?.name || '';
  const layout = getCircuitLayout(targetId);

  const [activeTurn, setActiveTurn] = useState(null);
  const [activeSector, setActiveSector] = useState('ALL');
  const [showDRS, setShowDRS] = useState(initialShowDRS);
  const [showTurns, setShowTurns] = useState(initialShowTurns);
  const [isAnimating, setIsAnimating] = useState(true);

  // Trigger draw-in animation on layout change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, [targetId]);

  if (!layout) {
    // Graceful fallback for unlisted circuits per Data Accuracy Rules
    return (
      <Card className={`p-6 text-center space-y-4 bg-f1-card border border-f1-border ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-f1-card shadow-soft-inset border border-f1-border text-f1-muted flex items-center justify-center mx-auto">
          <Navigation className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-extrabold text-f1-dark">Circuit Layout Unavailable</h4>
          <p className="text-xs text-f1-muted mt-1 max-w-sm mx-auto">
            Detailed 2D telemetry layout map is unavailable for {circuit?.name || targetId || 'this circuit'}.
          </p>
        </div>
        {circuit && (
          <div className="pt-2 text-xs text-f1-muted flex justify-center gap-4">
            <span>Location: {circuit.locality || circuit.country || 'F1 Track'}</span>
            <span>•</span>
            <span>Coords: {circuit.lat || 'N/A'}, {circuit.long || 'N/A'}</span>
          </div>
        )}
      </Card>
    );
  }

  // Compact Thumbnail mode for cards
  if (compact) {
    return (
      <div className={`relative w-full h-36 flex items-center justify-center bg-f1-card/60 rounded-xl overflow-hidden p-2 border border-f1-border/50 ${className}`}>
        <svg viewBox={layout.viewBox} className="w-full h-full max-h-32 drop-shadow-md">
          {/* Ambient Glow */}
          <path
            d={layout.path}
            fill="none"
            stroke="#E10600"
            strokeWidth="14"
            strokeOpacity="0.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Main Track Surface */}
          <path
            d={layout.path}
            fill="none"
            stroke={isDark ? '#F9FAFB' : '#171A1F'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Start Finish Checkered Dot */}
          {layout.startFinish && (
            <circle
              cx={layout.startFinish.x}
              cy={layout.startFinish.y}
              r="6"
              fill="#E10600"
              className="animate-ping"
            />
          )}
        </svg>
      </div>
    );
  }

  return (
    <Card className={`space-y-4 bg-f1-card border border-f1-border shadow-soft-outer relative overflow-hidden ${className}`}>
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-f1-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="live">2D CIRCUIT VECTOR MAP</Badge>
            <span className="text-xs font-bold text-f1-muted">{layout.lengthKm} KM • {layout.turnsCount} TURNS</span>
          </div>
          <h2 className="text-xl font-black text-f1-dark mt-1 tracking-tight">{layout.name}</h2>
        </div>

        {interactive && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={showDRS ? 'accent' : 'ghost'}
              size="sm"
              onClick={() => setShowDRS(!showDRS)}
              title="Toggle DRS Zones"
            >
              <Zap className="w-3.5 h-3.5" /> DRS Zones
            </Button>

            <Button
              variant={showTurns ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowTurns(!showTurns)}
              title="Toggle Turn Markers"
            >
              {showTurns ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />} Turns
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveTurn(null);
                setActiveSector('ALL');
                setShowDRS(true);
                setShowTurns(true);
              }}
              title="Reset Circuit Map View"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset View
            </Button>
          </div>
        )}
      </div>

      {/* Main SVG Track Layout Display */}
      <div className="relative w-full h-[380px] md:h-[480px] bg-f1-card/80 rounded-2xl p-4 flex items-center justify-center border border-f1-border/60 shadow-soft-inset transition-all duration-300">
        <svg
          viewBox={layout.viewBox}
          className="w-full h-full max-h-[440px] transition-transform duration-500"
          style={{
            filter: isDark ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.6))' : 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))'
          }}
        >
          <defs>
            <filter id="track-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Layer 1: Ambient Outer Glow */}
          <path
            d={layout.path}
            fill="none"
            stroke="#E10600"
            strokeWidth="20"
            strokeOpacity={isDark ? '0.35' : '0.2'}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#track-glow)"
          />

          {/* Layer 2: Kerb Outer Border */}
          <path
            d={layout.path}
            fill="none"
            stroke={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Layer 3: Main Racing Track Surface */}
          <path
            d={layout.path}
            fill="none"
            stroke={isDark ? '#F9FAFB' : '#171A1F'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isAnimating ? 'transition-all duration-1000' : ''}
          />

          {/* Layer 4: DRS Zones Overlays */}
          {showDRS && layout.drsZones?.map((drs) => (
            <g key={drs.id}>
              <path
                d={drs.path}
                fill="none"
                stroke="#10B981"
                strokeWidth="8"
                strokeDasharray="8, 4"
                strokeLinecap="round"
                className="animate-pulse"
              />
            </g>
          ))}

          {/* Layer 5: Start / Finish Line Checkered Indicator */}
          {layout.startFinish && (
            <g transform={`translate(${layout.startFinish.x}, ${layout.startFinish.y})`}>
              <circle r="12" fill="#E10600" fillOpacity="0.2" className="animate-ping" />
              <circle r="7" fill="#E10600" stroke={isDark ? '#FFFFFF' : '#171A1F'} strokeWidth="2" />
              <text
                x="14"
                y="4"
                fill={isDark ? '#F9FAFB' : '#171A1F'}
                fontSize="11"
                fontWeight="900"
                className="select-none tracking-wider uppercase font-black"
              >
                START / FINISH
              </text>
            </g>
          )}

          {/* Layer 6: Interactive Turn Badges */}
          {showTurns && layout.turns?.map((turn) => {
            const isSelected = activeTurn?.number === turn.number;
            return (
              <g
                key={turn.number}
                transform={`translate(${turn.x}, ${turn.y})`}
                className="cursor-pointer group"
                onClick={() => setActiveTurn(isSelected ? null : turn)}
                onMouseEnter={() => setActiveTurn(turn)}
              >
                {/* Glow ring on hover/select */}
                <circle
                  r={isSelected ? '16' : '12'}
                  fill={isSelected ? '#E10600' : isDark ? '#161A23' : '#FFFFFF'}
                  stroke={isSelected ? '#FFFFFF' : '#E10600'}
                  strokeWidth="2"
                  className="transition-all duration-200 shadow-md"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill={isSelected ? '#FFFFFF' : isDark ? '#F9FAFB' : '#171A1F'}
                  fontSize={isSelected ? '11' : '10'}
                  fontWeight="900"
                  className="select-none font-extrabold"
                >
                  {turn.number}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Turn Hover Tooltip Card */}
        {activeTurn && (
          <div className="absolute bottom-4 left-4 bg-f1-card border border-f1-border shadow-soft-outer p-3.5 rounded-xl max-w-xs space-y-1 backdrop-blur-md z-10 transition-all duration-200">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black text-f1-red">TURN {activeTurn.number}</span>
              <span className="text-[10px] uppercase font-bold text-f1-muted">{activeTurn.type}</span>
            </div>
            <h4 className="text-sm font-extrabold text-f1-dark leading-tight">{activeTurn.name}</h4>
          </div>
        )}
      </div>

      {/* Footer Track Metadata & Specs Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
        <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border">
          <span className="text-[10px] uppercase font-bold text-f1-muted block">Circuit Length</span>
          <span className="text-base font-black text-f1-dark">{layout.lengthKm} KM</span>
        </div>
        <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border">
          <span className="text-[10px] uppercase font-bold text-f1-muted block">Turn Count</span>
          <span className="text-base font-black text-f1-red">{layout.turnsCount} Corners</span>
        </div>
        <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border">
          <span className="text-[10px] uppercase font-bold text-f1-muted block">DRS Zones</span>
          <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{layout.drsCount} Zones</span>
        </div>
        <div className="p-3 rounded-xl bg-f1-card shadow-soft-inset border border-f1-border">
          <span className="text-[10px] uppercase font-bold text-f1-muted block">Lap Record</span>
          <span className="text-xs font-extrabold text-f1-dark line-clamp-1">{layout.lapRecord || 'N/A'}</span>
        </div>
      </div>
    </Card>
  );
}
