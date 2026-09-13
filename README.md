# Nova Tutor

Nova Tutor is a phone-friendly, first-principles learning interface. The frontend is a static HTML app and is designed to connect to a secure AI backend.

## What is included

- Responsive mobile and desktop layout
- Subject switching
- Persistent chat history in browser storage
- Clear-chat control
- Loading and error states
- Safe rendering of user text
- Configurable backend endpoint
- No API keys stored in the frontend

## Run the frontend

Open `Index.Html` in a browser, or serve the repository with any static web server.

The default backend endpoint is:

```text
/api/chat
```

You can change it from **Backend settings** in the sidebar. Use a relative endpoint or an HTTPS URL.

## Backend contract

The frontend sends a `POST` request with JSON:

```json
{
  "message": "Explain Newton's laws from zero",
  "subject": "Physics & Cosmos",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Namaste!"}
  ]
}
```

The backend should return JSON containing one of these fields:

```json
{"reply": "Your answer here"}
```

The frontend also accepts `message`, `content`, or an OpenAI-compatible `choices[0].message.content` response.

## Security requirements

- Keep Cerebras, OpenAI, Gemini, Groq, or any other provider API key on the server.
- Store secrets in server environment variables or the hosting provider's secret manager.
- Never paste an API key into `Index.Html`, browser JavaScript, GitHub, or localStorage.
- Add rate limiting, input-length limits, abuse protection, and request logging on the backend.
- Restrict CORS if the frontend and backend are hosted on different domains.

## Important limitation

GitHub Pages can host the frontend, but it cannot execute a normal private server endpoint. The AI backend must be deployed separately on a serverless platform, VPS, or other backend host, and the frontend endpoint must point to that deployment.
