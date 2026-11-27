/**
 * The main navigation. `stage` marks modules that are designed and have their database tables in
 * place but whose features arrive in a later build stage — they are shown honestly as "planned".
 */
export type NavItem = { href: string; label: string; icon: string; stage?: number };
export type NavGroup = { label: string | null; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  { label: null, items: [{ href: '/overview', label: 'Overview', icon: 'overview' }] },
  {
    label: 'Brand knowledge',
    items: [
      { href: '/brands', label: 'Brands', icon: 'brands' },
      { href: '/products', label: 'Product Catalogue', icon: 'products' },
      { href: '/knowledge', label: 'Knowledge Search', icon: 'search' },
      { href: '/books', label: 'Brand Books', icon: 'books' },
    ],
  },
  {
    label: 'Market',
    items: [
      { href: '/marketplaces', label: 'Marketplace Intelligence', icon: 'marketplaces' },
      { href: '/pricing', label: 'Pricing Intelligence', icon: 'pricing' },
      { href: '/digital-shelf', label: 'Digital Shelf', icon: 'shelf', stage: 3 },
      { href: '/listing-quality', label: 'Listing Quality', icon: 'quality', stage: 4 },
      { href: '/reviews', label: 'Reviews & Ratings', icon: 'reviews', stage: 4 },
      { href: '/competitors', label: 'Competitor Intelligence', icon: 'competitors', stage: 4 },
    ],
  },
  {
    label: 'Action',
    items: [
      { href: '/content-studio', label: 'Content Studio', icon: 'content', stage: 5 },
      { href: '/recommendations', label: 'Recommendations', icon: 'recommendations', stage: 5 },
      { href: '/reports', label: 'Reports', icon: 'reports', stage: 5 },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/automation', label: 'Automation', icon: 'automation', stage: 5 },
      { href: '/settings', label: 'Settings', icon: 'settings' },
    ],
  },
];
