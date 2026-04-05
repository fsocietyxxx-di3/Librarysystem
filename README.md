
# EduLib - Library Management UI

EduLib is a React-based library management interface designed for school use. It includes a student portal and a librarian/admin portal with a demo login, book catalog, borrowing workflow, and administrative tools.

## Key Features

- **Role-based access**
  - Student login and admin/librarian login.
  - Separate student and admin dashboards and navigation.
- **Student dashboard**
  - Welcome banner with quick search.
  - Borrowing statistics and overdue alerts.
  - Category shortcuts and featured book recommendations.
- **Book catalog**
  - Search by title, author, or genre.
  - Filter by genre and availability.
  - Sort by title, rating, and publication year.
  - Grid and list view modes.
- **Book details page**
  - Shows cover, metadata, description, availability, and related books.
  - Student borrowing action on eligible books.
- **Borrowed books management**
  - Student view of active, overdue, and returned books.
  - Return action for borrowed books.
- **Admin dashboard**
  - Manage books: add, edit, delete.
  - View collection statistics and overdue counts.
- **User management**
  - Admin view of student profiles.
  - Track borrowing history and overdue records.

## Application Structure

- `src/app/App.tsx`
  - Wraps the app in `AuthProvider` and `LibraryProvider` and renders the router.
- `src/app/routes.tsx`
  - Defines client routes for `/`, `/student/*`, and `/admin/*`.
- `src/app/components/Layout.tsx`
  - Shared layout for authenticated pages with sidebar navigation and header.
- `src/app/context/AuthContext.tsx`
  - Demo authentication state and login logic for student and librarian accounts.
- `src/app/context/LibraryContext.tsx`
  - In-memory state for books, students, and borrow records.
  - Includes actions for adding, updating, deleting books, borrowing, and returning.
- `src/app/data/sampleData.ts`
  - Seed data for books, students, and borrow records.
- `src/app/pages/`
  - `LoginPage.tsx` — login UI and demo account buttons.
  - `StudentDashboard.tsx` — student home page with search, stats, and categories.
  - `BookCatalog.tsx` — searchable catalog with filters and view toggles.
  - `BookDetails.tsx` — detailed book profile and borrow action.
  - `BorrowedBooks.tsx` — student borrowing history and returns.
  - `AdminPanel.tsx` — book management UX with modals and stats.
  - `UserManagement.tsx` — admin view of student accounts and borrowing activity.

## Demo Accounts

- Student: `student@school.edu`
- Librarian: `librarian@school.edu`
- Password: `password123`

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser at `http://localhost:5173/`.

## Technical Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Lucide icons
- Radix UI primitives and utility components

## Notes for Developers

- The app uses mock data in `src/app/data/sampleData.ts`, so all state is client-side only.
- Authentication is simulated in `src/app/context/AuthContext.tsx` and accepts only the demo accounts.
- The librarian/admin experience is mainly for managing inventory and viewing borrower activity.

---

## Project Goals

EduLib is intended as a polished school library UI prototype. It supports a complete student browsing experience, simplified borrowing workflow, and a librarian-facing management console with clear insights.
  
