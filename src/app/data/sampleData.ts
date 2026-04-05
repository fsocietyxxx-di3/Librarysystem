export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  isbn: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
  rating: number;
  pages: number;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  joinDate: string;
  initials: string;
}

export interface BorrowRecord {
  id: string;
  studentId: string;
  bookId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
}

export const BOOK_GENRES = [
  'Fiction', 'Science', 'History', 'Mathematics', 'Literature',
  'Biology', 'Geography', 'Psychology', 'Technology',
];

export const books: Book[] = [
  {
    id: 'b1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Literature',
    description: "A gripping, heart-wrenching tale of coming-of-age in a South torn apart by violent prejudice. Scout Finch narrates the story of her father Atticus Finch, an idealistic lawyer who defends a Black man falsely accused of raping a white woman. Named best novel of the 20th century by multiple book clubs.",
    coverImage: 'https://images.unsplash.com/photo-1763768861268-cb6b54173dbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-0-06-112008-4',
    publishedYear: 1960,
    totalCopies: 5,
    availableCopies: 3,
    rating: 4.8,
    pages: 281,
  },
  {
    id: 'b2',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    genre: 'Science',
    description: "A landmark volume in science writing exploring the origin, nature, and eventual fate of the universe. Stephen Hawking makes cosmology accessible without complex mathematical equations, covering the Big Bang, black holes, light cones, and superstring theory.",
    coverImage: 'https://images.unsplash.com/photo-1737307498103-f072c167fe67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-0-553-38016-3',
    publishedYear: 1988,
    totalCopies: 4,
    availableCopies: 2,
    rating: 4.7,
    pages: 212,
  },
  {
    id: 'b3',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'History',
    description: "How did Homo sapiens come to dominate the planet? This groundbreaking narrative examines the history of humankind from the Stone Age to the twenty-first century, exploring how biology and history have defined us and enhanced our understanding of what it means to be human.",
    coverImage: 'https://images.unsplash.com/photo-1764432532308-3a8feceea713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-0-06-231609-7',
    publishedYear: 2011,
    totalCopies: 6,
    availableCopies: 4,
    rating: 4.6,
    pages: 443,
  },
  {
    id: 'b4',
    title: 'Introduction to Mathematics',
    author: 'Richard Courant',
    genre: 'Mathematics',
    description: "A classic work designed for college freshman and sophomore levels. It provides a solid foundation in algebra, geometry, trigonometry, and calculus, with emphasis on problem-solving approaches and practical applications to real-world scenarios.",
    coverImage: 'https://images.unsplash.com/photo-1754304342448-3eef0ab5ba9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-0-19-501368-5',
    publishedYear: 1978,
    totalCopies: 8,
    availableCopies: 5,
    rating: 4.3,
    pages: 520,
  },
  {
    id: 'b5',
    title: 'The Complete Works of Shakespeare',
    author: 'William Shakespeare',
    genre: 'Literature',
    description: "The complete collection of Shakespeare's plays and sonnets, including Hamlet, Othello, King Lear, Macbeth, Romeo and Juliet, and many more timeless works that have defined Western literature for over four centuries and continue to influence storytelling today.",
    coverImage: 'https://images.unsplash.com/photo-1639705124623-6f81b350a7db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-0-19-953525-9',
    publishedYear: 1623,
    totalCopies: 3,
    availableCopies: 1,
    rating: 4.9,
    pages: 1344,
  },
  {
    id: 'b6',
    title: 'The Origin of Species',
    author: 'Charles Darwin',
    genre: 'Biology',
    description: "Darwin's groundbreaking work that introduced the scientific theory of evolution by natural selection. This revolutionary text explains how species change over time through natural selection, fundamentally changing our understanding of life on Earth and our place in it.",
    coverImage: 'https://images.unsplash.com/photo-1761081004966-edfc933addde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-0-14-043205-3',
    publishedYear: 1859,
    totalCopies: 4,
    availableCopies: 0,
    rating: 4.5,
    pages: 502,
  },
  {
    id: 'b7',
    title: 'World Atlas: Complete Edition',
    author: 'National Geographic',
    genre: 'Geography',
    description: "A comprehensive reference atlas featuring detailed maps, geographic information, cultural facts, and stunning photography from around the world. Perfect for students and researchers, this edition includes the latest geopolitical changes and climate data.",
    coverImage: 'https://images.unsplash.com/photo-1593371864871-79b93f287102?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-1-4262-1642-4',
    publishedYear: 2019,
    totalCopies: 5,
    availableCopies: 3,
    rating: 4.4,
    pages: 448,
  },
  {
    id: 'b8',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    description: "Set in the jazz age on Long Island, this novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and his obsession to reunite with former lover Daisy Buchanan. A masterpiece exploring themes of decadence, idealism, and social excess.",
    coverImage: 'https://images.unsplash.com/photo-1763939134220-b10281a9f18d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-0-7432-7356-5',
    publishedYear: 1925,
    totalCopies: 7,
    availableCopies: 4,
    rating: 4.2,
    pages: 180,
  },
  {
    id: 'b9',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    genre: 'Psychology',
    description: "A groundbreaking tour of the mind explaining the two systems that drive the way we think. System 1 is fast, intuitive, and emotional; System 2 is slower, deliberative, and logical. A fascinating exploration of human decision-making with real-world implications.",
    coverImage: 'https://images.unsplash.com/photo-1639705124623-6f81b350a7db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-0-374-27563-1',
    publishedYear: 2011,
    totalCopies: 5,
    availableCopies: 3,
    rating: 4.6,
    pages: 499,
  },
  {
    id: 'b10',
    title: 'The Art of War',
    author: 'Sun Tzu',
    genre: 'History',
    description: "An ancient Chinese military treatise composed of 13 chapters, each devoted to one aspect of warfare. Considered the definitive work on military strategy and tactics, with timeless principles remaining relevant in business, politics, and everyday life.",
    coverImage: 'https://images.unsplash.com/photo-1764432532308-3a8feceea713?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-1-59030-155-3',
    publishedYear: 500,
    totalCopies: 6,
    availableCopies: 5,
    rating: 4.7,
    pages: 273,
  },
  {
    id: 'b11',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    genre: 'Technology',
    description: "The most widely used textbook in programming courses worldwide. This comprehensive guide covers a wide range of algorithms in depth, making design and analysis accessible to all levels of readers with practical examples and rigorous mathematical foundations.",
    coverImage: 'https://images.unsplash.com/photo-1737307498103-f072c167fe67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-0-262-03384-8',
    publishedYear: 2009,
    totalCopies: 6,
    availableCopies: 2,
    rating: 4.8,
    pages: 1292,
  },
  {
    id: 'b12',
    title: '1984',
    author: 'George Orwell',
    genre: 'Fiction',
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism. Winston Smith, a low-ranking Party member, secretly hates the government and dreams of revolution in a world of perpetual war and pervasive government surveillance.",
    coverImage: 'https://images.unsplash.com/photo-1763768861268-cb6b54173dbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    isbn: '978-0-452-28423-4',
    publishedYear: 1949,
    totalCopies: 8,
    availableCopies: 6,
    rating: 4.7,
    pages: 328,
  },
];

export const students: Student[] = [
  { id: 's1', name: 'Alex Johnson', email: 'alex.j@school.edu', grade: '10th Grade', joinDate: '2023-09-01', initials: 'AJ' },
  { id: 's2', name: 'Emma Williams', email: 'emma.w@school.edu', grade: '11th Grade', joinDate: '2022-09-01', initials: 'EW' },
  { id: 's3', name: 'Michael Brown', email: 'michael.b@school.edu', grade: '9th Grade', joinDate: '2024-09-01', initials: 'MB' },
  { id: 's4', name: 'Sophia Davis', email: 'sophia.d@school.edu', grade: '12th Grade', joinDate: '2021-09-01', initials: 'SD' },
  { id: 's5', name: 'James Wilson', email: 'james.w@school.edu', grade: '10th Grade', joinDate: '2023-09-01', initials: 'JW' },
  { id: 's6', name: 'Olivia Martinez', email: 'olivia.m@school.edu', grade: '11th Grade', joinDate: '2022-09-01', initials: 'OM' },
  { id: 's7', name: 'William Garcia', email: 'william.g@school.edu', grade: '9th Grade', joinDate: '2024-09-01', initials: 'WG' },
  { id: 's8', name: 'Isabella Anderson', email: 'isabella.a@school.edu', grade: '12th Grade', joinDate: '2021-09-01', initials: 'IA' },
];

export const borrowRecords: BorrowRecord[] = [
  { id: 'r1',  studentId: 's1', bookId: 'b1',  borrowDate: '2026-03-22', dueDate: '2026-04-05', status: 'borrowed' },
  { id: 'r2',  studentId: 's1', bookId: 'b3',  borrowDate: '2026-02-10', dueDate: '2026-02-24', returnDate: '2026-02-20', status: 'returned' },
  { id: 'r3',  studentId: 's1', bookId: 'b5',  borrowDate: '2026-03-01', dueDate: '2026-03-15', status: 'overdue' },
  { id: 'r4',  studentId: 's1', bookId: 'b7',  borrowDate: '2026-03-28', dueDate: '2026-04-11', status: 'borrowed' },
  { id: 'r5',  studentId: 's2', bookId: 'b8',  borrowDate: '2026-03-20', dueDate: '2026-04-03', status: 'overdue' },
  { id: 'r6',  studentId: 's3', bookId: 'b6',  borrowDate: '2026-03-01', dueDate: '2026-03-15', status: 'overdue' },
  { id: 'r7',  studentId: 's4', bookId: 'b2',  borrowDate: '2026-03-25', dueDate: '2026-04-08', status: 'borrowed' },
  { id: 'r8',  studentId: 's5', bookId: 'b4',  borrowDate: '2026-02-15', dueDate: '2026-03-01', returnDate: '2026-02-28', status: 'returned' },
  { id: 'r9',  studentId: 's6', bookId: 'b9',  borrowDate: '2026-03-30', dueDate: '2026-04-13', status: 'borrowed' },
  { id: 'r10', studentId: 's7', bookId: 'b11', borrowDate: '2026-03-15', dueDate: '2026-03-29', status: 'overdue' },
  { id: 'r11', studentId: 's8', bookId: 'b12', borrowDate: '2026-03-28', dueDate: '2026-04-11', status: 'borrowed' },
  { id: 'r12', studentId: 's2', bookId: 'b1',  borrowDate: '2026-01-15', dueDate: '2026-01-29', returnDate: '2026-01-27', status: 'returned' },
  { id: 'r13', studentId: 's3', bookId: 'b10', borrowDate: '2026-03-20', dueDate: '2026-04-03', status: 'borrowed' },
  { id: 'r14', studentId: 's4', bookId: 'b3',  borrowDate: '2026-01-05', dueDate: '2026-01-19', returnDate: '2026-01-18', status: 'returned' },
];
