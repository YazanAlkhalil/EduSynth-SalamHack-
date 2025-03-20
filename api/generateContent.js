const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config()





router.post('/generate-flashcards', async (req, res) => {
    const { prompt } = req.body;
    console.log(prompt);

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }
    const flashcardPrompt = 
    `Create a set of flashcards about "${prompt}".

    Generate 5-10 question-answer pairs that cover the key concepts.
    Each flashcard should:
    1. Have a clear, focused question
    2. Provide a concise but complete answer
    3. Cover an important concept or fact
    4. Be suitable for learning and review

    Return the flashcards as a JSON array with this structure:
    [
    {
        "id": "1",
        "question": "What is X?",
        "answer": "X is...",
    }
    ]

    Important:
    - Questions should test understanding, not just memorization

    - Include a mix of basic and advanced concepts
    - Each flashcard should focus on one specific point
    - Use clear, precise language

    Return ONLY the JSON array with no additional text.`;
    try {
        const textResponse = await getDeepSeekResponse(flashcardPrompt);
        console.log(textResponse,'res')
        const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
            textResponse.match(/```\n([\s\S]*?)\n```/) ||
            [null, textResponse];

        const jsonContent = jsonMatch[1].trim();
        const json = JSON.parse(jsonContent)
        res.status(200).json(json);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate flashcards', details: error.message });
    }
});
router.post('/generate-content', async (req, res) => {
    try {
        console.log('Starting content generation process');
        const { prompt, difficultyLevel = 'beginner', format = 'lesson' } = req.body;

        if (!prompt) {
            console.log('Prompt is missing - returning 400 error');
            return res.status(400).json({ error: 'Prompt is required' });
        }

        console.log(`Generating content for: "${prompt}" (${difficultyLevel} level, ${format} format)`);

        console.log('== Generating content structure ==');
        const contentStructure = await generateTopicStructure(prompt, difficultyLevel, format);
        console.log('Content structure generated:', JSON.stringify(contentStructure, null, 2));

        console.log('== Expanding content sections ==');
        const expandedContent = await expandContentSections(contentStructure);
        console.log('Content sections expanded');

        console.log('== Enhancing with visuals ==');
        const enhancedContent = await enhanceWithVisuals(expandedContent);
        console.log('Visuals added:', enhancedContent.sections.map(s => s.visuals?.length || 0));

        console.log('== Adding interactive elements ==');
        console.log('Interactive elements added');

        console.log('Content generation completed successfully');
        res.json(enhancedContent);
    } catch (error) {
        console.error('Error generating learning content:', error);
        res.status(500).json({ error: 'Failed to generate learning content', details: error.message });
    }
});


async function generateTopicStructure(topic, difficultyLevel, format) {
    try {
        const enhancedPrompt = `Create a detailed learning structure about "${topic}" at a ${difficultyLevel} level, formatted as a ${format}.
    
    Return a JSON structure with the following format:
    {
      "title": "Main Topic Title",
      "introduction": {
        "id": "intro",
        "title": "Introduction Title",
        "description": "Introduction description",
        "visualOpportunities": ["concept1", "concept2"],
        "comparativeOpportunities": ["comparison1", "comparison2"]
      },
      "sections": [
        {
          "id": "section1",
          "title": "Section Title",
          "description": "Section description",
          "visualOpportunities": ["concept1", "concept2"],
          "comparativeOpportunities": ["comparison1", "comparison2"],
          "subsections": [
            {
              "id": "sub1",
              "title": "Subsection Title",
              "description": "Subsection description",
              "visualOpportunities": ["concept1", "concept2"],
              "comparativeOpportunities": ["comparison1", "comparison2"]
            }
          ]
        }
      ],
      "conclusion": {
        "id": "conclusion",
        "title": "Conclusion Title",
        "description": "Conclusion description",
        "visualOpportunities": ["concept1", "concept2"],
        "comparativeOpportunities": ["comparison1", "comparison2"]
      }
    }
    
    Important notes:
    1. Use exactly this JSON structure
    2. Include 3-7 main sections
    3. Each main section should have 2-4 subsections
    4. All arrays should contain actual values, not just "Array"
    5. Use descriptive titles and descriptions
    6. Ensure all IDs are unique
    7. Include specific visual and comparative opportunities
    
    Return ONLY the JSON object with no additional text or explanation.`;

        const textResponse = await getDeepSeekResponse(enhancedPrompt);

        const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
            textResponse.match(/```\n([\s\S]*?)\n```/) ||
            [null, textResponse];

        const jsonContent = jsonMatch[1].trim();
        return JSON.parse(jsonContent);
    } catch (error) {
        console.error('Error generating topic structure:', error);
        return {
            title: topic,
            introduction: { id: "intro", title: "Introduction", description: `Introduction to ${topic}` },
            sections: [
                {
                    id: "section1", title: "Overview", description: `Overview of ${topic}`,
                    subsections: [{ id: "sub1", title: "Key Concepts", description: "Important concepts" }]
                }
            ],
            conclusion: { id: "conclusion", title: "Conclusion", description: "Summary and key takeaways" }
        };
    }
}


async function expandContentSections(contentStructure) {
    try {
        console.log(`Expanding content for: "${contentStructure.title}"`);
        const expandedStructure = { ...contentStructure };

        const [introContent, conclusionContent] = await Promise.all([
            getDetailedContent(
                contentStructure.title,
                contentStructure.introduction.title,
                contentStructure.introduction.description
            ),
            getDetailedContent(
                contentStructure.title,
                contentStructure.conclusion.title,
                contentStructure.conclusion.description
            )
        ]);

        expandedStructure.introduction.content = introContent;
        expandedStructure.conclusion.content = conclusionContent;

        const sectionPromises = contentStructure.sections.map(async (section) => {
            const sectionContent = await getDetailedContent(
                contentStructure.title,
                section.title,
                section.description
            );

            const subsectionPromises = section.subsections.map(subsection =>
                getDetailedContent(
                    contentStructure.title,
                    `${section.title} - ${subsection.title}`,
                    subsection.description
                )
            );

            const subsectionContents = await Promise.all(subsectionPromises);
            section.subsections.forEach((subsection, index) => {
                subsection.content = subsectionContents[index];
            });

            return {
                ...section,
                content: sectionContent
            };
        });

        expandedStructure.sections = await Promise.all(sectionPromises);

        console.log('Content expansion completed');
        return expandedStructure;
    } catch (error) {
        console.error('Error expanding content sections:', error);
        return contentStructure;
    }
}


async function getDetailedContent(mainTopic, sectionTitle, sectionDescription) {
    try {
        const enhancedPrompt = `Create detailed educational content for a section titled "${sectionTitle}" within a lesson about "${mainTopic}".
    
    Section description: ${sectionDescription}
    
    Provide comprehensive content that explains key concepts clearly, uses concrete examples, and highlights important points.
    Keep the tone educational but engaging, aimed at someone who is actively learning this topic.
    Include 300-500 words of high-quality content.`;

        return await getDeepSeekResponse(enhancedPrompt);
    } catch (error) {
        console.error(`Error getting detailed content for ${sectionTitle}:`, error);
        return `Content for ${sectionTitle} could not be generated. Please try again later.`;
    }
}


async function enhanceWithVisuals(expandedContent) {
    console.log(`Enhancing content with visuals for: "${expandedContent.title}"`);
    const enhancedContent = { ...expandedContent };

    const [enhancedIntro, enhancedConclusion] = await Promise.all([
        addVisualsToSection(enhancedContent.introduction),
        addVisualsToSection(enhancedContent.conclusion)
    ]);

    enhancedContent.introduction = enhancedIntro;
    enhancedContent.conclusion = enhancedConclusion;

    const sectionPromises = expandedContent.sections.map(async section => {
        const enhancedSection = await addVisualsToSection(section);

        const subsectionPromises = enhancedSection.subsections.map(subsection =>
            addVisualsToSection(subsection)
        );

        enhancedSection.subsections = await Promise.all(subsectionPromises);
        return enhancedSection;
    });

    enhancedContent.sections = await Promise.all(sectionPromises);

    console.log('Visual enhancement completed');
    return enhancedContent;
}


async function addVisualsToSection(section) {
    try {
        if (!section.content || !section.visualOpportunities || section.visualOpportunities.length === 0) {
            return section;
        }

        const visualAnalysisPrompt = `Analyze this educational content and identify 1-2 specific concepts, events, or data points that would benefit most from visual representation.
    
    Educational content:
    ${section.content.slice(0, 2000)}
    
    Potential visual opportunities to consider:
    ${JSON.stringify(section.visualOpportunities)}
    
     For each recommended visual:
      1. Specify the exact type of visual (photo, illustration, chart, graph, map, etc.)
      2. Provide a precise description of what it should show
      3. Explain why this visual would enhance learning about this specific content
      4. Suggest where in the content it should be placed (e.g., "after paragraph discussing X")
      5. Rate the learning impact of this visual on a scale of 1-10 and explain why
      6. IMPORTANT: Rate the searchability of this visual on a scale of 1-10 (how likely it is to find this image on stock photo sites)
      
      Return your response as a JSON array of recommended visuals in this exact format (THIS IS JUST A TEMPLATE - FILL IN WITH ACTUAL VALUES):
      [
        {
          "type": "TYPE_OF_VISUAL_HERE",
          "description": "DESCRIBE_WHAT_IT_SHOULD_SHOW_HERE",
          "search_terms": "SIMPLIFIED_SEARCH_TERMS_FOR_FINDING_IMAGES",
          "reason": "EXPLAIN_WHY_THIS_VISUAL_WOULD_HELP_HERE",
          "placement": "SPECIFY_WHERE_IN_CONTENT_IT_SHOULD_GO_HERE",
          "learning_impact": IMPACT_RATING_HERE,
          "searchability": SEARCHABILITY_RATING_HERE,
          "explanation": "EXPLAIN_THE_IMPACT_RATING_HERE"
        }
      ]`;

        const textResponse = await getDeepSeekResponse(visualAnalysisPrompt);

        const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
            textResponse.match(/```\n([\s\S]*?)\n```/) ||
            [null, textResponse];

        let visualRecommendations = [];
        try {
            visualRecommendations = JSON.parse(jsonMatch[1].trim());
            if (!Array.isArray(visualRecommendations)) {
                visualRecommendations = [visualRecommendations];
            }
        } catch (error) {
            console.error('Error parsing visual recommendations:', error);
            return section;
        }

        const highQualityVisuals = visualRecommendations
            .filter(v => v.learning_impact >= 7 && (v.searchability >= 7 || v.type.toLowerCase() === 'chart' || v.type.toLowerCase() === 'graph'))
            .slice(0, 2); 

        if (highQualityVisuals.length === 0) {
            return section;
        }

        const visuals = [];
        for (const visualRec of highQualityVisuals) {
            let visual = null;
            const searchTerms = visualRec.search_terms || visualRec.description;

            switch (visualRec.type.toLowerCase()) {
                case 'photo':
                case 'image':
                case 'illustration':
                    visual = await getRelevantImage(searchTerms);
                    break;

                case 'chart':
                case 'graph':
                case 'infographic':
                    visual = await generateDataVisualization(visualRec.description);
                    break;

                case 'map':
                    visual = await getRelevantMap(visualRec.description);
                    break;

              
                default:
                    visual = await getRelevantImage(searchTerms);
            }

            if (visual) {
                visuals.push({
                    ...visual,
                    description: visualRec.description,
                    placement: {
                        type: 'section', // or 'subsection'
                        position: visualRec.placement, // e.g., "after paragraph discussing X"
                        sectionId: section.id
                    },
                    impactRating: visualRec.learning_impact,
                    rationale: visualRec.reason
                });
            }
        }

        return {
            ...section,
            visuals
        };
    } catch (error) {
        console.error('Error enhancing section with visuals:', error);
        return section;
    }
}


async function getRelevantImage(description) {
    try {
        const searchTerms = description.split(' ')
            .filter(term => term.length > 2 && !term.includes('/') && !term.includes('(') && !term.includes(')'))
            .slice(0, 5)
            .join(' ');

        console.log(`Searching Unsplash for: "${searchTerms}"`);

        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: {
                query: searchTerms,
                per_page: 1,
                orientation: 'landscape'
            },
            headers: {
                'Authorization': 'Client-ID ' + process.env.UNSPLASHAPIKEY
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            const image = response.data.results[0];
            console.log(`Found image: ${image.urls.small}`);
            return {
                type: 'image',
                url: image.urls.regular,
                thumbnail: image.urls.small,
                alt: description,
                credit: {
                    name: image.user.name,
                    link: image.user.links.html
                }
            };
        }

        console.log(`No results found for "${searchTerms}", trying more generic search`);

        const keyTerms = searchTerms.split(' ')
            .filter(term => term.length > 3)
            .slice(0, 2)
            .join(' ');

        if (!keyTerms) return null;

        const fallbackResponse = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: {
                query: keyTerms,
                per_page: 1,
                orientation: 'landscape'
            },
            headers: {
                'Authorization': 'Client-ID ' + process.env.UNSPLASHAPIKEY
            }
        });

        if (fallbackResponse.data.results && fallbackResponse.data.results.length > 0) {
            const image = fallbackResponse.data.results[0];
            console.log(`Found fallback image: ${image.urls.small}`);
            return {
                type: 'image',
                url: image.urls.regular,
                thumbnail: image.urls.small,
                alt: description,
                credit: {
                    name: image.user.name,
                    link: image.user.links.html
                }
            };
        }

        console.log(`No images found for "${description}"`);
        return null;
    } catch (error) {
        console.error('Error getting relevant image:', error);
        return null;
    }
}


async function generateDataVisualization(description) {
    try {
        // Ask deepseek to generate suitable data for the visualization
        const dataGenPrompt = `Create a data visualization configuration for Chart.js based on this description: "${description}"
    
    Generate appropriate sample data that would be educational and relevant to this topic.
    Return a complete chart.js configuration object that can be rendered directly.
    
    The configuration should include:
    1. Chart type (bar, line, pie, etc.) that best represents this data
    2. Labels and datasets with appropriate values
    3. Title and axis labels where appropriate
    4. A color scheme that is visually appealing and accessible
    5. Any necessary legend or tooltip configurations
    
    Return ONLY the raw JSON configuration object with no explanation.`;

        const textResponse = await getDeepSeekResponse(dataGenPrompt);

        let chartConfig = {};
        try {
            const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
                textResponse.match(/```\n([\s\S]*?)\n```/) ||
                [null, textResponse];

            const jsonContent = jsonMatch[1].trim();
            chartConfig = JSON.parse(jsonContent);
        } catch (error) {
            console.error('Error parsing chart configuration:', error);
            return null;
        }

        return {
            type: 'chart',
            chartType: chartConfig.type || 'bar',
            config: chartConfig,
            alt: description
        };
    } catch (error) {
        console.error('Error generating data visualization:', error);
        return null;
    }
}


async function getRelevantMap(description) {
    try {
        const searchQuery = `map ${description.split(' ').slice(0, 3).join(' ')}`;

        const response = await axios.get(`https://api.unsplash.com/search/photos`, {
            params: {
                query: searchQuery,
                per_page: 1
            },
            headers: {
                'Authorization': 'Client-ID ' + process.env.UNSPLASHAPIKEY
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            const image = response.data.results[0];
            return {
                type: 'map',
                url: image.urls.regular,
                thumbnail: image.urls.small,
                alt: `Map of ${description}`,
                credit: {
                    name: image.user.name,
                    link: image.user.links.html
                }
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting relevant map:', error);
        return null;
    }
}


async function generateTimeline(description) {
    try {
        const timelinePrompt = `Create a timeline visualization data based on this description: "${description}"
    
    Generate a JSON array of timeline events that would be educational and relevant to this topic.
    Each event should include:
    1. A date or year
    2. A title
    3. A brief description
    4. An importance rating (1-10)
    
    Return ONLY the raw JSON array with no explanation.`;

        const textResponse = await getDeepSeekResponse(timelinePrompt);

        const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
            textResponse.match(/```\n([\s\S]*?)\n```/) ||
            [null, textResponse];

        let timelineData = [];
        try {
            timelineData = JSON.parse(jsonMatch[1].trim());
        } catch (error) {
            console.error('Error parsing timeline data:', error);
            return null;
        }

        return {
            type: 'timeline',
            events: timelineData,
            alt: `Timeline of ${description}`
        };
    } catch (error) {
        console.error('Error generating timeline:', error);
        return null;
    }
}


async function addInteractiveElements(enhancedContent) {
    try {
        console.log(`Adding interactive elements to: "${enhancedContent.title}"`);

        console.log('Generating quiz...');
        const quiz = await generateQuiz(enhancedContent);



        console.log('Interactive elements added successfully');
        return {
            ...enhancedContent,
            quiz
        };
    } catch (error) {
        console.error('Error adding interactive elements:', error);
        return enhancedContent;
    }
}


async function generateQuiz(content) {
    try {
        let quizPrompt = `Create a quiz to test understanding of a lesson about "${content}".

    
    
        Generate 10 multiple-choice questions that test understanding of the most important concepts.
        For each question:
        1. Provide a clear, concise question
        2. Provide 4 possible answers (A, B, C, D)
        3. Indicate which answer is correct
        4. Provide a brief explanation of why that answer is correct
        
        Return the quiz as a JSON object with this exact structure:
        {
        "questions": [
            {
            "id": "1",
            "question": "What is the main purpose of X?",
            "options": {
                "A": "First option",
                "B": "Second option",
                "C": "Third option", 
                "D": "Fourth option"
            },
            "correctAnswer": "B",
            "explanation": "Second option is correct because..."
            }
        ]
        }

        Return ONLY the JSON object with no additional text.`;

        const textResponse = await getDeepSeekResponse(quizPrompt);

        const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) ||
            textResponse.match(/```\n([\s\S]*?)\n```/) ||
            [null, textResponse];

        let quizData = {};
        try {
            quizData = JSON.parse(jsonMatch[1].trim());
        } catch (error) {
            console.error('Error parsing quiz data:', error);
            return {
                questions: []
            };
        }

        return quizData;
    } catch (error) {
        console.error('Error generating quiz:', error);
        return {
            questions: []
        };
    }
}

router.post('/generate-quizes',async (req,res)=>{
    res.json(await generateQuiz(req.body.params))
})

async function getDeepSeekResponse(prompt, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                model: "deepseek/deepseek-chat:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            }, {
                headers: {
                    "Authorization": "Bearer " + process.env.DSAPIKEY,

                    "Content-Type": "application/json"
                }
            });


            console.log(response.data)

            const content = response.data.choices[0].message.content;


            return content.replace(/<think>[\s\S]*?<\/think>\n?/, '').trim();
        } catch (error) {
            console.error(`Attempt ${attempt} failed for prompt: ${prompt.substring(0, 50)}...`);
            if (attempt === retries) {
                throw error;
            }

            const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}




// Controller function for generating flashcards


module.exports = router;