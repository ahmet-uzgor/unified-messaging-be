# Unified Social Media Messaging Platform

A platform that unifies messages from different social media platforms (Instagram, WhatsApp, etc.) into a single interface with AI-powered response suggestions based on your FAQ database.

## Features

- **Unified Inbox**: View and respond to messages from multiple platforms in one place
- **AI-Powered Responses**: Get smart response suggestions based on your FAQ knowledge base
- **FAQ Management**: Upload and manage your FAQ database through Excel files
- **Platform Support**:
  - Instagram Direct Messages
  - WhatsApp Business
  - More platforms coming soon

## Tech Stack

### Backend
- NestJS (TypeScript)
- PostgreSQL with Prisma ORM
- Claude AI Integration
- Meta Platform APIs

### Frontend
- Next.js 14
- React Query
- Tailwind CSS
- Shadcn/ui Components

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL
- Meta Developer Account
- Claude AI API Key
- WhatsApp Business Account

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd unified-messaging-platform


# Navigate to backend directory
cd unified-messaging-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Fill in the environment variables in .env:
DATABASE_URL="postgresql://user:password@localhost:5432/unified_messaging"
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
ANTHROPIC_API_KEY=your_claude_api_key

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start the development server
npm run start:dev

unified-messaging-backend/
├── src/
│   ├── ai/                 # AI service integration
│   ├── platforms/         # Social media platform integrations
│   ├── messages/         # Message handling
│   ├── faq/             # FAQ management
│   └── prisma/          # Database schema and client