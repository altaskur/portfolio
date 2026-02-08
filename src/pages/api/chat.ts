import type { APIRoute } from 'astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const prerender = false;

const SYSTEM_CONTEXT = `You are an AI assistant representing Isaac (Altaskur), a Frontend Developer located in Alicante, Spain.

Key facts about Isaac:
- Frontend developer focused on building solid, accessible products for real users
- Works closely with teams, understanding context and making informed decisions
- Prepares codebases for evolution and maintainability
- Active in community: events, workshops, collaborative work
- Previously did live coding streams as a way to learn and share knowledge
- Comfortable in environments where technical criteria and communication go together
- Not defined by any specific technology - chooses the right tool for the problem
- Enjoys teamwork, accompanying processes, and creating aligned team environments

Technical Skills:
- Frontend: Angular, React.js, TypeScript, JavaScript, CSS
- Desktop (personal projects): Electron
- Backend (when needed): Node.js, Express
- Tools: GitHub Actions, SonarQube, Git, Figma, Penpot

Contact channels: LinkedIn, Instagram, Twitch, YouTube

IMPORTANT RULES:
- Respond in the same language the user writes in (Spanish or English)
- Keep responses concise and friendly
- If asked about freelance availability or hiring, politely say you're not available for freelance work and redirect to other topics
- If asked about contact, mention LinkedIn as the best professional channel
- Be helpful and professional, representing Isaac's values of collaboration and quality`;

export const POST: APIRoute = async ({ request }) => {
    try {
        const apiKey = import.meta.env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({
                error: 'API key not configured'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { message, history = [] } = await request.json();

        if (!message || typeof message !== 'string') {
            return new Response(JSON.stringify({
                error: 'Message is required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Build conversation history with system context as first message
        const chatHistory = [
            {
                role: 'user' as const,
                parts: [{ text: SYSTEM_CONTEXT + '\n\nPlease acknowledge that you understand these instructions.' }]
            },
            {
                role: 'model' as const,
                parts: [{ text: 'Understood! I am ready to answer questions about Isaac (Altaskur). How can I help you?' }]
            },
            ...history.map((msg: { role: string; content: string }) => ({
                role: (msg.role === 'user' ? 'user' : 'model') as const,
                parts: [{ text: msg.content }]
            }))
        ];

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        return new Response(JSON.stringify({
            response
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return new Response(JSON.stringify({
            error: 'Failed to generate response'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
