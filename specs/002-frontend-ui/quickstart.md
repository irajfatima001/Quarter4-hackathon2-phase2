# Quickstart Guide: Frontend Development for Phase II Todo Full-Stack Web Application

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Create a `.env.local` file in the frontend directory with the following content:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Starts the development server with hot reloading
- `npm run build` - Creates an optimized production build
- `npm run start` - Starts the production server
- `npm run lint` - Runs ESLint to check for code quality issues
- `npm run test` - Runs the test suite

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Home page
│   │   ├── login/              # Login page
│   │   │   └── page.tsx
│   │   ├── signup/             # Signup page
│   │   │   └── page.tsx
│   │   └── dashboard/          # Dashboard page
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── task-card.tsx
│   │   │   ├── add-edit-task-modal.tsx
│   │   │   ├── empty-state.tsx
│   │   │   └── theme-toggle.tsx
│   │   └── forms/              # Form components
│   │       ├── login-form.tsx
│   │       └── signup-form.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-tasks.ts
│   │   └── use-theme.ts
│   ├── lib/                    # Utility functions
│   │   ├── api.ts              # API client and functions
│   │   └── utils.ts            # Helper functions
│   ├── styles/                 # Global styles
│   │   └── globals.css
│   └── types/                  # TypeScript type definitions
│       └── index.ts
├── public/                     # Static assets
└── tests/                      # Test files
    ├── components/
    ├── pages/
    └── utils/
```

## Key Features

1. **Authentication**: Secure login and signup flows
2. **Task Management**: Add, edit, delete, and mark tasks as complete
3. **Responsive Design**: Works on mobile, tablet, and desktop
4. **Dark/Light Mode**: Theme switching with system preference detection
5. **Premium UI**: Glassmorphism effects, smooth animations, and modern design
6. **Accessibility**: Proper contrast ratios, keyboard navigation, and ARIA labels

## API Integration

The frontend communicates with the backend API using axios. Authentication tokens from Better Auth are automatically attached to all requests to protected endpoints.

API endpoints:
- `GET /api/{user_id}/tasks` - Retrieve user's tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Mark task as complete/incomplete