# Health Insurance India

A comprehensive platform for comparing and understanding health insurance policies in India.

## Features

- Compare health insurance policies
- Understand policy terms and conditions
- Visual policy analysis
- Multilingual support
- AI-powered chatbot for insurance guidance

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add the following variables:
     ```
     # Supabase Configuration
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

     # OpenAI Configuration
     OPENAI_API_KEY=your_openai_api_key
     ```
   - Replace `your_openai_api_key` with your actual OpenAI API key
   - Replace Supabase credentials if needed

4. Run the development server:
   ```
   npm run dev
   ```

## Chatbot

The platform includes an AI-powered chatbot that:
- Provides information about health insurance policies
- Explains complex terms and conditions
- Responds in the user's selected language
- Uses OpenAI's API for intelligent responses

## Multilingual Support

The application supports multiple Indian languages:
- English
- Hindi
- Tamil
- Telugu
- Bengali
- Marathi
- Gujarati
- Kannada
- Malayalam
- Punjabi
