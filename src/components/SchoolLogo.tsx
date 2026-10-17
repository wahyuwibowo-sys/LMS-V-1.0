import React, { useState } from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'navbar';
  alt?: string;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size = 'navbar',
  alt = 'Logo Resmi SMKN 1 Sidayu',
}) => {
  const [hasError, setHasError] = useState(false);

  // Ukuran sesuai instruksi:
  // Navbar: tinggi maksimal 42 piksel
  // Dashboard: tinggi maksimal 90 piksel
  // Login: tinggi maksimal 100 piksel
  const sizeClasses = {
    sm: 'h-8 w-auto max-h-[32px]',
    navbar: 'h-10 w-auto max-h-[42px]',
    md: 'h-14 w-auto max-h-[60px]',
    lg: 'h-20 w-auto max-h-[90px]',
  };

  if (hasError) {
    // Sesuai aturan: "Sediakan logo cadangan hanya jika file logo tidak ditemukan.
    // Logo cadangan cukup berupa kotak sederhana bertuliskan 'LMS', bukan logo sekolah baru."
    return (
      <div
        className={`flex items-center justify-center bg-[#1B2A72] text-[#F3A61C] border border-[#F3A61C]/40 rounded font-bold text-xs px-2 py-1 select-none shadow-sm ${className}`}
        style={{ minWidth: '38px', height: '36px' }}
        title="LMS SMKN 1 SIDAYU"
      >
        LMS
      </div>
    );
  }

  return (
    <img
      src="/static/images/logo_sekolah.svg"
      alt={alt}
      onError={() => setHasError(true)}
      className={`object-contain transition-transform duration-200 hover:scale-105 ${sizeClasses[size]} ${className}`}
      style={{ objectFit: 'contain' }}
    />
  );
};
