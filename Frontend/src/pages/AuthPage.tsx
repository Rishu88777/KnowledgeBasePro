import React from 'react';
import { useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

export default function AuthPage() {
  const location = useLocation();
  
  const getFormComponent = () => {
    switch (location.pathname) {
      case '/register':
        return <RegisterForm />;
      case '/forgot-password':
        return <ForgotPasswordForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {getFormComponent()}
      </div>
    </div>
  );
}