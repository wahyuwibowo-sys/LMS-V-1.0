import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Plus,
  KeyRound,
  CheckCircle2,
  Copy,
  Share2,
  Sparkles,
  BookOpen,
  Users,
  Hash,
  Palette,
  RefreshCw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { UserRole } from './Navbar';

export interface ClassChannel {
  id: string;
  name: string;
  unread: boolean;
}

export interface ClassItem {
  id: string;
  name: string;
  teacher: string;
  members: number;
  color: string;
  initials: string;
  code?: string;
  grade?: string;
  department?: string;
  subject?: string;
  channels: ClassChannel[];
}

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  onAddClass: (newClass: ClassItem) => void;
  existingClasses: ClassItem[];
}

const COLOR_OPTIONS = [
  { id: 'bg-[#1B2A72]', name: 'Biru Navy SMKN 1 Sidayu', preview: 'bg-[#1B2A72]' },
  { id: 'bg-[#F3A61C]', name: 'Emas Kuning SMK', preview: 'bg-[#F3A61C]' },
  { id: 'bg-[#4DA8DA]', name: 'Cyan Teknologi', preview: 'bg-[#4DA8DA]' },
  { id: 'bg-[#1E8449]', name: 'Hijau Emerald', preview: 'bg-[#1E8449]' },
  { id: 'bg-[#6C3483]', name: 'Ungu Indigo', preview: 'bg-[#6C3483]' },
  { id: 'bg-[#B03A2E]', name: 'Merah Marun', preview: 'bg-[#B03A2E]' },
];

const PRESET_SUBJECTS = [
  'Pemrograman Web & Perangkat Bergerak',
  'Administrasi Infrastruktur Jaringan (AIJ)',
  'Administrasi Sistem Jaringan (ASJ)',
  'Teknologi Jaringan Berbasis Luas (WAN)',
  'Pemeliharaan Mesin Kendaraan Ringan',
  'Desain Komunikasi Visual & Multimedia',
  'Informatika & Literasi Digital',
  'Projek Kreatif dan Kewirausahaan (PKK)',
];

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  onAddClass,
  existingClasses,
}) => {
  // Tab: 'create' (Guru/Admin) atau 'join' (Siswa/Umum)
  const [activeTab, setActiveTab] = useState<'create' | 'join'>(
    activeRole === 'Siswa' ? 'join' : 'create'
  );

  // Form State Buat Kelas
  const [className, setClassName] = useState('X TKJ 3 - Pemrograman Web');
  const [subject, setSubject] = useState('Pemrograman Web & Perangkat Bergerak');
  const [grade, setGrade] = useState('X');
  const [department, setDepartment] = useState('TKJ (Teknik Komputer & Jaringan)');
  const [teacherName, setTeacherName] = useState(
    activeRole === 'Guru' ? 'Wahyu Wibowo, S.Pd.' : 'Bapak/Ibu Guru Pengampu'
  );
  const [membersCount, setMembersCount] = useState(36);
  const [selectedColor, setSelectedColor] = useState('bg-[#1B2A72]');
  const [classCode, setClassCode] = useState(() => 'SMK-TKJ-' + Math.floor(1000 + Math.random() * 9000));
  const [description, setDescription] = useState(
    'Ruang kolaborasi pembelajaran materi pemrograman web, diskusi proyek, penugasan, dan simulasi CBT AKM.'
  );

  // Channel checklist
  const [channels, setChannels] = useState([
    { id: 'general', name: 'Umum (General)', checked: true, required: true },
    { id: 'materi', name: 'Modul & Materi Ajar', checked: true, required: false },
    { id: 'tugas', name: 'Tugas Praktik & Proyek', checked: true, required: false },
    { id: 'tanya-jawab', name: 'Tanya Jawab & Bantuan', checked: true, required: false },
    { id: 'diskusi-kelompok', name: 'Ruang Diskusi Kelompok', checked: false, required: false },
  ]);

  // Form State Gabung Kelas
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinError, setJoinError] = useState('');
  const [createdSuccessClass, setCreatedSuccessClass] = useState<ClassItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Generate initials from class name
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleRegenerateCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = department.includes('TKJ')
      ? 'SMK-TKJ'
      : department.includes('RPL')
      ? 'SMK-RPL'
      : department.includes('TKR')
      ? 'SMK-TKR'
      : 'SMK-DKV';
    setClassCode(`${prefix}-${randomNum}`);
  };

  const handleToggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id && !c.required ? { ...c, checked: !c.checked } : c))
    );
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    const selectedChannelsList: ClassChannel[] = channels
      .filter((c) => c.checked)
      .map((c) => ({
        id: c.id,
        name: c.name,
        unread: false,
      }));

    const newClass: ClassItem = {
      id: `class-${Date.now()}`,
      name: className.trim(),
      teacher: teacherName,
      members: membersCount,
      color: selectedColor,
      initials: getInitials(className),
      code: classCode,
      grade,
      department,
      subject,
      channels: selectedChannelsList,
    };

    onAddClass(newClass);
    setCreatedSuccessClass(newClass);
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = joinCodeInput.trim().toUpperCase();
    if (!cleanCode) {
      setJoinError('Silakan masukkan Kode Kelas dari Guru.');
      return;
    }

    // Check if code matches an existing class
    const found = existingClasses.find(
      (c) => c.code?.toUpperCase() === cleanCode || c.id.toUpperCase() === cleanCode
    );

    if (found) {
      onAddClass(found);
      setCreatedSuccessClass(found);
      setJoinError('');
    } else {
      // Simulate auto-joining a valid SMK class
      const simulatedClass: ClassItem = {
        id: `class-joined-${Date.now()}`,
        name: `Kelas Bergabung (${cleanCode})`,
        teacher: 'Guru Pengampu SMKN 1 Sidayu',
        members: 36,
        color: 'bg-[#1B2A72]',
        initials: 'KB',
        code: cleanCode,
        channels: [
          { id: 'general', name: 'Umum (General)', unread: false },
          { id: 'materi', name: 'Modul & Materi Ajar', unread: true },
          { id: 'tugas', name: 'Tugas Praktik & Proyek', unread: false },
        ],
      };
      onAddClass(simulatedClass);
      setCreatedSuccessClass(simulatedClass);
      setJoinError('');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* ================= MODAL HEADER ================= */}
        <div className="bg-gradient-to-r from-[#0F1A4A] via-[#1B2A72] to-[#16235F] text-white p-5 flex items-center justify-between border-b border-[#2B3F9F] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F3A61C] text-[#0F1A4A] shadow-md">
              <GraduationCap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-[#F3A61C] px-2 py-0.5 rounded">
                  SMKN 1 SIDAYU
                </span>
                <span className="text-[10px] text-slate-300">T.P. 2026/2027</span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white">
                {createdSuccessClass
                  ? 'Kelas Berhasil Disimpan & Siap Digunakan'
                  : 'Menu Tambah Kelas & Gabung Tim'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ================= SUCCESS STATE VIEW ================= */}
        {createdSuccessClass ? (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-center flex-1">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                {activeTab === 'create' ? 'Kelas Baru Berhasil Dibuat!' : 'Berhasil Bergabung ke Kelas!'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Kelas sudah ditambahkan ke daftar ruang kerja tim Microsoft Teams Anda dan siap digunakan untuk berbagi materi, obrolan, dan kuis AKM CBT.
              </p>
            </div>

            {/* Kartu Pratinjau Kelas */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 max-w-md mx-auto flex items-center gap-4 text-left shadow-xs">
              <div
                className={`w-12 h-12 rounded-xl ${createdSuccessClass.color} text-white font-black text-base flex items-center justify-center shadow-md flex-shrink-0`}
              >
                {createdSuccessClass.initials}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-sm text-slate-900 truncate">
                  {createdSuccessClass.name}
                </h4>
                <p className="text-xs text-slate-600 truncate mt-0.5">
                  Pengampu: {createdSuccessClass.teacher}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                  <span>{createdSuccessClass.members} Siswa</span>
                  <span>•</span>
                  <span>{createdSuccessClass.channels.length} Saluran Aktif</span>
                </div>
              </div>
            </div>

            {/* Bagikan Kode Kelas ke Siswa */}
            {createdSuccessClass.code && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto text-left space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#F3A61C]" />
                    Kode Akses Gabung Siswa:
                  </span>
                  <span className="text-[10px] bg-amber-200/70 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                    Bagikan ke WhatsApp
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-amber-300 rounded-lg px-3 py-2 font-mono font-black text-lg text-slate-900 text-center tracking-wider">
                    {createdSuccessClass.code}
                  </div>
                  <button
                    onClick={() => handleCopyCode(createdSuccessClass.code!)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#1B2A72] text-white rounded-lg text-xs font-bold hover:bg-[#131F55] transition-colors shadow-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedCode ? 'Tersalin!' : 'Salin'}
                  </button>
                </div>
                <p className="text-[11px] text-amber-800">
                  Siswa cukup membuka menu <b>"Gabung Kelas"</b> dan mengetik kode di atas untuk otomatis terdaftar.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setCreatedSuccessClass(null);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-[#1B2A72] hover:bg-[#131F55] text-white font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2"
              >
                <span>Buka Ruang Kelas Sekarang</span>
                <ArrowRight className="w-4 h-4 text-[#F3A61C]" />
              </button>
            </div>
          </div>
        ) : (
          /* ================= MAIN FORM TABS ================= */
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* TAB SELECTOR: Buat Kelas vs Gabung Kelas */}
            <div className="flex border-b border-slate-200 bg-slate-50 flex-shrink-0">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                  activeTab === 'create'
                    ? 'border-[#1B2A72] text-[#1B2A72] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Plus className="w-4 h-4 text-[#1B2A72]" />
                <span>Buat Kelas Baru (Guru & Admin)</span>
              </button>

              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-colors border-b-2 ${
                  activeTab === 'join'
                    ? 'border-[#1B2A72] text-[#1B2A72] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <KeyRound className="w-4 h-4 text-[#F3A61C]" />
                <span>Gabung Kelas dengan Kode (Siswa)</span>
              </button>
            </div>

            {/* TAB BODY: 1. BUAT KELAS BARU */}
            {activeTab === 'create' ? (
              <form onSubmit={handleCreateSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
                {/* Nama Kelas & Inisial Preview */}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl ${selectedColor} text-white font-black text-xl flex items-center justify-center shadow-md flex-shrink-0`}
                    title="Pratinjau Avatar Kelas"
                  >
                    {getInitials(className) || 'KL'}
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      Nama Kelas & Rombel <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="Contoh: X TKJ 1 - Pemrograman Web"
                      className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B2A72]"
                    />
                    <p className="text-[11px] text-slate-400">
                      Gunakan format Tingkat, Jurusan, dan Rombel agar mudah dikenali siswa.
                    </p>
                  </div>
                </div>

                {/* Tingkat, Jurusan & Mata Pelajaran */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800">Tingkat Kelas</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 mt-1 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B2A72]"
                    >
                      <option value="X">Kelas X (Sepuluh)</option>
                      <option value="XI">Kelas XI (Sebelas)</option>
                      <option value="XII">Kelas XII (Dua Belas)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800">Jurusan / Program Keahlian</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 mt-1 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B2A72]"
                    >
                      <option value="TKJ (Teknik Komputer & Jaringan)">TKJ (Teknik Komputer & Jaringan)</option>
                      <option value="RPL (Rekayasa Perangkat Lunak)">RPL (Rekayasa Perangkat Lunak)</option>
                      <option value="TKR (Teknik Kendaraan Ringan)">TKR (Teknik Kendaraan Ringan)</option>
                      <option value="DKV (Desain Komunikasi Visual)">DKV (Desain Komunikasi Visual)</option>
                      <option value="Umum (Muatan Nasional)">Umum (Muatan Nasional / Agama / Bhs)</option>
                    </select>
                  </div>
                </div>

                {/* Mata Pelajaran */}
                <div>
                  <label className="text-xs font-bold text-slate-800">Mata Pelajaran</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: Pemrograman Web & Perangkat Bergerak"
                    className="w-full text-xs font-semibold px-3 py-2 mt-1 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B2A72]"
                  />
                  {/* Preset quick pills */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {PRESET_SUBJECTS.slice(0, 4).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setSubject(p)}
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guru Pengampu & Estimasi Siswa */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800">Guru Pengampu</label>
                    <input
                      type="text"
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 mt-1 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B2A72]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-800">Kapasitas / Siswa Terdaftar</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={membersCount}
                      onChange={(e) => setMembersCount(Number(e.target.value))}
                      className="w-full text-xs font-semibold px-3 py-2 mt-1 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B2A72]"
                    />
                  </div>
                </div>

                {/* Pilihan Warna Tema Kelas */}
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-[#1B2A72]" />
                    Warna Aksen Kartu Tim Kelas
                  </label>
                  <div className="flex items-center gap-2 mt-1.5">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedColor(c.id)}
                        className={`w-7 h-7 rounded-lg ${c.preview} transition-transform ${
                          selectedColor === c.id ? 'scale-110 ring-2 ring-offset-2 ring-[#1B2A72]' : 'opacity-80 hover:opacity-100'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Otomatis Generate Kode Kelas */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F1A4A] flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-[#F3A61C]" />
                      Kode Gabung Siswa Otomatis:
                    </span>
                    <button
                      type="button"
                      onClick={handleRegenerateCode}
                      className="text-[11px] text-[#1B2A72] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <RefreshCw className="w-3 h-3" /> Acak Ulang
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={classCode}
                      className="flex-1 text-sm font-mono font-black text-[#1B2A72] bg-white border border-blue-300 rounded px-2.5 py-1.5 text-center"
                    />
                  </div>
                  <p className="text-[11px] text-blue-900">
                    Siswa dapat bergabung mandiri dengan memasukkan kode unik ini di perangkat mereka.
                  </p>
                </div>

                {/* Checklist Saluran / Channels Bawaan */}
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-500" />
                    Saluran (Channels) Otomatis di Dalam Tim Kelas:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                    {channels.map((ch) => (
                      <label
                        key={ch.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          ch.checked
                            ? 'bg-blue-50/60 border-blue-200 font-semibold text-[#1B2A72]'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={ch.required}
                          checked={ch.checked}
                          onChange={() => handleToggleChannel(ch.id)}
                          className="rounded text-[#1B2A72] focus:ring-[#1B2A72]"
                        />
                        <span className="truncate">{ch.name}</span>
                        {ch.required && (
                          <span className="text-[9px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded ml-auto">
                            Wajib
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Deskripsi Kelas */}
                <div>
                  <label className="text-xs font-bold text-slate-800">Deskripsi / Sasaran Pembelajaran</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs font-normal px-3 py-2 mt-1 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1B2A72]"
                  />
                </div>

                {/* Tombol Simpan */}
                <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#1B2A72] hover:bg-[#131F55] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-[#F3A61C]" />
                    <span>Buat Kelas Sekarang</span>
                  </button>
                </div>
              </form>
            ) : (
              /* TAB BODY: 2. GABUNG KELAS DENGAN KODE */
              <form onSubmit={handleJoinSubmit} className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center">
                    <KeyRound className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Masukkan Kode Kelas dari Guru
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Mintalah 6-8 digit kode kelas kepada Bapak/Ibu Guru pengampu mata pelajaran untuk masuk ke ruang kelas ini.
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <label className="text-xs font-bold text-slate-800">Kode Akses Kelas:</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={joinCodeInput}
                      onChange={(e) => {
                        setJoinCodeInput(e.target.value.toUpperCase());
                        setJoinError('');
                      }}
                      placeholder="Contoh: SMK-TKJ-7492 atau SMK-TKJ-101"
                      className="w-full text-center tracking-widest font-mono font-black text-lg px-4 py-3 rounded-xl border border-slate-300 uppercase focus:outline-none focus:ring-2 focus:ring-[#1B2A72]"
                    />
                  </div>

                  {joinError && (
                    <p className="text-xs font-bold text-rose-600 text-center animate-shake">
                      {joinError}
                    </p>
                  )}

                  {/* Contoh Kode Cepat untuk Uji Coba */}
                  <div className="pt-2 text-center">
                    <span className="text-[11px] text-slate-500">Coba kode cepat: </span>
                    <button
                      type="button"
                      onClick={() => setJoinCodeInput('SMK-TKJ-101')}
                      className="text-[11px] font-bold text-[#1B2A72] hover:underline"
                    >
                      SMK-TKJ-101
                    </button>
                    <span className="text-slate-400 mx-1.5">•</span>
                    <button
                      type="button"
                      onClick={() => setJoinCodeInput('SMK-TKJ-8821')}
                      className="text-[11px] font-bold text-[#1B2A72] hover:underline"
                    >
                      SMK-TKJ-8821
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#F3A61C] hover:bg-[#E09311] text-[#0F1A4A] text-xs font-black shadow-md flex items-center gap-2 transition-transform active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Gabung ke Kelas</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
