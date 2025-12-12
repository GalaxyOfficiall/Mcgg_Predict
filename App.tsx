
import React, { useState, useCallback } from 'react';
import { Predictor } from './components/Predictor';
import { ImageGenerator } from './components/ImageGenerator';
import { Chatbot } from './components/Chatbot';
import { GamepadIcon, ImageIcon, MessageSquareIcon, SparklesIcon } from './components/Icons';
import type { Tab } from './types';

const TABS: { id: Tab; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 'predictor', name: 'MCGG Predict', icon: GamepadIcon },
  { id: 'image', name: 'Image Gen', icon: ImageIcon },
  { id: 'chat', name: 'AI Chat', icon: MessageSquareIcon },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('predictor');

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'predictor':
        return <Predictor />;
      case 'image':
        return <ImageGenerator />;
      case 'chat':
        return <Chatbot />;
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-200 antialiased">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <SparklesIcon className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
              MCGG PREDICT
            </h1>
          </div>
          <p className="text-slate-400 mt-2">Zyren-Powered Gaming Assistant</p>
        </header>

        <nav className="mb-8 flex justify-center">
          <div className="bg-slate-800/50 backdrop-blur-sm p-2 rounded-xl flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900
                  ${activeTab === tab.id
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </nav>

        <main>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
