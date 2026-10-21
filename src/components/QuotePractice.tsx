import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { QUOTE_TASKS } from '../data/quoteTasks';
import { sound } from '../utils/sound';
import { MistakeRecord } from '../types';

interface QuotePracticeProps {
  onAddXp: (amount: number) => void;
  onIncrementStreak: () => void;
  onResetStreak: () => void;
  onRecordMistake: (mistake: MistakeRecord) => void;
}

export const QuotePractice: React.FC<QuotePracticeProps> = ({
  onAddXp,
  onIncrementStreak,
  onResetStreak,
  onRecordMistake,
}) => {
  const [taskIndex, setTaskIndex] = useState(0);
  const [userLetters, setUserLetters] = useState<Record<number, string>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  const task = QUOTE_TASKS[taskIndex];

  const handleInputChange = (segIndex: number, value: string) => {
    if (isChecked) return;
    setUserLetters({
      ...userLetters,
      [segIndex]: value,
    });
  };

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isChecked) return;

    let allRight = true;
    task.segments.forEach((seg, idx) => {
      const typed = (userLetters[idx] || '').trim().toLowerCase();
      const expected = seg.gapExpected.toLowerCase();
      const alternatives = (seg.acceptedAlternatives || []).map((a) => a.toLowerCase());
      const match = typed === expected || alternatives.includes(typed);

      if (!match) {
        allRight = false;
        onRecordMistake({
          id: `quote-${task.id}-seg${idx}-${Date.now()}`,
          type: 'Bölcsességek betűpótlása',
          questionTitle: `Hiányzó betű a bölcsességben (${seg.hint})`,
          yourAnswer: typed || '(üres)',
          correctAnswer: seg.gapExpected,
          ruleExplanation: seg.explanation,
          timestamp: Date.now(),
        });
      }
    });

    setIsChecked(true);
    setIsAllCorrect(allRight);

    if (allRight) {
      sound.playFanfare();
      confetti({ particleCount: 45, spread: 55, origin: { y: 0.6 } });
      onAddXp(20);
      onIncrementStreak();
    } else {
      sound.playWrong();
      onResetStreak();
    }
  };

  const handleNext = () => {
    if (taskIndex < QUOTE_TASKS.length - 1) {
      setTaskIndex(taskIndex + 1);
    } else {
      setTaskIndex(0);
    }
    setUserLetters({});
    setIsChecked(false);
    setIsAllCorrect(false);
  };

  const handleRetryCurrent = () => {
    setUserLetters({});
    setIsChecked(false);
    setIsAllCorrect(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Bölcsességek & Szólások – Betűpótló
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Egészítsd ki a magyar bölcsességeket a hiányzó betűvel vagy betűkkel!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {taskIndex + 1} / {QUOTE_TASKS.length}
          </span>
        </div>
      </div>

      {/* Main Quote Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="text-teal-400 font-semibold">{task.authorOrSource}</span>
          <span>Írd be a hiányzó betűt vagy betűkapcsolatot!</span>
        </div>

        <form onSubmit={handleCheck} className="space-y-6">
          {/* Quote display with embedded inputs */}
          <div className="p-6 sm:p-8 rounded-xl bg-slate-950 border border-slate-800/80 text-lg sm:text-xl font-medium text-slate-200 leading-loose">
            {task.segments.map((seg, idx) => {
              const typed = (userLetters[idx] || '').trim().toLowerCase();
              const expected = seg.gapExpected.toLowerCase();
              const isMatch = typed === expected;

              return (
                <React.Fragment key={idx}>
                  <span>{seg.text}</span>
                  <span className="inline-block mx-1 my-1 align-baseline">
                    <input
                      type="text"
                      maxLength={4}
                      value={userLetters[idx] || ''}
                      onChange={(e) => handleInputChange(idx, e.target.value)}
                      disabled={isChecked}
                      placeholder="..."
                      className={`w-14 sm:w-16 px-2 py-0.5 rounded text-center text-lg font-black tracking-widest border transition-all ${
                        isChecked
                          ? isMatch
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                            : 'bg-rose-950/60 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-teal-500/50 text-white focus:outline-none focus:ring-2 focus:ring-teal-500'
                      }`}
                    />
                  </span>
                </React.Fragment>
              );
            })}
            <span>{task.trailingText}</span>
          </div>

          {/* Action buttons */}
          {!isChecked ? (
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md shadow-teal-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Betűpótlás ellenőrzése</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                  isAllCorrect
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                {isAllCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 flex-1">
                  <p className="font-bold text-sm">
                    {isAllCorrect ? 'Hibátlan kiegészítés! (+20 XP)' : 'Nem minden betű helyes!'}
                  </p>
                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-white">A teljes bölcsesség: </span>
                    {task.fullText}
                  </p>
                  <div className="space-y-1 pt-1 border-t border-slate-800">
                    {task.segments.map((seg, i) => (
                      <p key={i} className="text-xs text-slate-400">
                        <span className="text-amber-400 font-bold">[{seg.gapExpected}]: </span>
                        {seg.explanation}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleRetryCurrent}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Újra kitöltöm</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <span>Következő bölcsesség</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
