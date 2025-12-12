
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import type { ImageSize } from '../types';
import { SparklesIcon } from './Icons';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateImage(prompt, size);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const SIZES: ImageSize[] = ['1K', '2K', '4K'];

  return (
    <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-2xl font-bold text-center mb-6 text-fuchsia-400">Image Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-400 mb-1">
            Prompt
          </label>
          <textarea
            id="prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A neon hologram of a cat driving at top speed"
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition duration-200"
          />
        </div>

        <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Image Size</label>
            <div className="flex justify-center gap-2 bg-slate-700/50 p-1 rounded-lg">
                {SIZES.map(s => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`w-full py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 focus:ring-offset-slate-800 ${size === s ? 'bg-fuchsia-500 text-white' : 'text-slate-300 hover:bg-slate-600/50'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-fuchsia-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
                <SparklesIcon className="w-5 h-5" />
                Generate
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {imageUrl && (
        <div className="mt-6 animate-fade-in">
          <h3 className="text-lg font-semibold mb-2 text-center">Result</h3>
          <div className="bg-black rounded-lg overflow-hidden shadow-lg border border-slate-700">
            <img src={imageUrl} alt={prompt} className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
};
