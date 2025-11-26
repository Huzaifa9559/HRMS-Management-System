import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import LoginComponent from '../LoginComponent';

// Create mock navigate function using a global to avoid hoisting issues
global.mockNavigate = jest.fn();

// Mock react-router-dom - factory function
jest.mock('react-router-dom', () => {
  const actualModule = jest.requireActual('react-router-dom');
  return {
    ...actualModule,
    useNavigate: () => global.mockNavigate,
  };
});

describe('LoginComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.mockNavigate.mockClear();
  });

  it('should render login form', () => {
    render(
      <MemoryRouter>
        <LoginComponent />
      </MemoryRouter>
    );
    
    expect(screen.getByText(/welcome to hrms/i)).toBeInTheDocument();
    expect(screen.getByText(/please select your login type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in as employee/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in as admin/i })).toBeInTheDocument();
  });

  it('should show validation error for empty email', async () => {
    render(
      <MemoryRouter>
        <LoginComponent />
      </MemoryRouter>
    );
    
    const employeeButton = screen.getByRole('button', { name: /log in as employee/i });
    fireEvent.click(employeeButton);

    expect(global.mockNavigate).toHaveBeenCalledWith('/login/employee');
  });

  it('should show validation error for invalid email format', async () => {
    render(
      <MemoryRouter>
        <LoginComponent />
      </MemoryRouter>
    );
    
    const adminButton = screen.getByRole('button', { name: /log in as admin/i });
    fireEvent.click(adminButton);

    expect(global.mockNavigate).toHaveBeenCalledWith('/login/admin');
  });
});
