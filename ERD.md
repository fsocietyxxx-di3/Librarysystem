# EduLib Entity Relationship Diagram (ERD)

This document describes the normalized data model and user flow for the EduLib library management UI.
It includes the authentication flow, student and librarian processes, and a Mermaid crow's foot ERD.

## Mermaid Crow's Foot ERD

```mermaid
erDiagram
    USER ||--o{ STUDENT : "may represent"
    ROLE ||--o{ USER : "assigns"
    GENRE ||--o{ BOOK : "categorizes"
    BOOK ||--o{ BORROW_RECORD : "is borrowed in"
    STUDENT ||--o{ BORROW_RECORD : "creates"

    USER ||--o{ LOGIN_PROCESS : "performs"
    USER ||--o{ STUDENT_DASHBOARD_PROCESS : "accesses if student"
    USER ||--o{ LIBRARIAN_DASHBOARD_PROCESS : "accesses if librarian"
    STUDENT ||--o{ BOOK_CATALOG_PROCESS : "browses"
    STUDENT ||--o{ BORROW_PROCESS : "performs"
    STUDENT ||--o{ RETURN_PROCESS : "performs"
    BOOK ||--o{ BORROW_PROCESS : "involved in"
    BORROW_RECORD ||--o{ BORROW_PROCESS : "created in"
    BORROW_RECORD ||--o{ RETURN_PROCESS : "updated in"
    USER ||--o{ MANAGE_BOOKS_PROCESS : "performs if librarian"
    USER ||--o{ USER_MANAGEMENT_PROCESS : "performs if librarian"
    BOOK ||--o{ MANAGE_BOOKS_PROCESS : "managed in"
    STUDENT ||--o{ USER_MANAGEMENT_PROCESS : "viewed in"

    USER {
        string id PK "User primary key"
        string name
        string email "unique login email"
        string role_id FK
        string initials
        string password_hash "demo password in real app"
    }

    ROLE {
        string id PK
        string name "student or admin"
    }

    STUDENT {
        string id PK "student profile key"
        string user_id FK "optional user account link"
        string name
        string email
        string grade
        date join_date
        string initials
    }

    GENRE {
        string id PK
        string name
    }

    BOOK {
        string id PK
        string title
        string author
        string genre_id FK
        string description
        string cover_image
        string isbn
        int published_year
        int total_copies
        int pages
        decimal rating
    }

    BORROW_RECORD {
        string id PK
        string student_id FK
        string book_id FK
        date borrow_date
        date due_date
        date return_date
        string status "borrowed, overdue, returned"
    }

    LOGIN_PROCESS {
        string description "authentication process"
    }

    STUDENT_DASHBOARD_PROCESS {
        string description "student main page"
    }

    LIBRARIAN_DASHBOARD_PROCESS {
        string description "librarian main page"
    }

    BOOK_CATALOG_PROCESS {
        string description "browse and search books"
    }

    BORROW_PROCESS {
        string description "borrow book process"
    }

    RETURN_PROCESS {
        string description "return book process"
    }

    MANAGE_BOOKS_PROCESS {
        string description "add, edit, delete books"
    }

    USER_MANAGEMENT_PROCESS {
        string description "view student borrowing history"
    }
```

## Process Flow Diagrams

### Overall System Flow

```mermaid
flowchart TD
    A[User Opens App] --> B[Load Login Page /]
    B --> C[User Enters Credentials]
    C --> D{Validate Credentials}
    D -->|Invalid| E[Show Error on Login Page]
    E --> C
    D -->|Valid| F{Determine User Role}
    F -->|Student| G[Navigate to /student]
    F -->|Librarian| H[Navigate to /admin]
    G --> I[Student Dashboard]
    H --> J[Admin Panel]
    I --> K[Student Actions]
    J --> L[Librarian Actions]
    K --> M[Logout]
    L --> M
    M --> N[Return to Login Page]
```

### Student Process Flow

```mermaid
flowchart TD
    A[Student Dashboard /student] --> B{User Action}
    B -->|Browse Catalog| C[Navigate to /student/catalog]
    B -->|View Borrowed Books| D[Navigate to /student/borrowed]
    B -->|Search/Filter Books| E[Book Catalog Page]
    C --> E
    E --> F{Select Book?}
    F -->|Yes| G[Navigate to /student/book/:id]
    F -->|No| A
    G --> H[Book Details Page]
    H --> I{Action on Book}
    I -->|Borrow Book| J{Check Availability}
    I -->|Back to Catalog| E
    J -->|Available| K[Create Borrow Record]
    J -->|Not Available| L[Show Unavailable Message]
    L --> H
    K --> M[Update Book Copies]
    M --> N[Show Success Message]
    N --> A
    D --> O[Borrowed Books Page]
    O --> P{Select Record}
    P -->|Return Book| Q[Update Record Status]
    P -->|No| A
    Q --> R[Update Book Copies]
    R --> S[Show Return Success]
    S --> A
```

### Librarian Process Flow

```mermaid
flowchart TD
    A[Admin Panel /admin] --> B{User Action}
    B -->|Manage Books| C[Book Management Section]
    B -->|View Users| D[Navigate to /admin/users]
    B -->|Browse Catalog| E[Navigate to /admin/catalog]
    C --> F{Book Operation}
    F -->|Add Book| G[Add New Book Form]
    F -->|Edit Book| H[Edit Book Form]
    F -->|Delete Book| I[Confirm Delete]
    G --> J[Save Book to Database]
    H --> J
    I --> K[Remove Book from Database]
    J --> L[Update Book List]
    K --> L
    L --> A
    D --> M[User Management Page]
    M --> N{Select User}
    N -->|Yes| O[View User Details & History]
    N -->|No| A
    O --> P[View Borrowing Records]
    P --> A
    E --> Q[Book Catalog Page]
    Q --> R{Select Book}
    R -->|Yes| S[Navigate to /admin/book/:id]
    R -->|No| A
    S --> T[Book Details Page]
    T --> U{Action}
    U -->|Edit Book| H
    U -->|Back| Q
```

## Entity Descriptions

- `USER`
  - Represents application accounts used for login and role selection.
  - In the current code, demo login uses `student@school.edu` and `librarian@school.edu` with `password123`.
  - The `role_id` connects to `ROLE` for student or librarian access.

- `ROLE`
  - Defines the type of access: `student` or `admin`.
  - This keeps role logic separate and supports 4NF by avoiding repeated multi-valued role data.

- `STUDENT`
  - Captures student profile details and registration metadata.
  - In a normalized design, student profiles are separate from authentication accounts.

- `GENRE`
  - Normalizes book categories so repeated genres are stored once.
  - This avoids repeated textual genre values in `BOOK`.

- `BOOK`
  - Stores the library's catalog metadata.
  - Copy counts are stored as attributes; availability may be derived from borrow records in a fully transactional system.

- `BORROW_RECORD`
  - Tracks each borrowing transaction between a student and a book.
  - The status field maintains the lifecycle: `borrowed`, `overdue`, or `returned`.

- `LOGIN_PROCESS`
  - The authentication process where users enter credentials to access the system.

- `STUDENT_DASHBOARD_PROCESS`
  - The main dashboard for students showing borrowed books, available books, and navigation options.

- `LIBRARIAN_DASHBOARD_PROCESS`
  - The main dashboard for librarians showing book statistics, overdue books, and management options.

- `BOOK_CATALOG_PROCESS`
  - The process of browsing, searching, and filtering the book catalog.

- `BORROW_PROCESS`
  - The process of borrowing a book, including checking availability and creating borrow records.

- `RETURN_PROCESS`
  - The process of returning a borrowed book, updating records and availability.

- `MANAGE_BOOKS_PROCESS`
  - The process for librarians to add, edit, or delete books in the catalog.

- `USER_MANAGEMENT_PROCESS`
  - The process for librarians to view student information and borrowing histories.

## Normalization Notes (1NF, 2NF, 3NF, 4NF)

1. First Normal Form (1NF)
   - All tables contain atomic values.
   - Each record has a unique primary key.
   - No repeating groups or arrays are stored in columns.

2. Second Normal Form (2NF)
   - Every non-key attribute fully depends on the table's primary key.
   - `BORROW_RECORD` uses a single key `id`, and all fields describe that borrowing event.
   - `BOOK` attributes describe only the book itself.

3. Third Normal Form (3NF)
   - No transitive dependencies exist between non-key attributes.
   - `GENRE` is separated from `BOOK` so book category text is not duplicated.
   - `ROLE` is separated from `USER` so role names are not repeated inconsistently.

4. Fourth Normal Form (4NF)
   - No table contains more than one independent multi-valued fact.
   - Each relation captures one relationship type: user-role, student, book-genre, book borrow.
   - The design avoids multi-valued dependencies by storing genre, role, and borrow details in separate tables.

## Application Flow

### Authentication Flow

1. User lands on `LoginPage.tsx`.
2. The login form submits to `AuthContext`.
3. `AuthProvider` verifies credentials and sets `user` state.
4. If the account is the student demo user, the app navigates to `/student`.
5. If the account is the librarian demo user, the app navigates to `/admin`.
6. If authentication fails, the login page shows an error.

> Note: The current code does not implement a signup page. A normalized registration flow would create a new `USER` record and optionally a linked `STUDENT` record.

### Student Process

- After signing in, the student sees `StudentDashboard.tsx`.
- The dashboard displays:
  - active borrowed count
  - overdue count
  - total borrowed
  - available books count
  - search form and category links.
- The student can browse the catalog via `BookCatalog.tsx`:
  - search, filter by genre, sort, and toggle grid/list.
- The student can open `BookDetails.tsx`:
  - view book metadata, availability, description, and related books.
  - borrow a book if copies are available.
- Borrowing creates a new `BORROW_RECORD` and reduces `available_copies` for the `BOOK`.
- The student can view `BorrowedBooks.tsx`:
  - filter active, overdue, or returned records.
  - return borrowed books, which updates the borrow record and inventory.

### Librarian/Admin Process

- After signing in, the librarian sees `AdminPanel.tsx`.
- The admin dashboard shows:
  - collection statistics, active borrow count, overdue counts.
  - a searchable and filterable book table.
- The librarian can manage books:
  - add new books
  - edit existing book records
  - delete books
- The librarian can view `UserManagement.tsx`:
  - student account summary
  - borrowing history and overdue status
  - filter students by name, email, or grade

## Page Map

- `/` → `LoginPage`
- `/student` → `Layout` → `StudentDashboard`
- `/student/catalog` → `BookCatalog`
- `/student/book/:id` → `BookDetails`
- `/student/borrowed` → `BorrowedBooks`
- `/admin` → `Layout` → `AdminPanel`
- `/admin/books` → `AdminPanel`
- `/admin/users` → `UserManagement`
- `/admin/catalog` → `BookCatalog`
- `/admin/book/:id` → `BookDetails`

## How to Use This File

- Open this file in a Markdown preview or Mermaid live editor to render the diagram.
- The diagram is written in Mermaid ERD syntax for crow's foot notation.
- Use it as a reference for implementing a normalized database schema or building a backend API layer.
