import React, { useState } from 'react';
import axios from 'axios';
import ContentDisplay from '../Component/ContentDisplay'


const ContentGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('beginner');
  const [format, setFormat] = useState('lesson');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateContent = async () => {
    if (!prompt) {
      setError('الرجاء إدخال موضوع');
      return;
    }
  
    console.log('Sending data:', { prompt, difficultyLevel, format });
  
    setLoading(true);
    setError('');
  
    try {
      const response = await axios.post(
        'https://edu-synth-salam-hack-oj4e.vercel.app/api/generate-content',
        {
          prompt,
          difficultyLevel,
          format,
        },
        { withCredentials: true }
      );
  
      console.log('Server response:', response.data);
  
      if (response.status !== 200) {
        throw new Error('فشل في إنشاء المحتوى');
      }
  
      setContent(response.data);
    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-8 text-center">
          مولد المحتوى التعليمي
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-secondary mb-2">
              الموضوع:
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="أدخل الموضوع"
              className="w-full p-3 rounded-lg bg-amber-600 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-secondary mb-2">
              مستوى الصعوبة:
            </label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="w-full p-3 rounded-lg bg-amber-600 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="beginner">مبتدئ</option>
              <option value="intermediate">متوسط</option>
              <option value="advanced">متقدم</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-secondary mb-2">
              التنسيق:
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full p-3 rounded-lg bg-amber-600 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="lesson">درس</option>
              <option value="article">مقالة</option>
            </select>
          </div>

          <button
            onClick={handleGenerateContent}
            disabled={loading}
            className="w-full bg-secondary text-black py-3 rounded-lg hover:bg-secondary transition duration-300 disabled:opacity-50"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء المحتوى'}
          </button>

          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}

          {content && <ContentDisplay content={content} />}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;