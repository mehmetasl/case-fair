# Fullstack Todo App

A modern Todo application built with Next.js, React Context API, and MongoDB.

## Features

- Add new tasks
- List all tasks
- Update existing tasks
- Delete tasks
- Global state management with React Context API
- MongoDB Atlas integration for data persistence
- Modern UI with ShadcnUI components

## Demo Mode

The app includes a demo mode with mock data that works without MongoDB, allowing you to test the UI and functionality immediately. For full functionality with data persistence, follow the MongoDB setup instructions.

## Tech Stack

- **Frontend**: Next.js, React, ShadcnUI, Tailwind CSS
- **State Management**: React Context API
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose ODM

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```


## MongoDB Atlas Setup (Optional)

For full functionality with data persistence:

1. Configure the connection string in `.env.local`
2. Restart the application

## Project Structure

- `/src/app` - Next.js app directory
- `/src/components` - React components
- `/src/context` - React Context for state management
- `/src/lib` - Database connection and models
- `/src/app/api` - Next.js API routes

## License

MIT
