// src/pages/personnes/PersonneDashboard.tsx
import React, { useState, useEffect } from 'react';
import { type PersonneDTO, Genre } from '../../types/personne';
import { personneService } from '../../services/personneService';
import { medecinService } from '../../services/medecinService';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

interface PersonneStats {
  total: number;
  hommes: number;
  femmes: number;
  nouveauxCeMois: number;
  moyenneAge: number;
  totalMedecins: number;
}

interface RecentActivity {
  id: number;
  type: 'creation' | 'modification';
  personne: PersonneDTO;
  date: string;
}

export const PersonneDashboard: React.FC = () => {
  const [stats, setStats] = useState<PersonneStats>({
    total: 0,
    hommes: 0,
    femmes: 0,
    nouveauxCeMois: 0,
    moyenneAge: 0,
    totalMedecins: 0,
  });
  
  const [recentPersonnes, setRecentPersonnes] = useState<PersonneDTO[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger toutes les personnes
      const personnes = await personneService.getAllPersonnes();
      
      // Charger les médecins
      const medecins = await medecinService.getAllMedecins();
      
      // Calculer les statistiques
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const nouveauxCeMois = personnes.filter(p => 
        p.dateCreation && new Date(p.dateCreation) >= startOfMonth
      ).length;
      
      const ages = personnes.map(p => {
        const birthDate = new Date(p.dateNaissance);
        const age = now.getFullYear() - birthDate.getFullYear();
        const monthDiff = now.getMonth() - birthDate.getMonth();
        return monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate()) ? age - 1 : age;
      });
      
      const moyenneAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;
      
      setStats({
        total: personnes.length,
        hommes: personnes.filter(p => p.genre === Genre.M).length,
        femmes: personnes.filter(p => p.genre === Genre.F).length,
        nouveauxCeMois,
        moyenneAge,
        totalMedecins: medecins.length,
      });
      
      // Récupérer les personnes récentes
      const recent = personnes
        .sort((a, b) => new Date(b.dateCreation || '').getTime() - new Date(a.dateCreation || '').getTime())
        .slice(0, 5);
      
      setRecentPersonnes(recent);
      
      // Simuler l'activité récente
      const activity: RecentActivity[] = recent.map(p => ({
        id: p.id || 0,
        type: 'creation' as const,
        personne: p,
        date: p.dateCreation || '',
      }));
      
      setRecentActivity(activity);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Dashboard des Personnes</h1>
        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={() => navigate('/personnes/create')}
          >
            Ajouter une personne
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/personnes')}
          >
            Voir toutes les personnes
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Personnes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hommes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.hommes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Femmes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.femmes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Nouveaux ce mois</p>
              <p className="text-2xl font-bold text-gray-900">{stats.nouveauxCeMois}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M5 10h14l-1 7H6l-1-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Âge moyen</p>
              <p className="text-2xl font-bold text-gray-900">{stats.moyenneAge} ans</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Médecins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMedecins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques et informations détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par genre */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Genre</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Hommes</span>
              <span className="text-sm font-bold text-blue-600">{stats.hommes}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${stats.total > 0 ? (stats.hommes / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Femmes</span>
              <span className="text-sm font-bold text-pink-600">{stats.femmes}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pink-600 h-2 rounded-full" 
                style={{ width: `${stats.total > 0 ? (stats.femmes / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={() => navigate('/personnes/create')}
              className="w-full"
            >
              Ajouter une nouvelle personne
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/personnes')}
              className="w-full"
            >
              Voir toutes les personnes
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/medecins/create')}
              className="w-full"
            >
              Ajouter un médecin
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/medecins')}
              className="w-full"
            >
              Gérer les médecins
            </Button>
          </div>
        </div>
      </div>

      {/* Personnes récentes et activité */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personnes récemment ajoutées */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Personnes Récentes</h3>
            <Button
              variant="ghost"
              onClick={() => navigate('/personnes')}
              size="sm"
            >
              Voir tout
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentPersonnes.length > 0 ? (
              recentPersonnes.map((personne) => (
                <div key={personne.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      personne.genre === Genre.M ? 'bg-blue-500' : 'bg-pink-500'
                    }`}>
                      {personne.nom.charAt(0)}{personne.prenom.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {personne.nom} {personne.prenom}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {personne.email}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {personne.dateCreation && formatDate(personne.dateCreation)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune personne récente</p>
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h3>
          
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'creation' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">
                        {activity.personne.nom} {activity.personne.prenom}
                      </span>
                      {activity.type === 'creation' ? ' a été ajouté(e)' : ' a été modifié(e)'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(activity.date)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};