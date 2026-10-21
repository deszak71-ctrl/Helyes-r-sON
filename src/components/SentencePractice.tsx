import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, Lightbulb, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { SENTENCE_TASKS } from '../data/sentenceTasks';
import { sound } from '../utils/sound';
import { MistakeRecord } from '../types';

interface SentencePracticeProps {
  onAddXp: (amount: number) => void;
  onIncrementStreak: () => void;
  onResetStreak: () => void;
  onRecordMistake: (mistake: MistakeRecord) => void;
}

export const SentencePractice: React.FC<SentencePracticeProps> = ({
  onAddXp,
  onIncrementStreak,
  onResetStreak,
  onRecordMistake,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [correctionInput, setCorrectionInput] = useState('');
  const [userClaimedNoError, setUserClaimedNoError] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const task = SENTENCE_TASKS[currentIndex];

  // Break sentence into clickable tokens (preserving word identity)
  const words = task.originalSentence.split(/(\s+)/);

  const cleanWord = (w: string) => w.replace(/[.,!?:;„”"']/g, '').trim();

  const handleSelectWord = (rawWord: string) => {
    if (isAnswered) return;
    const clean = cleanWord(rawWord);
    if (!clean) return;
    sound.playClick();
    setSelectedWord(clean);
    setUserClaimedNoError(false);
    setCorrectionInput('');
  };

  const handleClaimNoError = () => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedWord(null);
    setUserClaimedNoError(true);
    evaluateAnswer(true, '');
  };

  const handleSubmitCorrection = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedWord || !correctionInput.trim() || isAnswered) return;
    evaluateAnswer(false, correctionInput.trim());
  };

  const evaluateAnswer = (claimedNoErr: boolean, userInput: string) => {
    setIsAnswered(true);

    if (claimedNoErr) {
      if (!task.hasError) {
        // True positive for trap correct sentence!
        sound.playFanfare();
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        setIsCorrect(true);
        onAddXp(25);
        onIncrementStreak();
      } else {
        // False claim of no error
        sound.playWrong();
        setIsCorrect(false);
        onResetStreak();
        onRecordMistake({
          id: `sent-${task.id}-${Date.now()}`,
          type: 'Mondathiba – Nem találtad meg a hibát',
          questionTitle: task.originalSentence,
          yourAnswer: 'Azt hitted, nincs hiba a mondatban',
          correctAnswer: `${task.errorWord} ➔ ${task.correctedWord}`,
          ruleExplanation: task.ruleExplanation,
          timestamp: Date.now(),
        });
      }
      return;
    }

    // Checking word selection & correction
    const targetErrorClean = cleanWord(task.errorWord || '').toLowerCase();
    const selectedClean = cleanWord(selectedWord || '').toLowerCase();
    const correctClean = cleanWord(task.correctedWord || '').toLowerCase();
    const userClean = cleanWord(userInput).toLowerCase();

    // Check if right word was selected AND correction matches
    const isWordMatch = selectedClean === targetErrorClean || selectedClean.includes(targetErrorClean) || targetErrorClean.includes(selectedClean);
    const isCorrectionMatch = userClean === correctClean;

    if (task.hasError && isWordMatch && isCorrectionMatch) {
      sound.playCorrect();
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      setIsCorrect(true);
      onAddXp(20);
      onIncrementStreak();
    } else {
      sound.playWrong();
      setIsCorrect(false);
      onResetStreak();
      onRecordMistake({
        id: `sent-${task.id}-${Date.now()}`,
        type: 'Mondatjavítás – Helytelen javítás',
        questionTitle: task.originalSentence,
        yourAnswer: `${selectedWord}: ${userInput}`,
        correctAnswer: `${task.errorWord} ➔ ${task.correctedWord}`,
        ruleExplanation: task.ruleExplanation,
        timestamp: Date.now(),
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < SENTENCE_TASKS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
    setSelectedWord(null);
    setCorrectionInput('');
    setUserClaimedNoError(false);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Mondatjavító – Hibavadászat
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Kattints a hibás szóra és írd be a javított alakot! Ha a mondatban nincs hiba, jelöld a zöld gombbal!
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {currentIndex + 1} / {SENTENCE_TASKS.length} mondat
          </span>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Tipp</span>
          </button>
        </div>
      </div>

      {/* Main Sentence Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Kategória: {task.ruleCategory}</span>
            <span>Kattints a kiválasztott szóra!</span>
          </div>

          {/* Interactive clickable sentence display */}
          <div className="p-5 sm:p-6 rounded-xl bg-slate-950 border border-slate-800/80 leading-relaxed text-lg sm:text-xl font-medium text-slate-200">
            {words.map((chunk, i) => {
              const clean = cleanWord(chunk);
              if (!clean) {
                return <span key={i}>{chunk}</span>;
              }

              const isThisSelected = selectedWord === clean;
              const isTargetError = cleanWord(task.errorWord || '').toLowerCase() === clean.toLowerCase();

              let wordClass = 'hover:bg-indigo-600/20 hover:text-indigo-300 cursor-pointer px-1 py-0.5 rounded transition-colors';

              if (isAnswered) {
                if (isTargetError) {
                  wordClass = 'bg-rose-500/30 text-rose-300 line-through px-1 py-0.5 rounded font-bold';
                }
              } else if (isThisSelected) {
                wordClass = 'bg-indigo-600 text-white px-1.5 py-0.5 rounded font-semibold shadow-md';
              }

              return (
                <button
                  key={i}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectWord(chunk)}
                  className={`inline text-left align-baseline focus:outline-none ${wordClass}`}
                >
                  {chunk}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hint drawer */}
        {showHint && (
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>{task.hint}</p>
          </div>
        )}

        {/* Input area or action buttons */}
        {!isAnswered ? (
          <div className="space-y-4 pt-2">
            {selectedWord ? (
              <form onSubmit={handleSubmitCorrection} className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span>Kiválasztott szó:</span>
                  <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                    {selectedWord}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={correctionInput}
                    onChange={(e) => setCorrectionInput(e.target.value)}
                    placeholder="Írd be a helyes alakot (pl. szénaboglyát)..."
                    autoFocus
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!correctionInput.trim()}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    Javítás ellenőrzése
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Tipp: Kattints egy szóra a fenti mondatban, ha úgy gondolod, hogy hibásan van leírva!
              </p>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Vagy ha nincs benne hiba:</span>
              <button
                type="button"
                onClick={handleClaimNoError}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-950/40 hover:border-emerald-500/50 border border-slate-700 text-slate-200 hover:text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Nincs a mondatban hiba! (Hibátlan)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Post-answer feedback display */
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
            >
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-sm">
                  {isCorrect ? 'Kiváló válasz! (+20 XP)' : 'Nem pontos a válaszod!'}
                </p>
                <p className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Helyes mondat: </span>
                  {task.fullCorrectedSentence}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  <span className="text-amber-400 font-semibold">Szabály: </span>
                  {task.ruleExplanation}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <span>Következő mondat</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rules reminder footer */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
        <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-200">Felvételi Tanács:</span>{' '}
          A 8. osztályos felvételi mondatjavítós feladataiban szinte mindig előfordul 1 teljesen helyes, becsapós mondat (pl. a <em>kelet-európai</em> kisbetűvel és kötőjellel)! Ne javíts olyat, ami hibátlan!
        </div>
      </div>
    </div>
  );
};
