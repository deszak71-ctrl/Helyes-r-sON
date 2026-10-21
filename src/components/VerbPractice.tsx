import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { VERB_TASKS } from '../data/verbTasks';
import { sound } from '../utils/sound';
import { MistakeRecord } from '../types';

interface VerbPracticeProps {
  onAddXp: (amount: number) => void;
  onIncrementStreak: () => void;
  onResetStreak: () => void;
  onRecordMistake: (mistake: MistakeRecord) => void;
}

export const VerbPractice: React.FC<VerbPracticeProps> = ({
  onAddXp,
  onIncrementStreak,
  onResetStreak,
  onRecordMistake,
}) => {
  const [taskIndex, setTaskIndex] = useState(0);
  const task = VERB_TASKS[taskIndex];

  // Map of gap index to user typed text
  const [userInputs, setUserInputs] = useState<Record<number, string>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  const handleInputChange = (gapIndex: number, value: string) => {
    if (isChecked) return;
    setUserInputs({
      ...userInputs,
      [gapIndex]: value,
    });
  };

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isChecked) return;

    // Check all gaps
    let allRight = true;
    task.gaps.forEach((gap, idx) => {
      const typed = (userInputs[idx] || '').trim().toLowerCase();
      const match = gap.correctAnswers.some((ans) => ans.toLowerCase() === typed);
      if (!match) {
        allRight = false;
        // Record mistake
        onRecordMistake({
          id: `verb-${task.id}-gap${idx}-${Date.now()}`,
          type: 'Igeragozás – Helytelen alak',
          questionTitle: `${gap.promptVerb} (${gap.formRequired})`,
          yourAnswer: typed || '(üresen hagyva)',
          correctAnswer: gap.correctAnswers[0],
          ruleExplanation: gap.ruleExplanation,
          timestamp: Date.now(),
        });
      }
    });

    setIsChecked(true);
    setIsAllCorrect(allRight);

    if (allRight) {
      sound.playFanfare();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onAddXp(25);
      onIncrementStreak();
    } else {
      sound.playWrong();
      onResetStreak();
    }
  };

  const handleNext = () => {
    if (taskIndex < VERB_TASKS.length - 1) {
      setTaskIndex(taskIndex + 1);
    } else {
      setTaskIndex(0);
    }
    setUserInputs({});
    setIsChecked(false);
    setIsAllCorrect(false);
  };

  const handleRetryCurrent = () => {
    setUserInputs({});
    setIsChecked(false);
    setIsAllCorrect(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">✏️</span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Igeragozás & Alaktan – Kiegészítős Feladat
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Egészítsd ki a mondatokat a megadott ige megfelelő alakjával! Ügyelj a hasonulásokra és a helyesírásra!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {taskIndex + 1} / {VERB_TASKS.length} feladat
          </span>
        </div>
      </div>

      {/* Main Task Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="text-emerald-400 font-semibold">{task.ruleCategory}</span>
          <span>Írd be a megfelelő szóalakot a pontozott vonalakra!</span>
        </div>

        {/* Gap clues box */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Megadott igék és követelmények:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {task.gaps.map((gap, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center text-[11px]">
                  {idx + 1}
                </span>
                <span className="font-bold text-white">„{gap.promptVerb}”</span>
                <span className="text-slate-400">({gap.formRequired})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentence with interactive inline inputs */}
        <form onSubmit={handleCheck} className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800/80 text-base sm:text-lg leading-loose font-medium text-slate-200">
            {task.templateParts.map((part, idx) => {
              const gap = task.gaps[idx];
              return (
                <React.Fragment key={idx}>
                  <span>{part}</span>
                  {gap && (
                    <span className="inline-block mx-1 my-1 align-middle">
                      <input
                        type="text"
                        value={userInputs[idx] || ''}
                        onChange={(e) => handleInputChange(idx, e.target.value)}
                        disabled={isChecked}
                        placeholder={`... (${gap.promptVerb})`}
                        className={`w-36 sm:w-44 px-3 py-1.5 rounded-lg text-sm font-bold text-center border transition-all ${
                          isChecked
                            ? gap.correctAnswers.some(
                                (ans) =>
                                  ans.toLowerCase() ===
                                  (userInputs[idx] || '').trim().toLowerCase()
                              )
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                              : 'bg-rose-950/40 border-rose-500 text-rose-300'
                            : 'bg-slate-900 border-indigo-500/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400'
                        }`}
                      />
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Action buttons */}
          {!isChecked ? (
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Válasz ellenőrzése</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Feedback banner */}
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
                    {isAllCorrect ? 'Tökéletes! Hibátlan igeragozás! (+25 XP)' : 'Nem minden alak helyes!'}
                  </p>
                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-white">Helyes mondat: </span>
                    {task.fullSentence}
                  </p>

                  {/* Individual gap rules */}
                  <div className="space-y-1 pt-1 border-t border-slate-800">
                    {task.gaps.map((g, i) => (
                      <p key={i} className="text-xs text-slate-400">
                        <span className="text-amber-400 font-semibold">{g.correctAnswers[0]}: </span>
                        {g.ruleExplanation}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation controls */}
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
                  <span>Következő feladat</span>
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
