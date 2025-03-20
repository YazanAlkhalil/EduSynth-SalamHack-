import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceChat = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US'; // Default language
      
      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
        
        if (event.results[current].isFinal) {
          onTranscript(transcriptText);
          stopListening();
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (recognition && !disabled) {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={toggleListening}
        className={`p-2 hover:bg-[#2A3343] rounded-lg transition-colors ${isListening ? 'bg-red-500/20' : ''}`}
        disabled={disabled}
      >
        {isListening ? (
          <MicOff size={20} className="text-red-500" />
        ) : (
          <Mic size={20} className={disabled ? "text-gray-500" : "text-blue-500"} />
        )}
      </button>
      <div className="absolute -top-8 right-0 bg-[#1E2537] text-white text-sm px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {isListening ? 'Stop Recording' : 'Voice Input'}
      </div>
      
      {isListening && (
        <div className="absolute bottom-12 right-0 bg-[#1E2537] text-white text-sm px-3 py-2 rounded-lg min-w-[200px] shadow-lg border border-blue-500/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-300"></div>
            </div>
            <span className="text-red-400 text-xs">Recording...</span>
          </div>
          <p className="text-gray-300 text-xs italic">
            {transcript || "Speak now..."}
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceChat;