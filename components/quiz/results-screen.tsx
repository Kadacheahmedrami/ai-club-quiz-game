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
    setIsGeneratingImage(true);
    
    try {
      // Create a hidden div with Instagram story dimensions
      const instagramStoryDiv = document.createElement('div');
      instagramStoryDiv.style.position = 'absolute';
      instagramStoryDiv.style.left = '-9999px';
      instagramStoryDiv.style.width = '1080px';
      instagramStoryDiv.style.height = '1920px';
      instagramStoryDiv.style.backgroundColor = '#4c1d95'; // indigo-900
      instagramStoryDiv.style.display = 'flex';
      instagramStoryDiv.style.flexDirection = 'column';
      instagramStoryDiv.style.alignItems = 'center';
      instagramStoryDiv.style.justifyContent = 'space-between';
      instagramStoryDiv.style.padding = '64px';
      instagramStoryDiv.style.boxSizing = 'border-box';
      instagramStoryDiv.style.overflow = 'hidden';
      instagramStoryDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      
      // Add gradient background
      instagramStoryDiv.style.background = 'linear-gradient(to bottom, #4c1d95, #5b21b6, #7e22ce)'; // indigo-900 to purple-900 to violet-900
      
      // Create decorative elements
      const decorationsDiv = document.createElement('div');
      decorationsDiv.style.position = 'absolute';
      decorationsDiv.style.top = '0';
      decorationsDiv.style.left = '0';
      decorationsDiv.style.width = '100%';
      decorationsDiv.style.height = '100%';
      decorationsDiv.style.opacity = '0.2';
      decorationsDiv.innerHTML = `
        <div style="position: absolute; top: 80px; left: 40px; width: 160px; height: 160px; border-radius: 50%; background-color: #22d3ee; filter: blur(60px);"></div>
        <div style="position: absolute; bottom: 160px; right: 40px; width: 240px; height: 240px; border-radius: 50%; background-color: #f472b6; filter: blur(60px);"></div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 320px; height: 320px; border-radius: 50%; background-color: #a855f7; filter: blur(60px);"></div>
      `;
      instagramStoryDiv.appendChild(decorationsDiv);
      
      // Create header section
      const headerDiv = document.createElement('div');
      headerDiv.style.zIndex = '10';
      headerDiv.style.width = '100%';
      headerDiv.style.display = 'flex';
      headerDiv.style.flexDirection = 'column';
      headerDiv.style.alignItems = 'center';
      headerDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
          </svg>
          <h1 style="font-size: 32px; font-weight: bold; color: white; margin: 0;">@school_of_ai</h1>
        </div>
        <p style="font-size: 20px; color: #a5f3fc; text-align: center;">Bejaia School of AI Club</p>
      `;
      instagramStoryDiv.appendChild(headerDiv);
      
      // Create middle section with results
      const middleSection = document.createElement('div');
      middleSection.style.zIndex = '10';
      middleSection.style.display = 'flex';
      middleSection.style.flexDirection = 'column';
      middleSection.style.alignItems = 'center';
      middleSection.style.justifyContent = 'center';
      middleSection.style.flexGrow = '1';
      middleSection.innerHTML = `
        <div style="width: 320px; height: 320px; border-radius: 50%; background: linear-gradient(135deg, #22d3ee, #3b82f6); display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); overflow: hidden; margin-bottom: 32px;">
          <img src="${getCharacterImage(percentage)}" alt="Jujutsu Character" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        
        <h2 style="font-size: 72px; font-weight: bold; color: white; margin: 0 0 32px 0;">${percentage}%</h2>
        <p style="font-size: 36px; font-weight: 600; color: white; text-align: center; max-width: 80%; line-height: 1.3; margin-bottom: 32px;">
          ${getMessage(percentage)}
        </p>
        
        <div style="background-color: rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px); border: 1px solid rgba(34, 211, 238, 0.3); border-radius: 16px; padding: 32px; width: 100%; max-width: 600px;">
          <div style="display: flex; justify-content: space-around; align-items: center;">
            <div style="text-align: center;">
              <p style="color: #67e8f9; font-size: 24px; margin: 0 0 8px 0;">Score</p>
              <p style="font-size: 48px; font-weight: bold; color: white; margin: 0;">${score}</p>
            </div>
            <div style="width: 4px; height: 80px; background-color: rgba(34, 211, 238, 0.3);"></div>
            <div style="text-align: center;">
              <p style="color: #67e8f9; font-size: 24px; margin: 0 0 8px 0;">Total</p>
              <p style="font-size: 48px; font-weight: bold; color: white; margin: 0;">${totalQuestions}</p>
            </div>
            <div style="width: 4px; height: 80px; background-color: rgba(34, 211, 238, 0.3);"></div>
            <div style="text-align: center;">
              <p style="color: #67e8f9; font-size: 24px; margin: 0 0 8px 0;">Correct</p>
              <p style="font-size: 48px; font-weight: bold; color: #34d399; margin: 0;">${score}</p>
            </div>
          </div>
        </div>
      `;
      instagramStoryDiv.appendChild(middleSection);
      
      // Create footer section
      const footerDiv = document.createElement('div');
      footerDiv.style.zIndex = '10';
      footerDiv.style.width = '100%';
      footerDiv.style.display = 'flex';
      footerDiv.style.flexDirection = 'column';
      footerDiv.style.alignItems = 'center';
      footerDiv.innerHTML = `
        <p style="font-size: 36px; font-weight: bold; color: white; text-align: center; margin-bottom: 32px;">
          ${userName ? `${userName}'s` : 'Your'} Jujutsu Quiz Results
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 32px;">
          <span style="background-color: #06b6d4; color: white; padding: 12px 24px; border-radius: 50px; font-size: 24px;">#JujutsuQuiz</span>
          <span style="background-color: #a855f7; color: white; padding: 12px 24px; border-radius: 50px; font-size: 24px;">#SchoolOfAI</span>
          <span style="background-color: #ec4899; color: white; padding: 12px 24px; border-radius: 50px; font-size: 24px;">#CursedEnergy</span>
          <span style="background-color: #6366f1; color: white; padding: 12px 24px; border-radius: 50px; font-size: 24px;">#ChallengeAccepted</span>
        </div>
        <p style="font-size: 28px; color: #a5f3fc; text-align: center;">
          Tag us @school_of_ai for a chance to be featured!
        </p>
      `;
      instagramStoryDiv.appendChild(footerDiv);
      
      // Add the Instagram story div to the body
      document.body.appendChild(instagramStoryDiv);
      
      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate canvas from the Instagram story div
      const canvas = await html2canvas(instagramStoryDiv, {
        backgroundColor: null,
        scale: 1, // Standard scale for Instagram story dimensions
        useCORS: true,
        allowTaint: true
      });
      
      // Remove the temporary div
      document.body.removeChild(instagramStoryDiv);
      
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
    } catch (error) {
      console.error('Error generating image:', error);
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
