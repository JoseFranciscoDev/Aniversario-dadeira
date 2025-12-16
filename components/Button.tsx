import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '',
  ...props 
}) => {
  // Styles updated for muted tones
  const baseStyle = "relative px-8 py-3 rounded-sm font-sans font-bold uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const variants = {
    // Primary: Spirit Teal glow
    primary: "bg-surface-dark text-spirit-teal border border-spirit-teal hover:bg-spirit-teal hover:text-void-black shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.6)]",
    // Secondary: Ancient Gold
    secondary: "bg-transparent border border-ancient-gold text-ancient-gold hover:bg-ancient-gold hover:text-void-black"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sincronizando...
          </>
        ) : children}
      </span>
    </button>
  );
};