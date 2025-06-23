import asyncHandler from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponce.js";
import {ApiError} from "../utils/ApiErrors.js";

const improveComment = asyncHandler(async(req, res) => {
    const { title = '', comment, others = [] } = req.body;

    // Validate input
    if (!comment?.trim()) {
        throw new ApiError(400, "Comment is required");
    }

    // Ensure others is an array of strings
    const validOthers = Array.isArray(others) 
        ? others.filter(c => c && typeof c === 'string')
        : [];

    const prompt = `
        Improve this YouTube comment. Keep it brief and concise.
        Make it engaging while maintaining the original meaning.
        Important: Keep the improved version similar in length to the original comment.
        
        Video Title: ${title || 'Not provided'}
        Original Comment: ${comment.trim()}
        ${validOthers.length > 0 ? `
        Context from other comments:
        ${validOthers.map((c, i) => `${i + 1}. ${c.trim()}`).join('\n')}
        ` : ''}
        
        Rules:
        1. Keep the same length as original comment (100-150 words) maximum
        2. Maintain core message
        3. Be concise
        4. No explanations, just the improved comment
        
        Improved Comment:`;
  
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            throw new ApiError(500, "AI service not configured");
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'HTTP-Referer': process.env.APP_URL || 'http://localhost:5173',
                'X-Title': 'HarshTube Comment Improver',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct',
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are a comment improver that maintains brevity. Always keep responses concise and similar in length to the original comment. Never add explanations or additional context.' 
                    },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                max_tokens: 100,
                top_p: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenRouter API Error:', errorData);
            throw new ApiError(
                response.status, 
                errorData.error?.message || 'Failed to improve comment'
            );
        }
  
        const data = await response.json();
        const improved = data.choices?.[0]?.message?.content?.trim();
      
        if (!improved) {
            throw new ApiError(500, 'No improvement suggestion received');
        }
  
        return res.status(200).json(
            new ApiResponse(200, improved, 'Comment improved successfully')
        );
    } catch (error) {
        console.error('Error improving comment:', error);
        
        if (error instanceof ApiError) {
            throw error;
        }
        
        throw new ApiError(
            error.status || 500,
            error.message || 'Failed to improve comment. Please try again.'
        );
    }
});

export { improveComment };