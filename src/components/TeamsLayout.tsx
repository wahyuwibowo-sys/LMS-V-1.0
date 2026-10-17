import React, { useState, useRef, useEffect } from 'react';
import { SchoolLogo } from './SchoolLogo';
import { UserRole } from './Navbar';
import {
  Bell,
  MessageSquare,
  Users,
  CheckSquare,
  Calendar,
  Award,
  FolderOpen,
  Search,
  Plus,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  ChevronDown,
  Hash,
  FileText,
  FileSpreadsheet,
  Download,
  GraduationCap,
  Pin,
  MessageCircle,
  ThumbsUp,
  SlidersHorizontal,
  LayoutGrid,
  X,
  Sparkles,
  Clock,
  HelpCircle,
  LogOut
} from 'lucide-react';
import {
  CreateAssignmentQuizModal,
  AssignmentData,
  QuizData,
  AKMQuestion
} from './CreateAssignmentQuizModal';
import { AKMQuizPlayerModal } from './AKMQuizPlayerModal';
import { CreateClassModal, ClassItem } from './CreateClassModal';

interface TeamsLayoutProps {
  activeRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onBackToClassic?: () => void;
  onLogout?: () => void;
}

// Koleksi Emote/Emoji Lengkap untuk Pendidikan & Diskusi
const EMOJI_LIST = [
  { char: '👍', label: 'Setuju / Jempol' },
  { char: '❤️', label: 'Suka / Mantap' },
  { char: '👏', label: 'Tepuk Tangan' },
  { char: '🎉', label: 'Selamat / Rayakan' },
  { char: '💡', label: 'Ide Cemerlang' },
  { char: '📚', label: 'Buku / Modul' },
  { char: '💻', label: 'Laptop / Koding' },
  { char: '🎓', label: 'Topi Sarjana' },
  { char: '🔥', label: 'Semangat Tinggi' },
  { char: '✅', label: 'Sudah Selesai' },
  { char: '❓', label: 'Tanya / Belum Paham' },
  { char: '😊', label: 'Senyum Ramah' },
  { char: '🤩', label: 'Kagum' },
  { char: '🤔', label: 'Berpikir' },
  { char: '🙌', label: 'Alhamdulillah / Hore' },
  { char: '🙏', label: 'Terima Kasih' },
  { char: '🚀', label: 'Siap Maju' },
  { char: '📝', label: 'Catat / Tugas' },
];

export const TeamsLayout: React.FC<TeamsLayoutProps> = ({
  activeRole,
  onChangeRole,
  onBackToClassic,
  onLogout,
}) => {
  // Navigation Left Rail
  const [activeRail, setActiveRail] = useState<'activity' | 'teams' | 'assignments' | 'calendar' | 'grades' | 'files'>('teams');
  
  // Selected Class & Channel
  const [selectedClassId, setSelectedClassId] = useState<string>('tkj-101');
  const [selectedChannel, setSelectedChannel] = useState<string>('general');
  const [activeCanvasTab, setActiveCanvasTab] = useState<'posts' | 'files' | 'assignments' | 'grades'>('posts');

  // Emoji Popover State
  const [showEmojiPickerMain, setShowEmojiPickerMain] = useState(false);
  const [activeReplyEmojiPicker, setActiveReplyEmojiPicker] = useState<number | null>(null);

  // Modal Buat Tugas / Kuis State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalDefaultMode, setModalDefaultMode] = useState<'assignment' | 'quiz'>('assignment');
  const [filterType, setFilterType] = useState<'all' | 'assignment' | 'quiz'>('all');

  // Modal Tambah / Gabung Kelas State
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  // CBT Player Simulator State
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [playerQuizTitle, setPlayerQuizTitle] = useState('Asesmen Kompetensi Kejuruan (AKM) Standar ANBK');
  const [playerQuestions, setPlayerQuestions] = useState<AKMQuestion[]>([]);

  // 5 Model Soal AKM Bawaan untuk Simulasi Langsung
  const defaultAKMQuestions: AKMQuestion[] = [
    {
      id: 1,
      type: 'pilihan_ganda',
      text: 'Perhatikan diagram topologi jaringan di atas. Perangkat jaringan berlabel [A] yang berfungsi menghubungkan dua subnet jaringan yang berbeda dan memproses routing IP address adalah...',
      questionImage: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80',
      points: 20,
      explanation: 'Router beroperasi pada Layer 3 untuk memetakan dan meneruskan paket antar subnet jaringan.',
      options: [
        {
          id: 'A',
          text: 'Router Gateway (Layer 3 - Network Routing)',
          image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 'B',
          text: 'Hub Pasif (Layer 1 - Physical Repeater)',
          image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 'C',
          text: 'Kabel UTP Cat6 (Transmisi Tembaga)',
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80',
        },
        {
          id: 'D',
          text: 'Konektor RJ45 Modular 8-Pin',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=300&q=80',
        },
      ],
      correctOptionId: 'A',
    },
    {
      id: 2,
      type: 'pilihan_ganda_kompleks',
      text: 'Berdasarkan wacana tentang arsitektur frontend web modern, tentukan SEMUA pernyataan yang BENAR mengenai peran CSS3 dan HTML5! (Pilihlah lebih dari satu jawaban):',
      points: 20,
      explanation: 'HTML5 menyusun semantik konten, sementara CSS3 menata tata letak responsif dan estetika visual.',
      options: [
        { id: 'A', text: 'HTML5 mendefinisikan struktur dan arti semantik konten halaman web.' },
        { id: 'B', text: 'CSS3 mengatur tata letak visual, warna, animasi, dan responsivitas layar.' },
        { id: 'C', text: 'HTML5 mengeksekusi langsung query database PostgreSQL di server.' },
        { id: 'D', text: 'CSS3 Flexbox dan Grid memungkinkan web menyesuaikan tampilan di ponsel dan laptop.' },
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
      text: 'Tarik atau pilih label komponen arsitektur web berikut ini ke kotak peran sasaran yang tepat:',
      points: 20,
      explanation: 'Web browser bertindak sebagai client, Django sebagai server pemroses, dan SQLite/Postgres sebagai database penyimpan.',
      dragTargets: [
        { id: 't1', label: '1. Mengirim permintaan HTTP dari peramban siswa' },
        { id: 't2', label: '2. Memproses logika routing backend dan autentikasi' },
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
      text: 'Bacalah pernyataan berikut dengan teliti, lalu tentukan apakah setiap pernyataan BENAR atau SALAH terkait keamanan LMS:',
      points: 20,
      explanation: 'Penghitungan nilai kuis tidak boleh di sisi client, kata sandi harus di-hash, dan CSRF melindungi form.',
      statements: [
        { id: 's1', statement: 'Nilai dan kunci jawaban kuis aman jika dihitung menggunakan JavaScript di browser siswa.', isTrue: false },
        { id: 's2', statement: 'Kata sandi pengguna di Django wajib disimpan dalam bentuk hash kriptografi yang aman.', isTrue: true },
        { id: 's3', statement: 'Mode DEBUG=True hanya boleh diaktifkan saat pengembangan lokal di laptop.', isTrue: true },
        { id: 's4', statement: 'Token CSRF melindungi aplikasi web dari serangan pemalsuan permintaan antar-situs.', isTrue: true },
      ],
    },
  ];

  // Interactive Assignment & Quiz List
  const [activityList, setActivityList] = useState<any[]>([
    {
      id: 1,
      title: 'Tugas Praktik 1: Membuat Layout Header Responsif',
      course: 'X TKJ 1 - Pemrograman Web',
      due: '24 Okt 2026, 23:59 WIB',
      points: '100 Poin',
      submitted: '28 / 36 Siswa Mengumpulkan',
      status: 'Terbit',
      statusColor: 'bg-emerald-100 text-emerald-800',
      type: 'assignment',
      instructions: 'Buat komponen header responsif dengan logo resmi SMKN 1 Sidayu.',
    },
    {
      id: 2,
      title: 'Asesmen Kompetensi Kejuruan (AKM) CBT - Standar ANBK',
      course: 'X TKJ 1 - Pemrograman Web',
      due: '20 Okt 2026, 12:00 WIB',
      points: '100 Poin (5 Model Soal AKM)',
      duration: '45 Menit',
      passingGrade: 75,
      submitted: '36 / 36 Siswa Selesai',
      status: 'Terbit',
      statusColor: 'bg-emerald-100 text-emerald-800',
      type: 'quiz',
      questionsCount: 5,
      questions: defaultAKMQuestions,
    },
    {
      id: 3,
      title: 'Tugas Praktik 2: Form Input Siswa & Validasi Tailwind',
      course: 'X TKJ 1 - Pemrograman Web',
      due: '28 Okt 2026, 23:59 WIB',
      points: '100 Poin',
      submitted: '12 / 36 Siswa Mengumpulkan',
      status: 'Terbit',
      statusColor: 'bg-amber-100 text-amber-800',
      type: 'assignment',
      instructions: 'Implementasikan form input data nilai dengan validasi JavaScript.',
    },
  ]);

  const handleOpenQuizPlayer = (quizItem: any) => {
    setPlayerQuizTitle(quizItem.title);
    setPlayerQuestions(quizItem.questions || defaultAKMQuestions);
    setIsPlayerModalOpen(true);
  };

  const handleSaveAssignment = (newAsg: AssignmentData) => {
    const item = {
      id: newAsg.id,
      title: newAsg.title,
      course: newAsg.course,
      due: newAsg.dueDate,
      points: `${newAsg.maxScore} Poin`,
      submitted: '0 / 36 Siswa Mengumpulkan',
      status: newAsg.status,
      statusColor: newAsg.status === 'Terbit' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800',
      type: 'assignment',
      instructions: newAsg.instructions,
    };
    setActivityList([item, ...activityList]);
  };

  const handleSaveQuiz = (newQuiz: QuizData) => {
    const totalPts = newQuiz.questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);
    const item = {
      id: newQuiz.id,
      title: newQuiz.title,
      course: newQuiz.course,
      due: 'Sesuai Jadwal Ujian',
      points: `${totalPts} Poin (${newQuiz.questions.length} Soal AKM)`,
      duration: `${newQuiz.durationMinutes} Menit`,
      passingGrade: newQuiz.passingGrade,
      submitted: '0 / 36 Siswa Selesai',
      status: newQuiz.status,
      statusColor: newQuiz.status === 'Terbit' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800',
      type: 'quiz',
      questionsCount: newQuiz.questions.length,
      questions: newQuiz.questions,
    };
    setActivityList([item, ...activityList]);
  };

  // Interactive Posts/Chat
  const [newPostText, setNewPostText] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Wahyu Wibowo, S.Pd.',
      role: 'Guru Pengampu',
      avatar: 'WW',
      time: 'Hari ini, 08:30 WIB',
      title: 'Selamat Datang di Semester Ganjil 2026/2027! 🎓📚',
      content:
        'Assalamu’alaikum wr. wb. dan salam sejahtera untuk seluruh siswa kelas X TKJ 1. Mulai pekan ini kita akan mempelajari dasar-dasar Pemrograman Web (HTML5 & CSS) 💻✨. Silakan unduh modul ajar di tab "Files" dan kerjakan tugas praktik pertama sebelum Jumat. Semangat belajar semuanya! 🔥👍',
      pinned: true,
      reactions: [
        { emoji: '👍', count: 18, users: ['Ahmad Fauzi', 'Bagas', 'Citra'] },
        { emoji: '❤️', count: 12, users: ['Dewi', 'Eka', 'Fajar'] },
        { emoji: '🔥', count: 9, users: ['Wahyu Wibowo', 'Dimas'] },
        { emoji: '💡', count: 5, users: ['Budi Santoso'] },
      ],
      replies: [
        {
          id: 101,
          author: 'Ahmad Fauzi',
          role: 'Siswa (NISN: 0074128931)',
          avatar: 'AF',
          time: 'Hari ini, 09:15 WIB',
          text: 'Siap Pak Wahyu, modul sudah saya unduh dan pelajari 👍. Untuk editor apakah boleh memakai Thonny atau VS Code? 🤔',
          reactions: [{ emoji: '👍', count: 3 }],
        },
        {
          id: 102,
          author: 'Wahyu Wibowo, S.Pd.',
          role: 'Guru',
          avatar: 'WW',
          time: 'Hari ini, 09:20 WIB',
          text: 'Boleh Ahmad, keduanya sangat bagus 💻✨. Untuk pemula kita sarankan Thonny terlebih dahulu agar mudah memahami struktur kode.',
          reactions: [{ emoji: '❤️', count: 6 }, { emoji: '👏', count: 4 }],
        },
      ],
    },
    {
      id: 2,
      author: 'SMKN 1 SIDAYU Kurikulum',
      role: 'Pengumuman Resmi',
      avatar: 'SMK',
      time: 'Kemarin, 14:00 WIB',
      title: 'Pemberitahuan Pelaksanaan Ujian Praktik & PTS 📢',
      content:
        'Diberitahukan kepada seluruh siswa SMKN 1 Sidayu bahwa Ujian Tengah Semester (PTS) Berbasis Komputer akan diselenggarakan mulai 20 Oktober 2026. Pastikan presensi kehadiran Anda memenuhi syarat minimal 85% 📝🎯.',
      pinned: false,
      reactions: [
        { emoji: '👍', count: 24, users: ['Semua Siswa'] },
        { emoji: '🙌', count: 8, users: ['Wali Murid'] },
      ],
      replies: [],
    },
  ]);

  const [replyInputs, setReplyInputs] = useState<{ [key: number]: string }>({});

  // Tambah Emoji ke Form Postingan Utama
  const handleAddEmojiToMain = (emojiChar: string) => {
    setNewPostText((prev) => prev + emojiChar);
  };

  // Tambah Emoji ke Form Balasan Tertentu
  const handleAddEmojiToReply = (postId: number, emojiChar: string) => {
    setReplyInputs((prev) => ({
      ...prev,
      [postId]: (prev[postId] || '') + emojiChar,
    }));
  };

  // Quick Emoji Reaction on a Post (ThumbsUp, Heart, Clap, Fire, Idea, dll)
  const handleToggleReaction = (postId: number, emojiChar: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id !== postId) return p;

        const existingReaction = p.reactions.find((r) => r.emoji === emojiChar);
        let updatedReactions;

        if (existingReaction) {
          // Tambah hitungan atau toggle
          updatedReactions = p.reactions.map((r) =>
            r.emoji === emojiChar ? { ...r, count: r.count + 1 } : r
          );
        } else {
          // Tambah reaksi baru
          updatedReactions = [...p.reactions, { emoji: emojiChar, count: 1, users: ['Anda'] }];
        }

        return { ...p, reactions: updatedReactions };
      })
    );
  };

  const handleSendPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost = {
      id: Date.now(),
      author:
        activeRole === 'Guru'
          ? 'Wahyu Wibowo, S.Pd.'
          : activeRole === 'Siswa'
          ? 'Ahmad Fauzi'
          : 'Administrator SMKN 1 Sidayu',
      role: activeRole,
      avatar: activeRole === 'Guru' ? 'WW' : activeRole === 'Siswa' ? 'AF' : 'AD',
      time: 'Baru saja',
      title: 'Diskusi Baru',
      content: newPostText,
      pinned: false,
      reactions: [{ emoji: '👍', count: 1, users: ['Anda'] }],
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setShowEmojiPickerMain(false);
  };

  const handleSendReply = (postId: number) => {
    const text = replyInputs[postId];
    if (!text || !text.trim()) return;

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [
              ...p.replies,
              {
                id: Date.now(),
                author: activeRole === 'Guru' ? 'Wahyu Wibowo, S.Pd.' : 'Ahmad Fauzi',
                role: activeRole,
                avatar: activeRole === 'Guru' ? 'WW' : 'AF',
                time: 'Baru saja',
                text: text.trim(),
                reactions: [],
              },
            ],
          };
        }
        return p;
      })
    );

    setReplyInputs({ ...replyInputs, [postId]: '' });
    setActiveReplyEmojiPicker(null);
  };

  const [classList, setClassList] = useState<ClassItem[]>([
    {
      id: 'tkj-101',
      name: 'X TKJ 1 - Pemrograman Web',
      teacher: 'Wahyu Wibowo, S.Pd.',
      members: 36,
      color: 'bg-[#1B2A72]',
      initials: 'PW',
      code: 'SMK-TKJ-101',
      channels: [
        { id: 'general', name: 'Umum (General)', unread: false },
        { id: 'materi', name: 'Modul & Materi Ajar', unread: true },
        { id: 'tugas', name: 'Tugas Praktik & Proyek', unread: false },
        { id: 'tanya-jawab', name: 'Tanya Jawab & Bantuan', unread: false },
      ],
    },
    {
      id: 'tkj-202',
      name: 'XI TKJ 2 - Administrasi Jaringan',
      teacher: 'Budi Santoso, M.T.',
      members: 34,
      color: 'bg-[#4DA8DA]',
      initials: 'AJ',
      code: 'SMK-TKJ-202',
      channels: [
        { id: 'general', name: 'Umum (General)', unread: false },
        { id: 'lab', name: 'Lab Mikrotik & Cisco', unread: false },
      ],
    },
    {
      id: 'tkr-101',
      name: 'X TKR 1 - Mesin Kendaraan',
      teacher: 'Hadi Prayitno, S.T.',
      members: 35,
      color: 'bg-[#F3A61C]',
      initials: 'MK',
      code: 'SMK-TKR-101',
      channels: [{ id: 'general', name: 'Umum (General)', unread: false }],
    },
    {
      id: 'dkv-102',
      name: 'X DKV 2 - Desain Grafis & Vektor',
      teacher: 'Dewi Lestari, S.Sn.',
      members: 36,
      color: 'bg-[#1E8449]',
      initials: 'DG',
      code: 'SMK-DKV-102',
      channels: [{ id: 'general', name: 'Umum (General)', unread: false }],
    },
  ]);

  const handleAddNewClass = (newClass: ClassItem) => {
    setClassList((prev) => {
      const exists = prev.some((c) => c.id === newClass.id);
      if (exists) return prev;
      return [newClass, ...prev];
    });
    setSelectedClassId(newClass.id);
    setSelectedChannel('general');
  };

  const currentClass = classList.find((c) => c.id === selectedClassId) || classList[0];

  return (
    <div className="flex h-screen w-full bg-[#EBF0F5] overflow-hidden select-none font-sans">
      
      {/* ============================================================== */}
      {/* 1. LEFT-MOST APP RAIL (Microsoft Teams Style with SMKN 1 Sidayu Palette) */}
      {/* ============================================================== */}
      <aside className="w-18 bg-[#0F1A4A] text-slate-300 flex flex-col items-center py-3 flex-shrink-0 z-30 border-r border-[#1B2A72]">
        
        {/* Brand Logo Mini */}
        <div className="mb-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer" title="SMKN 1 SIDAYU">
          <SchoolLogo size="navbar" className="h-9 w-auto max-h-[36px]" />
        </div>

        {/* Primary Rail Navigation Buttons */}
        <div className="flex-1 w-full flex flex-col items-center space-y-1">
          {[
            { id: 'activity', label: 'Aktivitas', icon: Bell, badge: 3 },
            { id: 'teams', label: 'Kelas & Tim', icon: Users, badge: null },
            { id: 'assignments', label: 'Tugas', icon: CheckSquare, badge: 2 },
            { id: 'calendar', label: 'Jadwal', icon: Calendar, badge: null },
            { id: 'grades', label: 'Nilai', icon: Award, badge: null },
            { id: 'files', label: 'File Materi', icon: FolderOpen, badge: null },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeRail === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveRail(item.id as any);
                  if (item.id === 'assignments') setActiveCanvasTab('assignments');
                  else if (item.id === 'grades') setActiveCanvasTab('grades');
                  else if (item.id === 'files') setActiveCanvasTab('files');
                  else setActiveCanvasTab('posts');
                }}
                className={`relative w-16 py-2 px-1 rounded-lg flex flex-col items-center justify-center transition-all ${
                  isActive
                    ? 'text-white bg-[#1B2A72] border-l-4 border-l-[#F3A61C] shadow-inner font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-[#F3A61C]' : 'text-slate-300'}`} />
                <span className="text-[10px] tracking-tight text-center leading-tight">
                  {item.label}
                </span>

                {item.badge && (
                  <span className="absolute top-1.5 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E53935] text-[9px] font-black text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Rail Actions */}
        <div className="w-full flex flex-col items-center space-y-2 pt-2 border-t border-slate-700/60">
          {onBackToClassic && (
            <button
              onClick={onBackToClassic}
              className="w-14 py-1.5 px-1 rounded text-slate-400 hover:text-white hover:bg-white/10 flex flex-col items-center text-[9px]"
              title="Beralih ke Tampilan Portal Klasik"
            >
              <LayoutGrid className="w-4 h-4 mb-0.5 text-[#4DA8DA]" />
              Klasik
            </button>
          )}

          <div
            className="w-9 h-9 rounded-full bg-[#1B2A72] border-2 border-[#F3A61C] flex items-center justify-center text-white font-black text-xs cursor-pointer shadow-xs"
            title={`${activeRole}: Wahyu Wibowo`}
          >
            {activeRole === 'Guru' ? 'WW' : activeRole === 'Siswa' ? 'AF' : 'AD'}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-14 py-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-900/40 flex flex-col items-center text-[9px] transition-colors"
              title="Keluar dari Akun (Logout)"
            >
              <LogOut className="w-3.5 h-3.5 mb-0.5" />
              Keluar
            </button>
          )}
        </div>
      </aside>

      {/* ============================================================== */}
      {/* 2. SECONDARY SIDEBAR: DAFTAR KELAS & SALURAN (CHANNELS) */}
      {/* ============================================================== */}
      <section className="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0 shadow-xs z-20">
        
        {/* Header Kelas */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#1B2A72]" />
              Kelas SMKN 1 SIDAYU
            </h2>
            <p className="text-[11px] text-slate-500">T.P. 2026/2027 • Ganjil</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsAddClassModalOpen(true)}
              className="p-1.5 rounded-lg bg-[#1B2A72] hover:bg-[#131F55] text-[#F3A61C] flex items-center gap-1 text-[11px] font-bold shadow-xs transition-transform active:scale-95"
              title="Tambah Kelas Baru atau Gabung Tim dengan Kode"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tambah</span>
            </button>
            <button className="p-1 rounded hover:bg-slate-200 text-slate-600" title="Filter Kelas">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Search */}
        <div className="p-2.5 border-b border-slate-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari kelas atau saluran..."
              className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-100 rounded-md border border-transparent focus:bg-white focus:border-[#1B2A72] focus:outline-none"
            />
          </div>
        </div>

        {/* Accordion List of Classes */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {classList.map((cls) => {
            const isSelected = cls.id === selectedClassId;
            return (
              <div key={cls.id} className="rounded-lg overflow-hidden border border-slate-200/80 bg-white">
                <div
                  onClick={() => setSelectedClassId(cls.id)}
                  className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/80 border-l-4 border-l-[#1B2A72]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-md ${cls.color} text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 shadow-xs`}
                    >
                      {cls.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                        {cls.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">{cls.teacher}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                </div>

                {isSelected && (
                  <div className="bg-slate-50/70 py-1 px-2 space-y-0.5 border-t border-slate-100">
                    {cls.channels.map((ch) => {
                      const isChActive = selectedChannel === ch.id;
                      return (
                        <button
                          key={ch.id}
                          onClick={() => setSelectedChannel(ch.id)}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                            isChActive
                              ? 'bg-[#1B2A72] text-white font-bold shadow-xs'
                              : 'text-slate-700 hover:bg-slate-200/60'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <Hash className={`w-3.5 h-3.5 ${isChActive ? 'text-[#F3A61C]' : 'text-slate-400'}`} />
                            <span className="truncate">{ch.name}</span>
                          </span>
                          {ch.unread && !isChActive && (
                            <span className="w-2 h-2 rounded-full bg-[#1B2A72]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Teams-Style "Gabung atau Buat Tim" Footer Button */}
        <div className="p-2.5 border-t border-slate-200/80 bg-slate-50/90">
          <button
            onClick={() => setIsAddClassModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border-2 border-dashed border-[#1B2A72]/30 hover:border-[#1B2A72] bg-white hover:bg-blue-50/60 text-[#1B2A72] font-extrabold text-xs shadow-2xs transition-all group"
          >
            <div className="w-5 h-5 rounded-md bg-[#1B2A72]/10 group-hover:bg-[#1B2A72] flex items-center justify-center transition-colors">
              <Plus className="w-3.5 h-3.5 text-[#1B2A72] group-hover:text-[#F3A61C]" />
            </div>
            <span>+ Gabung atau buat tim kelas</span>
          </button>
        </div>

        {/* Switch Role at Bottom of Sidebar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-semibold text-[11px]">Role Pengguna:</span>
          <select
            value={activeRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-[#1B2A72] focus:ring-1 focus:ring-[#1B2A72]"
          >
            <option value="Guru">Guru (Pengampu)</option>
            <option value="Siswa">Siswa (X TKJ 1)</option>
            <option value="Admin">Administrator</option>
            <option value="Wali Kelas">Wali Kelas</option>
            <option value="Kepala Sekolah">Kepala Sekolah</option>
          </select>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. MAIN WORKSPACE / CANVAS */}
      {/* ============================================================== */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        
        {/* Top Channel Header Bar */}
        <header className="h-16 px-6 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1B2A72] text-white font-black text-xs flex items-center justify-center shadow-xs">
              {currentClass.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 leading-none">
                  {currentClass.name}
                </h1>
                <span className="bg-blue-100 text-[#1B2A72] text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {selectedChannel.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {currentClass.members} Siswa Terdaftar • Pengampu: {currentClass.teacher}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Membuka Ruang Tatap Muka Virtual SMKN 1 Sidayu')}
              className="flex items-center gap-2 bg-[#1B2A72] hover:bg-[#131F55] text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-transform active:scale-95"
            >
              <Calendar className="w-4 h-4 text-[#F3A61C]" />
              <span>Sesi Belajar Langsung</span>
            </button>
          </div>
        </header>

        {/* Secondary Sub-Tabs: Posts (Obrolan), Files (Materi), Assignments (Tugas), Grades (Nilai) */}
        <div className="px-6 bg-slate-50 border-b border-slate-200 flex items-center gap-1 text-xs font-semibold">
          {[
            { id: 'posts', label: 'Obrolan & Diskusi', icon: MessageSquare },
            { id: 'files', label: 'File Materi', icon: FolderOpen },
            { id: 'assignments', label: 'Tugas & Kuis', icon: CheckSquare },
            { id: 'grades', label: 'Buku Nilai', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCanvasTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCanvasTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 border-b-2 transition-all ${
                  isActive
                    ? 'border-b-[#1B2A72] text-[#1B2A72] font-extrabold bg-white shadow-xs rounded-t-md'
                    : 'border-b-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1B2A72]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Canvas Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          
          {/* TAB 1: POSTS / OBROLAN KELAS DENGAN FITUR EMOTE LENGKAP */}
          {activeCanvasTab === 'posts' && (
            <div className="max-w-4xl mx-auto space-y-5 pb-6">
              
              {/* Form Input Kirim Postingan Baru dengan Emoji Popover */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 relative">
                <form onSubmit={handleSendPost}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1B2A72] flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-[#F3A61C]" />
                      Mulai Percakapan / Diskusi Baru di {currentClass.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Sebagai: <strong className="text-[#1B2A72]">{activeRole}</strong>
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                    placeholder="Tuliskan materi pengantar, pertanyaan, atau emotikon untuk memotivasi siswa... 😊📚"
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A72] focus:bg-white resize-none"
                  />

                  {/* Toolbar Bawah: Lampiran, Emote/Emoji Picker, dan Tombol Kirim */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 relative">
                    <div className="flex items-center gap-1 text-slate-500">
                      
                      {/* Tombol Buka Menu Emote/Emoji */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowEmojiPickerMain(!showEmojiPickerMain)}
                          className={`p-1.5 rounded flex items-center gap-1 text-xs font-semibold transition-colors ${
                            showEmojiPickerMain
                              ? 'bg-amber-100 text-amber-800'
                              : 'hover:bg-slate-100 text-slate-600'
                          }`}
                          title="Buka Pilihan Emotikon / Emoji"
                        >
                          <Smile className="w-4 h-4 text-amber-500" />
                          <span className="text-[11px]">Emote</span>
                        </button>

                        {/* POPOVER EMOTE PICKER UNTUK POSTINGAN UTAMA */}
                        {showEmojiPickerMain && (
                          <div className="absolute left-0 bottom-10 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                <Smile className="w-3.5 h-3.5 text-amber-500" /> Pilih Emotikon Belajar
                              </span>
                              <button
                                type="button"
                                onClick={() => setShowEmojiPickerMain(false)}
                                className="text-slate-400 hover:text-slate-600 p-0.5"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto">
                              {EMOJI_LIST.map((emoji) => (
                                <button
                                  key={emoji.char}
                                  type="button"
                                  onClick={() => handleAddEmojiToMain(emoji.char)}
                                  className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-lg transition-transform hover:scale-125 active:scale-95"
                                  title={emoji.label}
                                >
                                  {emoji.char}
                                </button>
                              ))}
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                              <span>Klik untuk memasukkan ke teks</span>
                              <span className="text-[#1B2A72] font-semibold">SMKN 1 Sidayu</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => alert('Membuka penjelajah berkas untuk melampirkan modul atau gambar')}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 flex items-center gap-1 text-[11px]"
                        title="Lampirkan File Modul / Gambar"
                      >
                        <Paperclip className="w-4 h-4 text-slate-400" />
                        <span>Lampiran</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!newPostText.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#1B2A72] hover:bg-[#131F55] disabled:opacity-50 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
                    >
                      <Send className="w-3.5 h-3.5" /> Kirim Diskusi
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed Daftar Postingan dengan Reaksi Emotikon */}
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden relative group"
                >
                  {/* FLOATING QUICK EMOJI REACTION BAR (KHAS MICROSOFT TEAMS) */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs rounded-full shadow-md border border-slate-200 px-2 py-1 flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity z-10">
                    <span className="text-[10px] text-slate-400 font-semibold px-1 hidden sm:inline">
                      Beri Emote:
                    </span>
                    {['👍', '❤️', '👏', '🎉', '💡', '🔥'].map((em) => (
                      <button
                        key={em}
                        onClick={() => handleToggleReaction(post.id, em)}
                        className="w-6 h-6 hover:bg-slate-100 rounded-full flex items-center justify-center text-xs transition-transform hover:scale-130 active:scale-90"
                        title={`Beri reaksi ${em}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>

                  {/* Post Header */}
                  <div className="p-4 bg-white border-b border-slate-100 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1B2A72] text-[#F3A61C] font-black text-xs flex items-center justify-center shadow-xs">
                        {post.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{post.author}</span>
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                            {post.role}
                          </span>
                          {post.pinned && (
                            <span className="flex items-center gap-0.5 text-amber-600 text-[10px] font-bold">
                              <Pin className="w-3 h-3" /> Disematkan
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{post.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Body */}
                  <div className="p-4 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    <h3 className="font-bold text-sm text-[#1B2A72] mb-1">{post.title}</h3>
                    <p>{post.content}</p>
                  </div>

                  {/* Badges Reaksi Emotikon (Chips Reaksi yang Diberikan Siswa & Guru) */}
                  <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {post.reactions &&
                        post.reactions.map((r, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleToggleReaction(post.id, r.emoji)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs transition-transform active:scale-95"
                            title={`Direaksikan oleh: ${r.users ? r.users.join(', ') : 'Siswa'}`}
                          >
                            <span className="text-sm">{r.emoji}</span>
                            <span className="text-[11px] text-slate-600">{r.count}</span>
                          </button>
                        ))}

                      {/* Tombol Tambah Reaksi Lain */}
                      <button
                        onClick={() => handleToggleReaction(post.id, '👏')}
                        className="px-2 py-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 text-xs font-bold flex items-center gap-1"
                        title="Tambah Tepuk Tangan"
                      >
                        <Plus className="w-3 h-3" />
                        <Smile className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium">
                      {post.replies.length} Balasan
                    </span>
                  </div>

                  {/* Replies Thread */}
                  {post.replies.length > 0 && (
                    <div className="bg-slate-50/50 p-4 border-t border-slate-100 space-y-3">
                      {post.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#0F1A4A] text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                            {reply.avatar}
                          </div>
                          <div className="flex-1 bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold text-slate-900">
                                {reply.author}
                              </span>
                              <span className="text-[10px] text-slate-400">{reply.time}</span>
                            </div>
                            <p className="text-xs text-slate-700">{reply.text}</p>

                            {/* Reaksi Kecil pada Komentar */}
                            {reply.reactions && reply.reactions.length > 0 && (
                              <div className="mt-1.5 flex items-center gap-1">
                                {reply.reactions.map((rr, rIdx) => (
                                  <span
                                    key={rIdx}
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] font-bold text-slate-700"
                                  >
                                    <span>{rr.emoji}</span>
                                    <span>{rr.count}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form Balasan dengan Tombol Emote untuk Balasan */}
                  <div className="p-3 bg-white border-t border-slate-100 relative">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveReplyEmojiPicker(
                              activeReplyEmojiPicker === post.id ? null : post.id
                            )
                          }
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
                          title="Beri Emote pada Balasan"
                        >
                          <Smile className="w-4 h-4 text-amber-500" />
                        </button>

                        {/* POPOVER EMOJI PICKER UNTUK BALASAN */}
                        {activeReplyEmojiPicker === post.id && (
                          <div className="absolute left-0 bottom-9 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in">
                            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-700">
                              <span>Pilih Emotikon</span>
                              <button
                                type="button"
                                onClick={() => setActiveReplyEmojiPicker(null)}
                                className="text-slate-400 hover:text-slate-600"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="grid grid-cols-6 gap-1">
                              {EMOJI_LIST.map((emoji) => (
                                <button
                                  key={emoji.char}
                                  type="button"
                                  onClick={() => handleAddEmojiToReply(post.id, emoji.char)}
                                  className="w-8 h-8 rounded hover:bg-slate-100 flex items-center justify-center text-base"
                                  title={emoji.label}
                                >
                                  {emoji.char}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <input
                        type="text"
                        placeholder="Balas diskusi ini (ketik pesan atau pilih emote)..."
                        value={replyInputs[post.id] || ''}
                        onChange={(e) =>
                          setReplyInputs({ ...replyInputs, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(post.id);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B2A72]"
                      />

                      <button
                        onClick={() => handleSendReply(post.id)}
                        className="px-3 py-1.5 bg-[#1B2A72] text-white text-xs font-bold rounded-lg hover:bg-[#131F55]"
                      >
                        Balas
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* TAB 2: FILES / MATERI PEMBELAJARAN */}
          {activeCanvasTab === 'files' && (
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Folder & Dokumen Materi</h2>
                  <p className="text-xs text-slate-500">Materi resmi tersimpan aman di server lokal SMKN 1 Sidayu</p>
                </div>
                {activeRole === 'Guru' && (
                  <button
                    onClick={() => alert('Membuka dialog unggah modul pembelajaran')}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1B2A72] text-white text-xs font-bold rounded-lg hover:bg-[#131F55]"
                  >
                    <Plus className="w-4 h-4 text-[#F3A61C]" /> Unggah Materi Baru
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Nama Berkas</th>
                      <th className="py-2.5 px-3">Diubah Oleh</th>
                      <th className="py-2.5 px-3">Tanggal Unggah</th>
                      <th className="py-2.5 px-3">Ukuran</th>
                      <th className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      {
                        name: 'Modul-01-Pengenalan-HTML-CSS.pdf',
                        type: 'pdf',
                        author: 'Wahyu Wibowo, S.Pd.',
                        date: '15 Okt 2026',
                        size: '2.4 MB',
                      },
                      {
                        name: 'Slide-Presentasi-Struktur-Web.pptx',
                        type: 'slide',
                        author: 'Wahyu Wibowo, S.Pd.',
                        date: '16 Okt 2026',
                        size: '5.1 MB',
                      },
                      {
                        name: 'Lembar-Kerja-Praktik-1.docx',
                        type: 'doc',
                        author: 'Wahyu Wibowo, S.Pd.',
                        date: '17 Okt 2026',
                        size: '420 KB',
                      },
                      {
                        name: 'Video-Tutorial-Setup-Thonny-Windows.mp4 (Link Drive)',
                        type: 'link',
                        author: 'SMKN 1 Sidayu IT',
                        date: '17 Okt 2026',
                        size: 'Tautan Eksternal',
                      },
                    ].map((file, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#1B2A72]" />
                          <span>{file.name}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{file.author}</td>
                        <td className="py-3 px-3 text-slate-500">{file.date}</td>
                        <td className="py-3 px-3 font-mono text-slate-500">{file.size}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => alert(`Mengunduh berkas: ${file.name}`)}
                            className="p-1.5 hover:bg-slate-200 rounded text-[#1B2A72]"
                            title="Unduh Berkas"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ASSIGNMENTS / TUGAS & KUIS */}
          {activeCanvasTab === 'assignments' && (
            <div className="max-w-5xl mx-auto space-y-4">
              
              {/* Header Tab Tugas & Kuis */}
              <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-[#1B2A72]" />
                    Penugasan & Ujian Mandiri
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mata Pelajaran: <strong>{currentClass.name}</strong> • TP. 2026/2027
                  </p>
                </div>

                {/* Tombol Buat Tugas & Kuis Khusus Guru / Admin */}
                {(activeRole === 'Guru' || activeRole === 'Admin' || activeRole === 'Superadmin') ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setModalDefaultMode('assignment');
                        setIsCreateModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1B2A72] hover:bg-[#131F55] text-white text-xs font-bold rounded-lg shadow-sm transition-transform active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-[#F3A61C]" />
                      <span>Buat Tugas Baru</span>
                    </button>

                    <button
                      onClick={() => {
                        setModalDefaultMode('quiz');
                        setIsCreateModalOpen(true);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0F1A4A] hover:bg-[#16235F] text-[#F3A61C] border border-[#F3A61C]/40 text-xs font-bold rounded-lg shadow-sm transition-transform active:scale-95"
                    >
                      <HelpCircle className="w-4 h-4 text-[#F3A61C]" />
                      <span>Buat Kuis CBT</span>
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
                    Status: Siswa Aktif
                  </span>
                )}
              </div>

              {/* Filter Jenis: Semua, Tugas Praktik, Kuis CBT */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      filterType === 'all'
                        ? 'bg-[#1B2A72] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua ({activityList.length})
                  </button>
                  <button
                    onClick={() => setFilterType('assignment')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      filterType === 'assignment'
                        ? 'bg-[#1B2A72] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tugas Praktik ({activityList.filter((a) => a.type === 'assignment').length})
                  </button>
                  <button
                    onClick={() => setFilterType('quiz')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      filterType === 'quiz'
                        ? 'bg-[#1B2A72] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Kuis CBT ({activityList.filter((a) => a.type === 'quiz').length})
                  </button>
                </div>

                <span className="text-slate-500 font-medium text-[11px] hidden sm:inline">
                  Tersinkronisasi dengan Database Akademik SMKN 1 Sidayu
                </span>
              </div>

              {/* Grid Daftar Tugas & Kuis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activityList
                  .filter((item) => (filterType === 'all' ? true : item.type === filterType))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div>
                        {/* Header Kartu */}
                        <div className="flex items-center justify-between mb-2.5">
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                              item.type === 'quiz'
                                ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                : 'bg-blue-100 text-[#1B2A72] border border-blue-200'
                            }`}
                          >
                            {item.type === 'quiz' ? 'Kuis CBT' : 'Tugas Praktik'}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              {item.points}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${item.statusColor}`}>
                              {item.status}
                            </span>
                          </div>
                        </div>

                        {/* Judul & Detail */}
                        <h3 className="font-extrabold text-sm text-slate-900 mb-1 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mb-2">{item.course}</p>

                        {item.instructions && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2 rounded border border-slate-100 italic">
                            "{item.instructions}"
                          </p>
                        )}

                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Batas: <strong>{item.due}</strong></span>
                          </div>
                          {item.duration && (
                            <div className="flex items-center gap-1.5 text-purple-700">
                              <HelpCircle className="w-3.5 h-3.5" />
                              <span>Durasi Ujian: <strong>{item.duration}</strong> (KKM: {item.passingGrade})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer Kartu & Tombol Aksi */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium text-[11px]">
                          {item.submitted}
                        </span>

                        <button
                          onClick={() => {
                            if (item.type === 'quiz') {
                              handleOpenQuizPlayer(item);
                            } else {
                              alert(`Membuka lembar pengumpulan & penilaian untuk: "${item.title}".`);
                            }
                          }}
                          className={`px-3 py-1.5 text-white font-bold rounded-lg transition-transform active:scale-95 text-xs ${
                            item.type === 'quiz'
                              ? 'bg-purple-800 hover:bg-purple-900 shadow-xs'
                              : 'bg-[#1B2A72] hover:bg-[#131F55]'
                          }`}
                        >
                          {activeRole === 'Guru'
                            ? (item.type === 'quiz' ? 'Simulasi / Analisis AKM' : 'Periksa Jawaban Siswa')
                            : (item.type === 'quiz' ? 'Mulai Ujian AKM CBT' : 'Kumpulkan Tugas')}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: GRADES / BUKU NILAI */}
          {activeCanvasTab === 'grades' && (
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Rekapitulasi Nilai Siswa (Gradebook)</h2>
                  <p className="text-xs text-slate-500">Mata Pelajaran: {currentClass.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert('Mengekspor Rekap Nilai ke format Excel .xlsx')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-2xs"
                  >
                    <FileSpreadsheet className="w-4 h-4" /> Ekspor Excel
                  </button>
                  <button
                    onClick={() => alert('Mencetak Laporan Nilai Resmi dengan Kop SMKN 1 Sidayu')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2A72] hover:bg-[#131F55] text-white text-xs font-bold rounded-lg shadow-2xs"
                  >
                    <Download className="w-4 h-4" /> Cetak PDF
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-[#0F1A4A] text-white font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 border-r border-slate-700">NISN</th>
                      <th className="py-2.5 px-3 border-r border-slate-700">Nama Lengkap Siswa</th>
                      <th className="py-2.5 px-3 border-r border-slate-700 text-center">Tugas 1 (Header)</th>
                      <th className="py-2.5 px-3 border-r border-slate-700 text-center">Kuis 1 (Teori)</th>
                      <th className="py-2.5 px-3 border-r border-slate-700 text-center">Praktik 2</th>
                      <th className="py-2.5 px-3 text-center">Rata-rata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[
                      { nisn: '0074128931', name: 'Ahmad Fauzi', t1: 90, k1: 92, p2: 88, avg: 90.0 },
                      { nisn: '0074128932', name: 'Bagas Pratama', t1: 85, k1: 80, p2: 84, avg: 83.0 },
                      { nisn: '0074128933', name: 'Citra Dewi', t1: 95, k1: 96, p2: 94, avg: 95.0 },
                      { nisn: '0074128934', name: 'Dimas Setiawan', t1: 78, k1: 82, p2: 80, avg: 80.0 },
                      { nisn: '0074128935', name: 'Eka Nurul Aini', t1: 92, k1: 90, p2: 91, avg: 91.0 },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-500 border-r border-slate-200">
                          {row.nisn}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                          {row.name}
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700 border-r border-slate-200">
                          {row.t1}
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700 border-r border-slate-200">
                          {row.k1}
                        </td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-700 border-r border-slate-200">
                          {row.p2}
                        </td>
                        <td className="py-2.5 px-3 text-center font-black text-[#1B2A72]">
                          {row.avg.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL PEMBUATAN TUGAS DAN KUIS CBT */}
      <CreateAssignmentQuizModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultMode={modalDefaultMode}
        currentCourseName={currentClass.name}
        onSaveAssignment={handleSaveAssignment}
        onSaveQuiz={handleSaveQuiz}
        onTestRunQuiz={(customQuestions, title) => {
          setPlayerQuizTitle(title);
          setPlayerQuestions(customQuestions);
          setIsPlayerModalOpen(true);
        }}
      />

      {/* MODAL SIMULATOR UJIAN CBT MODEL AKM */}
      <AKMQuizPlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        quizTitle={playerQuizTitle}
        courseName={currentClass.name}
        durationMinutes={45}
        questions={playerQuestions}
      />

      {/* MODAL MENU TAMBAH KELAS & GABUNG TIM */}
      <CreateClassModal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        activeRole={activeRole}
        onAddClass={handleAddNewClass}
        existingClasses={classList}
      />

    </div>
  );
};
