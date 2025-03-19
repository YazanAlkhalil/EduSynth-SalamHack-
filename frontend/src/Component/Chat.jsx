import React, { useState } from 'react';
import { Send, Bot, User, FileText, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import axios from 'axios';
import ContentDisplay from './ContentDisplay';
import VoiceChat from './VoiceChat'; // Add this import


// Main Chat component
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedOption1, setSelectedOption1] = useState('beginner');
  const [selectedOption2, setSelectedOption2] = useState('lesson');
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  // Add new state variables for quiz functionality
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0, percentage: 0 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/generate-content',
        {
          prompt: input,
          difficultyLevel: selectedOption1,
          format: selectedOption2,
        }
      );
      
      const assistantResponse = {
        role: 'assistant',
        content: 'I\'ve generated the content for you!',
        generatedContent: response.data
      };

      setMessages(prev => [...prev, assistantResponse]);
    } catch (error) {
      console.error('Error generating content:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating content. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!input.trim()) {
      return; // Don't proceed if input is empty
    }
    
    setLoadingQuiz(true);
    
    try {
      const response = await axios.post(
        'http://localhost:3000/api/generate-quizes',
        { params: input }
      );
      
      setQuizQuestions(response.data.questions || []);
      setShowQuiz(true);
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setUserAnswers({});
      setQuizCompleted(false);
      setQuizScore({ correct: 0, total: 0, percentage: 0 });
    } catch (error) {
      console.error('Error generating quiz:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating the quiz. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(userAnswers[quizQuestions[currentQuestionIndex + 1].id] || null);
      setShowExplanation(false);
    } else if (currentQuestionIndex === quizQuestions.length - 1 && !quizCompleted) {
      // Calculate final score when reaching the last question
      calculateQuizScore();
    }
  };

  const calculateQuizScore = () => {
    let correctCount = 0;
    const total = quizQuestions.length;
    
    // Count correct answers
    Object.keys(userAnswers).forEach(questionId => {
      const question = quizQuestions.find(q => q.id === questionId);
      if (question && userAnswers[questionId] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    const percentage = Math.round((correctCount / total) * 100);
    setQuizScore({
      correct: correctCount,
      total: total,
      percentage: percentage
    });
    setQuizCompleted(true);
  };

  const getGradeLabel = (percentage) => {
    if (percentage >= 90) return { label: "Excellent", color: "text-green-400" };
    if (percentage >= 80) return { label: "Very Good", color: "text-green-500" };
    if (percentage >= 70) return { label: "Good", color: "text-blue-400" };
    if (percentage >= 60) return { label: "Satisfactory", color: "text-yellow-400" };
    if (percentage >= 50) return { label: "Pass", color: "text-orange-400" };
    return { label: "Needs Improvement", color: "text-red-400" };
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setQuizCompleted(false);
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[quizQuestions[currentQuestionIndex - 1].id] || null);
      setShowExplanation(false);
    }
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
    setUserAnswers({
      ...userAnswers,
      [quizQuestions[currentQuestionIndex].id]: option
    });
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  const closeQuiz = () => {
    setShowQuiz(false);
  };

  const handleGenerateFlashcards = async () => {
    console.log('tests');
    
    if (!input.trim()) {
      alert('Please enter a topic for flashcards');
      return;
    }
    
    setLoadingFlashcards(true);
    
    try {
      const response = await axios.post(
        'http://localhost:3000/api/generate-flashcards',
        { prompt: input }
      );
      
      setFlashcards(response.data);
      setShowFlashcards(true);
      setCurrentCardIndex(0);
      setFlipped(false);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('Failed to generate flashcards. Please try again.');
    } finally {
      setLoadingFlashcards(false);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setFlipped(false);
    }
  };

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  const closeFlashcards = () => {
    setShowFlashcards(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    setMessages([]);
  };


  const createRippleEffect = (event) => {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    ripple.className = 'flashcard-click-ripple';
    
    // Remove existing ripples
    const existingRipple = button.querySelector('.flashcard-click-ripple');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

   // Inside the Chat component, add this function to handle voice input
   const handleVoiceInput = (transcript) => {
    if (transcript.trim()) {
      setInput(transcript);
    }
  };
  

  return (
    <div>
      <div className="flex h-screen bg-[#0E1525] text-white">
        {isSidebarOpen && (
          <div className="w-80 border-r border-[#1E2537] p-4 relative">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-xl font-semibold">Edusynth AI</h1>
            </div>
            <button
              onClick={handleNewChat}
              className="w-full py-3 px-4 rounded-lg bg-[#1E2537] hover:bg-[#2A3343] text-left"
            >
              New Chat
            </button>

            <button
              onClick={toggleSidebar}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 p-2 bg-[#1E2537] rounded-full hover:bg-[#2A3343] z-50"
            >
              {isSidebarOpen ? (
                <ChevronLeft size={20} className="text-white" />
              ) : (
                <ChevronRight size={20} className="text-white" />
              )}
            </button>
          </div>
        )}

        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed left-0 top-1/2 transform -translate-y-1/2 p-2 bg-[#1E2537] rounded-r-full hover:bg-[#2A3343] z-50"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        )}

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-auto p-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-[#1E2537] rounded-full mx-auto flex items-center justify-center">
                    <Bot size={32} />
                  </div>
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    How can I help you today?
                  </h2>
                  <p className="text-gray-400 font-medium bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
                    Ask me anything or start a conversation
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-4 ${
                      message.role === 'assistant' ? 'bg-[#1E2537]' : ''
                    } p-4 rounded-lg`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'assistant' ? 'bg-blue-600' : 'bg-green-600'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <Bot size={20} />
                      ) : (
                        <User size={20} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">
                        {message.role === 'assistant' ? 'Edusynth AI' : 'You'}
                      </p>
                      <p className="text-gray-300">{message.content}</p>
                      {message.generatedContent && (
                        <ContentDisplay content={message.generatedContent} />
                      )}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="bg-[#1E2537] p-6 rounded-lg text-center">
                    <div className="animate-bounce flex justify-center mb-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-1 animate-bounce delay-100"></div>
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Generating your content...</h3>
                    <p className="text-gray-300">This might take a minute or two. Maybe grab a snack or a cup of coffee while I work my magic! ✨</p>
                    <div className="mt-4 text-gray-400 italic">
                      Fun fact: The average person spends 6 months of their life waiting for red lights to turn green.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-[#1E2537] p-4">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
              <div className="flex gap-4 mb-4">
                <select
                  value={selectedOption1}
                  onChange={(e) => setSelectedOption1(e.target.value)}
                  className="w-1/2 bg-[#1E2537] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer border border-[#2A3343] hover:border-blue-400 transition-colors relative"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5 7.5L10 12.5L15 7.5\" stroke=\"%236B7280\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
                >
                <option value="beginner">مبتدئ</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">متقدم</option>
                </select>
                <select
                  value={selectedOption2}
                  onChange={(e) => setSelectedOption2(e.target.value)}
                  className="w-1/2 bg-[#1E2537] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer border border-[#2A3343] hover:border-blue-400 transition-colors"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5 7.5L10 12.5L15 7.5\" stroke=\"%236B7280\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center" }}
                >
                <option value="lesson">درس</option>
                <option value="article">مقالة</option>
                </select>
              </div>
             
              
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message Edusynth AI..."
                  className="w-full bg-[#1E2537] rounded-lg py-4 px-6 pr-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading || loadingFlashcards}
                />
                <div className="absolute right-14 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <VoiceChat 
                    onTranscript={handleVoiceInput} 
                    disabled={loading || loadingFlashcards}
                  />
                  
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={handleGenerateFlashcards}
                      className="p-2 hover:bg-[#2A3343] rounded-lg transition-colors"
                      disabled={loading || loadingFlashcards || !input.trim()}
                    >
                      <BookOpen size={20} className={input.trim() && !loading && !loadingFlashcards ? "text-green-500" : "text-gray-500"} />
                    </button>
                    <div className="absolute -top-8 right-0 bg-[#1E2537] text-white text-sm px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Generate Flashcards
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={handleGenerateQuiz}
                      className="p-2 hover:bg-[#2A3343] rounded-lg transition-colors"
                      disabled={loading || loadingQuiz || !input.trim()}
                    >
                      <FileText size={20} className={input.trim() && !loading && !loadingQuiz ? "text-blue-500" : "text-gray-500"} />
                    </button>
                    <div className="absolute -top-8 right-0 bg-[#1E2537] text-white text-sm px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Generate Quiz
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-[#2A3343] rounded-lg transition-colors"
                  disabled={!input.trim() || loading || loadingFlashcards}
                >
                  <Send size={20} className={input.trim() && !loading && !loadingFlashcards ? 'text-blue-500' : 'text-gray-500'} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Flashcards Modal */}
      {showFlashcards && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1E2537] to-[#121827] rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-blue-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Flashcards</h2>
              <button 
                onClick={closeFlashcards}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            
            {flashcards.length > 0 ? (
              <>
                <div 
                  className="relative flashcard-container bg-gradient-to-br from-[#0E1525] to-[#1A1F35] rounded-lg p-6 mb-6 h-72 cursor-pointer shadow-lg border border-blue-500/10"
                  onClick={(e) => {
                    toggleFlip();
                    createRippleEffect(e);
                  }}
                >
                  <div className={`w-full h-full transition-all duration-700 overflow-wrap break-words whitespace-break-spaces ${flipped ? 'flashcard-flip' : ''}`}>
                    <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-4">
                      <p className="text-2xl font-medium text-center text-white font-sans">
                        {flashcards[currentCardIndex]?.question}
                      </p>
                      <p className="text-sm text-blue-400 mt-4 animate-pulse">Click to reveal answer</p>
                    </div>
                    <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-4 flashcard-back">
                      <p className="text-xl text-center text-white font-sans">
                        {flashcards[currentCardIndex]?.answer}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <button 
                    onClick={handlePrevCard}
                    disabled={currentCardIndex === 0}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${currentCardIndex === 0 ? 'bg-gray-700 text-gray-500' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'}`}
                  >
                    Previous
                  </button>
                  
                  <p className="text-white font-medium">
                    {currentCardIndex + 1} of {flashcards.length}
                  </p>
                  
                  <button 
                    onClick={handleNextCard}
                    disabled={currentCardIndex === flashcards.length - 1}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${currentCardIndex === flashcards.length - 1 ? 'bg-gray-700 text-gray-500' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'}`}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-400">No flashcards available</p>
            )}
          </div>
        </div>
      )}

      {/* Loading Flashcards Overlay */}
      {loadingFlashcards && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#1E2537] rounded-xl p-8 max-w-md w-full text-center">
            <div className="animate-bounce flex justify-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1 animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-200"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Generating flashcards...</h3>
            <p className="text-gray-300">Creating the perfect study aids for you!</p>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      {showQuiz && quizQuestions.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#1E2537] to-[#121827] rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-blue-500/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Quiz</h2>
              <button 
                onClick={closeQuiz}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            
            {quizCompleted ? (
              <div className="bg-gradient-to-br from-[#0E1525] to-[#1A1F35] rounded-lg p-6 mb-6 shadow-lg border border-blue-500/10">
                <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Quiz Results
                </h3>
                
                <div className="flex justify-center mb-6">
                  <div className="w-40 h-40 rounded-full border-8 border-blue-500/30 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl font-bold text-white">{quizScore.percentage}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <p className="text-xl font-medium text-white">
                    You got <span className="text-blue-400">{quizScore.correct}</span> out of <span className="text-blue-400">{quizScore.total}</span> questions correct
                  </p>
                  <p className={`text-2xl font-bold mt-2 ${getGradeLabel(quizScore.percentage).color}`}>
                    {getGradeLabel(quizScore.percentage).label}
                  </p>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all duration-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#0E1525] to-[#1A1F35] rounded-lg p-6 mb-6 shadow-lg border border-blue-500/10">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-blue-400">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                  <span className="text-sm text-blue-400">
                    {Object.keys(userAnswers).length} of {quizQuestions.length} answered
                  </span>
                </div>
                
                <h3 className="text-xl font-medium text-white mb-4">
                  {quizQuestions[currentQuestionIndex]?.question}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {quizQuestions[currentQuestionIndex]?.options && 
                    Object.entries(quizQuestions[currentQuestionIndex].options).map(([key, value]) => (
                      <div 
                        key={key}
                        onClick={() => handleAnswerSelect(key)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedAnswer === key 
                            ? showExplanation
                              ? key === quizQuestions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-600/30 border border-green-500'
                                : 'bg-red-600/30 border border-red-500'
                              : 'bg-blue-600/30 border border-blue-500'
                            : 'bg-[#1E2537] hover:bg-[#2A3343] border border-transparent'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                            selectedAnswer === key ? 'bg-blue-500' : 'bg-[#2A3343]'
                          }`}>
                            {key}
                          </div>
                          <span className="text-white">{value}</span>
                          {showExplanation && key === quizQuestions[currentQuestionIndex].correctAnswer && (
                            <span className="ml-auto text-green-400">✓</span>
                          )}
                          {showExplanation && selectedAnswer === key && key !== quizQuestions[currentQuestionIndex].correctAnswer && (
                            <span className="ml-auto text-red-400">✗</span>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
                
                {selectedAnswer && (
                  <button
                    onClick={toggleExplanation}
                    className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium transition-all duration-200 mb-4"
                  >
                    {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                )}
                
                {showExplanation && (
                  <div className={`p-4 rounded-lg mb-4 ${
                    selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer
                      ? 'bg-green-600/20 border border-green-500/50'
                      : 'bg-red-600/20 border border-red-500/50'
                  }`}>
                    <p className="text-white">
                      {quizQuestions[currentQuestionIndex].explanation}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <button 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0 || quizCompleted}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentQuestionIndex === 0 || quizCompleted
                    ? 'bg-gray-700 text-gray-500' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
                }`}
              >
                Previous
              </button>
              
              {!quizCompleted ? (
                <button 
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswer}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    !selectedAnswer
                      ? 'bg-gray-700 text-gray-500' 
                      : currentQuestionIndex === quizQuestions.length - 1
                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
                  }`}
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
                </button>
              ) : (
                <button 
                  onClick={closeQuiz}
                  className="px-4 py-2 rounded-lg transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Quiz Overlay */}
      {loadingQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#1E2537] rounded-xl p-8 max-w-md w-full text-center">
            <div className="animate-bounce flex justify-center mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1 animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Generating quiz...</h3>
            <p className="text-gray-300">Creating challenging questions to test your knowledge!</p>
          </div>
        </div>
      )}

      {/* Loading Flashcards Overlay */}
      {/* ... existing loading flashcards overlay code ... */}
    </div>
  );
};

export default Chat;