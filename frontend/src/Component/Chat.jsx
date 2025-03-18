import React, { useState } from 'react';
import { Send, Bot, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import ContentDisplay from './ContentDisplay';


// Main Chat component
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedOption1, setSelectedOption1] = useState('beginner');
  const [selectedOption2, setSelectedOption2] = useState('lesson');
  const [loading, setLoading] = useState(false);

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

  const handleGenerateQuiz = () => {
    alert('Generate Quiz');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = () => {
    setMessages([]);
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
                  className="w-1/2 bg-[#1E2537] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم</option>
                </select>
                <select
                  value={selectedOption2}
                  onChange={(e) => setSelectedOption2(e.target.value)}
                  className="w-1/2 bg-[#1E2537] rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full bg-[#1E2537] rounded-lg py-4 px-6 pr-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <div className="absolute right-14 top-1/2 -translate-y-1/2 flex items-center">
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={handleGenerateQuiz}
                      className="p-2 hover:bg-[#2A3343] rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <FileText size={20} className="text-blue-500" />
                    </button>
                    <div className="absolute -top-8 right-0 bg-[#1E2537] text-white text-sm px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Generate Quiz
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-[#2A3343] rounded-lg transition-colors"
                  disabled={!input.trim() || loading}
                >
                  <Send size={20} className={input.trim() && !loading ? 'text-blue-500' : 'text-gray-500'} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;