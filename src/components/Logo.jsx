import { Link } from 'react-router-dom';

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="logo">
      <span className="logo-mark">
        <svg viewBox="0 0 64 64" width="20" height="20">
          <path d="M18 42c0-12 9-22 26-24-1 15-10 26-22 26" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
          <circle cx="20" cy="46" r="4.5" fill="#fff" />
        </svg>
      </span>
      <span className="logo-text">Nutri<span>Fit</span></span>
    </Link>
  );
}
