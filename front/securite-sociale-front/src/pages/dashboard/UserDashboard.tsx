// import React, { useState, useEffect, useMemo } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useConsultations } from '../../hooks/useConsultations';
// import { usePrescriptions } from '../../hooks/usePrescriptions';
// import { useRemboursements } from '../../hooks/useRemboursements';
// import { Role } from '../../types/auth';

// interface DashboardStats {
//   consultations: number;
//   prescriptions: number;
//   remboursements: number;
//   activitesRecentes: number;
// }

// interface RecentActivity {
//   id: string;
//   type: 'consultation' | 'prescription' | 'remboursement';
//   title: string;
//   description: string;
//   date: string;
//   status?: string;
// }

// const UserDashboard: React.FC = () => {
//   const { authState } = useAuth();
//   const { consultations, loading: consultationsLoading, error: consultationsError } = useConsultations();
//   const { prescriptions, loading: prescriptionsLoading, error: prescriptionsError } = usePrescriptions();
//   const { remboursements, loading: remboursementsLoading, error: remboursementsError } = useRemboursements();

//   const [stats, setStats] = useState<DashboardStats>({
//     consultations: 0,
//     prescriptions: 0,
//     remboursements: 0,
//     activitesRecentes: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!consultationsLoading && !prescriptionsLoading && !remboursementsLoading) {
//       calculateStats();
//       setLoading(false);
//     }
//   }, [consultations, prescriptions, remboursements, consultationsLoading, prescriptionsLoading, remboursementsLoading]);

//   const calculateStats = () => {
//     const userConsultations = consultations?.length || 0;
//     const userPrescriptions = prescriptions?.length || 0;
//     const userRemboursements = remboursements?.length || 0;

//     setStats({
//       consultations: userConsultations,
//       prescriptions: userPrescriptions,
//       remboursements: userRemboursements,
//       activitesRecentes: userConsultations + userPrescriptions + userRemboursements,
//     });
//   };

//   const isValidDate = (dateStr: string) => !isNaN(new Date(dateStr).getTime());

//   const recentActivities = useMemo(() => {
//     const activities: RecentActivity[] = [];

//     // Ajouter les consultations récentes
//     consultations?.slice(0, 3).forEach((consultation) => {
//       if (isValidDate(consultation.date)) {
//         activities.push({
//           id: `consultation-${consultation.id}`,
//           type: 'consultation',
//           title: 'Consultation médicale',
//           description: consultation.motif || 'Consultation générale',
//           date: consultation.date,
//           status: consultation.statut,
//         });
//       }
//     });

//     // Ajouter les prescriptions récentes
//     prescriptions?.slice(0, 2).forEach((prescription) => {
//       if (isValidDate(prescription.dateCreation)) {
//         activities.push({
//           id: `prescription-${prescription.id}`,
//           type: 'prescription',
//           title: 'Prescription médicale',
//           description: `${prescription.medicaments?.length || 0} médicament(s) prescrits`,
//           date: prescription.dateCreation,
//           status: prescription.statut,
//         });
//       }
//     });

//     // Ajouter les remboursements récents
//     remboursements?.slice(0, 2).forEach((remboursement) => {
//       if (isValidDate(remboursement.dateRemboursement)) {
//         activities.push({
//           id: `remboursement-${remboursement.id}`,
//           type: 'remboursement',
//           title: 'Remboursement',
//           description: `Montant: ${remboursement.montantRembourse}€`,
//           date: remboursement.dateRemboursement,
//           status: remboursement.statut,
//         });
//       }
//     });

//     // Trier par date décroissante
//     return activities
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
//       .slice(0, 5);
//   }, [consultations, prescriptions, remboursements]);

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Bonjour';
//     if (hour < 18) return 'Bon après-midi';
//     return 'Bonsoir';
//   };

//   const getRoleDisplayName = (roles: Role[]) => {
//     if (roles.includes(Role.ROLE_ADMIN)) return 'Administrateur';
//     if (roles.includes(Role.ROLE_MEDECIN)) return 'Médecin';
//     if (roles.includes(Role.ROLE_ASSURE)) return 'Assuré';
//     return 'Utilisateur';
//   };

//   const getActivityIcon = (type: string) => {
//     switch (type) {
//       case 'consultation':
//         return (
//           <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//             <svg
//               aria-label="Icône de consultation"
//               className="w-4 h-4 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//               />
//             </svg>
//           </div>
//         );
//       case 'prescription':
//         return (
//           <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//             <svg
//               aria-label="Icône de prescription"
//               className="w-4 h-4 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//           </div>
//         );
//       case 'remboursement':
//         return (
//           <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
//             <svg
//               aria-label="Icône de remboursement"
//               className="w-4 h-4 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
//               />
//             </svg>
//           </div>
//         );
//       default:
//         return (
//           <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
//             <svg
//               aria-label="Icône par défaut"
//               className="w-4 h-4 text-white"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           </div>
//         );
//     }
//   };

//   const getStatusBadge = (status: string | undefined, type: string) => {
//     if (!status) return null;

//     let colorClass = 'bg-gray-100 text-gray-800';

//     if (type === 'consultation') {
//       switch (status) {
//         case 'TERMINE':
//           colorClass = 'bg-green-100 text-green-800';
//           break;
//         case 'EN_COURS':
//           colorClass = 'bg-blue-100 text-blue-800';
//           break;
//         case 'PROGRAMME':
//           colorClass = 'bg-yellow-100 text-yellow-800';
//           break;
//         case 'ANNULE':
//           colorClass = 'bg-red-100 text-red-800';
//           break;
//       }
//     } else if (type === 'remboursement') {
//       switch (status) {
//         case 'ACCEPTE':
//           colorClass = 'bg-green-100 text-green-800';
//           break;
//         case 'EN_ATTENTE':
//           colorClass = 'bg-yellow-100 text-yellow-800';
//           break;
//         case 'REFUSE':
//           colorClass = 'bg-red-100 text-red-800';
//           break;
//       }
//     }

//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
//         {status}
//       </span>
//     );
//   };

//   if (consultationsError || prescriptionsError || remboursementsError) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-red-500 text-center">
//           Une erreur s'est produite lors du chargement des données.
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* En-tête de bienvenue */}
//       <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow rounded-lg p-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold">
//               {getGreeting()}, {authState.user?.personne?.prenom || authState.user?.username || 'Utilisateur'}!
//             </h1>
//             <p className="text-blue-100 mt-1">
//               {getRoleDisplayName(authState.user?.roles || [])} - Bienvenue sur votre tableau de bord
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="text-blue-100 text-sm">Aujourd'hui</p>
//             <p className="text-xl font-semibold">
//               {new Date().toLocaleDateString('fr-FR', {
//                 weekday: 'long',
//                 day: 'numeric',
//                 month: 'long',
//               })}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Statistiques rapides */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white overflow-hidden shadow rounded-lg">
//           <div className="p-5">
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
//                   <svg
//                     aria-label="Icône de consultations"
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">Consultations</dt>
//                   <dd className="text-lg font-medium text-gray-900">{stats.consultations}</dd>
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
//                   <svg
//                     aria-label="Icône de prescriptions"
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">Prescriptions</dt>
//                   <dd className="text-lg font-medium text-gray-900">{stats.prescriptions}</dd>
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
//                   <svg
//                     aria-label="Icône de remboursements"
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">Remboursements</dt>
//                   <dd className="text-lg font-medium text-gray-900">{stats.remboursements}</dd>
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
//                   <svg
//                     aria-label="Icône d'activités totales"
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13 10V3L4 14h7v7l9-11h-7z"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <div className="ml-5 w-0 flex-1">
//                 <dl>
//                   <dt className="text-sm font-medium text-gray-500 truncate">Activités totales</dt>
//                   <dd className="text-lg font-medium text-gray-900">{stats.activitesRecentes}</dd>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Contenu principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Activités récentes */}
//         <div className="lg:col-span-2 bg-white shadow rounded-lg">
//           <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//             <h3 className="text-lg leading-6 font-medium text-gray-900">Activités récentes</h3>
//             <p className="mt-1 text-sm text-gray-500">Vos dernières interactions avec le système</p>
//           </div>
//           <div className="px-4 py-5 sm:p-6">
//             {recentActivities.length === 0 ? (
//               <div className="text-center py-6">
//                 <svg
//                   aria-label="Icône d'absence d'activité"
//                   className="mx-auto h-12 w-12 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
//                   />
//                 </svg>
//                 <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune activité récente</h3>
//                 <p className="mt-1 text-sm text-gray-500">
//                   Commencez par créer une consultation ou prescription.
//                 </p>
//               </div>
//             ) : (
//               <div className="flow-root">
//                 <ul className="-mb-8">
//                   {recentActivities.map((activity, index) => (
//                     <li key={activity.id}>
//                       <div className="relative pb-8">
//                         {index !== recentActivities.length - 1 && (
//                           <span
//                             className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
//                             aria-hidden="true"
//                           />
//                         )}
//                         <div className="relative flex space-x-3">
//                           <div>{getActivityIcon(activity.type)}</div>
//                           <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
//                             <div>
//                               <p className="text-sm font-medium text-gray-900">{activity.title}</p>
//                               <p className="text-sm text-gray-500">{activity.description}</p>
//                             </div>
//                             <div className="text-right text-sm whitespace-nowrap text-gray-500 flex flex-col items-end space-y-1">
//                               <time>{new Date(activity.date).toLocaleDateString('fr-FR')}</time>
//                               {getStatusBadge(activity.status, activity.type)}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Actions rapides */}
//         <div className="space-y-6">
//           {/* Raccourcis */}
//           <div className="bg-white shadow rounded-lg">
//             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">Actions rapides</h3>
//             </div>
//             <div className="px-4 py-5 sm:p-6">
//               <div className="space-y-3">
//                 {authState.user?.roles.includes(Role.ROLE_MEDECIN) && (
//                   <>
//                     <button
//                       className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       aria-label="Créer une nouvelle consultation"
//                     >
//                       <svg
//                         className="w-4 h-4 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                         />
//                       </svg>
//                       Nouvelle consultation
//                     </button>
//                     <button
//                       className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                       aria-label="Créer une nouvelle prescription"
//                     >
//                       <svg
//                         className="w-4 h-4 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                         />
//                       </svg>
//                       Nouvelle prescription
//                     </button>
//                   </>
//                 )}

//                 {authState.user?.roles.includes(Role.ROLE_ASSURE) && (
//                   <>
//                     <button
//                       className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
//                       aria-label="Demander un remboursement"
//                     >
//                       <svg
//                         className="w-4 h-4 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
//                         />
//                       </svg>
//                       Demander remboursement
//                     </button>
//                     <button
//                       className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       aria-label="Voir mes consultations"
//                     >
//                       <svg
//                         className="w-4 h-4 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 /native
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6M3 7h18M3 7l2 9a2 2 0 002 2h10a2 2 0 002-2l2-9"
//                         />
//                       </svg>
//                       Mes consultations
//                     </button>
//                   </>
//                 )}

//                 {authState.user?.roles.includes(Role.ROLE_ADMIN) && (
//                   <>
//                     <button
//                       className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                       aria-label="Accéder au tableau de bord administrateur"
//                     >
//                       <svg
//                         className="w-4 h-4 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//                         />
//                       </svg>
//                       Tableau de bord Admin
//                     </button>
//                     <button
//                       className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       aria-label="Gérer les utilisateurs"
//                     >
//                       <svg
//                         className="w-4 h-4 mr-2"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//                         />
//                       </svg>
//                       Gérer les utilisateurs
//                     </button>
//                   </>
//                 )}

//                 <button
//                   className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   aria-label="Voir mon profil"
//                 >
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                     />
//                   </svg>
//                   Mon profil
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Informations système */}
//           <div className="bg-white shadow rounded-lg">
//             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">Informations</h3>
//             </div>
//             <div className="px-4 py-5 sm:p-6">
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Statut du compte</span>
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                     Actif
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Dernière connexion</span>
//                   <span className="text-sm text-gray-900">
//                     {new Date().toLocaleDateString('fr-FR')}
//                   </span>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Type de compte</span>
//                   <span className="text-sm text-gray-900">
//                     {getRoleDisplayName(authState.user?.roles || [])}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Notifications ou alertes */}
//       <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
//         <div className="flex">
//           <div className="flex-shrink-0">
//             <svg
//               aria-label="Icône d'information"
//               className="h-5 w-5 text-blue-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//           </div>
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-blue-800">
//               Bienvenue sur le système de sécurité sociale
//             </h3>
//             <div className="mt-2 text-sm text-blue-700">
//               <p>
//                 Vous pouvez gérer vos consultations, prescriptions et remboursements depuis ce tableau
//                 de bord. En cas de questions, contactez notre support technique.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;