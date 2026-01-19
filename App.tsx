
import React, { useState, useEffect, useRef } from 'react';
import { StrategyType, StrategyData, Message } from './types';
import { STRATEGIES, PDF_CONTENT_RAW } from './constants';
import { GoogleGenAI } from '@google/genai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Only initialize Supabase if keys are provided
const supabase: SupabaseClient | null = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

const LOCAL_STORAGE_KEY = 'polaris_local_cache';

const App: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>(StrategyType.WARM_UP_POLL);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Persistence states
  const [questions, setQuestions] = useState<Record<string, string>>({});
  const [reflectionNotes, setReflectionNotes] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});
  const [reflectionSavedStatus, setReflectionSavedStatus] = useState<Record<string, boolean>>({});
  
  // Accordion state
  const [openStepIndex, setOpenStepIndex] = useState<number | null>(0);
  const [visibleNotes, setVisibleNotes] = useState<Record<number, boolean>>({});

  const activeData = STRATEGIES.find(s => s.id === selectedStrategy)!;

  // Load data from Supabase or LocalStorage on mount
  useEffect(() => {
    const fetchData = async () => {
      let qMap: Record<string, string> = {};
      let rMap: Record<string, string> = {};

      // 1. Try to load from LocalStorage first (instant)
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          qMap = parsed.questions || {};
          rMap = parsed.reflections || {};
        } catch (e) {
          console.error("Local cache corrupted", e);
        }
      }

      // 2. Try to sync from Supabase if available
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('polaris_persistence')
            .select('*');

          if (data && !error) {
            data.forEach((row: any) => {
              if (row.question) qMap[row.strategy_id] = row.question;
              if (row.reflection) rMap[row.strategy_id] = row.reflection;
            });
          }
        } catch (err) {
          console.warn('Supabase sync skipped:', err);
        }
      }

      setQuestions(qMap);
      setReflectionNotes(rMap);
      setIsLoadingData(false);
    };

    fetchData();
  }, []);

  // Persist to LocalStorage whenever state changes
  useEffect(() => {
    if (!isLoadingData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        questions,
        reflections: reflectionNotes
      }));
    }
  }, [questions, reflectionNotes, isLoadingData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setOpenStepIndex(0);
    setVisibleNotes({});
  }, [selectedStrategy]);

  const toggleStep = (index: number) => {
    setOpenStepIndex(openStepIndex === index ? null : index);
  };

  const toggleSpeakerNote = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setVisibleNotes(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSaveQuestion = async (id: string) => {
    if (supabase) {
      try {
        await supabase
          .from('polaris_persistence')
          .upsert({ 
            strategy_id: id, 
            question: questions[id] || '',
            updated_at: new Date()
          }, { onConflict: 'strategy_id' });
      } catch (err) {
        console.error('Database save failed', err);
      }
    }
    
    setSavedStatus(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setSavedStatus(prev => ({ ...prev, [id]: false })), 3000);
  };

  const handleSaveReflection = async (id: string) => {
    if (supabase) {
      try {
        await supabase
          .from('polaris_persistence')
          .upsert({ 
            strategy_id: id, 
            reflection: reflectionNotes[id] || '',
            updated_at: new Date()
          }, { onConflict: 'strategy_id' });
      } catch (err) {
        console.error('Database save failed', err);
      }
    }

    setReflectionSavedStatus(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setReflectionSavedStatus(prev => ({ ...prev, [id]: false })), 3000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const strategySpecificInfo = JSON.stringify(activeData);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are a strict instructor support assistant for Polaris 2.0. 
          Your ONLY source of knowledge is the following PDF content and data about the current active learning strategy:
          ---
          CURRENT STRATEGY DATA: ${strategySpecificInfo}
          ---
          ALL PDF CONTENT: ${PDF_CONTENT_RAW}
          ---
          RULES:
          1. Answer ONLY using information from the content provided above.
          2. Short, specific, and actionable responses.
          3. Keep answers relevant to the current strategy: ${selectedStrategy}.`,
          temperature: 0.1,
        }
      });

      const aiText = response.text || "I couldn't find information regarding that in the guide.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to assistant." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;
      const isBullet = line.trim().startsWith('* ');
      let cleanLine = isBullet ? line.trim().slice(2) : line;
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="font-black text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      if (isBullet) {
        return (
          <div key={i} className="flex gap-2 pl-2 my-1">
            <span className="text-blue-500 shrink-0 font-bold">•</span>
            <div className="flex-1">{formattedLine}</div>
          </div>
        );
      }
      return <p key={i} className="mb-1 leading-relaxed">{formattedLine}</p>;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden text-slate-900 bg-white font-sans selection:bg-blue-100">
      {/* LEFT NAV */}
      <aside className="w-64 border-r border-slate-100 bg-white flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-50">
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Polaris 2.0</h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-bold">Instructor Framework</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {Object.values(StrategyType).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedStrategy(type)}
              className={`w-full text-left px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                selectedStrategy === type
                  ? 'bg-blue-50 text-blue-600 shadow-sm border border-blue-100'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </nav>
        <div className="p-6">
           <div className={`px-4 py-2 rounded-lg flex items-center gap-2 border ${supabase ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${supabase ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
              <span className="text-[9px] font-black uppercase tracking-widest">{supabase ? 'Cloud Sync Active' : 'Offline Storage'}</span>
           </div>
        </div>
      </aside>

      {/* MIDDLE PANEL */}
      <main className="flex-1 overflow-y-auto bg-white scroll-smooth relative">
        {isLoadingData && (
          <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Records...</p>
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto py-16 px-10">
          {/* HEADER */}
          <header className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{activeData.id}</h2>
            <p className="text-base text-slate-500 font-medium leading-relaxed mb-8">{activeData.purpose}</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Time Required</span>
                <span className="text-lg font-bold text-slate-800">{activeData.totalTime}</span>
              </div>
              <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Recommended Tool(s)</span>
                <span className="text-lg font-bold text-slate-800">{activeData.tools || "Classroom Presentation"}</span>
              </div>
            </div>
            <div className="h-px bg-blue-500/10 w-full" />
          </header>

          {/* OVERVIEW */}
          <section className="mb-12">
            <div className="bg-[#E8F1FF] p-6 rounded-2xl border border-blue-100">
              <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Activity Overview</h3>
              <p className="text-sm text-blue-900 leading-relaxed font-medium">{activeData.instructionalNote || activeData.purpose}</p>
            </div>
          </section>

          {/* QUESTION CREATOR */}
          <section className="mb-12 py-8 border-y border-slate-50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🪄</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Question Creator</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6 font-medium">Draft your core prompt for this activity. {supabase ? "Saves to your database." : "Saves to your browser storage."}</p>
            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
                  {selectedStrategy === StrategyType.SELF_REFLECTION ? "Draft your Reflection Question:" : `Draft your ${activeData.id} Question:`}
                </label>
                <textarea
                  value={questions[activeData.id] || ''}
                  onChange={(e) => setQuestions({ ...questions, [activeData.id]: e.target.value.slice(0, 250) })}
                  placeholder="e.g., Why might two people interpret this data differently?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px] resize-none transition-all shadow-sm font-medium"
                />
                <div className="flex justify-between items-center mt-2 px-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">{(questions[activeData.id] || '').length}/250 Characters</span>
                  <button onClick={() => setQuestions({ ...questions, [activeData.id]: '' })} className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors">Clear</button>
                </div>
              </div>
              <button 
                onClick={() => handleSaveQuestion(activeData.id)}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 ${supabase ? 'bg-[#2E6CFF] shadow-blue-500/20 hover:bg-blue-700 text-white' : 'bg-slate-900 shadow-slate-900/10 hover:bg-black text-white'}`}
              >
                <span>{supabase ? 'Save to Cloud' : 'Save Locally'}</span>
              </button>
              {savedStatus[activeData.id] && <p className="text-[11px] font-bold text-emerald-600 animate-in fade-in slide-in-from-left-2 duration-300">✅ {supabase ? 'Synced to Cloud' : 'Saved to Browser'}</p>}
            </div>
          </section>

          {/* PAGE VARIATIONS */}
          {selectedStrategy === StrategyType.WARM_UP_POLL && (
            <section className="mb-12 grid grid-cols-2 gap-8 items-start bg-slate-50 p-8 rounded-2xl border border-slate-100">
               <div className="space-y-4">
                 <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Setup Instructions</h4>
                 <ul className="space-y-3 text-xs text-slate-600 font-medium list-disc pl-4">
                    <li>Generate your poll on <a href={activeData.toolLink} target="_blank" className="text-blue-600 hover:underline">Mentimeter</a></li>
                    <li>Download the QR code for student access.</li>
                    <li>Paste the session code into your final slide.</li>
                 </ul>
               </div>
               <div className="space-y-4">
                 <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl aspect-square flex flex-col items-center justify-center p-6 text-center opacity-40">
                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 7h10v10H7zM12 12h.01"/></svg>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">QR Placeholder</span>
                 </div>
                 <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">How Students Join</h4>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed">Scan QR code or visit <span className="text-blue-600">www.menti.com</span>, enter session code, type name. Questions appear one at a time with a timer.</p>
                 </div>
               </div>
            </section>
          )}

          {/* FLOW */}
          <section className="mb-12">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Step-by-Step Instructor Flow</h3>
            <div className="space-y-4">
              {activeData.flow.map((step, idx) => (
                <div key={idx} className={`border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 ${openStepIndex === idx ? 'shadow-lg border-blue-100 bg-white' : 'hover:bg-slate-50'}`}>
                  <button onClick={() => toggleStep(idx)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                    <div className="flex items-center gap-5">
                      <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-black ${openStepIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{idx + 1}</span>
                      <h4 className="font-bold text-slate-900 text-base">{step.phase}</h4>
                    </div>
                    <div className="flex items-center gap-4">
                      {step.time && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.time}</span>}
                      <svg className={`w-5 h-5 text-slate-300 transition-transform ${openStepIndex === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </button>
                  {openStepIndex === idx && (
                    <div className="px-8 pb-8 pt-2 animate-in fade-in slide-in-from-top-2 duration-300 space-y-6">
                      {step.goal && (<div><span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest block mb-2">Goal</span><p className="text-sm text-slate-700 font-medium">{step.goal}</p></div>)}
                      <div className="flex items-start gap-6">
                         <div className="flex-1"><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Action Item</span><p className="text-sm text-slate-600 leading-relaxed font-medium">{step.action}</p></div>
                         {step.aiTip && (<div className="w-1/3 shrink-0 bg-[#E8F1FF] p-4 rounded-xl border border-blue-100"><span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">Instructor Tip</span><p className="text-[11px] text-blue-900 font-bold leading-tight">{step.aiTip}</p></div>)}
                      </div>
                      {step.prompt && (
                         <div className="bg-slate-50 border-l-4 border-blue-500 p-5 rounded-r-xl">
                            <div className="flex justify-between items-center mb-3">
                               <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Speaker Notes</span>
                               <button onClick={(e) => toggleSpeakerNote(e, idx)} className="text-[9px] font-black text-blue-400 hover:text-blue-600 uppercase tracking-widest underline decoration-2 underline-offset-4">{visibleNotes[idx] ? 'Hide Notes' : 'Click to Reveal Notes'}</button>
                            </div>
                            {visibleNotes[idx] ? (<div className="space-y-3 italic text-slate-800 text-sm font-medium leading-relaxed">{step.prompt.split('. ').map((s, i) => <p key={i}>“{s}{s.endsWith('.') ? '' : '.'}”</p>)}</div>) : (<div className="h-4 w-full bg-slate-200/50 rounded-full animate-pulse" />)}
                         </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* TIPS */}
          <section className="mb-12 py-10 border-t border-slate-50 grid grid-cols-2 gap-10">
            <div>
              <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-6">✅ Implementation Tips</h3>
              <ul className="space-y-4">{activeData.tips.map((tip, idx) => (<li key={idx} className="flex gap-3 text-xs text-slate-600 font-bold items-start"><span className="text-emerald-500">✓</span><span className="leading-relaxed">{tip}</span></li>))}</ul>
            </div>
            {activeData.mistakes && (
              <div>
                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-6">❌ Avoid These</h3>
                <ul className="space-y-4">{activeData.mistakes.map((m, idx) => (<li key={idx} className="flex gap-3 text-xs text-slate-600 font-bold items-start"><span className="text-rose-400">✕</span><span className="leading-relaxed">{m}</span></li>))}</ul>
              </div>
            )}
          </section>

          {/* REFLECTION */}
          <section className="mb-12 bg-indigo-50/30 p-10 rounded-[2rem] border border-indigo-100/50">
             <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-6">Reflection for Instructors (Post-Activity)</h3>
             <div className="space-y-8">
                <ul className="space-y-6">
                  {(activeData.reflectionPrompts || []).slice(0, 3).map((prompt, idx) => (
                    <li key={idx} className="flex gap-4 text-sm text-indigo-900 font-bold italic leading-relaxed">
                      <span className="text-indigo-300 font-serif text-3xl h-6 leading-none select-none">“</span>
                      <span>{prompt}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-indigo-100/50">
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-3">Reflect on what worked best and what you’d change:</label>
                  <textarea 
                    value={reflectionNotes[activeData.id] || ''}
                    onChange={(e) => setReflectionNotes({...reflectionNotes, [activeData.id]: e.target.value})}
                    className="w-full h-32 bg-white/70 border border-indigo-100 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
                    placeholder="Type your insights here..."
                  ></textarea>
                  <button 
                    onClick={() => handleSaveReflection(activeData.id)}
                    className={`mt-4 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${supabase ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-900 hover:bg-black text-white'}`}
                  >
                    {supabase ? 'Sync Reflection' : 'Save Locally'}
                  </button>
                  {reflectionSavedStatus[activeData.id] && <p className="text-[11px] font-bold text-emerald-600 mt-2 animate-in fade-in slide-in-from-left-2 duration-300">✅ Reflection cached.</p>}
                </div>
             </div>
          </section>

          <footer className="mt-20 py-12 border-t border-slate-50 text-center opacity-30 tracking-[0.3em] uppercase text-[10px] font-black">Polaris 2.0 — Excellence Framework</footer>
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="w-80 border-l border-slate-50 bg-slate-50/30 flex flex-col shrink-0">
        <div className="p-8 border-b border-slate-100 bg-white">
          <h3 className="text-base font-black text-slate-900 tracking-tight">Strategy Assistant</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Implementing {activeData.id}</p>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-10 px-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-500 mb-4 leading-relaxed uppercase tracking-tighter">Quick Questions:</p>
                <div className="space-y-2">
                  {["How long should this be?", "Any pitfalls?"].map(q => (
                    <button key={q} onClick={() => setInputValue(q)} className="w-full text-[11px] text-blue-600 hover:text-blue-700 font-bold p-2 rounded-lg bg-blue-50/50 border border-blue-100 text-left transition-colors">"{q}"</button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] rounded-2xl px-5 py-3 text-sm font-medium leading-relaxed ${msg.role === 'user' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-700'}`}>{renderMessageContent(msg.content)}</div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 text-slate-300 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" /> Thinking...
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100">
          <div className="relative group">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask about the strategy..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-6 pr-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all shadow-inner" />
            <button type="submit" disabled={isTyping || !inputValue.trim()} className="absolute right-3 top-2 p-2 bg-blue-600 text-white rounded-xl disabled:bg-slate-100 shadow-md transition-all hover:scale-105 active:scale-95"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button>
          </div>
        </form>
      </aside>
    </div>
  );
};

export default App;
