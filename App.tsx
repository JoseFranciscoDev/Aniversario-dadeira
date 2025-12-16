import React, { useState, useEffect } from 'react';
import { generateBirthdayMessage, generateDandadanGreekArt } from './services/gemini';
import { BirthdayContent, AppState } from './types';
import { Button } from './components/Button';
import { Loader } from './components/Loader';

// Spirit component for the interactive part
interface SpiritProps {
  id: number;
  x: number;
  y: number;
  onClick: (id: number) => void;
}

const Spirit: React.FC<SpiritProps> = ({ id, x, y, onClick }) => (
  <div 
    onClick={() => onClick(id)}
    className="absolute w-12 h-12 flex items-center justify-center cursor-pointer animate-float-random hover:scale-110 transition-transform z-20"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    {/* Spiritual Wisp Visualization */}
    <div className="absolute inset-0 bg-spirit-teal/20 blur-md rounded-full animate-pulse"></div>
    <div className="w-4 h-4 bg-spirit-teal rounded-full shadow-[0_0_15px_#2dd4bf] relative">
      <div className="absolute -top-1 -right-1 w-1 h-1 bg-white rounded-full opacity-70"></div>
    </div>
    <span className="absolute -bottom-6 text-[10px] text-spirit-teal opacity-50 font-mono tracking-widest">YOKAI</span>
  </div>
);

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('intro');
  const [content, setContent] = useState<BirthdayContent | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Interaction State
  const [spirits, setSpirits] = useState<{id: number, x: number, y: number}[]>([]);
  const [spiritsCaught, setSpiritsCaught] = useState(0);
  const TOTAL_SPIRITS = 5;

  const initHunt = () => {
    // Generate random positions for spirits
    const newSpirits = Array.from({ length: TOTAL_SPIRITS }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10% to 90%
      y: Math.random() * 60 + 20, // 20% to 80%
    }));
    setSpirits(newSpirits);
    setSpiritsCaught(0);
    setState('hunting');
  };

  const handleSpiritClick = (id: number) => {
    setSpirits(prev => prev.filter(s => s.id !== id));
    setSpiritsCaught(prev => {
      const newList = prev + 1;
      if (newList >= TOTAL_SPIRITS) {
        setTimeout(startGeneration, 500);
      }
      return newList;
    });
  };

  const startGeneration = async () => {
    setState('generating');
    setError(null);

    try {
      // Parallel generation for speed
      const [textData, imgData] = await Promise.all([
        generateBirthdayMessage(),
        generateDandadanGreekArt()
      ]);
      
      setContent(textData);
      setImageUrl(imgData);

      setState('reveal');
    } catch (err) {
      console.error(err);
      setError("Interferência alienígena detectada. O sinal falhou.");
      setState('error');
    }
  };

  return (
    <div className="min-h-screen bg-void-black text-marble-gray relative overflow-hidden flex flex-col items-center justify-center p-4 font-sans selection:bg-spirit-teal selection:text-void-black">
      
      {/* Subtle Background Noise/Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#2dd4bf 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-spirit-teal/20 rounded-tl-3xl m-4"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-ancient-gold/20 rounded-br-3xl m-4"></div>

      <div className="relative z-10 max-w-5xl w-full">
        
        {/* INTRO */}
        {state === 'intro' && (
          <div className="text-center space-y-12 animate-fade-in relative">
            <div className="space-y-4">
              <p className="text-spirit-teal font-mono text-sm tracking-[0.3em] uppercase opacity-80">Detectando Aniversariante</p>
              <h1 className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600">
                O Oráculo de<br/>
                <span className="text-ancient-gold italic">Eduarda</span>
              </h1>
            </div>
            
            <div className="max-w-xl mx-auto bg-surface-dark/50 border border-white/5 p-6 rounded backdrop-blur-sm">
              <p className="text-lg text-gray-300 font-light leading-relaxed">
                O véu entre os mundos está fino hoje. Uma fusão de <span className="text-spirit-teal font-bold">energias ocultas</span> e <span className="text-ancient-gold font-bold">beleza clássica</span> aguarda.
              </p>
            </div>

            <Button onClick={initHunt}>
              Iniciar Sincronização
            </Button>
          </div>
        )}

        {/* HUNTING GAME */}
        {state === 'hunting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center min-h-[60vh]">
             <h2 className="text-2xl font-serif text-white mb-8 animate-pulse text-center bg-void-black/80 px-4 py-2 rounded border border-spirit-teal/30">
              Colete os fragmentos espirituais: {spiritsCaught} / {TOTAL_SPIRITS}
            </h2>
            
            {/* Playing Field */}
            <div className="fixed inset-0 z-0">
               {spirits.map(s => (
                 <Spirit key={s.id} {...s} onClick={handleSpiritClick} />
               ))}
            </div>
            
            <p className="fixed bottom-10 text-xs font-mono text-gray-500 uppercase tracking-widest z-10">
              Clique nos orbes para selar a energia
            </p>
          </div>
        )}

        {/* LOADING */}
        {state === 'generating' && (
          <Loader text="Invocando a Turbo Granny e esculpindo o destino..." />
        )}

        {/* ERROR */}
        {state === 'error' && (
          <div className="text-center space-y-6 z-20 relative">
            <div className="text-cursed-rose text-6xl font-serif">⚠</div>
            <p className="text-xl text-gray-400 font-mono">{error}</p>
            <Button onClick={startGeneration} variant="secondary">Tentar Novamente</Button>
          </div>
        )}

        {/* REVEAL */}
        {state === 'reveal' && content && imageUrl && (
          <div className="grid lg:grid-cols-2 gap-8 items-center animate-fade-in w-full">
            
            {/* Image Section */}
            <div className="relative group perspective-1000">
              {/* Decorative Frame */}
              <div className="absolute -inset-2 bg-gradient-to-br from-spirit-teal via-transparent to-ancient-gold opacity-20 rounded-sm group-hover:opacity-40 transition-opacity duration-700"></div>
              
              <div className="relative bg-surface-dark p-3 border border-gray-800 rounded shadow-2xl overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt="Eduarda Dandadan Style" 
                  className="w-full h-auto rounded-sm filter contrast-110 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Overlay Text */}
                <div className="absolute top-6 right-6 flex flex-col items-end gap-1">
                  <span className="bg-void-black/80 text-spirit-teal text-[10px] px-2 py-1 font-mono uppercase border border-spirit-teal/30 backdrop-blur-md">
                    Target: Eduarda
                  </span>
                  <span className="bg-void-black/80 text-ancient-gold text-[10px] px-2 py-1 font-mono uppercase border border-ancient-gold/30 backdrop-blur-md">
                    Status: Divine
                  </span>
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="space-y-8 bg-surface-dark/30 p-8 rounded border-l border-spirit-teal backdrop-blur-md">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-2 leading-tight">
                  {content.title}
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-spirit-teal to-transparent mb-6"></div>
                <p className="text-lg text-gray-300 leading-relaxed font-light whitespace-pre-line">
                  {content.message}
                </p>
              </div>

              <div className="relative p-6 border border-gray-800 bg-void-black/50">
                <div className="absolute -top-3 left-4 bg-void-black px-2 text-xs text-ancient-gold uppercase tracking-[0.2em] font-serif">
                  Profecia
                </div>
                <p className="font-serif italic text-xl text-gray-400 text-center">
                  "{content.poem}" O poema foi gerado por IA, mas é porque eu não conheço palavras pra expressar os sentimentos que você traz
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-800/50">
                <span className="text-xs font-mono text-gray-600">ID: BIRTHDAY_PROTOCOL_2025</span>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-sm font-bold text-spirit-teal hover:text-white uppercase tracking-wider transition-colors"
                >
                  Reiniciar Ritual
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
      
      {/* Global CSS for particle effects */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default App;