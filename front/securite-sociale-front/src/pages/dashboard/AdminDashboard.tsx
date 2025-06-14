import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { assureService } from '../../services/assureService';
import medecinService from '../../services/medecinService';
import { Role } from '../../types/auth';
import type { AssureDTO } from '../../types/assure';
import type { Medecin } from '../../types/medecin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Stethoscope, FileText, DollarSign } from 'lucide-react';

interface AdminStats {
  totalAssures: number;
  totalMedecins: number;
  totalRemboursements: number;
  totalMontantRembourse: number;
}

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  link: string;
}> = ({ title, value, icon: Icon, color, link }) => {
  return (
    <Link to={link} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Link>
  );
};

const AdminDashboard: React.FC = () => {
  const { authState } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalAssures: 0,
    totalMedecins: 0,
    totalRemboursements: 0,
    totalMontantRembourse: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assures, setAssures] = useState<AssureDTO[]>([]);
  const [medecins, setMedecins] = useState<Medecin[]>([]);

  // Mock data for activity trend (could be replaced with actual API data)
  const activityData = [
    { month: 'Jan', assures: 100, medecins: 10, remboursements: 50 },
    { month: 'Fév', assures: 120, medecins: 12, remboursements: 60 },
    { month: 'Mar', assures: 140, medecins: 15, remboursements: 70 },
    { month: 'Avr', assures: 160, medecins: 18, remboursements: 80 },
    { month: 'Mai', assures: 180, medecins: 20, remboursements: 90 },
    { month: 'Jun', assures: 200, medecins: 22, remboursements: 100 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assuresData, medecinsData] = await Promise.all([
          assureService.getAllAssures(),
          medecinService.getAllMedecins(),
        ]);

        setAssures(assuresData);
        setMedecins(medecinsData);

        // Mock remboursement data (replace with actual service call)
        const remboursementStats = {
          totalRemboursements: 1248,
          totalMontantRembourse: 156780.50,
        };

        setStats({
          totalAssures: assuresData.length,
          totalMedecins: medecinsData.length,
          totalRemboursements: remboursementStats.totalRemboursements,
          totalMontantRembourse: remboursementStats.totalMontantRembourse,
        });
      } catch (err) {
        setError('Erreur lors du chargement des données');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(montant);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  if (!authState.user?.roles.includes(Role.ROLE_ADMIN)) {
    return <Navigate to="/access-denied" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
          <p className="text-gray-600 mt-2">Vue d'ensemble du système de sécurité sociale</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Assurés totaux"
            value={stats.totalAssures}
            icon={Users}
            color="bg-blue-500"
            link="/assure/dashboard"
          />
          <StatsCard
            title="Médecins"
            value={stats.totalMedecins}
            icon={Stethoscope}
            color="bg-green-500"
            link="/medecin/dashboard"
          />
          <StatsCard
            title="Remboursements"
            value={stats.totalRemboursements}
            icon={FileText}
            color="bg-purple-500"
            link="/remboursement/dashboard"
          />
          <StatsCard
            title="Montant remboursé"
            value={formatMontant(stats.totalMontantRembourse)}
            icon={DollarSign}
            color="bg-orange-500"
            link="/remboursement/dashboard"
          />
        </div>

        {/* Activity Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendances d'activité</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="assures" fill="#3B82F6" name="Assurés" />
              <Bar dataKey="medecins" fill="#10B981" name="Médecins" />
              <Bar dataKey="remboursements" fill="#A855F7" name="Remboursements" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/assures/new"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Nouvel assuré
            </Link>
            <Link
              to="/medecins/new"
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              <Stethoscope className="w-4 h-4 mr-2" />
              Nouveau médecin
            </Link>
            <Link
              to="/consultations/new"
              className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Nouvelle consultation
            </Link>
            <Link
              to="/personnes/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700"
            >
              <Users className="w-4 h-4 mr-2" />
              Gestion des personnes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;