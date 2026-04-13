<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Widget Date 💖

Widget Date is a super date-planning app for Vietnam users featuring AI-generated itineraries, gamification via "Date Miles", Tinder-like place discovery, outfit suggestions, and deep integration with local ride-hailing services.

## 🌟 Features

### ✅ Completed
*   **AI-Generated Itineraries (Combos):** Generate tailored date combos using Gemini 2.5 Flash with fallback mechanisms.
*   **Date Miles Gamification Engine:** Earn "Date Miles" from completing dates or renting outfits. Level up (Newbie -> Master), unlock badges, and track your history. 
*   **Explore Places & Swipe UI:** Search nearby places with Gemini 2.5 Pro and Google Maps grounding. Swipe places right (Tinder UX) to like them.
*   **AI Date Assistant:** In-app chat assistant powered by Gemini 2.5 Pro for date advice and place reviews.
*   **Deep Link Integration:** Instantly call Grab, Be, or Xanh SM to the chosen location.
*   **Dynamic Outfits:** Get outfit suggestions automatically tailored to the AI's theme. Buy directly on Shopee or use the in-app fast rental UI.
*   **Real Photos Parsing:** Web-scraping via proxy to fetch actual Google Maps `og:image` data for venues.
*   **Node.js Backend Crawler:** A crawler service (`data-service/`) utilizing `better-sqlite3`, `node-cron`, and `cheerio` to fetch and deduplicate trending date spots locally.

### ⚠️ In Progress / Known Issues
*   **Custom Combos:** "Add to Combo" button currently shows a toast but hasn't been connected to a state manager.
*   **Backend Integration:** The `data-service/` crawler is operational but currently runs standalone and is not yet explicitly connected via endpoints to the React frontend.
*   **Badges Logic:** Most Gamification Badges are currently static arrays; auto-unlock logic based on user stats is yet to be fully wired up.
*   **Weather and Timers:** The weather banner and long-time-no-date warnings are hardcoded and pending external API integrations (e.g. OpenWeatherMap).

### 🔮 Planned
*   Backend REST API for crawler data.
*   Live Weather API Integration.
*   Challenges and Leaderboards.
*   Push/PWA Notifications for date reminders.

## 🚀 Tech Stack

*   **Frontend:** React 19, Vite, TailwindCSS 4, Framer Motion, canvas-confetti, Lucide React
*   **Backend (Data Service):** Node.js, Express, Axios, Cheerio, better-sqlite3, node-cron
*   **AI:** Gemini 2.5 Pro, Gemini 2.5 Flash (`@google/genai` SDK)

## 🛠 Run Locally

**Prerequisites:** Node.js v18+ 

1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup your Environment:
   * Copy `.env.example` to `.env.local`
   * Add your Gemini API Key:
     ```env
     GEMINI_API_KEY="your-gemini-key-here"
     ```
3. Start the Frontend App:
   ```bash
   npm run dev
   ```

*(Optional)* Run the backend crawler:
```bash
cd data-service
# install cheerio, axios, node-cron, better-sqlite3 locally if not installed
node scraper.js
```

---
*Created in AI Studio:* [Link to App](https://ai.studio/apps/9a2923f6-4591-48d0-96fe-2e0c8cf01b2a)
