import OpenAI from 'openai';

// Initialize OpenAI with the API key from .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Chat with AI
// @route   POST /api/ai/chat
// @access  Private
export const chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required',
            });
        }

        // Prepare messages for OpenAI
        const messages = [
            {
                role: 'system',
                content: 'You are an AI assistant for HackFest 2026, a hackathon management system. Help users with their queries about the hackathon, technical issues, or general information. Be concise, professional, and helpful.',
            },
            ...(history || []).map((msg) => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content,
            })),
            { role: 'user', content: message },
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // Switched to gpt-4o-mini for better performance and vision support
            messages: messages,
            max_tokens: 500,
        });

        const aiMessage = response.choices[0].message.content;

        res.json({
            success: true,
            message: aiMessage,
        });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error communicating with AI service',
            error: error.message,
        });
    }
};

// @desc    Analyze image with AI
// @route   POST /api/ai/analyze-image
// @access  Private
export const analyzeImageWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required',
            });
        }

        // Convert file buffer to base64
        const base64Image = file.buffer.toString('base64');
        const imageUrl = `data:${file.mimetype};base64,${base64Image}`;

        const messages = [
            {
                role: 'system',
                content: 'You are an AI assistant for HackFest 2026. Analyze the provided image and answer the user\'s query based on it. Be concise, professional, and helpful.',
            },
            {
                role: 'user',
                content: [
                    { type: 'text', text: message || 'Please analyze this image and tell me what it is related to the hackathon.' },
                    {
                        type: 'image_url',
                        image_url: {
                            url: imageUrl,
                        },
                    },
                ],
            },
        ];

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
            max_tokens: 500,
        });

        const aiMessage = response.choices[0].message.content;

        res.json({
            success: true,
            message: aiMessage,
        });
    } catch (error) {
        console.error('AI Image Analysis Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing image with AI service',
            error: error.message,
        });
    }
};
