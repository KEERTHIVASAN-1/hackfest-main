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
            model: 'gpt-3.5-turbo', // Using gpt-3.5-turbo for cost-effectiveness and speed
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
