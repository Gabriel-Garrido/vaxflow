import React from 'react';
import { render } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/AuthProvider'; // Ajusta la ruta según la ubicación de tus archivos

// Mock del localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key],
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: key => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('AuthProvider', () => {
  test('auth state and user are set correctly when valid user and token are present', () => {
    // Simulate saved user and token in localStorage
    const savedUser = { id: 1, username: 'testuser' };
    const savedToken = 'valid_token';
    localStorage.setItem('user', JSON.stringify(savedUser));
    localStorage.setItem('accessToken', savedToken);

    // Render the AuthProvider
    const { result } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Custom TestComponent using useAuth hook
    function TestComponent() {
      const auth = useAuth();

      return (
        <div>
          <span>{auth.isAuthenticated.toString()}</span>
          <span>{auth.user ? auth.user.username : 'No user'}</span>
        </div>
      );
    }

    // Verify that the AuthProvider sets the correct auth state and user from localStorage
    const isAuthenticatedElement = result.getByText('true');
    const usernameElement = result.getByText('testuser');
    expect(isAuthenticatedElement).toBeInTheDocument();
    expect(usernameElement).toBeInTheDocument();
  });

  test('auth state and user are cleared when invalid user or token are present', () => {
    // Clear the localStorage before rendering the AuthProvider
    localStorage.clear();

    // Simulate invalid user and token in localStorage
    const savedUser = { id: 1, username: '' };
    const savedToken = '    '; // Blank token
    localStorage.setItem('user', JSON.stringify(savedUser));
    localStorage.setItem('accessToken', savedToken);

    // Render the AuthProvider
    const { result } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Custom TestComponent using useAuth hook
    function TestComponent() {
      const auth = useAuth();

      return (
        <div>
          <span>{auth.isAuthenticated.toString()}</span>
          <span>{auth.user ? auth.user.username : 'No user'}</span>
        </div>
      );
    }

    // Verify that the AuthProvider clears auth state and user from localStorage
    const isAuthenticatedElement = result.getByText('false');
    const usernameElement = result.getByText('No user');
    expect(isAuthenticatedElement).toBeInTheDocument();
    expect(usernameElement).toBeInTheDocument();
  });

  test('auth state and user are cleared when localStorage is empty', () => {
    // Clear the localStorage before rendering the AuthProvider
    localStorage.clear();

    // Render the AuthProvider
    const { result } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Custom TestComponent using useAuth hook
    function TestComponent() {
      const auth = useAuth();

      return (
        <div>
          <span>{auth.isAuthenticated.toString()}</span>
          <span>{auth.user ? auth.user.username : 'No user'}</span>
        </div>
      );
    }

    // Verify that the AuthProvider clears auth state and user from localStorage
    const isAuthenticatedElement = result.getByText('false');
    const usernameElement = result.getByText('No user');
    expect(isAuthenticatedElement).toBeInTheDocument();
    expect(usernameElement).toBeInTheDocument();
  });
});
