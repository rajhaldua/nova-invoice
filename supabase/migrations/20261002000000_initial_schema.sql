-- Initial Schema for NovaInvoice

-- 1. Profiles (linked to auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Organizations
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  legal_name text,
  logo_url text,
  email text,
  phone text,
  address text,
  city text,
  state text,
  postal_code text,
  country text,
  currency text DEFAULT 'USD',
  timezone text DEFAULT 'UTC',
  tax_id text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Organization Members
CREATE TYPE public.member_role AS ENUM ('owner', 'admin', 'member', 'accountant');

CREATE TABLE public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.member_role DEFAULT 'owner' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(organization_id, user_id)
);

-- 4. Customers
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  company_name text,
  email text,
  phone text,
  tax_id text,
  currency text,
  billing_address text,
  shipping_address text,
  payment_terms text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz
);

-- 5. Products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text,
  description text,
  unit text,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  tax_rate numeric(5,2) DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz
);

-- 6. Invoices
CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'viewed', 'partially_paid', 'paid', 'overdue', 'cancelled');

CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES public.customers(id),
  invoice_number text NOT NULL,
  status public.invoice_status DEFAULT 'draft' NOT NULL,
  issue_date date,
  due_date date,
  currency text DEFAULT 'USD',
  subtotal numeric(12,2) DEFAULT 0,
  discount_total numeric(12,2) DEFAULT 0,
  tax_total numeric(12,2) DEFAULT 0,
  total numeric(12,2) DEFAULT 0,
  amount_paid numeric(12,2) DEFAULT 0,
  amount_due numeric(12,2) DEFAULT 0,
  notes text,
  terms text,
  public_token uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz,
  UNIQUE(organization_id, invoice_number)
);

-- 7. Invoice Items
CREATE TABLE public.invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  description text,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  discount numeric(12,2) DEFAULT 0,
  tax_rate numeric(5,2) DEFAULT 0,
  line_total numeric(12,2) NOT NULL DEFAULT 0,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 8. Estimates
CREATE TYPE public.estimate_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'rejected', 'converted', 'expired');

CREATE TABLE public.estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES public.customers(id),
  estimate_number text NOT NULL,
  status public.estimate_status DEFAULT 'draft' NOT NULL,
  issue_date date,
  expiry_date date,
  currency text DEFAULT 'USD',
  subtotal numeric(12,2) DEFAULT 0,
  discount_total numeric(12,2) DEFAULT 0,
  tax_total numeric(12,2) DEFAULT 0,
  total numeric(12,2) DEFAULT 0,
  notes text,
  terms text,
  public_token uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  deleted_at timestamptz,
  UNIQUE(organization_id, estimate_number)
);

-- 9. Estimate Items
CREATE TABLE public.estimate_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id uuid NOT NULL REFERENCES public.estimates(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  description text,
  quantity numeric(10,2) NOT NULL DEFAULT 1,
  unit_price numeric(12,2) NOT NULL DEFAULT 0,
  discount numeric(12,2) DEFAULT 0,
  tax_rate numeric(5,2) DEFAULT 0,
  line_total numeric(12,2) NOT NULL DEFAULT 0,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 10. Payments
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES public.customers(id),
  amount numeric(12,2) NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text,
  gateway text,
  gateway_reference text,
  status public.payment_status DEFAULT 'pending' NOT NULL,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 11. Invoice Events (Audit log)
CREATE TABLE public.invoice_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  event_type text NOT NULL, 
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 12. Email Logs
CREATE TABLE public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES public.invoices(id) ON DELETE SET NULL,
  recipient text NOT NULL,
  template text NOT NULL,
  status text NOT NULL,
  provider_id text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 13. Attachments
CREATE TABLE public.attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  entity_type text NOT NULL, 
  entity_id uuid NOT NULL,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size integer,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 14. Settings
CREATE TABLE public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  key text NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(organization_id, key)
);

-------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimate_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.is_org_member(org_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Members can view organizations" 
ON public.organizations FOR SELECT USING (is_org_member(id));
CREATE POLICY "Members can update organizations" 
ON public.organizations FOR UPDATE USING (is_org_member(id));
CREATE POLICY "Authenticated users can create organizations"
ON public.organizations FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Members can view org members" 
ON public.organization_members FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  )
);
CREATE POLICY "Authenticated users can insert themselves"
ON public.organization_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Org members can view customers" ON public.customers FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can insert customers" ON public.customers FOR INSERT WITH CHECK (is_org_member(organization_id));
CREATE POLICY "Org members can update customers" ON public.customers FOR UPDATE USING (is_org_member(organization_id));

CREATE POLICY "Org members can view products" ON public.products FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can insert products" ON public.products FOR INSERT WITH CHECK (is_org_member(organization_id));
CREATE POLICY "Org members can update products" ON public.products FOR UPDATE USING (is_org_member(organization_id));

CREATE POLICY "Org members can view invoices" ON public.invoices FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can insert invoices" ON public.invoices FOR INSERT WITH CHECK (is_org_member(organization_id));
CREATE POLICY "Org members can update invoices" ON public.invoices FOR UPDATE USING (is_org_member(organization_id));

CREATE POLICY "Org members can view invoice items" ON public.invoice_items FOR SELECT USING (
  invoice_id IN (SELECT id FROM public.invoices WHERE is_org_member(organization_id))
);
CREATE POLICY "Org members can insert invoice items" ON public.invoice_items FOR INSERT WITH CHECK (
  invoice_id IN (SELECT id FROM public.invoices WHERE is_org_member(organization_id))
);
CREATE POLICY "Org members can update invoice items" ON public.invoice_items FOR UPDATE USING (
  invoice_id IN (SELECT id FROM public.invoices WHERE is_org_member(organization_id))
);
CREATE POLICY "Org members can delete invoice items" ON public.invoice_items FOR DELETE USING (
  invoice_id IN (SELECT id FROM public.invoices WHERE is_org_member(organization_id))
);

CREATE POLICY "Org members can view estimates" ON public.estimates FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can insert estimates" ON public.estimates FOR INSERT WITH CHECK (is_org_member(organization_id));
CREATE POLICY "Org members can update estimates" ON public.estimates FOR UPDATE USING (is_org_member(organization_id));

CREATE POLICY "Org members can view estimate items" ON public.estimate_items FOR SELECT USING (
  estimate_id IN (SELECT id FROM public.estimates WHERE is_org_member(organization_id))
);
CREATE POLICY "Org members can insert estimate items" ON public.estimate_items FOR INSERT WITH CHECK (
  estimate_id IN (SELECT id FROM public.estimates WHERE is_org_member(organization_id))
);
CREATE POLICY "Org members can update estimate items" ON public.estimate_items FOR UPDATE USING (
  estimate_id IN (SELECT id FROM public.estimates WHERE is_org_member(organization_id))
);
CREATE POLICY "Org members can delete estimate items" ON public.estimate_items FOR DELETE USING (
  estimate_id IN (SELECT id FROM public.estimates WHERE is_org_member(organization_id))
);

CREATE POLICY "Org members can view payments" ON public.payments FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can insert payments" ON public.payments FOR INSERT WITH CHECK (is_org_member(organization_id));
CREATE POLICY "Org members can update payments" ON public.payments FOR UPDATE USING (is_org_member(organization_id));

CREATE POLICY "Org members can view invoice events" ON public.invoice_events FOR SELECT USING (
  invoice_id IN (SELECT id FROM public.invoices WHERE is_org_member(organization_id))
);
CREATE POLICY "Org members can insert invoice events" ON public.invoice_events FOR INSERT WITH CHECK (
  invoice_id IN (SELECT id FROM public.invoices WHERE is_org_member(organization_id))
);

CREATE POLICY "Org members can view email logs" ON public.email_logs FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can insert email logs" ON public.email_logs FOR INSERT WITH CHECK (is_org_member(organization_id));

CREATE POLICY "Org members can view attachments" ON public.attachments FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can insert attachments" ON public.attachments FOR INSERT WITH CHECK (is_org_member(organization_id));
CREATE POLICY "Org members can delete attachments" ON public.attachments FOR DELETE USING (is_org_member(organization_id));

CREATE POLICY "Org members can view settings" ON public.settings FOR SELECT USING (is_org_member(organization_id));
CREATE POLICY "Org members can update settings" ON public.settings FOR UPDATE USING (is_org_member(organization_id));
CREATE POLICY "Org members can insert settings" ON public.settings FOR INSERT WITH CHECK (is_org_member(organization_id));

-- Create organization safely via RPC to avoid RLS circular dependencies
CREATE OR REPLACE FUNCTION create_organization(org_name text, org_currency text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_org_id uuid;
BEGIN
  -- Insert the organization
  INSERT INTO organizations (name, currency)
  VALUES (org_name, org_currency)
  RETURNING id INTO new_org_id;

  -- Add the current user as owner
  INSERT INTO organization_members (organization_id, user_id, role)
  VALUES (new_org_id, auth.uid(), 'owner');

  RETURN new_org_id;
END;
$$;


-- Fix RLS so users can see their own memberships, which also unblocks the recursive 'Members can view org members' policy
CREATE POLICY "Users can view their own memberships" ON organization_members FOR SELECT USING (user_id = auth.uid());

