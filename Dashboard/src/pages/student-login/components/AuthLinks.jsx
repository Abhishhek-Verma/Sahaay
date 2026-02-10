import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';


const AuthLinks = () => {
  const navigate = useNavigate();
  const [showResetModal, setShowResetModal] = useState(false);

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleCounselorLogin = () => {
    navigate('/counselor-login');
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="space-y-6">
      {/* Recovery Links */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 text-sm">
        <Button
          variant="link"
          onClick={() => setShowResetModal(true)}
          iconName="Key"
          iconPosition="left"
          className="text-muted-foreground hover:text-primary p-0 h-auto gentle-transition"
        >
          Forgot Password?
        </Button>

        <Button
          variant="link"
          onClick={handleCreateAccount}
          iconName="UserPlus"
          iconPosition="left"
          className="text-muted-foreground hover:text-primary p-0 h-auto gentle-transition"
        >
          Create Account
        </Button>
      </div>

      {/* Forgot Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowResetModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-4 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              &times;
            </button>
            <div className="text-center">
              <div className="text-3xl mb-3">🔐</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Reset Your Password</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please contact the admin to reset your password.
              </p>
              <a
                href="mailto:sahaay.support@gmail.com?subject=Password Reset Request&body=Hi Admin,%0A%0AI would like to request a password reset for my account.%0A%0AMy username: %0A%0AThank you."
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                ✉️ sahaay.support@gmail.com
              </a>
              <p className="text-xs text-gray-400 mt-4 leading-relaxed">
                For your privacy and security, password resets are handled manually by the admin.
              </p>
            </div>
          </div>
        </div>
      )}


      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/30"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground font-caption">
            Other Portals
          </span>
        </div>
      </div> */}

      {/* Role-based Login Links */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> */}
      {/* <Button
          variant="ghost"
          onClick={handleCounselorLogin}
          iconName="Stethoscope"
          iconPosition="left"
          className="justify-start border border-border/30 hover:bg-secondary/10 gentle-hover"
        >
          <div className="text-left">
            <div className="font-medium text-sm">Counselor Portal</div>
            <div className="text-xs text-muted-foreground">Manage sessions & students</div>
          </div>
        </Button> */}

      {/* <Button
          variant="ghost"
          onClick={handleAdminLogin}
          iconName="Settings"
          iconPosition="left"
          className="justify-start border border-border/30 hover:bg-accent/10 gentle-hover"
        >
          <div className="text-left">
            <div className="font-medium text-sm">Admin Portal</div>
            <div className="text-xs text-muted-foreground">Analytics & management</div>
          </div>
        </Button> */}
      {/* </div> */}

      {/* Support Information */}
      <div className="text-center pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground mb-2">
          Need immediate support?
        </p>

      </div>
    </div>
  );
};

export default AuthLinks;
