import React from 'react';
import { BookmarkCheck, Trash2, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { MistakeRecord } from '../types';

interface MistakeNotebookProps {
  mistakes: MistakeRecord[];
  onRemoveMistake: (id: string) => void;
  onClearAll: () => void;
  onBack: () => void;
}

export const MistakeNotebook: React.FC<MistakeNotebookProps> = ({
  mistakes,
  onRemoveMistake,
  onClearAll,
  onBack,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Vissza a gyakorláshoz"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📓</span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Személyes Hibafüzetem
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Itt gyűlnek azok a feladatok, amelyeket elrontottál a gyakorlás során. Ismételd át őket!
            </p>
          </div>
        </div>

        {mistakes.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:border-rose-500/40 border border-slate-700 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Összes törlése</span>
          </button>
        )}
      </div>

      {/* Mistake List */}
      {mistakes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            🎉
          </div>
          <h3 className="text-lg font-bold text-white">A hibafüzeted üres!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Minden feladatot sikeresen megoldottál, vagy már kijavítottad az összes korábbi hibádat. Folytasd a gyakorlást a felvételihez!
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            Vissza a gyakorláshoz
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Összesen {mistakes.length} feljegyzett hiba</span>
            <span>Kattints a pipára, ha már megtanultad!</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mistakes.map((m) => (
              <div
                key={m.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      {m.type}
                    </span>
                    <button
                      onClick={() => onRemoveMistake(m.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-950/60 hover:text-emerald-400 text-slate-400 transition-colors"
                      title="Megtanultam, törölhetem!"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="font-bold text-white text-sm">
                    {m.questionTitle}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Válaszod:</span>
                      <span className="text-rose-400 font-semibold">{m.yourAnswer}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Helyesen:</span>
                      <span className="text-emerald-400 font-bold">{m.correctAnswer}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
                    <span className="text-amber-400 font-semibold">Szabály: </span>
                    {m.ruleExplanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
