import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import ParticlesBackground from '../Component/ParticlesBackground'; 

function GetStarted() {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.5 }
    });
  }, [controls]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#0E1525] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <ParticlesBackground />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        className="max-w-4xl w-full text-center space-y-6 md:space-y-8 relative z-10"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
          The AI-powered<br />developer platform
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mt-4 md:mt-6">
          Wellcome To Our Smart Learning Platform
        </p>

        <div className="flex gap-4 justify-center mt-6 md:mt-8">
          <Link to="/chat">
          <button 
  className="px-4 py-2 sm:px-6 sm:py-3 border-2 border-white rounded-lg font-semibold bg-transparent hover:bg-purple-800 hover:scale-105 transition-all"
>
  Get Started
</button>
          </Link>
        </div>

        <div className="mt-12 md:mt-16 relative">
          <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl transform rotate-12"
            ></motion.div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="absolute inset-0 bg-[#0E1525] rounded-3xl transform -rotate-12 flex items-center justify-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
            </motion.div>
          </div>
                    
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,255,0.1),transparent_70%)] pointer-events-none"></div>
        </div>
      </motion.div>
    </div>
  );
}

export default GetStarted;