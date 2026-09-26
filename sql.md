-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.profiles (
  id uuid NOT NULL,
  name text,
  email text UNIQUE,
  phone_number text,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.contact_submissions (
  id text NOT NULL DEFAULT ('SUB-'::text || lpad((floor(((random() * (900000)::double precision) + (100000)::double precision)))::text, 6, '0'::text)),
  fullName text NOT NULL,
  email text NOT NULL,
  phone text,
  service text,
  subject text NOT NULL,
  message text NOT NULL,
  date timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'New'::text,
  ip_address text,
  created_at timestamp with time zone DEFAULT now(),
  landing_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  CONSTRAINT contact_submissions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.seo_locations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  city_name text NOT NULL,
  state_name text NOT NULL,
  city_slug text NOT NULL UNIQUE,
  state_slug text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT seo_locations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.seo_services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  service_slug text NOT NULL UNIQUE,
  parent_service text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT seo_services_pkey PRIMARY KEY (id)
);
CREATE TABLE public.seo_location_pages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  location_id uuid NOT NULL,
  service_id uuid NOT NULL,
  h1 text NOT NULL,
  meta_title text NOT NULL,
  meta_description text NOT NULL,
  intro text,
  local_information text,
  why_choose_service text,
  process text,
  documents text,
  pricing text,
  timeline text,
  why_corporate_hub text,
  canonical_url text,
  og_image text,
  published boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT seo_location_pages_pkey PRIMARY KEY (id),
  CONSTRAINT seo_location_pages_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.seo_locations(id),
  CONSTRAINT seo_location_pages_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.seo_services(id)
);
CREATE TABLE public.seo_faqs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT seo_faqs_pkey PRIMARY KEY (id),
  CONSTRAINT seo_faqs_page_id_fkey FOREIGN KEY (page_id) REFERENCES public.seo_location_pages(id)
);
CREATE TABLE public.seo_internal_links (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  source_page_id uuid NOT NULL,
  target_page_id uuid NOT NULL,
  anchor_text text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT seo_internal_links_pkey PRIMARY KEY (id),
  CONSTRAINT seo_internal_links_source_page_id_fkey FOREIGN KEY (source_page_id) REFERENCES public.seo_location_pages(id),
  CONSTRAINT seo_internal_links_target_page_id_fkey FOREIGN KEY (target_page_id) REFERENCES public.seo_location_pages(id)
);

-- ==============================================================================
-- DYNAMIC XML SITEMAP TABLE SCHEMA
-- Run this in Supabase SQL Editor if not already created
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.seo_sitemaps (
  id text PRIMARY KEY DEFAULT 'default',
  xml_content text NOT NULL,
  urls_count integer NOT NULL DEFAULT 0,
  routes_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  last_generated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.seo_sitemaps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read seo_sitemaps" ON public.seo_sitemaps;
DROP POLICY IF EXISTS "Anyone can insert seo_sitemaps" ON public.seo_sitemaps;
DROP POLICY IF EXISTS "Anyone can update seo_sitemaps" ON public.seo_sitemaps;

-- Public read access so Next.js frontend and Googlebot can fetch without restrictions
CREATE POLICY "Public read seo_sitemaps"
  ON public.seo_sitemaps
  FOR SELECT
  USING (true);

-- Allow inserting/updating for admin panel sync and fallback builders
CREATE POLICY "Anyone can insert seo_sitemaps"
  ON public.seo_sitemaps
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update seo_sitemaps"
  ON public.seo_sitemaps
  FOR UPDATE
  USING (true);

