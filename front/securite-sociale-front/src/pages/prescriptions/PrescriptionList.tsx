// src/pages/prescriptions/PrescriptionList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { type Prescription, TypePrescription, TYPE_PRESCRIPTION_OPTIONS } from '../../types/prescription';
import { Role } from '../../types/auth';
import PrescriptionListComponent from '../../components/prescriptions/PrescriptionList';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import prescriptionService from '../../services/prescriptionService';
import { useAuth } from '../../hooks/useAuth';

const PrescriptionListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth().authState;
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Utilitaires pour les rôles
  const isAdmin = user?.roles?.includes(Role.ROLE_ADMIN) || false;
  const isMedecin = user?.roles?.includes(Role.ROLE_MEDECIN) || false;
  const isAssure = user?.roles?.includes(Role.ROLE_ASSURE) || false;
  const canManagePrescriptions = isAdmin || isMedecin;
  
  // Filtres
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    dateDebut: searchParams.get('dateDebut') || '',
    dateFin: searchParams.get('dateFin') || ''
  });

  useEffect(() => {
    loadPrescriptions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [prescriptions, filters]);

  const loadPrescriptions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let data: Prescription[] = [];
      
      // Charger selon le rôle de l'utilisateur
      if (!user) {
        setError("Utilisateur non authentifié");
        return;
      }

      if (isMedecin) {
        data = await prescriptionService.getPrescriptionsByMedecin(user.id);
      } else if (isAssure) {
        data = await prescriptionService.getPrescriptionsByAssure(user.id);
      } else {
        data = await prescriptionService.getAllPrescriptions();
      }
      
      setPrescriptions(data);
    } catch (err) {
      setError('Erreur lors du chargement des prescriptions');
      console.error('Erreur lors du chargement des prescriptions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...prescriptions];

    // Filtre de recherche
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(prescription => 
        prescription.consultation?.assure?.nom?.toLowerCase().includes(searchLower) ||
        prescription.consultation?.assure?.prenom?.toLowerCase().includes(searchLower) ||
        prescription.consultation?.medecin?.nom?.toLowerCase().includes(searchLower) ||
        prescription.consultation?.medecin?.prenom?.toLowerCase().includes(searchLower) ||
        prescription.detailsMedicament?.toLowerCase().includes(searchLower) ||
        prescription.specialiste?.nom?.toLowerCase().includes(searchLower) ||
        prescription.specialiste?.prenom?.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par type
    if (filters.type) {
      filtered = filtered.filter(prescription => prescription.type === filters.type);
    }

    // Filtre par date
    if (filters.dateDebut && filters.dateFin) {
      const startDate = new Date(filters.dateDebut);
      const endDate = new Date(filters.dateFin);
      
      // Ajuster la date de fin pour inclure toute la journée
      endDate.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(prescription => {
        const consultationDate = prescription.consultation?.dateConsultation 
          ? new Date(prescription.consultation.dateConsultation)
          : null;
        
        return consultationDate && consultationDate >= startDate && consultationDate <= endDate;
      });
    }

    setFilteredPrescriptions(filtered);
  };

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Mettre à jour l'URL
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) newSearchParams.set(key, val);
    });
    setSearchParams(newSearchParams);
  };

  const handleEdit = (prescription: Prescription) => {
    if (!canManagePrescriptions) {
      alert("Vous n'avez pas les permissions pour modifier cette prescription");
      return;
    }
    navigate(`/prescriptions/${prescription.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    if (!canManagePrescriptions) {
      alert("Vous n'avez pas les permissions pour supprimer cette prescription");
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette prescription ?')) {
      return;
    }

    try {
      setIsLoading(true);
      await prescriptionService.deletePrescription(id);
      await loadPrescriptions();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression de la prescription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (prescription: Prescription) => {
    navigate(`/prescriptions/${prescription.id}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      dateDebut: '',
      dateFin: ''
    });
    setSearchParams(new URLSearchParams());
  };

  // Rendu de l'état de chargement
  if (isLoading && prescriptions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-gray-600">Chargement des prescriptions...</div>
        </div>
      </div>
    );
  }

  // Rendu de l'état d'erreur
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800 font-medium">Erreur</div>
          <div className="text-red-700 mt-1">{error}</div>
          <Button
            onClick={loadPrescriptions}
            variant="primary"
            className="mt-4"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-1">
            Gestion des prescriptions médicales
          </p>
        </div>
        {canManagePrescriptions && (
          <Button
            onClick={() => navigate('/prescriptions/create')}
            variant="primary"
          >
            Nouvelle prescription
          </Button>
        )}
      </div>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            label="Rechercher"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Patient, médecin, détails..."
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les types</option>
              {TYPE_PRESCRIPTION_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Date début"
            type="date"
            value={filters.dateDebut}
            onChange={(e) => handleFilterChange('dateDebut', e.target.value)}
          />

          <Input
            label="Date fin"
            type="date"
            value={filters.dateFin}
            onChange={(e) => handleFilterChange('dateFin', e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <Button
            onClick={clearFilters}
            variant="secondary"
            size="sm"
          >
            Effacer les filtres
          </Button>
          <div className="text-sm text-gray-600">
            {filteredPrescriptions.length} prescription(s) trouvée(s)
            {filteredPrescriptions.length !== prescriptions.length && 
              ` sur ${prescriptions.length} au total`
            }
          </div>
        </div>
      </div>

      {/* Liste des prescriptions */}
      <div className="bg-white rounded-lg shadow-sm border">
        {prescriptions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500 mb-4">Aucune prescription trouvée</div>
            {canManagePrescriptions && (
              <Button
                onClick={() => navigate('/prescriptions/create')}
                variant="primary"
              >
                Créer votre première prescription
              </Button>
            )}
          </div>
        ) : (
          <PrescriptionListComponent
            prescriptions={filteredPrescriptions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            isLoading={isLoading}
            showActions={canManagePrescriptions}
            showPatientInfo={!isAssure}
            showDoctorInfo={!isMedecin}
          />
        )}
      </div>
    </div>
  );
};

export default PrescriptionListPage;