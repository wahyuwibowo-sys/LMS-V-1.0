import React, { useState } from 'react';
import { Navbar, UserRole } from './components/Navbar';
import { MainViews } from './components/MainViews';
import { TeamsLayout } from './components/TeamsLayout';
import { LoginView } from './components/LoginView';
import { SchoolLogo } from './components/SchoolLogo';
import { LayoutGrid, Layers, Check, LogIn, LogOut } from 'lucide-react';

export default function App() {
  // Status Login & Mode Tampilan
  // Menjawab pertanyaan: "untuk login awal tampilannya gmna"
  // Default dapat diarahkan ke halaman Login atau langsung masuk
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [layoutMode, setLayoutMode] = useState<'teams' | 'portal'>('teams');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeRole, setActiveRole] = useState<UserRole>('Guru');
  const [loggedUser, setLoggedUser] = useState<string>('Wahyu Wibowo, S.Pd.');

  const handleLogin = (role: UserRole, identifier: string) => {
    setActiveRole(role);
    if (role === 'Guru') {
      setLoggedUser('Wahyu Wibowo, S.Pd.');
    } else if (role === 'Siswa') {
      setLoggedUser('Ahmad Fauzi (NISN: 0074128931)');
    } else {
      setLoggedUser('Administrator Sistem');
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FA] text-slate-900 flex flex-col font-sans antialiased">
      
      {/* ============================================================== */}
      {/* FLOATING THEME & LOGIN PREVIEW SWITCHER BAR */}
      {/* Pengguna dapat bebas beralih antara Halaman Login, Mode Teams, dan Portal */}
      {/* ============================================================== */}
      <div className="fixed bottom-4 right-4 z-50 bg-[#0F1A4A]/95 text-white px-3 py-2 rounded-2xl shadow-2xl border border-[#2B3F9F] flex items-center gap-1.5 backdrop-blur-md">
        <span className="text-[11px] font-bold text-slate-300 hidden md:inline mr-1">
          Pratinjau Tampilan:
        </span>

        {/* Tombol Halaman Login Awal */}
        <button
          onClick={() => setIsLoggedIn(false)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
            !isLoggedIn
              ? 'bg-[#F3A61C] text-[#0F1A4A] shadow-md scale-105'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Lihat Tampilan Halaman Login Awal LMS SMKN 1 Sidayu"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Halaman Login</span>
          {!isLoggedIn && <Check className="w-3 h-3 text-[#0F1A4A] stroke-[3]" />}
        </button>

        {/* Tombol Mode Teams */}
        <button
          onClick={() => {
            setIsLoggedIn(true);
            setLayoutMode('teams');
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            isLoggedIn && layoutMode === 'teams'
              ? 'bg-[#1B2A72] text-[#F3A61C] border border-[#F3A61C]/50 shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Tampilan ruang kerja seperti Microsoft Teams Education"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Mode Teams</span>
          {isLoggedIn && layoutMode === 'teams' && <Check className="w-3 h-3 text-[#F3A61C]" />}
        </button>

        {/* Tombol Mode Portal Klasik */}
        <button
          onClick={() => {
            setIsLoggedIn(true);
            setLayoutMode('portal');
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            isLoggedIn && layoutMode === 'portal'
              ? 'bg-[#1B2A72] text-[#F3A61C] border border-[#F3A61C]/50 shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
          title="Tampilan Portal Web Klasik (Navbar atas)"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Mode Portal Klasik</span>
          {isLoggedIn && layoutMode === 'portal' && <Check className="w-3 h-3 text-[#F3A61C]" />}
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. JIKA BELUM LOGIN: TAMPILKAN HALAMAN LOGIN RESMI SMKN 1 SIDAYU */}
      {/* ============================================================== */}
      {!isLoggedIn ? (
        <LoginView
          onLogin={handleLogin}
          onPreviewWithoutLogin={() => setIsLoggedIn(true)}
        />
      ) : (
        /* ============================================================== */
        /* 2. JIKA SUDAH LOGIN: TAMPILKAN LMS (TEAMS ATAU PORTAL KLASIK) */
        /* ============================================================== */
        <>
          {layoutMode === 'teams' ? (
            <TeamsLayout
              activeRole={activeRole}
              onChangeRole={setActiveRole}
              onBackToClassic={() => setLayoutMode('portal')}
              onLogout={handleLogout}
            />
          ) : (
            <>
              {/* Header Komponen Navigasi Klasik */}
              <Navbar
                currentTab={currentTab}
                onSelectTab={setCurrentTab}
                activeRole={activeRole}
                onChangeRole={setActiveRole}
                onLogout={handleLogout}
              />

              {/* Area Konten Utama */}
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <MainViews
                  currentTab={currentTab}
                  activeRole={activeRole}
                  onSelectTab={setCurrentTab}
                />
              </main>

              {/* Footer Resmi Sekolah */}
              <footer className="bg-[#0F1A4A] text-slate-300 border-t border-[#1E2E72] mt-auto py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <SchoolLogo size="sm" className="h-7 w-auto" />
                    <div>
                      <p className="font-bold text-white tracking-wide">
                        SMKN 1 SIDAYU GRESIK
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Jl. Raya Golokan Sidayu, Kabupaten Gresik, Jawa Timur
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-slate-400 text-center sm:text-right">
                    <span className="italic text-[#F3A61C]">
                      "Belajar, Berkarya, dan Berprestasi"
                    </span>
                    <span className="hidden sm:inline text-slate-600">|</span>
                    <span>&copy; {new Date().getFullYear()} LMS SMKN 1 Sidayu. Hak Cipta Dilindungi.</span>
                  </div>
                </div>
              </footer>
            </>
          )}
        </>
      )}

    </div>
  );
}
