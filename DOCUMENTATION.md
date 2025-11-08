
# StudyMate Lite: Comprehensive User Guide

## 1. Introduction

Welcome to **StudyMate Lite**! This guide provides a complete overview of the application, from initial setup to a detailed walkthrough of every feature.

StudyMate Lite is a powerful, local-first study application designed for students. It combines essential organization tools with AI-powered features to create a private and efficient study environment. Because all data is stored on your device, you have full control and offline access.

---

## 2. Tech Stack

The application is built with a modern and robust technology stack:

- **Framework**: Next.js (using the App Router)
- **Language**: TypeScript
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui
- **Generative AI**: Google's Genkit with Gemini
- **State Management**: React Context API for local state

---

## 3. Getting Started

Follow these steps to get the project running on your local machine.

### Step 1: Prerequisites

Ensure you have **Node.js** installed. You can download it from [nodejs.org](https://nodejs.org/).

### Step 2: Installation

Open your terminal, clone the repository (if you have it in a git repo), and install the necessary dependencies.

```bash
npm install
```

### Step 3: Set Up Environment Variables

The AI features require an API key from Google's Gemini.

1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey) to generate your free API key.
2.  Create a file named `.env` in the root directory of the project.
3.  Add your API key to the `.env` file like this:

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### Step 4: Run the Application

Start the development server with this command:

```bash
npm run dev
```

The application will now be running at `http://localhost:9002`.

---

## 4. Application Walkthrough

### 4.1. Authentication (Sign Up & Login)

- **Local-First**: Your account is created and stored entirely in your browser's local storage. No data is sent to a server.
- **Sign Up**: Create an account with a unique username, email, and password. The username must contain both letters and numbers (e.g., `roy2025`).
- **Login**: Use your email and password to log in.

### 4.2. Profile Setup

- After your first signup, you will be redirected to the **Edit Profile** page.
- It is mandatory to fill in your `Full Name` and other details to proceed to the main application. This ensures a personalized experience.
- You can update your profile at any time from the user menu or the **Settings** page.

### 4.3. Main Layout

The main application has three parts:

- **App Sidebar (Left)**: Provides navigation to all the main features. It also includes a notification center.
- **App Header (Top)**: Shows the current page title, a global search bar, a world clock, theme toggle (light/dark mode), and a user menu for accessing your profile and settings.
- **Main Content Area**: This is where the content for each page is displayed.

### 4.4. Page-by-Page Guide

#### **Dashboard**

This is your central hub. It features:
- A welcome message.
- A **Wikipedia Search** card to quickly look up topics.
- Navigation cards for quick access to all major features (Notes, Tasks, Timetable, etc.).
- Sections for "Today's Tasks" and "Study Progress" (these are placeholders for future functionality).

#### **Notes**

- **Create & Edit Notes**: On the left, you'll find a form to create a new note or edit an existing one. Just add a title and content, then click "Add Note."
- **Your Notes List**: On the right, all your saved notes are displayed. You can click the **Edit** (pencil) icon to modify a note or the **Delete** (trash) icon to remove it.

#### **Tasks**

- **Add a Task**: Use the input field at the top to add new tasks to your to-do list.
- **Pending & Completed**: Tasks are split into two sections: "To-Do" and "Completed."
- **Manage Tasks**: Click the checkbox to mark a task as complete (it will move to the "Completed" section). Click the **Delete** icon to remove a task permanently.

#### **Timetable**

- **Weekly View**: A visual grid that displays your schedule from 5 AM to 11 PM, Monday to Sunday.
- **Add/Edit Entries**: Click any empty slot on the table to open a dialog and schedule a new class or study session. You can set the subject, day, start time, and end time.
- **Mobile View**: On smaller screens, the timetable switches to a tabbed view, showing one day at a time for better readability.

#### **Flashcards**

This page is split into two main sections:
1.  **AI Flashcard Generator**:
    - Paste any text (e.g., an article, your notes) into the textarea.
    - Click **"Generate Flashcards."** The AI will process the text and create a list of front-and-back flashcards.
    - Review the generated cards. If you're happy, give the deck a name and click **"Save Deck."**
2.  **Your Flashcard Decks**:
    - All your saved decks are displayed here.
    - Click on any deck to open the flashcard viewer.
    - In the viewer, click a card to **flip** it and see the back. Use the "Previous" and "Next" buttons to navigate through the deck.

#### **Pomodoro Timer**

A tool to help you focus using the Pomodoro Technique.
- **Modes**: Switch between "Pomodoro" (25 mins), "Short Break" (5 mins), and "Long Break" (15 mins).
- **Controls**: Start, pause, and reset the timer.
- **Settings**: You can customize the duration for each mode by clicking "Show Settings."

#### **Quizzes**

Test your knowledge with trivia questions from a public API.
- **Customize Your Quiz**: Before you start, choose the number of questions, difficulty, category, and a time limit.
- **Difficulty Modes**:
  - `Super Easy` & `Easy`: No time limit per question.
  - `Medium` & `Hard`: 20-second timer per question.
  - `Super Hard`: A challenging 10-second timer per question.
- **Gameplay**: Select an answer. Correct answers are highlighted in green, incorrect in red. Quitting a `Medium` or harder quiz will result in a playful "noob" message.

#### **Smart Search**

- A powerful search page that scours both your **local data** and the **web (via Wikipedia)**.
- **Local Results**: Finds matches in your notes, tasks, and flashcard decks.
- **Web Results**: Provides a summary from Wikipedia for your query.

#### **Settings**

- **Appearance**: Switch between light, dark, and system themes.
- **Account**: Links to edit your profile or view the profile page (where you can delete your account).
- **Data Management**:
  - **Export Data**: Download a full backup of all your local data (notes, tasks, etc.) as a JSON file.
  - **Import Data**: Restore your data from a previously exported backup file.
  - **Clear All Local Data**: Permanently delete all your application data from the browser. **Use this with extreme caution!**

---

## 5. Data and Privacy

- **Local-First Principle**: This application is designed with your privacy in mind. **All data is stored in your browser's local storage.** It is never sent to or stored on any external server.
- **Data Loss Warning**: Because data is stored locally, clearing your browser's cache or local storage for this site will **permanently delete all your data**. Use the **Export Data** feature in Settings to create regular backups.

---

## 6. Credits

This application was proudly developed by **Sneha Roy**.

- **Contact**: roysneha4569@gmail.com
