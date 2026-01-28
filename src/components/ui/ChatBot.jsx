import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';

const ChatBot = ({ resumeData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "👋 Hi! I'm ResumeBot. I can help you build a great resume. Ask me anything!" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.slice(1).map(m => ({ role: m.role, content: m.content })), // Skip initial greeting
                    resumeContext: resumeData
                })
            });
            const data = await response.json();

            if (data.reply) {
                setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages([...newMessages, { role: 'assistant', content: "Sorry, I couldn't respond. Please try again." }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages([...newMessages, { role: 'assistant', content: "Connection error. Please check your network." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/40 flex items-center justify-center hover:scale-110 transition-transform"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 flex items-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        <div>
                            <h3 className="font-bold">ResumeBot</h3>
                            <p className="text-xs opacity-80">AI-powered resume assistant</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-md'
                                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md shadow-sm'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-md border border-slate-200 shadow-sm">
                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-slate-200 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything about resumes..."
                                className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                disabled={loading}
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
