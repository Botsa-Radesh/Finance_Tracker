-- Fix search path for calculate_next_due_date function
DROP FUNCTION IF EXISTS public.calculate_next_due_date(INTEGER, TEXT, DATE);

CREATE OR REPLACE FUNCTION public.calculate_next_due_date(
  p_due_day INTEGER,
  p_frequency TEXT,
  p_last_paid_date DATE
)
RETURNS DATE
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_base_date DATE;
  v_next_date DATE;
BEGIN
  v_base_date := COALESCE(p_last_paid_date, CURRENT_DATE);
  
  CASE p_frequency
    WHEN 'weekly' THEN
      v_next_date := v_base_date + INTERVAL '7 days';
    WHEN 'monthly' THEN
      v_next_date := DATE_TRUNC('month', v_base_date + INTERVAL '1 month') + (p_due_day - 1) * INTERVAL '1 day';
    WHEN 'quarterly' THEN
      v_next_date := DATE_TRUNC('month', v_base_date + INTERVAL '3 months') + (p_due_day - 1) * INTERVAL '1 day';
    WHEN 'yearly' THEN
      v_next_date := DATE_TRUNC('year', v_base_date + INTERVAL '1 year') + (p_due_day - 1) * INTERVAL '1 day';
  END CASE;
  
  RETURN v_next_date;
END;
$$;