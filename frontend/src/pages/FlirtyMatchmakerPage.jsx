import { useState } from 'react';
import { motion } from 'framer-motion';

const questions = [
  {
    id: 1,
    question: "What defines your ideal luxury escape?",
    options: [
      { text: "A secluded mountain lodge with a crackling fireplace.", value: "cozy" },
      { text: "A high-rise penthouse with panoramic city views.", value: "luxury" },
      { text: "A boutique hotel steps away from cultural landmarks.", value: "urban" },
      { text: "A private beachfront villa with ocean breezes.", value: "beach" }
    ]
  },
  {
    id: 2,
    question: "How do you prefer to start your mornings on vacation?",
    options: [
      { text: "Exploring the city streets with an artisanal coffee.", value: "urban" },
      { text: "Sunrise yoga on the terrace overlooking the water.", value: "beach" },
      { text: "Ordering a lavish breakfast via room service.", value: "luxury" },
      { text: "Enjoying the crisp air on a quiet nature walk.", value: "cozy" }
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
      // Match logic based on responses
      const tallies = newAnswers.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});
      const topMatch = Object.keys(tallies).reduce((a, b) => tallies[a] > tallies[b] ? a : b);
      
      const matchMap = {
        cozy: {
          title: "The Wilderness Retreat",
          suggestion: "You appreciate tranquility and nature. A secluded cabin or forest lodge is your perfect match."
        },
        luxury: {
          title: "The Penthouse Experience",
          suggestion: "You seek the finest things in life. Five-star amenities and skyline views await your arrival."
        },
        urban: {
          title: "The Metropolitan Stay",
          suggestion: "You thrive on energy and culture. A chic downtown apartment puts you in the center of the action."
        },
        beach: {
          title: "The Coastal Sanctuary",
          suggestion: "The ocean is calling. Unwind in a beautiful seaside villa with pristine beaches at your doorstep."
        }
      };
      
      setMatch(matchMap[topMatch]);
    }
  };

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 bg-stone-50" />
      
      <div className="relative z-10 max-w-2xl w-full p-10 rounded-3xl bg-white border border-stone-200 shadow-xl">
        
        {!match ? (
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h1 className="text-4xl font-display font-bold text-hotel-accent mb-2">
              Discover Your Travel Style
            </h1>
            <p className="text-stone-500 mb-8 font-medium">Answer a few simple questions to find your perfect getaway.</p>
            
            <h2 className="text-2xl font-semibold text-stone-800 mb-6">{questions[currentQ].question}</h2>
            
            <div className="flex flex-col gap-4">
              {questions[currentQ].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.value)}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-hotel-gold/10 hover:border-hotel-gold transition-all text-stone-700 font-medium"
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
             <h1 className="text-4xl font-display font-bold text-hotel-gold mb-4 tracking-tight">
              Your Perfect Match
            </h1>
            <p className="text-stone-600 text-lg mb-8 font-medium">Based on your preferences, we recommend:</p>
            <div className="flex flex-col gap-3 p-8 bg-hotel-bg rounded-2xl border border-stone-200 shadow-sm mb-8">
              <div className="text-3xl font-display font-bold text-stone-900">{match.title}</div>
              <div className="text-lg font-normal text-stone-600 italic">{match.suggestion}</div>
            </div>
            
            <button 
              onClick={() => { setMatch(null); setCurrentQ(0); setAnswers([]); }}
              className="px-6 py-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 font-medium transition-colors"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
