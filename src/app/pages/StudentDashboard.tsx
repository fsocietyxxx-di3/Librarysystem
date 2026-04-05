import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import {
  Search,
  BookOpen,
  Bookmark,
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  Calendar,
} from 'lucide-react';

const CATEGORIES = [
  'Fiction', 'Science', 'History', 'Mathematics',
  'Literature', 'Biology', 'Geography', 'Psychology', 'Technology',
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    borrowed: 'bg-blue-100 text-blue-700',
    overdue:  'bg-red-100 text-red-700',
    returned: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function StudentDashboard() {
  const { user } = useAuth();
  const { books, borrowRecords } = useLibrary();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const studentId = user?.studentId ?? 's1';
  const myRecords = borrowRecords.filter(r => r.studentId === studentId);
  const activeBorrows = myRecords.filter(r => r.status === 'borrowed');
  const overdueBooks = myRecords.filter(r => r.status === 'overdue');

  const recentActivity = [...myRecords]
    .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
    .slice(0, 4);

  const featuredBooks = books.filter(b => b.availableCopies > 0).slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/student/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    {
      label: 'Currently Borrowed',
      value: activeBorrows.length,
      icon: BookOpen,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      border: 'border-blue-100',
    },
    {
      label: 'Overdue Books',
      value: overdueBooks.length,
      icon: AlertCircle,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      border: 'border-red-100',
    },
    {
      label: 'Total Borrowed',
      value: myRecords.length,
      icon: TrendingUp,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      border: 'border-green-100',
    },
    {
      label: 'Books Available',
      value: books.filter(b => b.availableCopies > 0).length,
      icon: Bookmark,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      border: 'border-purple-100',
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">

      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full opacity-10">
          <BookOpen size={200} className="absolute -right-8 -top-8" />
        </div>
        <h1 className="text-2xl font-bold mb-1 relative z-10">
          Welcome back, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-blue-100 text-sm mb-5 relative z-10">
          Ready to explore something new today?
        </p>
        <form onSubmit={handleSearch} className="flex gap-2 relative z-10">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search books, authors, genres..."
              className="w-full pl-9 pr-4 py-2.5 bg-white text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="bg-white/20 hover:bg-white/30 border border-white/30 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-white rounded-xl p-4 border shadow-sm ${stat.border}`}>
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center mb-3`}>
                <Icon size={19} className={stat.iconColor} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Overdue Alert */}
      {overdueBooks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-red-700">
              You have {overdueBooks.length} overdue book{overdueBooks.length > 1 ? 's' : ''}
            </div>
            <div className="text-xs text-red-600 mt-0.5">
              Please return them as soon as possible to avoid fines.{' '}
              <Link to="/student/borrowed" className="font-medium underline">View details →</Link>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-3">Browse by Category</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/student/catalog"
            className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
          >
            All Books
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/student/catalog?genre=${cat}`}
              className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors shadow-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Books + Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Featured Books */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Available to Borrow</h2>
            <Link
              to="/student/catalog"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {featuredBooks.map((book) => (
              <Link
                key={book.id}
                to={`/student/book/${book.id}`}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-semibold text-gray-900 truncate leading-snug">{book.title}</div>
                  <div className="text-gray-500 truncate mt-0.5" style={{ fontSize: '11px' }}>{book.author}</div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-gray-600" style={{ fontSize: '11px' }}>{book.rating}</span>
                    <span className="ml-auto bg-green-100 text-green-700 rounded px-1.5 py-0.5" style={{ fontSize: '9px' }}>
                      Available
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Recent Activity</h2>
            <Link
              to="/student/borrowed"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen size={32} className="text-gray-300 mx-auto mb-2" />
                <div className="text-sm text-gray-500">No activity yet</div>
                <Link to="/student/catalog" className="text-sm text-blue-600 mt-1 inline-block">Browse books →</Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentActivity.map((record) => {
                  const book = books.find(b => b.id === record.bookId);
                  if (!book) return null;
                  return (
                    <Link
                      key={record.id}
                      to={`/student/book/${book.id}`}
                      className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors"
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-10 h-13 object-cover rounded-md border border-gray-100 shrink-0"
                        style={{ height: '52px' }}
                      />
                      <div className="flex-1 min-w-0 py-0.5">
                        <div className="text-sm font-medium text-gray-900 truncate">{book.title}</div>
                        <div className="text-gray-500 truncate mt-0.5" style={{ fontSize: '11px' }}>
                          {book.author}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-gray-400" style={{ fontSize: '10px' }}>
                          <Calendar size={9} />
                          {record.status !== 'returned'
                            ? `Due: ${record.dueDate}`
                            : `Returned: ${record.returnDate}`}
                        </div>
                        <div className="mt-1.5">
                          <StatusBadge status={record.status} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Due Soon */}
      {activeBorrows.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-blue-600" />
            <h2 className="text-base font-bold text-gray-900">Due Soon</h2>
          </div>
          <div className="space-y-2">
            {activeBorrows.map((record) => {
              const book = books.find(b => b.id === record.bookId);
              if (!book) return null;
              return (
                <div key={record.id} className="flex items-center gap-3">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-8 h-10 object-cover rounded border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{book.title}</div>
                    <div className="text-gray-500" style={{ fontSize: '11px' }}>Due: {record.dueDate}</div>
                  </div>
                  <Link
                    to="/student/borrowed"
                    className="text-xs text-blue-600 hover:text-blue-700 shrink-0"
                  >
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
