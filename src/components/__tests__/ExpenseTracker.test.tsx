import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseTracker from '../ExpenseTracker';
import { supabase } from '@/integrations/supabase/client';

const mockUser = { id: '123', email: 'test@example.com' };

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser }),
}));

describe('ExpenseTracker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render expense form', () => {
    const { getByPlaceholderText } = render(<ExpenseTracker />);
    
    expect(getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(getByPlaceholderText(/amount/i)).toBeInTheDocument();
  });

  it('should fetch and display expenses', async () => {
    const mockExpenses = [
      { 
        id: '1', 
        description: 'Groceries', 
        amount: 50, 
        category: 'Food', 
        date: '2024-01-01',
        user_id: '123'
      },
      { 
        id: '2', 
        description: 'Gas', 
        amount: 40, 
        category: 'Transport', 
        date: '2024-01-02',
        user_id: '123'
      },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockExpenses,
        error: null,
      }),
    } as any);

    const { findByText } = render(<ExpenseTracker />);

    const grocery = await findByText('Groceries');
    const gas = await findByText('Gas');
    
    expect(grocery).toBeInTheDocument();
    expect(gas).toBeInTheDocument();
  });

  it('should handle empty expenses list', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    } as any);

    const { findByText } = render(<ExpenseTracker />);

    const emptyMessage = await findByText(/no expenses/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});
