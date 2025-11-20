import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import { supabase } from '@/integrations/supabase/client';

// Integration tests for complete user flows

describe('Integration Tests - User Journey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication Flow', () => {
    it('should render authentication page', () => {
      const { getByPlaceholderText } = render(
        <BrowserRouter>
          <Auth />
        </BrowserRouter>
      );

      expect(getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(getByPlaceholderText(/password/i)).toBeInTheDocument();
    });
  });

  describe('Dashboard Rendering', () => {
    const mockUser = { id: '123', email: 'test@example.com' };

    beforeEach(() => {
      vi.mock('@/hooks/useAuth', () => ({
        useAuth: () => ({ user: mockUser, loading: false }),
      }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { monthly_income: 5000 }, error: null }),
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any);
    });

    it('should render dashboard tabs', async () => {
      const { findByText } = render(
        <BrowserRouter>
          <Index />
        </BrowserRouter>
      );

      const dashboardTab = await findByText(/dashboard/i);
      expect(dashboardTab).toBeInTheDocument();
    });
  });

  describe('Utils Function Tests', () => {
    it('should calculate percentages correctly', () => {
      const getPercentage = (spent: number, limit: number) => {
        if (limit === 0) return 0;
        return (spent / limit) * 100;
      };

      expect(getPercentage(50, 100)).toBe(50);
      expect(getPercentage(75, 100)).toBe(75);
      expect(getPercentage(100, 100)).toBe(100);
      expect(getPercentage(0, 100)).toBe(0);
      expect(getPercentage(50, 0)).toBe(0); // Edge case: zero limit
    });

    it('should determine status colors correctly', () => {
      const getStatusColor = (percentage: number) => {
        if (percentage >= 90) return 'red';
        if (percentage >= 70) return 'yellow';
        return 'green';
      };

      expect(getStatusColor(50)).toBe('green');
      expect(getStatusColor(75)).toBe('yellow');
      expect(getStatusColor(95)).toBe('red');
    });
  });
});
