// import { RouterProvider } from 'react-router-dom';
// import router from './router';
// import './index.css';

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;

// App.tsx (version mise à jour avec authentification)
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AuthRouter from './router/AuthRouter';
import AuthHeader from './components/auth/AuthHeader';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AuthHeader />
          <main className="flex-1">
            <AuthRouter />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;