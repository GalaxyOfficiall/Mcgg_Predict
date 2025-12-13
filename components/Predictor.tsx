import React, { useState } from 'react';
import { PlayerMap, OpponentMap, PredictionTable } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Swords, Sparkles, Trophy } from 'lucide-react';

const INITIAL_PLAYERS: PlayerMap = {
  P1: '', P2: '', P3: '', P4: '', P5: '', P6: '', P7: '', P8: ''
};

const INITIAL_OPPONENTS: OpponentMap = {
  I1: '', I2: '', I3: '', II1: '', II2: ''
};

const Predictor: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [players, setPlayers] = useState<PlayerMap>(INITIAL_PLAYERS);
  const [opponents, setOpponents] = useState<OpponentMap>(INITIAL_OPPONENTS);
  const [prediction, setPrediction] = useState<PredictionTable[] | null>(null);

  // Helper to get available options for dropdowns (excluding P1 and already selected)
  const getOptions = (currentKey: keyof OpponentMap) => {
    const allOpponents = Object.keys(players)
      .filter(k => k !== 'P1')
      .map(k => players[k]);
    
    const selectedValues = Object.entries(opponents)
      .filter(([k, v]) => k !== currentKey && v !== '')
      .map(([_, v]) => v);

    return allOpponents.filter(name => !selectedValues.includes(name));
  };

  const handlePlayerChange = (key: string, value: string) => {
    setPlayers(prev => ({ ...prev, [key]: value }));
  };

  const handleOpponentChange = (key: keyof OpponentMap, value: string) => {
    setOpponents(prev => ({ ...prev, [key]: value }));
  };

  const goToStep2 = () => {
    const empty = Object.values(players).some((v) => !(v as string).trim());
    if (empty) {
      alert("⚠️ Semua nama player harus diisi!");
      return;
    }
    setStep(2);
  };

  const resetStep1 = () => {
    if (window.confirm("Reset semua nama?")) {
      setPlayers(INITIAL_PLAYERS);
      setOpponents(INITIAL_OPPONENTS);
      setStep(1);
      setPrediction(null);
    }
  };

  const resetStep2 = () => {
    if (window.confirm("Reset pilihan lawan?")) {
      setOpponents(INITIAL_OPPONENTS);
      setPrediction(null);
    }
  };

  const toRoman = (num: number) => {
    const romans = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
    return romans[num] || num;
  };

  const generateData = () => {
    const empty = Object.values(opponents).some(v => !v);
    if (empty) {
      alert("⚠️ Lengkapi semua dropdown lawan!");
      return;
    }

    const mapping = {
      P2: opponents.I1,
      P3: opponents.I2,
      P4: opponents.I3,
      P5: opponents.II1,
      P6: opponents.II2
    };

    const used = Object.values(mapping);
    const baseOptions = Object.keys(players).filter(k => k !== 'P1').map(k => players[k]);
    const remaining = baseOptions.filter(n => !used.includes(n));
    const p7 = remaining[0] || "???";
    const p8 = remaining[1] || "???";

    const createTable = (mode: number): PredictionTable => {
      const cycleMode1 = [mapping.P2, mapping.P3, mapping.P4, mapping.P5, mapping.P6, p7, p8];
      const cycleMode2 = [mapping.P2, mapping.P3, mapping.P4, mapping.P5, mapping.P6, p8, p7];
      const cycle = mode === 1 ? cycleMode1 : cycleMode2;

      let cycleIndex = 0;
      const roundsData = [];

      for (let ronde = 1; ronde <= 4; ronde++) {
        const matches = [];
        const stepCount = (ronde === 1) ? 4 : 6;
        for (let s = 1; s <= stepCount; s++) {
          let lawan = "";
          if ((ronde === 1 && s === 1) || (ronde > 1 && s === 3)) {
            lawan = "Creep";
          } else {
            lawan = cycle[cycleIndex % cycle.length];
            cycleIndex++;
          }
          matches.push({ round: toRoman(ronde), step: s, opponent: lawan });
        }
        roundsData.push({ roundName: `Ronde ${toRoman(ronde)}`, matches });
      }

      return {
        mode,
        residualP7: p7,
        residualP8: p8,
        rounds: roundsData
      };
    };

    setPrediction([createTable(1), createTable(2)]);
  };

  return (
    <div className="pb-10 max-w-lg mx-auto">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-6"
      >
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          PREDIKTOR MCGG
        </h1>
        <p className="text-[10px] text-blue-200 mt-1 font-light tracking-widest uppercase">By Zyren</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-glass-dark/40 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Setup Players
              </h2>
              <div className="bg-white/10 px-3 py-1 rounded-full text-xs text-white/70">Step 1/2</div>
            </div>

            <div className="space-y-3">
              <div className="relative group">
                <label className="text-xs text-cyan-300 ml-1 font-bold">P1 (Kamu)</label>
                <input
                  value={players.P1}
                  onChange={(e) => handlePlayerChange('P1', e.target.value)}
                  placeholder="Isi nama kamu..."
                  className="w-full bg-white/5 text-white placeholder-white/30 p-3 rounded-xl border border-white/10 focus:border-cyan-400 focus:bg-white/10 outline-none transition-all shadow-inner focus:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                 {['P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8'].map((p) => (
                  <div key={p} className="relative">
                     <label className="text-[10px] text-gray-400 ml-1 uppercase tracking-wider font-semibold">{p}</label>
                    <input
                      value={players[p]}
                      onChange={(e) => handlePlayerChange(p, e.target.value)}
                      placeholder={`Player ${p.replace('P', '')}`}
                      className="w-full bg-black/20 text-gray-200 placeholder-white/10 p-2 rounded-lg border border-white/5 focus:border-purple-400 focus:bg-white/5 outline-none transition-all text-sm focus:shadow-[0_0_10px_rgba(192,132,252,0.3)]"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={goToStep2} 
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
              >
                Lanjut <ArrowRight size={18} />
              </button>
              <button 
                onClick={resetStep1} 
                className="w-12 bg-red-500/10 text-red-300 border border-red-500/30 rounded-xl flex items-center justify-center hover:bg-red-500/20 active:scale-95 transition-all"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && !prediction && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-glass-dark/40 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-400">
                Data Lawan
              </h2>
               <div className="bg-white/10 px-3 py-1 rounded-full text-xs text-white/70">Step 2/2</div>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'I1', label: 'I-2' },
                { id: 'I2', label: 'I-3' },
                { id: 'I3', label: 'I-4' },
                { id: 'II1', label: 'II-2' },
                { id: 'II2', label: 'II-4' },
              ].map((field) => (
                <div key={field.id}>
                  <label className="text-xs text-purple-200 block mb-1 font-semibold ml-1">Ronde {field.label}</label>
                  <div className="relative">
                    <select
                      value={opponents[field.id as keyof OpponentMap]}
                      onChange={(e) => handleOpponentChange(field.id as keyof OpponentMap, e.target.value)}
                      className="w-full bg-black/20 text-white p-3 rounded-xl border border-white/10 focus:border-pink-400 outline-none appearance-none transition-all shadow-inner text-sm"
                    >
                      <option value="" className="bg-gray-800">-- Pilih Lawan --</option>
                      {getOptions(field.id as keyof OpponentMap).map(opt => (
                        <option key={opt} value={opt} className="bg-gray-800">{opt}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">▼</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={generateData} 
                className="relative overflow-hidden flex-1 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(192,38,211,0.5)] active:scale-95 transition-all group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Swords size={18} /> <span className="relative z-10">Generate</span>
              </button>
              <button 
                onClick={resetStep2} 
                className="w-12 bg-red-500/10 text-red-300 border border-red-500/30 rounded-xl flex items-center justify-center hover:bg-red-500/20 active:scale-95 transition-all"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {prediction && (
           <motion.div
           key="results"
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="space-y-4 pb-20"
         >
           <div className="flex justify-between items-center bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg">
             <div className="flex items-center gap-2">
                <Sparkles className="text-yellow-300" size={18} />
                <span className="text-white font-bold text-md">Hasil Prediksi</span>
             </div>
             <button onClick={() => setPrediction(null)} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors border border-white/10">
                Edit
             </button>
           </div>

           {prediction.map((table, idx) => (
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              key={idx} 
              className="bg-black/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
             >
               <div className={`p-3 border-b border-white/5 ${idx === 0 ? 'bg-gradient-to-r from-blue-900/50 to-cyan-900/50' : 'bg-gradient-to-r from-purple-900/50 to-pink-900/50'}`}>
                 <h3 className={`font-bold text-md flex items-center gap-2 ${idx === 0 ? 'text-cyan-300' : 'text-pink-300'}`}>
                   <Trophy size={16} /> Kemungkinan {idx + 1}
                 </h3>
                 <div className="mt-1 flex gap-2 items-center">
                    <span className="text-[9px] uppercase bg-white/10 px-2 py-0.5 rounded text-gray-300">Sisa</span>
                    <span className="text-xs font-mono text-white/90">{table.residualP7} & {table.residualP8}</span>
                 </div>
               </div>
               <div className="p-3 space-y-4">
                 {table.rounds.map((round) => (
                   <div key={round.roundName}>
                     <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2 text-center">{round.roundName}</h4>
                     <div className="grid grid-cols-2 gap-2">
                       {round.matches.map((match, mi) => (
                         <div 
                          key={mi} 
                          className={`p-2 rounded-lg border flex justify-between items-center ${
                            match.opponent === 'Creep' 
                              ? 'bg-gray-900/40 border-gray-700/50 text-gray-500' 
                              : 'bg-white/5 border-white/10 text-white'
                          }`}
                         >
                           <span className="text-[10px] font-mono text-white/40">{match.round}-{match.step}</span>
                           <span className="font-semibold text-xs truncate max-w-[80px] text-right">{match.opponent}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
             </motion.div>
           ))}
         </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Predictor;
