import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  Users,
  BookMarked,
  LogOut,
  Menu,
  GraduationCap,
  Bell,
  ChevronRight,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { label: 'Browse Books', href: '/student/catalog', icon: BookOpen },
  { label: 'My Borrowed Books', href: '/student/borrowed', icon: Bookmark },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Manage Books', href: '/admin/books', icon: BookMarked },
  { label: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Book Catalog', href: '/admin/catalog', icon: BookOpen },
];

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  const navItems = user.role === 'student' ? studentNavItems : adminNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (href: string) => {
    if (href === '/student' || href === '/admin') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-blue-800">
        <div className="bg-blue-500 rounded-lg p-2 shrink-0">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm tracking-wide">EduLib</div>
          <div className="text-blue-300" style={{ fontSize: '10px' }}>Westfield Academy</div>
        </div>
        <button
          className="ml-auto lg:hidden text-blue-300 hover:text-white"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={18} />
        </button>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3">
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            user.role === 'admin'
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-blue-500/20 text-blue-200'
          }`}
        >
          {user.role === 'admin' ? '🔑 Librarian' : '🎓 Student'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                active
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-200 hover:bg-blue-800/60 hover:text-white'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              <span className="text-sm">{item.label}</span>
              {active && <ChevronRight size={14} className="ml-auto opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-3 border-t border-blue-800 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{user.name}</div>
            <div className="text-blue-400 truncate" style={{ fontSize: '11px' }}>{user.email}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-lg transition-colors text-sm"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-60 bg-blue-900 z-30 flex flex-col transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-3 shrink-0">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:block">
            <span className="text-sm font-medium text-gray-500">
              {user.role === 'admin' ? 'Librarian Portal' : 'Student Portal'}
            </span>
          </div>

          <div className="flex-1" />

          <button className="relative text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell size={18} />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.initials}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900 leading-tight">{user.name}</div>
              <div className="text-gray-400" style={{ fontSize: '11px' }}>{user.role === 'admin' ? 'Librarian' : 'Student'}</div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}