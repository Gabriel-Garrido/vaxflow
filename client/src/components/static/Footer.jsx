import React from 'react';

export const Footer = () => {
  return (
    <div className="fs-3 custom-footer bg-dark text-light p-2 text-center fixed-bottom">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} VaxFlow. Hecho con <i className="fa-solid fa-heart text-danger"></i> por Gabriel Garrido M.</p>
      </div>
    </div>
  );
};
