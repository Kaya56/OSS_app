// src/pages/prescriptions/PrescriptionDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type Prescription, getTypePrescriptionLabel } from '../../types/prescription';
import Button from '../../components/common/Button';
import prescriptionService from '../../services/prescriptionService';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types/auth';

const PrescriptionDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth().authState;
  
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPrescription();
    }
  }, [id]);

  const loadPrescription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await prescriptionService.getPrescriptionById(Number(id));
      setPrescription(data);
    } catch (err) {
      setError('Erreur lors du chargement de la prescription');
      console.error('Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/prescriptions/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prescription ?')) {
      try {
        await prescriptionService.deletePrescription(Number(id));
        navigate('/prescriptions', { 
          state: { message: 'Prescription supprimée avec succès' }
        });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la prescription');
      }
    }
  };

  const getTypeChipColor = (type: string) => {
    switch (type) {
      case 'MEDICAMENT':
        return 'bg-blue-100 text-blue-800';
      case 'EXAMEN':
        return 'bg-green-100 text-green-800';
      case 'SOIN':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONSULTATION_SPECIALISTE':
        return 'bg-purple-100 text-purple-800';
      case 'AUTRE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center">
          <div className="text-gray-600">Chargement de la prescription...</div>
        </div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error || 'Prescription non trouvée'}</div>
          <Button
            onClick={() => navigate('/prescriptions')}
            variant="primary"
            className="mt-4"
          >
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Prescription #{prescription.id}
            </h1>
            <p className="text-gray-600 mt-1">
              Détails de la prescription médicale
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/prescriptions')}
              variant="secondary"
            >
              Retour à la liste
            </Button>
            {(user?.roles?.includes(Role.ROLE_ADMIN) || user?.roles?.includes(Role.ROLE_MEDECIN)) && (
              <>
                <Button
                  onClick={handleEdit}
                  variant="primary"
                >
                  Modifier
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="danger"
                >
                  Supprimer
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations principales */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Informations générales
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type de prescription
                </label>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getTypeChipColor(prescription.type)}`}>
                  {getTypePrescriptionLabel(prescription.type)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de consultation
                </label>
                <p className="mt-1 text-gray-900">
                  {prescription.consultation?.dateConsultation ? 
                    new Date(prescription.consultation.dateConsultation).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'
                  }
                </p>
              </div>

              {prescription.detailsMedicament && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {prescription.type === 'MEDICAMENT' ? 'Détails du médicament' : 'Détails'}
                  </label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {prescription.detailsMedicament}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Informations patient */}
          {prescription.consultation?.assure && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informations patient
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <p className="mt-1 text-gray-900">
                    {prescription.consultation.assure.nom} {prescription.consultation.assure.prenom}
                  </p>
                </div>

                {/* Ajoutez d'autres informations patient si disponibles */}
              </div>
            </div>
          )}

          {/* Informations médecin */}
          {prescription.consultation?.medecin && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Médecin prescripteur
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <p className="mt-1 text-gray-900">
                    Dr {prescription.consultation.medecin.nom} {prescription.consultation.medecin.prenom}
                  </p>
                </div>

                {/* Ajoutez d'autres informations médecin si disponibles */}
              </div>
            </div>
          )}

          {/* Informations spécialiste */}
          {prescription.specialiste && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Spécialiste recommandé
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom complet
                  </label>
                  <p className="mt-1 text-gray-900">
                    Dr {prescription.specialiste.nom} {prescription.specialiste.prenom}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Spécialité
                  </label>
                  <p className="mt-1 text-gray-900">
                    {prescription.specialiste.specialite}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section d'actions supplémentaires */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => navigate(`/consultations/${prescription.consultationId}`)}
              variant="secondary"
            >
              Voir la consultation
            </Button>
            
            {prescription.type === 'CONSULTATION_SPECIALISTE' && prescription.specialiste && (
              <Button
                onClick={() => navigate(`/medecins/${prescription.specialiste?.id}`)}
                variant="secondary"
              >
                Voir le spécialiste
              </Button>
            )}
            
            <Button
              onClick={() => window.print()}
              variant="secondary"
            >
              Imprimer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailPage;