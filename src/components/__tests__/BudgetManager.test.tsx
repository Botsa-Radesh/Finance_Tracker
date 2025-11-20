import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import BudgetManager from '../BudgetManager';
import { supabase } from '@/integrations/supabase/client';

const mockUser = { id: '123', email: 'test@example.com' };

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser }),
}));

describe('BudgetManager Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    const { getByText } = render(<BudgetManager />);
    expect(getByText(/loading budgets/i)).toBeInTheDocument();
  });

  it('should display budgets list', async () => {
    const mockBudgets = [
      { id: '1', category: 'Food', limit_amount: 500, spent: 200, user_id: '123' },
      { id: '2', category: 'Transport', limit_amount: 300, spent: 150, user_id: '123' },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockBudgets,
        error: null,
      }),
    } as any);

    const { findByText } = render(<BudgetManager />);
    
    const foodBudget = await findByText('Food');
    const transportBudget = await findByText('Transport');
    
    expect(foodBudget).toBeInTheDocument();
    expect(transportBudget).toBeInTheDocument();
  });

  it('should calculate total budget correctly', async () => {
    const mockBudgets = [
      { id: '1', category: 'Food', limit_amount: 500, spent: 200, user_id: '123' },
      { id: '2', category: 'Transport', limit_amount: 300, spent: 150, user_id: '123' },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockBudgets,
        error: null,
      }),
    } as any);

    const { findByText } = render(<BudgetManager />);
    
    // Total budget should be 800 (500 + 300)
    const totalElement = await findByText(/₹800/);
    expect(totalElement).toBeInTheDocument();
  });
});
