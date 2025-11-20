import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import IncomeManager from '../IncomeManager';
import { supabase } from '@/integrations/supabase/client';

const mockUser = { id: '123', email: 'test@example.com' };

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser }),
}));

describe('IncomeManager Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    const { container } = render(<IncomeManager />);
    const loadingElement = container.querySelector('.animate-pulse');
    expect(loadingElement).toBeInTheDocument();
  });

  it('should fetch and display monthly income', async () => {
    const mockIncome = 5000;
    
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { monthly_income: mockIncome },
        error: null,
      }),
    } as any);

    const { findByText } = render(<IncomeManager />);
    const incomeElement = await findByText(/₹5,000/);
    expect(incomeElement).toBeInTheDocument();
  });

  it('should handle zero income correctly', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: { monthly_income: 0 },
        error: null,
      }),
    } as any);

    const { findByText } = render(<IncomeManager />);
    const incomeElement = await findByText(/₹0/);
    expect(incomeElement).toBeInTheDocument();
  });
});
