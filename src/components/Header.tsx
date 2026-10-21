import React from 'react';
import { Volume2, VolumeX, Flame, Award, BookOpen, BookmarkCheck } from 'lucide-react';
import { UserStats, PracticeMode } from '../types';

interface HeaderProps {
  stats: UserStats;
  currentMode: PracticeMode;
  onSelectMode: (mode: PracticeMode) => void;
  onToggleSound: () => void;
  onOpenGuide: () => void;
  onOpenMistakes: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentMode,
  onSelectMode,
  onToggleSound,
  onOpenGuide,
  onOpenMistakes,
}) => {
  // Level calculation: 100 XP per level
  const level = Math.floor(stats.xp / 100) + 1;
  const levelTitles = [
    'Helyesírási Újonc',
    'Nyelvtan Nyomozó',
    'Helyesírási Bajnok',
    'Grammatika Nagymester',
    'Felvételi Ász',
    'Magyar Nyelv Professzor',
  ];
  const title = levelTitles[Math.min(level - 1, levelTitles.length - 1)];
  const progressToNext = stats.xp % 100;

  const navItems: { mode: PracticeMode; label: string; icon: string }[] = [
    { mode: 'lotto', label: '5/15 Lottó', icon: '🎫' },
    { mode: 'sentence', label: 'Mondatjavító', icon: '🔍' },
    { mode: 'verb', label: 'Igeragozás', icon: '✏️' },
    { mode: 'toto', label: 'TOTÓ 1-2-X-0', icon: '⚔️' },
    { mode: 'group', label: 'Szóválasztó', icon: '🔘' },
    { mode: 'quote', label: 'Bölcsességek', icon: '📜' },
    { mode: 'mock-exam', label: 'Próbavizsga', icon: '⏱️' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        {/* Top bar: Brand & Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-xl">
              8
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  FELVÉTELI HELYESÍRÁS
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  8. osztály
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Központi felvételi feladattípusok & azonnali szabálymagyarázatok
              </p>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-sm">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{stats.streak}</span>
              <span className="hidden sm:inline font-medium text-slate-400">széria</span>
            </div>

            {/* XP & Level */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-indigo-500/30 text-xs font-semibold">
              <Award className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-indigo-300 font-bold">{stats.xp} XP</span>
                <span className="text-slate-500 ml-1.5 hidden md:inline">({title})</span>
              </div>
              <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressToNext}%` }}
                />
              </div>
            </div>

            {/* Mistake Notebook Button */}
            <button
              onClick={onOpenMistakes}
              className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white transition-colors"
              title="Hibafüzet – Gyakorold újra az elrontott szavakat!"
            >
              <BookmarkCheck className="w-4 h-4 text-rose-400" />
              {stats.mistakes.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {stats.mistakes.length}
                </span>
              )}
            </button>

            {/* Rules Cheat Sheet Button */}
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-medium transition-colors"
              title="Helyesírási Kisokos & Szabályok"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Kisokos</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
              title={stats.soundEnabled ? 'Hanghatások kikapcsolása' : 'Hanghatások bekapcsolása'}
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>

        {/* Mode Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 pt-2.5 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const isActive = currentMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => onSelectMode(item.mode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
