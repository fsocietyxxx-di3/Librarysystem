import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';

export default function App() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <RouterProvider router={router} />
      </LibraryProvider>
    </AuthProvider>
  );
}
