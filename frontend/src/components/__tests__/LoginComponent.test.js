import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Create a shared reference object
const mockRef = { navigate: null };

// Mock react-router-dom - initialize mock inside factory
jest.mock('react-router-dom', () => {
  const actualModule = jest.requireActual('react-router-dom');
  // Create mock function inside factory
  mockRef.navigate = jest.fn();
  return {
    ...actualModule,
    useNavigate: () => mockRef.navigate,
  };
});

// Import component after mock
import LoginComponent from '../LoginComponent';

describe('LoginComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    if (mockRef.navigate) {
      mockRef.navigate.mockClear();
    }
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

    expect(mockRef.navigate).toHaveBeenCalledWith('/login/employee');
  });

  it('should show validation error for invalid email format', async () => {
    render(
      <MemoryRouter>
        <LoginComponent />
      </MemoryRouter>
    );
    
    const adminButton = screen.getByRole('button', { name: /log in as admin/i });
    fireEvent.click(adminButton);

    expect(mockRef.navigate).toHaveBeenCalledWith('/login/admin');
  });
});
