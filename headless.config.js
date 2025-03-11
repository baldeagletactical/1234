import routes from './src/routes';

export default {
  // Your Wix site ID
  siteId: 'my-site-4',
  
  // Build configuration
  build: {
    // Use your existing Vite build
    command: 'npm run build',
    directory: 'dist',
  },

  // Development configuration
  dev: {
    // Use your existing dev server
    command: 'npm run dev',
    framework: 'vite',
  },

  // Wix integration settings
  wix: {
    // Use client-side routing
    router: {
      type: 'client',
      routes: routes.routes,
      // Handle 404s
      notFound: {
        component: 'NotFound'
      }
    },
    // Keep your existing styles
    styles: {
      include: ['dist/assets/*.css'],
    },
    // Site settings
    site: {
      title: 'Bald Eagle Tactical',
      description: 'Professional tactical training for military, law enforcement, and civilians',
      favicon: 'public/favicon.ico',
      viewport: 'width=device-width, initial-scale=1.0',
    },
    // Component settings
    components: {
      // Preserve React components
      preserveType: 'react',
      // Map components to Wix editor
      editorMapping: {
        Hero: { type: 'section', label: 'Hero Section' },
        Navbar: { type: 'section', label: 'Navigation Bar' },
        FeaturedProducts: { type: 'section', label: 'Featured Courses' },
        About: { type: 'section', label: 'About Section' },
        Footer: { type: 'section', label: 'Footer' },
        Courses: { type: 'page', label: 'Courses Page' },
        Booking: { type: 'page', label: 'Booking Page' },
      }
    }
  }
} 