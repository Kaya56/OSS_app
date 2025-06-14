// src/components/personnes/PersonneList.tsx
import React, { useState, useEffect } from 'react';
import  { type PersonneDTO, Genre } from '../../types/personne';
import { personneService } from '../../services/personneService';
import Button from '../common/Button';
import Input from '../common/Input';
import Table from '../common/Table';
import { useNavigate } from 'react-router-dom';

export const PersonneList: React.FC = () => {
  const [personnes, setPersonnes] = useState<PersonneDTO[]>([]);
  const [filteredPersonnes, setFilteredPersonnes] = useState<PersonneDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'nom' | 'email' | 'telephone'>('nom');
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadPersonnes();
  }, []);

  useEffect(() => {
    filterPersonnes();
  }, [personnes, searchTerm, searchType]);

  const loadPersonnes = async () => {
    try {
      setLoading(true);
      const data = await personneService.getAllPersonnes();
      setPersonnes(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des personnes');
      console.error('Error loading personnes:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPersonnes = async () => {
    if (!searchTerm.trim()) {
      setFilteredPersonnes(personnes);
      return;
    }

    try {
      let results: PersonneDTO[] = [];
      
      switch (searchType) {
        case 'nom':
          results = await personneService.searchByNom(searchTerm);
          break;
        case 'email':
          const person = await personneService.searchByEmail(searchTerm);
          results = person ? [person] : [];
          break;
        case 'telephone':
          results = await personneService.searchByTelephone(searchTerm);
          break;
      }
      
      setFilteredPersonnes(results);
    } catch (err) {
      console.error('Error searching personnes:', err);
      setFilteredPersonnes([]);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette personne ?')) {
      try {
        await personneService.deletePersonne(id);
        await loadPersonnes();
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error('Error deleting personne:', err);
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
      label: 'Nom',
      render: (personne: PersonneDTO) => (
        <div>
          <div className="font-medium">{personne.nom}</div>
          <div className="text-sm text-gray-500">{personne.prenom}</div>
        </div>
      ),
    },
    {
      key: 'dateNaissance',
      label: 'Âge',
      render: (personne: PersonneDTO) => (
        <div>
          <div>{getAge(personne.dateNaissance)} ans</div>
          <div className="text-sm text-gray-500">{formatDate(personne.dateNaissance)}</div>
        </div>
      ),
    },
    {
      key: 'genre',
      label: 'Genre',
      render: (personne: PersonneDTO) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          personne.genre === Genre.M 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-pink-100 text-pink-800'
        }`}>
          {personne.genre === Genre.M ? 'Masculin' : 'Féminin'}
        </span>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (personne: PersonneDTO) => (
        <div>
          <div className="text-sm">{personne.email}</div>
          <div className="text-sm text-gray-500">{personne.telephone}</div>
        </div>
      ),
    },
    {
      key: 'adresse',
      label: 'Adresse',
      render: (personne: PersonneDTO) => (
        <div className="text-sm max-w-xs truncate" title={personne.adresse}>
          {personne.adresse}
        </div>
      ),
    },
    {
      key: 'dateCreation',
      label: 'Créé le',
      render: (personne: PersonneDTO) => 
        personne.dateCreation ? formatDate(personne.dateCreation) : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (personne: PersonneDTO) => (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/personnes/${personne.id}`)}
          >
            Voir
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/personnes/${personne.id}/edit`)}
          >
            Modifier
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => personne.id && handleDelete(personne.id)}
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Liste des Personnes</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/personnes/create')}
        >
          Ajouter une personne
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filtres de recherche */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Input
              label="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Rechercher par ${searchType}...`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type de recherche
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as typeof searchType)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="nom">Nom</option>
              <option value="email">Email</option>
              <option value="telephone">Téléphone</option>
            </select>
          </div>
          
          <Button
            variant="secondary"
            onClick={() => {
              setSearchTerm('');
              setFilteredPersonnes(personnes);
            }}
          >
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{personnes.length}</div>
          <div className="text-gray-600">Total personnes</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">
            {personnes.filter(p => p.genre === Genre.M).length}
          </div>
          <div className="text-gray-600">Hommes</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-pink-600">
            {personnes.filter(p => p.genre === Genre.F).length}
          </div>
          <div className="text-gray-600">Femmes</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-purple-600">{filteredPersonnes.length}</div>
          <div className="text-gray-600">Résultats affichés</div>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg shadow">
        <Table
          data={filteredPersonnes}
          columns={columns}
          emptyMessage="Aucune personne trouvée"
        />
      </div>
    </div>
  );
};