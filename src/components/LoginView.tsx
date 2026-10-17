import React, { useState } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { UserRole } from './Navbar';
import {
  Lock,
  User,
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  KeyRound,
  Info
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: UserRole, username: string) => void;
  onPreviewWithoutLogin?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onPreviewWithoutLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Guru');
  const [identifier, setIdentifier] = useState('wahyu.wibowo@smkn1sidayu.sch.id');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Quick switch role
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'Guru') {
      setIdentifier('wahyu.wibowo@smkn1sidayu.sch.id');
    } else if (role === 'Siswa') {
      setIdentifier('0074128931'); // NISN
    } else {
      setIdentifier('admin@smkn1sidayu.sch.id');
    }
    setPassword('password123');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(selectedRole, identifier);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#0B1333] flex flex-col justify-between font-sans text-slate-100 relative overflow-hidden select-none">
      
      {/* Background Decorative Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1B2A72]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#F3A61C]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Ringkas */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-[#0F1A4A]/60">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/10 rounded-xl border border-white/20 shadow-xs">
            <SchoolLogo size="navbar" className="max-h-[36px]" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight">
              SMKN 1 SIDAYU GRESIK
            </h1>
            <p className="text-[11px] text-[#4DA8DA] font-medium">
              Sistem Pembelajaran Daring & Ujian CBT AKM Resmi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="hidden sm:inline bg-[#1B2A72] text-[#F3A61C] border border-[#F3A61C]/30 px-3 py-1 rounded-full font-bold">
            T.P. 2026/2027 • Ganjil
          </span>
          {onPreviewWithoutLogin && (
            <button
              onClick={onPreviewWithoutLogin}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              Langsung Lihat Demo →
            </button>
          )}
        </div>
      </header>

      {/* Konten Utama: 2 Kolom (Showcase Sekolah & Formulir Login) */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-white/5 backdrop-blur-xl">
          
          {/* KOLOM KIRI: SHOWCASE IDENTITAS & KEUNGGULAN SMKN 1 SIDAYU (LG: 7 KOLOM) */}
          <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-[#1B2A72] via-[#121E53] to-[#0A1236] border-b lg:border-b-0 lg:border-r border-white/10 text-white">
            <div>
              {/* Badge Identitas */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3A61C]/20 border border-[#F3A61C]/40 text-[#F3A61C] text-xs font-black uppercase tracking-wider mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Portal LMS & CBT Terpadu</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-4">
                Selamat Datang di <br />
                <span className="text-[#F3A61C]">LMS SMKN 1 SIDAYU</span>
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8 max-w-lg">
                Pusat pembelajaran digital, kolaborasi kelas kejuruan, dan pelaksanaan Asesmen Kompetensi Kejuruan (AKM) berbasis CBT berstandar nasional untuk seluruh civitas akademika SMK Negeri 1 Sidayu.
              </p>

              {/* 3 Kartu Fitur Unggulan */}
              <div className="space-y-3.5">
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="p-2.5 rounded-xl bg-[#F3A61C] text-[#0F1A4A] flex-shrink-0 shadow-md">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">Kolaborasi Kelas Interaktif Gaya Teams</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">
                      Saluran diskusi tiap mata pelajaran, berbagi materi berkas PDF/modul, obrolan ber-emoticon, dan ruang kerja guru terpadu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="p-2.5 rounded-xl bg-[#4DA8DA] text-[#0F1A4A] flex-shrink-0 shadow-md">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">Bank Soal & Ujian CBT Standar AKM / ANBK</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">
                      Mendukung 5 format butir soal: Pilihan Ganda berlingkar, PG Kompleks, Menjodohkan, Drag & Drop, dan Matriks Benar/Salah.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-[#0F1A4A] flex-shrink-0 shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white">Autentikasi Terenkripsi & Buku Nilai Realtime</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">
                      Akses terproteksi berbasis NIP guru dan NISN siswa dengan kalkulasi nilai dan rekapitulasi otomatis ke format Excel/PDF.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Slogan Sekolah */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="italic text-[#F3A61C] font-semibold">
                "Belajar, Berkarya, dan Berprestasi"
              </span>
              <span>NPSN: 20500472</span>
            </div>
          </div>

          {/* KOLOM KANAN: FORMULIR LOGIN AKUN (LG: 5 KOLOM) */}
          <div className="lg:col-span-5 p-8 sm:p-10 bg-white text-slate-900 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <span className="text-[11px] font-black uppercase text-[#1B2A72] tracking-wider block mb-1">
                  Autentikasi Pengguna
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Masuk ke Akun LMS
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Pilih peran akun Anda dan masukkan kredensial resmi sekolah:
                </p>
              </div>

              {/* Pemilih Peran / Tab Role */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center mb-5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleSelectRole('Guru')}
                  className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'Guru'
                      ? 'bg-[#1B2A72] text-[#F3A61C] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Guru / Tendik</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('Siswa')}
                  className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'Siswa'
                      ? 'bg-[#1B2A72] text-[#F3A61C] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Siswa</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectRole('Admin')}
                  className={`flex-1 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                    selectedRole === 'Admin'
                      ? 'bg-[#1B2A72] text-[#F3A61C] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1.5">
                    {selectedRole === 'Guru'
                      ? 'NIP atau Email Resmi Sekolah'
                      : selectedRole === 'Siswa'
                      ? 'NISN (Nomor Induk Siswa Nasional)'
                      : 'ID Pengguna Administrator'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        selectedRole === 'Guru'
                          ? 'contoh: wahyu.wibowo@smkn1sidayu.sch.id'
                          : selectedRole === 'Siswa'
                          ? 'contoh: 0074128931'
                          : 'admin'
                      }
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2A72] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black text-slate-800">Kata Sandi</label>
                    <button
                      type="button"
                      onClick={() => alert('Untuk reset kata sandi, silakan hubungi Administrator IT SMKN 1 Sidayu atau Wali Kelas Anda.')}
                      className="text-[11px] font-bold text-[#1B2A72] hover:underline"
                    >
                      Lupa Kata Sandi?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2A72] focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#1B2A72] rounded cursor-pointer"
                    />
                    <span>Ingat Akun Saya</span>
                  </label>
                </div>

                {/* Tombol Submit Masuk */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#1B2A72] hover:bg-[#121E53] text-white font-black text-xs rounded-xl shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <span>Memverifikasi Kredensial...</span>
                  ) : (
                    <>
                      <span>Masuk ke LMS SMKN 1 Sidayu</span>
                      <ArrowRight className="w-4 h-4 text-[#F3A61C]" />
                    </>
                  )}
                </button>
              </form>

              {/* DEMO CEPAT (1-KLIK LOGIN) */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-2 text-center">
                  Atau Uji Coba Cepat (1-Klik Masuk Demo):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onLogin('Guru', 'wahyu.wibowo@smkn1sidayu.sch.id');
                    }}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1B2A72] border border-blue-200 text-left transition-colors"
                  >
                    <span className="text-[11px] font-black block">👤 Masuk Guru</span>
                    <span className="text-[9px] text-slate-500 block truncate">Wahyu Wibowo, S.Pd.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onLogin('Siswa', '0074128931');
                    }}
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-left transition-colors"
                  >
                    <span className="text-[11px] font-black block">🎓 Masuk Siswa</span>
                    <span className="text-[9px] text-slate-500 block truncate">Ahmad Fauzi (X TKJ 1)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Form */}
            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enkripsi Aman Django & Hash SHA-256 SMKN 1 Sidayu</span>
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Bawah */}
      <footer className="relative z-10 w-full py-4 text-center text-xs text-slate-400 border-t border-white/10 backdrop-blur-md bg-[#0F1A4A]/40">
        <p>
          &copy; {new Date().getFullYear()} LMS SMKN 1 SIDAYU GRESIK. Hak Cipta Dilindungi.
        </p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Jl. Raya Golokan Sidayu, Kabupaten Gresik, Jawa Timur
        </p>
      </footer>

    </div>
  );
};
