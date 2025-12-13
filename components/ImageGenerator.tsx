import React, { useState } from 'react';
import { generateImage } from '../services/gemini';
import { motion } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Download, Loader2, AlertTriangle } from 'lucide-react';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;

        setIsLoading(true);
        setGeneratedImage(null);
        setError(null);

        try {
            const imageUrl = await generateImage(prompt);
            if (imageUrl) {
                setGeneratedImage(imageUrl);
            } else {
                throw new Error("Gagal membuat gambar, coba deskripsi lain.");
            }
        } catch (e: any) {
            setError(e.message || "Terjadi kesalahan yang tidak diketahui.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `${prompt.slice(0, 20).replace(/\s/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleGenerate();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] relative max-w-lg mx-auto">
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-6"
            >
                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-orange-300 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                IMAGE AI GENERATOR
                </h1>
                <p className="text-[10px] text-orange-200 mt-1 font-light tracking-widest uppercase">Ubah Teks Menjadi Gambar</p>
            </motion.div>

            {/* Result Display */}
            <div className="flex-1 flex items-center justify-center p-2">
                <div className="w-full aspect-square bg-black/30 rounded-2xl border border-white/10 shadow-xl flex items-center justify-center overflow-hidden">
                    {isLoading ? (
                         <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center text-white/70 space-y-3">
                            <Loader2 size={40} className="mx-auto animate-spin text-orange-400" />
                            <p className="font-semibold">AI sedang melukis...</p>
                            <p className="text-xs max-w-xs mx-auto opacity-50">" {prompt} "</p>
                        </motion.div>
                    ) : error ? (
                         <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center text-red-400 p-4">
                            <AlertTriangle size={32} className="mx-auto mb-2"/>
                            <p className="font-semibold text-red-300">Oops, Gagal!</p>
                            <p className="text-xs mt-1">{error}</p>
                        </motion.div>
                    ) : generatedImage ? (
                        <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="w-full h-full relative group">
                            <img src={generatedImage} alt={prompt} className="w-full h-full object-contain" />
                            <button 
                                onClick={handleDownload}
                                className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/80">
                                <Download size={20} />
                            </button>
                        </motion.div>
                    ) : (
                        <div className="text-center text-white/40 p-4">
                            <ImageIcon size={40} className="mx-auto mb-3" />
                            <p className="font-semibold">Hasil gambar akan muncul di sini</p>
                            <p className="text-xs mt-1">Tulis deskripsi di bawah dan biarkan AI berkreasi.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="mt-4">
                <motion.div 
                    layout 
                    className="bg-glass-dark/90 backdrop-blur-xl border border-white/20 rounded-2xl p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-end gap-1.5"
                >
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Contoh: Kucing astronot di bulan..."
                        className="flex-1 w-full bg-transparent text-white placeholder-gray-500 text-sm py-2 px-3 outline-none resize-none max-h-20 scrollbar-hide font-medium"
                        rows={2}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isLoading}
                        className="p-2.5 h-full bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:shadow-none transition-all duration-300 active:scale-95"
                    >
                        <Sparkles size={18} />
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default ImageGenerator;
