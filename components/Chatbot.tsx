
import React, { useState, useRef, useEffect } from 'react';
import { streamChat, resetChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import { SendIcon, UserIcon, BotIcon, ResetIcon } from './Icons';

const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    const content = message.parts.map(p => p.text).join("");

    return (
        <div className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <BotIcon className="w-5 h-5 text-white" />
                </div>
            )}
            <div className={`max-w-lg px-4 py-3 rounded-2xl ${isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                 <div className="prose prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
            </div>
            {isUser && (
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-slate-300" />
                </div>
            )}
        </div>
    );
};


export const Chatbot: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        // Reset chat session when component mounts
        resetChat();
        setMessages([]);
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const newUserMessage: ChatMessage = {
            role: 'user',
            parts: [{ text: input }],
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        const modelResponse: ChatMessage = {
            role: 'model',
            parts: [{ text: '' }],
        };
        
        setMessages(prev => [...prev, modelResponse]);

        let fullResponse = '';
        await streamChat(input, (chunk) => {
            fullResponse += chunk;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                    role: 'model',
                    parts: [{ text: fullResponse }],
                };
                return newMessages;
            });
        });

        setIsLoading(false);
    };

    const handleReset = () => {
        resetChat();
        setMessages([]);
    };

    return (
        <div className="max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col h-[70vh] animate-fade-in-up">
            <header className="flex justify-between items-center p-4 border-b border-slate-700">
                <h2 className="text-xl font-bold text-cyan-400">AI Chat</h2>
                <button onClick={handleReset} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                    <ResetIcon className="w-5 h-5 text-slate-400"/>
                </button>
            </header>
            
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <BotIcon className="w-16 h-16 mb-4"/>
                        <p>Ask me anything!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => <ChatMessageBubble key={index} message={msg} />)
                )}
            </div>

            <div className="p-4 border-t border-slate-700">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="w-full bg-slate-700 border border-slate-600 rounded-full py-3 pl-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-cyan-500 text-white hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                        <SendIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};
