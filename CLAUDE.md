# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based flashcard application built with TypeScript and Vite. The application displays multiple-choice questions (ABCD format) for learning purposes, with questions loaded from a JSON file or falling back to default questions.

## Development Commands

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run lint` - Run ESLint on the codebase
- `npm run preview` - Preview production build locally

## Architecture

### Core Components
- **src/flashcard-app.tsx** - Main application component containing all flashcard logic, state management, and UI
- **src/App.tsx** - Simple wrapper component that renders FlashcardApp
- **src/main.tsx** - Application entry point, renders FlashcardApp directly in StrictMode

### Data Structure
- **public/flashcards/index.json** - Contains list of available flashcard sets with metadata
- **public/flashcards/{setId}.json** - Individual flashcard sets (e.g., apbd.json, mas.json)
- Each flashcard set contains:
  - `metadata`: id, name, description, subject, difficulty, totalQuestions, tags, created, version
  - `questions`: array of questions with id, question, options (A-D), and correctAnswer
- Application validates JSON structure and falls back to default questions if validation fails

### State Management
- All state managed in flashcard-app.tsx using React hooks
- Tracks current question, selected answers, statistics, used questions, and loading states
- Implements question randomization with cycle prevention

### Styling
- Uses inline styles with CSS-in-JS approach
- Includes embedded CSS for button states and animations
- Responsive design with gradient backgrounds and card-based layout
- Uses Lucide React icons for UI elements

## Key Features
- Multiple flashcard sets with metadata (name, subject, difficulty, tags)
- Set selection UI with visual cards showing set information
- Loads questions from individual JSON files with fallback to defaults
- Question randomization with progress tracking per set
- Statistics tracking (correct/incorrect/total) with reset functionality
- Visual feedback for answer validation with color-coded buttons
- Ability to switch between flashcard sets during use
- Loading states and comprehensive error handling