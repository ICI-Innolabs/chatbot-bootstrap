# Chatbot App Bootstrap

Chatbot App Bootstrap is a simple framework we built to help our developers get started with AI-powered virtual assistants. It uses Svelte, integrates Langraph for conversational AI, and supports Tavily Search for web queries. We’ve included basic chat state management, authentication (Google, GitHub, Twitter via Auth.js), and agent-based interactions as a foundation for further development.

## Key Features
- Conversational chat interface – Fully implemented, allowing smooth user-AI interactions.
- Chat session management – Includes thread auto-titling, deletion, and database persistence.
- Agentic capabilities – Built-in Tavily Search integration for real-time web-based answers.
- Authentication system – Supports Google, GitHub, and Twitter authentication via Auth.js.
- Typewriter effect for AI responses with simulated AI text streaming.
- Markdown rendering 

## Technology Stack
- Frontend: [Sveltekit](https://svelte.dev/docs/kit/introduction), [Shadcn](https://next.shadcn-svelte.com/), [Tailwind](https://tailwindcss.com/) 
- AI & Agents: [Langraph](https://langchain-ai.github.io/langgraphjs/), [Tavily](https://tavily.com/), [OpenAI API](https://platform.openai.com/docs/overview) 
- Authentication: [Auth.js](https://authjs.dev/)
- Database: [Prisma](https://www.prisma.io/?via=start)

## Installation
- Prerequisites (Node.js, package manager like npm or pnpm).
- Clone and set up the project.
```bash
git clone https://github.com/ICI-Innolabs/chatbot-bootstrap.git
cd chatbot-bootstrap
npm install
cp .env.example .env 
```
- edit the .env environment variables
- execute database migrations
```bash
npx prisma migrate dev
```
- run the server in development mode
```bash
npm run dev
```


## How to cite
```bibtex
@misc{ChatbotAppBootstrap,
  author = {Radu Boncea},
  title = {Chatbot App Bootstrap},
  year = {2025},
  howpublished = {\url{https://github.com/ICI-Innolabs/chatbot-bootstrap}},
  note = {A minimal chatbot app for building AI-powered virtual assistants with Langraph and OpenAI.}
}
```

## License 
The MIT License (MIT)

Copyright (c) 2025 ICI Bucharest 

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
