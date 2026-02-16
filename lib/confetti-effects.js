// confetti-effects.js - JavaScript for cinematic leaderboard effects

// Function to create confetti effect
export function createConfettiEffect(x, y) {
  const container = document.querySelector('.confetti-container');
  if (!container) return;
  
  // Clear previous confetti
  container.innerHTML = '';
  container.style.opacity = '1';
  
  // Create confetti pieces
  for (let i = 0; i < 150; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    
    // Random properties
    const size = Math.random() * 10 + 5;
    const color = getRandomGoldColor();
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 3 + 2;
    const rotation = Math.random() * 360;
    
    // Position at click location
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = color;
    confetti.style.transform = `rotate(${rotation}deg)`;
    confetti.style.borderRadius = Math.random() > 0.5 ? '0%' : '50%'; // Circle or square
    
    // Add to container
    container.appendChild(confetti);
    
    // Animate
    const animation = confetti.animate([
      { 
        transform: `translate(0, 0) rotate(0deg)`,
        opacity: 1
      },
      { 
        transform: `translate(${Math.cos(angle) * velocity * 100}px, ${Math.sin(angle) * velocity * 100}px) rotate(${rotation + 360}deg)`,
        opacity: 0
      }
    ], {
      duration: Math.random() * 3000 + 2000,
      easing: 'cubic-bezier(0, .9, .57, 1)',
    });
    
    // Remove element after animation
    animation.onfinish = () => {
      confetti.remove();
    };
  }
  
  // Fade out container after delay
  setTimeout(() => {
    container.style.opacity = '0';
  }, 2000);
}

// Function to create particle explosion
export function createParticleExplosion(x, y) {
  const container = document.body;
  
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle-explosion';
    
    // Random properties
    const size = Math.random() * 6 + 2;
    const color = getRandomGoldColor();
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 3 + 1;
    
    // Position at click location
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    
    // Add to container
    container.appendChild(particle);
    
    // Animate
    const animation = particle.animate([
      { 
        transform: `translate(0, 0)`,
        opacity: 1
      },
      { 
        transform: `translate(${Math.cos(angle) * velocity * 100}px, ${Math.sin(angle) * velocity * 100}px)`,
        opacity: 0
      }
    ], {
      duration: Math.random() * 1000 + 1000,
      easing: 'cubic-bezier(0, .9, .57, 1)',
    });
    
    // Remove element after animation
    animation.onfinish = () => {
      particle.remove();
    };
  }
}

// Function to intensify spotlight
export function intensifySpotlight() {
  const spotlight = document.querySelector('.spotlight-effect');
  if (!spotlight) return;
  
  spotlight.classList.add('spotlight-intensify');
  
  // Remove class after animation completes
  setTimeout(() => {
    spotlight.classList.remove('spotlight-intensify');
  }, 1000);
}

// Helper function to get random gold-like color
function getRandomGoldColor() {
  const goldShades = [
    '#D4AF37', // Classic gold
    '#FFD700', // Yellow gold
    '#F1C40F', // Bright gold
    '#F39C12', // Orange-gold
    '#E67E22', // Bronze
    '#B8860B', // Dark goldenrod
  ];
  
  return goldShades[Math.floor(Math.random() * goldShades.length)];
}