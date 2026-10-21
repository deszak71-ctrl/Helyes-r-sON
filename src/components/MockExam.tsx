import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Timer, Award, CheckCircle2, AlertTriangle, RotateCcw, ArrowRight } from 'lucide-react';
import { LOTTO_SETS } from '../data/lottoTasks';
import { SENTENCE_TASKS } from '../data/sentenceTasks';
import { VERB_TASKS } from '../data/verbTasks';
import { TOTO_TASKS } from '../data/totoTasks';
import { GROUP_TASKS } from '../data/groupTasks';
import { QUOTE_TASKS } from '../data/quoteTasks';
import { sound } from '../utils/sound';
import { MistakeRecord } from '../types';

interface MockExamProps {
  onAddXp: (amount: number) => void;
  onRecordMistake: (mistake: MistakeRecord) => void;
}

export const MockExam: React.FC<MockExamProps> = ({ onAddXp, onRecordMistake }) => {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600s)
  const [isPaused, setIsPaused] = useState(false);

  // User responses
  const [lottoAnswers, setLottoAnswers] = useState<number[]>([]);
  const [sentence1Input, setSentence1Input] = useState('');
  const [sentence2ClaimNoError, setSentence2ClaimNoError] = useState(false);
  const [verb1Input, setVerb1Input] = useState('');
  const [verb2Input, setVerb2Input] = useState('');
  const [toto1Choice, setToto1Choice] = useState('');
  const [toto2Choice, setToto2Choice] = useState('');
  const [groupAnswers, setGroupAnswers] = useState<number[]>([]);
  const [quote1Input, setQuote1Input] = useState('');
  const [quote2Input, setQuote2Input] = useState('');

  // Sample static questions for standard exam
  const lottoSet = LOTTO_SETS[0];
  const sent1 = SENTENCE_TASKS[0]; // Marci a vonat ablakából...
  const sent2 = SENTENCE_TASKS[2]; // Látogassunk el a kelet-európai... (hibátlan trap!)
  const verb1 = VERB_TASKS[0]; // Fradi meccs
  const verb2 = VERB_TASKS[1]; // Panni hallgass, ne mondd el
  const toto1 = TOTO_TASKS[0]; // játszunk vs játszuk
  const toto2 = TOTO_TASKS[2]; // cm.-rel vs %-al
  const group1 = GROUP_TASKS[0]; // sakk-kal gally-jal Papp-pal
  const quote1 = QUOTE_TASKS[0]; // mind[i]g
  const quote2 = QUOTE_TASKS[4]; // ját[ssz]

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && !examFinished && !isPaused && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, examFinished, isPaused, timeLeft]);

  const handleStartExam = () => {
    sound.playClick();
    setExamStarted(true);
    setExamFinished(false);
    setTimeLeft(600);
    setIsPaused(false);
    setLottoAnswers([]);
    setSentence1Input('');
    setSentence2ClaimNoError(false);
    setVerb1Input('');
    setVerb2Input('');
    setToto1Choice('');
    setToto2Choice('');
    setGroupAnswers([]);
    setQuote1Input('');
    setQuote2Input('');
  };

  const handleFinishExam = () => {
    setExamFinished(true);
    sound.playFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    onAddXp(120);
  };

  // Score computation (max 50 points, just like real Hungarian central exam)
  const computeScores = () => {
    let score = 0;

    // 1. Lotto (5 points: 1 pt per correct error spotted)
    const lottoErrors = lottoSet.items.filter((i) => i.isError).map((i) => i.id);
    const lottoHits = lottoAnswers.filter((id) => lottoErrors.includes(id)).length;
    const lottoPoints = lottoHits; // max 5
    score += lottoPoints;

    // 2. Sentence 1 (5 points)
    const s1Right = sentence1Input.trim().toLowerCase().includes('szénaboglyát');
    const s1Points = s1Right ? 5 : 0;
    score += s1Points;

    // 3. Sentence 2 (5 points: trap sentence is correct!)
    const s2Points = sentence2ClaimNoError ? 5 : 0;
    score += s2Points;

    // 4. Verb 1 (5 points)
    const v1Right = verb1Input.trim().toLowerCase() === 'játssza' || verb1Input.trim().toLowerCase() === 'játszik';
    const v1Points = v1Right ? 5 : 0;
    score += v1Points;

    // 5. Verb 2 (5 points)
    const v2Right = verb2Input.trim().toLowerCase() === 'hallgass' || verb2Input.trim().toLowerCase() === 'mondd';
    const v2Points = v2Right ? 5 : 0;
    score += v2Points;

    // 6. Toto 1 (5 points)
    const t1Points = toto1Choice === '1' ? 5 : 0;
    score += t1Points;

    // 7. Toto 2 (5 points)
    const t2Points = toto2Choice === '0' ? 5 : 0;
    score += t2Points;

    // 8. Group 1 (5 points: all 3 were correct!)
    const gPoints = groupAnswers.length === 3 ? 5 : groupAnswers.length * 1.5;
    score += Math.round(gPoints);

    // 9. Quote 1 (5 points)
    const q1Right = quote1Input.trim().toLowerCase() === 'i';
    const q1Points = q1Right ? 5 : 0;
    score += q1Points;

    // 10. Quote 2 (5 points)
    const q2Right = quote2Input.trim().toLowerCase() === 'ssz';
    const q2Points = q2Right ? 5 : 0;
    score += q2Points;

    return {
      total: Math.min(score, 50),
      lottoPoints,
      s1Points,
      s2Points,
      v1Points,
      v2Points,
      t1Points,
      t2Points,
      gPoints: Math.round(gPoints),
      q1Points,
      q2Points,
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const scores = computeScores();
  const percentage = Math.round((scores.total / 50) * 100);

  let gradeBadge = '90%+ – Elit gimnáziumi felvételi szint 🌟';
  if (percentage < 60) gradeBadge = '60% alatt – Rendszeres felvételi tréning javasolt 💡';
  else if (percentage < 80) gradeBadge = '60-80% – Jó alapok, figyelj a csapdákra! 👍';

  return (
    <div className="space-y-6">
      {/* Intro or Start banner */}
      {!examStarted ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center mx-auto text-3xl shadow-lg">
            ⏱️
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              10 Perces Központi Felvételi Szimuláció
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Tedd próbára magad időre! 10 vegyes feladat a leggyakoribb felvételi feladattípusokból: lottószelvény, mondatjavítás, igeragozás, TOTÓ és bölcsességek.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto text-xs text-slate-300 font-medium">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-indigo-400 font-bold text-base">10 perc</span>
              Időkeret
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-emerald-400 font-bold text-base">50 pont</span>
              Max. pontszám
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-amber-400 font-bold text-base">10 blokk</span>
              Feladattípus
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-cyan-400 font-bold text-base">+120 XP</span>
              Jutalom
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-indigo-600/30 transition-all scale-102 cursor-pointer"
          >
            Próbavizsga indítása most! 🚀
          </button>
        </div>
      ) : !examFinished ? (
        /* Active Exam View */
        <div className="space-y-6">
          {/* Sticky Timer Bar */}
          <div className="sticky top-24 z-30 p-3.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2.5">
              <Timer className={`w-5 h-5 ${timeLeft < 120 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`} />
              <span className="font-mono text-lg font-bold text-white tracking-wider">
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {isPaused ? 'Folytatás' : 'Szünet'}
              </button>
              <button
                onClick={handleFinishExam}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-600/30"
              >
                Dolgozat beadása
              </button>
            </div>
          </div>

          {/* Exam Questions Container */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-8">
            {/* Task 1: Lotto */}
            <div className="space-y-3 pb-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-indigo-400">1. Feladat · 5/15 Felvételi Lottó (5 pont)</span>
                <span className="text-xs text-slate-400">{lottoAnswers.length}/5 bejelölve</span>
              </div>
              <p className="text-xs text-slate-300">
                Jelöld be a lottószelvényen az 5 hibás szót!
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {lottoSet.items.map((item) => {
                  const sel = lottoAnswers.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        if (sel) setLottoAnswers(lottoAnswers.filter((id) => id !== item.id));
                        else if (lottoAnswers.length < 5) setLottoAnswers([...lottoAnswers, item.id]);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        sel
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span>{item.id}. {item.word}</span>
                      {sel && <span className="text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Task 2: Sentence 1 */}
            <div className="space-y-3 pb-6 border-b border-slate-800">
              <span className="font-bold text-sm text-indigo-400">2. Feladat · Mondathiba javítása (5 pont)</span>
              <p className="text-sm font-medium text-slate-200 p-3 rounded-xl bg-slate-950 border border-slate-800">
                „{sent1.originalSentence}”
              </p>
              <input
                type="text"
                value={sentence1Input}
                onChange={(e) => setSentence1Input(e.target.value)}
                placeholder="Írd be a javított szót (pl. szénaboglyát)..."
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            {/* Task 3: Sentence 2 (Trap sentence) */}
            <div className="space-y-3 pb-6 border-b border-slate-800">
              <span className="font-bold text-sm text-indigo-400">3. Feladat · Mondathiba keresése (5 pont)</span>
              <p className="text-sm font-medium text-slate-200 p-3 rounded-xl bg-slate-950 border border-slate-800">
                „{sent2.originalSentence}”
              </p>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sentence2ClaimNoError}
                  onChange={(e) => setSentence2ClaimNoError(e.target.checked)}
                  className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>A mondatban NINCS hiba, a helyesírása tökéletes!</span>
              </label>
            </div>

            {/* Task 4 & 5: Verbs */}
            <div className="space-y-3 pb-6 border-b border-slate-800">
              <span className="font-bold text-sm text-indigo-400">4-5. Feladat · Igeragozás (10 pont)</span>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="text-slate-300">A Fradi szombaton [.....] a következő meccsét. (játszik – kijelentő, jelen)</p>
                  <input
                    type="text"
                    value={verb1Input}
                    onChange={(e) => setVerb1Input(e.target.value)}
                    placeholder="Írd be az igealakot..."
                    className="w-48 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="text-slate-300">Panni, kérlek, [.....] erről az ügyről! (hallgat – felszólító E/2)</p>
                  <input
                    type="text"
                    value={verb2Input}
                    onChange={(e) => setVerb2Input(e.target.value)}
                    placeholder="Írd be az igealakot..."
                    className="w-48 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Task 6 & 7: Toto */}
            <div className="space-y-3 pb-6 border-b border-slate-800">
              <span className="font-bold text-sm text-indigo-400">6-7. Feladat · Helyesírási TOTÓ (10 pont)</span>
              <p className="text-xs text-slate-400">1: első, 2: második, X: mindkettő, 0: egyik sem</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-200">játszunk vs. játszuk</span>
                  <div className="flex gap-2">
                    {['1', '2', 'X', '0'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setToto1Choice(opt)}
                        className={`flex-1 py-1 rounded font-bold ${
                          toto1Choice === opt ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-200">cm.-rel vs. %-al</span>
                  <div className="flex gap-2">
                    {['1', '2', 'X', '0'].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setToto2Choice(opt)}
                        className={`flex-1 py-1 rounded font-bold ${
                          toto2Choice === opt ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Task 8: Group selection */}
            <div className="space-y-3 pb-6 border-b border-slate-800">
              <span className="font-bold text-sm text-indigo-400">8. Feladat · Csoportos szóválasztás (5 pont)</span>
              <p className="text-xs text-slate-400">Jelöld be a helyes szavakat! (Több is lehet!)</p>
              <div className="grid grid-cols-3 gap-2">
                {group1.options.map((opt, idx) => {
                  const sel = groupAnswers.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        if (sel) setGroupAnswers(groupAnswers.filter((i) => i !== idx));
                        else setGroupAnswers([...groupAnswers, idx]);
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center ${
                        sel ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Task 9 & 10: Quotes */}
            <div className="space-y-3">
              <span className="font-bold text-sm text-indigo-400">9-10. Feladat · Betűpótlás bölcsességekben (10 pont)</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="text-slate-300">„A zsarnoksággal mind[.....]g együtt jár e kór...”</p>
                  <input
                    type="text"
                    value={quote1Input}
                    onChange={(e) => setQuote1Input(e.target.value)}
                    placeholder="Hiányzó betű..."
                    className="w-24 px-3 py-1 rounded bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <p className="text-slate-300">„Ne ját[.....] a tűzzel!”</p>
                  <input
                    type="text"
                    value={quote2Input}
                    onChange={(e) => setQuote2Input(e.target.value)}
                    placeholder="Hiányzó betűk..."
                    className="w-24 px-3 py-1 rounded bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleFinishExam}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                Teszt befejezése és értékelése! 🏁
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-slate-950 border border-indigo-500/30">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl font-black">
                {scores.total}
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Összeredmény (Max. 50 pont)
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {percentage}% Eredmény
                </h3>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5">
                  {gradeBadge}
                </p>
              </div>
            </div>

            <button
              onClick={handleStartExam}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Új próbavizsga</span>
            </button>
          </div>

          {/* Breakdown summary */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Részletes feladatértékelés:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>1. Lottó 5/15:</span>
                <span className="font-bold text-indigo-400">{scores.lottoPoints} / 5 pont</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>2. Mondat (szénaboglyát):</span>
                <span className="font-bold text-indigo-400">{scores.s1Points} / 5 pont</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>3. Mondat (kelet-európai - helyes):</span>
                <span className="font-bold text-indigo-400">{scores.s2Points} / 5 pont</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>4. Igeragozás (játssza):</span>
                <span className="font-bold text-indigo-400">{scores.v1Points} / 5 pont</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>5. Igeragozás (hallgass):</span>
                <span className="font-bold text-indigo-400">{scores.v2Points} / 5 pont</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>6. TOTÓ (játszunk/játszuk ➔ 1):</span>
                <span className="font-bold text-indigo-400">{scores.t1Points} / 5 pont</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>7. TOTÓ (cm.-rel/%-al ➔ 0):</span>
                <span className="font-bold text-indigo-400">{scores.t2Points} / 5 pont</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>8. Csoportos szóválasztás:</span>
                <span className="font-bold text-indigo-400">{scores.gPoints} / 5 pont</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>9. Bölcsesség (mindig ➔ i):</span>
                <span className="font-bold text-indigo-400">{scores.q1Points} / 5 pont</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span>10. Bölcsesség (játssz ➔ ssz):</span>
                <span className="font-bold text-indigo-400">{scores.q2Points} / 5 pont</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
