/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LottoPractice } from './components/LottoPractice';
import { SentencePractice } from './components/SentencePractice';
import { VerbPractice } from './components/VerbPractice';
import { TotoPractice } from './components/TotoPractice';
import { GroupPractice } from './components/GroupPractice';
import { QuotePractice } from './components/QuotePractice';
import { MockExam } from './components/MockExam';
import { MistakeNotebook } from './components/MistakeNotebook';
import { RuleGuideModal } from './components/RuleGuideModal';
import { UserStats, PracticeMode, MistakeRecord } from './types';
import { sound } from './utils/sound';

const STORAGE_KEY = 'felveteli_helyesiras_stats_v1';

const defaultStats: UserStats = {
  xp: 120,
  streak: 3,
  bestStreak: 7,
  completedTasksCount: 12,
  correctCount: 10,
  totalAttempts: 12,
  soundEnabled: true,
  mistakes: [],
};

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultStats, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback
    }
    return defaultStats;
  });

  const [currentMode, setCurrentMode] = useState<PracticeMode>('lotto');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Sync stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore quota errors
    }
  }, [stats]);

  // Sync sound controller enabled state
  useEffect(() => {
    sound.enabled = stats.soundEnabled;
  }, [stats.soundEnabled]);

  const handleAddXp = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + amount,
      completedTasksCount: prev.completedTasksCount + 1,
      correctCount: prev.correctCount + 1,
      totalAttempts: prev.totalAttempts + 1,
    }));
  };

  const handleIncrementStreak = () => {
    setStats((prev) => {
      const newStreak = prev.streak + 1;
      return {
        ...prev,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      };
    });
  };

  const handleResetStreak = () => {
    setStats((prev) => ({
      ...prev,
      streak: 0,
      totalAttempts: prev.totalAttempts + 1,
    }));
  };

  const handleToggleSound = () => {
    setStats((prev) => {
      const nextVal = !prev.soundEnabled;
      sound.enabled = nextVal;
      if (nextVal) sound.playClick();
      return {
        ...prev,
        soundEnabled: nextVal,
      };
    });
  };

  const handleRecordMistake = (mistake: MistakeRecord) => {
    setStats((prev) => {
      // Check for duplicate by questionTitle to avoid bloating
      const exists = prev.mistakes.some((m) => m.questionTitle === mistake.questionTitle);
      if (exists) return prev;
      return {
        ...prev,
        mistakes: [mistake, ...prev.mistakes].slice(0, 30),
      };
    });
  };

  const handleRemoveMistake = (id: string) => {
    setStats((prev) => ({
      ...prev,
      mistakes: prev.mistakes.filter((m) => m.id !== id),
    }));
  };

  const handleClearAllMistakes = () => {
    setStats((prev) => ({
      ...prev,
      mistakes: [],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Fixed Header with XP, Streaks, Nav & Actions */}
      <Header
        stats={stats}
        currentMode={currentMode}
        onSelectMode={(mode) => {
          sound.playClick();
          setCurrentMode(mode);
        }}
        onToggleSound={handleToggleSound}
        onOpenGuide={() => {
          sound.playClick();
          setIsGuideOpen(true);
        }}
        onOpenMistakes={() => {
          sound.playClick();
          setCurrentMode('mistakes');
        }}
      />

      {/* Main Interactive Workspace */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentMode === 'lotto' && (
          <LottoPractice
            onAddXp={handleAddXp}
            onIncrementStreak={handleIncrementStreak}
            onResetStreak={handleResetStreak}
            onRecordMistake={handleRecordMistake}
          />
        )}

        {currentMode === 'sentence' && (
          <SentencePractice
            onAddXp={handleAddXp}
            onIncrementStreak={handleIncrementStreak}
            onResetStreak={handleResetStreak}
            onRecordMistake={handleRecordMistake}
          />
        )}

        {currentMode === 'verb' && (
          <VerbPractice
            onAddXp={handleAddXp}
            onIncrementStreak={handleIncrementStreak}
            onResetStreak={handleResetStreak}
            onRecordMistake={handleRecordMistake}
          />
        )}

        {currentMode === 'toto' && (
          <TotoPractice
            onAddXp={handleAddXp}
            onIncrementStreak={handleIncrementStreak}
            onResetStreak={handleResetStreak}
            onRecordMistake={handleRecordMistake}
          />
        )}

        {currentMode === 'group' && (
          <GroupPractice
            onAddXp={handleAddXp}
            onIncrementStreak={handleIncrementStreak}
            onResetStreak={handleResetStreak}
            onRecordMistake={handleRecordMistake}
          />
        )}

        {currentMode === 'quote' && (
          <QuotePractice
            onAddXp={handleAddXp}
            onIncrementStreak={handleIncrementStreak}
            onResetStreak={handleResetStreak}
            onRecordMistake={handleRecordMistake}
          />
        )}

        {currentMode === 'mock-exam' && (
          <MockExam
            onAddXp={handleAddXp}
            onRecordMistake={handleRecordMistake}
          />
        )}

        {currentMode === 'mistakes' && (
          <MistakeNotebook
            mistakes={stats.mistakes}
            onRemoveMistake={handleRemoveMistake}
            onClearAll={handleClearAllMistakes}
            onBack={() => setCurrentMode('lotto')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Felvételi Helyesírás Mester · Készült a 8. osztályos középiskolai felvételire készülőknek
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>AkH. 12. kiadás alapján</span>
            <span>·</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Helyesírási Kisokos megnyitása
            </button>
          </div>
        </div>
      </footer>

      {/* Cheat Sheet & Grammar Rules Modal */}
      <RuleGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
