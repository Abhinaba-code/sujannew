# StudyMate Lite

StudyMate Lite is a comprehensive, local-first study application designed to help students organize their academic life efficiently. All your data is stored securely on your own device, ensuring complete privacy and offline access.

## ✨ Key Features

- **Local-First Storage**: Your data lives on your machine. No cloud, no servers, no privacy concerns.
- **Notes Management**: A simple and effective interface to create, edit, and delete study notes.
- **Task Organization**: Keep track of your assignments and to-do lists.
- **Weekly Timetable**: Visually plan your study week to stay organized.
- **AI-Powered Flashcards**: Paste any text and let GenAI create flashcards for you instantly.
- **Pomodoro Timer**: Boost your focus and productivity with a built-in Pomodoro timer.
- **Quizzes**: Test your knowledge with customizable quizzes from a vast question bank.
- **Smart Search**: Quickly find what you need across your notes, tasks, and flashcards.
- **Data Management**: Easily export and import your data for backups.
- **Theming**: Switch between light and dark modes to suit your preference.

## 🚀 Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Generative AI**: Google's Genkit

## 🛠️ Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).

### 1. Installation

Clone the repository and install the dependencies using npm:

```bash
npm install
```

### 2. Set Up Environment Variables

The project uses Google's Gemini for AI features. You will need a Gemini API key.

1.  Create a `.env` file in the root of the project.
2.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to get your API key.
3.  Add your API key to the `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

### 3. Running the Development Server

Start the development server with the following command:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## 📁 Project Structure

Here is an overview of the key directories in the project:

- **/src/app/**: Contains all the routes and pages of the application, following the Next.js App Router structure.
- **/src/components/**: Includes reusable UI components, with `shadcn/ui` components located in `src/components/ui`.
- **/src/contexts/**: Holds React context providers, such as the `AppProvider` for managing user state.
- **/src/hooks/**: Contains custom React hooks, like `useAuth` for accessing user data.
- **/src/lib/**: Houses utility functions, type definitions (`types.ts`), and server actions (`actions.ts`).
- **/src/ai/**: Contains the Genkit flows for AI-powered features.

## 🔒 Privacy and Data

This application is designed with privacy as a core principle. **All your user data is stored in your browser's local storage.** It is never sent to or stored on any external server.

**Important**: Because data is stored locally, clearing your browser's cache or local storage for this site will permanently delete all your data. Use the **Export Data** feature in the settings to create backups.

## ✒️ Credits

This application was developed by **Sneha Roy**.
- **Contact**: roysneha4569@gmail.com
