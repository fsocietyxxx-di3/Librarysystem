import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { BookCatalog } from './pages/BookCatalog';
import { BookDetails } from './pages/BookDetails';
import { BorrowedBooks } from './pages/BorrowedBooks';
import { AdminPanel } from './pages/AdminPanel';
import { UserManagement } from './pages/UserManagement';

export const router = createBrowserRouter([
  { path: '/', Component: LoginPage },
  {
    path: '/student',
    Component: Layout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: 'catalog', Component: BookCatalog },
      { path: 'book/:id', Component: BookDetails },
      { path: 'borrowed', Component: BorrowedBooks },
    ],
  },
  {
    path: '/admin',
    Component: Layout,
    children: [
      { index: true, Component: AdminPanel },
      { path: 'books', Component: AdminPanel },
      { path: 'users', Component: UserManagement },
      { path: 'catalog', Component: BookCatalog },
      { path: 'book/:id', Component: BookDetails },
    ],
  },
]);
