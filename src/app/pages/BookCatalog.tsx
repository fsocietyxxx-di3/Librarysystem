import { useState, useMemo } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router';
import { useLibrary } from '../context/LibraryContext';
import { BOOK_GENRES } from '../data/sampleData';
import {
  Search,
  Filter,
  Star,
  BookOpen,
  X,
  Grid,
  List,
  ChevronDown,
} from 'lucide-react';

const AVAILABILITY_OPTIONS = ['All', 'Available', 'Unavailable'];
const SORT_OPTIONS = [
  { label: 'Title A–Z', value: 'title-asc' },
  { label: 'Title Z–A', value: 'title-desc' },
  { label: 'Rating (High)', value: 'rating-desc' },
  { label: 'Newest First', value: 'year-desc' },
];

export function BookCatalog() {
  const { books } = useLibrary();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const bookBasePath = isAdmin ? '/admin/book' : '/student/book';

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const searchQuery = searchParams.get('search') ?? '';
  const selectedGenre = searchParams.get('genre') ?? 'All';
  const availability = searchParams.get('availability') ?? 'All';
  const sortBy = searchParams.get('sort') ?? 'title-asc';

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
      );
    }

    if (selectedGenre && selectedGenre !== 'All') {
      result = result.filter(b => b.genre === selectedGenre);
    }

    if (availability === 'Available') {
      result = result.filter(b => b.availableCopies > 0);
    } else if (availability === 'Unavailable') {
      result = result.filter(b => b.availableCopies === 0);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'title-desc': return b.title.localeCompare(a.title);
        case 'rating-desc': return b.rating - a.rating;
        case 'year-desc': return b.publishedYear - a.publishedYear;
        default: return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [books, searchQuery, selectedGenre, availability, sortBy]);

  const clearFilters = () => setSearchParams({});
  const hasActiveFilters = searchQuery || (selectedGenre && selectedGenre !== 'All') || (availability && availability !== 'All');

  return (
    <div className="flex h-full">
      {/* Filter Sidebar */}
      <aside
        className={`${
          showFilters ? 'block' : 'hidden'
        } lg:block w-full lg:w-56 xl:w-64 shrink-0 border-r border-gray-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto p-4 space-y-5 fixed inset-0 z-10 overflow-y-auto lg:relative lg:z-auto`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Filters</h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-blue-600 hover:text-blue-700">
                Clear all
              </button>
            )}
            <button
              className="lg:hidden text-gray-500"
              onClick={() => setShowFilters(false)}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Genre Filter */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Genre</h4>
          <div className="space-y-1">
            {['All', ...BOOK_GENRES].map((genre) => (
              <button
                key={genre}
                onClick={() => updateParam('genre', genre)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  (selectedGenre === genre) || (!selectedGenre && genre === 'All')
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {genre}
                <span className="ml-1 text-xs opacity-60">
                  ({genre === 'All' ? books.length : books.filter(b => b.genre === genre).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Availability</h4>
          <div className="space-y-1">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => updateParam('availability', opt)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  (availability === opt) || (!availability && opt === 'All')
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => updateParam('search', e.target.value)}
              placeholder="Search by title, author, or genre..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => updateParam('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
            >
              <Filter size={14} />
              Filters
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  !
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => updateParam('sort', e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'} transition-colors`}
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'} transition-colors`}
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredBooks.length}</span> books
            {selectedGenre && selectedGenre !== 'All' && (
              <span> in <span className="font-semibold text-blue-600">{selectedGenre}</span></span>
            )}
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
            >
              <X size={10} /> Clear filters
            </button>
          )}
        </div>

        {/* No results */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-700 mb-1">No books found</h3>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && filteredBooks.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredBooks.map((book) => (
              <Link
                key={book.id}
                to={`${bookBasePath}/${book.id}`}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                    book.availableCopies > 0
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}>
                    {book.availableCopies > 0 ? 'Available' : 'Out'}
                  </div>
                </div>
                <div className="p-2.5">
                  <div className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">{book.title}</div>
                  <div className="text-gray-500 truncate mt-0.5" style={{ fontSize: '11px' }}>{book.author}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-0.5">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-gray-600" style={{ fontSize: '11px' }}>{book.rating}</span>
                    </div>
                    <span className="bg-blue-50 text-blue-600 rounded px-1.5 py-0.5" style={{ fontSize: '9px' }}>
                      {book.genre}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && filteredBooks.length > 0 && (
          <div className="space-y-3">
            {filteredBooks.map((book) => (
              <Link
                key={book.id}
                to={`${bookBasePath}/${book.id}`}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex items-start gap-4 group"
              >
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-14 h-20 object-cover rounded-lg border border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{book.title}</h3>
                      <p className="text-gray-500 text-xs mt-0.5">{book.author} · {book.publishedYear}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        book.availableCopies > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {book.availableCopies > 0 ? `${book.availableCopies} avail.` : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-2 line-clamp-2">{book.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-blue-50 text-blue-600 rounded-full px-2.5 py-0.5 text-xs">{book.genre}</span>
                    <div className="flex items-center gap-1">
                      <Star size={10} className="text-amber-400 fill-amber-400" />
                      <span className="text-gray-600 text-xs">{book.rating}</span>
                    </div>
                    <span className="text-gray-400 text-xs">{book.pages} pages</span>
                    <span className="text-gray-400 text-xs">ISBN: {book.isbn}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
