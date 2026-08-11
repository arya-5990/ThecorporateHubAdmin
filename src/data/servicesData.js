export const servicesData = [
  {
    id: "business-registration",
    slug: "business-registration",
    title: "Business Registration",
    iconName: "IoDocumentOutline",
    shortDescription: "Complete legal structure registration for your business, startup, or enterprise.",
    accordionData: {
      about: {
        title: "About Business Registration",
        content: `Business registration is the fundamental legal step required to formalize your business structure in accordance with statutory regulations. Incorporating your business grants it a separate legal entity status, protects personal assets through limited liability, and unlocks access to corporate banking, investor capital, and government schemes.

Whether you are launching a startup, transforming a partnership, or establishing an international subsidiary, registering your entity ensures complete legal compliance and credibility in the market.`
      },
      servicesWeProvide: {
        title: "Services We Provide",
        items: [
          {
            name: "Private Limited Company Incorporation",
            desc: "Ideal for startups and growing businesses seeking equity funding and limited liability."
          },
          {
            name: "Limited Liability Partnership (LLP)",
            desc: "Combines operational flexibility of a partnership with limited liability protection."
          },
          {
            name: "One Person Company (OPC)",
            desc: "Full limited liability protection for solo entrepreneurs and sole founders."
          },
          {
            name: "Sole Proprietorship Registration",
            desc: "Quick, low-cost registration perfect for small business owners and freelancers."
          },
          {
            name: "Section 8 NGO / Non-Profit",
            desc: "Registration for charitable trusts, foundations, and social enterprises."
          },
          {
            name: "Public Limited Company",
            desc: "Designed for large-scale operations seeking public share subscriptions."
          }
        ]
      },
      onClickServices: {
        title: "Services here on click accordion",
        subServices: [
          {
            id: "pvt-ltd",
            name: "Private Limited Company",
            tagline: "Most popular choice for tech startups & venture-backed entities",
            process: [
              "Name Reservation via RUN / SPICe+ Part A",
              "Digital Signature Certificate (DSC) & Director Identification Number (DIN)",
              "Drafting Memorandum & Articles of Association (MOA & AOA)",
              "Filing SPICe+ Part B & Certificate of Incorporation (COI) Issuance",
              "Automated PAN, TAN, EPFO, ESIC & Bank Account setup"
            ],
            turnaround: "5 - 7 Business Days",
            documentsNeeded: ["PAN Card of Directors", "Aadhaar Card / Passport", "Bank Statement / Utility Bill", "Registered Office Rent Agreement / Electricity Bill"]
          },
          {
            id: "llp-reg",
            name: "Limited Liability Partnership (LLP)",
            tagline: "Best for professional firms, agencies, and joint ventures",
            process: [
              "Designated Partner Identification Number (DPIN) application",
              "Name approval via FiLLiP portal",
              "Filing Incorporation Document & Subscriber Statement",
              "Drafting & execution of LLP Agreement within 30 days"
            ],
            turnaround: "7 - 10 Business Days",
            documentsNeeded: ["Identity proof of partners", "Address proof of designated partners", "Proof of registered office premise", "NOC from property owner"]
          },
          {
            id: "opc-reg",
            name: "One Person Company (OPC)",
            tagline: "Single founder setup with corporate entity benefits",
            process: [
              "Obtaining DSC for single director",
              "Name reservation approval",
              "Nominee consent form (INC-3) submission",
              "Final incorporation filing & Certificate issuance"
            ],
            turnaround: "4 - 6 Business Days",
            documentsNeeded: ["PAN & ID proof of owner", "Nominee ID & Address proof", "Registered office address proof"]
          },
          {
            id: "sec8-reg",
            name: "Section 8 Non-Profit Company",
            tagline: "For non-profit, educational, or social cause organizations",
            process: [
              "License application under Section 8(1)",
              "Name approval & MOA/AOA tailored to non-profit objectives",
              "Submitting form SPICe+ for registration certificate",
              "12A & 80G tax exemption applications"
            ],
            turnaround: "12 - 15 Business Days",
            documentsNeeded: ["Pan/Aadhaar of promoters", "Work projection report for 3 years", "Estimated future income & expenditure statement"]
          }
        ]
      },
      termsAndConditions: {
        title: "Term and Conditions",
        items: [
          "Government statutory fees are subject to government portal revisions and actual state stamp duty variations.",
          "Turnaround times are dependent on MCA/ROC approval speeds and prompt submission of accurate documentation by the client.",
          "Digital Signature Certificates (DSC) require video verification from mandatory authorized signatories.",
          "All documents provided must be clear, legible, and legally valid under current regulatory norms.",
          "Cancellations requested after name approval submission are eligible for partial refunds minus government processing charges."
        ]
      }
    }
  },
  {
    id: "intellectual-property",
    slug: "intellectual-property",
    title: "Intellectual Property",
    iconName: "LuBrain",
    shortDescription: "Protect your brand name, trade secrets, inventions, copyrights, and design patents.",
    accordionData: {
      about: {
        title: "About Intellectual Property",
        content: `Intellectual Property (IP) safeguards your unique creations, legal brand names, proprietary formulas, artistic works, and technological innovations. Securing IP rights prevents unauthorized usage, counterfeiting, and brand infringement by competitors.

Our IP legal services empower startups and corporations to build enterprise valuation through strong portfolio defense, trademark registration, patent protection, and copyright filings.`
      },
      servicesWeProvide: {
        title: "Services We Provide",
        items: [
          { name: "Trademark Registration & Search", desc: "Comprehensive brand name, logo, and slogan protection across global classes." },
          { name: "Patent Drafting & Filing", desc: "Protect innovative technical processes, hardware inventions, and utility patents." },
          { name: "Copyright Registration", desc: "Legal ownership for software code, original literature, artwork, and media content." },
          { name: "Design Registration", desc: "Protect unique physical shapes, product designs, and industrial aesthetics." },
          { name: "IP Opposition & Litigation Defense", desc: "Legal representation in trademark hearing objections and infringement suits." }
        ]
      },
      onClickServices: {
        title: "Services here on click accordion",
        subServices: [
          {
            id: "tm-reg",
            name: "Trademark Registration & Filing",
            tagline: "Secure ™ and ® status for your brand name & symbol",
            process: [
              "Public Trademark Search across 45 Classes",
              "Application drafting and TM Form submission",
              "Issuance of Official TM Application Receipt (Allows instant ™ usage)",
              "Monitoring examination report & handling objections if raised"
            ],
            turnaround: "Same-Day Filing (Final Certificate in 6-12 Months)",
            documentsNeeded: ["Logo image / Brand Name", "Incorporation Certificate or ID Proof", "User Affidavit (if trademark is already in use)"]
          },
          {
            id: "patent-filing",
            name: "Provisional & Complete Patent Filing",
            tagline: "Protect groundbreaking inventions & technical hardware",
            process: [
              "Patentability & Novelty Search",
              "Provisional Application Drafting (Secures priority date)",
              "Complete Specification Filing within 12 months",
              "Patent Examination Request & Response to FER"
            ],
            turnaround: "1 - 3 Years for final grant (Fast-track option available)",
            documentsNeeded: ["Invention disclosure document", "Technical flowcharts & diagrams", "Applicant details & assignment deeds"]
          },
          {
            id: "copyright-filing",
            name: "Software & Literary Copyright",
            tagline: "Lock copyright protection for source code & creative media",
            process: [
              "Work categorization and application preparation",
              "Filing Form XIV with Copyright Office",
              "30-day mandatory public objection period",
              "Registration certificate issuance"
            ],
            turnaround: "2 - 4 Months",
            documentsNeeded: ["Source code snippets / Creative work copies", "No Objection Certificate (NOC) from author", "Applicant ID proof"]
          }
        ]
      },
      termsAndConditions: {
        title: "Term and Conditions",
        items: [
          "Trademark application approval is solely at the discretion of the Trademark Registry Examiner.",
          "In the event of an official objection or opposition from third parties, separate hearing representation fees may apply.",
          "Filing receipt grants immediate right to use the ™ symbol, while ® can only be used after formal registration.",
          "Government official fees vary depending on whether the applicant is an Individual/Startup or a Large Corporate Entity."
        ]
      }
    }
  },
  {
    id: "accounting-taxation",
    slug: "accounting-taxation",
    title: "Accounting & Taxation",
    iconName: "MdAttachMoney",
    shortDescription: "End-to-end bookkeeping, GST filing, Income Tax Returns, and corporate financial advisory.",
    accordionData: {
      about: {
        title: "About Accounting & Taxation",
        content: `Streamlined accounting and precise tax compliance form the backbone of a financially healthy enterprise. Navigating regulatory taxation rules requires timely filing, audited books, and optimized tax planning.

We provide comprehensive CFO services, automated bookkeeping, GST returns, income tax filings, and tax audit representation to ensure zero-penalty compliance.`
      },
      servicesWeProvide: {
        title: "Services We Provide",
        items: [
          { name: "Monthly Bookkeeping & Accounting", desc: "Cloud accounting using Tally, Zoho Books, or QuickBooks." },
          { name: "GST Registration & Return Filing", desc: "GSTR-1, GSTR-3B, GSTR-9 annual returns and input tax credit reconciliations." },
          { name: "Corporate Income Tax Returns (ITR)", desc: "Tax optimization, ITR-6 filing, and advance tax computations." },
          { name: "TDS / TCS Compliance", desc: "Quarterly TDS return filing, Form 16/16A generation." },
          { name: "Virtual CFO & Financial Advisory", desc: "Cash flow management, financial modeling, and MIS reporting." }
        ]
      },
      onClickServices: {
        title: "Services here on click accordion",
        subServices: [
          {
            id: "gst-filing",
            name: "GST Registration & Monthly Compliance",
            tagline: "Hassle-free GST filings & ITC maximization",
            process: [
              "GST portal application submission",
              "Aadhaar authentication & physical verification if mandated",
              "GSTIN allotment",
              "Monthly GSTR-1 sales reporting & GSTR-3B tax payment"
            ],
            turnaround: "3 - 5 Business Days for Registration",
            documentsNeeded: ["PAN & Aadhaar of Authorized Signatory", "Business Address Proof", "Cancelled Cheque / Bank Statement"]
          },
          {
            id: "itr-corporate",
            name: "Corporate Income Tax Return (ITR-6)",
            tagline: "Annual corporate tax filing with deductions audit",
            process: [
              "Financial Statement preparation (Balance Sheet & P&L)",
              "Tax audit report computation under Section 44AB",
              "E-filing of ITR-6 portal form",
              "ITR verification & acknowledgment receipt"
            ],
            turnaround: "3 - 5 Business Days",
            documentsNeeded: ["Audited Financial Accounts", "Bank Statements for the FY", "TDS Certificates & Form 26AS / AIS"]
          }
        ]
      },
      termsAndConditions: {
        title: "Term and Conditions",
        items: [
          "Clients are required to furnish bank statements and sales invoices before the 5th of every month for timely filing.",
          "Interest and late fees levied by government tax portals due to delayed client document submission are payable by the client.",
          "Virtual CFO packages operate under monthly retainer agreements."
        ]
      }
    }
  },
  {
    id: "corporate-compliance",
    slug: "corporate-compliance",
    title: "Corporate Compliance",
    iconName: "GrGroup",
    shortDescription: "Annual ROC filings, board resolutions, DIN updates, and statutory company secretarial support.",
    accordionData: {
      about: {
        title: "About Corporate Compliance",
        content: `Every registered company and partnership must adhere to periodic statutory compliance mandates issued by the Ministry of Corporate Affairs (MCA). Failing to file annual returns results in heavy daily penalties and director disqualification.

Our secretarial team manages your ROC filings, mandatory board meetings, share transfers, director onboarding, and statutory registers effortlessly.`
      },
      servicesWeProvide: {
        title: "Services We Provide",
        items: [
          { name: "ROC Annual Filing (AOC-4 & MGT-7)", desc: "Mandatory annual financial statement and return filing with MCA." },
          { name: "DIR-3 KYC & Commencment of Business", desc: "Annual director KYC verification and INC-20A filings." },
          { name: "Appointment / Resignation of Directors", desc: "Filing Form DIR-12 and updated board resolutions." },
          { name: "Capital Increase & Share Allocation", desc: "PAS-3 filings, equity allotment, and valuation reports." },
          { name: "Company Closure & Strike Off (STK-2)", desc: "Orderly voluntary winding up of dormant entities." }
        ]
      },
      onClickServices: {
        title: "Services here on click accordion",
        subServices: [
          {
            id: "roc-annual",
            name: "Annual ROC Filings (Form AOC-4 & MGT-7)",
            tagline: "Maintain active company status without MCA fines",
            process: [
              "Preparation of Board Report & Financial Annexures",
              "Drafting Annual General Meeting (AGM) notices",
              "Filing Form AOC-4 (Financials) & MGT-7 (Annual Return)",
              "Generating MCA compliance certificate"
            ],
            turnaround: "4 - 7 Business Days",
            documentsNeeded: ["Signed Audit Report & Financial Statements", "Director Details & Shareholding Pattern", "Agm Minutes & Board Resolutions"]
          },
          {
            id: "dir3-kyc",
            name: "Director DIR-3 KYC Verification",
            tagline: "Mandatory annual verification for all DIN holders",
            process: [
              "Verification of Director Mobile Number & Personal Email",
              "Filing DIR-3 KYC Web or e-Form with Digital Signature",
              "Generation of MCA SRN confirmation receipt"
            ],
            turnaround: "Same-Day Filing",
            documentsNeeded: ["Director PAN Card", "Aadhaar / Passport", "Active Mobile Number & Email Address"]
          }
        ]
      },
      termsAndConditions: {
        title: "Term and Conditions",
        items: [
          "Annual filings must be completed within 30 days of holding the Annual General Meeting (AGM).",
          "MCA imposes additional daily penalty fees of ₹100 per day for delayed filing beyond statutory due dates.",
          "Directors with deactivated DINs due to missed DIR-3 KYC must pay ₹5,000 government penalty to re-activate."
        ]
      }
    }
  },
  {
    id: "business-growth",
    slug: "business-growth",
    title: "Business Growth",
    iconName: "BsGraphDownArrow",
    shortDescription: "Pitch decks, valuation certificates, startup India registration, and fundraising legal support.",
    accordionData: {
      about: {
        title: "About Business Growth",
        content: `Scaling a modern enterprise requires capital, strategic partnerships, brand positioning, and legal readiness for fundraising.

We equip high-growth startups with Startup India DPIIT recognition, pitch deck creation, financial valuation certificates, cap table planning, and investor term sheet negotiations.`
      },
      servicesWeProvide: {
        title: "Services We Provide",
        items: [
          { name: "DPIIT Startup India Recognition", desc: "Unlock 80-IAC 3-year tax holidays and angel tax exemptions." },
          { name: "Business Valuation Certificate", desc: "Chartered Accountant & Registered Valuer valuation reports for fundraising." },
          { name: "Pitch Deck & Investor Data Room", desc: "Design & financial modeling crafted for VC and Angel presentations." },
          { name: "SHA / Term Sheet Assistance", desc: "Legal review of Shareholder Agreements and Convertible Notes (CCPS/SAFE)." }
        ]
      },
      onClickServices: {
        title: "Services here on click accordion",
        subServices: [
          {
            id: "dpiit-reg",
            name: "DPIIT Startup India Certificate",
            tagline: "Get government recognized startup status & tax perks",
            process: [
              "Eligibility assessment of innovation criteria",
              "Drafting write-up on innovation and scalability",
              "Online portal application filing with supporting documents",
              "DPIIT recognition certificate issuance"
            ],
            turnaround: "5 - 7 Business Days",
            documentsNeeded: ["Incorporation Certificate", "Brief Pitch Deck / Business Summary", "Website / App Link / Prototype photos"]
          },
          {
            id: "valuation-cert",
            name: "Valuation Report by Registered Valuer",
            tagline: "DCF & Net Asset valuation for share allotment",
            process: [
              "Financial projection model verification",
              "Discounted Cash Flow (DCF) calculation",
              "Issuance of Valuer Certificate required under Companies Act & Income Tax"
            ],
            turnaround: "3 - 5 Business Days",
            documentsNeeded: ["3-5 Year Financial Projections", "Audited Financials", "Cap Table Details"]
          }
        ]
      },
      termsAndConditions: {
        title: "Term and Conditions",
        items: [
          "DPIIT recognition is granted to entities incorporated for less than 10 years with turnover below ₹100 Crores.",
          "Valuation reports are generated based on management-certified financial projections provided by the company.",
          "80-IAC tax holiday approval requires a separate presentation before the Inter-Ministerial Board."
        ]
      }
    }
  },
  {
    id: "licenses-certifications",
    slug: "licenses-certifications",
    title: "Licenses & Certifications",
    iconName: "RiCertificate2Line",
    shortDescription: "FSSAI, ISO certification, MSME Udyam, Import Export Code (IEC), and trade licenses.",
    accordionData: {
      about: {
        title: "About Licenses & Certifications",
        content: `Operating a business legally often requires sector-specific licenses, quality standard certifications, and state trade permits. Operating without mandatory regulatory licenses can lead to closure notices and administrative fines.

We streamline government inspections, license filings, quality certifications, and renewal trackers so you can focus on running your business.`
      },
      servicesWeProvide: {
        title: "Services We Provide",
        items: [
          { name: "MSME / Udyam Registration", desc: "Free government portal registration unlocking priority sector lending & subsidies." },
          { name: "FSSAI Food License", desc: "Basic, State, or Central food safety license for restaurants, cloud kitchens & manufacturers." },
          { name: "Import Export Code (IEC)", desc: "DGFT registration required for international trade & customs clearance." },
          { name: "ISO 9001:2015 Certification", desc: "International quality management accreditation for tender eligibility." },
          { name: "Shop & Establishment License", desc: "Mandatory local municipal registration for commercial office premises." }
        ]
      },
      onClickServices: {
        title: "Services here on click accordion",
        subServices: [
          {
            id: "fssai-lic",
            name: "FSSAI Food Safety License",
            tagline: "Mandatory for food businesses, kitchens & packaged food brands",
            process: [
              "Determining basic, state, or central license eligibility based on capacity",
              "FoSCoS portal application drafting & layout diagram attachment",
              "Inspection handling by Food Safety Officer if required",
              "FSSAI License certificate generation with 14-digit number"
            ],
            turnaround: "5 - 10 Business Days",
            documentsNeeded: ["Applicant Photo & ID Proof", "Premise Address Proof / Rent Agreement", "List of Food Categories & Equipment"]
          },
          {
            id: "iec-code",
            name: "Import Export Code (IEC)",
            tagline: "Lifetime validity code issued by DGFT for global trade",
            process: [
              "DGFT user registration & digital key binding",
              "Filing online IEC application",
              "Bank account verification and instant IEC issuance"
            ],
            turnaround: "1 - 2 Business Days",
            documentsNeeded: ["PAN Card of Entity", "Cancelled Cheque of Firm", "Registered Office Premises Proof"]
          },
          {
            id: "msme-udyam",
            name: "MSME Udyam Registration",
            tagline: "Access collateral-free loans & government subsidies",
            process: [
              "Aadhaar & PAN verification on Udyam portal",
              "NIC Code selection for business activities",
              "Instant generation of e-Udyam Certificate"
            ],
            turnaround: "Same-Day Filing",
            documentsNeeded: ["Aadhaar linked with Mobile", "Business PAN", "Bank account details"]
          }
        ]
      },
      termsAndConditions: {
        title: "Term and Conditions",
        items: [
          "FSSAI license validity ranges from 1 to 5 years; renewal must be applied 30 days prior to expiry.",
          "Import Export Code requires mandatory annual online update on the DGFT portal between April and June.",
          "Municipal shop license guidelines vary depending on state and local municipal corporation rules."
        ]
      }
    }
  }
];
