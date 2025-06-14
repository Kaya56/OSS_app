import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* À propos */}
        <div>
          <h3 className="text-lg font-semibold mb-4">À propos</h3>
          <p className="text-gray-400">
            Sécurité Sociale : Votre plateforme pour gérer assurés, médecins et consultations.
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="hover:text-gray-300 transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gray-300 transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/legal" className="hover:text-gray-300 transition-colors">
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-gray-400">Email : support@securitesociale.fr</p>
          <p className="text-gray-400">Téléphone : +33 1 23 45 67 89</p>
          <div className="flex space-x-4 mt-4">
            <a href="https://twitter.com" className="hover:text-gray-300 transition-colors">
              <FaTwitter className="text-xl" />
            </a>
            <a href="https://facebook.com" className="hover:text-gray-300 transition-colors">
              <FaFacebook className="text-xl" />
            </a>
            <a href="https://linkedin.com" className="hover:text-gray-300 transition-colors">
              <FaLinkedin className="text-xl" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-gray-500 border-t border-gray-700 pt-4">
        &copy; {currentYear} Sécurité Sociale. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;