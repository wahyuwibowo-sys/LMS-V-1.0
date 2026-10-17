import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Award,
  Layers,
  CheckSquare,
  ArrowRightLeft,
  Move,
  ToggleLeft,
  RotateCcw,
  Check,
  Eye,
  Info
} from 'lucide-react';
import { AKMQuestion } from './CreateAssignmentQuizModal';

interface AKMQuizPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
  courseName: string;
  durationMinutes: number;
  questions: AKMQuestion[];
}

export const AKMQuizPlayerModal: React.FC<AKMQuizPlayerProps> = ({
  isOpen,
  onClose,
  quizTitle,
  courseName,
  durationMinutes = 45,
  questions,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [scoreResult, setScoreResult] = useState<number | null>(null);
  const [showReview, setShowReview] = useState(false);

  // Student Answers State:
  // 1. Pilihan Ganda: { [qId]: 'A' }
  // 2. PG Kompleks: { [qId]: ['A', 'C'] }
  // 3. Menjodohkan: { [qId]: { [premiseIdx]: 'selectedRight' } }
  // 4. Drag Drop: { [qId]: { [targetId]: 'selectedText' } }
  // 5. Benar Salah: { [qId]: { [statementId]: true/false } }
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [doubtfulList, setDoubtfulList] = useState<number[]>([]);

  // State untuk Interaksi Drag & Drop Tangan / Klik
  const [activeSelectedChip, setActiveSelectedChip] = useState<string | null>(null);
  const [draggedChipText, setDraggedChipText] = useState<string | null>(null);

  // Reset state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setCurrentIdx(0);
      setTimeLeft(durationMinutes * 60);
      setIsFinished(false);
      setScoreResult(null);
      setShowReview(false);
      setActiveSelectedChip(null);
    }
  }, [isOpen, durationMinutes]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || isFinished) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isFinished]);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx] || questions[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Toggle Ragu-Ragu
  const handleToggleDoubtful = (qId: number) => {
    setDoubtfulList((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // Hitung Nilai Akhir Otomatis
  const handleFinishExam = () => {
    let earnedPoints = 0;
    let totalPossible = 0;

    questions.forEach((q) => {
      const qPts = Number(q.points) || 20;
      totalPossible += qPts;
      const userAns = answers[q.id];

      if (!userAns) return;

      if (q.type === 'pilihan_ganda') {
        if (userAns === q.correctOptionId) {
          earnedPoints += qPts;
        }
      } else if (q.type === 'pilihan_ganda_kompleks') {
        const correctSet = q.correctOptionIds || [];
        const userSet = (userAns as string[]) || [];
        if (
          correctSet.length === userSet.length &&
          correctSet.every((val) => userSet.includes(val))
        ) {
          earnedPoints += qPts;
        }
      } else if (q.type === 'menjodohkan') {
        let correctMatches = 0;
        q.matchingPairs?.forEach((pair, idx) => {
          if (userAns[idx] === pair.right) correctMatches++;
        });
        if (q.matchingPairs && q.matchingPairs.length > 0) {
          earnedPoints += (correctMatches / q.matchingPairs.length) * qPts;
        }
      } else if (q.type === 'drag_drop') {
        let correctTargets = 0;
        q.dragItems?.forEach((item) => {
          if (userAns[item.targetId] === item.text) correctTargets++;
        });
        if (q.dragItems && q.dragItems.length > 0) {
          earnedPoints += (correctTargets / q.dragItems.length) * qPts;
        }
      } else if (q.type === 'benar_salah') {
        let correctStmts = 0;
        q.statements?.forEach((stmt) => {
          if (userAns[stmt.id] === stmt.isTrue) correctStmts++;
        });
        if (q.statements && q.statements.length > 0) {
          earnedPoints += (correctStmts / q.statements.length) * qPts;
        }
      }
    });

    const finalScore = Math.round((earnedPoints / (totalPossible || 1)) * 100);
    setScoreResult(finalScore);
    setIsFinished(true);
  };

  // Helper Cek apakah soal sudah dijawab
  const isQuestionAnswered = (q: AKMQuestion) => {
    const ans = answers[q.id];
    if (ans === undefined || ans === null) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    if (typeof ans === 'object') return Object.keys(ans).length > 0;
    return true;
  };

  const answeredCount = questions.filter(isQuestionAnswered).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in select-none font-sans">
      <div className="bg-[#F8FAFC] w-full max-w-5xl h-[94vh] rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden">
        
        {/* ============================================================== */}
        {/* TOP CBT HEADER DENGAN LOGO & TIMER HITUNG MUNDUR */}
        {/* ============================================================== */}
        <header className="px-5 py-3.5 bg-[#0F1A4A] text-white flex items-center justify-between border-b border-[#2B3F9F] flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#F3A61C] text-[#0F1A4A] text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-xs">
                CBT AKM SMKN 1 SIDAYU
              </span>
              <span className="text-xs text-[#4DA8DA] font-semibold">{courseName}</span>
            </div>
            <h1 className="text-sm sm:text-base font-extrabold text-white mt-0.5">{quizTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer Hitung Mundur */}
            {!isFinished && (
              <div className="flex items-center gap-2 bg-[#1B2A72] px-3.5 py-1.5 rounded-xl border border-[#F3A61C]/50 text-[#F3A61C] font-mono font-black text-sm shadow-inner">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              title="Keluar dari Ujian"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* ============================================================== */}
        {/* HASIL SELESAI UJIAN CBT */}
        {/* ============================================================== */}
        {isFinished ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-white overflow-y-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-lg ring-8 ring-emerald-50">
              <Award className="w-10 h-10" />
            </div>

            <span className="bg-blue-100 text-[#1B2A72] text-xs font-black uppercase px-3 py-1 rounded-full mb-2">
              Ujian CBT AKM Telah Diselesaikan
            </span>

            <h2 className="text-2xl font-black text-slate-900 mb-1">
              Hasil Asesmen Kompetensi Siswa
            </h2>
            <p className="text-xs text-slate-500 max-w-md mb-5">
              Nilai Anda telah dihitung otomatis dan tersimpan aman di sistem akademik SMKN 1 Sidayu.
            </p>

            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 mb-6 w-full max-w-md shadow-xs">
              <span className="text-xs font-black text-slate-500 uppercase">Nilai Perolehan Ujian:</span>
              <p className="text-5xl font-black text-[#1B2A72] mt-1">{scoreResult}</p>
              <span className="text-xs font-bold text-slate-500">Skala 0 - 100</span>

              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-600 font-semibold">Batas KKM: 75</span>
                <span
                  className={`font-black px-3 py-1 rounded-full ${
                    (scoreResult || 0) >= 75
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {(scoreResult || 0) >= 75 ? 'KOMPETEN (LULUS)' : 'BELUM KOMPETEN'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsFinished(false);
                  setTimeLeft(durationMinutes * 60);
                  setAnswers({});
                  setDoubtfulList([]);
                  setCurrentIdx(0);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi Pengerjaan Ujian
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1B2A72] hover:bg-[#131F55] text-white font-extrabold text-xs rounded-xl shadow-md transition-transform active:scale-95"
              >
                Kembali ke Kelas
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* AREA PENGERJAAN SOAL AKTIF & KANVAS INTERAKTIF CBT */
          /* ============================================================== */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* KANVAS SOAL (KIRI) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Header Nomor Soal & Tipe Soal */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#1B2A72] text-[#F3A61C] font-black text-xs px-3 py-1.5 rounded-lg shadow-2xs">
                      SOAL NO. {currentIdx + 1} DARI {questions.length}
                    </span>
                    <span className="text-[11px] font-bold text-slate-700 uppercase bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                      Model: {currentQ.type.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-500">
                    Bobot: <strong>{currentQ.points || 20} Poin</strong>
                  </span>
                </div>

                {/* Stimulus Gambar jika ada */}
                {currentQ.questionImage && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block max-w-full">
                    <img
                      src={currentQ.questionImage}
                      alt="Stimulus Soal AKM"
                      className="max-h-64 rounded-lg object-contain shadow-xs border border-slate-300"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block italic text-center">
                      Gambar Wacana / Infografis Stimulus Soal
                    </span>
                  </div>
                )}

                {/* Teks Pertanyaan */}
                <p className="text-sm font-bold text-slate-900 leading-relaxed whitespace-pre-line">
                  {currentQ.text}
                </p>

                {/* ============================================================== */}
                {/* 1. TIPE SOAL: PILIHAN GANDA (OPSI BERLINGKAR RESMI CBT ANBK) */}
                {/* ============================================================== */}
                {currentQ.type === 'pilihan_ganda' && currentQ.options && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                      <Info className="w-4 h-4 text-[#1B2A72]" />
                      <span>
                        Pilih <strong>satu</strong> jawaban yang paling tepat dengan mengklik bulatan opsi jawaban:
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {currentQ.options.map((opt) => {
                        const isSelected = answers[currentQ.id] === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => setAnswers({ ...answers, [currentQ.id]: opt.id })}
                            className={`p-3.5 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50/90 border-[#1B2A72] text-[#1B2A72] shadow-sm ring-2 ring-[#1B2A72]/20 font-bold'
                                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              {/* BULATAN OPSI JAWABAN (RADIO CIRCLE DENGAN TITIK TENGAH) */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all border-2 flex-shrink-0 ${
                                  isSelected
                                    ? 'bg-[#1B2A72] text-[#F3A61C] border-[#1B2A72] shadow-md scale-105'
                                    : 'bg-white text-slate-700 border-slate-400'
                                }`}
                              >
                                {opt.id}
                              </div>

                              <span className="text-xs sm:text-sm font-semibold leading-relaxed">
                                {opt.text}
                              </span>
                            </div>

                            {/* Gambar Opsi jika ada */}
                            {opt.image && (
                              <div className="p-1 bg-white rounded-lg border border-slate-200 shadow-2xs flex-shrink-0 self-start sm:self-auto ml-11 sm:ml-0">
                                <img
                                  src={opt.image}
                                  alt={`Diagram opsi ${opt.id}`}
                                  className="max-h-24 max-w-[180px] rounded object-contain"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* 2. TIPE SOAL: PILIHAN GANDA KOMPLEKS (CENTANG >1 JAWABAN) */}
                {/* ============================================================== */}
                {currentQ.type === 'pilihan_ganda_kompleks' && currentQ.options && (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900">
                      💡 Petunjuk Soal AKM: Anda dapat mencentang <strong>LEBIH DARI SATU</strong> pernyataan yang menurut Anda benar.
                    </div>

                    <div className="space-y-2.5">
                      {currentQ.options.map((opt) => {
                        const currentSelected = (answers[currentQ.id] as string[]) || [];
                        const isChecked = currentSelected.includes(opt.id);

                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              const updated = isChecked
                                ? currentSelected.filter((id) => id !== opt.id)
                                : [...currentSelected, opt.id];
                              setAnswers({ ...answers, [currentQ.id]: updated });
                            }}
                            className={`p-3.5 rounded-xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-amber-50/90 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-300'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                readOnly
                                className="w-5 h-5 text-amber-600 rounded cursor-pointer"
                              />
                              <span className="w-5 font-black text-xs text-slate-700">{opt.id}.</span>
                              <span className="text-xs sm:text-sm font-semibold">{opt.text}</span>
                            </div>

                            {opt.image && (
                              <div className="p-1 bg-white rounded-lg border border-slate-200 shadow-2xs flex-shrink-0 self-start sm:self-auto ml-8 sm:ml-0">
                                <img
                                  src={opt.image}
                                  alt={`Diagram opsi ${opt.id}`}
                                  className="max-h-24 max-w-[180px] rounded object-contain"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* 3. TIPE SOAL: MENJODOHKAN (MATCHING PAIRS) */}
                {/* ============================================================== */}
                {currentQ.type === 'menjodohkan' && currentQ.matchingPairs && (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900">
                      🔗 Pasangkanlah setiap premis di Kolom Kiri dengan pilihan jawaban di Kolom Kanan:
                    </div>

                    <div className="space-y-3">
                      {currentQ.matchingPairs.map((pair, pIdx) => {
                        const currentAns = answers[currentQ.id] || {};
                        const selectedRight = currentAns[pIdx] || '';

                        return (
                          <div
                            key={pIdx}
                            className="p-3.5 bg-slate-50 rounded-xl border-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                          >
                            <span className="text-xs sm:text-sm font-bold text-slate-900 flex-1">
                              {pIdx + 1}. {pair.left}
                            </span>

                            <div className="flex items-center gap-2">
                              <ArrowRightLeft className="w-4 h-4 text-[#1B2A72] hidden sm:block" />
                              <select
                                value={selectedRight}
                                onChange={(e) => {
                                  const updated = { ...currentAns, [pIdx]: e.target.value };
                                  setAnswers({ ...answers, [currentQ.id]: updated });
                                }}
                                className={`px-3 py-2 text-xs font-bold rounded-lg border-2 transition-all ${
                                  selectedRight
                                    ? 'bg-emerald-50 text-emerald-950 border-emerald-500 font-black ring-1 ring-emerald-300'
                                    : 'bg-white border-slate-300 text-slate-700'
                                }`}
                              >
                                <option value="">-- Pilih Pasangan Jawaban --</option>
                                {currentQ.matchingPairs?.map((item, rightIdx) => (
                                  <option key={rightIdx} value={item.right}>
                                    {item.right}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* 4. TIPE SOAL: DRAG AND DROP (DAPAT DI-DRAG ATAU KLIK SASARAN) */}
                {/* ============================================================== */}
                {currentQ.type === 'drag_drop' && currentQ.dragItems && (
                  <div className="space-y-4 pt-2">
                    <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs font-bold text-purple-900">
                      🎯 Tarik label kata kunci (Drag & Drop) atau klik label lalu klik kotak sasaran di bawah:
                    </div>

                    {/* PALET LABEL KATA KUNCI (DAPAT DISERET / DIKLIK) */}
                    <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-black text-slate-700 block mb-2 uppercase">
                        Label Kata Kunci yang Tersedia (Klik untuk memilih, lalu klik sasaran):
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {currentQ.dragItems.map((item) => {
                          const currentAns = answers[currentQ.id] || {};
                          const isAlreadyPlaced = Object.values(currentAns).includes(item.text);
                          const isChipActive = activeSelectedChip === item.text;

                          return (
                            <div
                              key={item.id}
                              draggable={!isAlreadyPlaced}
                              onDragStart={() => setDraggedChipText(item.text)}
                              onClick={() => {
                                if (!isAlreadyPlaced) {
                                  setActiveSelectedChip(isChipActive ? null : item.text);
                                }
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-black border shadow-xs flex items-center gap-2 cursor-pointer transition-all ${
                                isAlreadyPlaced
                                  ? 'bg-slate-200 text-slate-400 border-slate-300 line-through opacity-60 cursor-not-allowed'
                                  : isChipActive
                                  ? 'bg-[#F3A61C] text-[#0F1A4A] border-white ring-2 ring-[#0F1A4A] scale-105'
                                  : 'bg-[#1B2A72] hover:bg-[#131F55] text-white border-[#F3A61C]/50'
                              }`}
                            >
                              <Move className="w-3.5 h-3.5" />
                              <span>{item.text}</span>
                              {isChipActive && <Check className="w-3.5 h-3.5 text-[#0F1A4A]" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* KOTAK SASARAN TARGET DROP ZONE */}
                    <div className="space-y-3">
                      {currentQ.dragTargets?.map((t) => {
                        const currentAns = answers[currentQ.id] || {};
                        const filledText = currentAns[t.id];

                        return (
                          <div
                            key={t.id}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (draggedChipText) {
                                const updated = { ...currentAns, [t.id]: draggedChipText };
                                setAnswers({ ...answers, [currentQ.id]: updated });
                                setDraggedChipText(null);
                              }
                            }}
                            onClick={() => {
                              if (activeSelectedChip) {
                                const updated = { ...currentAns, [t.id]: activeSelectedChip };
                                setAnswers({ ...answers, [currentQ.id]: updated });
                                setActiveSelectedChip(null);
                              }
                            }}
                            className={`p-3.5 rounded-xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              filledText
                                ? 'bg-purple-50/90 border-purple-500 shadow-xs'
                                : activeSelectedChip
                                ? 'border-dashed border-[#1B2A72] bg-blue-50/50 cursor-pointer animate-pulse'
                                : 'border-dashed border-slate-300 bg-slate-50'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold text-slate-900">
                              {t.label}
                            </span>

                            <div className="flex items-center gap-2">
                              {filledText ? (
                                <div className="flex items-center gap-1.5 bg-[#1B2A72] text-[#F3A61C] px-3.5 py-1.5 rounded-xl text-xs font-black shadow-xs">
                                  <span>{filledText}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const updated = { ...currentAns };
                                      delete updated[t.id];
                                      setAnswers({ ...answers, [currentQ.id]: updated });
                                    }}
                                    className="hover:text-rose-400 p-0.5 ml-1"
                                    title="Lepaskan label ini"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400 italic">
                                  [ Tempatkan label di sini ]
                                </span>
                              )}

                              {/* Dropdown cadangan jika tidak ingin drag */}
                              <select
                                value={filledText || ''}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => {
                                  const updated = { ...currentAns, [t.id]: e.target.value };
                                  setAnswers({ ...answers, [currentQ.id]: updated });
                                }}
                                className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg font-bold text-purple-950 focus:outline-none"
                              >
                                <option value="">-- Pilih Label --</option>
                                {currentQ.dragItems?.map((item) => (
                                  <option key={item.id} value={item.text}>
                                    {item.text}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ============================================================== */}
                {/* 5. TIPE SOAL: BENAR / SALAH */}
                {/* ============================================================== */}
                {currentQ.type === 'benar_salah' && currentQ.statements && (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs font-bold text-rose-900">
                      ⚖️ Tentukan apakah setiap pernyataan di bawah ini BENAR atau SALAH:
                    </div>

                    <div className="border border-slate-300 rounded-xl overflow-hidden shadow-2xs">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0F1A4A] text-white font-bold">
                          <tr>
                            <th className="p-3">Teks Pernyataan</th>
                            <th className="p-3 text-center w-36">Jawaban Siswa</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {currentQ.statements.map((stmt) => {
                            const currentAns = answers[currentQ.id] || {};
                            const userChoice = currentAns[stmt.id];

                            return (
                              <tr key={stmt.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3 font-semibold text-slate-900 leading-relaxed">
                                  {stmt.statement}
                                </td>
                                <td className="p-3 text-center">
                                  <div className="inline-flex rounded-lg shadow-2xs border border-slate-300 overflow-hidden">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = { ...currentAns, [stmt.id]: true };
                                        setAnswers({ ...answers, [currentQ.id]: updated });
                                      }}
                                      className={`px-3 py-1.5 text-xs font-black transition-colors ${
                                        userChoice === true
                                          ? 'bg-emerald-600 text-white'
                                          : 'bg-white text-slate-700 hover:bg-slate-100'
                                      }`}
                                    >
                                      BENAR
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = { ...currentAns, [stmt.id]: false };
                                        setAnswers({ ...answers, [currentQ.id]: updated });
                                      }}
                                      className={`px-3 py-1.5 text-xs font-black transition-colors ${
                                        userChoice === false
                                          ? 'bg-rose-600 text-white'
                                          : 'bg-white text-slate-700 hover:bg-slate-100'
                                      }`}
                                    >
                                      SALAH
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>

              {/* ============================================================== */}
              {/* TOMBOL NAVIGASI CBT: SEBELUMNYA, RAGU-RAGU, BERIKUTNYA */}
              {/* ============================================================== */}
              <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 font-bold text-xs rounded-xl transition-colors shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" /> Soal Sebelumnya
                </button>

                {/* Tombol Ragu-ragu (Kuning Khas ANBK) */}
                <button
                  type="button"
                  onClick={() => handleToggleDoubtful(currentQ.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-colors border shadow-2xs ${
                    doubtfulList.includes(currentQ.id)
                      ? 'bg-amber-400 text-amber-950 border-amber-500 ring-2 ring-amber-300'
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>
                    {doubtfulList.includes(currentQ.id) ? 'Ragu-ragu (Ditandai)' : 'Ragu-ragu'}
                  </span>
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#1B2A72] hover:bg-[#131F55] text-white font-extrabold text-xs rounded-xl shadow-xs transition-transform active:scale-95"
                  >
                    <span>Soal Berikutnya</span> <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishExam}
                    className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-transform active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Selesaikan Ujian
                  </button>
                )}
              </div>

            </div>

            {/* ============================================================== */}
            {/* PANEL PALET NOMOR SOAL CBT (KANAN) */}
            {/* ============================================================== */}
            <aside className="w-full md:w-64 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-4 flex flex-col justify-between flex-shrink-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Daftar Nomor Soal:
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500">
                    {answeredCount} / {questions.length} Dijawab
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const answered = isQuestionAnswered(q);
                    const isDoubtful = doubtfulList.includes(q.id);
                    const isCurrent = idx === currentIdx;

                    let bgClass = 'bg-white text-slate-700 border-slate-300';
                    if (isDoubtful) {
                      bgClass = 'bg-amber-400 text-amber-950 font-black border-amber-500';
                    } else if (answered) {
                      bgClass = 'bg-emerald-600 text-white font-black border-emerald-700';
                    }

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIdx(idx)}
                        className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-xs font-black transition-all ${bgClass} ${
                          isCurrent ? 'ring-2 ring-[#1B2A72] ring-offset-2 scale-110 shadow-sm' : 'hover:scale-105'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Keterangan Status Warna Soal */}
                <div className="mt-5 space-y-2 text-[11px] text-slate-600 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block border border-emerald-700 shadow-2xs" />
                    <span className="font-semibold">Sudah Dijawab ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-400 inline-block border border-amber-500 shadow-2xs" />
                    <span className="font-semibold">Ragu-ragu ({doubtfulList.length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300 inline-block" />
                    <span className="font-semibold">Belum Dijawab ({questions.length - answeredCount})</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleFinishExam}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-transform active:scale-95"
                >
                  Kumpulkan Ujian Sekarang
                </button>
              </div>
            </aside>

          </div>
        )}

      </div>
    </div>
  );
};
