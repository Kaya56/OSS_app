// pages/medecins/MedecinDetails.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Medecin } from '../../types/medecin';
import medecinService from '../../services/medecinService';
import Button from '../../components/common/Button';

const MedecinDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [medecin, setMedecin] = useState<Medecin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadMedecin(parseInt(id));
    }
  }, [id]);

  const loadMedecin = async (medecinId: number) => {
    try {
      setLoading(true);
      const data = await medecinService.getMedecinById(medecinId);
      setMedecin(data);
      setError(null);
    } catch (err: any) {
      console.error('Erreur lors du chargement:', err);
      setError('Médecin non trouvé');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!medecin || !window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      await medecinService.deleteMedecin(medecin.id);
      alert('Médecin supprimé avec succès !');
      navigate('/medecins');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du médecin');
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatGenre = (genre: string) => {
    return genre === 'M' ? 'Masculin' : 'Féminin';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateNaissance: string) => {
    const birth = new Date(dateNaissance);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du médecin...</p>
        </div>
      </div>
    );
  }

  if (error || !medecin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Médecin non trouvé</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/medecins')}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate('/medecins')}
              className="text-blue-600 hover:text-blue-800"
            >
              Médecins
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{medecin.nom} {medecin.prenom}</span>
          </div>
        </nav>

        {/* En-tête avec actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">
                  {medecin.nom.charAt(0)}{medecin.prenom?.charAt(0) || ''}
                </span>
              </div>
              
              {/* Informations principales */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dr. {medecin.nom} {medecin.prenom}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    medecin.specialisation 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {medecin.specialisation || 'Médecin généraliste'}
                  </span>
                  <span className="text-gray-500">
                    ID: {medecin.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button
                variant="primary"
                onClick={() => navigate(`/medecins/${medecin.id}/edit`)}
              >
                Modifier
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={deleteLoading}
                isLoading={deleteLoading}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations personnelles
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Nom</label>
                  <p className="mt-1 text-sm text-gray-900">{medecin.nom}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Prénom</label>
                  <p className="mt-1 text-sm text-gray-900">{medecin.prenom || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Genre</label>
                  <p className="mt-1 text-sm text-gray-900">{formatGenre(medecin.genre)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Âge</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {calculateAge(medecin.dateNaissance)} ans
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Date de naissance</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(medecin.dateNaissance)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Adresse</label>
                <p className="mt-1 text-sm text-gray-900">{medecin.adresse}</p>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <div className="mt-1 flex items-center">
                  <p className="text-sm text-gray-900">{medecin.email}</p>
                  <a
                    href={`mailto:${medecin.email}`}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">Téléphone</label>
                <div className="mt-1 flex items-center">
                  <p className="text-sm text-gray-900">{medecin.telephone}</p>
                  <a
                    href={`tel:${medecin.telephone}`}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informations professionnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">Spécialisation</label>
                <p className="mt-1 text-sm text-gray-900">
                  {medecin.specialisation || 'Médecine générale'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Type de praticien</label>
                <p className="mt-1 text-sm text-gray-900">
                  {medecin.specialisation ? 'Spécialiste' : 'Généraliste'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions supplémentaires */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Actions rapides
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(`/consultations/create?medecin=${medecin.id}`)}
            >
              Nouvelle consultation
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/consultations?medecin=${medecin.id}`)}
            >
              Voir les consultations
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/assures?medecin-traitant=${medecin.id}`)}
            >
              Patients suivis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedecinDetails;