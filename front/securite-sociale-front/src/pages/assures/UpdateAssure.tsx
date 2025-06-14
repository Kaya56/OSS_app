// src/pages/UpdateAssure.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assureService } from '../../services/assureService';
import { type AssureDTO, Genre, MethodePaiement } from '../../types/assure';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';


export const UpdateAssure: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assure, setAssure] = useState<AssureDTO | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssure = async () => {
      try {
        const data = await assureService.getAssureById(Number(id));
        setAssure(data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur lors du chargement de l'assuré.");
      }
    };
    fetchAssure();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (assure) setAssure({ ...assure, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assureService.updateAssure(Number(id), assure!);
      navigate('/assures');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    }
  };

  if (!assure) return <div className="text-center mt-10">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">Modifier l'assuré</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="nom" label="Nom" value={assure.nom} onChange={handleChange} required />
        <Input name="dateNaissance" label="Date de naissance" type="date" value={assure.dateNaissance} onChange={handleChange} required />
        <select name="genre" value={assure.genre} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value={Genre.M}>Masculin</option>
          <option value={Genre.F}>Féminin</option>
        </select>
        <Input name="telephone" label="Téléphone" value={assure.telephone} onChange={handleChange} required />
        <Input name="email" label="Email" type="email" value={assure.email} onChange={handleChange} required />
        <Input name="numeroAssurance" label="Numéro d'assurance" value={assure.numeroAssurance} onChange={handleChange} required />
        <Input name="adresse" label="Adresse" value={assure.adresse} onChange={handleChange} required />
        <select name="methodePaiementPreferee" value={assure.methodePaiementPreferee} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value={MethodePaiement.VIREMENT}>Virement bancaire</option>
          <option value={MethodePaiement.CASH}>Espèces</option>
        </select>
        <Button type="submit">Mettre à jour</Button>
      </form>
    </div>
  );
};
