-- ==========================================================================
-- Supabase Setup Script: SEO Service Templates & Seed Data (First 5 Services)
-- Run this script in the Supabase SQL Editor
-- ==========================================================================

-- 1. Create seo_service_templates Table
CREATE TABLE IF NOT EXISTS public.seo_service_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL,
  template_name text NOT NULL,
  h1 text DEFAULT '',
  meta_title text DEFAULT '',
  meta_description text DEFAULT '',
  intro text DEFAULT '',
  what_is_service text DEFAULT '',
  who_should_choose text DEFAULT '',
  key_benefits text DEFAULT '',
  eligibility text DEFAULT '',
  documents text DEFAULT '',
  process text DEFAULT '',
  timeline text DEFAULT '',
  tax_compliance text DEFAULT '',
  comparison text DEFAULT '',
  how_it_helps text DEFAULT '',
  local_information text DEFAULT '',
  why_corporate_hub text DEFAULT '',
  why_choose_service text DEFAULT '',
  related_services text DEFAULT '',
  call_to_action text DEFAULT '',
  pricing text DEFAULT '',
  og_image text DEFAULT '/logo.png',
  faqs jsonb DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT seo_service_templates_pkey PRIMARY KEY (id),
  CONSTRAINT seo_service_templates_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.seo_services(id) ON DELETE CASCADE,
  CONSTRAINT seo_service_templates_service_id_key UNIQUE (service_id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.seo_service_templates ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies (Idempotent policy creation)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'seo_service_templates' 
    AND policyname = 'Allow full access to authenticated users'
  ) THEN
    CREATE POLICY "Allow full access to authenticated users" 
    ON public.seo_service_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'seo_service_templates' 
    AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" 
    ON public.seo_service_templates FOR SELECT TO anon, authenticated USING (true);
  END IF;
END $$;

-- 4. Ensure the 5 Services exist in seo_services
INSERT INTO public.seo_services (service_name, service_slug, parent_service, is_active)
VALUES
  ('Company Registration', 'company-registration', 'business-registration', true),
  ('LLP Registration', 'llp', 'business-registration', true),
  ('One Person Company Registration', 'opc', 'business-registration', true),
  ('Section 8 Company Registration', 'section-8-company', 'business-registration', true),
  ('Startup India Registration', 'startup-india-registration', 'business-registration', true)
ON CONFLICT (service_slug) DO UPDATE 
SET service_name = EXCLUDED.service_name;

-- 5. Insert or Update the 5 Master Templates

-- Template: Private Limited Company Registration Template
INSERT INTO public.seo_service_templates (
  service_id, template_name, h1, meta_title, meta_description,
  intro, what_is_service, who_should_choose, key_benefits,
  eligibility, documents, process, timeline, tax_compliance,
  comparison, how_it_helps, local_information, why_corporate_hub,
  why_choose_service, related_services, call_to_action, pricing,
  og_image, faqs, is_active
) VALUES (
  (SELECT id FROM public.seo_services WHERE service_slug = 'company-registration' LIMIT 1),
  'Private Limited Company Registration Template',
  'Private Limited Company Registration in {{CITY}}. Build a Business That Is Ready to Grow.',
  'Private Limited Company Registration in {{CITY}} | The Corporate Hub',
  'A Private Limited Company is more than just a business registration. Professional private limited company registration services in {{CITY}}, {{STATE}} by The...',
  'A Private Limited Company is more than just a business registration.

It gives your business a separate legal identity, structured ownership and a strong foundation for funding, team building and future expansion.

Whether you are starting a new business, building a startup or planning to scale an existing venture, choosing the right structure from the beginning can make future growth much easier.

Start Right → Build Credibility → Raise Capital → Expand',
  'A Private Limited Company is a company incorporated under the Companies Act, 2013.

It has a legal identity separate from its shareholders and operates through a structured ownership and management framework involving shareholders and directors.

It is one of the most suitable structures for entrepreneurs who want to build a scalable, professionally managed and investment-ready business.',
  'A Private Limited Company can be suitable for:

Startups

Two or more founders

Growing businesses

Technology companies

E-commerce businesses

Manufacturing businesses

Businesses planning to raise investment

Businesses planning ESOPs

Companies dealing with corporates and institutions

Entrepreneurs planning long-term expansion

If your vision is to build something bigger than a small owner-managed business, a Private Limited Company can provide the structure required for that journey.',
  'Separate Legal Identity

The company has its own legal identity separate from its shareholders.

Limited Liability

Shareholders generally have limited liability, subject to applicable law and circumstances such as personal guarantees.

Structured Ownership

Ownership is represented through shares, making founder and investor ownership easier to define.

Funding Friendly

A Private Limited Company is generally the preferred structure for angel investors, venture capital and equity investment.

ESOP Opportunity

Eligible companies can create ESOP structures to attract and retain employees, subject to applicable law.

Perpetual Succession

The company continues to exist despite changes in shareholders or directors.

Professional Business Structure

A corporate structure can improve the way the business presents itself to customers, vendors, employees, lenders and investors.',
  'Generally, a Private Limited Company requires:

Minimum 2 Shareholders

Minimum 2 Directors

At least 1 Resident Director, as required under applicable law

Registered Office in India

Unique and acceptable company name

Digital Signature Certificate (DSC)

Lawful business activity

Proposed share capital and shareholding structure

There is no prescribed minimum paid-up capital requirement for a normal Private Limited Company.',
  'Directors & Shareholders

[DOCUMENT LIST TO BE ADDED]

Registered Office

[DOCUMENT LIST TO BE ADDED]

Business Details

[DOCUMENT LIST TO BE ADDED]',
  'We keep the incorporation process simple:

Business Discussion
↓
Structure & Shareholding Planning
↓
Name Selection
↓
DSC
↓
Incorporation Documents
↓
MCA Filing
↓
Certificate of Incorporation
↓
PAN & TAN
↓
Post-Incorporation Guidance

Our approach is not only to incorporate the company, but also to help ensure that the initial structure is aligned with the founders'' business plans.',
  'Approximately 10 Working Days*

The actual timeline depends upon:

Document Readiness | Name Availability | MCA Processing | Resubmission, if any | Regulatory Approval

The timeline is indicative and cannot be guaranteed.',
  'A Private Limited Company is subject to corporate taxation and ongoing statutory compliance.

An eligible domestic company opting for Section 115BAA can be taxed at:

Income Tax: 22%
Surcharge: 10%
Health & Education Cess: 4%

This results in an effective tax rate of approximately 25.17%, subject to prescribed conditions.

Other tax regimes may apply depending upon the company''s eligibility and circumstances.

After incorporation, applicable compliances may include:

Accounting | Income Tax Return | ROC Annual Filing | Statutory Audit | Board Meetings | GST | TDS | Payroll | PF/ESIC | Other Business-Specific Compliance',
  '*Subject to applicable law and exceptions.',
  'This is where the real value of the structure begins.

Build Credibility

Operate through a recognised corporate structure while dealing with:

Customers | Vendors | Banks | Corporates | Employees | Investors

Bring Co-Founders Together

Clearly define:

Shareholding | Ownership | Roles | Capital Contribution | Future Equity

Raise Equity Investment

A Private Limited Company can issue shares and is generally better suited for:

Angel Investment → Venture Capital → Strategic Investors

subject to applicable corporate, securities, FEMA and other laws.

Build Your Team

As the business grows, ESOPs can be considered to attract and retain key employees.

Expand Your Business

A structured company can support:

New Products → New Locations → Larger Contracts → New Investors → Bigger Operations

Build for the Future

Your journey can evolve from:

Idea → Company → Team → Revenue → Funding → Expansion

A Private Limited Company does not guarantee growth or funding, but it creates a structure capable of supporting them.',
  'The Corporate Hub assists entrepreneurs and businesses in {{CITY}}, {{STATE}} with Private Limited Company Registration.

The Corporate Hub assists entrepreneurs and businesses across Gujarat and India with company incorporation and ongoing business support.

Whether the founders are based in:

Ahmedabad | Surat | Vadodara | Rajkot | Gandhinagar | Other Parts of Gujarat | Anywhere in India

much of the company incorporation process is handled digitally through the MCA framework.

Our support can continue beyond registration through accounting, taxation, compliance, licences and business advisory.',
  'We Don''t Just Register Your Company. We Help Structure Your Business.

Before incorporation, we look at factors such as:

Founder Structure
Shareholding
Business Activity
Taxation
Future Funding
Licences & Registrations
Compliance Requirements
Growth Plans

And after incorporation, our team can assist with:

Accounting | GST | Income Tax | ROC Compliance | Trademark | Business Licences | Funding Support | Financial Management

So you don''t have to find a different consultant every time your company enters its next stage.',
  'At The Corporate Hub, we assist clients in {{CITY}} with comprehensive private limited company registration and ongoing advisory.',
  'You may also need:

Trademark Registration
GST Registration
Startup India Recognition
Accounting & Bookkeeping
ROC Compliance
Business Licences
IEC & Export Setup
Funding & Business Advisory',
  'Don''t choose a business structure only because someone told you:

“Private Limited is best.”

Choose it because it fits where you want your business to go.

At The Corporate Hub, we help you understand, structure, register and manage your company as it grows.

Build the Business. Protect the Brand. Stay Compliant. Grow with Confidence.

THE CORPORATE HUB
Startup & Business Consultants | Gujarat • Pan India',
  'Contact our team for a transparent, customised quote based on your specific requirements.',
  '/logo.png',
  '[{"question": "How many people are required to start a Private Limited Company?", "answer": "Generally, a minimum of two members/shareholders and two directors are required. The same individuals can act as both shareholders and directors, subject to applicable law.", "sort_order": 1, "is_active": true}, {"question": "Is there any minimum capital requirement?", "answer": "There is no prescribed minimum paid-up capital requirement for incorporating a normal Private Limited Company.", "sort_order": 2, "is_active": true}, {"question": "Can I register a company from anywhere in India?", "answer": "Yes. The MCA incorporation process is largely digital, although the company must have a registered office in India and comply with applicable requirements.", "sort_order": 3, "is_active": true}, {"question": "How long does company registration take?", "answer": "We generally estimate approximately 10 working days, subject to name approval, documents, MCA processing and any resubmission.", "sort_order": 4, "is_active": true}, {"question": "Is a Private Limited Company better than an LLP?", "answer": "It depends on your plans. A Private Limited Company is generally more suitable for equity funding, multiple shareholders and scalable startup structures, whereas an LLP can be suitable for partner-driven professional and service businesses.", "sort_order": 5, "is_active": true}, {"question": "Can a Private Limited Company raise investment?", "answer": "Yes. Subject to applicable laws and procedures, a Private Limited Company can issue shares and raise equity capital from eligible investors.", "sort_order": 6, "is_active": true}, {"question": "Can a Private Limited Company give ESOPs?", "answer": "Yes, ESOPs can be structured subject to the Companies Act and other applicable requirements.", "sort_order": 7, "is_active": true}, {"question": "Is audit compulsory for a Private Limited Company?", "answer": "A company is generally required to have its financial statements audited under the Companies Act, irrespective of whether it has significant turnover or profit.", "sort_order": 8, "is_active": true}, {"question": "Is GST automatically included with company registration?", "answer": "No. GST registration is separate and its requirement depends on the nature of business, turnover and other applicable GST provisions.", "sort_order": 9, "is_active": true}, {"question": "Can The Corporate Hub handle compliance after registration?", "answer": "Yes. We can assist with applicable accounting, GST, income tax, ROC, payroll and other business compliance requirements.", "sort_order": 10, "is_active": true}]'::jsonb,
  true
)
ON CONFLICT (service_id) DO UPDATE SET
  template_name = EXCLUDED.template_name,
  h1 = EXCLUDED.h1,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  intro = EXCLUDED.intro,
  what_is_service = EXCLUDED.what_is_service,
  who_should_choose = EXCLUDED.who_should_choose,
  key_benefits = EXCLUDED.key_benefits,
  eligibility = EXCLUDED.eligibility,
  documents = EXCLUDED.documents,
  process = EXCLUDED.process,
  timeline = EXCLUDED.timeline,
  tax_compliance = EXCLUDED.tax_compliance,
  comparison = EXCLUDED.comparison,
  how_it_helps = EXCLUDED.how_it_helps,
  local_information = EXCLUDED.local_information,
  why_corporate_hub = EXCLUDED.why_corporate_hub,
  why_choose_service = EXCLUDED.why_choose_service,
  related_services = EXCLUDED.related_services,
  call_to_action = EXCLUDED.call_to_action,
  pricing = EXCLUDED.pricing,
  og_image = EXCLUDED.og_image,
  faqs = EXCLUDED.faqs,
  updated_at = now();


-- Template: Limited Liability Partnership (LLP) Registration Template
INSERT INTO public.seo_service_templates (
  service_id, template_name, h1, meta_title, meta_description,
  intro, what_is_service, who_should_choose, key_benefits,
  eligibility, documents, process, timeline, tax_compliance,
  comparison, how_it_helps, local_information, why_corporate_hub,
  why_choose_service, related_services, call_to_action, pricing,
  og_image, faqs, is_active
) VALUES (
  (SELECT id FROM public.seo_services WHERE service_slug = 'llp' LIMIT 1),
  'Limited Liability Partnership (LLP) Registration Template',
  'Limited Liability Partnership (LLP) Registration in {{CITY}}. Grow Together. Keep Ownership Flexible.',
  'Limited Liability Partnership (LLP) Registration in {{CITY}} | The Corporate Hub',
  'Want to start a business with partners but don''t necessarily need the share-based structure of a Private Limited Company? Professional limited liability part...',
  'Want to start a business with partners but don''t necessarily need the share-based structure of a Private Limited Company?

A Limited Liability Partnership (LLP) combines the flexibility of a partnership with a separate legal identity and limited liability structure.

It can be particularly suitable for consultants, professionals, agencies, service businesses and closely held businesses where the founders want to operate and grow together as partners.

Partners → Professional Structure → Flexible Management → Growth',
  'A Limited Liability Partnership is a separate legal entity registered under the Limited Liability Partnership Act, 2008.

Instead of shareholders and directors, an LLP operates through Partners and Designated Partners.

The rights, responsibilities, contribution, profit-sharing and management arrangement between partners are primarily structured through the LLP Agreement, subject to applicable law.',
  'An LLP can be suitable for:

Consultants & advisory businesses

Professional service firms

IT & technology service providers

Digital & creative agencies

Architects and designers

Family or closely held businesses

Two or more entrepreneurs starting together

Businesses where partners actively manage operations

Businesses not presently focused on raising conventional equity investment

For regulated professions, the applicable professional laws and regulations should also be considered before selecting the entity structure.',
  'Separate Legal Identity

The LLP has a legal identity separate from its partners.

Limited Liability

Partners generally enjoy limited liability, subject to the LLP Act and exceptions such as fraud, wrongful acts and personal guarantees.

Flexible Partnership Structure

The LLP Agreement can define:

Contribution | Profit Sharing | Remuneration | Responsibilities | Decision-Making | Admission & Retirement of Partners

No Conventional Share Capital

An LLP works through partner contributions and partnership rights rather than company share capital.

Perpetual Succession

The LLP can continue despite changes in its partners, subject to applicable law.

Comparatively Flexible Management

An LLP generally has a simpler internal governance framework than a Private Limited Company.',
  'Generally, LLP registration requires:

Minimum 2 Partners

Minimum 2 Designated Partners

At least 1 Designated Partner resident in India, as required under applicable law

Registered Office in India

Unique and acceptable LLP name

Digital Signature Certificate (DSC)

Lawful business activity

Agreed capital contribution

Agreed profit-sharing ratio

There is generally no prescribed minimum capital contribution for forming an LLP.',
  'Partners / Designated Partners

[DOCUMENT LIST TO BE ADDED]

Registered Office

[DOCUMENT LIST TO BE ADDED]

Business & Partnership Details

[DOCUMENT LIST TO BE ADDED]',
  'Our process generally includes:

Business & Partner Discussion
↓
Contribution & Profit-Sharing Planning
↓
Name Selection
↓
DSC
↓
LLP Incorporation Filing
↓
Certificate of Incorporation
↓
LLP Agreement
↓
Statutory Filing of LLP Agreement
↓
Post-Incorporation Guidance

A properly structured LLP Agreement is important because it defines how the partners will operate the business together.',
  'Approximately 10 Working Days*

The timeline depends upon:

Document Readiness | Name Availability | MCA Processing | Execution of LLP Agreement | Resubmission, if any

The timeline is indicative and may vary depending upon regulatory processing.',
  'An LLP is generally taxed as a partnership firm under the Income-tax Act.

Income Tax Rate

30% + applicable surcharge + 4% Health & Education Cess

Where surcharge does not apply, the effective rate is generally 31.20%.

Other provisions, including Alternate Minimum Tax (AMT), may apply depending upon the LLP''s circumstances.

TDS on Payments to Partners – Section 194T

From 1 April 2025, Section 194T provides for TDS at 10% on specified payments such as salary, remuneration, commission, bonus or interest made/credited by a firm/LLP to a partner where the prescribed threshold and conditions are satisfied.

Ongoing Compliance

Depending upon applicability, an LLP may need:

Accounting | Income Tax Return | LLP Annual Return | Statement of Account & Solvency | GST | TDS | Partner TDS | Audit | Other Business-Specific Compliance',
  '*Subject to applicable law and exceptions.',
  'Grow Without Conventional Equity Dilution

An LLP does not operate through share capital.

Partners can structure their contribution and economic rights through the LLP Agreement, allowing founders to build the business through a partnership model.

Build a Professional Business Identity

Move from an informal partnership to a separate registered business entity.

Add Partners as You Expand

New partners can be introduced as the business grows, subject to the LLP Agreement and applicable filings.

This can help bring in:

Expertise | Management | Capital | Business Relationships

Keep Profit Sharing Flexible

Partners can structure their economic arrangement through the LLP Agreement, subject to tax and other applicable laws.

Scale with Comparatively Simple Governance

For many closely held service businesses:

2 Partners → Team → Clients → New Partners → Multiple Locations

An LLP can provide a formal structure without necessarily requiring the complete shareholder and board framework of a company.',
  'The Corporate Hub assists entrepreneurs and businesses in {{CITY}}, {{STATE}} with Limited Liability Partnership (LLP) Registration.

The Corporate Hub assists entrepreneurs with LLP Registration across Gujarat and India.

We can assist businesses in:

Ahmedabad | Surat | Vadodara | Rajkot | Gandhinagar | Other Gujarat Cities | Pan India

Since the MCA incorporation process is substantially digital, founders do not necessarily need to be physically located in Ahmedabad to work with our team.

We can also continue to manage applicable accounting, taxation and compliance after registration.',
  'We Don''t Just Register the LLP. We Structure the Partnership.

An LLP works well only when the relationship between the partners is properly planned.

Before registration, we help you consider:

Partner Roles
Capital Contribution
Profit Sharing
Remuneration
Decision-Making
Tax Implications
Future Partner Entry
Business Licences
Ongoing Compliance

Our team can then support the LLP with:

Accounting | GST | Income Tax | TDS | LLP Compliance | Trademark | Licences | Financial Management

So your LLP remains structured as the business grows.',
  'At The Corporate Hub, we assist clients in {{CITY}} with comprehensive limited liability partnership (llp) registration and ongoing advisory.',
  'Businesses considering an LLP may also require:

Private Limited Company Registration
OPC Registration
GST Registration
Trademark Registration
Startup India Recognition
Accounting & Bookkeeping
LLP Annual Compliance
Business Licences',
  'An LLP should not be selected simply because:

“Compliance is lower.”

It should be selected when its partner-driven ownership, taxation, management flexibility and future growth model fit your business.

At The Corporate Hub, we help you decide whether:

LLP or Private Limited Company

is the better structure for where you want your business to go.

Build Together. Structure It Right. Grow with Confidence.

THE CORPORATE HUB
Startup & Business Consultants | Gujarat • Pan India',
  'Contact our team for a transparent, customised quote based on your specific requirements.',
  '/logo.png',
  '[{"question": "What is the minimum number of partners required for an LLP?", "answer": "An LLP requires a minimum of two partners and at least two designated partners.", "sort_order": 1, "is_active": true}, {"question": "Is there any minimum capital required?", "answer": "There is generally no prescribed minimum capital contribution for incorporating an LLP.", "sort_order": 2, "is_active": true}, {"question": "Is an LLP a separate legal entity?", "answer": "Yes. An LLP has a separate legal identity from its partners.", "sort_order": 3, "is_active": true}, {"question": "Is LLP better than a Private Limited Company?", "answer": "Neither structure is universally better. An LLP can be more suitable for partner-driven professional and service businesses, while a Private Limited Company is generally better suited for businesses planning equity investment, ESOPs and wider share ownership.", "sort_order": 4, "is_active": true}, {"question": "Can an LLP raise investment?", "answer": "Partners can introduce capital and new partners may be admitted subject to applicable law and the LLP Agreement. However, an LLP does not issue equity shares like a Private Limited Company, making it less suitable for conventional VC/angel equity funding.", "sort_order": 5, "is_active": true}, {"question": "How are profits shared in an LLP?", "answer": "Profit-sharing arrangements are generally specified in the LLP Agreement.", "sort_order": 6, "is_active": true}, {"question": "Can partners take remuneration from an LLP?", "answer": "Yes, subject to the LLP Agreement and applicable provisions of the Income-tax Act. Tax deductibility and TDS implications should be evaluated separately.", "sort_order": 7, "is_active": true}, {"question": "Is audit compulsory for every LLP?", "answer": "No. Statutory audit requirements for an LLP depend upon prescribed thresholds and applicable law.", "sort_order": 8, "is_active": true}, {"question": "Can an LLP be registered from anywhere in India?", "answer": "Yes. The registration process is largely digital, provided the LLP has a registered office in India and fulfils applicable requirements.", "sort_order": 9, "is_active": true}, {"question": "Can The Corporate Hub handle LLP compliance after registration?", "answer": "Yes. We can assist with LLP filings, accounting, GST, income tax, TDS and other applicable business compliances.", "sort_order": 10, "is_active": true}]'::jsonb,
  true
)
ON CONFLICT (service_id) DO UPDATE SET
  template_name = EXCLUDED.template_name,
  h1 = EXCLUDED.h1,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  intro = EXCLUDED.intro,
  what_is_service = EXCLUDED.what_is_service,
  who_should_choose = EXCLUDED.who_should_choose,
  key_benefits = EXCLUDED.key_benefits,
  eligibility = EXCLUDED.eligibility,
  documents = EXCLUDED.documents,
  process = EXCLUDED.process,
  timeline = EXCLUDED.timeline,
  tax_compliance = EXCLUDED.tax_compliance,
  comparison = EXCLUDED.comparison,
  how_it_helps = EXCLUDED.how_it_helps,
  local_information = EXCLUDED.local_information,
  why_corporate_hub = EXCLUDED.why_corporate_hub,
  why_choose_service = EXCLUDED.why_choose_service,
  related_services = EXCLUDED.related_services,
  call_to_action = EXCLUDED.call_to_action,
  pricing = EXCLUDED.pricing,
  og_image = EXCLUDED.og_image,
  faqs = EXCLUDED.faqs,
  updated_at = now();


-- Template: One Person Company (OPC) Registration Template
INSERT INTO public.seo_service_templates (
  service_id, template_name, h1, meta_title, meta_description,
  intro, what_is_service, who_should_choose, key_benefits,
  eligibility, documents, process, timeline, tax_compliance,
  comparison, how_it_helps, local_information, why_corporate_hub,
  why_choose_service, related_services, call_to_action, pricing,
  og_image, faqs, is_active
) VALUES (
  (SELECT id FROM public.seo_services WHERE service_slug = 'opc' LIMIT 1),
  'One Person Company (OPC) Registration Template',
  'One Person Company (OPC) Registration in {{CITY}}. Start Alone. Build Like a Company.',
  'One Person Company (OPC) Registration in {{CITY}} | The Corporate Hub',
  'Want to own 100% of your business but still operate through a structured company? Professional one person company (opc) registration services in {{CITY}}, {{...',
  'Want to own 100% of your business but still operate through a structured company?

A One Person Company (OPC) allows a single entrepreneur to start a company with one member/shareholder, while creating a legal identity separate from the individual owner.

It can be an ideal step for entrepreneurs who have outgrown the idea of a simple proprietorship but are not yet ready to bring in another shareholder.

One Founder → One Company → Professional Identity → Future Growth',
  'A One Person Company (OPC) is a company incorporated under the Companies Act, 2013 with only one member/shareholder.

Unlike a proprietorship, an OPC has a separate legal identity from its owner.

The OPC can have its own:

PAN | Bank Account | Assets | Contracts | Applicable Business Registrations & Licences

This creates a clearer distinction between:

You as an Individual

and

Your Business as a Company',
  'An OPC can be suitable for:

Solo entrepreneurs

Individual consultants

Online & e-commerce entrepreneurs

Small manufacturers

Individual service providers

Business owners moving from proprietorship

Founders who want 100% ownership initially

Entrepreneurs planning to build a corporate identity

Solo founders who may convert into a Private Limited Company as they expand

It is particularly useful when you want to start alone today but keep the possibility of a larger company tomorrow.',
  '100% Single-Member Ownership

You can start the company without bringing in another shareholder merely for the purpose of having a second owner.

Separate Legal Identity

The OPC is legally separate from its member.

Separate PAN

Unlike a proprietorship, where the proprietor''s PAN is used for income-tax purposes, an OPC receives its own PAN as a company.

Limited Liability

The member generally enjoys limited liability, subject to applicable law, fraud, personal guarantees and other exceptions.

Corporate Identity

Operate through a registered company structure while dealing with customers, vendors, banks and institutions.

Perpetual Succession

The nominee mechanism provides continuity in prescribed circumstances.

Future Conversion

As your ownership requirements change, an OPC can be converted into another form of company, including a Private Limited Company, in accordance with applicable law.',
  'Generally, an OPC requires:

1 Member / Shareholder

Minimum 1 Director

1 Nominee

Registered Office in India

Unique and acceptable company name

Digital Signature Certificate (DSC)

Lawful business activity

Proposed share capital

The eligibility of the member and nominee is subject to the applicable Companies Act and Rules.

There is no prescribed minimum paid-up capital requirement for a normal OPC.',
  'Member / Director

[DOCUMENT LIST TO BE ADDED]

Nominee

[DOCUMENT LIST TO BE ADDED]

Registered Office

[DOCUMENT LIST TO BE ADDED]

Business Details

[DOCUMENT LIST TO BE ADDED]',
  'The process generally includes:

Business Discussion
↓
OPC Structure Planning
↓
Nominee Selection
↓
Name Selection
↓
DSC
↓
Incorporation Documentation
↓
MCA Filing
↓
Certificate of Incorporation
↓
PAN & TAN
↓
Post-Incorporation Setup

Our focus is to ensure that an OPC actually suits your business before simply incorporating it.',
  'Approximately 10 Working Days*

The actual timeline depends upon:

Document Readiness | Name Availability | MCA Processing | Nominee Documentation | Resubmission, if any

The timeline is indicative and subject to regulatory processing.',
  'An OPC is a company for income-tax purposes and is generally subject to corporate taxation.

An eligible domestic company opting for Section 115BAA, subject to prescribed conditions, can be taxed at:

Income Tax: 22%
Surcharge: 10%
Health & Education Cess: 4%

Effective Tax Rate: approximately 25.17%

Other corporate tax regimes may apply depending upon eligibility and circumstances.

An OPC may also have ongoing requirements relating to:

Accounting | Statutory Audit | Income Tax Return | ROC Filing | GST | TDS | Payroll | Other Applicable Business Compliance

Certain compliance relaxations are available to OPCs under the Companies Act compared with other companies, subject to applicable provisions.',
  '*Subject to applicable law and exceptions.',
  'Move Beyond Proprietorship

A proprietorship does not create a separate legal person from the proprietor.

An OPC does.

This can help create a stronger distinction between your personal identity and business identity.

Build a Corporate Brand

Operate contracts, banking and applicable business registrations through a company structure.

Stay the Sole Owner

Build your business without giving up ownership simply because you want a corporate structure.

Build a Team Around the Company

Your company can grow through:

Employees | Vendors | Customers | Professionals | Business Partners

without requiring them to become shareholders.

Convert When You''re Ready

When you eventually want additional shareholders or equity investors, you can consider conversion into a Private Limited Company in accordance with applicable law.

Your Growth Journey Can Be:

Individual → OPC → Brand → Team → Private Limited → Investors → Expansion

An OPC does not itself guarantee growth, but it gives a solo founder a corporate platform from which to build.',
  'The Corporate Hub assists entrepreneurs and businesses in {{CITY}}, {{STATE}} with One Person Company (OPC) Registration.

The Corporate Hub assists entrepreneurs with OPC Registration across Gujarat and India.

We can support founders in:

Ahmedabad | Surat | Vadodara | Rajkot | Gandhinagar | Other Gujarat Cities | Pan India

The MCA incorporation process is substantially digital, so founders can work with our team remotely while maintaining a registered office in India as required.',
  'Don''t Choose Between OPC and Proprietorship Just Because of Registration Cost.

We first understand:

What is your business?
How much do you expect it to grow?
Do you need limited liability?
Will you add a co-founder later?
Do you plan to raise investment?
What licences will your business require?
What will be the tax and compliance impact?

Then we help you decide whether:

Proprietorship → OPC → Private Limited

is the right path.

After incorporation, our team can also assist with:

Accounting | GST | Income Tax | ROC Compliance | Trademark | Licences | Financial Management',
  'At The Corporate Hub, we assist clients in {{CITY}} with comprehensive one person company (opc) registration and ongoing advisory.',
  'You may also consider:

Private Limited Company Registration
LLP Registration
GST Registration
Trademark Registration
Startup India Recognition
FSSAI Registration
IEC & Export Setup
Accounting & Tax Compliance',
  'If you are a solo entrepreneur, don''t automatically assume:

“One Owner = Proprietorship.”

You can also build through a separate company structure.

At The Corporate Hub, we help you compare the legal, tax, compliance and growth impact before choosing your entity.

Start Solo. Build Corporate. Grow Bigger.

THE CORPORATE HUB
Startup & Business Consultants | Gujarat • Pan India',
  'Contact our team for a transparent, customised quote based on your specific requirements.',
  '/logo.png',
  '[{"question": "Can one person start a company in India?", "answer": "Yes. An eligible individual can incorporate an OPC subject to the requirements of the Companies Act and applicable Rules.", "sort_order": 1, "is_active": true}, {"question": "Is OPC different from a proprietorship?", "answer": "Yes. A proprietorship does not create a separate legal person from the proprietor. An OPC is a separate company incorporated under the Companies Act.", "sort_order": 2, "is_active": true}, {"question": "Does an OPC get a separate PAN?", "answer": "Yes. An OPC receives a PAN in the company''s name, whereas a proprietorship generally uses the proprietor''s PAN for income-tax purposes.", "sort_order": 3, "is_active": true}, {"question": "Can licences be obtained in the OPC''s name?", "answer": "Applicable registrations and licences such as GST, FSSAI, IEC and other business-specific registrations may be obtained in the company''s name where the relevant law permits or requires them.\n\nThe type of licence—for example, Basic, State or Central FSSAI—depends upon the applicable eligibility criteria and not merely on being an OPC.", "sort_order": 4, "is_active": true}, {"question": "Is a nominee compulsory for an OPC?", "answer": "Yes. A nominee is required as part of the OPC framework, subject to applicable provisions.", "sort_order": 5, "is_active": true}, {"question": "Can an OPC have employees?", "answer": "Yes. Having only one member does not mean the company can have only one person working in the business. An OPC can employ people subject to applicable labour and other laws.", "sort_order": 6, "is_active": true}, {"question": "Can an OPC raise investment?", "answer": "An OPC is built around a single-member structure. If additional equity shareholders or conventional equity investment are required, conversion into an appropriate company structure may be necessary.", "sort_order": 7, "is_active": true}, {"question": "Can an OPC be converted into a Private Limited Company?", "answer": "Yes, conversion is possible in accordance with the Companies Act and applicable Rules.", "sort_order": 8, "is_active": true}, {"question": "Is statutory audit compulsory for an OPC?", "answer": "As a company, an OPC is generally required to have its financial statements audited under the Companies Act, subject to applicable provisions.", "sort_order": 9, "is_active": true}, {"question": "Should I choose OPC or proprietorship?", "answer": "Choose based on your business size, risk, taxation, compliance requirements and future growth plan. Proprietorship offers simplicity, while OPC provides a separate corporate identity and limited liability structure.", "sort_order": 10, "is_active": true}]'::jsonb,
  true
)
ON CONFLICT (service_id) DO UPDATE SET
  template_name = EXCLUDED.template_name,
  h1 = EXCLUDED.h1,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  intro = EXCLUDED.intro,
  what_is_service = EXCLUDED.what_is_service,
  who_should_choose = EXCLUDED.who_should_choose,
  key_benefits = EXCLUDED.key_benefits,
  eligibility = EXCLUDED.eligibility,
  documents = EXCLUDED.documents,
  process = EXCLUDED.process,
  timeline = EXCLUDED.timeline,
  tax_compliance = EXCLUDED.tax_compliance,
  comparison = EXCLUDED.comparison,
  how_it_helps = EXCLUDED.how_it_helps,
  local_information = EXCLUDED.local_information,
  why_corporate_hub = EXCLUDED.why_corporate_hub,
  why_choose_service = EXCLUDED.why_choose_service,
  related_services = EXCLUDED.related_services,
  call_to_action = EXCLUDED.call_to_action,
  pricing = EXCLUDED.pricing,
  og_image = EXCLUDED.og_image,
  faqs = EXCLUDED.faqs,
  updated_at = now();


-- Template: Section 8 Company Registration Template
INSERT INTO public.seo_service_templates (
  service_id, template_name, h1, meta_title, meta_description,
  intro, what_is_service, who_should_choose, key_benefits,
  eligibility, documents, process, timeline, tax_compliance,
  comparison, how_it_helps, local_information, why_corporate_hub,
  why_choose_service, related_services, call_to_action, pricing,
  og_image, faqs, is_active
) VALUES (
  (SELECT id FROM public.seo_services WHERE service_slug = 'section-8-company' LIMIT 1),
  'Section 8 Company Registration Template',
  'Section 8 Company Registration in {{CITY}}. Build an NGO with a Strong Corporate Structure.',
  'Section 8 Company Registration in {{CITY}} | The Corporate Hub',
  'If you want to start an NGO for charitable, educational, social, environmental, healthcare, research or community-focused activities, a Section 8 Company can...',
  'If you want to start an NGO for charitable, educational, social, environmental, healthcare, research or community-focused activities, a Section 8 Company can provide a highly structured non-profit framework.

Unlike a simple trust structure, a Section 8 Company operates under the Companies Act, 2013, with defined governance through members, directors and MCA compliance.

It is suitable for organisations that want to build:

Credibility → Governance → Donations → CSR Opportunities → Long-Term Impact',
  'A Section 8 Company is a non-profit company incorporated under Section 8 of the Companies Act, 2013.

It is formed for objects such as:

Education | Charity | Social Welfare | Research | Environment | Healthcare | Sports | Art | Science | Community Development

Its profits or income are applied towards its stated objectives rather than being distributed as dividend to members.

A Section 8 Company combines:

Non-Profit Purpose + Corporate Structure',
  'It can be suitable for:

NGOs

Charitable organisations

Educational organisations

Social welfare organisations

Healthcare initiatives

Environmental organisations

Research organisations

Skill-development initiatives

Community-development organisations

Foundations

Organisations planning CSR projects

NGOs planning institutional funding or grants

Founders who want a professionally governed non-profit structure',
  'Separate Legal Identity

The company has its own legal identity separate from its members.

Structured Governance

The organisation operates through:

Members | Directors | Memorandum | Articles | Statutory Records

Professional NGO Structure

A Section 8 Company provides a formal corporate framework that can be useful when dealing with:

Corporates | Donors | Institutions | Government Bodies | Grant Agencies

12A / 12AB Eligibility

An eligible Section 8 Company can separately apply for income-tax registration commonly referred to as 12A / 12AB.

80G Eligibility

It can also separately apply for 80G approval, subject to Income-tax requirements.

CSR Opportunity

An eligible Section 8 Company can act as a CSR implementing agency subject to the applicable CSR Rules and required registrations. MCA''s CSR guidance confirms that Section 8 companies can be eligible implementing agencies, with 12A and 80G generally required for non-government entities and CSR-1 registration also relevant.

Long-Term Continuity

The organisation can continue despite changes in members or directors, subject to applicable law.',
  'Generally, for a private Section 8 Company:

Minimum 2 Members

Minimum 2 Directors

At least 1 Resident Director, as applicable

Registered Office in India

Genuine non-profit / charitable objects

Digital Signature Certificates

Proposed Section 8 compliant name

Memorandum & Articles aligned with charitable objects

No distribution of dividend to members

The proposed objects and activities should clearly support the organisation''s non-profit purpose.',
  'Directors & Members

[DOCUMENT LIST TO BE ADDED]

Registered Office

[DOCUMENT LIST TO BE ADDED]

Proposed NGO Activities

[DOCUMENT LIST TO BE ADDED]

Objects & Project Details

[DOCUMENT LIST TO BE ADDED]',
  'The process generally includes:

Discussion of NGO Activities
↓
Object & Structure Planning
↓
Name Selection
↓
DSC
↓
MOA & AOA Preparation
↓
Section 8 Incorporation Filing
↓
MCA Review / Approval
↓
Certificate of Incorporation
↓
PAN & TAN
↓
Post-Incorporation Registrations

After incorporation, depending upon the organisation''s plans, the next stage may include:

12A / 12AB → 80G → CSR-1 → Other Applicable Registrations',
  'Approximately 20 Working Days*

The actual timeline depends upon:

Document Readiness | Name Approval | Object Scrutiny | MCA Processing | Resubmission, if any

The timeline is indicative and may vary depending upon regulatory approval.',
  'Section 8 incorporation and income-tax exemption are not the same thing.

A Section 8 Company may separately need to apply for appropriate registration under the Income-tax framework for claiming charitable tax exemption.

12A / 12AB

This is generally relevant for obtaining income-tax exemption for eligible charitable income, subject to approval and ongoing conditions.

80G

80G approval enables eligible donors to claim deduction on qualifying donations, subject to applicable provisions. The Income Tax Department notes that deductions under Section 80G depend on the category of the eligible fund/institution and applicable limits.

Other Ongoing Compliance

Depending upon applicability:

Accounting | Statutory Audit | Income Tax Return | ROC Annual Filing | Board Meetings | Donation Records | 12AB Compliance | 80G Compliance | TDS | GST | CSR Reporting Support',
  'Important

A Trust is not inferior and a Section 8 Company is not automatically better in every case.

The right structure depends upon:

Nature of Activity | Governance Style | Funding Plans | CSR Plans | Number of Founders | Long-Term Vision',
  'Build Institutional Credibility

A structured corporate non-profit framework can make it easier to present your organisation professionally to:

Donors | Corporates | Institutions | Government Bodies

Become Donation Ready

After obtaining applicable 12A / 12AB and 80G approvals, the organisation can build a more structured donation framework.

Become CSR Ready

An eligible Section 8 Company can work towards becoming a CSR implementing agency.

For many non-government entities, this generally involves:

Section 8 → 12A / 12AB → 80G → CSR-1 → Track Record / Eligibility as applicable

MCA''s current CSR guidance confirms the importance of 12A, 80G and CSR-1 for eligible implementing agencies.

Access Grants & Institutional Opportunities

As compliance, governance and track record improve, the organisation can explore:

Donations | CSR Projects | Institutional Grants | Government Schemes | Eligible Foreign Contributions

Foreign contribution requires separate FCRA compliance and is not automatically available because of Section 8 incorporation.

Build for Long-Term Impact

Your journey can evolve from:

Social Idea → Section 8 Company → 12AB / 80G → Donors → CSR → Larger Impact',
  'The Corporate Hub assists entrepreneurs and businesses in {{CITY}}, {{STATE}} with Section 8 Company Registration.

The Corporate Hub assists with Section 8 Company registration and related NGO compliance across:

Ahmedabad | Surat | Vadodara | Rajkot | Gandhinagar | Gujarat | Pan India

Since MCA incorporation is substantially digital, NGOs and founders across India can work with our team remotely.

We can also assist after incorporation with:

12A / 12AB | 80G | CSR-1 | Accounting | ROC Compliance | Taxation | NGO Advisory',
  'We Don''t Just Register an NGO.

We help you plan the complete structure around it.

Before incorporation, we consider:

Objects
Type of NGO Structure
Trust vs Section 8
Future Donations
12A / 12AB
80G
CSR Plans
Governance
Accounting & Compliance

And after incorporation, we can assist with:

12A / 12AB | 80G | CSR-1 | Accounting | Audit Support | Income Tax | ROC Compliance | NGO Documentation

Our focus is to help you build an organisation that is not only registered, but structured for long-term credibility and impact.',
  'At The Corporate Hub, we assist clients in {{CITY}} with comprehensive section 8 company registration and ongoing advisory.',
  'You may also need:

Trust Registration
12A / 12AB Registration
80G Registration
CSR-1 Registration
NGO Darpan Registration
Accounting & Bookkeeping
ROC Compliance
Trademark Registration
FCRA Advisory',
  'Don''t choose a structure simply because:

“Trust registration is easier.”

Choose based on where you want your organisation to go.

If your vision includes:

Professional Governance | Institutional Donations | CSR Projects | Long-Term Expansion

a Section 8 Company may provide a stronger framework.

Don''t Just Register an NGO. Build an Institution.

THE CORPORATE HUB
Startup & Business Consultants | Gujarat • Pan India',
  'Contact our team for a transparent, customised quote based on your specific requirements.',
  '/logo.png',
  '[{"question": "What is a Section 8 Company?", "answer": "It is a non-profit company incorporated under the Companies Act, 2013 for charitable or socially beneficial objectives.", "sort_order": 1, "is_active": true}, {"question": "Can a Section 8 Company make profit?", "answer": "It may generate income or surplus, but the profits are required to be applied towards its stated objects and cannot be distributed as dividend to members.", "sort_order": 2, "is_active": true}, {"question": "Is 12A / 12AB automatic with Section 8 registration?", "answer": "No. It requires a separate application and approval under the Income-tax framework.", "sort_order": 3, "is_active": true}, {"question": "Is 80G automatically available?", "answer": "No. 80G is a separate approval and is subject to eligibility and applicable conditions.", "sort_order": 4, "is_active": true}, {"question": "Can a Section 8 Company receive CSR funds?", "answer": "It can be eligible to act as a CSR implementing agency subject to the Companies (CSR Policy) Rules, required registrations and other applicable conditions.", "sort_order": 5, "is_active": true}, {"question": "Is Section 8 better than a Trust?", "answer": "Not always. Section 8 offers a structured corporate framework, while a trust can be simpler and more appropriate for certain charitable activities.", "sort_order": 6, "is_active": true}, {"question": "Can a Section 8 Company receive foreign donations?", "answer": "Only subject to applicable FCRA registration or prior permission and related compliance. Section 8 registration alone does not permit unrestricted foreign contributions.", "sort_order": 7, "is_active": true}, {"question": "How long does registration take?", "answer": "We generally estimate approximately 20 working days, subject to MCA processing and document readiness.", "sort_order": 8, "is_active": true}, {"question": "Can a Section 8 Company operate across India?", "answer": "Yes. Subject to its objects, licences and applicable laws, it can undertake activities across India.", "sort_order": 9, "is_active": true}, {"question": "Can The Corporate Hub handle compliance after incorporation?", "answer": "Yes. We can assist with 12A / 12AB, 80G, CSR-1, accounting, taxation, ROC compliance and NGO-related advisory.", "sort_order": 10, "is_active": true}]'::jsonb,
  true
)
ON CONFLICT (service_id) DO UPDATE SET
  template_name = EXCLUDED.template_name,
  h1 = EXCLUDED.h1,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  intro = EXCLUDED.intro,
  what_is_service = EXCLUDED.what_is_service,
  who_should_choose = EXCLUDED.who_should_choose,
  key_benefits = EXCLUDED.key_benefits,
  eligibility = EXCLUDED.eligibility,
  documents = EXCLUDED.documents,
  process = EXCLUDED.process,
  timeline = EXCLUDED.timeline,
  tax_compliance = EXCLUDED.tax_compliance,
  comparison = EXCLUDED.comparison,
  how_it_helps = EXCLUDED.how_it_helps,
  local_information = EXCLUDED.local_information,
  why_corporate_hub = EXCLUDED.why_corporate_hub,
  why_choose_service = EXCLUDED.why_choose_service,
  related_services = EXCLUDED.related_services,
  call_to_action = EXCLUDED.call_to_action,
  pricing = EXCLUDED.pricing,
  og_image = EXCLUDED.og_image,
  faqs = EXCLUDED.faqs,
  updated_at = now();


-- Template: Startup India Registration (DPIIT Recognition) Template
INSERT INTO public.seo_service_templates (
  service_id, template_name, h1, meta_title, meta_description,
  intro, what_is_service, who_should_choose, key_benefits,
  eligibility, documents, process, timeline, tax_compliance,
  comparison, how_it_helps, local_information, why_corporate_hub,
  why_choose_service, related_services, call_to_action, pricing,
  og_image, faqs, is_active
) VALUES (
  (SELECT id FROM public.seo_services WHERE service_slug = 'startup-india-registration' LIMIT 1),
  'Startup India Registration (DPIIT Recognition) Template',
  'Startup India Registration (DPIIT Recognition) in {{CITY}}. Get Recognised. Unlock Opportunities. Build for Growth.',
  'Startup India Registration (DPIIT Recognition) in {{CITY}} | The Corporate Hub',
  'Building a startup is different from simply starting a business. Professional startup india registration (dpiit recognition) services in {{CITY}}, {{STATE}} ...',
  'Building a startup is different from simply starting a business.

If your business is innovative, scalable or capable of creating significant employment or wealth, DPIIT Startup Recognition can formally place your business within the Government of India''s Startup India ecosystem.

The real value is not just the certificate.

It is about what the recognition can help an eligible startup access:

Tax Benefits | Funding Ecosystem | Government Schemes | IP Benefits | Procurement Opportunities | Startup Support',
  'Startup India is a Government of India initiative supporting innovation, entrepreneurship and startup growth.

Eligible entities can apply for DPIIT Recognition under the Startup India framework.

Once recognised, a startup may become eligible to access various benefits and schemes, subject to the separate conditions of each benefit.

Important:

DPIIT Recognition does not automatically mean tax exemption, funding or grants.

Each benefit has its own eligibility and application requirements.',
  'It can be suitable for businesses working on:

Innovative products or services

Technology-driven businesses

SaaS & software startups

FinTech and other technology startups

D2C and innovative consumer brands

Innovative manufacturing

DeepTech

New or improved business processes

Scalable service models

Businesses with strong employment-generation potential

Businesses with potential for significant wealth creation

Simply registering a new company does not automatically make it an eligible startup.

Your business model should satisfy the applicable DPIIT criteria.',
  'Government Recognition

Your eligible business receives formal recognition as a DPIIT-recognised startup.

Income-Tax Benefit

Eligible recognised startups can separately apply for tax exemption under Section 80-IAC, subject to its specific conditions and approval.

Intellectual Property Benefits

Eligible startups can access prescribed benefits and facilitation relating to patents and trademarks under applicable Startup India/IP schemes.

Government Procurement

Eligible startups may access certain relaxations in public procurement, subject to applicable procurement rules and tender conditions.

Self-Certification

Eligible recognised startups can access self-certification benefits under specified labour and environmental laws, subject to the applicable framework.

Startup Funding Ecosystem

Recognition can be relevant when exploring eligible government-backed startup programmes, incubators and funding ecosystems.

Credibility

DPIIT recognition can strengthen how an eligible startup presents itself to:

Investors | Incubators | Institutions | Government Programmes | Startup Ecosystems',
  'For Normal Startups

Under the current DPIIT framework, broadly:

Eligible Entity

The entity should be incorporated/registered as an eligible structure such as:

Private Limited Company | LLP | Registered Partnership Firm | Cooperative Society

Age

The entity can generally be recognised as a startup for up to:

10 Years from Incorporation / Registration

Turnover

Turnover should remain below:

₹200 Crore

in any previous financial year, as prescribed under the current recognition framework.

Innovation / Scalability

The business should work towards:

Innovation or Improvement of Products, Processes or Services

and/or have a:

Scalable Business Model with High Potential for Employment Generation or Wealth Creation

Original Business

The entity should not merely be formed by splitting up or reconstructing an existing business.

These criteria reflect the Startup India portal updated in August 2026.

Special Framework for DeepTech Startups

The 2026 framework provides extended recognition parameters for qualifying DeepTech startups:

Recognition Period — Up to 20 Years

Turnover Threshold — Below ₹300 Crore

subject to satisfying the applicable DeepTech definition and conditions.',
  'Entity Documents

[DOCUMENT LIST TO BE ADDED]

Founder / Director / Partner Details

[DOCUMENT LIST TO BE ADDED]

Business & Innovation Details

[DOCUMENT LIST TO BE ADDED]

Supporting Information

[DOCUMENT LIST TO BE ADDED]',
  'The process generally involves:

Understand the Business Model
↓
Check DPIIT Eligibility
↓
Identify Innovation / Scalability
↓
Prepare Business Information
↓
Apply through the Government Framework
↓
DPIIT Review / Processing
↓

DPIIT STARTUP RECOGNITION

Applications are currently routed through the National Single Window System (NSWS) as specified by Startup India.',
  'Generally 7–15 Working Days*

The actual processing period may vary depending upon:

Application Completeness | Supporting Information | Government Processing | Clarification / Additional Information, if required

The timeline is indicative and DPIIT recognition cannot be guaranteed.',
  'This is one of the most misunderstood parts of Startup India.

Startup India Certificate ≠ Automatic Tax Exemption

DPIIT recognition and income-tax exemption are separate.

Section 80-IAC

Eligible DPIIT-recognised startups can separately apply for the prescribed income-tax exemption.

The Startup India portal states that eligible startups can claim 100% deduction of profits for 3 consecutive financial years out of the prescribed 10-year period, subject to Section 80-IAC conditions and approval.

For 80-IAC, separate eligibility conditions apply, including the type of entity and date of incorporation.

Therefore:

DPIIT Recognition
↓
Check 80-IAC Eligibility
↓
Separate Application
↓
Approval
↓
Tax Benefit, if eligible',
  'The simplest way to understand it:

Startup India Certificate = Recognition

80-IAC = Separate Tax Benefit',
  'Get Recognised

Move from:

New Business → Recognised Startup

and establish your startup within India''s formal startup ecosystem.

Protect Innovation

Eligible startups can explore IP facilitation and applicable benefits for protecting their innovations and brands.

Explore Funding Opportunities

Recognition can help an eligible startup participate in applicable:

Incubators | Startup Programmes | Funding Schemes | Investor Ecosystems

Explore Government Opportunities

Eligible startups can explore applicable procurement relaxations and government programmes.

Build Investor Readiness

Recognition alone does not attract investment, but when combined with:

Strong Business Model + Compliance + IP + Financials + Growth

it can strengthen the overall startup profile.',
  'The Corporate Hub assists entrepreneurs and businesses in {{CITY}}, {{STATE}} with Startup India Registration (DPIIT Recognition).

The Corporate Hub supports startups across:

Ahmedabad | Gandhinagar | Surat | Vadodara | Rajkot | Gujarat | Pan India

For Gujarat-based startups, we can also evaluate whether the business may qualify for relevant state-level startup programmes or incentives, separately from DPIIT recognition.

For startups anywhere in India, our support can extend beyond the recognition certificate to:

Company Structure | Trademark | Taxation | Accounting | Funding Documentation | Compliance | Business Advisory',
  'We Don''t Just Ask: “Can We Get the Certificate?”

We ask:

“What Can You Do After Getting It?”

We first understand your:

Business Model
Innovation
Scalability
Revenue Model
Intellectual Property
Funding Plans
Tax Position
Future Growth

Then we help identify the relevant journey:

DPIIT Recognition → Tax Benefits → IP → Funding Readiness → Government Opportunities → Growth

Because getting recognised should be the beginning of the startup journey, not the end.',
  'At The Corporate Hub, we assist clients in {{CITY}} with comprehensive startup india registration (dpiit recognition) and ongoing advisory.',
  'Startups may also need:

Private Limited Company Registration
LLP Registration
Trademark Registration
Patent / IP Advisory
GST Registration
Accounting & Taxation
Section 80-IAC Advisory
Startup Funding Support
Business Valuation
Investor Documentation',
  'Don''t get Startup India Recognition just to add another certificate to your company profile.

Understand what your startup can actually unlock with it.

At The Corporate Hub, we help entrepreneurs move from:

Idea → Entity → DPIIT Recognition → Protection → Funding Readiness → Growth

Get Recognised. Build Credibility. Unlock Opportunities.

THE CORPORATE HUB
Startup & Business Consultants | Gujarat • Pan India',
  'Contact our team for a transparent, customised quote based on your specific requirements.',
  '/logo.png',
  '[{"question": "Is every new company eligible for Startup India?", "answer": "No. Merely being newly incorporated is not enough. The business must satisfy the applicable DPIIT eligibility criteria, including innovation/improvement or the prescribed scalable-business criteria.", "sort_order": 1, "is_active": true}, {"question": "What is the current turnover limit?", "answer": "Under the 2026 framework, the turnover threshold is below ₹200 crore for normal recognised startups and below ₹300 crore for qualifying DeepTech startups.", "sort_order": 2, "is_active": true}, {"question": "How old can a startup be?", "answer": "Generally, a normal startup can remain recognised for up to 10 years, while qualifying DeepTech startups can have an extended period of up to 20 years, subject to applicable conditions.", "sort_order": 3, "is_active": true}, {"question": "Does Startup India give 3 years of tax exemption automatically?", "answer": "No. DPIIT recognition itself does not provide automatic income-tax exemption. Eligible startups need to separately satisfy and apply under Section 80-IAC.", "sort_order": 4, "is_active": true}, {"question": "Does DPIIT give funding after registration?", "answer": "No. DPIIT recognition does not guarantee a loan, grant or investment.", "sort_order": 5, "is_active": true}, {"question": "Can an LLP obtain Startup India Recognition?", "answer": "Yes, an eligible LLP can apply for DPIIT recognition.", "sort_order": 6, "is_active": true}, {"question": "Can a proprietorship obtain DPIIT Startup Recognition?", "answer": "A sole proprietorship is not included among the eligible entity structures listed under the current DPIIT recognition criteria.", "sort_order": 7, "is_active": true}, {"question": "Is Startup India useful for an existing business?", "answer": "Potentially yes, provided the entity remains within the prescribed age, turnover and other eligibility criteria and satisfies the innovation/scalability requirements.", "sort_order": 8, "is_active": true}, {"question": "Is Startup India registration available across India?", "answer": "Yes. DPIIT Startup Recognition is a Central Government framework and is not restricted to Gujarat.", "sort_order": 9, "is_active": true}, {"question": "Is the DPIIT certificate itself chargeable by the Government?", "answer": "The Startup India portal states that the Ministry does not charge a fee for DPIIT Certificate of Recognition or Certificate of Eligibility. Professional advisory/support charges, where separately engaged, are different from a government recognition fee.", "sort_order": 10, "is_active": true}]'::jsonb,
  true
)
ON CONFLICT (service_id) DO UPDATE SET
  template_name = EXCLUDED.template_name,
  h1 = EXCLUDED.h1,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  intro = EXCLUDED.intro,
  what_is_service = EXCLUDED.what_is_service,
  who_should_choose = EXCLUDED.who_should_choose,
  key_benefits = EXCLUDED.key_benefits,
  eligibility = EXCLUDED.eligibility,
  documents = EXCLUDED.documents,
  process = EXCLUDED.process,
  timeline = EXCLUDED.timeline,
  tax_compliance = EXCLUDED.tax_compliance,
  comparison = EXCLUDED.comparison,
  how_it_helps = EXCLUDED.how_it_helps,
  local_information = EXCLUDED.local_information,
  why_corporate_hub = EXCLUDED.why_corporate_hub,
  why_choose_service = EXCLUDED.why_choose_service,
  related_services = EXCLUDED.related_services,
  call_to_action = EXCLUDED.call_to_action,
  pricing = EXCLUDED.pricing,
  og_image = EXCLUDED.og_image,
  faqs = EXCLUDED.faqs,
  updated_at = now();
