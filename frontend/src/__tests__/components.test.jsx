import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }));

// Mock api utility
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { notifications: [] } }),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({ user: null, logout: vi.fn() }),
}));

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import EquipmentCard from '../components/equipment/EquipmentCard';
import StarRating from '../components/common/StarRating';

describe('Navbar', () => {
  it('renders brand name', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('FarmRent')).toBeTruthy();
  });

  it('shows login/register links when not logged in', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.getByText('Register')).toBeTruthy();
  });

  it('shows Browse Equipment link', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText('Browse Equipment')).toBeTruthy();
  });
});

describe('Footer', () => {
  it('renders footer brand', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    expect(screen.getByText('FarmRent')).toBeTruthy();
  });

  it('renders tagline', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    expect(screen.getByText(/Connecting farmers/i)).toBeTruthy();
  });
});

describe('EquipmentCard', () => {
  const mockEquipment = {
    _id: '123',
    name: 'Mahindra Tractor',
    category: 'Tractor',
    pricePerDay: 1500,
    photos: [],
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    averageRating: 4.2,
    totalRatings: 10,
    owner: { name: 'Ramu Farmer' },
  };

  it('renders equipment name', () => {
    render(<MemoryRouter><EquipmentCard equipment={mockEquipment} /></MemoryRouter>);
    expect(screen.getByText('Mahindra Tractor')).toBeTruthy();
  });

  it('renders price', () => {
    render(<MemoryRouter><EquipmentCard equipment={mockEquipment} /></MemoryRouter>);
    expect(screen.getByText('1500')).toBeTruthy();
  });

  it('renders location', () => {
    render(<MemoryRouter><EquipmentCard equipment={mockEquipment} /></MemoryRouter>);
    expect(screen.getByText(/Coimbatore/)).toBeTruthy();
  });

  it('renders category badge', () => {
    render(<MemoryRouter><EquipmentCard equipment={mockEquipment} /></MemoryRouter>);
    expect(screen.getByText('Tractor')).toBeTruthy();
  });
});

describe('StarRating', () => {
  it('renders 5 stars', () => {
    const { container } = render(<StarRating value={3} readOnly />);
    const stars = container.querySelectorAll('svg');
    expect(stars.length).toBe(5);
  });
});
