import React, { useState } from 'react';
import { Save, X, Search, AlertCircle } from 'lucide-react';

import { MethodePaiement } from '../../types/assure';

interface CreateRemboursementForm {
  consultationId: string;
  methode: MethodePaiement;
}

interface ConsultationInfo {
  id: number;
  assureNom: string;
  assurePrenom: string;
  medecinNom: string;
  date: string;
  cout: number;
  montantRemboursable: number;
}

// Données de test
const mockConsultations: ConsultationInfo[] = [
  {
    id: 101,
    assureNom: 'Dupont',
    assurePrenom: 'Marie',
    medecinNom: 'Dr. Martin',
    date: '2024-01-15',
    cout: 150.0,
    montantRemboursable: 105.0
  },
  {
    id: 102,
    assureNom: 'Durand',
    assurePrenom: 'Pierre',
    medecinNom: 'Dr. Bernard',
    date: '2024-01-16',
    cout: 75.0,
    montantRemboursable: 52.5
  }
];

// Composant de création de remboursement
const CreateRemboursementForm: React.FC<{
  onSubmit: (data: CreateRemboursementForm) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateRemboursementForm>({
    consultationId: '',
    methode: MethodePaiement.VIREMENT
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationInfo | null>(null);
  const [showConsultations, setShowConsultations] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredConsultations = mockConsultations.filter(c =>
    c.assureNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.assurePrenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toString().includes(searchTerm)
  );

  const handleConsultationSelect = (consultation: ConsultationInfo) => {
    setSelectedConsultation(consultation);
    setFormData(prev => ({ ...prev, consultationId: consultation.id.toString() }));
    setShowConsultations(false);
    setSearchTerm(`${consultation.assurePrenom} ${consultation.assureNom} - #${consultation.id}`);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.consultationId) {
      newErrors.consultationId = 'Veuillez sélectionner une consultation';
    }
    
    if (!formData.methode) {
      newErrors.methode = 'Veuillez sélectionner une méthode de paiement';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const formatMontant = (montant: number) => {
    return `${montant.toFixed(2)} €`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Créer un remboursement</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection de consultation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowConsultations(true);
                  }}
                  onFocus={() => setShowConsultations(true)}
                  placeholder="Rechercher une consultation..."
                  className={`w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.consultationId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                
                {showConsultations && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredConsultations.length > 0 ? (
                      filteredConsultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          onClick={() => handleConsultationSelect(consultation)}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">
                                {consultation.assurePrenom} {consultation.assureNom}
                              </p>
                              <p className="text-sm text-gray-600">
                                #{consultation.id} - {consultation.medecinNom}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(consultation.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                Coût: {formatMontant(consultation.cout)}
                              </p>
                              <p className="text-sm text-green-600">
                                Remboursable: {formatMontant(consultation.montantRemboursable)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-gray-500 text-center">
                        <AlertCircle className="inline-block w-5 h-5 mr-2" />
                        Aucune consultation trouvée
                      </div>
                    )}
                  </div>
                )}
                {errors.consultationId && (
                  <p className="text-sm text-red-500 mt-1">{errors.consultationId}</p>
                )}
              </div>
            </div>

            {/* Sélection du mode de paiement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mode de paiement *
              </label>
              <select
                value={formData.methode}
                onChange={(e) => setFormData(prev => ({ ...prev, methode: e.target.value as MethodePaiement }))}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={MethodePaiement.VIREMENT}>Virement bancaire</option>
                <option value={MethodePaiement.CASH}>Espèces</option>
              </select>
              {errors.methode && <p className="text-sm text-red-500 mt-1">{errors.methode}</p>}
            </div>

            {/* Boutons */}
            <div className="flex justify-end gap-4">
              <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-400 text-white rounded-md flex items-center">
                <X className="w-5 h-5 mr-2" /> Annuler
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
                <Save className="w-5 h-5 mr-2" /> Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRemboursementForm;
