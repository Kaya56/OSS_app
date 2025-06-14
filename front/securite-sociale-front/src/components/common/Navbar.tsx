import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { authState, logout } = useAuth();
  const { user } = authState;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Sécurité Sociale
        </Link>
        <div className="space-x-4">
          {user && (
            <>
              {user.roles.includes('ROLE_ADMIN') && (
                <Link to="/assures" className="hover:underline">
                  Assurés
                </Link>
              )}
              <Link to="/medecins" className="hover:underline">
                Médecins
              </Link>
              <Link to="/consultations" className="hover:underline">
                Consultations
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Déconnexion
              </button>
            </>
          )}
          {!user && (
            <Link to="/login" className="hover:underline">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;