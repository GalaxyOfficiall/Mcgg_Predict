
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import type { Prediction, Round } from '../types';
import { ResetIcon } from './Icons';

const INITIAL_ROUND_COUNT = 10;
const ROUND_INCREMENT = 5;

// Helper function to convert number to Roman numeral
const toRoman = (num: number): string => {
    const roman = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 };
    let str = '';
    for (let i of Object.keys(roman)) {
        let q = Math.floor(num / roman[i as keyof typeof roman]);
        num -= q * roman[i as keyof typeof roman];
        str += i.repeat(q);
    }
    return str;
};


// Helper function to generate round name based on 0-based index
const getRoundName = (index: number): string => {
    if (index < 3) {
        return `II-${index + 4}`;
    }
    const adjustedIndex = index - 3;
    const chapterNum = Math.floor(adjustedIndex / 6) + 3;
    const number = (adjustedIndex % 6) + 1;
    return `${toRoman(chapterNum)}-${number}`;
};

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// UI Components (defined outside main component to prevent re-creation)

interface EnemyInputFormProps {
    onSubmit: (enemies: string[]) => void;
}

const EnemyInputForm: React.FC<EnemyInputFormProps> = ({ onSubmit }) => {
    const [enemies, setEnemies] = useState<string[]>(Array(7).fill(''));

    const handleInputChange = (index: number, value: string) => {
        const newEnemies = [...enemies];
        newEnemies[index] = value;
        setEnemies(newEnemies);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (enemies.every(name => name.trim() !== '')) {
            onSubmit(enemies);
        }
    };

    const allFilled = useMemo(() => enemies.every(name => name.trim() !== ''), [enemies]);

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700/50 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-center mb-6 text-cyan-400">Enter 7 Enemy Names</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enemies.map((enemy, index) => (
                        <div key={index}>
                            <label htmlFor={`p${index + 1}`} className="block text-sm font-medium text-slate-400 mb-1">
                                P{index + 1}
                            </label>
                            <input
                                id={`p${index + 1}`}
                                type="text"
                                value={enemy}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                placeholder={`Enemy ${index + 1}`}
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
                            />
                        </div>
                    ))}
                </div>
                <button
                    type="submit"
                    disabled={!allFilled}
                    className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-105"
                >
                    Predict Sequence
                </button>
            </form>
        </div>
    );
};


interface PredictionViewProps {
    predictions: Prediction[];
    onContinue: () => void;
    onReset: () => void;
    onCreep: (predictionIndex: number, roundIndex: number) => void;
}

const PredictionView: React.FC<PredictionViewProps> = ({ predictions, onContinue, onReset, onCreep }) => {
    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {predictions.map((prediction, predIndex) => (
                    <div key={prediction.title} className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border ${prediction.color === 'blue' ? 'border-blue-500/50' : 'border-red-500/50'}`}>
                        <h3 className={`text-2xl font-bold p-4 rounded-t-2xl text-center ${prediction.color === 'blue' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>
                            {prediction.title}
                        </h3>
                        <ul className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
                            {prediction.rounds.map((round, roundIndex) => (
                                <li key={round.name} className={`flex justify-between items-center p-3 rounded-lg transition-colors duration-200 animate-slide-in-bottom`} style={{ animationDelay: `${roundIndex * 30}ms` }}>
                                    <div className="flex items-center">
                                        <span className="text-sm font-semibold text-slate-400 w-16">{round.name}</span>
                                        <span className="font-bold text-lg mx-2 text-slate-300">→</span>
                                        <span className={`font-medium ${round.enemy === 'Round Creep' ? 'text-yellow-400 italic' : 'text-white'}`}>{round.enemy}</span>
                                    </div>
                                    {round.enemy !== 'Round Creep' && (
                                         <button onClick={() => onCreep(predIndex, roundIndex)} className="text-xs bg-slate-700 hover:bg-yellow-600 text-slate-300 hover:text-white font-semibold py-1 px-2 rounded-md transition-colors duration-200">
                                            Creep
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-center gap-4">
                <button
                    onClick={onContinue}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105"
                >
                    Lanjutkan Round Berikutnya
                </button>
                <button
                    onClick={onReset}
                    className="bg-slate-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                    <ResetIcon className="w-5 h-5"/>
                    Reset
                </button>
            </div>
        </div>
    );
};


export const Predictor: React.FC = () => {
    const [predictions, setPredictions] = useState<Prediction[] | null>(null);
    const [roundCount, setRoundCount] = useState<number>(INITIAL_ROUND_COUNT);
    const [baseSequences, setBaseSequences] = useState<{ seq1: string[], seq2: string[] } | null>(null);
    const [isVisible, setIsVisible] = useState(true);

    const generatePredictions = useCallback((sequences: { seq1: string[], seq2: string[] }, count: number) => {
        const rounds1: Round[] = [];
        const rounds2: Round[] = [];

        for (let i = 0; i < count; i++) {
            rounds1.push({
                name: getRoundName(i),
                enemy: sequences.seq1[i % sequences.seq1.length]
            });
            rounds2.push({
                name: getRoundName(i),
                enemy: sequences.seq2[i % sequences.seq2.length]
            });
        }

        return [
            { title: '🟦 Kemungkinan 1', color: 'blue', rounds: rounds1 },
            { title: '🟥 Kemungkinan 2', color: 'red', rounds: rounds2 }
        ];
    }, []);

    useEffect(() => {
        if (baseSequences) {
            const newPredictions = generatePredictions(baseSequences, roundCount);
            setPredictions(newPredictions);
        }
    }, [roundCount, baseSequences, generatePredictions]);


    const handlePredict = (enemies: string[]) => {
        const [p1, p2, p3, p4, p5, p6, p7] = enemies;
        const freeEnemies = [p1, p2, p3, p4, p5];
        const shuffledFreeEnemies = shuffleArray(freeEnemies);

        const seq1 = [p6, p7, ...shuffledFreeEnemies];
        const seq2 = [p7, p6, ...shuffledFreeEnemies];

        setBaseSequences({ seq1, seq2 });
        setRoundCount(INITIAL_ROUND_COUNT);
    };

    const handleContinue = () => {
        setRoundCount(prev => prev + ROUND_INCREMENT);
    };

    const handleReset = () => {
        setIsVisible(false);
        setTimeout(() => {
            setPredictions(null);
            setBaseSequences(null);
            setRoundCount(INITIAL_ROUND_COUNT);
            setIsVisible(true);
        }, 300); // match animation duration
    };

    const handleCreep = (predictionIndex: number, roundIndex: number) => {
        setPredictions(prev => {
            if (!prev) return null;
            const newPredictions = JSON.parse(JSON.stringify(prev)) as Prediction[];
            newPredictions[predictionIndex].rounds[roundIndex].enemy = 'Round Creep';
            return newPredictions;
        });
    };

    return (
        <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {!predictions ? (
                <EnemyInputForm onSubmit={handlePredict} />
            ) : (
                <PredictionView
                    predictions={predictions}
                    onContinue={handleContinue}
                    onReset={handleReset}
                    onCreep={handleCreep}
                />
            )}
        </div>
    );
};
