import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const NotFound: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-4xl font-bold text-red-500">404 - Page non trouvée</h1>
        <p className="mt-4">La page que vous cherchez n'existe pas.</p>
        <Link to="/" className="mt-4 inline-block text-blue-500 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;