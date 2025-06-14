// router/AuthRouter.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types/auth';
import { getDefaultDashboardPath } from '../utils/authUtils';

// Pages publiques
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';

// Pages protégées - Dashboards
import ProtectedRoute from '../components/layout/ProtectedRoute';
// import AdminDashboard from '../pages/dashboard/AdminDashboard';
import AssureDashboard from '../pages/dashboard/AssureDashboard';
// import MedecinDashboard from '../pages/dashboard/MedecinDashboard';
// import UserDashboard from '../pages/dashboard/UserDashboard';
import RemboursementDashboard from '../pages/dashboard/RemboursementDashboard';

// Pages Assurés
import AssureList from '../pages/assures/AssureList';
import { CreateAssure } from '../pages/assures/CreateAssure';
import { UpdateAssure } from '../pages/assures/UpdateAssure';

// Pages Médecins
import { MedecinList } from '../pages/medecins/MedecinList';
import CreateMedecin from '../pages/medecins/CreateMedecin';
import UpdateMedecin from '../pages/medecins/UpdateMedecin';
import MedecinDetails from '../pages/medecins/MedecinDetails';

// Pages Consultations
import { ConsultationList } from '../components/consultations/ConsultationList';
import CreateConsultation from '../pages/consultations/CreateConsultation';
import { UpdateConsultation } from '../pages/consultations/UpdateConsultation';
import ConsultationDetail from '../pages/consultations/ConsultationDetail';

// Pages Prescriptions
import PrescriptionList from '../pages/prescriptions/PrescriptionList';
import { CreatePrescription } from '../pages/prescriptions/CreatePrescription';
import { UpdatePrescription } from '../pages/prescriptions/UpdatePrescription';
import PrescriptionDetail from '../pages/prescriptions/PrescriptionDetail';

// Pages Remboursements
import RemboursementsList from '../pages/remboursements/RemboursementsList';

// Pages Personnes
import { PersonneDashboard } from '../pages/personnes/PersonneDashboard';

// Pages d'erreur
const AccessDenied: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Accès refusé</h1>
      <p className="text-gray-600 mb-8">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <button
        onClick={() => window.history.back()}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Retour
      </button>
    </div>
  </div>
);

const AuthRouter: React.FC = () => {
  const { authState } = useAuth();

  // Composant pour rediriger vers le bon dashboard selon les rôles
  const DashboardRedirect: React.FC = () => {
    if (!authState.user) {
      return <Navigate to="/login" replace />;
    }

    const defaultPath = getDefaultDashboardPath(authState.user.roles);
    return <Navigate to={defaultPath} replace />;
  };

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* Redirection du dashboard général */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        } 
      />

      {/* Dashboards spécifiques par rôle */}
      {/* <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/medecin/dashboard"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_MEDECIN]}>
            <MedecinDashboard />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/assure/dashboard"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ASSURE]}>
            <AssureDashboard />
          </ProtectedRoute>
        }
      />
{/* 
      <Route
        path="/user/dashboard"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_USER]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/remboursement/dashboard"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN, Role.ROLE_ASSURE]}>
            <RemboursementDashboard />
          </ProtectedRoute>
        }
      />

      {/* Routes pour les assurés */}
      <Route
        path="/assures"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN, Role.ROLE_MEDECIN]}>
            <AssureList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assures/new"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN]}>
            <CreateAssure />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assures/:id/edit"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN]}>
            <UpdateAssure />
          </ProtectedRoute>
        }
      />

      {/* Routes pour les médecins */}
      <Route
        path="/medecins"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN]}>
            <MedecinList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medecins/new"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN]}>
            <CreateMedecin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medecins/:id"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN, Role.ROLE_MEDECIN]}>
            <MedecinDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/medecins/:id/edit"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN]}>
            <UpdateMedecin />
          </ProtectedRoute>
        }
      />

      {/* Routes pour les consultations */}
      {/* <Route
        path="/consultations"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_MEDECIN, Role.ROLE_ASSURE, Role.ROLE_ADMIN]}>
            <ConsultationList />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/consultations/new"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_MEDECIN, Role.ROLE_ADMIN]}>
            <CreateConsultation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultations/:id"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_MEDECIN, Role.ROLE_ASSURE, Role.ROLE_ADMIN]}>
            <ConsultationDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultations/:id/edit"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_MEDECIN, Role.ROLE_ADMIN]}>
            <UpdateConsultation />
          </ProtectedRoute>
        }
      />

      {/* Routes pour les prescriptions */}
      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_MEDECIN, Role.ROLE_ASSURE, Role.ROLE_ADMIN]}>
            <PrescriptionList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions/new"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_MEDECIN, Role.ROLE_ADMIN]}>
            <CreatePrescription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions/:id"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_MEDECIN, Role.ROLE_ASSURE, Role.ROLE_ADMIN]}>
            <PrescriptionDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions/:id/edit"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_MEDECIN, Role.ROLE_ADMIN]}>
            <UpdatePrescription />
          </ProtectedRoute>
        }
      />

      {/* Routes pour les remboursements */}
      <Route
        path="/remboursements"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN, Role.ROLE_ASSURE]}>
            <RemboursementsList />
          </ProtectedRoute>
        }
      />

      {/* Routes pour les personnes */}
      <Route
        path="/personnes/dashboard"
        element={
          <ProtectedRoute requiredRoles={[Role.ROLE_ADMIN]}>
            <PersonneDashboard />
          </ProtectedRoute>
        }
      />

      {/* Route par défaut */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AuthRouter;