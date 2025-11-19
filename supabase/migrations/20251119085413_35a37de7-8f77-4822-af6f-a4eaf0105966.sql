-- Add monthly_income column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN monthly_income numeric DEFAULT 0;

-- Update RLS policy to allow users to update their monthly income
-- (existing update policy already covers this)