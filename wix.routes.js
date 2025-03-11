const routes = {
  routes: [
    {
      path: '/',
      component: 'Home',
      exact: true,
      wixRoute: '/',
      seo: {
        title: 'Bald Eagle Tactical - Professional Tactical Training',
        description: 'Expert tactical training for military, law enforcement, and civilians',
      }
    },
    {
      path: '/courses',
      component: 'Courses',
      wixRoute: '/courses',
      seo: {
        title: 'Training Courses - Bald Eagle Tactical',
        description: 'Professional tactical training courses and programs',
      }
    },
    {
      path: '/booking',
      component: 'Booking',
      wixRoute: '/booking',
      seo: {
        title: 'Book Training - Bald Eagle Tactical',
        description: 'Schedule your tactical training session',
      }
    },
    {
      path: '/about',
      component: 'About',
      wixRoute: '/about',
      seo: {
        title: 'About Us - Bald Eagle Tactical',
        description: 'Learn about our expertise and mission',
      }
    },
    {
      path: '/two-day-course-registration',
      component: 'TwoDayCourseForm',
      wixRoute: '/two-day-course-registration',
      seo: {
        title: 'Two-Day Course Registration - Bald Eagle Tactical',
        description: 'Register for our comprehensive two-day tactical training course',
      }
    },
    {
      path: '/five-day-course-registration',
      component: 'FiveDayCourseForm',
      wixRoute: '/five-day-course-registration',
      seo: {
        title: 'Five-Day Course Registration - Bald Eagle Tactical',
        description: 'Register for our intensive five-day tactical training program',
      }
    },
    {
      path: '/privacy-policy',
      component: 'PrivacyPolicy',
      wixRoute: '/privacy-policy'
    },
    {
      path: '/terms',
      component: 'TermsAndConditions',
      wixRoute: '/terms'
    },
    {
      path: '/refund-policy',
      component: 'RefundPolicy',
      wixRoute: '/refund-policy'
    },
    {
      path: '/accessibility',
      component: 'Accessibility',
      wixRoute: '/accessibility'
    },
    {
      path: '*',
      component: 'NotFound',
      wixRoute: '/404'
    }
  ]
};

export default routes; 