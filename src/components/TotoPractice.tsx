import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Keyboard } from 'lucide-react';
import { TOTO_TASKS } from '../data/totoTasks';
import { TotoChoice, MistakeRecord } from '../types';
import { sound } from '../utils/sound';

interface TotoPracticeProps {
  onAddXp: (amount: number) => void;
  onIncrementStreak: () => void;
  onResetStreak: () => void;
  onRecordMistake: (mistake: MistakeRecord) => void;
}

export const TotoPractice: React.FC<TotoPracticeProps> = ({
  onAddXp,
  onIncrementStreak,
  onResetStreak,
  onRecordMistake,
}) => {
  const [taskIndex, setTaskIndex] = useState(0);
  const [userChoice, setUserChoice] = useState<TotoChoice | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const task = TOTO_TASKS[taskIndex];

  const handleSelectChoice = (choice: TotoChoice) => {
    if (isAnswered) return;
    sound.playClick();
    setUserChoice(choice);
    setIsAnswered(true);

    const isCorrect = choice.toLowerCase() === task.correctAnswer.toLowerCase();
    if (isCorrect) {
      sound.playCorrect();
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
      onAddXp(15);
      onIncrementStreak();
    } else {
      sound.playWrong();
      onResetStreak();
      onRecordMistake({
        id: `toto-${task.id}-${Date.now()}`,
        type: 'TOTÓ 1-2-X-0 Hiba',
        questionTitle: `${task.word1} vs. ${task.word2}`,
        yourAnswer: choice.toUpperCase(),
        correctAnswer: task.correctAnswer.toUpperCase(),
        ruleExplanation: task.summaryRule,
        timestamp: Date.now(),
      });
    }
  };

  // Keyboard shortcut listener (1, 2, x, 0)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) {
        if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') {
          handleNext();
        }
        return;
      }
      const key = e.key.toLowerCase();
      if (key === '1') handleSelectChoice('1');
      else if (key === '2') handleSelectChoice('2');
      else if (key === 'x') handleSelectChoice('x');
      else if (key === '0') handleSelectChoice('0');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, taskIndex]);

  const handleNext = () => {
    if (taskIndex < TOTO_TASKS.length - 1) {
      setTaskIndex(taskIndex + 1);
    } else {
      setTaskIndex(0);
    }
    setUserChoice(null);
    setIsAnswered(false);
  };

  const choices: { id: TotoChoice; label: string; sub: string }[] = [
    { id: '1', label: '1', sub: 'Csak az 1. szó helyes' },
    { id: '2', label: '2', sub: 'Csak a 2. szó helyes' },
    { id: 'x', label: 'X', sub: 'Mindkettő helyes' },
    { id: '0', label: '0', sub: 'Egyik sem helyes' },
  ];

  const isCorrect = userChoice?.toLowerCase() === task.correctAnswer.toLowerCase();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-slate-900 border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚔️</span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Helyesírási TOTÓ (1 - 2 - X - 0)
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Döntsd el a szópárokról: <strong>1</strong> (első), <strong>2</strong> (második), <strong>X</strong> (mindkettő) vagy <strong>0</strong> (egyik sem)!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            <Keyboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Gombnyomás: 1, 2, X, 0</span>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {taskIndex + 1} / {TOTO_TASKS.length}
          </span>
        </div>
      </div>

      {/* Main Duel Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-8">
        {/* Word 1 vs Word 2 arena */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Word 1 */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <span className="absolute top-3 left-3 text-[11px] font-mono font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
              1. szó
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide mt-2">
              {task.word1}
            </span>
            {isAnswered && (
              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80 leading-relaxed text-left w-full">
                {task.explanation1}
              </p>
            )}
          </div>

          {/* Word 2 */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <span className="absolute top-3 left-3 text-[11px] font-mono font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded">
              2. szó
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide mt-2">
              {task.word2}
            </span>
            {isAnswered && (
              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80 leading-relaxed text-left w-full">
                {task.explanation2}
              </p>
            )}
          </div>
        </div>

        {/* 4 TOTÓ Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {choices.map((c) => {
            const isSelected = userChoice === c.id;
            const isActualTarget = task.correctAnswer.toLowerCase() === c.id.toLowerCase();

            let btnStyle = 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-200';

            if (isAnswered) {
              if (isActualTarget) {
                btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 shadow-emerald-500/10 shadow-lg';
              } else if (isSelected && !isActualTarget) {
                btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
              }
            }

            return (
              <button
                key={c.id}
                onClick={() => handleSelectChoice(c.id)}
                disabled={isAnswered}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-150 cursor-pointer ${btnStyle}`}
              >
                <span className="text-2xl font-black font-mono">{c.label}</span>
                <span className="text-[11px] font-medium text-center">{c.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Post-answer feedback */}
        {isAnswered && (
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  {isCorrect
                    ? `Telitalálat! (${task.correctAnswer.toUpperCase()}) +15 XP`
                    : `Helytelen tipp. A helyes válasz a(z) ${task.correctAnswer.toUpperCase()}`}
                </p>
                <p className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Szabály összefoglaló: </span>
                  {task.summaryRule}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Következő pár</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
