import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function CelebrationModal({ isOpen, onClose, clientName }) {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti!
      const duration = 5000;
      const end = Date.now() + duration;

      const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl p-12 max-w-2xl mx-4 shadow-2xl transform animate-bounce">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-pulse">🎉</div>
          <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">
            CONGRATULATIONS!
          </h2>
          <p className="text-3xl font-bold text-white mb-6 drop-shadow-md">
            YOU HAVE A NEW ACTIVE CLIENT!
          </p>
          <div className="bg-white/20 backdrop-blur rounded-xl p-6 mb-6">
            <p className="text-4xl font-black text-white drop-shadow-lg">
              {clientName}
            </p>
          </div>
          <p className="text-xl text-white/90 mb-8">
            Keep up the amazing work! 🚀
          </p>
          <button
            onClick={onClose}
            className="px-8 py-4 bg-white text-green-600 rounded-full font-black text-xl hover:bg-gray-100 shadow-xl transform hover:scale-105 transition"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
}