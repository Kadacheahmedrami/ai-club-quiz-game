'use client';

import { useState, useEffect, useRef } from 'react';
import { createConfettiEffect, createParticleExplosion, intensifySpotlight } from '@/lib/confetti-effects';

interface Winner {
  name: string;
  subtitle: string;
}

interface LeaderboardClientProps {
  initialWinners: Winner[];
}

export default function LeaderboardClient({ initialWinners }: LeaderboardClientProps) {
  const [revealedCards, setRevealedCards] = useState([false, false, false]);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [winners, setWinners] = useState<Winner[]>(initialWinners);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch winners from the database
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const response = await fetch('/api/leaderboard/winners');
        if (response.ok) {
          const data = await response.json();
          setWinners(data);
        }
      } catch (error) {
        console.error('Error fetching winners:', error);
      }
    };

    fetchWinners();
  }, []);

  const handleCardClick = (index: number) => {
    if (!revealedCards[index]) {
      setRevealedCards(prev => {
        const newRevealed = [...prev];
        newRevealed[index] = true;
        return newRevealed;
      });
      setActiveCard(index);

      // Get card position for effects
      const cardElement = cardRefs.current[index];
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Trigger effects
        createConfettiEffect(x, y);
        createParticleExplosion(x, y);
        intensifySpotlight();
      }

      // Reset active card after animation completes
      setTimeout(() => setActiveCard(null), 1000);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center p-4 fade-in">
      {/* Background effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-full bg-gradient-radial from-yellow-500/10 to-transparent blur-3xl"></div>
        <div className="particles-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Spotlight effect */}
      <div className="spotlight-effect absolute top-0 left-1/2 transform -translate-x-1/2 w-[120%] h-1/2 bg-gradient-to-b from-yellow-400/10 to-transparent blur-[100px] pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
          HIDDEN WINNERS
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-12 relative">
          {/* Second Place Card */}
          <div className="flex flex-col items-center">
            <div className="place-label mb-2 text-lg md:text-xl text-gray-300 font-bold">
              🥈 Second Place
            </div>
            <div
              ref={el => cardRefs.current[1] = el}
              className={`card-container card-1 card-hover-enhance ${revealedCards[1] ? 'revealed' : ''} ${activeCard === 1 ? 'active' : ''} rounded-3xl`}
              onClick={() => handleCardClick(1)}
            >
              <div className="card-inner">
                {/* Front of card - Hidden state */}
                <div className="card-front">
                  <div className="">
                    <div className="question-mark text-7xl md:text-8xl font-bold text-yellow-400">?</div>
                  </div>
                </div>

                {/* Back of card - Revealed state */}
                <div className="card-back">
                  <div className="card-content">
                    <div className="winner-name text-2xl md:text-3xl font-serif font-bold text-yellow-400 mb-2">
                      {winners[1].name}
                    </div>
                    <div className="winner-subtitle text-base md:text-lg text-gray-300">
                      {winners[1].subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* First Place Card (centered) */}
          <div className="flex flex-col items-center first-place-container">
            <div className="place-label mb-2 text-lg md:text-xl text-yellow-400 font-bold">
              🥇 First Place
            </div>
            <div
              ref={el => cardRefs.current[0] = el}
              className={`card-container card-0 first-place card-hover-enhance ${revealedCards[0] ? 'revealed' : ''} ${activeCard === 0 ? 'active' : ''}`}
              onClick={() => handleCardClick(0)}
            >
              <div className="card-inner">
                {/* Front of card - Hidden state */}
                <div className="card-front">
                  <div className="">
                    <div className="question-mark text-7xl md:text-8xl font-bold text-yellow-400">?</div>
                  </div>
                </div>

                {/* Back of card - Revealed state */}
                <div className="card-back">
                  <div className="card-content">
                    <div className="winner-name text-2xl md:text-3xl font-serif font-bold text-yellow-400 mb-2">
                      {winners[0].name}
                    </div>
                    <div className="winner-subtitle text-base md:text-lg text-gray-300">
                      {winners[0].subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Third Place Card */}
          <div className="flex flex-col items-center third-place-down">
            <div className="place-label mb-2 text-lg md:text-xl text-amber-700 font-bold">
              🥉 Third Place
            </div>
            <div
              ref={el => cardRefs.current[2] = el}
              className={`card-container card-2 card-hover-enhance ${revealedCards[2] ? 'revealed' : ''} ${activeCard === 2 ? 'active' : ''}`}
              onClick={() => handleCardClick(2)}
            >
              <div className="card-inner">
                {/* Front of card - Hidden state */}
                <div className="card-front">
                  <div className="">
                    <div className="question-mark text-7xl md:text-8xl font-bold text-yellow-400">?</div>
                  </div>
                </div>

                {/* Back of card - Revealed state */}
                <div className="card-back">
                  <div className="card-content">
                    <div className="winner-name text-2xl md:text-3xl font-serif font-bold text-yellow-400 mb-2">
                      {winners[2].name}
                    </div>
                    <div className="winner-subtitle text-base md:text-lg text-gray-300">
                      {winners[2].subtitle}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confetti effect container */}
      <div className="confetti-container"></div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }

        @keyframes pulse {
          0% {
            box-shadow:
              0 10px 30px rgba(0, 0, 0, 0.3),
              0 5px 15px rgba(0, 0, 0, 0.2);
          }
          50% {
            box-shadow:
              0 15px 35px rgba(212, 175, 55, 0.5),
              0 8px 20px rgba(0, 0, 0, 0.3);
          }
          100% {
            box-shadow:
              0 10px 30px rgba(0, 0, 0, 0.3),
              0 5px 15px rgba(0, 0, 0, 0.2);
          }
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }

        @keyframes flipIn {
          0% {
            transform: rotateY(0deg);
            box-shadow:
              0 10px 30px rgba(0, 0, 0, 0.3),
              0 5px 15px rgba(0, 0, 0, 0.2);
          }
          50% {
            transform: rotateY(90deg);
            box-shadow:
              0 20px 40px rgba(212, 175, 55, 0.6),
              0 10px 20px rgba(0, 0, 0, 0.4);
          }
          100% {
            transform: rotateY(0deg);
            box-shadow:
              0 15px 35px rgba(212, 175, 55, 0.5),
              0 8px 20px rgba(0, 0, 0, 0.4);
          }
        }

        @keyframes confettiFall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        body {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          overflow: hidden;
          background-color: #000;
        }

        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          background-color: rgba(212, 175, 55, 0.7);
          border-radius: 50%;
          animation: float 15s infinite ease-in-out;
        }

        .card-container {
          perspective: 1500px;
          width: 300px;
          height: 300px;
          cursor: pointer;
          margin-bottom: 2rem;
        }

        .first-place {
          position: relative;
          z-index: 10;
          box-shadow:
            0 15px 35px rgba(212, 175, 55, 0.4),
            0 8px 20px rgba(0, 0, 0, 0.4);
        }

        .first-place-container {
          position: relative;
        }

        .first-place-container > div:first-child {
          position: absolute;
          top: -40px;
          left: 50%;
          transform: translateX(-50%);
        }

        .third-place-down {
          position: relative;
          margin-top: 30px;
        }

        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }

        .card-container.revealed .card-inner {
          transform: rotateY(180deg);
        }

        .card-container.active .card-inner {
          animation: flipIn 0.8s forwards;
        }

        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
          box-shadow:
            0 10px 30px rgba(0, 0, 0, 0.3),
            0 5px 15px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .card-0 .card-front {
          background:
            linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.7)),
            url('/caracteres/gojo.png') no-repeat center/cover;
          border: 2px solid rgba(212, 175, 55, 0.3);
        }

        .card-0 .card-back {
          background:
            linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.7)),
            url('/caracteres/gojo.png') no-repeat center/cover;
          border: 2px solid rgba(212, 175, 55, 0.6);
          transform: rotateY(180deg);
        }

        .card-1 .card-front {
          background:
            linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.7)),
            url('/caracteres/sukuna.png') no-repeat center/cover;
          border: 2px solid rgba(212, 175, 55, 0.3);
        }

        .card-1 .card-back {
          background:
            linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.7)),
            url('/caracteres/sukuna.png') no-repeat center/cover;
          border: 2px solid rgba(212, 175, 55, 0.6);
          transform: rotateY(180deg);
        }

        .card-2 .card-front {
          background:
            linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.7)),
            url('/caracteres/toji.png') no-repeat center/cover;
          border: 2px solid rgba(212, 175, 55, 0.3);
        }

        .card-2 .card-back {
          background:
            linear-gradient(rgba(10, 10, 10, 0.7), rgba(10, 10, 10, 0.7)),
            url('/caracteres/toji.png') no-repeat center/cover;
          border: 2px solid rgba(212, 175, 55, 0.6);
          transform: rotateY(180deg);
        }


        .card-front .card-content,
        .card-back .card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1.5rem;
          background-color: rgba(0, 0, 0, 0.4);
          border-radius: 15px;
          backdrop-filter: blur(5px);
          width: 90%;
          height: auto;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .question-mark {
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.7);
          font-size: 5rem;
        }

        .card-container:hover .card-front {
          animation: none;
          border: 2px solid rgba(212, 175, 55, 0.6);
          box-shadow:
            0 15px 35px rgba(212, 175, 55, 0.5),
            0 8px 20px rgba(0, 0, 0, 0.4);
          transform: translateY(-5px);
        }

        .card-container.active {
          animation: shake 0.5s;
        }

        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 100;
          opacity: 0;
        }

        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: #D4AF37;
          opacity: 0;
        }

        .confetti-show {
          animation: confettiShow 1s forwards;
        }

        @keyframes confettiShow {
          0% { opacity: 0; }
          10% { opacity: 1; }
          100% { opacity: 0; }
        }

        .spotlight-intensify {
          animation: spotlightIntensify 1s;
        }

        @keyframes spotlightIntensify {
          0% { opacity: 0.1; }
          50% { opacity: 0.4; }
          100% { opacity: 0.1; }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .card-container {
            width: 250px;
            height: 250px;
          }

          .question-mark {
            font-size: 6rem;
          }

          h1 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
