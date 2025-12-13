import React, { useState } from 'react';
import Predictor from './components/Predictor';
import ZyrenChat from './components/ZyrenChat';
import ImageGenerator from './components/ImageGenerator';
import { Gamepad2, MessageSquareMore, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'predictor' | 'chat' | 'image'>('predictor');

  const animationVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-white">
       {/* Animated Colorful Background */}
       <div className="fixed inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 animate-gradient-xy mix-blend-screen"></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-10 left-10 w-60 h-60 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-0 right-10 w-60 h-60 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-20 left-20 w-60 h-60 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
       </div>

      {/* Main Content Area */}
      <main className="relative z-10 container mx-auto px-2 py-4 h-screen flex flex-col">
        {/* Content Switcher */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
          <AnimatePresence mode="wait">
            {activeTab === 'predictor' && (
              <motion.div key="predictor" variants={animationVariants} initial="initial" animate="animate" exit="exit" transition={{duration: 0.25}}>
                <Predictor />
              </motion.div>
            )}
            {activeTab === 'chat' && (
              <motion.div key="chat" variants={animationVariants} initial="initial" animate="animate" exit="exit" transition={{duration: 0.25}}>
                <ZyrenChat />
              </motion.div>
            )}
            {activeTab === 'image' && (
              <motion.div key="image" variants={animationVariants} initial="initial" animate="animate" exit="exit" transition={{duration: 0.25}}>
                <ImageGenerator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
          <div className="bg-glass-dark/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] gap-1">
            <button
              onClick={() => setActiveTab('predictor')}
              className={`relative px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-semibold ${activeTab === 'predictor' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              {activeTab === 'predictor' && (
                <motion.div layoutId="tab-bg" className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/40" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Gamepad2 size={16} /> Prediksi
              </span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`relative px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-semibold ${activeTab === 'chat' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              {activeTab === 'chat' && (
                <motion.div layoutId="tab-bg" className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-xl shadow-lg shadow-pink-500/40" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <MessageSquareMore size={16} /> Chat AI
              </span>
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`relative px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 text-xs font-semibold ${activeTab === 'image' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              {activeTab === 'image' && (
                <motion.div layoutId="tab-bg" className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-lg shadow-orange-500/40" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <ImageIcon size={16} /> Image AI
              </span>
            </button>
          </div>
        </div>
      </main>

    </div>
  );
};

export default App;
