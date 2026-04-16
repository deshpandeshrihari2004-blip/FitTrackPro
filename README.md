# FitTrack Pro

FitTrack Pro is a high-performance, ML-driven fitness companion built with the Next.js App Router and Supabase. It features a premium Dark-Glassmorphism aesthetic and utilizes neural networks to provide real-time, personalized health insights.

## ✨ Features

- **ML-Powered Recommendations**: Real-time workout and nutrition focus suggestions using a client-side `brain.js` neural network.
- **AI Planning**: Generative AI (Gemini) integration for creating deep, meal-by-meal nutrition plans and multi-exercise workout routines.
- **Activity Matrix**: A professional rolling 28-day performance tracker to visualize consistency.
- **Authentication**: Secure student/athlete login system with JWT-guarded routes.
- **Modern Tech Stack**: Fully responsive dark-mode UI built with Tailwind CSS v4.

## 🚀 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database**: [Supabase](https://supabase.com/) + [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **AI/ML**: [Google Gemini AI](https://aistudio.google.com/) & [Brain.js](https://brain.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone [repository-url]
cd fittrackpro
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```env
DATABASE_URL="your_supabase_connection_pooler_url"
DIRECT_URL="your_supabase_direct_url"
JWT_SECRET="your_secure_secret"
GEMINI_API_KEY="your_google_ai_key"
```

### 4. Database Initialization
```bash
npx prisma generate
npx prisma migrate dev
```

### 5. Run Development Server
```bash
npm run dev
```

## 📦 Deployment

This project is optimized for deployment on **Vercel**.
1. Connect your repository.
2. Configure Environment Variables.
3. Vercel will automatically run `npx prisma generate` as a post-install step.

## 📄 License
MIT
