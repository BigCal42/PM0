import { Link } from 'react-router-dom';
import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="bg-dark-card border-b border-dark-border backdrop-blur-xl bg-opacity-80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-400 transition-all">
          PM0
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/discovery"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:scale-105 transform"
          >
            + New Project
          </Link>
          <Link
            to="/projects"
            className="text-dark-text-muted hover:text-dark-text transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/scenarios"
            className="text-dark-text-muted hover:text-dark-text transition-colors"
          >
            Scenarios
          </Link>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}

