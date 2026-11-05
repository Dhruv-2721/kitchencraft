import React, { useState } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';

import HomePage from './pages/HomePage.jsx';
import DesignerStudioPage from './pages/DesignerStudioPage.jsx';
import Kitchen3DStudioPage from './pages/Kitchen3DStudioPage.jsx';
import LayoutSelectorPage from './pages/LayoutSelectorPage.jsx';
import MaterialCataloguePage from './pages/MaterialCataloguePage.jsx';
import CostEstimatorPage from './pages/CostEstimatorPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import ConsultationPage from './pages/ConsultationPage.jsx';
import DashboardOverview from './pages/DashboardOverview.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AuthModal from './pages/AuthModal.jsx';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ProjectProvider } from './context/ProjectContext.jsx';

function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();

  // Scroll to top whenever tab changes
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render content according to active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onSelectTab={handleSelectTab} />;
      case 'designer':
        return <DesignerStudioPage onSelectTab={handleSelectTab} />;
      case '3d-studio':
        return <Kitchen3DStudioPage onSelectTab={handleSelectTab} />;
      case 'layouts':
        return <LayoutSelectorPage onSelectTab={handleSelectTab} />;
      case 'catalogue':
        return <MaterialCataloguePage />;
      case 'estimator':
        return <CostEstimatorPage onSelectTab={handleSelectTab} />;
      case 'projects':
      case 'saved-designs':
        return <ProjectsPage onSelectTab={handleSelectTab} />;
      case 'consultation':
      case 'consultations':
        return <ConsultationPage />;
      case 'dashboard':
      case 'overview':
        return (
          <DashboardLayout
            activeSection={activeTab}
            onSelectSection={handleSelectTab}
          >
            <DashboardOverview onSelectTab={handleSelectTab} />
          </DashboardLayout>
        );
      case 'upload':
        return (
          <DashboardLayout
            activeSection="upload"
            onSelectSection={handleSelectTab}
          >
            <DesignerStudioPage onSelectTab={handleSelectTab} />
          </DashboardLayout>
        );
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <HomePage onSelectTab={handleSelectTab} />;
    }
  };

  const isDashboardView = activeTab === 'dashboard' || activeTab === 'overview' || activeTab === 'upload';

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#292929] selection:bg-[#52634A] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer (omitted inside dashboard for clean workspace feel, included everywhere else) */}
      {!isDashboardView && <Footer onSelectTab={handleSelectTab} />}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <MainApp />
      </ProjectProvider>
    </AuthProvider>
  );
}
