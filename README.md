<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1B8M8Y89xBeoTrV9FpIq5kgIO131hKrSw

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to Vercel

1. Push your code to a GitHub repository
2. Create a new project on Vercel and import your repository
3. In the Vercel project settings, add the following environment variable:
   - `VITE_GEMINI_API_KEY` - Your Gemini API key
4. Vercel will automatically deploy your app

Note: The app will work without an API key, but the AI stamp generation feature will use default values.
