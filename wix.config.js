module.exports = {
  extends: '@wix/wix-config',
  site: {
    pages: [
      {
        name: 'Home',
        url: '/',
        components: ['Hero', 'FeaturedProducts', 'About']
      },
      {
        name: 'Courses',
        url: '/courses',
        components: ['Courses']
      },
      {
        name: 'Booking',
        url: '/booking',
        components: ['Booking'],
        preserveWixFeatures: ['bookings', 'forms', 'payments']
      },
      {
        name: 'About',
        url: '/about',
        components: ['About']
      }
    ],
    theme: './wix/theme.json',
    preserveComponents: [
      'wix-forms',
      'wix-bookings',
      'wix-payments',
      'wix-members'
    ]
  },
  build: {
    directory: 'dist'
  }
} 