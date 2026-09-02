import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AuthPage } from './AuthPage';
import { isAdminViewMode } from '../../lib/auth/client';
import type { ViewMode } from '../../types';

interface ProtectedViewProps {
  viewMode: ViewMode;
  children: React.ReactNode;
}

export const ProtectedView: React.FC<ProtectedViewProps> = ({ viewMode, children }) => {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-gray-500">
        Checking session…
      </div>
    );
  }

  if (viewMode === 'account' && !isAuthenticated) {
    return <AuthPage mode="login" redirectMode="account" />;
  }

  if (isAdminViewMode(viewMode) && !isAdmin) {
    return (
      <AuthPage
        mode="login"
        redirectMode={viewMode}
        adminOnly
      />
    );
  }

  return <>{children}</>;
};
