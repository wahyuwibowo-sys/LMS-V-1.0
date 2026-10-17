import React, { useState, useRef } from 'react';
import {
  X,
  FileText,
  HelpCircle,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckSquare,
  Layers,
  ArrowRightLeft,
  Move,
  ToggleLeft,
  Save,
  Send,
  Play,
  Upload,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Check,
  RefreshCw
} from 'lucide-react';

export type AKMQuestionType =
  | 'pilihan_ganda' // 1 jawaban benar (opsi berlingkar A, B, C, D, E)
  | 'pilihan_ganda_kompleks' // >1 centang benar
  | 'menjodohkan' // Pasangan Kolom Kiri & Kanan
  | 'drag_drop' // Geser label ke kotak sasaran
  | 'benar_salah'; // Matriks pernyataan Benar/Salah

export interface AKMQuestion {
  id: number;
  type: AKMQuestionType;
  text: string;
  questionImage?: string;
  points: number;
  explanation: string;

  // 1. Pilihan Ganda & Pilihan Ganda Kompleks
  options?: { id: string; text: string; image?: string }[];
  correctOptionId?: string; // untuk pilihan_ganda biasa (kunci berlingkar A/B/C/D/E)
  correctOptionIds?: string[]; // untuk pilihan_ganda_kompleks

  // 2. Menjodohkan
  matchingPairs?: { left: string; right: string }[];

  // 3. Drag and Drop
  dragItems?: { id: string; text: string; targetId: string }[];
  dragTargets?: { id: string; label: string }[];

  // 4. Benar / Salah
  statements?: { id: string; statement: string; isTrue: boolean }[];
}

export interface QuizData {
  id: number;
  title: string;
  course: string;
  description: string;
  durationMinutes: number;
  passingGrade: number;
  maxAttempts: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showScoreImmediately: boolean;
  showExplanations: boolean;
  questions: AKMQuestion[];
  status: 'Draf' | 'Terbit';
  type: 'quiz';
}

export interface AssignmentData {
  id: number;
  title: string;
  course: string;
  instructions: string;
  maxScore: number;
  dueDate: string;
  allowLate: boolean;
  status: 'Draf' | 'Terbit';
  type: 'assignment';
}

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'assignment' | 'quiz';
  currentCourseName?: string;
  onSaveAssignment: (assignment: AssignmentData) => void;
  onSaveQuiz: (quiz: QuizData) => void;
  onTestRunQuiz?: (questions: AKMQuestion[], title: string) => void;
}

export const CreateAssignmentQuizModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'quiz',
  currentCourseName = 'X TKJ 1 - Pemrograman Web',
  onSaveAssignment,
  onSaveQuiz,
  onTestRunQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<'assignment' | 'quiz'>(defaultMode);

  // ================= ASSIGNMENT FORM STATE =================
  const [asgTitle, setAsgTitle] = useState('');
  const [asgInstructions, setAsgInstructions] = useState('');
  const [asgDueDate, setAsgDueDate] = useState('2026-10-24T23:59');
  const [asgMaxScore, setAsgMaxScore] = useState(100);
  const [asgAllowLate, setAsgAllowLate] = useState(true);

  // ================= QUIZ FORM STATE =================
  const [quizTitle, setQuizTitle] = useState(
    'Asesmen Kompetensi Kejuruan (AKM) CBT - Pemrograman Web & Jaringan Dasar'
  );
  const [quizDesc, setQuizDesc] = useState('Standar Evaluasi AKM Kemdikbud untuk SMK');
  const [quizDuration, setQuizDuration] = useState(45);
  const [quizPassingGrade, setQuizPassingGrade] = useState(75);
  const [quizMaxAttempts, setQuizMaxAttempts] = useState(1);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [showScoreImmediately, setShowScoreImmediately] = useState(true);
  const [showExplanations, setShowExplanations] = useState(true);

  // ================= NAVIGASI MENU PILIHAN NOMOR SOAL & MODE TAMPILAN =================
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [showQuizSettings, setShowQuizSettings] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // DAFTAR BUTIR SOAL MODEL AKM LENGKAP
  const [questions, setQuestions] = useState<AKMQuestion[]>([
    // 1. Soal Pilihan Ganda (Opsi berlingkar A, B, C, D, E)
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
    // 2. Soal Pilihan Ganda Kompleks (>1 Jawaban Benar)
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
    // 3. Soal Menjodohkan (Matching Pairs)
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
    // 4. Soal Drag and Drop (Geser Komponen ke Target)
    {
      id: 4,
      type: 'drag_drop',
      text: 'Tarik atau tempatkan label komponen arsitektur web berikut ke kotak fungsi sasaran yang tepat:',
      points: 20,
      explanation: 'Client mengirim request, Web Server melayani logic HTTP, Database menyimpan record permanen.',
      dragTargets: [
        { id: 't1', label: '1. Mengirim permintaan HTTP dari peramban peramban siswa' },
        { id: 't2', label: '2. Memproses logika aplikasi dan routing backend' },
        { id: 't3', label: '3. Menyimpan data akun, nilai, dan modul secara permanen' },
      ],
      dragItems: [
        { id: 'item1', text: 'Web Browser (Client)', targetId: 't1' },
        { id: 'item2', text: 'Django Web Server', targetId: 't2' },
        { id: 'item3', text: 'Database SQLite / PostgreSQL', targetId: 't3' },
      ],
    },
    // 5. Soal Benar / Salah (True-False Matrix)
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
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ qId: number; optId?: string } | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Ubah Tipe Soal untuk Soal Tertentu (Menu Ubah Tipe Soal)
  const handleChangeQuestionType = (qId: number, newType: AKMQuestionType) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId) return q;
        const updated: AKMQuestion = {
          ...q,
          type: newType,
        };

        if (newType === 'pilihan_ganda') {
          updated.options = [
            { id: 'A', text: 'Pilihan Jawaban A' },
            { id: 'B', text: 'Pilihan Jawaban B' },
            { id: 'C', text: 'Pilihan Jawaban C' },
            { id: 'D', text: 'Pilihan Jawaban D' },
            { id: 'E', text: 'Pilihan Jawaban E' },
          ];
          updated.correctOptionId = 'A';
          delete updated.matchingPairs;
          delete updated.dragItems;
          delete updated.dragTargets;
          delete updated.statements;
        } else if (newType === 'pilihan_ganda_kompleks') {
          updated.options = [
            { id: 'A', text: 'Pernyataan 1 (Benar)' },
            { id: 'B', text: 'Pernyataan 2 (Benar)' },
            { id: 'C', text: 'Pernyataan 3 (Salah)' },
            { id: 'D', text: 'Pernyataan 4 (Benar)' },
          ];
          updated.correctOptionIds = ['A', 'B', 'D'];
          delete updated.correctOptionId;
          delete updated.matchingPairs;
          delete updated.dragItems;
          delete updated.dragTargets;
          delete updated.statements;
        } else if (newType === 'menjodohkan') {
          updated.matchingPairs = [
            { left: 'Premis Konsep A', right: 'Pasangan Definisi A' },
            { left: 'Premis Konsep B', right: 'Pasangan Definisi B' },
            { left: 'Premis Konsep C', right: 'Pasangan Definisi C' },
          ];
          delete updated.options;
          delete updated.correctOptionId;
          delete updated.correctOptionIds;
          delete updated.dragItems;
          delete updated.dragTargets;
          delete updated.statements;
        } else if (newType === 'drag_drop') {
          updated.dragTargets = [
            { id: 't1', label: '1. Kotak Sasaran A' },
            { id: 't2', label: '2. Kotak Sasaran B' },
          ];
          updated.dragItems = [
            { id: 'item1', text: 'Label Kata Kunci 1', targetId: 't1' },
            { id: 'item2', text: 'Label Kata Kunci 2', targetId: 't2' },
          ];
          delete updated.options;
          delete updated.correctOptionId;
          delete updated.correctOptionIds;
          delete updated.matchingPairs;
          delete updated.statements;
        } else if (newType === 'benar_salah') {
          updated.statements = [
            { id: 's1', statement: 'Pernyataan evaluasi nomor 1...', isTrue: true },
            { id: 's2', statement: 'Pernyataan evaluasi nomor 2...', isTrue: false },
            { id: 's3', statement: 'Pernyataan evaluasi nomor 3...', isTrue: true },
          ];
          delete updated.options;
          delete updated.correctOptionId;
          delete updated.correctOptionIds;
          delete updated.matchingPairs;
          delete updated.dragItems;
          delete updated.dragTargets;
        }

        return updated;
      })
    );
    showNotification(`Soal Nomor ${questions.findIndex((x) => x.id === qId) + 1} diubah menjadi model ${newType.replace(/_/g, ' ')}!`);
  };

  // Tambah Butir Soal Baru
  const handleAddNewQuestion = (type: AKMQuestionType) => {
    const newId = Date.now();
    let newQ: AKMQuestion = {
      id: newId,
      type,
      text: `Tulis teks pertanyaan nomor ${questions.length + 1} di sini...`,
      points: 20,
      explanation: 'Pembahasan materi untuk soal ini...',
    };

    if (type === 'pilihan_ganda') {
      newQ.options = [
        { id: 'A', text: 'Pilihan Jawaban A' },
        { id: 'B', text: 'Pilihan Jawaban B' },
        { id: 'C', text: 'Pilihan Jawaban C' },
        { id: 'D', text: 'Pilihan Jawaban D' },
        { id: 'E', text: 'Pilihan Jawaban E' },
      ];
      newQ.correctOptionId = 'A';
    } else if (type === 'pilihan_ganda_kompleks') {
      newQ.options = [
        { id: 'A', text: 'Pernyataan 1' },
        { id: 'B', text: 'Pernyataan 2' },
        { id: 'C', text: 'Pernyataan 3' },
        { id: 'D', text: 'Pernyataan 4' },
      ];
      newQ.correctOptionIds = ['A', 'B'];
    } else if (type === 'menjodohkan') {
      newQ.matchingPairs = [
        { left: 'Premis 1', right: 'Pasangan 1' },
        { left: 'Premis 2', right: 'Pasangan 2' },
        { left: 'Premis 3', right: 'Pasangan 3' },
      ];
    } else if (type === 'drag_drop') {
      newQ.dragTargets = [
        { id: 't1', label: '1. Kotak Sasaran 1' },
        { id: 't2', label: '2. Kotak Sasaran 2' },
      ];
      newQ.dragItems = [
        { id: 'item1', text: 'Kata Kunci 1', targetId: 't1' },
        { id: 'item2', text: 'Kata Kunci 2', targetId: 't2' },
      ];
    } else if (type === 'benar_salah') {
      newQ.statements = [
        { id: 's1', statement: 'Pernyataan 1...', isTrue: true },
        { id: 's2', statement: 'Pernyataan 2...', isTrue: false },
      ];
    }

    const updatedList = [...questions, newQ];
    setQuestions(updatedList);
    setActiveQuestionIndex(updatedList.length - 1);
    showNotification(`Soal Nomor ${updatedList.length} (${type.replace(/_/g, ' ')}) berhasil ditambahkan!`);
  };

  // Hapus Soal
  const handleRemoveQuestion = (qId: number) => {
    if (questions.length <= 1) {
      alert('Kuis minimal harus memiliki 1 butir soal.');
      return;
    }
    const idx = questions.findIndex((q) => q.id === qId);
    const updated = questions.filter((q) => q.id !== qId);
    setQuestions(updated);
    setActiveQuestionIndex(Math.max(0, idx - 1));
    showNotification('Butir soal telah dihapus.');
  };

  // Upload Gambar Nyata dari Komputer/Laptop
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (uploadTarget.optId) {
        // Gambar pada Opsi Jawaban
        setQuestions(
          questions.map((q) => {
            if (q.id !== uploadTarget.qId || !q.options) return q;
            return {
              ...q,
              options: q.options.map((opt) =>
                opt.id === uploadTarget.optId ? { ...opt, image: dataUrl } : opt
              ),
            };
          })
        );
        showNotification(`Gambar untuk Opsi [${uploadTarget.optId}] berhasil dimuat!`);
      } else {
        // Gambar Stimulus Soal
        setQuestions(
          questions.map((q) =>
            q.id === uploadTarget.qId ? { ...q, questionImage: dataUrl } : q
          )
        );
        showNotification('Gambar stimulus soal berhasil dimuat!');
      }
      setUploadTarget(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const triggerUpload = (qId: number, optId?: string) => {
    setUploadTarget({ qId, optId });
    fileInputRef.current?.click();
  };

  // Pasang Gambar Contoh Kejuruan (Vokasi SMKN 1 Sidayu)
  const handleAttachPresetImage = (qId: number, optId?: string) => {
    const samples = [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80', // Jaringan & Server
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80', // Server Rack
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80', // Kode Pemrograman
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80', // Mesin Otomotif (TKR)
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];

    if (optId) {
      setQuestions(
        questions.map((q) => {
          if (q.id !== qId || !q.options) return q;
          return {
            ...q,
            options: q.options.map((opt) =>
              opt.id === optId ? { ...opt, image: opt.image ? undefined : picked } : opt
            ),
          };
        })
      );
    } else {
      setQuestions(
        questions.map((q) =>
          q.id === qId ? { ...q, questionImage: q.questionImage ? undefined : picked } : q
        )
      );
    }
  };

  // Helper Tambah Opsi
  const handleAddOptionToQuestion = (qId: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId || !q.options) return q;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nextLetter = letters[q.options.length] || `P${q.options.length + 1}`;
        return {
          ...q,
          options: [...q.options, { id: nextLetter, text: `Pilihan Jawaban ${nextLetter}` }],
        };
      })
    );
  };

  // Helper Hapus Opsi
  const handleRemoveOptionFromQuestion = (qId: number, optId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id !== qId || !q.options || q.options.length <= 2) return q;
        return {
          ...q,
          options: q.options.filter((o) => o.id !== optId),
        };
      })
    );
  };

  const totalPoints = questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

  // Jalankan Simulasi Langsung
  const handleRunSimulation = () => {
    if (onTestRunQuiz) {
      onTestRunQuiz(questions, quizTitle || 'Simulasi AKM CBT SMKN 1 Sidayu');
    } else {
      alert('Simulasi kuis dijalankan dengan data butir soal yang sedang aktif!');
    }
  };

  const handleSubmitQuiz = (status: 'Draf' | 'Terbit') => {
    if (!quizTitle.trim()) {
      alert('Silakan masukkan judul kuis/ujian terlebih dahulu.');
      return;
    }

    onSaveQuiz({
      id: Date.now(),
      title: quizTitle,
      course: currentCourseName,
      description: quizDesc,
      durationMinutes: Number(quizDuration),
      passingGrade: Number(quizPassingGrade),
      maxAttempts: Number(quizMaxAttempts),
      shuffleQuestions,
      shuffleOptions,
      showScoreImmediately,
      showExplanations,
      questions,
      status,
      type: 'quiz',
    });

    onClose();
  };

  if (!isOpen) return null;

  const currentQ = questions[activeQuestionIndex] || questions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in select-none">
      
      {/* Hidden file input for uploading real images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="bg-white w-full max-w-6xl h-[95vh] rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden font-sans">
        
        {/* ============================================================== */}
        {/* HEADER MODAL DENGAN BRANDING SMKN 1 SIDAYU & TOMBOL SIMULASI */}
        {/* ============================================================== */}
        <div className="px-5 py-3.5 bg-[#0F1A4A] text-white flex items-center justify-between border-b border-[#2B3F9F] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1B2A72] rounded-xl border border-[#F3A61C]/50 text-[#F3A61C] shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                  {activeTab === 'quiz' ? 'Editor & Bank Soal Kuis AKM / CBT' : 'Pembuat Tugas Praktik'}
                </h2>
                <span className="bg-[#F3A61C] text-[#0F1A4A] text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                  Standar AKM ANBK
                </span>
              </div>
              <p className="text-xs text-[#4DA8DA] font-medium">
                Kelas: {currentCourseName} • SMKN 1 SIDAYU GRESIK
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Tab: Kuis AKM vs Tugas */}
            <div className="bg-[#1B2A72] p-1 rounded-lg flex items-center border border-[#2B3F9F]">
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-[#F3A61C] text-[#0F1A4A] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Kuis CBT AKM
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('assignment')}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeTab === 'assignment'
                    ? 'bg-[#F3A61C] text-[#0F1A4A] shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Tugas Praktik
              </button>
            </div>

            {/* TOMBOL JALANKAN / UJI COBA SIMULASI LANGSUNG (Dapat Dijalankan Kapan Saja) */}
            {activeTab === 'quiz' && (
              <button
                type="button"
                onClick={handleRunSimulation}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-lg shadow-sm border border-emerald-400/40 transition-transform active:scale-95"
                title="Jalankan Simulasi Siswa untuk Mengerjakan Soal Ini"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">Jalankan Simulasi Kuis</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOTIFIKASI TOAST JIKA ADA AKSI */}
        {feedbackToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top flex-shrink-0">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> {feedbackToast}
            </span>
            <button onClick={() => setFeedbackToast(null)} className="text-white hover:opacity-80">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-HEADER NAVIGASI NOMOR SOAL & KONTROL (DILUAR KANVAS GULIR, TIDAK MENUTUPI AREA MENULIS) */}
        {/* ============================================================== */}
        {activeTab === 'quiz' && (
          <div className="bg-[#14225D] text-white px-4 py-2.5 border-b border-[#2B3F9F] flex flex-wrap items-center justify-between gap-3 flex-shrink-0 shadow-xs z-10">
            {/* Row Tombol Nomor Soal (Dapat Digeser Horizontal Jika Banyak) */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
              <span className="text-[11px] font-black text-[#F3A61C] flex items-center gap-1 uppercase flex-shrink-0 mr-1">
                <Layers className="w-3.5 h-3.5" /> Nomor Soal:
              </span>

              {questions.map((q, idx) => {
                const isCurrent = idx === activeQuestionIndex;
                let typeShort = 'PG';
                let typeBadgeColor = 'bg-blue-600';
                if (q.type === 'pilihan_ganda_kompleks') {
                  typeShort = 'PGK';
                  typeBadgeColor = 'bg-amber-600';
                } else if (q.type === 'menjodohkan') {
                  typeShort = 'Jodoh';
                  typeBadgeColor = 'bg-emerald-600';
                } else if (q.type === 'drag_drop') {
                  typeShort = 'Drag';
                  typeBadgeColor = 'bg-purple-600';
                } else if (q.type === 'benar_salah') {
                  typeShort = 'B/S';
                  typeBadgeColor = 'bg-rose-600';
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setActiveQuestionIndex(idx);
                      if (viewMode === 'all') {
                        const el = document.getElementById(`question-card-${q.id}`);
                        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all border flex-shrink-0 ${
                      isCurrent
                        ? 'bg-[#F3A61C] text-[#0F1A4A] border-white shadow-xs ring-2 ring-white scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    <span className={`text-[9px] font-black px-1 rounded text-white ${typeBadgeColor}`}>
                      {typeShort}
                    </span>
                  </button>
                );
              })}

              {/* Quick Add Buttons */}
              <div className="flex items-center gap-1 ml-1 pl-2 border-l border-white/20 flex-shrink-0">
                <span className="text-[10px] text-slate-300 font-bold hidden sm:inline">+ Tambah:</span>
                <button
                  type="button"
                  onClick={() => handleAddNewQuestion('pilihan_ganda')}
                  className="px-2 py-0.5 bg-blue-700 hover:bg-blue-600 text-[10px] font-black rounded text-white"
                  title="Tambah Pilihan Ganda"
                >
                  + PG
                </button>
                <button
                  type="button"
                  onClick={() => handleAddNewQuestion('pilihan_ganda_kompleks')}
                  className="px-2 py-0.5 bg-amber-700 hover:bg-amber-600 text-[10px] font-black rounded text-white"
                  title="Tambah PG Kompleks"
                >
                  + PGK
                </button>
                <button
                  type="button"
                  onClick={() => handleAddNewQuestion('menjodohkan')}
                  className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-[10px] font-black rounded text-white"
                  title="Tambah Menjodohkan"
                >
                  + Jodoh
                </button>
                <button
                  type="button"
                  onClick={() => handleAddNewQuestion('drag_drop')}
                  className="px-2 py-0.5 bg-purple-700 hover:bg-purple-600 text-[10px] font-black rounded text-white"
                  title="Tambah Drag & Drop"
                >
                  + Drag
                </button>
                <button
                  type="button"
                  onClick={() => handleAddNewQuestion('benar_salah')}
                  className="px-2 py-0.5 bg-rose-700 hover:bg-rose-600 text-[10px] font-black rounded text-white"
                  title="Tambah Benar / Salah"
                >
                  + B/S
                </button>
              </div>
            </div>

            {/* Mode Tampilan Switcher & Toggle Pengaturan Kuis */}
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              <div className="bg-[#0F1A4A] p-0.5 rounded-lg flex items-center border border-white/20 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('single')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    viewMode === 'single'
                      ? 'bg-[#F3A61C] text-[#0F1A4A] shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Tampilkan satu soal saja agar nyaman menulis"
                >
                  Mode Fokus
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('all')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    viewMode === 'all'
                      ? 'bg-[#F3A61C] text-[#0F1A4A] shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Tampilkan semua soal berurutan"
                >
                  Semua ({questions.length})
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowQuizSettings(!showQuizSettings)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-colors border ${
                  showQuizSettings
                    ? 'bg-white text-[#0F1A4A] border-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
                }`}
                title="Buka / Tutup Pengaturan Judul, Waktu, dan KKM Kuis"
              >
                <Sliders className="w-3 h-3" />
                <span className="hidden md:inline">
                  {showQuizSettings ? 'Tutup Pengaturan' : 'Pengaturan Kuis'}
                </span>
              </button>

              <span className="text-[11px] font-black bg-[#F3A61C] text-[#0F1A4A] px-2 py-0.5 rounded">
                {totalPoints} Poin
              </span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* BODY MODAL BERGULIR: AREA BEBAS MENULIS SOAL TANPA TERHALANG */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto bg-[#F4F6FA] p-4 sm:p-6 space-y-4 font-sans">
          
          {activeTab === 'quiz' ? (
            <div className="space-y-4 max-w-5xl mx-auto">
              
              {/* PENGATURAN UMUM UJIAN: BISA DIBUKA / DITUTUP AGAR TIDAK MEMAKAN RUANG */}
              {showQuizSettings ? (
                <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#1B2A72]/20 shadow-xs space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-black text-[#1B2A72] uppercase flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-[#F3A61C]" /> Pengaturan Identitas & Parameter Kuis
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowQuizSettings(false)}
                      className="text-xs font-bold text-slate-500 hover:text-slate-800"
                    >
                      Sembunyikan ▲
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-extrabold text-slate-800 mb-1">
                        Judul Ujian / Kuis Model AKM <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="Masukkan judul ujian atau kuis..."
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1B2A72]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 mb-1">
                        Durasi Waktu Ujian
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={quizDuration}
                          onChange={(e) => setQuizDuration(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                        />
                        <span className="text-xs font-bold text-slate-600">Menit</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Nilai KKM</label>
                      <input
                        type="number"
                        value={quizPassingGrade}
                        onChange={(e) => setQuizPassingGrade(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 font-bold bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Batas Percobaan</label>
                      <select
                        value={quizMaxAttempts}
                        onChange={(e) => setQuizMaxAttempts(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 font-bold bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      >
                        <option value={1}>1 Kali (Ujian Resmi)</option>
                        <option value={2}>2 Kali</option>
                        <option value={99}>Tidak Dibatasi</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <input
                        type="checkbox"
                        id="chkShuffle"
                        checked={shuffleQuestions}
                        onChange={(e) => setShuffleQuestions(e.target.checked)}
                        className="w-4 h-4 text-[#1B2A72] rounded cursor-pointer"
                      />
                      <label htmlFor="chkShuffle" className="font-bold text-slate-700 cursor-pointer">
                        Acak Soal
                      </label>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <input
                        type="checkbox"
                        id="chkImmediate"
                        checked={showScoreImmediately}
                        onChange={(e) => setShowScoreImmediately(e.target.checked)}
                        className="w-4 h-4 text-[#1B2A72] rounded cursor-pointer"
                      />
                      <label htmlFor="chkImmediate" className="font-bold text-slate-700 cursor-pointer">
                        Tampilkan Nilai
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                /* Baris Ringkas Pengaturan yang tidak memakan tempat */
                <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-black text-slate-900 truncate">
                      {quizTitle || 'Kuis Baru'}
                    </span>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <span className="text-slate-600 font-bold hidden sm:inline">
                      {quizDuration} Menit
                    </span>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <span className="text-slate-600 font-bold hidden sm:inline">
                      KKM: {quizPassingGrade}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQuizSettings(true)}
                    className="text-xs font-bold text-[#1B2A72] hover:text-[#0F1A4A] flex items-center gap-1 flex-shrink-0 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#F3A61C]" />
                    <span>Ubah Judul & Waktu</span>
                  </button>
                </div>
              )}

              {/* ============================================================== */}
              {/* CARD 3: AREA PENYUNTINGAN BUTIR SOAL TERPILIH */}
              {/* ============================================================== */}
              {(viewMode === 'single' ? [currentQ] : questions).map((q, renderIdx) => {
                const questionNumber = viewMode === 'single' ? activeQuestionIndex + 1 : renderIdx + 1;

                return (
                  <div
                    key={q.id}
                    id={`question-card-${q.id}`}
                    className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 p-5 sm:p-6 space-y-4 relative transition-all"
                  >
                    {/* Header Kartu Butir Soal */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-[#1B2A72] text-[#F3A61C] flex items-center justify-center text-sm font-black shadow-xs">
                          {questionNumber}
                        </span>
                        <div>
                          <span className="text-sm font-black text-slate-900 block leading-tight">
                            Butir Soal Nomor {questionNumber}
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold">
                            Tipe Aktif: <strong className="text-slate-800 uppercase">{q.type.replace(/_/g, ' ')}</strong>
                          </span>
                        </div>
                      </div>

                      {/* MENU UBAH TIPE SOAL LANGSUNG & BOBOT POIN */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Dropdown Ganti Tipe Model Soal AKM */}
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                          <Sliders className="w-3.5 h-3.5 text-[#1B2A72] ml-1" />
                          <label className="text-[11px] font-bold text-slate-600">Model AKM:</label>
                          <select
                            value={q.type}
                            onChange={(e) => handleChangeQuestionType(q.id, e.target.value as AKMQuestionType)}
                            className="bg-white px-2 py-1 text-xs font-bold text-[#1B2A72] border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B2A72]"
                          >
                            <option value="pilihan_ganda">1. Pilihan Ganda (Opsi Berlingkar)</option>
                            <option value="pilihan_ganda_kompleks">2. PG Kompleks (Kotak Centang)</option>
                            <option value="menjodohkan">3. Menjodohkan (Premis & Pasangan)</option>
                            <option value="drag_drop">4. Drag & Drop (Tarik & Sasaran)</option>
                            <option value="benar_salah">5. Benar / Salah (Matriks Evaluasi)</option>
                          </select>
                        </div>

                        {/* Input Bobot Poin */}
                        <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 text-xs">
                          <span className="font-bold text-slate-600">Poin:</span>
                          <input
                            type="number"
                            value={q.points}
                            onChange={(e) =>
                              setQuestions(
                                questions.map((item) =>
                                  item.id === q.id ? { ...item, points: Number(e.target.value) } : item
                                )
                              )
                            }
                            className="w-12 px-1 text-xs font-black text-center bg-white border border-slate-300 rounded"
                          />
                        </div>

                        {/* Uji Coba Simulasi Khusus Soal Ini */}
                        <button
                          type="button"
                          onClick={() => {
                            if (onTestRunQuiz) {
                              onTestRunQuiz([q], `Simulasi Soal Nomor ${questionNumber}`);
                            } else {
                              alert(`Menjalankan simulasi soal nomor ${questionNumber}`);
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold"
                          title="Uji coba langsung soal nomor ini"
                        >
                          <Play className="w-3 h-3 fill-emerald-700 text-emerald-700" />
                          <span>Uji Soal Ini</span>
                        </button>

                        {/* Hapus Soal */}
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(q.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                          title="Hapus butir soal ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* TEKS PERTANYAAN & LAMPIRAN GAMBAR STIMULUS SOAL */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="text-xs font-extrabold text-slate-800">
                          Teks Stimulus Wacana & Pertanyaan:
                        </label>
                        <div className="flex items-center gap-2">
                          {/* Tombol Upload Gambar dari Laptop */}
                          <button
                            type="button"
                            onClick={() => triggerUpload(q.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-[#1B2A72] text-[#F3A61C] rounded-lg hover:bg-[#131F55] transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Foto/Gambar Soal</span>
                          </button>

                          {/* Tombol Contoh Gambar Preset */}
                          <button
                            type="button"
                            onClick={() => handleAttachPresetImage(q.id)}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 border border-slate-300"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-[#1B2A72]" />
                            <span>{q.questionImage ? 'Ganti Contoh Gambar' : '+ Gambar Contoh'}</span>
                          </button>

                          {q.questionImage && (
                            <button
                              type="button"
                              onClick={() =>
                                setQuestions(
                                  questions.map((item) =>
                                    item.id === q.id ? { ...item, questionImage: undefined } : item
                                  )
                                )
                              }
                              className="text-xs text-rose-600 font-bold hover:underline"
                            >
                              Hapus Gambar
                            </button>
                          )}
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        value={q.text}
                        onChange={(e) =>
                          setQuestions(
                            questions.map((item) =>
                              item.id === q.id ? { ...item, text: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Ketikkan wacana, studi kasus, atau pertanyaan soal di sini..."
                        className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B2A72] text-slate-900 font-medium leading-relaxed"
                      />

                      {/* Display Preview Gambar Stimulus Soal jika ada */}
                      {q.questionImage && (
                        <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 inline-block">
                          <img
                            src={q.questionImage}
                            alt={`Stimulus Soal ${questionNumber}`}
                            className="max-h-52 rounded-lg object-contain border border-slate-300 shadow-2xs"
                          />
                          <span className="text-[10px] text-slate-500 mt-1 block italic text-center">
                            Gambar / Infografis Stimulus Soal Nomor {questionNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ============================================================== */}
                    {/* FORMAT SOAL 1: PILIHAN GANDA (OPSI BERLINGKAR A, B, C, D, E) */}
                    {/* ============================================================== */}
                    {q.type === 'pilihan_ganda' && q.options && (
                      <div className="space-y-3 pt-3 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-blue-50/70 p-3 rounded-xl border border-blue-200">
                          <div>
                            <span className="text-xs font-black text-[#1B2A72] block">
                              Pilihan Jawaban Berlingkar (Klik bulatan huruf untuk menetapkan KUNCI BENAR):
                            </span>
                            <span className="text-[11px] text-slate-600 font-medium">
                              Bulatan hijau dengan tanda centang menandakan kunci jawaban yang benar.
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddOptionToQuestion(q.id)}
                            className="px-3 py-1.5 bg-[#1B2A72] text-[#F3A61C] text-xs font-extrabold rounded-lg flex items-center gap-1.5 hover:bg-[#131F55] shadow-2xs self-start sm:self-auto"
                          >
                            <Plus className="w-3.5 h-3.5" /> Tambah Pilihan Baru
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {q.options.map((opt) => {
                            const isCorrect = q.correctOptionId === opt.id;
                            return (
                              <div
                                key={opt.id}
                                className={`p-3 rounded-xl border-2 transition-all space-y-2 ${
                                  isCorrect
                                    ? 'bg-emerald-50/90 border-emerald-500 shadow-xs ring-1 ring-emerald-400'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {/* BULATAN HURUF YANG DILINGKARI (RADIO BUTTON KUNCI BENAR) */}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setQuestions(
                                        questions.map((item) =>
                                          item.id === q.id ? { ...item, correctOptionId: opt.id } : item
                                        )
                                      )
                                    }
                                    className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-transform active:scale-90 flex-shrink-0 border-2 ${
                                      isCorrect
                                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
                                        : 'bg-white text-slate-700 border-slate-400 hover:border-[#1B2A72] hover:bg-slate-100'
                                    }`}
                                    title={isCorrect ? 'Ini KUNCI BENAR' : `Klik untuk menetapkan [${opt.id}] sebagai KUNCI BENAR`}
                                  >
                                    {isCorrect ? (
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    ) : (
                                      opt.id
                                    )}
                                  </button>

                                  {/* Input Teks Pilihan */}
                                  <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) =>
                                      setQuestions(
                                        questions.map((item) =>
                                          item.id === q.id
                                            ? {
                                                ...item,
                                                options: item.options?.map((o) =>
                                                  o.id === opt.id ? { ...o, text: e.target.value } : o
                                                ),
                                              }
                                            : item
                                        )
                                      )
                                    }
                                    placeholder={`Teks pilihan jawaban ${opt.id}...`}
                                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:bg-white font-medium text-slate-900"
                                  />

                                  {/* Upload Gambar ke Opsi Ini */}
                                  <button
                                    type="button"
                                    onClick={() => triggerUpload(q.id, opt.id)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition-colors ${
                                      opt.image
                                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                                    }`}
                                    title="Upload gambar/diagram untuk pilihan ini"
                                  >
                                    <Upload className="w-3 h-3 text-[#1B2A72]" />
                                    <span className="hidden sm:inline">
                                      {opt.image ? 'Ganti Foto' : '+ Foto Opsi'}
                                    </span>
                                  </button>

                                  {/* Badge Kunci Jawaban */}
                                  {isCorrect ? (
                                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Kunci Benar
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setQuestions(
                                          questions.map((item) =>
                                            item.id === q.id ? { ...item, correctOptionId: opt.id } : item
                                          )
                                        )
                                      }
                                      className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 px-2 py-1 hover:bg-slate-100 rounded"
                                    >
                                      Set Kunci
                                    </button>
                                  )}

                                  {/* Hapus Opsi */}
                                  {q.options && q.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveOptionFromQuestion(q.id, opt.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                      title="Hapus opsi ini"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>

                                {/* Preview Gambar Opsi jika ada */}
                                {opt.image && (
                                  <div className="ml-12 p-2 bg-slate-50 rounded-lg border border-slate-200 inline-flex items-center gap-3">
                                    <img
                                      src={opt.image}
                                      alt={`Gambar opsi ${opt.id}`}
                                      className="w-20 h-16 object-cover rounded border border-slate-300 shadow-2xs"
                                    />
                                    <div className="text-[11px]">
                                      <span className="text-slate-800 font-bold block">
                                        Gambar Diagram Opsi [{opt.id}]
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setQuestions(
                                            questions.map((item) =>
                                              item.id === q.id
                                                ? {
                                                    ...item,
                                                    options: item.options?.map((o) =>
                                                      o.id === opt.id ? { ...o, image: undefined } : o
                                                    ),
                                                  }
                                                : item
                                            )
                                          )
                                        }
                                        className="text-rose-600 hover:underline font-bold mt-0.5"
                                      >
                                        Hapus Gambar Ini
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ============================================================== */}
                    {/* FORMAT SOAL 2: PILIHAN GANDA KOMPLEKS (>1 JAWABAN BENAR) */}
                    {/* ============================================================== */}
                    {q.type === 'pilihan_ganda_kompleks' && q.options && (
                      <div className="space-y-3 pt-3 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                          <div>
                            <span className="text-xs font-black text-amber-900 block">
                              Pilihan Ganda Kompleks (Centang SEMUA pernyataan yang BENAR):
                            </span>
                            <span className="text-[11px] text-slate-600 font-medium">
                              Siswa dapat mencentang lebih dari satu pilihan yang benar sesuai standar asesmen AKM.
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddOptionToQuestion(q.id)}
                            className="px-3 py-1.5 bg-amber-600 text-white text-xs font-extrabold rounded-lg flex items-center gap-1.5 hover:bg-amber-700 shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" /> Tambah Pilihan Baru
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {q.options.map((opt) => {
                            const isChecked = q.correctOptionIds?.includes(opt.id);
                            return (
                              <div
                                key={opt.id}
                                className={`p-3 rounded-xl border-2 transition-all space-y-2 ${
                                  isChecked
                                    ? 'bg-amber-50/90 border-amber-500 shadow-xs ring-1 ring-amber-400'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {/* KOTAK CENTANG KUNCI BENAR */}
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      const current = q.correctOptionIds || [];
                                      const updated = current.includes(opt.id)
                                        ? current.filter((id) => id !== opt.id)
                                        : [...current, opt.id];
                                      setQuestions(
                                        questions.map((item) =>
                                          item.id === q.id ? { ...item, correctOptionIds: updated } : item
                                        )
                                      );
                                    }}
                                    className="w-5 h-5 text-amber-600 rounded cursor-pointer"
                                  />

                                  <span className="font-black text-xs text-slate-800 w-5">{opt.id}.</span>

                                  <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) =>
                                      setQuestions(
                                        questions.map((item) =>
                                          item.id === q.id
                                            ? {
                                                ...item,
                                                options: item.options?.map((o) =>
                                                  o.id === opt.id ? { ...o, text: e.target.value } : o
                                                ),
                                              }
                                            : item
                                        )
                                      )
                                    }
                                    placeholder={`Pernyataan ${opt.id}...`}
                                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:bg-white font-medium text-slate-900"
                                  />

                                  <button
                                    type="button"
                                    onClick={() => triggerUpload(q.id, opt.id)}
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1"
                                  >
                                    <Upload className="w-3 h-3 text-amber-700" />
                                    <span className="hidden sm:inline">Foto Opsi</span>
                                  </button>

                                  {isChecked && (
                                    <span className="text-[10px] font-black text-amber-900 bg-amber-200 px-2.5 py-1 rounded-full">
                                      Kunci Benar
                                    </span>
                                  )}

                                  {q.options && q.options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveOptionFromQuestion(q.id, opt.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ============================================================== */}
                    {/* FORMAT SOAL 3: MENJODOHKAN (MATCHING PAIRS) */}
                    {/* ============================================================== */}
                    {q.type === 'menjodohkan' && q.matchingPairs && (
                      <div className="space-y-3 pt-3 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                          <div>
                            <span className="text-xs font-black text-emerald-900 block">
                              Menjodohkan Pasangan (Premis Kolom Kiri & Pasangan Kolom Kanan):
                            </span>
                            <span className="text-[11px] text-slate-600 font-medium">
                              Siswa akan menghubungkan premis dengan jawaban pasangannya.
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = [
                                ...q.matchingPairs!,
                                { left: `Premis ${q.matchingPairs!.length + 1}`, right: `Pasangan ${q.matchingPairs!.length + 1}` },
                              ];
                              setQuestions(
                                questions.map((item) =>
                                  item.id === q.id ? { ...item, matchingPairs: updated } : item
                                )
                              );
                            }}
                            className="px-3 py-1.5 bg-emerald-700 text-white text-xs font-extrabold rounded-lg flex items-center gap-1.5 hover:bg-emerald-800"
                          >
                            <Plus className="w-3.5 h-3.5" /> Tambah Pasangan
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.matchingPairs.map((pair, pIdx) => (
                            <div
                              key={pIdx}
                              className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-2 relative"
                            >
                              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                                <span>Premis {pIdx + 1} (Kolom Kiri):</span>
                                {q.matchingPairs && q.matchingPairs.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = q.matchingPairs!.filter((_, i) => i !== pIdx);
                                      setQuestions(
                                        questions.map((item) =>
                                          item.id === q.id ? { ...item, matchingPairs: updated } : item
                                        )
                                      );
                                    }}
                                    className="text-slate-400 hover:text-rose-600"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                value={pair.left}
                                onChange={(e) => {
                                  const updated = q.matchingPairs!.map((item, i) =>
                                    i === pIdx ? { ...item, left: e.target.value } : item
                                  );
                                  setQuestions(
                                    questions.map((item) =>
                                      item.id === q.id ? { ...item, matchingPairs: updated } : item
                                    )
                                  );
                                }}
                                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold text-slate-800"
                              />

                              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1B2A72] pt-1">
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                                <span>Pasangan Benar (Kolom Kanan):</span>
                              </div>
                              <input
                                type="text"
                                value={pair.right}
                                onChange={(e) => {
                                  const updated = q.matchingPairs!.map((item, i) =>
                                    i === pIdx ? { ...item, right: e.target.value } : item
                                  );
                                  setQuestions(
                                    questions.map((item) =>
                                      item.id === q.id ? { ...item, matchingPairs: updated } : item
                                    )
                                  );
                                }}
                                className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg font-black text-emerald-950"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ============================================================== */}
                    {/* FORMAT SOAL 4: DRAG AND DROP */}
                    {/* ============================================================== */}
                    {q.type === 'drag_drop' && q.dragItems && (
                      <div className="space-y-3 pt-3 border-t border-slate-200">
                        <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200">
                          <span className="text-xs font-black text-purple-900 block">
                            Drag & Drop Interaktif (Siswa menyeret label ke kotak sasaran):
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium">
                            Tentukan kata kunci dan kotak sasaran targetnya:
                          </span>
                        </div>

                        <div className="space-y-2">
                          {q.dragItems.map((item, dIdx) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl bg-purple-50/40 border border-purple-200 flex flex-col sm:flex-row items-center gap-3"
                            >
                              <span className="w-7 h-7 rounded-lg bg-purple-800 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                                {dIdx + 1}
                              </span>

                              <input
                                type="text"
                                value={item.text}
                                onChange={(e) => {
                                  const updated = q.dragItems!.map((d) =>
                                    d.id === item.id ? { ...d, text: e.target.value } : d
                                  );
                                  setQuestions(
                                    questions.map((qItem) =>
                                      qItem.id === q.id ? { ...qItem, dragItems: updated } : qItem
                                    )
                                  );
                                }}
                                placeholder="Label yang dapat diseret siswa..."
                                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
                              />

                              <span className="text-xs text-slate-600 font-bold">➔ Pasangan Kotak:</span>

                              <select
                                value={item.targetId}
                                onChange={(e) => {
                                  const updated = q.dragItems!.map((d) =>
                                    d.id === item.id ? { ...d, targetId: e.target.value } : d
                                  );
                                  setQuestions(
                                    questions.map((qItem) =>
                                      qItem.id === q.id ? { ...qItem, dragItems: updated } : qItem
                                    )
                                  );
                                }}
                                className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-black text-purple-900"
                              >
                                {q.dragTargets?.map((t) => (
                                  <option key={t.id} value={t.id}>
                                    {t.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ============================================================== */}
                    {/* FORMAT SOAL 5: BENAR / SALAH (TRUE / FALSE) */}
                    {/* ============================================================== */}
                    {q.type === 'benar_salah' && q.statements && (
                      <div className="space-y-3 pt-3 border-t border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-rose-50/70 p-3 rounded-xl border border-rose-200">
                          <div>
                            <span className="text-xs font-black text-rose-900 block">
                              Matriks Evaluasi Benar / Salah:
                            </span>
                            <span className="text-[11px] text-slate-600 font-medium">
                              Tentukan nilai kebenaran tiap pernyataan untuk kunci jawaban:
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              const newId = `s${q.statements!.length + 1}`;
                              const updated = [
                                ...q.statements!,
                                { id: newId, statement: `Pernyataan nomor ${q.statements!.length + 1}...`, isTrue: true },
                              ];
                              setQuestions(
                                questions.map((item) =>
                                  item.id === q.id ? { ...item, statements: updated } : item
                                )
                              );
                            }}
                            className="px-3 py-1.5 bg-rose-700 text-white text-xs font-extrabold rounded-lg flex items-center gap-1.5 hover:bg-rose-800"
                          >
                            <Plus className="w-3.5 h-3.5" /> Tambah Pernyataan
                          </button>
                        </div>

                        <div className="space-y-2">
                          {q.statements.map((stmt) => (
                            <div
                              key={stmt.id}
                              className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                            >
                              <input
                                type="text"
                                value={stmt.statement}
                                onChange={(e) => {
                                  const updated = q.statements!.map((s) =>
                                    s.id === stmt.id ? { ...s, statement: e.target.value } : s
                                  );
                                  setQuestions(
                                    questions.map((qItem) =>
                                      qItem.id === q.id ? { ...qItem, statements: updated } : qItem
                                    )
                                  );
                                }}
                                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-900"
                              />

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Kunci:</span>
                                <div className="inline-flex rounded-lg border border-slate-300 overflow-hidden shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = q.statements!.map((s) =>
                                        s.id === stmt.id ? { ...s, isTrue: true } : s
                                      );
                                      setQuestions(
                                        questions.map((qItem) =>
                                          qItem.id === q.id ? { ...qItem, statements: updated } : qItem
                                        )
                                      );
                                    }}
                                    className={`px-3 py-1 text-xs font-black transition-colors ${
                                      stmt.isTrue ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    BENAR
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = q.statements!.map((s) =>
                                        s.id === stmt.id ? { ...s, isTrue: false } : s
                                      );
                                      setQuestions(
                                        questions.map((qItem) =>
                                          qItem.id === q.id ? { ...qItem, statements: updated } : qItem
                                        )
                                      );
                                    }}
                                    className={`px-3 py-1 text-xs font-black transition-colors ${
                                      !stmt.isTrue ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    SALAH
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PEMBAHASAN MATERI / EXPLANATION */}
                    <div className="pt-3 border-t border-slate-100">
                      <label className="text-xs font-extrabold text-slate-700 block mb-1">
                        Pembahasan & Kunci Referensi Materi:
                      </label>
                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) =>
                          setQuestions(
                            questions.map((item) =>
                              item.id === q.id ? { ...item, explanation: e.target.value } : item
                            )
                          )
                        }
                        placeholder="Tuliskan alasan/pembahasan materi agar siswa memahami konsep setelah ujian..."
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium italic"
                      />
                    </div>

                  </div>
                );
              })}

              {/* NAVIGASI SEBELUMNYA / BERIKUTNYA UNTUK MODE FOKUS */}
              {viewMode === 'single' && (
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={activeQuestionIndex === 0}
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl disabled:opacity-40 shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" /> Soal Sebelumnya
                  </button>

                  <span className="text-xs font-extrabold text-slate-600">
                    Halaman {activeQuestionIndex + 1} dari {questions.length} Butir Soal
                  </span>

                  <button
                    type="button"
                    disabled={activeQuestionIndex === questions.length - 1}
                    onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1B2A72] hover:bg-[#131F55] text-white font-bold text-xs rounded-xl disabled:opacity-40 shadow-xs"
                  >
                    <span>Soal Berikutnya</span> <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* ================= TAB FORM TUGAS PRAKTIK ================= */
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Judul Tugas Praktik</label>
                <input
                  type="text"
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="Contoh: Praktik 1 - Konfigurasi Router Gateway"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Petunjuk Praktik</label>
                <textarea
                  rows={4}
                  value={asgInstructions}
                  onChange={(e) => setAsgInstructions(e.target.value)}
                  placeholder="Langkah kerja pengerjaan tugas..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nilai Maksimum</label>
                  <input
                    type="number"
                    value={asgMaxScore}
                    onChange={(e) => setAsgMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-1.5 font-bold bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Batas Pengumpulan</label>
                  <input
                    type="datetime-local"
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 font-bold bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ============================================================== */}
        {/* FOOTER MODAL DENGAN TOMBOL SIMULASI LANGSUNG DAN SIMPAN */}
        {/* ============================================================== */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
            >
              Tutup
            </button>

            {activeTab === 'quiz' && (
              <button
                type="button"
                onClick={handleRunSimulation}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Uji Coba Kuis Ini (Simulasi Siswa)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'quiz') handleSubmitQuiz('Draf');
                else {
                  onSaveAssignment({
                    id: Date.now(),
                    title: asgTitle || 'Tugas Baru',
                    course: currentCourseName,
                    instructions: asgInstructions,
                    maxScore: asgMaxScore,
                    dueDate: asgDueDate.replace('T', ', '),
                    allowLate: asgAllowLate,
                    status: 'Draf',
                    type: 'assignment',
                  });
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" /> Simpan Draf
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeTab === 'quiz') handleSubmitQuiz('Terbit');
                else {
                  onSaveAssignment({
                    id: Date.now(),
                    title: asgTitle || 'Tugas Baru',
                    course: currentCourseName,
                    instructions: asgInstructions,
                    maxScore: asgMaxScore,
                    dueDate: asgDueDate.replace('T', ', '),
                    allowLate: asgAllowLate,
                    status: 'Terbit',
                    type: 'assignment',
                  });
                  onClose();
                }
              }}
              className="flex items-center gap-2 px-5 py-2 bg-[#1B2A72] hover:bg-[#131F55] text-white font-black text-xs rounded-xl shadow-md transition-transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-[#F3A61C]" />
              <span>Terbitkan Soal AKM Sekarang</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
