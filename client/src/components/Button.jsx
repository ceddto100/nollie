import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  variant = 'primary',
  size = 'md',
  to,
  href,
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-300
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    transform active:scale-95
  `;

  const variants = {
    primary: `
      bg-brand-primary hover:bg-blue-700
      text-white
      shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
      hover:-translate-y-0.5
      focus-visible:ring-brand-primary
    `,
    secondary: `
      bg-brand-secondary hover:bg-indigo-700
      text-white
      shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40
      hover:-translate-y-0.5
      focus-visible:ring-brand-secondary
    `,
    ghost: `
      bg-gray-800/60 hover:bg-gray-700/80
      text-gray-100 hover:text-white
      border border-gray-700 hover:border-gray-600
      focus-visible:ring-gray-500
    `,
    danger: `
      bg-red-600 hover:bg-red-700
      text-white
      shadow-lg shadow-red-500/20 hover:shadow-red-500/40
      hover:-translate-y-0.5
      focus-visible:ring-red-500
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedStyles = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  if (to) {
    return (
      <Link to={to} className={combinedStyles} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedStyles} onClick={onClick} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedStyles} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
