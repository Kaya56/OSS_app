import React, { useEffect, useState } from 'react';
import { assureService } from '../../services/assureService';
import { type AssureDTO } from '../../types/assure';
import Input from '../../components/common/Input';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4ade80', '#60a5fa'];

export const DashboardAssures: React.FC = () => {
  const [assures, setAssures] = useState<AssureDTO[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await assureService.getAllAssures();
      setAssures(data);
    };
    fetchData();
  }, []);

  const filtered = assures.filter(a =>
    a.nom.toLowerCase().includes(search.toLowerCase()) ||
    a.prenom.toLowerCase().includes(search.toLowerCase())
  );

  const genreData = [
    { name: 'Masculin', value: assures.filter(a => a.genre === 'M').length },
    { name: 'Féminin', value: assures.filter(a => a.genre === 'F').length },
  ];

  const paiementData = [
    { name: 'Virement', value: assures.filter(a => a.methodePaiementPreferee === 'VIREMENT').length },
    { name: 'Espèces', value: assures.filter(a => a.methodePaiementPreferee === 'CASH').length },
  ];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard des assurés</h1>
      <Input
        name="search"
        label="Rechercher par nom ou prénom"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Nombre total d'assurés */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Nombre total d'assurés</h2>
          <p className="text-3xl font-bold">{assures.length}</p>
        </div>

        {/* Répartition par genre */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Répartition par genre</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={genreData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {genreData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Méthode de paiement préférée */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Méthode de paiement préférée</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={paiementData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {paiementData.map((entry, index) => (
                  <Cell key={`cell-pay-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Liste des assurés */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Liste des assurés</h2>
        <div className="overflow-auto rounded border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Prénom</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Téléphone</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Genre</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Méthode paiement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((a, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{a.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{a.prenom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{a.telephone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{a.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{a.genre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{a.methodePaiementPreferee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAssures;