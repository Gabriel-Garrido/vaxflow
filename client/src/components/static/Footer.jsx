import React from 'react';

export const Footer = () => {
  return (
    <div className="custom-footer bg-dark text-light p-2 text-center fixed-bottom">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} VaxFlow. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};
