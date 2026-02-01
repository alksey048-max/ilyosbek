
import React from 'react';
import { Sword } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-700 to-red-500 rounded-lg shadow-lg shadow-red-900/40">
            <Sword className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-cinzel font-black tracking-widest bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent uppercase">
            ХРОНИКИ КЛИНКА
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-[10px] font-black tracking-[0.2em] text-zinc-500">
          <a href="#" className="hover:text-red-500 transition-colors uppercase">Галлерея</a>
          <a href="#" className="hover:text-red-500 transition-colors uppercase">Вселенная</a>
          <a href="#" className="hover:text-red-500 transition-colors uppercase">Архив</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
