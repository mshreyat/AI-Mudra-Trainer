import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { UserProfile } from '../auth/UserProfile';

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          {/* Logo icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-600 flex items-center justify-center shadow-sm">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="font-display font-semibold text-xl tracking-tight text-white">
            MudraSense<span className="text-primary-400">.ai</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-surface-300">
          <Link to="/practice" className="hover:text-white transition-colors">Practice</Link>
          <Link to="/library" className="hover:text-white transition-colors">Library</Link>
          <Link to="/progress" className="hover:text-white transition-colors">Progress</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/practice">
            <Button size="sm">Start Practice</Button>
          </Link>
          <UserProfile />
        </div>
      </div>
    </header>
  );
};
