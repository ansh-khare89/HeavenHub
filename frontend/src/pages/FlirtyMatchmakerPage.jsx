import { useState } from 'react';
import { motion } from 'framer-motion';

const questions = [
  {
    id: 1,
    question: "What's your ideal first date vibe?",
    options: [
      { text: "Cozy cabin, roaring fire, maybe some emotional baggage.", value: "cozy" },
      { text: "Penthouse views and judging people from a balcony.", value: "luxury" },
      { text: "Getting lost in a crowded market and arguing over maps.", value: "urban" },
      { text: "Beachside drinks where we pretend we're on a diet.", value: "beach" }
    ]
  },
  {
    id: 2,
    question: "How do you handle mornings?",
    options: [
      { text: "I need 3 coffees before I remember my name.", value: "urban" },
      { text: "Watching the sunrise while doing yoga (I will lie about this).", value: "beach" },
      { text: "Ordering room service and refusing to wear pants.", value: "luxury" },
      { text: "Waking up freezing because I forgot to chop wood.", value: "cozy" }
    ]
  }
];

export function FlirtyMatchmakerPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [match, setMatch] = useState(null);

  const handleAnswer = (val) => {
    const newAnswers = [...answers, val];
    setAnswers(newAnswers);
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Logic for match based on the flirty answers
      const tallies = newAnswers.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
      const topMatch = Object.keys(tallies).reduce((a, b) => tallies[a] > tallies[b] ? a : b);
      
      const matchMap = {
        cozy: "The Clingy Cabin (Cuddles mandatory, Wi-Fi optional)",
        luxury: "The Sugar Daddy Suite (You better have a platinum card)",
        urban: "The City Sinner Loft (Sleepless nights guaranteed)",
        beach: "The Sun-Kissed Shack (Sand will be everywhere, deal with it)"
      };
      
      setMatch(matchMap[topMatch]);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-sky-500/10" />
      
      <div className="relative z-10 max-w-2xl w-full p-8 rounded-3xl bg-navy-950/60 backdrop-blur-xl border border-pink-500/30 shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)]">
        
        {!match ? (
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 mb-2">
              Vibe Check
            </h1>
            <p className="text-slate-400 mb-8">Choose your poison. Let's filter out the boring stays.</p>
            
            <h2 className="text-2xl font-semibold mb-6">{questions[currentQ].question}</h2>
            
            <div className="flex flex-col gap-4">
              {questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.value)}
                  className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all text-slate-200"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
             <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-400 mb-4 tracking-tight">
              It's a Match! 🔥
            </h1>
            <p className="text-slate-300 text-lg mb-8">Based on your highly questionable choices, we recommend:</p>
            <div className="text-3xl font-bold p-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl border border-pink-500/40 text-pink-200 shadow-glow mb-8">
              {match}
            </div>
            
            <button 
              onClick={() => { setMatch(null); setCurrentQ(0); setAnswers([]); }}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Nah, let's roll the dice again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
