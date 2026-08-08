import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar, ArrowRight, Shield, Award, Sparkles, Image as ImageIcon, Info, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import PageContainer from '../components/common/PageContainer';
import PageHeader from '../components/common/PageHeader';
import { f1HistoryEras, f1ThenVsNow } from '../data/f1History';

export default function Historical() {
  const [activeDecade, setActiveDecade] = useState('1950s');
  const [imageErrorState, setImageErrorState] = useState({});
  const sectionRefs = useRef({});

  // Setup scroll observer to update active decade tab on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const era of f1HistoryEras) {
        const el = sectionRefs.current[era.id];
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveDecade(era.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveDecade(id);
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleImageError = (imageId) => {
    setImageErrorState((prev) => ({ ...prev, [imageId]: true }));
  };

  return (
    <PageContainer>
      <PageHeader
        title="Formula 1 History & Evolution Showcase"
        subtitle="The story of the World's Greatest Motorsport — from Silverstone 1950 to the 2026 Modern Era."
      />

      {/* Hero Showcase Intro Section */}
      <div className="relative rounded-3xl bg-f1-card border border-f1-border shadow-soft-outer overflow-hidden p-6 sm:p-10 space-y-6">
        <div className="max-w-3xl space-y-4 relative z-10">
          <Badge variant="live"><Sparkles className="w-3 h-3" /> HISTORICAL ARCHIVE</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-f1-dark tracking-tight uppercase leading-none">
            FORMULA 1 <span className="text-f1-red">1950 — 2026</span>
          </h1>
          <p className="text-sm sm:text-base text-f1-muted font-medium leading-relaxed">
            The FIA Formula One World Championship officially began in 1950. Explore seven decades of legendary driver duels, radical aerodynamic breakthroughs, acoustic V10 screams, and modern hybrid telemetry engineering.
          </p>
        </div>

        {/* Hero Photo Card */}
        <div className="relative rounded-2xl overflow-hidden border border-f1-border bg-f1-inset">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Farina_Silverstone_1950.jpg"
            alt="1950 British Grand Prix at Silverstone"
            className="w-full h-[320px] sm:h-[420px] object-cover object-center filter grayscale contrast-125"
            onError={() => handleImageError('hero-1950')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-f1-card via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-f1-muted bg-f1-card/90 backdrop-blur-md p-3 rounded-xl border border-f1-border">
            <span className="font-extrabold text-f1-dark">1950 British Grand Prix — Silverstone Circuit</span>
            <span className="text-[10px] font-mono">Source: Official Archive / Wikimedia Commons</span>
          </div>
        </div>
      </div>

      {/* Sticky Decade Timeline Navigation Bar */}
      <div className="sticky top-16 z-30 py-3 bg-f1-bg/95 backdrop-blur-md border-y border-f1-border -mx-4 px-4 sm:-mx-8 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {f1HistoryEras.map((era) => (
              <button
                key={era.id}
                onClick={() => scrollToSection(era.id)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                  activeDecade === era.id
                    ? 'bg-f1-red text-white shadow-accent-glow scale-105'
                    : 'bg-f1-card text-f1-muted hover:text-f1-dark border border-f1-border'
                }`}
              >
                {era.decade}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('then-vs-now')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                activeDecade === 'then-vs-now'
                  ? 'bg-f1-red text-white shadow-accent-glow scale-105'
                  : 'bg-f1-card text-f1-muted hover:text-f1-dark border border-f1-border'
              }`}
            >
              THEN VS NOW
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Chapters */}
      <div className="space-y-16 py-6">
        {f1HistoryEras.map((era) => (
          <section
            key={era.id}
            id={era.id}
            ref={(el) => (sectionRefs.current[era.id] = el)}
            className="scroll-mt-32 space-y-6"
          >
            {/* Decade Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-f1-border pb-4 gap-2">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.25em] text-f1-red">{era.years}</span>
                <h2 className="text-3xl sm:text-4xl font-black text-f1-dark mt-1">{era.title}</h2>
                <p className="text-xs sm:text-sm text-f1-muted font-medium mt-1">{era.subtitle}</p>
              </div>
              <Badge variant="default" className="w-fit">{era.decade}</Badge>
            </div>

            {/* Narrative Description & Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 space-y-4 p-6 sm:p-8">
                <h3 className="text-lg font-extrabold text-f1-dark">Historical Context</h3>
                <p className="text-xs sm:text-sm text-f1-muted leading-relaxed">{era.summary}</p>

                <div className="pt-4 border-t border-f1-border space-y-2">
                  <h4 className="text-xs font-extrabold uppercase text-f1-red tracking-wider">Era Milestones</h4>
                  <ul className="space-y-2">
                    {era.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-f1-dark font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-f1-red mt-1.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>

              {/* Photo Gallery Grid for this Era */}
              <div className="space-y-4">
                {era.images.map((img) => (
                  <div key={img.id} className="group relative rounded-2xl overflow-hidden border border-f1-border bg-f1-inset shadow-soft-outer">
                    {!imageErrorState[img.id] ? (
                      <img
                        src={img.url}
                        alt={img.caption}
                        loading="lazy"
                        className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={() => handleImageError(img.id)}
                      />
                    ) : (
                      <div className="w-full h-48 bg-f1-inset flex flex-col items-center justify-center p-4 text-center text-f1-muted">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs font-bold">Historical photograph unavailable</span>
                      </div>
                    )}

                    <div className="p-3 bg-f1-card/95 border-t border-f1-border text-xs space-y-1">
                      <p className="font-extrabold text-f1-dark text-[11px] leading-snug">{img.caption}</p>
                      <div className="flex items-center justify-between text-[9px] text-f1-muted font-mono pt-1">
                        <span>Source: {img.source}</span>
                        <span>{img.license}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* THEN VS NOW Comparative Analysis Section */}
        <section
          id="then-vs-now"
          ref={(el) => (sectionRefs.current['then-vs-now'] = el)}
          className="scroll-mt-32 space-y-6 pt-8 border-t border-f1-border"
        >
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <Badge variant="live">EVOLUTION MATRIX</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-f1-dark">THEN VS NOW</h2>
            <p className="text-xs sm:text-sm text-f1-muted font-medium">
              A side-by-side engineering comparison between early 1950 Grand Prix cars and 2026 modern hyper-efficient F1 power units.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {f1ThenVsNow.map((item, idx) => (
              <Card key={idx} className="space-y-4 p-6 border border-f1-border shadow-soft-outer">
                <div className="flex items-center justify-between border-b border-f1-border pb-3">
                  <span className="text-xs font-extrabold text-f1-red uppercase tracking-wider">{item.category}</span>
                  <Award className="w-4 h-4 text-f1-red" />
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-f1-inset border border-f1-border">
                    <span className="text-[10px] font-black uppercase text-f1-muted block mb-1">1950 ERA</span>
                    <p className="text-xs font-bold text-f1-dark">{item.then1950}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-f1-card border border-f1-red/40 shadow-soft-inset">
                    <span className="text-[10px] font-black uppercase text-f1-red block mb-1">2026 MODERN ERA</span>
                    <p className="text-xs font-bold text-f1-dark">{item.now2026}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Transition: THE STORY CONTINUES */}
        <div className="pt-12 text-center space-y-4">
          <Card className="p-8 sm:p-12 max-w-3xl mx-auto bg-gradient-to-br from-f1-card to-f1-card border border-f1-border shadow-soft-outer space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-f1-red block">THE STORY CONTINUES</span>
            <h2 className="text-3xl sm:text-4xl font-black text-f1-dark">FORMULA 1 — 2026 SEASON</h2>
            <p className="text-xs sm:text-sm text-f1-muted font-medium max-w-lg mx-auto">
              Follow the active 2026 World Championship, standings, team telemetry specifications, and upcoming Grand Prix fixtures.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/calendar">
                <Button variant="primary">
                  2026 Race Calendar <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/standings">
                <Button variant="secondary">
                  Championship Standings
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
