import React, { useState, useEffect, useRef } from 'react';
import { GlassJar } from './components/GlassJar';
import { Heart } from './components/Heart';
import { LoadingDumpling } from './components/LoadingDumpling';
import { transformEmotion } from './services/geminiService';
import { Note, AppState } from './types';
import { ArrowLeft, X, RefreshCw, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [inputText, setInputText] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load notes from local storage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('emotional_jar_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    localStorage.setItem('emotional_jar_notes', JSON.stringify(notes));
  }, [notes]);

  const handleHeartClick = () => {
    setAppState('INPUT');
    setTimeout(() => {
        if(textareaRef.current) textareaRef.current.focus();
    }, 100);
  };

  const handleInputSubmit = () => {
    if (!inputText.trim()) return;
    setAppState('PROCESSING_CRUMPLE');
    
    // Animation sequence
    setTimeout(() => {
      setAppState('PROCESSING_THROW');
      setTimeout(() => {
        setAppState('REVIEW_PROMPT');
      }, 1000);
    }, 1500);
  };

  const startTransformation = async () => {
    setAppState('TRANSFORMING');
    
    // We let the API call run
    const apiPromise = transformEmotion(inputText);
    
    // We enforce a minimum wait time for the animation (e.g., 2.6s to match the progress bar)
    const minWaitPromise = new Promise(resolve => setTimeout(resolve, 2600));

    const [ { text, quote } ] = await Promise.all([apiPromise, minWaitPromise]);
    
    const newNote: Note = {
      id: Date.now().toString(),
      originalText: inputText,
      transformedText: text,
      quote: quote,
      createdAt: Date.now(),
    };

    setCurrentNote(newNote);
    setAppState('RESULT');
  };

  const saveAndClose = () => {
    if (currentNote) {
      // Avoid duplicates if coming from random view
      const exists = notes.find(n => n.id === currentNote.id);
      if (!exists) {
          setNotes(prev => [currentNote, ...prev]);
      }
    }
    setInputText('');
    setCurrentNote(null);
    setAppState('HOME');
  };

  const openGallery = () => {
    if (notes.length === 0) return;
    setAppState('GALLERY');
  };

  const openRandomNote = () => {
      if (notes.length === 0) return;
      setAppState('TRANSFORMING'); 
      
      // Simulate loading for random note
      setTimeout(() => {
          const random = notes[Math.floor(Math.random() * notes.length)];
          setCurrentNote(random);
          setAppState('RESULT');
      }, 2600); 
  };

  // --- RENDER HELPERS ---

  const renderHome = () => (
    <div className="flex flex-col items-center min-h-screen pt-16 pb-8 px-6 relative overflow-hidden bg-[#ecfdf5]">
      
      {/* Background Decor - Mint & Light Pink */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-60">
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20px] right-[-20px] w-96 h-96 bg-pink-100/40 rounded-full blur-3xl"></div>
          <div className="absolute top-[30%] right-[10%] w-32 h-32 bg-white/60 rounded-full blur-2xl"></div>
      </div>

      <div className="mb-8 text-center space-y-2 z-10">
        <p className="text-teal-700/50 font-serif italic text-base tracking-[0.2em]">I am here with you</p>
      </div>

      <div className="relative flex-grow flex flex-col items-center justify-start w-full z-10">
        
        {/* The Jar with Heart and Lid Buttons Integrated */}
        <div className="relative mt-4">
            <GlassJar 
                noteCount={notes.length} 
                isShaking={notes.length > 0} 
                onOpenGallery={notes.length > 0 ? openGallery : undefined}
                onOpenRandom={notes.length > 0 ? openRandomNote : undefined}
                centerContent={
                    <Heart onClick={handleHeartClick} label="你正在被倾听" theme="pink" />
                }
            />
        </div>
      </div>
    </div>
  );

  const renderInput = () => (
    <div className="fixed inset-0 bg-[#ecfdf5] z-50 flex flex-col p-6 animate-float">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setAppState('HOME')} className="p-2 text-teal-700/60 hover:bg-emerald-50 rounded-full transition-colors">
            <X size={24} />
        </button>
        <span className="text-teal-800/50 font-serif tracking-widest">倾诉时刻</span>
        <div className="w-8"></div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-gradient-to-br from-[#fffdfa] to-[#fff5f7] p-8 shadow-[0_15px_30px_rgba(251,207,232,0.15)] rounded-sm border border-pink-50 paper-texture h-[50vh] relative rotate-1">
            <textarea
                ref={textareaRef}
                className="w-full h-full bg-transparent resize-none outline-none text-stone-700 text-xl leading-loose font-serif placeholder-stone-300"
                placeholder="这一刻，你有什么感受和想法？写下来吧，我会接住它们..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            {/* Tape visual */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-white/60 shadow-sm rotate-2 backdrop-blur-sm border border-white/40"></div>
        </div>
      </div>

      <button 
        onClick={handleInputSubmit}
        disabled={!inputText.trim()}
        className={`w-full py-4 rounded-2xl text-white text-lg tracking-widest transition-all shadow-lg mb-8 font-serif 
          ${inputText.trim() 
             ? 'bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 shadow-pink-200/50 transform hover:-translate-y-1' 
             : 'bg-stone-300 cursor-not-allowed'}`}
      >
        写好了
      </button>
    </div>
  );

  const renderProcessing = () => (
    <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 transition-all duration-500">
        {appState === 'PROCESSING_CRUMPLE' && (
            <div className="w-64 h-80 bg-pink-50 shadow-2xl animate-crumple flex items-center justify-center p-4">
                 <p className="text-xs text-stone-400 overflow-hidden h-full select-none blur-[1px] font-serif">{inputText}</p>
            </div>
        )}
        {appState === 'PROCESSING_THROW' && (
             <div className="flex flex-col items-center justify-center h-full">
                 <div className="scale-75 origin-center">
                    <GlassJar noteCount={notes.length} />
                 </div>
                 <div className="mt-8 text-white/90 text-lg font-serif tracking-widest animate-pulse">
                    正在温柔地收纳...
                 </div>
             </div>
        )}
    </div>
  );

  const renderReviewPrompt = () => (
    <div className="fixed inset-0 bg-teal-950/90 z-50 flex items-center justify-center p-8 backdrop-blur-md">
        <div className="bg-[#fffefc] p-10 rounded-3xl shadow-2xl max-w-sm w-full text-center space-y-8 animate-float border border-white/20">
            <h3 className="text-2xl font-bold text-teal-900 font-serif">重新审视</h3>
            <p className="text-teal-800/70 leading-loose font-serif text-lg">
                情绪已安放。<br/>
                但我想请你再看一眼，<br/>
                也许在裂痕中，<br/>
                藏着光的种子。
            </p>
            <button 
                onClick={startTransformation}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-emerald-600 transition-all tracking-widest font-serif"
            >
                展开看看
            </button>
        </div>
    </div>
  );

  const renderResult = () => (
    <div className="fixed inset-0 bg-[#ecfdf5] z-50 flex flex-col p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => saveAndClose()} className="p-2 text-teal-700/60 hover:bg-emerald-50 rounded-full">
                <ArrowLeft size={24} />
            </button>
            <span className="text-teal-800/50 font-serif tracking-widest">力量的回响</span>
            <div className="w-8"></div>
        </div>

        {appState === 'TRANSFORMING' ? (
             <div className="flex-grow flex flex-col items-center justify-center">
                 <LoadingDumpling />
             </div>
        ) : (
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="w-full max-w-md bg-white p-8 md:p-10 shadow-[0_20px_50px_-12px_rgba(244,114,182,0.1)] rounded-sm border border-pink-50 relative paper-texture min-h-[480px] flex flex-col animate-unfold">
                    
                    {/* Paper details */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-50/50 to-transparent rounded-bl-3xl"></div>

                    {/* Original (Negative) */}
                    <div className="mb-8 pb-6 border-b border-dashed border-pink-100 relative">
                        <p className="text-xs text-stone-400 mb-3 font-serif tracking-wider">那些困扰你的声音：</p>
                        <p className="text-stone-400/80 line-through decoration-stone-300 decoration-1 italic text-base leading-relaxed font-serif">
                            {currentNote?.originalText || inputText}
                        </p>
                    </div>

                    {/* Transformed (Positive) */}
                    <div className="flex-grow flex flex-col relative z-10">
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-pink-50 text-pink-600/70 text-xs rounded-full mb-2 font-serif border border-pink-100">新的看见</span>
                        </div>
                        <p className="text-xl md:text-2xl text-stone-800 font-bold leading-loose tracking-wide font-serif">
                            {currentNote?.transformedText}
                        </p>

                        {/* Quote Display */}
                        {currentNote?.quote && (
                            <div className="mt-8 pt-6 border-t border-stone-100">
                                <p className="text-teal-700/60 text-sm font-serif italic text-right leading-relaxed">
                                    {currentNote.quote}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Blue Dreamy Heart at Bottom */}
                    <div className="absolute -bottom-6 -right-2 transform -rotate-12 scale-75 hover:scale-90 transition-all z-20">
                        <Heart onClick={() => {}} label="" theme="blue" />
                    </div>
                </div>
                
                <p className="mt-8 text-center text-teal-700/40 text-sm max-w-xs leading-relaxed font-serif italic">
                    “凡是杀不死你的，终将使你更强大。”
                </p>
            </div>
        )}

        {appState !== 'TRANSFORMING' && (
            <button 
                onClick={saveAndClose}
                className="w-full py-4 mt-6 bg-gradient-to-r from-pink-300 to-pink-400 text-white rounded-2xl shadow-lg hover:from-pink-400 hover:to-pink-500 transition-all font-serif tracking-widest transform hover:-translate-y-1"
            >
                {notes.find(n => n.id === currentNote?.id) ? '返回首页' : '收进罐子'}
            </button>
        )}
    </div>
  );

  const renderGallery = () => (
    <div className="fixed inset-0 bg-[#ecfdf5] z-50 flex flex-col">
        <div className="p-6 pb-4 flex justify-between items-center bg-[#ecfdf5]/95 backdrop-blur-md sticky top-0 z-10 border-b border-teal-100/30">
            <button onClick={() => setAppState('HOME')} className="p-2 text-teal-700/60 hover:bg-emerald-50 rounded-full transition-colors">
                <ArrowLeft size={24} />
            </button>
            <h2 className="text-xl font-bold text-teal-800 font-serif tracking-wider">我的情绪罐</h2>
            <button onClick={openRandomNote} className="p-2 text-teal-700/60 hover:bg-emerald-50 rounded-full flex items-center gap-1 text-sm transition-colors">
                <RefreshCw size={18} />
                <span className="hidden sm:inline">随机</span>
            </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 grid grid-cols-2 gap-4 auto-rows-max pb-20">
            {notes.map((note, idx) => (
                <div 
                    key={note.id}
                    onClick={() => { setCurrentNote(note); setAppState('RESULT'); }}
                    className={`p-5 rounded-sm shadow-sm border border-stone-100 cursor-pointer hover:shadow-md transition-all active:scale-95 flex flex-col justify-between h-56 overflow-hidden relative group paper-texture ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fffdfa]'}`}
                >
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-stone-100 border-r-white drop-shadow-sm group-hover:border-t-pink-100 transition-colors"></div>
                    
                    <div>
                        <p className="text-stone-700 text-sm font-medium line-clamp-4 leading-loose font-serif">
                            {note.transformedText}
                        </p>
                        {note.quote && (
                           <p className="mt-3 text-[10px] text-teal-700/50 italic line-clamp-2 border-t border-stone-100 pt-2">
                             {note.quote}
                           </p>
                        )}
                    </div>

                    <div className="mt-2 text-[10px] text-stone-300 text-right font-sans">
                        {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  // --- MAIN RENDER SWITCH ---

  switch (appState) {
    case 'INPUT': return renderInput();
    case 'PROCESSING_CRUMPLE':
    case 'PROCESSING_THROW': return renderProcessing();
    case 'REVIEW_PROMPT': return renderReviewPrompt();
    case 'TRANSFORMING': 
    case 'RESULT': return renderResult();
    case 'GALLERY': return renderGallery();
    case 'HOME':
    default: return renderHome();
  }
};

export default App;