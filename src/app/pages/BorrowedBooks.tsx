import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Filter,
  ArrowUpDown,
} from 'lucide-react';

type FilterType = 'all' | 'borrowed' | 'overdue' | 'returned';

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
    borrowed: {
      cls: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <Clock size={11} />,
      label: 'Active',
    },
    overdue: {
      cls: 'bg-red-100 text-red-700 border-red-200',
      icon: <AlertCircle size={11} />,
      label: 'Overdue',
    },
    returned: {
      cls: 'bg-green-100 text-green-700 border-green-200',
      icon: <CheckCircle size={11} />,
      label: 'Returned',
    },
  };
  const c = config[status] ?? { cls: 'bg-gray-100 text-gray-700 border-gray-200', icon: null, label: status };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${c.cls}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

export function BorrowedBooks() {
  const { user } = useAuth();
  const { books, borrowRecords, returnBook } = useLibrary();
  const [filter, setFilter] = useState<FilterType>('all');
  const [returningId, setReturnId] = useState<string | null>(null);
  const [returnedIds, setReturnedIds] = useState<Set<string>>(new Set());

  const studentId = user?.studentId ?? 's1';
  const myRecords = borrowRecords.filter(r => r.studentId === studentId);

  const filteredRecords = myRecords.filter(r => {
    if (filter === 'all') return true;
    return r.status === filter;
  }).sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime());

  const counts = {
    all: myRecords.length,
    borrowed: myRecords.filter(r => r.status === 'borrowed').length,
    overdue: myRecords.filter(r => r.status === 'overdue').length,
    returned: myRecords.filter(r => r.status === 'returned').length,
  };

  const handleReturn = async (recordId: string) => {
    setReturnId(recordId);
    await new Promise(r => setTimeout(r, 500));
    returnBook(recordId);
    setReturnedIds(prev => new Set([...prev, recordId]));
    setReturnId(null);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date('2026-04-05');
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const FILTER_TABS: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'borrowed', label: 'Active' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'returned', label: 'Returned' },
  ];

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-0.5">My Borrowed Books</h1>
        <p className="text-sm text-gray-500">Track your borrowing history and manage returns</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Borrowed', value: counts.all, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Borrows', value: counts.borrowed, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Overdue', value: counts.overdue, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Returned', value: counts.returned, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl p-3.5 border border-gray-100 shadow-sm">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
                <Icon size={16} className={card.color} />
              </div>
              <div className="text-xl font-bold text-gray-900">{card.value}</div>
              <div className="text-xs text-gray-500">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Overdue Alert */}
      {counts.overdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-red-800">
              {counts.overdue} book{counts.overdue > 1 ? 's are' : ' is'} overdue
            </div>
            <div className="text-xs text-red-600 mt-0.5">
              Please return them immediately to the library to avoid penalty fees.
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`text-xs rounded-full px-1.5 py-0.5 ${
              filter === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Book List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <BookOpen size={40} className="text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-700 mb-1">No books here</h3>
          <p className="text-sm text-gray-500 mb-4">
            {filter === 'all'
              ? "You haven't borrowed any books yet."
              : `No ${filter} books found.`}
          </p>
          <Link
            to="/student/catalog"
            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <BookOpen size={14} />
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => {
            const book = books.find(b => b.id === record.bookId);
            if (!book) return null;
            const daysUntilDue = getDaysUntilDue(record.dueDate);
            const isActive = record.status === 'borrowed' || record.status === 'overdue';

            return (
              <div
                key={record.id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                  record.status === 'overdue' ? 'border-red-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start gap-4 p-4">
                  {/* Book Cover */}
                  <Link to={`/student/book/${book.id}`} className="shrink-0">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-14 h-20 object-cover rounded-lg border border-gray-100 hover:opacity-80 transition-opacity"
                    />
                  </Link>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <Link
                          to={`/student/book/${book.id}`}
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {book.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
                      </div>
                      <StatusBadge status={record.status} />
                    </div>

                    {/* Dates */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar size={11} />
                        <span style={{ fontSize: '11px' }}>Borrowed: {record.borrowDate}</span>
                      </div>
                      <div className={`flex items-center gap-1.5 ${
                        record.status === 'overdue' ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        <Clock size={11} />
                        <span style={{ fontSize: '11px' }}>
                          Due: {record.dueDate}
                          {isActive && (
                            <span className={`ml-1 font-medium ${
                              daysUntilDue < 0
                                ? 'text-red-600'
                                : daysUntilDue <= 2
                                ? 'text-amber-600'
                                : 'text-gray-500'
                            }`}>
                              ({daysUntilDue < 0
                                ? `${Math.abs(daysUntilDue)} days overdue`
                                : daysUntilDue === 0
                                ? 'Due today!'
                                : `${daysUntilDue} days left`})
                            </span>
                          )}
                        </span>
                      </div>
                      {record.returnDate && (
                        <div className="flex items-center gap-1.5 text-green-600">
                          <CheckCircle size={11} />
                          <span style={{ fontSize: '11px' }}>Returned: {record.returnDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Genre badge */}
                    <div className="mt-2">
                      <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                        {book.genre}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  {isActive && (
                    <div className="shrink-0">
                      <button
                        onClick={() => handleReturn(record.id)}
                        disabled={returningId === record.id || returnedIds.has(record.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          record.status === 'overdue'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                      >
                        {returningId === record.id ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <RotateCcw size={12} />
                        )}
                        {returningId === record.id ? 'Returning...' : 'Return'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Overdue warning bar */}
                {record.status === 'overdue' && (
                  <div className="bg-red-50 border-t border-red-200 px-4 py-2 flex items-center gap-2">
                    <AlertCircle size={12} className="text-red-500" />
                    <span className="text-xs text-red-600">
                      This book is overdue. Please return it to the library immediately.
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
