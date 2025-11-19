-- Create bills table for tracking recurring expenses
CREATE TABLE public.bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT NOT NULL,
  due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  reminder_days_before INTEGER NOT NULL DEFAULT 3,
  last_paid_date DATE,
  next_due_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own bills"
ON public.bills
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bills"
ON public.bills
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bills"
ON public.bills
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bills"
ON public.bills
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_bills_updated_at
BEFORE UPDATE ON public.bills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate next due date
CREATE OR REPLACE FUNCTION public.calculate_next_due_date(
  p_due_day INTEGER,
  p_frequency TEXT,
  p_last_paid_date DATE
)
RETURNS DATE
LANGUAGE plpgsql
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