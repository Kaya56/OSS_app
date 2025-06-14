// src/components/prescriptions/PrescriptionList.tsx
import React, { useState } from 'react';
import { type Prescription, TypePrescription, getTypePrescriptionLabel } from '../../types/prescription';
import Button from '../common/Button';
import Table, { type Column } from '../common/Table';

interface PrescriptionListProps {
  prescriptions: Prescription[];
  onEdit?: (prescription: Prescription) => void;
  onDelete?: (id: number) => void;
  onView?: (prescription: Prescription) => void;
  isLoading?: boolean;
  showActions?: boolean;
  showPatientInfo?: boolean;
  showDoctorInfo?: boolean;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  onEdit,
  onDelete,
  onView,
  isLoading = false,
  showActions = true,
  showPatientInfo = true,
  showDoctorInfo = true
}) => {
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<number[]>([]);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrescriptions(prescriptions.map(p => p.id!));
    } else {
      setSelectedPrescriptions([]);
    }
  };

  const handleSelectPrescription = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedPrescriptions(prev => [...prev, id]);
    } else {
      setSelectedPrescriptions(prev => prev.filter(prescId => prescId !== id));
    }
  };

  const getTypeChipColor = (type: TypePrescription) => {
    switch (type) {
      case TypePrescription.MEDICAMENT:
        return 'bg-blue-100 text-blue-800';
      case TypePrescription.EXAMEN:
        return 'bg-green-100 text-green-800';
      case TypePrescription.SOIN:
        return 'bg-yellow-100 text-yellow-800';
      case TypePrescription.CONSULTATION_SPECIALISTE:
        return 'bg-purple-100 text-purple-800';
      case TypePrescription.AUTRE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedPrescriptions = React.useMemo(() => {
    if (!sortField) return prescriptions;

    return [...prescriptions].sort((a, b) => {
      let aValue: any = a[sortField as keyof Prescription];
      let bValue: any = b[sortField as keyof Prescription];

      // Handle nested properties
      if (sortField === 'patientName') {
        aValue = `${a.consultation?.assure?.nom} ${a.consultation?.assure?.prenom}`;
        bValue = `${b.consultation?.assure?.nom} ${b.consultation?.assure?.prenom}`;
      } else if (sortField === 'doctorName') {
        aValue = `${a.consultation?.medecin?.nom} ${a.consultation?.medecin?.prenom}`;
        bValue = `${b.consultation?.medecin?.nom} ${b.consultation?.medecin?.prenom}`;
      } else if (sortField === 'consultationDate') {
        aValue = a.consultation?.dateConsultation;
        bValue = b.consultation?.dateConsultation;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [prescriptions, sortField, sortDirection]);

// Exemple pour Prescription :
    const columns: Column<Prescription>[] = [
    ...(showActions ? [{
        key: 'select',
        header: (
        <input
            type="checkbox"
            checked={selectedPrescriptions.length === prescriptions.length && prescriptions.length > 0}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="rounded"
        />
        ),
        render: (prescription: Prescription) => (
        <input
            type="checkbox"
            checked={selectedPrescriptions.includes(prescription.id!)}
            onChange={(e) => handleSelectPrescription(prescription.id!, e.target.checked)}
            className="rounded"
        />
        )
    }] : []),
    {
        key: 'type',
        header: 'Type',
        sortable: true,
        render: (prescription: Prescription) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeChipColor(prescription.type)}`}>
            {getTypePrescriptionLabel(prescription.type)}
        </span>
        )
    },
    ...(showPatientInfo ? [{
        key: 'patientName',
        header: 'Patient',
        sortable: true,
        render: (prescription: Prescription) => (
        <div>
            <div className="font-medium">
            {prescription.consultation?.assure?.nom} {prescription.consultation?.assure?.prenom}
            </div>
        </div>
        )
    }] : []),
    ...(showDoctorInfo ? [{
        key: 'doctorName',
        header: 'Médecin',
        sortable: true,
        render: (prescription: Prescription) => (
        <div>
            <div className="font-medium">
            Dr {prescription.consultation?.medecin?.nom} {prescription.consultation?.medecin?.prenom}
            </div>
        </div>
        )
    }] : []),
    {
        key: 'consultationDate',
        header: 'Date consultation',
        sortable: true,
        render: (prescription: Prescription) => (
        <div className="text-sm text-gray-600">
            {prescription.consultation?.dateConsultation ? 
            new Date(prescription.consultation.dateConsultation).toLocaleDateString('fr-FR') : 
            'N/A'
            }
        </div>
        )
    },
    {
        key: 'details',
        header: 'Détails',
        render: (prescription: Prescription) => (
        <div className="max-w-xs">
            {prescription.type === TypePrescription.CONSULTATION_SPECIALISTE && prescription.specialiste ? (
            <div className="text-sm">
                <div className="font-medium">
                Dr {prescription.specialiste.nom} {prescription.specialiste.prenom}
                </div>
                <div className="text-gray-600">{prescription.specialiste.specialite}</div>
            </div>
            ) : prescription.detailsMedicament ? (
            <div className="text-sm text-gray-600 truncate" title={prescription.detailsMedicament}>
                {prescription.detailsMedicament}
            </div>
            ) : (
            <span className="text-gray-400 text-sm">Aucun détail</span>
            )}
        </div>
        )
    },
    ...(showActions ? [{
        key: 'actions',
        header: 'Actions',
        render: (prescription: Prescription) => (
        <div className="flex gap-2">
            {onView && (
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onView(prescription)}
            >
                Voir
            </Button>
            )}
            {onEdit && (
            <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(prescription)}
            >
                Modifier
            </Button>
            )}
            {onDelete && (
            <Button
                variant="danger"
                size="sm"
                onClick={() => {
                if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prescription ?')) {
                    onDelete(prescription.id!);
                }
                }}
            >
                Supprimer
            </Button>
            )}
        </div>
        )
    }] : [])
    ];


  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-600">Chargement des prescriptions...</div>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg mb-2">Aucune prescription trouvée</div>
        <div className="text-gray-400">Il n'y a aucune prescription à afficher pour le moment.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions groupées */}
      {showActions && selectedPrescriptions.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedPrescriptions.length} prescription(s) sélectionnée(s)
            </span>
            <div className="flex gap-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedPrescriptions.length} prescription(s) ?`)) {
                    selectedPrescriptions.forEach(id => onDelete && onDelete(id));
                    setSelectedPrescriptions([]);
                  }
                }}
              >
                Supprimer sélectionnées
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{prescriptions.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {prescriptions.filter(p => p.type === TypePrescription.MEDICAMENT).length}
            </div>
            <div className="text-sm text-gray-600">Médicaments</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {prescriptions.filter(p => p.type === TypePrescription.EXAMEN).length}
            </div>
            <div className="text-sm text-gray-600">Examens</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {prescriptions.filter(p => p.type === TypePrescription.SOIN).length}
            </div>
            <div className="text-sm text-gray-600">Soins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {prescriptions.filter(p => p.type === TypePrescription.CONSULTATION_SPECIALISTE).length}
            </div>
            <div className="text-sm text-gray-600">Spécialistes</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={sortedPrescriptions}
        onSort={handleSort}
        sortField={sortField}
        sortDirection={sortDirection}
      />
    </div>
  );
};

export default PrescriptionList;
