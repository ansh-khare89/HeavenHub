import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { request } from '../api/client.js';

export function RoastMyStayPage() {
  const [roasts, setRoasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoast, setNewRoast] = useState({ propertyName: '', authorName: '', roastText: '', roastLevel: 'SPICY' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRoasts();
  }, []);

  const fetchRoasts = async () => {
    try {
      const data = await request('/api/roasts');
      setRoasts(data);
    } catch (err) {
       // Mock data fallback if backend is not started/ready
       setRoasts([
          { id: 1, propertyName: "Seaview Villa", authorName: "Karen", roastText: "The only 'sea view' I got was a puddle in the driveway. The mattress felt like a geometry problem.", roastLevel: "EMOTIONAL_DAMAGE" },
          { id: 2, propertyName: "Cozy Cabin", authorName: "CityBoy99", roastText: "Cozy is just real estate speak for 'you will smell your partner's thoughts'. Zero cell service.", roastLevel: "SPICY" },
        ]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await request('/api/roasts', {
        method: 'POST',
        body: newRoast,
      });
      
      toast.success("Trash talk served hot 🔥");
      setNewRoast({ propertyName: '', authorName: '', roastText: '', roastLevel: 'SPICY' });
      fetchRoasts();
    } catch(err) {
      toast.error("Failed to connect. The server is hiding in fear.");
      // Mock add for now
      setRoasts([{...newRoast, id: Date.now()}, ...roasts]);
      setNewRoast({ propertyName: '', authorName: '', roastText: '', roastLevel: 'SPICY' });
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4 inline-block drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
          Trash Talk
        </h1>
        <p className="text-slate-400 text-lg">Did the host lie about the Wi-Fi? Bed felt like a rock? Vent it all out here.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="p-6 rounded-2xl bg-navy-900 border border-orange-500/20 shadow-glow-sm">
             <h2 className="text-xl font-bold text-white mb-4">Spill the tea</h2>
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <input 
                 className="w-full bg-navy-950 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500"
                 placeholder="Property Name"
                 value={newRoast.propertyName}
                 onChange={e => setNewRoast({...newRoast, propertyName: e.target.value})}
                 required
               />
               <input 
                 className="w-full bg-navy-950 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500"
                 placeholder="Your Name (or alias)"
                 value={newRoast.authorName}
                 onChange={e => setNewRoast({...newRoast, authorName: e.target.value})}
                 required
               />
               <textarea 
                 className="w-full bg-navy-950 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 min-h-[100px]"
                 placeholder="Spill the tea..."
                 value={newRoast.roastText}
                 onChange={e => setNewRoast({...newRoast, roastText: e.target.value})}
                 required
               />
               <select
                 className="w-full bg-navy-950 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500"
                 value={newRoast.roastLevel}
                 onChange={e => setNewRoast({...newRoast, roastLevel: e.target.value})}
               >
                 <option value="MILD">Mild 🌶️</option>
                 <option value="SPICY">Spicy 🌶️🌶️</option>
                 <option value="EMOTIONAL_DAMAGE">Emotional Damage 💀</option>
               </select>
               <button 
                 disabled={submitting}
                 className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-red-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
               >
                 {submitting ? 'Igniting...' : 'Combust'}
               </button>
             </form>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          {loading ? (
             <div className="text-center text-slate-400 py-10">Fetching the burn unit...</div>
          ) : roasts.length === 0 ? (
             <div className="text-center text-slate-400 py-10">No trash talk yet. Be the first to expose a bad stay.</div>
          ) : (
            roasts.map(roast => (
              <div key={roast.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-sky-200">{roast.propertyName}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    roast.roastLevel === 'EMOTIONAL_DAMAGE' ? 'bg-red-500/20 text-red-400' :
                    roast.roastLevel === 'SPICY' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {roast.roastLevel.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-300 italic mb-4">"{roast.roastText}"</p>
                <div className="text-sm text-slate-500">— Spilled by {roast.authorName}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
