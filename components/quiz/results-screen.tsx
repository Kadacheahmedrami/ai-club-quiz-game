'use client'

import { Button } from '@/components/ui/button'
import { RotateCcwIcon, ShareIcon } from 'lucide-react'
import { Instagram as InstagramIcon } from 'lucide-react'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import html2canvas from 'html2canvas'

interface ResultsScreenProps {
  score: number
  totalQuestions: number
  onPlayAgain: () => void
  userName?: string | null
}

export default function ResultsScreen({
  score,
  totalQuestions,
  onPlayAgain,
  userName,
}: ResultsScreenProps) {
  const router = useRouter();
  const [showCopied, setShowCopied] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const resultsContainerRef = useRef<HTMLDivElement>(null)
  const percentage = Math.round((score / totalQuestions) * 100)

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      // Navigate back to the quiz page to play again
      router.push('/quiz');
    }
  }

  // Function to get character image based on percentage
  const getCharacterImage = (percentage: number): string => {
    if (percentage === 100) return '/caracteres/gojo.png'; // Perfect score - Gojo
    if (percentage >= 95) return '/caracteres/sukuna.png'; // Very high score - Sukuna
    if (percentage >= 90) return '/caracteres/toji.png'; // High score - Toji
    if (percentage >= 85) return '/caracteres/mahito.png'; // High-medium score - Mahito
    if (percentage >= 80) return '/caracteres/itadori.png'; // Medium-high score - Itadori
    if (percentage >= 70) return '/caracteres/megumi.png'; // Medium score - Megumi
    if (percentage >= 60) return '/caracteres/nanami.png'; // Medium-low score - Nanami
    if (percentage >= 50) return '/caracteres/nobara.png'; // Low-medium score - Nobara
    if (percentage >= 40) return '/caracteres/maki.png'; // Low score - Maki
    if (percentage >= 30) return '/caracteres/panda.png'; // Very low score - Panda
    return '/caracteres/nauh.png'; // Lowest score - Nauh
  };

const getMessage = (percentage: number) => {
  if (percentage === 100)
    return "“Throughout Heaven and Earth, I alone am the honored one.” ";
  if (percentage >= 95)
    return "“Fool… weaklings are better off dead. Stand proud, you are strong!”";
  if (percentage >= 90)
    return "“I don’t fight because I hate people. I fight because I love my life.”";
  if (percentage >= 85)
    return "“Humans… I’ll reshape you as I please.” ";
  if (percentage >= 80)
    return "“I’m not gonna regret the way I live!” ";
  if (percentage >= 70)
    return "“I can’t save everyone… but I can save the people I can.” ";
  if (percentage >= 60)
    return "“It’s just a job. I do it for the money.” ";
  if (percentage >= 50)
    return "“I’m Nobara Kugisaki. Don’t you forget it!” ";
  if (percentage >= 40)
    return "“I’ll surpass everyone, curse or no curse.” ";
  if (percentage >= 30)
    return "“I’m Panda. Don’t underestimate me.” ";
  return "Keep training… the Jujutsu path awaits you!";
};

const handleShare = () => {
    const text = `I scored ${score}/${totalQuestions} (${percentage}%) on the Jujutsu Quiz! Can you surpass my cursed energy level? ⚡️ #JujutsuKaisen #DomainExpansion`
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    })
  }

  const handleInstagramShare = async () => {
    if (!resultsContainerRef.current) return;
    
    setIsGeneratingImage(true);
    
    try {
      // Temporarily remove backdrop blur for better screenshot quality
      const container = resultsContainerRef.current;
      const originalBackdrop = container.style.backdropFilter;
      container.style.backdropFilter = 'none';
      
      const canvas = await html2canvas(resultsContainerRef.current, {
        backgroundColor: '#1e293b', // slate-800 color
        scale: 2, // Higher resolution for better quality
        useCORS: true,
        allowTaint: true
      });
      
      // Restore backdrop blur
      container.style.backdropFilter = originalBackdrop;
      
      const imageBlob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else throw new Error('Failed to create blob from canvas');
        }, 'image/png');
      });
      
      // Create a temporary link to download the image
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `jujutsu-quiz-result-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show a message to the user about sharing on Instagram
      alert('Screenshot saved! Open Instagram, create a new story, tap the sticker icon, select "Upload", and choose this image to share your result!');
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  }


  return (
    <div className="min-h-screen flex flex-col opacity-95 items-center justify-center">
      {/* Celebration Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {score === totalQuestions && (
          <>
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-bounce" />
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce delay-100" />
            <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-cyan-300 rounded-full animate-bounce delay-200" />
          </>
        )}
      </div>

      <div className="relative z-10 w-full max-w-md px-4" ref={resultsContainerRef}>
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl text-center">
          {/* Character Image */}
          <div className="mb-8">
            <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-2xl overflow-hidden">
              <img
                src={getCharacterImage(percentage)}
                alt="Jujutsu Character"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-2xl font-bold text-white">{percentage}%</p>
          </div>

          {/* Results Text */}
          {userName && <p className="text-2xl font-bold text-cyan-300 mb-2"> {userName}!</p>}
          <p className=" text-xl font-semibold mb-6">{getMessage(percentage)}</p>

          {/* Score Details */}
          <div className="bg-slate-700/30 border border-cyan-500/20 rounded-xl p-6 mb-8">
            <div className="flex justify-around items-center">
              <div>
                <p className="text-gray-400 text-sm mb-1">Score</p>
                <p className="text-2xl font-bold text-cyan-400">{score}</p>
              </div>
              <div className="w-px h-12 bg-cyan-500/20" />
              <div>
                <p className="text-gray-400 text-sm mb-1">Total</p>
                <p className="text-2xl font-bold text-white">{totalQuestions}</p>
              </div>
              <div className="w-px h-12 bg-cyan-500/20" />
              <div>
                <p className="text-gray-400 text-sm mb-1">Correct</p>
                <p className="text-2xl font-bold text-green-400">{score}</p>
              </div>
            </div>
          </div>


          {/* Tagline */}
          <p className="text-gray-300 mb-8">
            Welcome to <span className="text-cyan-400 font-semibold">School of jujutsu</span>
            <br />
            <span className="text-sm">Master Cursed Energy • Protect Humanity</span>
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleInstagramShare}
              disabled={isGeneratingImage}
              className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <InstagramIcon size={24} />
              {isGeneratingImage ? 'Generating...' : 'Share on Instagram'}
            </Button>

         
          </div>

          {/* Footer */}
          <p className="text-gray-400 text-sm mt-8">
            Ready to become a sorcerer?
            <br />
            <span className="text-cyan-400 font-semibold">Face stronger curses next time! 🔮</span>
          </p>
        </div>
      </div>
    </div>
  )
}
