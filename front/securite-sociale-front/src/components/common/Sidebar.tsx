import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import MediaPreview from '../common/MediaPreview';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { authState, logout } = useAuth();
  const { user } = authState;

  return (
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 shadow-lg`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Profil utilisateur */}
        {user && (
          <div className="mb-6 text-center">
            <MediaPreview
              src="/assets/default-profile.png"
              onUpload={(file) => console.log('Upload:', file)}
            />
            <p className="mt-2 font-semibold">{user.username}</p>
            <Link to="/profile" className="text-sm text-gray-300 hover:text-white">
              Paramètres
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <Link
            to="/"
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
            onClick={toggleSidebar}
          >
            Accueil
          </Link>
          {user?.roles.includes('ROLE_ADMIN') && (
            <Link
              to="/assures"
              className="block p-2 rounded hover:bg-gray-700 transition-colors"
              onClick={toggleSidebar}
            >
              Assurés
            </Link>
          )}
          <Link
            to="/medecins"
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
            onClick={toggleSidebar}
          >
            Médecins
          </Link>
          <Link
            to="/consultations"
            className="block p-2 rounded hover:bg-gray-700 transition-colors"
            onClick={toggleSidebar}
          >
            Consultations
          </Link>
          {user && (
            <Link
              to={`/dashboard/${user.roles.includes('ROLE_ADMIN') ? 'admin' : user.roles.includes('ROLE_ASSURE') ? 'assure' : 'medecin'}`}
              className="block p-2 rounded hover:bg-gray-700 transition-colors"
              onClick={toggleSidebar}
            >
              Tableau de bord
            </Link>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;