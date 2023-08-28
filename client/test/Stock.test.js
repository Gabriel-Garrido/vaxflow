import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Stock } from "../src/components/Stock";
import { logout } from '../src/api/authentication';

jest.mock('../api/authentication', () => ({
  logout: jest.fn(),
}));

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

test('logout is executed when token is invalid', async () => {
  // Simulate an invalid token in localStorage
  localStorage.setItem('accessToken', 'invalid_token');

  render(
    <MemoryRouter>
      <Stock />
    </MemoryRouter>
  );

  // Here, the effect of fetchStock inside the Stock component should be triggered

  // Check if the logout function was called
  expect(logout).toHaveBeenCalled();

  // Check if the token is removed from localStorage
  expect(localStorage.getItem('accessToken')).toBeUndefined();

  // You can add more assertions here to check the behavior after logout
});
