import { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import {
  ArrowLeft,
  Star,
  BookOpen,
  User,
  Calendar,
  FileText,
  Hash,
  CheckCircle,
  XCircle,
  Bookmark,
  Share2,
} from 'lucide-react';

export function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { books, borrowRecords, borrowBook } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const [borrowed, setBorrowed] = useState(false);
  const [borrowError, setBorrowError] = useState('');

  const book = books.find(b => b.id === id);
  const catalogPath = isAdmin ? '/admin/catalog' : '/student/catalog';

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <BookOpen size={48} className="text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Book Not Found</h2>
        <p className="text-sm text-gray-500 mb-4">This book doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate(catalogPath)}
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const studentId = user?.studentId ?? 's1';
  const alreadyBorrowed = borrowRecords.some(
    r => r.studentId === studentId && r.bookId === book.id && r.status !== 'returned'
  );

  const handleBorrow = () => {
    if (!user || user.role !== 'student') return;
    if (alreadyBorrowed) {
      setBorrowError('You have already borrowed this book.');
      return;
    }
    const success = borrowBook(studentId, book.id);
    if (success) {
      setBorrowed(true);
      setBorrowError('');
    } else {
      setBorrowError('No copies available at the moment.');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < Math.floor(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300 fill-gray-300'}
      />
    ));
  };

  const relatedBooks = books
    .filter(b => b.genre === book.genre && b.id !== book.id)
    .slice(0, 4);

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <span>/</span>
        <Link to={catalogPath} className="hover:text-blue-600 transition-colors">Catalog</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">{book.title}</span>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-3 gap-0">
          {/* Cover */}
          <div className="md:col-span-1 bg-gray-50 p-6 flex flex-col items-center gap-4 border-b md:border-b-0 md:border-r border-gray-100">
            <div className="w-48 md:w-full max-w-[200px] aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full max-w-[200px] space-y-2">
              {/* Availability */}
              <div className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium ${
                book.availableCopies > 0
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {book.availableCopies > 0 ? (
                  <>
                    <CheckCircle size={15} />
                    {book.availableCopies} of {book.totalCopies} Available
                  </>
                ) : (
                  <>
                    <XCircle size={15} />
                    All Copies Borrowed
                  </>
                )}
              </div>

              {/* Action buttons */}
              {user?.role === 'student' && (
                <div className="space-y-2">
                  {borrowed || alreadyBorrowed ? (
                    <div className="flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600 text-white rounded-xl text-sm font-medium">
                      <CheckCircle size={15} />
                      {borrowed ? 'Borrowed Successfully!' : 'Already Borrowed'}
                    </div>
                  ) : (
                    <button
                      onClick={handleBorrow}
                      disabled={book.availableCopies === 0}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Bookmark size={15} />
                      Borrow This Book
                    </button>
                  )}
                  {borrowError && (
                    <p className="text-xs text-red-600 text-center">{borrowError}</p>
                  )}
                  {borrowed && (
                    <p className="text-xs text-green-600 text-center">
                      Due in 14 days. Check "My Borrowed Books".
                    </p>
                  )}
                </div>
              )}

              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 p-6">
            {/* Genre badge */}
            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full mb-3">
              {book.genre}
            </span>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">{book.title}</h1>
            <p className="text-gray-600 text-base mb-3">by {book.author}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">{renderStars(book.rating)}</div>
              <span className="text-sm font-medium text-gray-700">{book.rating}</span>
              <span className="text-gray-400 text-sm">/ 5.0</span>
            </div>

            {/* Book metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { icon: User, label: 'Author', value: book.author },
                { icon: Calendar, label: 'Published', value: book.publishedYear > 0 ? book.publishedYear : `${Math.abs(book.publishedYear)} BC` },
                { icon: FileText, label: 'Pages', value: `${book.pages} pages` },
                { icon: Hash, label: 'ISBN', value: book.isbn },
                { icon: BookOpen, label: 'Total Copies', value: book.totalCopies },
                { icon: CheckCircle, label: 'Available', value: book.availableCopies },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon size={12} className="text-gray-400" />
                    <span className="text-gray-500" style={{ fontSize: '10px' }}>{label.toUpperCase()}</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">{value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-3">
            More in {book.genre}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {relatedBooks.map((related) => (
              <Link
                key={related.id}
                to={`${isAdmin ? '/admin' : '/student'}/book/${related.id}`}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={related.coverImage}
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">{related.title}</div>
                  <div className="text-gray-500 truncate mt-0.5" style={{ fontSize: '11px' }}>{related.author}</div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-gray-600" style={{ fontSize: '11px' }}>{related.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
