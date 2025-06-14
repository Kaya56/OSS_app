import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, XCircle, Users, FileText } from 'lucide-react';

// Types pour les statistiques
interface RemboursementStats {
  totalRemboursements: number;
  montantTotal: number;
  enAttente: number;
  traites: number;
  refuses: number;
  montantMoyenTraite: number;
}

// Données de test
const mockStats: RemboursementStats = {
  totalRemboursements: 1248,
  montantTotal: 156780.50,
  enAttente: 45,
  traites: 56,
  refuses: 47,
  montantMoyenTraite: 125.30
};

const mockDataEvolution = [
  { mois: 'Jan', remboursements: 98, montant: 12450 },
  { mois: 'Fév', remboursements: 112, montant: 14200 },
  { mois: 'Mar', remboursements: 125, montant: 15800 },
  { mois: 'Avr', remboursements: 135, montant: 17200 },
  { mois: 'Mai', remboursements: 142, montant: 18100 },
  { mois: 'Jun', remboursements: 158, montant: 19750 }
];

const mockDataMethodes = [
  { name: 'Virement', value: 892, color: '#3B82F6' },
  { name: 'Espèces', value: 356, color: '#10B981' }
];

const mockDataStatuts = [
  { name: 'Traités', value: 1156, color: '#10B981' },
  { name: 'En attente', value: 45, color: '#F59E0B' },
  { name: 'Refusés', value: 47, color: '#EF4444' }
];

// Composant carte de statistique
const StatsCard: React.FC<{
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  trend?: 'up' | 'down';
  trendValue?: string;
  color: string;
}> = ({ title, value, subtitle, icon: Icon, trend, trendValue, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && trendValue && (
        <div className="mt-4 flex items-center">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendValue}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
        </div>
      )}
    </div>
  );
};

// Composant principal du dashboard
const RemboursementDashboard: React.FC = () => {
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Remboursements</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble des remboursements et statistiques</p>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Remboursements totaux"
            value={formatNumber(mockStats.totalRemboursements)}
            icon={FileText}
            trend="up"
            trendValue="+12%"
            color="bg-blue-500"
          />
          <StatsCard
            title="Montant total"
            value={formatMontant(mockStats.montantTotal)}
            icon={DollarSign}
            trend="up"
            trendValue="+8.5%"
            color="bg-green-500"
          />
          <StatsCard
            title="En attente"
            value={formatNumber(mockStats.enAttente)}
            subtitle="À traiter"
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Montant moyen"
            value={formatMontant(mockStats.montantMoyenTraite)}
            icon={TrendingUp}
            trend="down"
            trendValue="-2.1%"
            color="bg-purple-500"
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Évolution mensuelle */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution mensuelle</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockDataEvolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mois" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'remboursements' ? value : formatMontant(Number(value)),
                    name === 'remboursements' ? 'Remboursements' : 'Montant'
                  ]}
                />
                <Bar yAxisId="left" dataKey="remboursements" fill="#3B82F6" name="remboursements" />
                <Line yAxisId="right" type="monotone" dataKey="montant" stroke="#10B981" strokeWidth={2} name="montant" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition par statut */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockDataStatuts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockDataStatuts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatNumber(Number(value)), 'Nombre']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Répartition par méthode de paiement */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Méthodes de paiement</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockDataMethodes} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value) => [formatNumber(Number(value)), 'Nombre']} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Indicateurs de performance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs clés</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Taux de traitement</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {((mockStats.traites / mockStats.totalRemboursements) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Taux de refus</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {((mockStats.refuses / mockStats.totalRemboursements) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-yellow-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700">En attente</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">
                  {((mockStats.enAttente / mockStats.totalRemboursements) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-blue-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700">Délai moyen traitement</span>
                </div>
                <span className="text-lg font-bold text-blue-600">2.3 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              <FileText className="w-4 h-4 mr-2" />
              Traiter tous les remboursements en attente
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700">
              <TrendingUp className="w-4 h-4 mr-2" />
              Générer rapport mensuel
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700">
              <Users className="w-4 h-4 mr-2" />
              Voir remboursements par assuré
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemboursementDashboard;