// src/components/medecins/MedecinList.tsx
import React, { useState, useEffect } from 'react';
import type { Medecin } from '../../types/medecin';
import { medecinService } from '../../services/medecinService';
import Button from '../common/Button';
import Input from '../common/Input';
import Table from '../common/Table';
import { useNavigate } from 'react-router-dom';

export const MedecinList: React.FC = () => {
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [filteredMedecins, setFilteredMedecins] = useState<Medecin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'tous' | 'generalistes' | 'specialistes'>('tous');
  const [selectedSpecialisation, setSelectedSpecialisation] = useState('');
  const [specialisations, setSpecialisations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadMedecins();
    loadSpecialisations();
  }, []);

  useEffect(() => {
    filterMedecins();
  }, [medecins, searchTerm, filterType, selectedSpecialisation]);

  const loadMedecins = async () => {
    try {
      setLoading(true);
      const data = await medecinService.getAllMedecins();
      setMedecins(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des médecins');
      console.error('Error loading medecins:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecialisations = async () => {
    try {
      const specs = await medecinService.getAllSpecialisations();
      setSpecialisations(specs);
    } catch (err) {
      console.error('Error loading specialisations:', err);
    }
  };

  const filterMedecins = async () => {
    let filtered = [...medecins];

    // Filtrer par type
    if (filterType === 'generalistes') {
      filtered = filtered.filter(m => !m.specialisation || m.specialisation.trim() === '');
    } else if (filterType === 'specialistes') {
      filtered = filtered.filter(m => m.specialisation && m.specialisation.trim() !== '');
    }

    // Filtrer par spécialisation spécifique
    if (selectedSpecialisation) {
      filtered = filtered.filter(m => 
        m.specialisation && m.specialisation.toLowerCase().includes(selectedSpecialisation.toLowerCase())
      );
    }

    // Filtrer par recherche de nom
    if (searchTerm.trim()) {
      try {
        const searchResults = await medecinService.searchMedecinsByNom(searchTerm);
        const searchIds = new Set(searchResults.map(m => m.id));
        filtered = filtered.filter(m => searchIds.has(m.id));
      } catch (err) {
        console.error('Error searching medecins:', err);
      }
    }

    setFilteredMedecins(filtered);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médecin ?')) {
      try {
        await medecinService.deleteMedecin(id);
        await loadMedecins();
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error('Error deleting medecin:', err);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getAge = (dateNaissance: string) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const columns = [
    {
      key: 'nom',
      label: 'Médecin',
      render: (medecin: Medecin) => (
        <div>
          <div className="font-medium">Dr. {medecin.nom}</div>
          <div className="text-sm text-gray-500">ID: {medecin.personneId}</div>
        </div>
      ),
    },
    {
      key: 'dateNaissance',
      label: 'Âge',
      render: (medecin: Medecin) => (
        <div>
          <div>{getAge(medecin.dateNaissance)} ans</div>
          <div className="text-sm text-gray-500">{formatDate(medecin.dateNaissance)}</div>
        </div>
      ),
    },
    {
      key: 'genre',
      label: 'Genre',
      render: (medecin: Medecin) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          medecin.genre === 'M' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-pink-100 text-pink-800'
        }`}>
          {medecin.genre === 'M' ? 'Masculin' : 'Féminin'}
        </span>
      ),
    },
    {
      key: 'specialisation',
      label: 'Spécialisation',
      render: (medecin: Medecin) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          medecin.specialisation && medecin.specialisation.trim() 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {medecin.specialisation && medecin.specialisation.trim() 
            ? medecin.specialisation 
            : 'Généraliste'
          }
        </span>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (medecin: Medecin) => (
        <div>
          <div className="text-sm">{medecin.email}</div>
          <div className="text-sm text-gray-500">{medecin.telephone}</div>
        </div>
      ),
    },
    {
      key: 'adresse',
      label: 'Adresse',
      render: (medecin: Medecin) => (
        <div className="text-sm max-w-xs truncate" title={medecin.adresse}>
          {medecin.adresse}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (medecin: Medecin) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/medecins/${medecin.id}`)}
          >
            Voir
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/medecins/${medecin.id}/edit`)}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(medecin.id)}
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const generalistes = medecins.filter(m => !m.specialisation || m.specialisation.trim() === '');
  const specialistes = medecins.filter(m => m.specialisation && m.specialisation.trim() !== '');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Liste des Médecins</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/medecins/create')}
        >
          Ajouter un médecin
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filtres de recherche */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              label="Rechercher par nom"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nom du médecin..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de médecin
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tous">Tous</option>
              <option value="generalistes">Généralistes</option>
              <option value="specialistes">Spécialistes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Spécialisation
            </label>
            <select
              value={selectedSpecialisation}
              onChange={(e) => setSelectedSpecialisation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={filterType === 'generalistes'}
            >
              <option value="">Toutes les spécialisations</option>
              {specialisations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm('');
                setFilterType('tous');
                setSelectedSpecialisation('');
                setFilteredMedecins(medecins);
              }}
              className="w-full"
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{medecins.length}</div>
          <div className="text-gray-600">Total médecins</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{generalistes.length}</div>
          <div className="text-gray-600">Généralistes</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{specialistes.length}</div>
          <div className="text-gray-600">Spécialistes</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-orange-600">{filteredMedecins.length}</div>
          <div className="text-gray-600">Résultats affichés</div>
        </div>
      </div>

      {/* Spécialisations disponibles */}
      {specialisations.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Spécialisations disponibles</h3>
          <div className="flex flex-wrap gap-2">
            {specialisations.map(spec => (
              <span
                key={spec}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm cursor-pointer hover:bg-blue-200"
                onClick={() => {
                  setFilterType('specialistes');
                  setSelectedSpecialisation(spec);
                }}
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow">
        <Table
          data={filteredMedecins}
          columns={columns}
          emptyMessage="Aucun médecin trouvé"
        />
      </div>
    </div>
  );
};