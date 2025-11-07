# **App Name**: StudyMate Lite

## Core Features:

- User Authentication: Simulated login system using Local Storage to manage user accounts.  Stores usernames, passwords and other user-related info in the browser's Local Storage. Functionalities: Create account, Login, and Logout.
- Dashboard: Displays a welcome message with the username, today’s tasks, quick navigation cards, and a study progress overview calculated from data stored in Local Storage.
- Notes Manager: Allows users to create, edit, and delete notes, saving them under the current user in Local Storage. Notes include title, content, creation date, and category.
- To-Do Task Manager: Enables users to add tasks with title, description, due date, and priority. Tasks can be marked as completed and filtered by date or priority, all stored in Local Storage.
- Study Timetable: A weekly schedule where users can add study sessions and view them in a calendar grid. Timetable data is saved locally.
- Flashcard Generator: Automatically converts uploaded text into flashcards using an LLM. Supports the user choosing different LLM providers using a 'tool' feature.
- Smart Local Search: Allows users to search through notes, tasks, study materials, and flashcards with search queries resolved locally.

## Style Guidelines:

- Primary color: Deep violet (#673AB7), providing a modern and sophisticated feel.
- Background color: Light grey (#F0F4F8), ensuring a soft, unobtrusive backdrop.
- Accent color: Sky blue (#03A9F4), used for interactive elements and highlights to draw attention.
- Body and headline font: 'Inter', a sans-serif font that offers a modern, machined look for both headlines and body text.
- Code font: 'Source Code Pro' for displaying code snippets clearly (monospace).
- Consistent use of modern, minimalist icons throughout the application to represent different actions and categories.
- Modern gradient background, glassmorphism UI cards, rounded corners (20px+), soft shadows, smooth page transitions and floating action buttons.