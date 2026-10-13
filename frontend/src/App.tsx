import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ResultsPage } from './pages/ResultsPage';
import { HistoryModal } from './components/HistoryModal';
import { PrivacyNoticeModal } from './components/PrivacyNoticeModal';
import { FullAnalysisResponse, AnalysisHistoryItem, AIStatusResponse } from './types';
import { apiService } from './services/api';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'analyze' | 'results'>('landing');
  const [currentAnalysis, setCurrentAnalysis] = useState<FullAnalysisResponse | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);

  // Initial setup: fetch AI status and saved history
  useEffect(() => {
    fetchAiStatus();
    loadHistory();
  }, []);

  const fetchAiStatus = async () => {
    try {
      const status = await apiService.checkAiStatus();
      setAiStatus(status);
    } catch {
      // Backend may be starting up
    }
  };

  const loadHistory = async () => {
    try {
      const items = await apiService.getHistory();
      setHistory(items);
    } catch {
      // Ignore if database empty or offline
    }
  };

  const handleAnalysisSuccess = (analysis: FullAnalysisResponse) => {
    setCurrentAnalysis(analysis);
    setCurrentView('results');
    loadHistory();
  };

  const handleSelectAnalysis = async (id: string) => {
    try {
      const analysis = await apiService.getAnalysis(id);
      setCurrentAnalysis(analysis);
      setCurrentView('results');
    } catch (err) {
      console.error('Failed to load past analysis:', err);
    }
  };

  const handleDeleteAnalysis = async (id: string) => {
    try {
      await apiService.deleteAnalysis(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
        setCurrentView('landing');
      }
    } catch (err) {
      console.error('Failed to delete analysis:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        aiStatus={aiStatus}
      />

      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage onStartAnalysis={() => setCurrentView('analyze')} />
        )}

        {currentView === 'analyze' && (
          <AnalysisPage onAnalysisSuccess={handleAnalysisSuccess} />
        )}

        {currentView === 'results' && currentAnalysis && (
          <ResultsPage
            analysis={currentAnalysis}
            onReset={() => setCurrentView('analyze')}
          />
        )}
      </main>

      <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectAnalysis={handleSelectAnalysis}
        onDeleteAnalysis={handleDeleteAnalysis}
      />

      <PrivacyNoticeModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
};

export default App;
