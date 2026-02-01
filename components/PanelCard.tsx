
import React from 'react';
import { ComicPanel } from '../types';
import { Loader2, AlertCircle } from 'lucide-react';

interface PanelCardProps {
  panel: ComicPanel;
  index: number;
}

const PanelCard: React.FC<PanelCardProps> = ({ panel, index }) => {
  return (
    <div className="relative mb-12 last:mb-0 group">
      {/* Decorative vertical line for the "scroll" feel */}
      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-900/0 via-red-600/40 to-red-900/0 hidden md:block"></div>
      
      <div className="flex flex-col gap-6">
        {/* Caption - Book Style */}
        {panel.status === 'completed' && panel.caption && (
          <div className="max-w-3xl mx-auto w-full">
            <div className="bg-zinc-900/50 border-l-4 border-red-600 p-4 shadow-xl">
              <p className="text-zinc-300 italic font-serif leading-relaxed text-lg">
                «{panel.caption}»
              </p>
            </div>
          </div>
        )}

        {/* Image Frame */}
        <div className="relative max-w-5xl mx-auto w-full border-[1px] border-zinc-800 bg-zinc-950 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-2 left-2 z-10 bg-black/80 px-2 py-0.5 text-[8px] font-bold tracking-widest text-zinc-500 border border-zinc-800 uppercase">
            Сцена {index + 1}
          </div>

          <div className="aspect-[21/9] md:aspect-[21/9] w-full flex items-center justify-center relative min-h-[300px]">
            {panel.status === 'generating' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
                <p className="text-[10px] font-cinzel text-zinc-500 uppercase tracking-[0.3em]">Стиль Дыхания: Рисование...</p>
              </div>
            )}

            {panel.status === 'error' && (
              <div className="flex flex-col items-center gap-2 p-8 text-center">
                <AlertCircle className="w-10 h-10 text-orange-800" />
                <p className="text-xs text-zinc-600 uppercase">Демоническое вмешательство. Ошибка.</p>
              </div>
            )}

            {panel.imageUrl && (
              <img 
                src={panel.imageUrl} 
                alt={panel.panelDescription}
                className="w-full h-full object-cover transition-opacity duration-1000"
              />
            )}

            {/* Dialogue Overlay */}
            {panel.dialogue && panel.status === 'completed' && (
              <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 max-w-[40%]">
                <div className="bg-white px-4 py-3 rounded-tr-3xl rounded-bl-3xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <p className="text-black text-sm font-bold leading-tight font-sans">
                    {panel.dialogue}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelCard;
