// pages/medecins/UpdateMedecin.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Medecin, MedecinFormData } from '../../types/medecin';
import medecinService from '../../services/medecinService';
import MedecinForm from '../../components/medecins/MedecinForm';

const UpdateMedecin: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [medecin, setMedecin] = useState<Medecin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMedecin, setLoadingMedecin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadMedecin(parseInt(id));
    }
  }, [id]);

  const loadMedecin = async (medecinId: number) => {
    try {
      setLoadingMedecin(true);
      const data = await medecinService.getMedecinById(medecinId);
      setMedecin(data);
      setError(null);
    } catch (err: any) {
      console.error('Erreur lors du chargement:', err);
      setError('Médecin non trouvé');
    } finally {
      setLoadingMedecin(false);
    }
  };

  const handleSubmit = async (data: MedecinFormData) => {
    if (!medecin) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await medecinService.updateMedecin(medecin.id, data);
      
      // Afficher un message de succès
      alert('Médecin modifié avec succès !');
      
      // Rediriger vers les détails du médecin
      navigate(`/medecins/${medecin.id}`);
      
    } catch (err: any) {
      console.error('Erreur lors de la modification:', err);
      setError(err.response?.data?.message || 'Erreur lors de la modification du médecin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (medecin) {
      navigate(`/medecins/${medecin.id}`);
    } else {
      navigate('/medecins');
    }
  };

  if (loadingMedecin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du médecin...</p>
        </div>
      </div>
    );
  }

  if (error && !medecin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Médecin non trouvé</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/medecins')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const initialData: Partial<MedecinFormData> = medecin ? {
    nom: medecin.nom,
    prenom: medecin.prenom || '',
    dateNaissance: medecin.dateNaissance,
    genre: medecin.genre,
    adresse: medecin.adresse,
    telephone: medecin.telephone,
    email: medecin.email,
    specialisation: medecin.specialisation || ''
  } : {};

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
            {medecin && (
              <>
                <button
                  onClick={() => navigate(`/medecins/${medecin.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {medecin.nom} {medecin.prenom}
                </button>
                <span className="text-gray-400">/</span>
              </>
            )}
            <span className="text-gray-600">Modifier</span>
          </div>
        </nav>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erreur de modification
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        {medecin && (
          <MedecinForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            isEdit={true}
          />
        )}
      </div>
    </div>
  );
};

export default UpdateMedecin;