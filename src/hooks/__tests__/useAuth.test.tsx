import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from '../useAuth';
import { supabase } from '@/integrations/supabase/client';

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.session).toBe(null);
  });

  it('should have signOut method', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(typeof result.current.signOut).toBe('function');
  });

  it('should call supabase signOut when signOut is called', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth());
    await result.current.signOut();

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
