# AI Club Quiz Game

## Project Overview

The AI Club Quiz Game is a Next.js 16 application designed for the Bejaia School of AI Club. It provides an interactive quiz platform where users can test their knowledge about Artificial Intelligence. The application features authentication via Google and GitHub, a responsive quiz interface with progress tracking, and a results screen showing the user's performance.

### Key Features
- Authentication with Google and GitHub OAuth
- Interactive quiz interface with multiple-choice questions
- Progress tracking and state persistence using localStorage
- Score calculation and results display
- Responsive design with animated transitions
- Database integration with PostgreSQL using Drizzle ORM
- Test mode for development purposes
- Encrypted API communication for enhanced security

### Technologies Used
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with animations
- **Database**: PostgreSQL with NeonDB serverless driver
- **ORM**: Drizzle ORM
- **Authentication**: NextAuth.js with OAuth providers
- **UI Components**: Radix UI primitives and custom components
- **Icons**: Lucide React
- **State Management**: React hooks and localStorage
- **Package Manager**: pnpm

## Project Structure

```
ai-club-quiz-game/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication API routes
│   │   └── quiz/          # Quiz-related API routes
│   ├── login/             # Login page
│   ├── test/              # Test page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── auth/              # Authentication components
│   ├── quiz/              # Quiz-specific components
│   └── ui/                # UI primitive components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts            # NextAuth configuration
│   ├── db.ts              # Database connection
│   ├── schema.ts          # Database schema definitions
│   └── quiz-utils.ts      # Quiz-related utility functions
├── drizzle/               # Database migration files
├── hooks/                 # Custom React hooks
├── middleware.ts          # Next.js middleware
├── scripts/               # Utility scripts
├── public/                # Static assets
├── styles/                # Additional style files
├── .env.example           # Environment variables template
├── drizzle.config.ts      # Drizzle configuration
├── next.config.mjs        # Next.js configuration
├── package.json           # Project dependencies and scripts
└── tailwind.config.ts     # Tailwind CSS configuration
```

## Building and Running

### Prerequisites
- Node.js (v18 or later recommended)
- pnpm package manager
- PostgreSQL database (NeonDB recommended)

### Setup Instructions

1. **Clone and Install Dependencies**
```bash
pnpm install
```

2. **Environment Configuration**
Copy `.env.example` to `.env.local` and fill in the required values:
```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL database connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Base URL for the application
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`: GitHub OAuth credentials

3. **Database Setup**
Run database migrations:
```bash
pnpm db:push
```

4. **Seed Quiz Questions**
To populate the database with sample quiz questions:
```bash
pnpm seed:quiz
```

5. **Run Development Server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Production Build
To build the application for production:
```bash
pnpm build
```

To run the production build locally:
```bash
pnpm start
```

## Development Conventions

### Code Style
- TypeScript is used throughout the project
- Component names follow PascalCase
- File names use kebab-case for pages and camelCase for components
- Tailwind CSS classes are organized using the `cn()` utility from `tailwind-merge` and `clsx`

### Authentication Flow
- Protected routes redirect unauthenticated users to `/login`
- API routes check for valid session tokens
- User sessions are managed by NextAuth.js

### Data Flow
- Quiz questions are fetched from the database via API routes
- Correct answers are not sent to the client to prevent cheating
- Answers are validated server-side when submitted
- Quiz state is persisted in localStorage during the session

### Testing
- Test mode can be enabled by setting `TEST_MODE = true` in `app/api/quiz/test.ts`
- In test mode, only 3 random questions are served instead of the full set

## Key Components

### Quiz Game Flow
1. **Welcome Screen**: Introduces the quiz and allows starting
2. **Quiz Interface**: Displays questions with multiple-choice options
3. **Results Screen**: Shows the user's score and allows replaying

### Security Features
- **API Encryption**: All communication between frontend and backend is encrypted using XOR-based obfuscation
- **Data Validation**: Strict validation of all incoming data to prevent injection attacks
- **Secure Transmission**: Request and response data is encrypted before transmission

### State Management
- Quiz state (current question, answers, score) is managed in `QuizGameClient` component
- LocalStorage is used to persist quiz progress in case of interruption
- Timer state is tracked separately to handle time limits per question

### Database Schema
- `users`: Stores user information from OAuth providers
- `accounts`: Links OAuth provider accounts to users
- `sessions`: Manages user sessions
- `verificationTokens`: Handles email verification tokens
- `quizQuestions`: Contains quiz questions and answers
- `quizResults`: Stores user quiz results and scores

## API Routes

### `/api/quiz/questions`
- **Method**: GET
- **Purpose**: Fetches quiz questions for the authenticated user
- **Authentication**: Required
- **Response**: Array of questions without correct answers (to prevent cheating)
- **Encryption**: Response data is encrypted using XOR-based obfuscation

### `/api/quiz/submit`
- **Method**: POST
- **Purpose**: Submits user answers and calculates score
- **Authentication**: Required
- **Request Body**: Object containing encrypted userId and array of answers
- **Response**: Success status, score, and total questions
- **Encryption**: Both request and response data are encrypted using XOR-based obfuscation
- **Validation**: Incoming data is validated for proper structure and content

## Encryption Implementation

The application implements multiple layers of security for API communication:

### Client-Side Encryption
- Requests to `/api/quiz/submit` are encrypted before transmission
- Responses from `/api/quiz/questions` are decrypted after reception
- Uses `SimpleEncryption` class with XOR-based obfuscation

### Server-Side Encryption
- Responses from `/api/quiz/questions` are encrypted before sending
- Requests to `/api/quiz/submit` are decrypted upon arrival
- Uses `SimpleEncryption` class with XOR-based obfuscation

### Data Validation
- All incoming data is validated using `APIValidator` class
- Checks for proper structure, data types, and value ranges
- Prevents injection attacks and malformed requests

## Troubleshooting

### Common Issues
1. **Authentication fails**: Ensure OAuth credentials are correctly configured in environment variables
2. **Database connection errors**: Verify DATABASE_URL is properly set
3. **Quiz questions not loading**: Run the seed script to populate the database
4. **Styles not applying**: Check that Tailwind CSS is properly configured

### Debugging Tips
- Enable NextAuth debug mode by setting `NEXTAUTH_DEBUG=true` in environment
- Check browser console for client-side errors
- Monitor server logs for API route issues
- Verify that all environment variables are properly set

## Deployment Notes

When deploying to production:
1. Ensure environment variables are properly configured
2. Run database migrations before deployment
3. Seed the database with quiz questions if needed
4. Configure OAuth provider domains for your production URL
5. Set up SSL certificates for secure authentication flows