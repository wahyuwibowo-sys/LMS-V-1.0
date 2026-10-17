import React, { useState, useRef, useEffect } from 'react';
import { SchoolLogo } from './SchoolLogo';
import {
  LayoutDashboard,
  BookOpen,
  User,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  KeyRound,
  Settings,
  Calendar,
  CheckCircle2,
  FileText,
  HelpCircle,
  Shield,
  GraduationCap
} from 'lucide-react';

export type UserRole = 'Superadmin' | 'Admin' | 'Guru' | 'Siswa' | 'Wali Kelas' | 'Kepala Sekolah';

export interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeRole,
  onChangeRole,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'assignments', label: 'Tugas & Kuis', icon: FileText },
    { id: 'grades', label: 'Nilai', icon: CheckCircle2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const notifications = [
    {
      id: 1,
      title: 'Tugas Baru: Pemrograman Web X TKJ',
      time: '15 menit yang lalu',
      type: 'assignment',
      unread: true,
    },
    {
      id: 2,
      title: 'Pengumuman PTS Semester Ganjil 2026/2027',
      time: '2 jam yang lalu',
      type: 'announcement',
      unread: true,
    },
    {
      id: 3,
      title: 'Presensi Pertemuan 6 telah dibuka',
      time: '1 hari yang lalu',
      type: 'attendance',
      unread: true,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1B2A72] text-white shadow-md border-b border-[#253994]">
      {/* Top micro-bar for School Info & Academic Year */}
      <div className="bg-[#0F1A4A] px-4 py-1 text-xs text-slate-300 flex justify-between items-center border-b border-[#1E2E72]/50">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="inline-flex items-center gap-1 font-semibold text-[#F3A61C]">
            <GraduationCap className="w-3.5 h-3.5" />
            SMKN 1 SIDAYU GRESIK
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="hidden sm:inline italic text-slate-300">
            "Belajar, Berkarya, dan Berprestasi"
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-[#1B2A72] px-2 py-0.5 rounded text-white border border-[#2B3F9F]">
            <Calendar className="w-3 h-3 text-[#4DA8DA]" />
            <span className="font-medium">T.P. 2026/2027</span>
            <span className="bg-[#4DA8DA] text-[#0F1A4A] text-[10px] font-bold px-1 rounded">
              Ganjil
            </span>
          </div>

          {/* Quick Role Preview Switcher */}
          <div className="hidden md:flex items-center gap-1 text-[11px]">
            <span className="text-slate-400">Mode:</span>
            <select
              value={activeRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="bg-[#142057] text-[#F3A61C] border border-[#2A3B8A] rounded px-1.5 py-0.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#F3A61C]"
            >
              <option value="Superadmin">Superadmin</option>
              <option value="Admin">Admin</option>
              <option value="Guru">Guru</option>
              <option value="Siswa">Siswa</option>
              <option value="Wali Kelas">Wali Kelas</option>
              <option value="Kepala Sekolah">Kepala Sekolah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand: Logo + Title */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onSelectTab('dashboard')}>
            <div className="flex-shrink-0 flex items-center justify-center p-1 bg-white/10 rounded-lg backdrop-blur-xs border border-white/15">
              {/* Logo height constrained to max 42px as specified in guidelines */}
              <SchoolLogo size="navbar" className="max-h-[38px] drop-shadow-sm" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white leading-tight">
                  LMS SMKN 1 SIDAYU
                </span>
              </div>
              <span className="text-[11px] text-[#4DA8DA] font-medium tracking-wide">
                Portal Pembelajaran Digital Resmi
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#0F1A4A] text-[#F3A61C] border border-[#F3A61C]/30 shadow-inner'
                      : 'text-slate-100 hover:bg-[#253994] hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F3A61C]' : 'text-[#4DA8DA]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Notifications & User Profile Dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-full text-slate-200 hover:text-white hover:bg-[#253994] focus:outline-none focus:ring-2 focus:ring-[#F3A61C] transition-colors"
                title="Pemberitahuan"
                aria-label="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#E53935] text-[10px] font-bold text-white shadow-sm ring-1 ring-[#1B2A72]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-white text-slate-800 shadow-2xl ring-1 ring-black/10 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#1B2A72]">Notifikasi Terbaru</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => setUnreadCount(0)}
                        className="text-xs text-[#1B2A72] hover:text-[#4DA8DA] font-medium"
                      >
                        Tandai semua dibaca
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                          notif.unread && unreadCount > 0 ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-[#1B2A72] flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-900 leading-snug">
                            {notif.title}
                          </p>
                          <span className="text-[11px] text-slate-500 mt-1 block">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        setNotificationsOpen(false);
                        onSelectTab('dashboard');
                      }}
                      className="text-xs font-semibold text-[#1B2A72] hover:underline"
                    >
                      Lihat Semua Pemberitahuan →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#253994] focus:outline-none focus:ring-2 focus:ring-[#F3A61C] transition-all"
                aria-expanded={userDropdownOpen}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#0F1A4A] border-2 border-[#F3A61C] flex items-center justify-center font-bold text-xs text-white shadow-xs">
                    {activeRole === 'Guru' ? 'WW' : activeRole === 'Siswa' ? 'AH' : 'AD'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#1B2A72]" />
                </div>

                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
                    {activeRole === 'Guru' ? 'Wahyu Wibowo, S.Pd.' : activeRole === 'Siswa' ? 'Ahmad Fauzi' : 'Administrator'}
                  </span>
                  <span className="text-[10px] text-[#F3A61C] font-semibold uppercase tracking-wider">
                    {activeRole}
                  </span>
                </div>

                <ChevronDown className="w-4 h-4 text-slate-300 hidden sm:block" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white text-slate-800 shadow-2xl ring-1 ring-black/10 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
                    <p className="text-xs font-bold text-slate-900">
                      {activeRole === 'Guru' ? 'Wahyu Wibowo, S.Pd.' : activeRole === 'Siswa' ? 'Ahmad Fauzi' : 'Super Administrator'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {activeRole === 'Guru' ? 'NIP. 19850614 201001 1 012' : activeRole === 'Siswa' ? 'NISN: 0074128931' : 'admin@smkn1sidayu.sch.id'}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#1B2A72] text-white">
                      {activeRole}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onSelectTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 font-medium text-left"
                    >
                      <User className="w-4 h-4 text-[#1B2A72]" />
                      Profil Pengguna
                    </button>

                    <button
                      onClick={() => {
                        alert('Menu Ganti Kata Sandi dibuka');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 font-medium text-left"
                    >
                      <KeyRound className="w-4 h-4 text-amber-600" />
                      Ganti Kata Sandi
                    </button>

                    {(activeRole === 'Superadmin' || activeRole === 'Admin') && (
                      <button
                        onClick={() => {
                          alert('Buka Pengaturan Sekolah (Identitas, Logo, T.P. Aktif)');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 font-medium text-left"
                      >
                        <Settings className="w-4 h-4 text-emerald-600" />
                        Pengaturan Sekolah
                      </button>
                    )}

                    <button
                      onClick={() => {
                        alert('Membuka Panduan Penggunaan LMS SMKN 1 Sidayu');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 font-medium text-left"
                    >
                      <HelpCircle className="w-4 h-4 text-sky-600" />
                      Bantuan & Panduan
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        if (onLogout) onLogout();
                        else alert('Anda telah keluar (Logout)');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-semibold text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-200 hover:text-white hover:bg-[#253994] focus:outline-none focus:ring-2 focus:ring-[#F3A61C]"
                aria-label="Buka menu navigasi"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1A4A] border-t border-[#253994] px-4 pt-3 pb-4 space-y-1 shadow-xl animate-in slide-in-from-top-1">
          {/* Mobile Role Switcher */}
          <div className="p-2 mb-2 bg-[#1B2A72] rounded-md flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#F3A61C]" /> Role Aktif:
            </span>
            <select
              value={activeRole}
              onChange={(e) => onChangeRole(e.target.value as UserRole)}
              className="bg-[#0F1A4A] text-[#F3A61C] border border-[#2B3F9F] rounded px-2 py-1 text-xs font-bold"
            >
              <option value="Superadmin">Superadmin</option>
              <option value="Admin">Admin</option>
              <option value="Guru">Guru</option>
              <option value="Siswa">Siswa</option>
              <option value="Wali Kelas">Wali Kelas</option>
              <option value="Kepala Sekolah">Kepala Sekolah</option>
            </select>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1B2A72] text-[#F3A61C] border-l-4 border-[#F3A61C]'
                    : 'text-slate-200 hover:bg-[#1B2A72]/60 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#F3A61C]' : 'text-[#4DA8DA]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 mt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>SMKN 1 SIDAYU</span>
            <span>Versi 1.0 (2026)</span>
          </div>
        </div>
      )}
    </header>
  );
};
