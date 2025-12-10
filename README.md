# Historical Radio News

A web application that allows users to select a year and listen to radio news from that year in the USA using text-to-speech technology.

## Features

- Select any year from 2000 to the current year
- Fetch historical news articles from that year in the USA
- Listen to news articles using text-to-speech
- Read full articles online

## Setup Instructions

1. Get a free API key from [NewsAPI.org](https://newsapi.org/)
2. Add your NewsAPI key to the `.env.local` file:
   ```
   NEWS_API_KEY=your_actual_api_key_here
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open your browser to `http://localhost:8000`

## How to Use

1. Select a year from the dropdown menu (2000 to current year)
2. Click "Fetch News"
3. Browse the news articles for that year
4. Click "Play Article" to listen to an article via text-to-speech
5. Click "Read Full Article" to view the complete article online

## Technical Details

- Uses NewsAPI.org to fetch historical news articles
- Implements Web Speech API for text-to-speech functionality
- Built with Node.js, Express, and vanilla JavaScript
- Responsive design that works on desktop and mobile devices

## Requirements

- Node.js
- Internet connection
- NewsAPI.org key (free tier available)