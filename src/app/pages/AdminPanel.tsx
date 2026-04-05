import { useState } from 'react';
import { Link } from 'react-router';
import { useLibrary } from '../context/LibraryContext';
import { Book, BOOK_GENRES } from '../data/sampleData';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  BookOpen,
  Users,
  AlertCircle,
  Star,
  X,
  CheckCircle,
  BookMarked,
  BarChart2,
} from 'lucide-react';

type BookFormData = Omit<Book, 'id'>;

const EMPTY_FORM: BookFormData = {
  title: '',
  author: '',
  genre: BOOK_GENRES[0],
  description: '',
  coverImage: '',
  isbn: '',
  publishedYear: 2024,
  totalCopies: 1,
  availableCopies: 1,
  rating: 4.0,
  pages: 100,
};

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

function BookForm({
  initial,
  onSave,
  onCancel,
  submitLabel,
}: {
  initial: BookFormData;
  onSave: (data: BookFormData) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [form, setForm] = useState<BookFormData>(initial);
  const set = (key: keyof BookFormData, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
          <input
            required
            value={form.title}
            onChange={e => set('title', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Book title"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Author *</label>
          <input
            required
            value={form.author}
            onChange={e => set('author', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Author name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Genre *</label>
          <select
            required
            value={form.genre}
            onChange={e => set('genre', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {BOOK_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">ISBN</label>
          <input
            value={form.isbn}
            onChange={e => set('isbn', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="978-0-000-00000-0"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Published Year</label>
          <input
            type="number"
            value={form.publishedYear}
            onChange={e => set('publishedYear', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2024"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Pages</label>
          <input
            type="number"
            min={1}
            value={form.pages}
            onChange={e => set('pages', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="200"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Total Copies</label>
          <input
            type="number"
            min={1}
            value={form.totalCopies}
            onChange={e => set('totalCopies', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Available Copies</label>
          <input
            type="number"
            min={0}
            max={form.totalCopies}
            value={form.availableCopies}
            onChange={e => set('availableCopies', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Rating (0–5)</label>
          <input
            type="number"
            step={0.1}
            min={0}
            max={5}
            value={form.rating}
            onChange={e => set('rating', Number(e.target.value))}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Cover Image URL</label>
          <input
            value={form.coverImage}
            onChange={e => set('coverImage', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://..."
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Book description..."
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

export function AdminPanel() {
  const { books, borrowRecords, students, addBook, updateBook, deleteBook } = useLibrary();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');

  const filtered = books.filter(b => {
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    const matchGenre = genreFilter === 'All' || b.genre === genreFilter;
    return matchSearch && matchGenre;
  });

  const totalAvailable = books.reduce((acc, b) => acc + b.availableCopies, 0);
  const totalBorrowed = books.reduce((acc, b) => acc + (b.totalCopies - b.availableCopies), 0);
  const overdueCount = borrowRecords.filter(r => r.status === 'overdue').length;
  const activeborrows = borrowRecords.filter(r => r.status === 'borrowed').length;

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleAdd = (data: BookFormData) => {
    addBook(data);
    setShowAddModal(false);
    showSuccess('Book added successfully!');
  };

  const handleEdit = (data: BookFormData) => {
    if (!editBook) return;
    updateBook({ ...data, id: editBook.id });
    setEditBook(null);
    showSuccess('Book updated successfully!');
  };

  const handleDelete = (id: string) => {
    deleteBook(id);
    setDeleteId(null);
    showSuccess('Book deleted successfully!');
  };

  const stats = [
    { label: 'Total Books', value: books.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Books Borrowed', value: activeborrows + overdueCount, icon: BookMarked, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Overdue Books', value: overdueCount, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Registered Students', value: students.length, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Book Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Add, edit, and manage the library's book collection</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shrink-0"
        >
          <Plus size={16} />
          Add Book
        </button>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
          <CheckCircle size={15} />
          {successMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={stat.color} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Link to="/admin/users" className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users size={17} className="text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">User Management</div>
            <div className="text-xs text-gray-500">{students.length} students</div>
          </div>
        </Link>
        <Link to="/admin/catalog" className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
            <BookOpen size={17} className="text-purple-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">View Catalog</div>
            <div className="text-xs text-gray-500">Student-facing view</div>
          </div>
        </Link>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
            <BarChart2 size={17} className="text-amber-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">Availability</div>
            <div className="text-xs text-gray-500">{totalAvailable} copies free</div>
          </div>
        </div>
      </div>

      {/* Book Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search books..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={genreFilter}
            onChange={e => setGenreFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            <option value="All">All Genres</option>
            {BOOK_GENRES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {filtered.length} books
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3 w-16">Cover</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Title & Author</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Genre</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Year</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Rating</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Copies</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-4 py-3">Available</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded-lg border border-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/book/${book.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors block">
                      {book.title}
                    </Link>
                    <span className="text-xs text-gray-500">{book.author}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                      {book.genre}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{book.publishedYear}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm text-gray-700">{book.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{book.totalCopies}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      book.availableCopies === 0
                        ? 'bg-red-100 text-red-700'
                        : book.availableCopies <= 1
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {book.availableCopies}/{book.totalCopies}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setEditBook(book)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(book.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map((book) => (
            <div key={book.id} className="p-4 flex gap-3">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-12 h-16 object-cover rounded-lg border border-gray-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <Link to={`/admin/book/${book.id}`} className="text-sm font-medium text-gray-900 block truncate hover:text-blue-600">
                  {book.title}
                </Link>
                <div className="text-xs text-gray-500 mt-0.5">{book.author}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{book.genre}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    book.availableCopies === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {book.availableCopies}/{book.totalCopies}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => setEditBook(book)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setDeleteId(book.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={36} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No books match your search</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Book">
        <BookForm
          initial={EMPTY_FORM}
          onSave={handleAdd}
          onCancel={() => setShowAddModal(false)}
          submitLabel="Add Book"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editBook} onClose={() => setEditBook(null)} title="Edit Book">
        {editBook && (
          <BookForm
            initial={editBook}
            onSave={handleEdit}
            onCancel={() => setEditBook(null)}
            submitLabel="Save Changes"
          />
        )}
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Book">
        <div className="py-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Are you sure you want to delete this book?</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {deleteId && books.find(b => b.id === deleteId)?.title}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-5">
            This action cannot be undone. All borrowing records for this book will remain in history.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => deleteId && handleDelete(deleteId)}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete Book
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
