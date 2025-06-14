import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaUser, FaBars, FaTimes, FaBell, FaMoon, FaSun } from 'react-icons/fa';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const { authState, logout } = useAuth();
  const { user } = authState;
  
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications] = useState(3);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="relative bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white sticky top-0 z-50 shadow-2xl backdrop-blur-sm border-b border-white/10">
      {/* Effet de glassmorphisme */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md"></div>
      
      <div className="relative py-4 px-6 flex justify-between items-center">
        {/* Logo avec animation */}
        <div className="text-2xl font-bold transform hover:scale-105 transition-all duration-300">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="/assets/logo.png" 
                alt="Logo" 
                className="h-10 w-auto drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300" 
              />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
            </div>
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-extrabold tracking-wide">
              Sécurité Sociale
            </span>
          </Link>
        </div>

        {/* Navigation pour grands écrans avec effets modernes */}
        <nav className="hidden md:flex space-x-8">
          {[
            { to: '/', label: 'Accueil' },
            ...(user?.roles.includes('ROLE_ADMIN') ? [{ to: '/assures', label: 'Assurés' }] : []),
            { to: '/medecins', label: 'Médecins' },
            { to: '/consultations', label: 'Consultations' }
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative px-4 py-2 rounded-full hover:bg-white/10 transition-all duration-300 group"
            >
              <span className="relative z-10 font-medium">{item.label}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
            </Link>
          ))}
        </nav>

        {/* Actions utilisateur */}
        <div className="flex items-center space-x-4">
          {/* Notifications avec animation */}
          {user && (
            <div className="relative group">
              <button className="p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110">
                <FaBell className="text-xl animate-pulse" aria-label="Notifications" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce shadow-lg">
                    {notifications}
                  </span>
                )}
              </button>
              {/* Tooltip */}
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {notifications} notifications
              </div>
            </div>
          )}

          {/* Bouton mode sombre avec animation */}
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
            aria-label={isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"}
          >
            <div className="relative">
              {isDarkMode ? (
                <FaSun className="text-yellow-300 drop-shadow-glow animate-spin-slow" />
              ) : (
                <FaMoon className="text-blue-200 drop-shadow-glow" />
              )}
            </div>
          </button>

          {/* Profil utilisateur avec design moderne */}
          {user ? (
            <div className="flex items-center space-x-3 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <FaUser className="text-sm text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <span className="hidden md:inline font-medium text-white/90">{user.username}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium flex items-center space-x-2"
            >
              <FaUser className="text-sm" />
              <span>Connexion</span>
            </Link>
          )}

          {/* Menu hamburger avec animation */}
          <button
            className="md:hidden p-3 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <div className="relative w-6 h-6">
              <div className={`absolute inset-0 transition-all duration-300 ${isSidebarOpen ? 'rotate-180' : 'rotate-0'}`}>
                {isSidebarOpen ? (
                  <FaTimes className="text-xl animate-spin" />
                ) : (
                  <FaBars className="text-xl" />
                )}
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Barre de progression décorative */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
    </header>
  );
};

export default Header;