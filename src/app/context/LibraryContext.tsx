import { createContext, useContext, useState, ReactNode } from 'react';
import {
  Book,
  BorrowRecord,
  Student,
  books as initialBooks,
  borrowRecords as initialRecords,
  students as initialStudents,
} from '../data/sampleData';

interface LibraryContextType {
  books: Book[];
  borrowRecords: BorrowRecord[];
  students: Student[];
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  borrowBook: (studentId: string, bookId: string) => boolean;
  returnBook: (recordId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(initialRecords);
  const [students] = useState<Student[]>(initialStudents);

  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook: Book = { ...book, id: `b${Date.now()}` };
    setBooks(prev => [...prev, newBook]);
  };

  const updateBook = (book: Book) => {
    setBooks(prev => prev.map(b => (b.id === book.id ? book : b)));
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const borrowBook = (studentId: string, bookId: string): boolean => {
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies === 0) return false;

    const borrowDate = new Date('2026-04-05');
    const dueDate = new Date('2026-04-05');
    dueDate.setDate(dueDate.getDate() + 14);

    const newRecord: BorrowRecord = {
      id: `r${Date.now()}`,
      studentId,
      bookId,
      borrowDate: borrowDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'borrowed',
    };

    setBorrowRecords(prev => [...prev, newRecord]);
    setBooks(prev =>
      prev.map(b =>
        b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b
      )
    );
    return true;
  };

  const returnBook = (recordId: string) => {
    const record = borrowRecords.find(r => r.id === recordId);
    if (!record) return;

    setBorrowRecords(prev =>
      prev.map(r =>
        r.id === recordId
          ? { ...r, returnDate: '2026-04-05', status: 'returned' as const }
          : r
      )
    );
    setBooks(prev =>
      prev.map(b =>
        b.id === record.bookId
          ? { ...b, availableCopies: b.availableCopies + 1 }
          : b
      )
    );
  };

  return (
    <LibraryContext.Provider
      value={{ books, borrowRecords, students, addBook, updateBook, deleteBook, borrowBook, returnBook }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
}
