
export type Note = {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
};

export type TimetableEntry = {
  id: string;
  subject: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
};

export type StudyMaterial = {
  id: string;
  name: string;
  path: string; // Note: In browser, this will be filename, not full path
  subject: string;
  date: string;
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
};

export type FlashcardDeck = {
  id:string;
  name: string;
  cards: Flashcard[];
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
};

export type UserStats = {
  studyHoursWeekly: Record<string, number>;
  tasksCompleted: number;
  flashcardsReviewed: number;
};

export type UserData = {
  name: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  age: string;
  studyClass: string;
  favoriteSubject: string;
  hobby: string;
  futureAmbition: string;
  bio: string;
  notes: Note[];
  tasks: Task[];
  timetable: TimetableEntry[];
  materials: StudyMaterial[];
  flashcardDecks: FlashcardDeck[];
  notifications: Notification[];
  stats: UserStats;
};

export type User = {
  username: string;
  email: string;
  password?: string;
  data: UserData;
};
