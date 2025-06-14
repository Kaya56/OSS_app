import React, { useState, useEffect } from 'react';
import { type Assure, MethodePaiement, Genre } from '../../types/assure';
import { assureService } from '../../services/assureService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Search, Plus, Edit, Trash2, User, Phone, Mail, CreditCard } from 'lucide-react';

interface AssureListProps {
  onEdit?: (assure: Assure) => void;
  onDelete?: (id: number) => void;
  onView?: (assure: Assure) => void;
}

export const AssureList: React.FC<AssureListProps> = ({
  onEdit,
  onDelete,
  onView
}) => {
  const [assures, setAssures] = useState<Assure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethode, setFilterMethode] = useState<MethodePaiement | ''>('');
  const [showSansMedecin, setShowSansMedecin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssures();
  }, []);

  const loadAssures = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assureService.getAllAssures();
      setAssures(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des assurés');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadAssures();
      return;
    }

    try {
      setLoading(true);
      const data = await assureService.searchAssuresByNom(searchTerm);
      setAssures(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByMethode = async (methode: MethodePaiement | '') => {
    setFilterMethode(methode);
    
    if (!methode) {
      loadAssures();
      return;
    }

    try {
      setLoading(true);
      const data = await assureService.getAssuresByMethodePaiement(methode);
      setAssures(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du filtrage');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSansMedecin = async (show: boolean) => {
    setShowSansMedecin(show);
    
    if (!show) {
      loadAssures();
      return;
    }

    try {
      setLoading(true);
      const data = await assureService.getAssuresSansMedecinTraitant();
      setAssures(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du filtrage');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet assuré ?')) {
      try {
        await assureService.deleteAssure(id);
        setAssures(prev => prev.filter(a => a.id !== id));
        if (onDelete) onDelete(id);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterMethode('');
    setShowSansMedecin(false);
    loadAssures();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getGenreLabel = (genre: Genre) => {
    return genre === Genre.M ? 'Masculin' : 'Féminin';
  };

  const getMethodePaiementLabel = (methode: MethodePaiement) => {
    return methode === MethodePaiement.VIREMENT ? 'Virement bancaire' : 'Espèces';
  };

  if (loading && assures.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Liste des Assurés</h1>
        <Button
          onClick={() => window.location.href = '/assures/create'}
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Nouvel Assuré</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Rechercher par nom..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} // ✅ Correction
              className="flex-1"
            />

            <Button onClick={handleSearch} variant="secondary">
              <Search size={16} />
            </Button>
          </div>

          <select
            value={filterMethode}
            onChange={(e) => handleFilterByMethode(e.target.value as MethodePaiement | '')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les méthodes</option>
            <option value={MethodePaiement.VIREMENT}>Virement bancaire</option>
            <option value={MethodePaiement.CASH}>Espèces</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showSansMedecin}
              onChange={(e) => handleFilterSansMedecin(e.target.checked)}
              className="rounded"
            />
            <span>Sans médecin traitant</span>
          </label>

          <Button onClick={resetFilters} variant="secondary">
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-blue-800">
          <strong>{assures.length}</strong> assuré(s) trouvé(s)
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Informations personnelles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assurance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecin traitant
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assures.map((assure) => (
                <tr key={assure.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {assure.nom} {assure.prenom}
                        </div>
                        <div className="text-sm text-gray-500">
                          {getGenreLabel(assure.genre)} • {formatDate(assure.dateNaissance)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {assure.telephone}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {assure.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {assure.numeroAssurance}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                        {getMethodePaiementLabel(assure.methodePaiementPreferee)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {assure.medecinTraitantNom || 'Aucun'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                    {onView && (
                      <Button
                        onClick={() => onView(assure)}
                        variant="secondary"
                        size="sm"
                      >
                        Voir
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        onClick={() => onEdit(assure)}
                        variant="secondary"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        onClick={() => handleDelete(assure.id!)}
                        variant="secondary"
                        size="sm"
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

                {assures.length === 0 && !loading && (
          <div className="text-center text-gray-500 py-6">
            Aucun assuré trouvé.
          </div>
        )}
      </div>
    </div>
  );
};
export default AssureList;