// pages/medecins/CreateMedecin.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MedecinFormData } from '../../types/medecin';
import medecinService from '../../services/medecinService';
import MedecinForm from '../../components/medecins/MedecinForm';

const CreateMedecin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: MedecinFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newMedecin = await medecinService.createMedecin(data);
      
      // Afficher un message de succès
      alert('Médecin créé avec succès !');
      
      // Rediriger vers la liste des médecins
      navigate('/medecins');
      
    } catch (err: any) {
      console.error('Erreur lors de la création:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création du médecin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/medecins');
  };

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
            <span className="text-gray-600">Nouveau médecin</span>
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
                  Erreur de création
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <MedecinForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default CreateMedecin;