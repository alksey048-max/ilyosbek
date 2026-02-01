
import React, { useState } from 'react';
import Header from './components/Header';
import PanelCard from './components/PanelCard';
import { generateComicScript, generatePanelImage } from './services/geminiService';
import { AppState, GenerationStep, ComicScript, ComicPanel } from './types';
import { Sparkles, Send, Download, RotateCcw, AlertCircle, Wand2, ScrollText } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<AppState>({
    currentStep: GenerationStep.IDLE,
    script: null,
    error: null,
    loading: false
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null, 
      currentStep: GenerationStep.SCRIPTING 
    }));

    try {
      const script = await generateComicScript(prompt);
      setState(prev => ({ 
        ...prev, 
        script, 
        currentStep: GenerationStep.ILLUSTRATING 
      }));

      for (let i = 0; i < script.panels.length; i++) {
        updatePanel(i, { status: 'generating' });
        try {
          const imageUrl = await generatePanelImage(script.panels[i].panelDescription);
          updatePanel(i, { imageUrl, status: 'completed' });
        } catch (imgError) {
          updatePanel(i, { status: 'error' });
        }
      }

      setState(prev => ({ ...prev, loading: false, currentStep: GenerationStep.FINISHED }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Музан заблокировал наш путь. Попробуйте еще раз.",
        currentStep: GenerationStep.IDLE 
      }));
    }
  };

  const updatePanel = (index: number, updates: Partial<ComicPanel>) => {
    setState(prev => {
      if (!prev.script) return prev;
      const newPanels = [...prev.script.panels];
      newPanels[index] = { ...newPanels[index], ...updates };
      return { ...prev, script: { ...prev.script, panels: newPanels } };
    });
  };

  const reset = () => {
    setState({ currentStep: GenerationStep.IDLE, script: null, error: null, loading: false });
    setPrompt('');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-24 pb-24 px-4 max-w-6xl mx-auto w-full">
        {state.currentStep === GenerationStep.IDLE && (
          <div className="max-w-3xl mx-auto text-center space-y-12 py-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/30 border border-red-500/30 text-red-500 text-[10px] font-black tracking-[0.2em] uppercase animate-pulse">
              <ScrollText className="w-3 h-3" />
              Дыхание ИИ: Активно
            </div>
            
            <div className="space-y-4">
              <h2 className="text-6xl md:text-8xl font-cinzel font-black tracking-tighter text-white uppercase leading-none">
                ТВОЯ <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-orange-500">ЛЕГЕНДА</span>
              </h2>
              <p className="text-zinc-500 text-lg max-w-xl mx-auto font-medium">
                Опишите сцену, битву или разговор. Наш ИИ создаст сценарий и проиллюстрирует каждую страницу в стиле легендарного аниме.
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Например: Танджиро сражается с демоном в заснеженном лесу, используя танец Бога Огня..."
                className="w-full bg-zinc-900/50 border-2 border-zinc-800 rounded-3xl p-8 text-xl text-white focus:outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-700 h-52 resize-none shadow-2xl"
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || state.loading}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white px-10 py-4 rounded-full font-black tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.3)]"
              >
                {state.loading ? 'КУЕМ...' : 'НАЧАТЬ ПОВЕСТЬ'}
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {state.currentStep !== GenerationStep.IDLE && (
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-4 border-b border-zinc-900 pb-12">
              <h3 className="text-4xl md:text-6xl font-cinzel font-black tracking-widest text-white uppercase">
                {state.script?.title || "Пишем свиток..."}
              </h3>
              <div className="flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-zinc-800"></span>
                <span className="text-[10px] font-black text-zinc-600 tracking-[0.3em] uppercase">
                  {state.currentStep === GenerationStep.SCRIPTING && "Составление сюжета"}
                  {state.currentStep === GenerationStep.ILLUSTRATING && "Визуализация дыхания"}
                  {state.currentStep === GenerationStep.FINISHED && "История завершена"}
                </span>
                <span className="h-px w-12 bg-zinc-800"></span>
              </div>
            </div>

            {state.error && (
              <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-200">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="font-bold uppercase tracking-tight text-sm">{state.error}</p>
              </div>
            )}

            <div className="space-y-24">
              {state.script?.panels.map((panel, idx) => (
                <PanelCard key={panel.id} panel={panel} index={idx} />
              ))}
              
              {state.currentStep === GenerationStep.SCRIPTING && (
                <div className="space-y-12 animate-pulse">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-4">
                      <div className="h-6 w-3/4 bg-zinc-900 rounded mx-auto"></div>
                      <div className="aspect-[21/9] bg-zinc-900 rounded-lg flex items-center justify-center">
                         <Wand2 className="w-12 h-12 text-zinc-800" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {state.currentStep === GenerationStep.FINISHED && (
              <div className="pt-12 flex flex-col items-center gap-6">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
                <div className="flex gap-4">
                  <button onClick={reset} className="px-8 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded-full text-xs font-black tracking-widest flex items-center gap-2 transition-all uppercase border border-zinc-800">
                    <RotateCcw className="w-4 h-4" /> Новый свиток
                  </button>
                  <button className="px-8 py-3 bg-white text-black hover:bg-zinc-200 rounded-full text-xs font-black tracking-widest flex items-center gap-2 transition-all uppercase shadow-xl">
                    <Download className="w-4 h-4" /> Сохранить книгу
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-zinc-950 bg-black">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-zinc-800 text-[9px] tracking-[0.4em] font-black uppercase">
            Создано с помощью Gemini AI • Фанатский проект по мотивам «Клинок, рассекающий демонов»
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
