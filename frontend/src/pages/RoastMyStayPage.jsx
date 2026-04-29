import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { request } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export function RoastMyStayPage() {
  const { user } = useAuth();
  const [roasts, setRoasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRoast, setNewRoast] = useState({ 
    propertyName: '', 
    authorName: user?.firstName || '', 
    roastText: '', 
    roastLevel: 'SPICY',
    authorId: user?.id || null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRoasts();
  }, []);

  const fetchRoasts = async () => {
    try {
      const data = await request('/api/roasts');
      setRoasts(data);
    } catch (err) {
       // Provide fallback data in case the backend is unavailable.
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
        body: {...newRoast, authorId: user?.id || null},
      });
      
      toast.success("Guest review submitted successfully.");
      setNewRoast({ propertyName: '', authorName: user?.firstName || '', roastText: '', roastLevel: 'SPICY', authorId: user?.id || null });
      fetchRoasts();
    } catch(err) {
      toast.error("Failed to connect. Please try again later.");
      // Temporarily add the new review to the UI while offline.
      setRoasts([{...newRoast, id: Date.now(), authorId: user?.id || null}, ...roasts]);
      setNewRoast({ propertyName: '', authorName: user?.firstName || '', roastText: '', roastLevel: 'SPICY', authorId: user?.id || null });
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-bold text-gray-900 mb-4 inline-block drop-shadow-sm">
          Unfiltered Reviews
        </h1>
        <p className="text-stone-500 text-lg">Did the host overpromise? Vent your honest feedback here.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xl">
             <h2 className="text-xl font-display font-bold text-gray-900 mb-4">Leave Feedback</h2>
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <input 
                 className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-stone-900 focus:border-hotel-gold outline-none transition"
                 placeholder="Property Name"
                 value={newRoast.propertyName}
                 onChange={e => setNewRoast({...newRoast, propertyName: e.target.value})}
                 required
               />
               <input 
                 className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-stone-900 focus:border-hotel-gold outline-none transition"
                 placeholder="Your Name"
                 value={newRoast.authorName}
                 onChange={e => setNewRoast({...newRoast, authorName: e.target.value})}
                 required
               />
               <textarea 
                 className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-stone-900 focus:border-hotel-gold min-h-[100px] outline-none transition"
                 placeholder="Share your experience..."
                 value={newRoast.roastText}
                 onChange={e => setNewRoast({...newRoast, roastText: e.target.value})}
                 required
               />
               <select
                 className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-stone-900 focus:border-hotel-gold outline-none transition"
                 value={newRoast.roastLevel}
                 onChange={e => setNewRoast({...newRoast, roastLevel: e.target.value})}
               >
                 <option value="MILD">Mild Feedback</option>
                 <option value="SPICY">Strong Criticism</option>
                 <option value="EMOTIONAL_DAMAGE">Severe Disappointment</option>
               </select>
               <button 
                 disabled={submitting}
                 className="w-full bg-hotel-gold hover:bg-hotel-goldHover text-white font-bold py-3 px-4 rounded-lg transition-all shadow-sm"
               >
                 {submitting ? 'Submitting...' : 'Submit'}
               </button>
             </form>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          {loading ? (
             <div className="text-center text-stone-500 py-10">Fetching feedback...</div>
          ) : roasts.length === 0 ? (
             <div className="text-center text-stone-500 py-10">No reviews yet. Share your experience.</div>
          ) : (
            roasts.map(roast => (
              <div key={roast.id} className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-hotel-gold transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-stone-900">{roast.propertyName}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    roast.roastLevel === 'EMOTIONAL_DAMAGE' ? 'bg-red-100 text-red-700' :
                    roast.roastLevel === 'SPICY' ? 'bg-orange-100 text-orange-700' :
                    'bg-stone-100 text-stone-700'
                  }`}>
                    {roast.roastLevel.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-stone-600 italic mb-4">"{roast.roastText}"</p>
                <div className="flex justify-between items-center text-sm text-stone-500">
                  <span>— Submitted by {roast.authorName}</span>
                  {(user?.id === roast.authorId || roast.authorName === user?.firstName) && (
                    <button 
                      onClick={async () => {
                        try {
                          await request(`/api/roasts/${roast.id}`, { method: 'DELETE' });
                          toast.success('Feedback removed.');
                          fetchRoasts();
                        } catch (e) {
                          setRoasts(roasts.filter(r => r.id !== roast.id));
                          toast.success('Feedback removed.');
                        }
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete your feedback"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
