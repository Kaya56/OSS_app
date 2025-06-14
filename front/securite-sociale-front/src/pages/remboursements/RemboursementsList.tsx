import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, CreditCard, Banknote, Filter, Download, Plus, Eye, Edit, Trash2, Play, RotateCcw } from 'lucide-react';
import { MethodePaiement } from '../../types/assure';
import { StatutRemboursement } from '../../types/remboursement.types';
import { type RemboursementDTO } from '../../types/remboursement.types';

// Données de test
const mockRemboursements: RemboursementDTO[] = [
  {
    id: 1,
    consultationId: 101,
    montant: 150.50,
    methode: MethodePaiement.VIREMENT,
    statut: StatutRemboursement.EN_ATTENTE,
    dateCreation: '2024-01-15T10:30:00'
  },
  {
    id: 2,
    consultationId: 102,
    montant: 75.00,
    methode: MethodePaiement.CASH,
    statut: StatutRemboursement.TRAITE,
    dateTraitement: '2024-01-16T14:20:00',
    dateCreation: '2024-01-15T11:00:00'
  },
  {
    id: 3,
    consultationId: 103,
    montant: 200.00,
    methode: MethodePaiement.VIREMENT,
    statut: StatutRemboursement.REFUSE,
    dateCreation: '2024-01-14T09:15:00'
  }
];

// Composant Badge de statut
const StatutBadge: React.FC<{ statut: StatutRemboursement }> = ({ statut }) => {
  const getStatutConfig = (statut: StatutRemboursement) => {
    switch (statut) {
      case StatutRemboursement.EN_ATTENTE:
        return { 
          icon: Clock, 
          label: 'En attente', 
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
        };
      case StatutRemboursement.TRAITE:
        return { 
          icon: CheckCircle, 
          label: 'Traité', 
          className: 'bg-green-100 text-green-800 border-green-200' 
        };
      case StatutRemboursement.REFUSE:
        return { 
          icon: XCircle, 
          label: 'Refusé', 
          className: 'bg-red-100 text-red-800 border-red-200' 
        };
      default:
        return { 
          icon: Clock, 
          label: 'Inconnu', 
          className: 'bg-gray-100 text-gray-800 border-gray-200' 
        };
    }
  };

  const { icon: Icon, label, className } = getStatutConfig(statut);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </span>
  );
};

// Composant Badge de méthode de paiement
const MethodeBadge: React.FC<{ methode: MethodePaiement }> = ({ methode }) => {
  const getMethodeConfig = (methode: MethodePaiement) => {
    switch (methode) {
      case MethodePaiement.VIREMENT:
        return { 
          icon: CreditCard, 
          label: 'Virement', 
          className: 'bg-blue-100 text-blue-800 border-blue-200' 
        };
      case MethodePaiement.CASH:
        return { 
          icon: Banknote, 
          label: 'Espèces', 
          className: 'bg-green-100 text-green-800 border-green-200' 
        };
      default:
        return { 
          icon: CreditCard, 
          label: 'Inconnu', 
          className: 'bg-gray-100 text-gray-800 border-gray-200' 
        };
    }
  };

  const { icon: Icon, label, className } = getMethodeConfig(methode);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </span>
  );
};

// Composant principal de liste des remboursements
const RemboursementsList: React.FC = () => {
  const [remboursements] = useState<RemboursementDTO[]>(mockRemboursements);
  const [filtreStatut, setFiltreStatut] = useState<StatutRemboursement | ''>('');
  const [filtreMethode, setFiltreMethode] = useState<MethodePaiement | ''>('');
  const [selectedRemboursement, setSelectedRemboursement] = useState<RemboursementDTO | null>(null);
  const [showModal, setShowModal] = useState(false);

  const remboursemsentsFiltrés = remboursements.filter(r => {
    return (!filtreStatut || r.statut === filtreStatut) &&
           (!filtreMethode || r.methode === filtreMethode);
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMontant = (montant: number) => {
    return `${montant.toFixed(2)} €`;
  };

  const handleAction = (action: string, remboursement: RemboursementDTO) => {
    console.log(`Action: ${action} sur remboursement ${remboursement.id}`);
    // Ici vous intégreriez vos hooks d'actions
  };

  const openModal = (remboursement: RemboursementDTO) => {
    setSelectedRemboursement(remboursement);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Remboursements</h1>
          <p className="text-gray-600 mt-2">Gérez les remboursements des consultations médicales</p>
        </div>

        {/* Filtres et actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtres:</span>
            </div>
            
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value as StatutRemboursement | '')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value={StatutRemboursement.EN_ATTENTE}>En attente</option>
              <option value={StatutRemboursement.TRAITE}>Traité</option>
              <option value={StatutRemboursement.REFUSE}>Refusé</option>
            </select>

            <select
              value={filtreMethode}
              onChange={(e) => setFiltreMethode(e.target.value as MethodePaiement | '')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les méthodes</option>
              <option value={MethodePaiement.VIREMENT}>Virement</option>
              <option value={MethodePaiement.CASH}>Espèces</option>
            </select>

            <div className="ml-auto flex gap-2">
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des remboursements */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID / Consultation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date traitement
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {remboursemsentsFiltrés.map((remboursement) => (
                  <tr key={remboursement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{remboursement.id}</div>
                      <div className="text-sm text-gray-500">Consultation #{remboursement.consultationId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatMontant(remboursement.montant)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <MethodeBadge methode={remboursement.methode} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatutBadge statut={remboursement.statut} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(remboursement.dateCreation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {remboursement.dateTraitement ? formatDate(remboursement.dateTraitement) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(remboursement)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {remboursement.statut === StatutRemboursement.EN_ATTENTE && (
                          <>
                            <button
                              onClick={() => handleAction('traiter', remboursement)}
                              className="text-green-600 hover:text-green-900"
                              title="Traiter"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAction('refuser', remboursement)}
                              className="text-red-600 hover:text-red-900"
                              title="Refuser"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        
                        {remboursement.statut === StatutRemboursement.TRAITE && (
                          <button
                            onClick={() => handleAction('annuler', remboursement)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Annuler traitement"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleAction('modifier', remboursement)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleAction('supprimer', remboursement)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {remboursemsentsFiltrés.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Aucun remboursement trouvé</p>
                <p className="text-sm">Modifiez vos filtres ou créez un nouveau remboursement</p>
              </div>
            </div>
          )}
        </div>

        {/* Modal de détails */}
        {showModal && selectedRemboursement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Remboursement #{selectedRemboursement.id}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Consultation</label>
                      <p className="mt-1 text-sm text-gray-900">#{selectedRemboursement.consultationId}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Montant</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{formatMontant(selectedRemboursement.montant)}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Méthode de paiement</label>
                      <div className="mt-1">
                        <MethodeBadge methode={selectedRemboursement.methode} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Statut</label>
                      <div className="mt-1">
                        <StatutBadge statut={selectedRemboursement.statut} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de création</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRemboursement.dateCreation)}</p>
                    </div>
                    
                    {selectedRemboursement.dateTraitement && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de traitement</label>
                        <p className="mt-1 text-sm text-gray-900">{formatDate(selectedRemboursement.dateTraitement)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  {selectedRemboursement.statut === StatutRemboursement.EN_ATTENTE && (
                    <>
                      <button
                        onClick={() => handleAction('traiter', selectedRemboursement)}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Traiter
                      </button>
                      <button
                        onClick={() => handleAction('refuser', selectedRemboursement)}
                        className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Refuser
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => setShowModal(false)}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemboursementsList;