import { Link } from 'react-router-dom';
import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
          PM0
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/discovery"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            + New Project
          </Link>
          <Link
            to="/projects"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/scenarios"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Scenarios
          </Link>
          <UserMenu />
        </nav>
      </div>
    </header>
  );
}

