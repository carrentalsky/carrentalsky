import type { Faq, HomepageSection, PageRecord, SiteSettings } from "@/lib/types";

export const defaultSettings: SiteSettings = {
  id: 1,
  website_name: "CarRentalSky",
  logo_light_url: "/brand/logo-light.png",
  logo_dark_url: "/brand/logo-dark.png",
  favicon_url: "/favicon.ico",
  contact_email: "hello@carrentalsky.com",
  header_cta_text: "Contact us",
  header_cta_link: "/contact",
  footer_description:
    "CarRentalSky is building a cleaner way to plan car rentals across trusted destinations worldwide.",
  social_links: {
    linkedin: "",
    x: "",
    facebook: "",
    instagram: "",
  },
};

export const defaultHomepageSections: HomepageSection[] = [
  {
    id: "hero",
    section_key: "hero",
    title: "Compare car rental options with confidence",
    subtitle:
      "CarRentalSky is a premium travel-tech foundation for discovering trusted car rental choices in global destinations.",
    image_url:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2200&q=80",
    cta_text: "Explore popular locations",
    cta_link: "#popular-locations",
    content: {
      badges: ["Global destinations", "Transparent planning", "Built for travelers"],
    },
    sort_order: 1,
    enabled: true,
  },
  {
    id: "seo",
    section_key: "seo",
    title: "A smarter car rental planning experience",
    subtitle: "Built for search visibility, trust, and future comparison workflows.",
    image_url: null,
    cta_text: null,
    cta_link: null,
    content: {
      body:
        "CarRentalSky helps travelers understand how to approach car rental decisions before they book. Phase 1 focuses on destination content, helpful FAQs, transparent policies, and a scalable CMS foundation.",
    },
    sort_order: 2,
    enabled: true,
  },
  {
    id: "how",
    section_key: "how_it_works",
    title: "How it works",
    subtitle: "Simple planning today, deeper comparison tools later.",
    image_url: null,
    cta_text: null,
    cta_link: null,
    content: {
      steps: [
        {
          title: "Choose your destination",
          text: "Start with high-intent location content and travel guidance.",
        },
        {
          title: "Review rental essentials",
          text: "Understand documents, deposits, insurance, and pickup expectations.",
        },
        {
          title: "Plan with confidence",
          text: "Use clear editorial content while the comparison engine is prepared for later phases.",
        },
      ],
    },
    sort_order: 3,
    enabled: true,
  },
  {
    id: "popular",
    section_key: "popular_locations",
    title: "Popular car rental locations",
    subtitle: "Destination pages can be added from the CMS as the site grows.",
    image_url: null,
    cta_text: null,
    cta_link: null,
    content: {
      locations: ["Dubai", "London", "Istanbul", "Paris", "Los Angeles", "Rome"],
    },
    sort_order: 4,
    enabled: true,
  },
];

export const defaultPages: PageRecord[] = [
  {
    id: "about",
    title: "About CarRentalSky",
    slug: "about",
    excerpt: "Learn how CarRentalSky is building a trusted car rental planning platform.",
    content:
      "<p>CarRentalSky is a travel-tech website built to help travelers plan car rentals with clarity. Our first phase focuses on useful destination content, transparent site policies, and a scalable editorial system.</p><p>Future phases may add richer comparison and supplier workflows, but the foundation begins with trust, speed, and SEO-ready content.</p>",
    hero_image_url:
      "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1800&q=80",
    meta_title: "About CarRentalSky",
    meta_description: "Learn about CarRentalSky and our mission to make car rental planning clearer.",
    canonical_url: "/about",
    og_image_url: null,
    robots_index: true,
    status: "published",
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    slug: "privacy-policy",
    excerpt: "How CarRentalSky handles privacy and data.",
    content:
      "<p>This Privacy Policy explains how CarRentalSky may collect and use information submitted through this website. Replace this starter policy with legal counsel-approved content before launch.</p><h2>Information we collect</h2><p>We may collect contact details when you submit a form, plus standard analytics and technical information used to improve the website.</p><h2>Contact</h2><p>For privacy questions, contact hello@carrentalsky.com.</p>",
    hero_image_url: null,
    meta_title: "Privacy Policy",
    meta_description: "Read the CarRentalSky privacy policy.",
    canonical_url: "/privacy-policy",
    og_image_url: null,
    robots_index: true,
    status: "published",
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    slug: "terms-and-conditions",
    excerpt: "Terms governing use of CarRentalSky.",
    content:
      "<p>These Terms & Conditions provide starter website terms for CarRentalSky. Replace this text with legal counsel-approved terms before launch.</p><h2>Use of the website</h2><p>Content is provided for general information and planning. Phase 1 does not process bookings or compare live supplier prices.</p>",
    hero_image_url: null,
    meta_title: "Terms & Conditions",
    meta_description: "Read the CarRentalSky terms and conditions.",
    canonical_url: "/terms-and-conditions",
    og_image_url: null,
    robots_index: true,
    status: "published",
  },
  {
    id: "contact",
    title: "Contact",
    slug: "contact",
    excerpt: "Contact the CarRentalSky team.",
    content:
      "<p>Have a partnership, editorial, or support question? Email us at hello@carrentalsky.com.</p>",
    hero_image_url: null,
    meta_title: "Contact CarRentalSky",
    meta_description: "Contact the CarRentalSky team.",
    canonical_url: "/contact",
    og_image_url: null,
    robots_index: true,
    status: "published",
  },
];

export const defaultFaqs: Faq[] = [
  {
    id: "faq-1",
    page_slug: "homepage",
    question: "Can I book a car rental on CarRentalSky today?",
    answer:
      "Not yet. Phase 1 is focused on the website foundation, content management, SEO, and admin tools. Booking and supplier integrations are planned for later phases.",
    sort_order: 1,
    enabled: true,
  },
  {
    id: "faq-2",
    page_slug: "homepage",
    question: "Does CarRentalSky compare live supplier prices?",
    answer:
      "No. The current foundation is designed to support future comparison features, but it does not include OTA integrations or live pricing.",
    sort_order: 2,
    enabled: true,
  },
  {
    id: "faq-3",
    page_slug: "homepage",
    question: "Can admins update website content?",
    answer:
      "Yes. Approved admins can update site settings, homepage content, pages, FAQs, and media from the protected admin panel.",
    sort_order: 3,
    enabled: true,
  },
];
