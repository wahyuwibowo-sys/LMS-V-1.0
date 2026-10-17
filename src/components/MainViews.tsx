import React, { useState } from 'react';
import { UserRole } from './Navbar';
import { SchoolLogo } from './SchoolLogo';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Sparkles,
  Users,
  Search,
  Filter,
  ArrowRight,
  Award,
  Plus
} from 'lucide-react';
import { AKMQuizPlayerModal } from './AKMQuizPlayerModal';
import { CreateAssignmentQuizModal, AKMQuestion } from './CreateAssignmentQuizModal';
import { CreateClassModal, ClassItem } from './CreateClassModal';

const akmSampleQuestions: AKMQuestion[] = [
  {
    id: 1,
    type: 'pilihan_ganda',
    text: 'Perhatikan diagram topologi jaringan komputer di atas. Komponen berlabel [A] yang bertugas menghubungkan dua subnet jaringan yang berbeda dan meneruskan paket data IP adalah...',
    questionImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
    points: 20,
    explanation: 'Router bekerja pada OSI Layer 3 (Network Layer) untuk merutekan paket data antar subnet/jaringan yang berbeda.',
    options: [
      { id: 'A', text: 'Router Gateway L3' },
      { id: 'B', text: 'Hub Pasif 8-Port' },
      { id: 'C', text: 'Kabel UTP Cat 6' },
      { id: 'D', text: 'Access Point Standalone' },
      { id: 'E', text: 'Konektor Modular RJ45' },
    ],
    correctOptionId: 'A',
  },
  {
    id: 2,
    type: 'pilihan_ganda_kompleks',
    text: 'Berdasarkan wacana tentang arsitektur frontend web modern, tentukan SEMUA pernyataan yang BENAR mengenai fungsi CSS3 dan HTML5! (Centang semua jawaban yang tepat):',
    points: 20,
    explanation: 'HTML5 bertanggung jawab atas semantik konten (struktur), sedangkan CSS3 mengatur tata letak visual, warna, dan responsivitas layar.',
    options: [
      { id: 'A', text: 'HTML5 mendefinisikan struktur dan arti semantik konten web.' },
      { id: 'B', text: 'CSS3 mengatur tata letak visual, warna, animasi, dan ukuran layar responsif.' },
      { id: 'C', text: 'HTML5 bertugas langsung mengeksekusi query database PostgreSQL di server.' },
      { id: 'D', text: 'CSS3 Media Queries memungkinkan web menyesuaikan tampilan di layar smartphone.' },
    ],
    correctOptionIds: ['A', 'B', 'D'],
  },
  {
    id: 3,
    type: 'menjodohkan',
    text: 'Jodohkanlah protokol jaringan standar di Kolom Kiri dengan nomor Port bawaan yang sesuai di Kolom Kanan:',
    points: 20,
    explanation: 'HTTP berjalan pada port 80, HTTPS port 443, SSH port 22, dan DNS port 53.',
    matchingPairs: [
      { left: 'HTTP (Hypertext Transfer Protocol)', right: 'Port 80' },
      { left: 'HTTPS (HTTP Secure / SSL/TLS)', right: 'Port 443' },
      { left: 'SSH (Secure Shell Remote Login)', right: 'Port 22' },
      { left: 'DNS (Domain Name System Resolver)', right: 'Port 53' },
    ],
  },
  {
    id: 4,
    type: 'drag_drop',
    text: 'Tarik atau tempatkan label komponen arsitektur web berikut ke kotak fungsi sasaran yang tepat:',
    points: 20,
    explanation: 'Client mengirim request, Web Server melayani logic HTTP, Database menyimpan record permanen.',
    dragTargets: [
      { id: 't1', label: '1. Mengirim permintaan HTTP dari peramban siswa' },
      { id: 't2', label: '2. Memproses logika aplikasi dan routing backend' },
      { id: 't3', label: '3. Menyimpan data akun, nilai, dan modul secara permanen' },
    ],
    dragItems: [
      { id: 'item1', text: 'Web Browser (Client)', targetId: 't1' },
      { id: 'item2', text: 'Django Web Server', targetId: 't2' },
      { id: 'item3', text: 'Database SQLite / PostgreSQL', targetId: 't3' },
    ],
  },
  {
    id: 5,
    type: 'benar_salah',
    text: 'Bacalah pernyataan berikut ini dengan cermat, lalu tentukan apakah pernyataan tersebut BENAR atau SALAH terkait keamanan sistem aplikasi:',
    points: 20,
    explanation: 'DEBUG=False harus diterapkan di produksi, kata sandi wajib di-hash, dan CSRF melindungi form web.',
    statements: [
      { id: 's1', statement: 'Nilai dan kunci jawaban kuis aman jika dihitung menggunakan kode JavaScript di browser siswa.', isTrue: false },
      { id: 's2', statement: 'Kata sandi pengguna di Django wajib disimpan dalam bentuk hash kriptografi yang aman.', isTrue: true },
      { id: 's3', statement: 'Mode DEBUG=True hanya boleh diaktifkan saat tahap pengujian lokal laptop.', isTrue: true },
      { id: 's4', statement: 'Token CSRF melindungi aplikasi dari serangan pemalsuan permintaan antar-situs.', isTrue: true },
    ],
  },
];

interface MainViewsProps {
  currentTab: string;
  activeRole: UserRole;
  onSelectTab: (tab: string) => void;
}

export const MainViews: React.FC<MainViewsProps> = ({ currentTab, activeRole, onSelectTab }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'assignment' | 'quiz'>('quiz');
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);

  const [courseList, setCourseList] = useState([
    {
      title: 'Pemrograman Web & Mobile',
      teacher: 'Wahyu Wibowo, S.Pd.',
      class: 'X TKJ 1',
      modules: 12,
      students: 36,
      desc: 'Konsep dasar HTML5, CSS3, JavaScript, dan pengenalan framework web modern.',
      color: 'bg-[#1B2A72]',
    },
    {
      title: 'Administrasi Infrastruktur Jaringan',
      teacher: 'Budi Santoso, M.T.',
      class: 'XI TKJ 2',
      modules: 16,
      students: 34,
      desc: 'Konfigurasi routing statik & dinamik, VLAN, firewall Mikrotik, dan manajemen bandwidth.',
      color: 'bg-[#4DA8DA]',
    },
    {
      title: 'Pemeliharaan Mesin Kendaraan Ringan',
      teacher: 'Hadi Prayitno, S.T.',
      class: 'X TKR 1',
      modules: 10,
      students: 35,
      desc: 'Perawatan berkala sistem bahan bakar, mekanisme katup, dan tune-up mesin 4 tak.',
      color: 'bg-[#F3A61C]',
    },
    {
      title: 'Desain Komunikasi Visual & Multimedia',
      teacher: 'Dewi Lestari, S.Sn.',
      class: 'X DKV 2',
      modules: 14,
      students: 36,
      desc: 'Prinsip tata letak, tipografi, pembuatan logo vektor, dan komposisi visual grafis.',
      color: 'bg-[#1E8449]',
    },
    {
      title: 'Sistem Keamanan Jaringan',
      teacher: 'Wahyu Wibowo, S.Pd.',
      class: 'XII TKJ 1',
      modules: 15,
      students: 32,
      desc: 'Implementasi IDS/IPS, enkripsi data, sertifikat SSL/TLS, dan audit celah keamanan.',
      color: 'bg-[#1B2A72]',
    },
    {
      title: 'Pendidikan Pancasila & Kewarganegaraan',
      teacher: 'Dra. Sri Wahyuni',
      class: 'X Semua Jurusan',
      modules: 8,
      students: 140,
      desc: 'Penguatan karakter profil pelajar Pancasila dan wawasan kebangsaan di lingkungan kerja.',
      color: 'bg-[#6C3483]',
    },
  ]);

  const handleAddCourseFromClass = (newClass: ClassItem) => {
    setCourseList((prev) => [
      {
        title: newClass.subject || newClass.name,
        teacher: newClass.teacher,
        class: newClass.name,
        modules: 1,
        students: newClass.members,
        desc: `Ruang pembelajaran ${newClass.name} SMKN 1 Sidayu dengan kode kelas ${newClass.code || '-'}.`,
        color: newClass.color,
      },
      ...prev,
    ]);
  };

  // 1. TAMPILAN DASHBOARD
  if (currentTab === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Hero Welcome Banner with School Branding */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1B2A72] via-[#16225B] to-[#0F1A4A] text-white p-6 sm:p-8 shadow-lg border border-[#2B3F9F]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-md">
                <SchoolLogo size="md" className="h-16 w-auto max-h-[64px]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#F3A61C] text-[#0F1A4A] text-[11px] font-extrabold uppercase px-2 py-0.5 rounded shadow-xs">
                    Tahun Pelajaran 2026/2027 Ganjil
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold px-2 py-0.5 rounded">
                    Aktif
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Selamat Datang di LMS SMKN 1 SIDAYU
                </h1>
                <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                  {activeRole === 'Guru'
                    ? 'Kelola materi pembelajaran, penugasan siswa, kuis interaktif, dan rekap nilai secara terstruktur dan efisien.'
                    : activeRole === 'Siswa'
                    ? 'Tingkatkan kompetensi kejuruan Anda. Akses materi, kumpulkan tugas tepat waktu, dan pantau hasil evaluasi belajar.'
                    : 'Pusat kendali operasional pembelajaran daring SMKN 1 Sidayu Gresik.'}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-[#4DA8DA]">
                  <span className="font-semibold italic">"Belajar, Berkarya, dan Berprestasi"</span>
                  <span>•</span>
                  <span>NPSN: 20500472</span>
                  <span>•</span>
                  <span>Kec. Sidayu, Kab. Gresik</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
              <button
                onClick={() => onSelectTab('courses')}
                className="flex items-center justify-center gap-2 bg-[#F3A61C] hover:bg-[#E09311] text-[#0F1A4A] font-bold text-xs px-4 py-2.5 rounded-lg shadow-md transition-transform active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                Lihat Kursus
              </button>
              <button
                onClick={() => onSelectTab('assignments')}
                className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-lg border border-white/20 transition-colors"
              >
                <FileText className="w-4 h-4 text-[#4DA8DA]" />
                Tugas Aktif
              </button>
            </div>
          </div>
        </div>

        {/* Quick Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {activeRole === 'Guru' ? 'Kelas Diajar' : 'Kursus Saya'}
              </span>
              <div className="p-2 bg-blue-50 text-[#1B2A72] rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-800 mt-2">6</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Semester Ganjil Aktif
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {activeRole === 'Guru' ? 'Tugas Belum Dinilai' : 'Tugas Menunggu'}
              </span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-800 mt-2">3</p>
            <p className="text-[11px] text-amber-600 font-medium mt-1">
              Batas terdekat: Besok, 23:59
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Presensi Kehadiran
              </span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-800 mt-2">96%</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              18 dari 19 pertemuan
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {activeRole === 'Guru' ? 'Total Siswa' : 'Rata-rata Nilai'}
              </span>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                {activeRole === 'Guru' ? <Users className="w-4 h-4" /> : <Award className="w-4 h-4" />}
              </div>
            </div>
            <p className="text-2xl font-black text-slate-800 mt-2">
              {activeRole === 'Guru' ? '184' : '88.4'}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Predikat: Sangat Baik (A)
            </p>
          </div>
        </div>

        {/* Recent Courses & Announcements Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses List Preview */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Mata Pelajaran & Kursus Aktif</h2>
                <p className="text-xs text-slate-500">Kelas X & XI Program Keahlian TKJ, TKR, DKV</p>
              </div>
              <button
                onClick={() => onSelectTab('courses')}
                className="text-xs font-bold text-[#1B2A72] hover:underline flex items-center gap-1"
              >
                Semua Kursus <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  code: 'TKJ-101',
                  name: 'Pemrograman Web & Mobile',
                  class: 'X TKJ 1',
                  teacher: 'Wahyu Wibowo, S.Pd.',
                  progress: 68,
                  tag: 'Teknik Komputer & Jaringan',
                  color: 'border-l-4 border-l-[#1B2A72]',
                },
                {
                  code: 'TKJ-204',
                  name: 'Administrasi Infrastruktur Jaringan',
                  class: 'XI TKJ 2',
                  teacher: 'Budi Santoso, M.T.',
                  progress: 82,
                  tag: 'Teknik Jaringan',
                  color: 'border-l-4 border-l-[#4DA8DA]',
                },
                {
                  code: 'TKR-102',
                  name: 'Pemeliharaan Mesin Kendaraan',
                  class: 'X TKR 1',
                  teacher: 'Hadi Prayitno, S.T.',
                  progress: 55,
                  tag: 'Teknik Kendaraan Ringan',
                  color: 'border-l-4 border-l-[#F3A61C]',
                },
                {
                  code: 'DKV-105',
                  name: 'Desain Komunikasi Visual Dasar',
                  class: 'X DKV 2',
                  teacher: 'Dewi Lestari, S.Sn.',
                  progress: 90,
                  tag: 'Desain Kreatif',
                  color: 'border-l-4 border-l-[#1E8449]',
                },
              ].map((c) => (
                <div
                  key={c.code}
                  className={`bg-slate-50 hover:bg-slate-100/80 transition-colors p-4 rounded-lg border border-slate-200 flex flex-col justify-between ${c.color}`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-mono font-semibold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {c.code}
                      </span>
                      <span className="font-semibold text-slate-700">{c.class}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                      {c.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      {c.teacher}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Progres Materi</span>
                      <span className="text-[#1B2A72]">{c.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#1B2A72] h-full rounded-full transition-all"
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5">
            <h2 className="text-base font-bold text-slate-900 mb-1">Pengumuman Sekolah</h2>
            <p className="text-xs text-slate-500 mb-4">Informasi resmi SMKN 1 Sidayu</p>

            <div className="space-y-3.5">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200/80">
                <span className="inline-block bg-amber-600 text-white text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded mb-1">
                  Penting
                </span>
                <h4 className="text-xs font-bold text-amber-950">
                  Jadwal Ujian Tengah Semester (PTS) Ganjil
                </h4>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Pelaksanaan dimulai tanggal 20 Oktober 2026. Seluruh siswa diharapkan mengecek kartu peserta.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="inline-block bg-[#1B2A72] text-white text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded mb-1">
                  Info Kurikulum
                </span>
                <h4 className="text-xs font-bold text-slate-900">
                  Update Modul Ajar Kurikulum Merdeka
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Bapak/Ibu Guru dapat mengunggah lembar kerja proyek P5 pada menu materi.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200/80">
                <span className="inline-block bg-emerald-700 text-white text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded mb-1">
                  Prestasi
                </span>
                <h4 className="text-xs font-bold text-emerald-950">
                  Selamat Juara 1 LKS Wilker 1 Jatim
                </h4>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Bidang IT Network System Administration diraih perwakilan SMKN 1 Sidayu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. TAMPILAN COURSES
  if (currentTab === 'courses') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Daftar Kursus & Mata Pelajaran</h1>
            <p className="text-xs text-slate-500 mt-1">
              Menampilkan seluruh mata pelajaran terdaftar pada semester aktif SMKN 1 Sidayu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsAddClassOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-[#1B2A72] hover:bg-[#131F55] text-white rounded-lg shadow-sm transition-transform active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 text-[#F3A61C]" />
              <span>+ Tambah / Gabung Kelas</span>
            </button>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari mata pelajaran..."
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A72] w-44 sm:w-56"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courseList.map((course, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="bg-[#1B2A72]/10 text-[#1B2A72] font-bold px-2 py-0.5 rounded">
                    {course.class}
                  </span>
                  <span>{course.students} Siswa</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-1">{course.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">{course.desc}</p>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <GraduationCap className="w-4 h-4 text-[#1B2A72]" />
                  {course.teacher}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">{course.modules} Pertemuan</span>
                <button
                  onClick={() => alert(`Membuka materi untuk ${course.title}`)}
                  className="px-3 py-1.5 bg-[#1B2A72] hover:bg-[#131F55] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  Buka Kursus <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Tambah Kelas di Tampilan Kursus */}
        <CreateClassModal
          isOpen={isAddClassOpen}
          onClose={() => setIsAddClassOpen(false)}
          activeRole={activeRole}
          onAddClass={handleAddCourseFromClass}
          existingClasses={[]}
        />
      </div>
    );
  }

  // 3. TAMPILAN PROFIL PENGGUNA
  if (currentTab === 'profile') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Header Cover */}
          <div className="h-32 bg-gradient-to-r from-[#1B2A72] to-[#4DA8DA] relative p-6">
            <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30">
              SMKN 1 SIDAYU
            </span>
          </div>

          {/* Profile Details */}
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-full bg-[#0F1A4A] border-4 border-white shadow-md flex items-center justify-center text-white text-2xl font-black">
                  {activeRole === 'Guru' ? 'WW' : activeRole === 'Siswa' ? 'AH' : 'AD'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {activeRole === 'Guru' ? 'Wahyu Wibowo, S.Pd.' : activeRole === 'Siswa' ? 'Ahmad Fauzi' : 'Super Administrator'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {activeRole === 'Guru' ? 'Guru Teknik Komputer & Jaringan' : activeRole === 'Siswa' ? 'Siswa Kelas X TKJ 1' : 'Pengelola Sistem LMS'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-[#1B2A72] text-[#F3A61C] font-bold text-xs px-3 py-1.5 rounded-lg border border-[#F3A61C]/30">
                  Role: {activeRole}
                </span>
                <span className="bg-emerald-100 text-emerald-800 font-semibold text-xs px-3 py-1.5 rounded-lg">
                  Akun Aktif
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
              <div>
                <label className="text-slate-400 font-medium block">Nomor Induk / NIP / NISN</label>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">
                  {activeRole === 'Guru' ? '19850614 201001 1 012' : activeRole === 'Siswa' ? '0074128931 / 20261001' : 'ADM-001'}
                </p>
              </div>

              <div>
                <label className="text-slate-400 font-medium block">Alamat Email Resmi</label>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">
                  {activeRole === 'Guru' ? 'wahyu.wibowo@smkn1sidayu.sch.id' : 'ahmad.fauzi@siswa.smkn1sidayu.sch.id'}
                </p>
              </div>

              <div>
                <label className="text-slate-400 font-medium block">Instansi Sekolah</label>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">
                  SMKN 1 SIDAYU (GRESIK)
                </p>
              </div>

              <div>
                <label className="text-slate-400 font-medium block">Tahun Pelajaran Berjalan</label>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">
                  2026/2027 - Semester Ganjil
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. TAMPILAN TUGAS & KUIS
  return (
    <div className="space-y-6">
      {/* Banner Utama AKM CBT */}
      <div className="bg-gradient-to-r from-[#0F1A4A] via-[#1B2A72] to-[#16235F] text-white p-6 rounded-2xl border border-[#2B3F9F] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-[#F3A61C] text-[#0F1A4A] text-[10px] font-black uppercase px-2.5 py-0.5 rounded shadow-xs">
              Standar AKM ANBK Kemdikbud
            </span>
            <span className="text-xs text-[#4DA8DA] font-semibold">
              Semester Ganjil 2026/2027
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Asesmen Kompetensi Kejuruan (AKM) CBT
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Dilengkapi 5 model butir soal standar AKM nasional: Pilihan Ganda berlingkar, Pilihan Ganda Kompleks (centang), Menjodohkan premis, Drag & Drop interaktif, dan Matriks Benar/Salah beserta stimulus gambar infografis.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => setIsPlayerOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-transform active:scale-95"
          >
            <span>▶️ Mulai Ujian AKM CBT</span>
          </button>

          {(activeRole === 'Guru' || activeRole === 'Admin') && (
            <button
              onClick={() => {
                setModalMode('quiz');
                setIsCreateOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F3A61C] hover:bg-[#E09311] text-[#0F1A4A] font-black text-xs rounded-xl shadow-md transition-transform active:scale-95"
            >
              <span>+ Buat Soal AKM</span>
            </button>
          )}
        </div>
      </div>

      {/* Daftar Tugas & Kuis */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Daftar Tugas Praktik & Evaluasi Kuis Daring
            </h3>
            <p className="text-xs text-slate-500">
              Tersinkronisasi langsung dengan portal pembelajaran SMKN 1 SIDAYU.
            </p>
          </div>
          <button
            onClick={() => onSelectTab('dashboard')}
            className="text-xs font-semibold text-[#1B2A72] hover:underline"
          >
            ← Kembali ke Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 1,
              title: 'Asesmen Kompetensi Kejuruan (AKM) CBT - Standar ANBK',
              course: 'X TKJ 1 - Pemrograman Web',
              due: '20 Okt 2026, 12:00 WIB',
              points: '100 Poin (5 Model AKM)',
              status: 'Terbit',
              statusColor: 'bg-emerald-100 text-emerald-800',
              type: 'quiz',
              actionLabel: activeRole === 'Guru' ? 'Simulasi / Analisis Soal' : 'Mulai Ujian AKM CBT',
            },
            {
              id: 2,
              title: 'Praktik 1: Layout Header Responsif & Logo SMKN 1 Sidayu',
              course: 'X TKJ 1 - Pemrograman Web',
              due: '24 Okt 2026, 23:59 WIB',
              points: '100 Poin',
              status: 'Menunggu Pengumpulan',
              statusColor: 'bg-amber-100 text-amber-800',
              type: 'assignment',
              actionLabel: activeRole === 'Guru' ? 'Periksa Lembar Siswa' : 'Kumpulkan Tugas',
            },
            {
              id: 3,
              title: 'Kuis Teori 2: Protokol Jaringan & Keamanan Web',
              course: 'XI TKJ 2 - Administrasi Jaringan',
              due: '28 Okt 2026, 15:00 WIB',
              points: '100 Poin (AKM CBT)',
              status: 'Terbit',
              statusColor: 'bg-emerald-100 text-emerald-800',
              type: 'quiz',
              actionLabel: 'Mulai Ujian AKM CBT',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      item.type === 'quiz'
                        ? 'bg-purple-100 text-purple-900 border border-purple-200'
                        : 'bg-blue-100 text-[#1B2A72] border border-blue-200'
                    }`}
                  >
                    {item.type === 'quiz' ? 'Kuis CBT Model AKM' : 'Tugas Praktik'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-500 mb-3">{item.course}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Batas: <strong>{item.due}</strong> ({item.points})</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">SMKN 1 SIDAYU</span>
                <button
                  onClick={() => {
                    if (item.type === 'quiz') setIsPlayerOpen(true);
                    else alert(`Membuka tugas: ${item.title}`);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg text-white shadow-2xs transition-transform active:scale-95 ${
                    item.type === 'quiz' ? 'bg-purple-800 hover:bg-purple-900' : 'bg-[#1B2A72] hover:bg-[#131F55]'
                  }`}
                >
                  {item.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Quiz Player */}
      <AKMQuizPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        quizTitle="Asesmen Kompetensi Kejuruan (AKM) CBT - Standar ANBK"
        courseName="X TKJ 1 - Pemrograman Web"
        durationMinutes={45}
        questions={akmSampleQuestions}
      />

      {/* Modal Buat Kuis */}
      <CreateAssignmentQuizModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        defaultMode={modalMode}
        currentCourseName="X TKJ 1 - Pemrograman Web"
        onSaveAssignment={(asg) => alert(`Tugas "${asg.title}" berhasil disimpan!`)}
        onSaveQuiz={(quiz) => alert(`Kuis AKM "${quiz.title}" dengan ${quiz.questions.length} butir soal berhasil disimpan!`)}
        onTestRunQuiz={(customQuestions, title) => {
          setIsPlayerOpen(true);
        }}
      />
    </div>
  );
};
