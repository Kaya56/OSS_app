// // pages/dashboard/MedecinDashboard.tsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import medecinService from '../../services/medecinService';
// import { useConsultations } from '../../hooks/useConsultations';
// import { usePrescriptions } from '../../hooks/usePrescriptions';
// import type { Medecin } from '../../types/medecin';

// interface MedecinStats {
//   totalConsultations: number;
//   consultationsAujourdhui: number;
//   prescriptionsEmises: number;
//   patientsUniques: number;
// }

// const MedecinDashboard: React.FC = () => {
//   const { authState } = useAuth();
//   const { consultations, loading: consultationsLoading } = useConsultations();
//   const { prescriptions, loading: prescriptionsLoading } = usePrescriptions();
  
//   const [medecin, setMedecin] = useState<Medecin | null>(null);
//   const [stats, setStats] = useState<MedecinStats>({
//     totalConsultations: 0,
//     consultationsAujourdhui: 0,
//     prescriptionsEmises: 0,
//     patientsUniques: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     loadMedecinData();
//   }, [authState.user]);

//   useEffect(() => {
//     if (consultations && prescriptions && medecin) {
//       calculateStats();
//     }
//   }, [consultations, prescriptions, medecin]);

//   const loadMedecinData = async () => {
//     try {
//       setLoading(true);
//       if (authState.user?.personne?.id) {
//         const medecinData = await medecinService.getMedecinByPersonneId(authState.user.personne.id);
//         setMedecin(medecinData);
//       }
//     } catch (err) {
//       setError('Erreur lors du chargement des données du médecin');
//       console.error('Erreur:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = () => {
//     if (!medecin) return;

//     const today = new Date().toISOString().split('T')[0];
    
//     // Filtrer les consultations du médecin
//     const medecinConsultations = consultations.filter(c => c.medecinId === medecin.id);
//     const consultationsToday = medecinConsultations.filter(c => 
//       c.date.split('T')[0] === today
//     );
    
//     // Filtrer les prescriptions du médecin
//     const medecinPrescriptions = prescriptions.filter(p => p.medecinId === medecin.id);
    
//     // Calculer les patients uniques
//     const patientsUniques = new Set(medecinConsultations.map(c => c.assureId)).size;

//     setStats({
//       totalConsultations: medecinConsultations.length,
//       consultationsAujourdhui: consultationsToday.length,
//       prescriptionsEmises: medecinPrescriptions.length,
//       patientsUniques
//     });
//   };

//   const getProchainRendezVous = () => {
//     if (!medecin) return [];
    
//     const now = new Date();
//     return consultations
//       .filter(c => c.medecinId === medecin.id && new Date(c.date) > now)
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
//       .slice(0, 5);
//   };

//   const getConsultationsRecentes = () => {
//     if (!medecin) return [];
    
//     return consultations
//       .filter(c => c.medecinId === medecin.id)
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//       .slice(0, 5);
//   };

//   if (loading || consultationsLoading || prescriptionsLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-md p-4">
//         <div className="text-red-800">{error}</div>
//       </div>
//     );
//   }

//   if (!medecin) {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
//         <div className="text-yellow-800">
//           Profil médecin non trouvé. Veuillez contacter l'administrateur.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* En-tête */}
//       <div className="bg-white shadow rounded-lg p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Tableau de bord - Dr. {medecin.nom} {medecin.prenom}
//             </h1>
//             <p className="text-gray-600">
//               {medecin.specialisation ? `Spécialiste en ${medecin.specialisation}` : 'Médecin généraliste'}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-sm text-gray-500">Dernière connexion</p>
//             <p className="text-lg font-semibold text-gray-900">
//               {new Date().toLocaleDateString('fr-FR')}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Statistiques */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Total consultations
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     {stats.totalConsultations}
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Aujourd'hui
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     {stats.consultationsAujourdhui}
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Prescriptions émises
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     {stats.prescriptionsEmises}
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">
//                     Patients uniques
//                   </dt>
//                   <dd className="text-lg font-medium text-gray-900">
//                     {stats.patientsUniques}
//                   </dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Contenu principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Prochains rendez-vous */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//             <h3 className="text-lg leading-6 font-medium text-gray-900">
//               Prochains rendez-vous
//             </h3>
//           </div>
//           <div className="px-4 py-5 sm:p-6">
//             {getProchainRendezVous().length === 0 ? (
//               <p className="text-gray-500 text-center py-4">
//                 Aucun rendez-vous programmé
//               </p>
//             ) : (
//               <div className="space-y-3">
//                 {getProchainRendezVous().map((consultation, index) => (
//                   <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         Patient #{consultation.assureId}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {consultation.motif}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-medium text-gray-900">
//                         {new Date(consultation.date).toLocaleDateString('fr-FR')}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(consultation.date).toLocaleTimeString('fr-FR', {
//                           hour: '2-digit',
//                           minute: '2-digit'
//                         })}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Consultations récentes */}
//         <div className="bg-white shadow rounded-lg">
//           <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//             <h3 className="text-lg leading-6 font-medium text-gray-900">
//               Consultations récentes
//             </h3>
//           </div>
//           <div className="px-4 py-5 sm:p-6">
//             {getConsultationsRecentes().length === 0 ? (
//               <p className="text-gray-500 text-center py-4">
//                 Aucune consultation récente
//               </p>
//             ) : (
//               <div className="space-y-3">
//                 {getConsultationsRecentes().map((consultation, index) => (
//                   <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         Patient #{consultation.assureId}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {consultation.motif}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-medium text-gray-900">
//                         {new Date(consultation.date).toLocaleDateString('fr-FR')}
//                       </p>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         consultation.statut === 'TERMINE' 
//                           ? 'bg-green-100 text-green-800'
//                           : consultation.statut === 'EN_COURS'
//                           ? 'bg-blue-100 text-blue-800'
//                           : 'bg-yellow-100 text-yellow-800'
//                       }`}>
//                         {consultation.statut}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Actions rapides */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//           <h3 className="text-lg leading-6 font-medium text-gray-900">
//             Actions rapides
//           </h3>
//         </div>
//         <div className="px-4 py-5 sm:p-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//               </svg>
//               Nouvelle consultation
//             </button>
            
//             <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               Nouvelle prescription
//             </button>
            
//             <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M3 7h18M3 7l2 9a2 2 0 002 2h10a2 2 0 002-2l2-9" />
//               </svg>
//               Mes consultations
//             </button>
            
//             <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               Mes patients
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MedecinDashboard;