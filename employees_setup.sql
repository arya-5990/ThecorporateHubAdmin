  -- ==========================================================================
  -- Supabase Setup Script: Employees ("Our Team" cards)
  -- Run this script in the Supabase SQL Editor. It is safe to re-run.
  --
  -- Photos are stored in Cloudinary (see supabase/functions/cloudinary-sign).
  -- This table only keeps the photo URL and its Cloudinary public_id.
  -- ==========================================================================

  -- 1. Create employees table
  CREATE TABLE IF NOT EXISTS public.employees (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL,
    designation text NOT NULL,
    experience text NOT NULL DEFAULT '',
    description text NOT NULL DEFAULT '',
    responsibilities text[] NOT NULL DEFAULT '{}',
    image_url text NOT NULL DEFAULT '',
    image_public_id text,                      -- Cloudinary public_id (NULL for external / local images)
    sort_order integer NOT NULL DEFAULT 0,     -- display order on the website
    is_active boolean NOT NULL DEFAULT true,   -- hidden from the website when false
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT employees_pkey PRIMARY KEY (id),
    CONSTRAINT employees_name_not_blank CHECK (length(trim(name)) > 0),
    CONSTRAINT employees_designation_not_blank CHECK (length(trim(designation)) > 0)
  );

  CREATE INDEX IF NOT EXISTS employees_sort_order_idx
    ON public.employees (sort_order, created_at);

  -- 2. Keep updated_at current on every update
  CREATE OR REPLACE FUNCTION public.employees_set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
  AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$;

  -- 3. Row Level Security & Trigger (non-destructive IF NOT EXISTS checks)
  ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger
      WHERE tgname = 'employees_set_updated_at'
        AND tgrelid = 'public.employees'::regclass
    ) THEN
      CREATE TRIGGER employees_set_updated_at
        BEFORE UPDATE ON public.employees
        FOR EACH ROW EXECUTE FUNCTION public.employees_set_updated_at();
    END IF;

    -- Main website (anon key) can only read visible employees
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'employees'
        AND policyname = 'Public read active employees'
    ) THEN
      CREATE POLICY "Public read active employees"
        ON public.employees
        FOR SELECT
        TO anon, authenticated
        USING (is_active = true);
    END IF;

    -- Only admin-panel users (app_metadata.role = 'admin') can read hidden rows and write.
    -- This matches the role check in src/LoginPage.jsx.
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'employees'
        AND policyname = 'Admins manage employees'
    ) THEN
      CREATE POLICY "Admins manage employees"
        ON public.employees
        FOR ALL
        TO authenticated
        USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
        WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
    END IF;
  END $$;

  -- 4. Seed the current team (only when the table is empty).
  --    Photos point to /emp*.png in the public folder; re-upload them from the
  --    admin panel to move them to Cloudinary.
  INSERT INTO public.employees (name, designation, experience, description, responsibilities, image_url, sort_order)
  SELECT v.name, v.designation, v.experience, v.description, v.responsibilities, v.image_url, v.sort_order
  FROM (
    VALUES
      (
        'employee 1',
        'Senior Accounts Executive',
        '5+ Years Experience',
        'With 5+ years of experience, Aarav specializes in accounting operations, financial reporting and bookkeeping, supporting businesses with accurate financial records and compliance.',
        ARRAY['Accounting & Bookkeeping', 'Financial Reporting', 'GST Compliance', 'Account Reconciliation', 'Financial Documentation', 'Business Accounting Support'],
        '/emp1.png',
        1
      ),
      (
        'employee 2',
        'Taxation Executive',
        '4+ Years Experience',
        'With 4+ years of experience, Priya specializes in taxation support, tax return preparation and compliance documentation, assisting clients with their tax-related requirements.',
        ARRAY['Income Tax Return Preparation', 'GST Returns & Filings', 'Tax Documentation', 'Tax Compliance Support', 'Financial Record Review', 'Taxation Assistance'],
        '/emp2.jpg',
        2
      ),
      (
        'employee 3',
        'Corporate Compliance Executive',
        '4+ Years Experience',
        'With 4+ years of experience, Rohan supports corporate compliance, statutory documentation and regulatory filings, helping businesses maintain their compliance requirements.',
        ARRAY['Corporate Compliance', 'ROC & MCA Filings', 'Statutory Documentation', 'Company Incorporation Support', 'Annual Compliance', 'Regulatory Documentation'],
        '/emp3.webp',
        3
      )
  ) AS v(name, designation, experience, description, responsibilities, image_url, sort_order)
  WHERE NOT EXISTS (SELECT 1 FROM public.employees);

