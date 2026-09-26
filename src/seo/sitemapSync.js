import { supabase } from '../supabase';
import { servicesData } from '../data/servicesData';

export const DEFAULT_SITE_URL = 'https://www.thecorporatehub.in';

export const STATIC_SITEMAP_ROUTES = [
  {
    path: '',
    category: 'Core',
    changefreq: 'daily',
    priority: 1.0,
    title: 'Homepage'
  },
  {
    path: '/services',
    category: 'Navigation',
    changefreq: 'daily',
    priority: 0.9,
    title: 'All Services Directory'
  },
  {
    path: '/locations',
    category: 'Navigation',
    changefreq: 'daily',
    priority: 0.9,
    title: 'Locations Directory by State'
  },
  {
    path: '/contact',
    category: 'Core',
    changefreq: 'monthly',
    priority: 0.8,
    title: 'Contact & Advisory'
  },
  {
    path: '/privacy-policy',
    category: 'Legal',
    changefreq: 'yearly',
    priority: 0.3,
    title: 'Privacy Policy'
  },
  {
    path: '/terms-and-conditions',
    category: 'Legal',
    changefreq: 'yearly',
    priority: 0.3,
    title: 'Terms and Conditions'
  },
  {
    path: '/refund-policy',
    category: 'Legal',
    changefreq: 'yearly',
    priority: 0.3,
    title: 'Refund Policy'
  }
];

/**
 * Builds the complete list of URLs across Static, Services, Locations, and Published SEO Pages.
 */
export async function compileAllSitemapRoutes(baseUrl = DEFAULT_SITE_URL) {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const nowIso = new Date().toISOString();
  const allRoutes = [];

  // 1. Static Routes
  for (const s of STATIC_SITEMAP_ROUTES) {
    allRoutes.push({
      url: `${cleanBase}${s.path}`,
      path: s.path || '/',
      category: s.category,
      title: s.title,
      changefreq: s.changefreq,
      priority: s.priority,
      lastmod: nowIso
    });
  }

  // 2. Service Categories & Sub-Services
  if (Array.isArray(servicesData)) {
    for (const service of servicesData) {
      if (service.slug) {
        allRoutes.push({
          url: `${cleanBase}/services/${service.slug}`,
          path: `/services/${service.slug}`,
          category: 'Service Hub',
          title: service.title || service.slug,
          changefreq: 'weekly',
          priority: 0.85,
          lastmod: nowIso
        });

        const subServices = service.accordionData?.onClickServices?.subServices;
        if (Array.isArray(subServices)) {
          for (const sub of subServices) {
            if (sub.id) {
              allRoutes.push({
                url: `${cleanBase}/services/${service.slug}/${sub.id}`,
                path: `/services/${service.slug}/${sub.id}`,
                category: 'Sub-Service',
                title: sub.name || sub.id,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: nowIso
              });
            }
          }
        }
      }
    }
  }

  // 3. Dynamic Active City Locations
  let activeLocations = [];
  try {
    const { data: locs, error: locError } = await supabase
      .from('seo_locations')
      .select('city_name, city_slug, state_name, updated_at')
      .eq('is_active', true)
      .order('city_name');

    if (!locError && locs && locs.length > 0) {
      activeLocations = locs;
      for (const loc of locs) {
        allRoutes.push({
          url: `${cleanBase}/locations/${loc.city_slug}`,
          path: `/locations/${loc.city_slug}`,
          category: 'Location Hub',
          title: `${loc.city_name}, ${loc.state_name}`,
          changefreq: 'weekly',
          priority: 0.85,
          lastmod: loc.updated_at ? new Date(loc.updated_at).toISOString() : nowIso
        });
      }
    }
  } catch (err) {
    console.warn('[compileAllSitemapRoutes] Warning fetching seo_locations:', err);
  }

  // 4. Dynamic Published SEO Location Pages
  let publishedPages = [];
  try {
    const { data: pages, error: pageError } = await supabase
      .from('seo_location_pages')
      .select(`
        id,
        h1,
        published,
        updated_at,
        location_id,
        service_id,
        seo_locations (city_slug, city_name),
        seo_services (service_slug, service_name)
      `)
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (!pageError && pages && pages.length > 0) {
      publishedPages = pages;
      for (const page of pages) {
        const citySlug = page.seo_locations?.city_slug;
        const serviceSlug = page.seo_services?.service_slug;
        const cityName = page.seo_locations?.city_name || citySlug;
        const serviceName = page.seo_services?.service_name || serviceSlug;

        if (citySlug && serviceSlug) {
          allRoutes.push({
            url: `${cleanBase}/locations/${citySlug}/${serviceSlug}`,
            path: `/locations/${citySlug}/${serviceSlug}`,
            category: 'Dynamic SEO Page',
            title: page.h1 || `${serviceName} in ${cityName}`,
            changefreq: 'weekly',
            priority: 0.9,
            lastmod: page.updated_at ? new Date(page.updated_at).toISOString() : nowIso
          });
        }
      }
    }
  } catch (err) {
    console.warn('[compileAllSitemapRoutes] Warning fetching seo_location_pages:', err);
  }

  // Deduplicate by URL
  const seen = new Set();
  const dedupedRoutes = [];
  for (const route of allRoutes) {
    if (!seen.has(route.url)) {
      seen.add(route.url);
      dedupedRoutes.push(route);
    }
  }

  return {
    routes: dedupedRoutes,
    activeLocationsCount: activeLocations.length,
    publishedPagesCount: publishedPages.length
  };
}

/**
 * Builds valid XML conformant with sitemaps.org schema for Google Search Console
 */
export function buildSitemapXml(routes) {
  const urlEntries = routes
    .map((r) => {
      const escapedUrl = r.url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `  <url>
    <loc>${escapedUrl}</loc>
    <lastmod>${r.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${r.changefreq || 'weekly'}</changefreq>
    <priority>${Number(r.priority || 0.8).toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Compiles and synchronizes the sitemap to the database (public.seo_sitemaps).
 */
export async function syncSitemapToDb(baseUrl = DEFAULT_SITE_URL) {
  try {
    const { routes, activeLocationsCount, publishedPagesCount } = await compileAllSitemapRoutes(baseUrl);
    const xml = buildSitemapXml(routes);
    const nowIso = new Date().toISOString();

    const payload = {
      id: 'default',
      xml_content: xml,
      urls_count: routes.length,
      routes_json: routes,
      last_generated_at: nowIso,
      updated_at: nowIso
    };

    const { data, error } = await supabase
      .from('seo_sitemaps')
      .upsert(payload)
      .select('*')
      .maybeSingle();

    if (error) {
      // Check if table missing
      if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
        return {
          success: false,
          tableMissing: true,
          routes,
          xml,
          count: routes.length,
          activeLocationsCount,
          publishedPagesCount,
          lastGeneratedAt: nowIso,
          error: "Table 'seo_sitemaps' not found in database. Run the SQL migration in Supabase SQL editor."
        };
      }
      throw error;
    }

    return {
      success: true,
      tableMissing: false,
      record: data || payload,
      routes,
      xml,
      count: routes.length,
      activeLocationsCount,
      publishedPagesCount,
      lastGeneratedAt: nowIso
    };
  } catch (err) {
    console.error('[syncSitemapToDb] Error syncing sitemap to DB:', err);
    return {
      success: false,
      error: err.message || 'Failed to sync sitemap to database.'
    };
  }
}

/**
 * Fetches the currently stored sitemap record from the database.
 */
export async function fetchCurrentSitemapFromDb() {
  try {
    const { data, error } = await supabase
      .from('seo_sitemaps')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        return { tableMissing: true, record: null };
      }
      throw error;
    }

    return { tableMissing: false, record: data };
  } catch (err) {
    console.warn('[fetchCurrentSitemapFromDb] Error reading sitemap:', err);
    return { tableMissing: false, record: null, error: err.message };
  }
}
