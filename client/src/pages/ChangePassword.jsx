import { useState } from 'react';
import { changePassword } from '../api/authentication';

export function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      await changePassword({ new_password: newPassword });
      console.log('Password changed successfully');
      // Puedes manejar el feedback al usuario o redirigir después de cambiar la contraseña
    } catch (error) {
      console.error('Change password error:', error);
    }
  };

  return (
    <div>
      <input
        type="password"
        placeholder="New Password"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
}