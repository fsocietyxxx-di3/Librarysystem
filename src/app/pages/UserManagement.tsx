import { useState } from 'react';
import { Link } from 'react-router';
import { useLibrary } from '../context/LibraryContext';
import {
  Search,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Calendar,
  Mail,
} from 'lucide-react';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    borrowed: 'bg-blue-100 text-blue-700',
    overdue: 'bg-red-100 text-red-700',
    returned: 'bg-green-100 text-green-700',
  };
  const icons: Record<string, React.ReactNode> = {
    borrowed: <Clock size={10} />,
    overdue: <AlertCircle size={10} />,
    returned: <CheckCircle size={10} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function UserManagement() {
  const { students, borrowRecords, books } = useLibrary();
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const grades = ['All', ...Array.from(new Set(students.map(s => s.grade))).sort()];

  const filtered = students.filter(s => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === 'All' || s.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  const getStudentStats = (studentId: string) => {
    const records = borrowRecords.filter(r => r.studentId === studentId);
    return {
      total: records.length,
      active: records.filter(r => r.status === 'borrowed').length,
      overdue: records.filter(r => r.status === 'overdue').length,
      returned: records.filter(r => r.status === 'returned').length,
      records,
    };
  };

  const totalOverdue = borrowRecords.filter(r => r.status === 'overdue').length;
  const totalActive = borrowRecords.filter(r => r.status === 'borrowed').length;

  return (
    <div className="p-4 lg:p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-0.5">User Management</h1>
        <p className="text-sm text-gray-500">Monitor student accounts and borrowing activity</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Students', value: students.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Borrows', value: totalActive, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Overdue Books', value: totalOverdue, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Total Records', value: borrowRecords.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <Icon size={17} className={stat.color} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={gradeFilter}
            onChange={e => setGradeFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
          >
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
            {filtered.length} of {students.length} students
          </div>
        </div>

        {/* Student List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Users size={36} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No students match your search</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((student) => {
              const stats = getStudentStats(student.id);
              const isExpanded = expandedId === student.id;
              const hasOverdue = stats.overdue > 0;

              return (
                <div key={student.id}>
                  {/* Student Row */}
                  <div
                    className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${
                      hasOverdue ? 'border-l-2 border-red-400' : ''
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : student.id)}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {student.initials}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                        {hasOverdue && (
                          <span className="flex items-center gap-0.5 bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-full">
                            <AlertCircle size={9} />
                            {stats.overdue} overdue
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-gray-500 flex items-center gap-1" style={{ fontSize: '11px' }}>
                          <Mail size={10} />
                          {student.email}
                        </span>
                        <span className="text-gray-500 flex items-center gap-1" style={{ fontSize: '11px' }}>
                          <GraduationCap size={10} />
                          {student.grade}
                        </span>
                        <span className="text-gray-400 flex items-center gap-1" style={{ fontSize: '11px' }}>
                          <Calendar size={10} />
                          Joined {student.joinDate}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-4 text-center shrink-0">
                      <div>
                        <div className="text-sm font-bold text-gray-900">{stats.total}</div>
                        <div className="text-gray-400" style={{ fontSize: '10px' }}>Total</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-blue-600">{stats.active}</div>
                        <div className="text-gray-400" style={{ fontSize: '10px' }}>Active</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-red-600">{stats.overdue}</div>
                        <div className="text-gray-400" style={{ fontSize: '10px' }}>Overdue</div>
                      </div>
                    </div>

                    {/* Expand icon */}
                    <div className="text-gray-400 shrink-0">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Expanded: Borrowing History */}
                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-100 px-4 py-4">
                      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                        Borrowing History ({stats.total} records)
                      </h4>

                      {/* Mobile stats */}
                      <div className="sm:hidden flex gap-4 mb-3">
                        {[
                          { label: 'Total', value: stats.total, color: 'text-gray-900' },
                          { label: 'Active', value: stats.active, color: 'text-blue-600' },
                          { label: 'Overdue', value: stats.overdue, color: 'text-red-600' },
                          { label: 'Returned', value: stats.returned, color: 'text-green-600' },
                        ].map(s => (
                          <div key={s.label} className="text-center">
                            <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                            <div className="text-gray-400" style={{ fontSize: '10px' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>

                      {stats.records.length === 0 ? (
                        <div className="text-center py-6 text-sm text-gray-500">
                          No borrowing history yet
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {stats.records
                            .sort((a, b) => new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime())
                            .map((record) => {
                              const book = books.find(b => b.id === record.bookId);
                              if (!book) return null;
                              return (
                                <div key={record.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3">
                                  <img
                                    src={book.coverImage}
                                    alt={book.title}
                                    className="w-10 h-13 object-cover rounded-lg border border-gray-100 shrink-0"
                                    style={{ height: '52px' }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <Link
                                      to={`/admin/book/${book.id}`}
                                      className="text-sm font-medium text-gray-900 truncate block hover:text-blue-600 transition-colors"
                                    >
                                      {book.title}
                                    </Link>
                                    <div className="text-gray-500 text-xs mt-0.5">{book.author}</div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-gray-400" style={{ fontSize: '10px' }}>
                                      <span>Borrowed: {record.borrowDate}</span>
                                      <span>Due: {record.dueDate}</span>
                                      {record.returnDate && <span>Returned: {record.returnDate}</span>}
                                    </div>
                                  </div>
                                  <div className="shrink-0">
                                    <StatusBadge status={record.status} />
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
