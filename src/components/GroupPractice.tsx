import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { GROUP_TASKS } from '../data/groupTasks';
import { sound } from '../utils/sound';
import { MistakeRecord } from '../types';

interface GroupPracticeProps {
  onAddXp: (amount: number) => void;
  onIncrementStreak: () => void;
  onResetStreak: () => void;
  onRecordMistake: (mistake: MistakeRecord) => void;
}

export const GroupPractice: React.FC<GroupPracticeProps> = ({
  onAddXp,
  onIncrementStreak,
  onResetStreak,
  onRecordMistake,
}) => {
  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isPerfect, setIsPerfect] = useState(false);

  const task = GROUP_TASKS[taskIndex];

  const handleToggle = (idx: number) => {
    if (isChecked) return;
    sound.playClick();
    if (selectedIndices.includes(idx)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== idx));
    } else {
      setSelectedIndices([...selectedIndices, idx]);
    }
  };

  const handleCheck = () => {
    if (isChecked) return;
    setIsChecked(true);

    // Check perfection: all correct ones selected AND no incorrect ones selected
    let perfect = true;
    task.options.forEach((opt, idx) => {
      const isSelected = selectedIndices.includes(idx);
      if (opt.isCorrect && !isSelected) {
        perfect = false;
        onRecordMistake({
          id: `group-${task.id}-opt${idx}-${Date.now()}`,
          type: 'Csoportos szóválasztás – Elmulasztott helyes szó',
          questionTitle: `Helyes szó volt: ${opt.text}`,
          yourAnswer: 'Nem jelölted be',
          correctAnswer: opt.text,
          ruleExplanation: opt.explanation,
          timestamp: Date.now(),
        });
      } else if (!opt.isCorrect && isSelected) {
        perfect = false;
        onRecordMistake({
          id: `group-${task.id}-opt${idx}-${Date.now()}`,
          type: 'Csoportos szóválasztás – Hibás szót jelöltél',
          questionTitle: `Hibás szó a csoportban: ${opt.text}`,
          yourAnswer: 'Helyesnek jelölted',
          correctAnswer: 'Nem szabadott volna megjelölni',
          ruleExplanation: opt.explanation,
          timestamp: Date.now(),
        });
      }
    });

    setIsPerfect(perfect);

    if (perfect) {
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
    if (taskIndex < GROUP_TASKS.length - 1) {
      setTaskIndex(taskIndex + 1);
    } else {
      setTaskIndex(0);
    }
    setSelectedIndices([]);
    setIsChecked(false);
    setIsPerfect(false);
  };

  const handleReset = () => {
    setSelectedIndices([]);
    setIsChecked(false);
    setIsPerfect(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔘</span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Csoportos Szóválasztó
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Döntsd el, mely szó vagy szavak helyesek! <strong>Vigyázz:</strong> egy sorban több helyes szó is lehet (akár mindhárom)!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {taskIndex + 1} / {GROUP_TASKS.length}
          </span>
        </div>
      </div>

      {/* Main Group Task Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-purple-400 font-semibold">{task.category}</span>
            <span>Jelöld be a helyes szavakat!</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">{task.ruleTip}</p>
        </div>

        {/* 3 Word Options in the group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {task.options.map((opt, idx) => {
            const isSelected = selectedIndices.includes(idx);
            let cardStyle = 'bg-slate-950 hover:bg-slate-800/80 border-slate-800';
            let badge = null;

            if (isChecked) {
              if (isSelected && opt.isCorrect) {
                cardStyle = 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30';
                badge = (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Helyes volt!
                  </span>
                );
              } else if (isSelected && !opt.isCorrect) {
                cardStyle = 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30';
                badge = (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400">
                    <XCircle className="w-3.5 h-3.5" /> Hibás szó!
                  </span>
                );
              } else if (!isSelected && opt.isCorrect) {
                cardStyle = 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30';
                badge = (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5" /> Ezt is jelölni kellett!
                  </span>
                );
              } else {
                cardStyle = 'bg-slate-950/50 border-slate-900 opacity-60';
              }
            } else if (isSelected) {
              cardStyle = 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30';
            }

            return (
              <div
                key={idx}
                onClick={() => handleToggle(idx)}
                className={`p-5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between ${cardStyle}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {String.fromCharCode(97 + idx)})
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border text-xs font-bold transition-colors ${
                        isSelected
                          ? 'bg-purple-600 border-purple-400 text-white'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && '✓'}
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <span className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {opt.text}
                    </span>
                  </div>
                </div>

                {isChecked && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
                    <div>{badge}</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {opt.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        {!isChecked ? (
          <div className="flex justify-end pt-2">
            <button
              onClick={handleCheck}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Választásom ellenőrzése</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isPerfect
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              {isPerfect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  {isPerfect ? 'Telitalálat a csoportban! (+20 XP)' : 'Nem pontos a kijelölésed!'}
                </p>
                <p className="text-xs text-slate-300">
                  Nézd át az egyes szavak kártyáján megjelenő szabálymagyarázatokat!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Újra ezzel a csoporttal</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Következő csoport</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
