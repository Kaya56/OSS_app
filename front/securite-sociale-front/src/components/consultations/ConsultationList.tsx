// src/components/consultations/ConsultationList.tsx
import React, { useState, useEffect } from 'react';
import type { ConsultationDTO, ConsultationFilters } from '../../types/consultation';
import type { Assure } from '../../types/assure';
import type { Medecin } from '../../types/medecin';
import Button from '../common/Button';
import Table from '../common/Table';

interface ConsultationListProps {
  consultations: ConsultationDTO[];
  assures: Assure[];
  medecins: Medecin[];
  onEdit: (consultation: ConsultationDTO) => void;
  onDelete: (id: number) => void;
  onView: (consultation: ConsultationDTO) => void;
  onFilter: (filters: ConsultationFilters) => void;
  isLoading?: boolean;
}

export const ConsultationList: React.FC<ConsultationListProps> = ({
  consultations,
  assures,
  medecins,
  onEdit,
  onDelete,
  onView,
  onFilter,
  isLoading = false
}) => {
  const [filters, setFilters] = useState<ConsultationFilters>({
    typeConsultation: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const handleFilterChange = (field: keyof ConsultationFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  const clearFilters = () => {
    setFilters({ typeConsultation: 'all' });
  };

  const getAssureName = (assureId: number): string => {
    const assure = assures.find(a => a.id === assureId);
    return assure ? `${assure.nom} ${assure.prenom}` : 'Inconnu';
  };

  const getMedecinName = (medecinId: number): string => {
    const medecin = medecins.find(m => m.id === medecinId);
    if (!medecin) return 'Inconnu';
    return `Dr. ${medecin.nom} ${medecin.prenom}`;
  };

  const getMedecinType = (medecinId: number): string => {
    const medecin = medecins.find(m => m.id === medecinId);
    if (!medecin) return '';
    return medecin.specialisation || 'Généraliste';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      sortable: true
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (consultation: ConsultationDTO) => formatDate(consultation.date)
    },
    {
      key: 'assure',
      label: 'Assuré',
      render: (consultation: ConsultationDTO) => getAssureName(consultation.assureId)
    },
    {
      key: 'medecin',
      label: 'Médecin',
      render: (consultation: ConsultationDTO) => (
        <div>
          <div>{getMedecinName(consultation.medecinId)}</div>
          <div className="text-sm text-gray-500">{getMedecinType(consultation.medecinId)}</div>
        </div>
      )
    },
    {
      key: 'cout',
      label: 'Coût',
      sortable: true,
      render: (consultation: ConsultationDTO) => formatCurrency(consultation.cout)
    },
    {
      key: 'detailsMedical',
      label: 'Détails',
      render: (consultation: ConsultationDTO) => (
        <div className="max-w-xs">
          {consultation.detailsMedical ? (
            <span className="text-sm text-gray-600 truncate block">
              {consultation.detailsMedical}
            </span>
          ) : (
            <span className="text-sm text-gray-400 italic">Aucun détail</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (consultation: ConsultationDTO) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onView(consultation)}
          >
            Voir
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(consultation)}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(consultation.id!)}
          >
            Supprimer
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header avec bouton filtres */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Liste des consultations ({consultations.length})
        </h2>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </Button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtre par assuré */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assuré
              </label>
              <select
                value={filters.assureId || ''}
                onChange={(e) => handleFilterChange('assureId', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les assurés</option>
                {assures.map(assure => (
                  <option key={assure.id} value={assure.id}>
                    {assure.nom} {assure.prenom}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par médecin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médecin
              </label>
              <select
                value={filters.medecinId || ''}
                onChange={(e) => handleFilterChange('medecinId', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les médecins</option>
                {medecins.map(medecin => (
                  <option key={medecin.id} value={medecin.id}>
                    Dr. {medecin.nom} {medecin.prenom}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par type de consultation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de consultation
              </label>
              <select
                value={filters.typeConsultation || 'all'}
                onChange={(e) => handleFilterChange('typeConsultation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes</option>
                <option value="generaliste">Généralistes</option>
                <option value="specialiste">Spécialistes</option>
              </select>
            </div>
          </div>

          {/* Filtres par date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="datetime-local"
                value={filters.dateDebut || ''}
                onChange={(e) => handleFilterChange('dateDebut', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="datetime-local"
                value={filters.dateFin || ''}
                onChange={(e) => handleFilterChange('dateFin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Bouton pour effacer les filtres */}
          <div className="flex justify-end">
            <Button variant="secondary" onClick={clearFilters}>
              Effacer les filtres
            </Button>
          </div>
        </div>
      )}

      {/* Tableau des consultations */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : consultations.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-gray-500 text-lg">Aucune consultation trouvée</p>
              <p className="text-gray-400 text-sm mt-2">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          </div>
        ) : (
          <Table
            data={consultations}
            columns={columns}
            // className="w-full"
          />
        )}
      </div>
    </div>
  );
};