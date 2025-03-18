const generateContent = async (prompt, difficultyLevel, format) => {
    setIsLoading(true); // بدء التحميل
    try {
      const response = await axios.post(
        'http://localhost:3000/api/generate-content',
        {
          prompt,
          difficultyLevel,
          format,
        },
        { withCredentials: true }
      );
  
      console.log('Server response:', response.data);
  

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating content:', error);
      return null;
    } finally {
      setIsLoading(false); // إنهاء التحميل
    }
  };