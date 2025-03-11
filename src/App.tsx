import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import About from './components/About';
import Footer from './components/Footer';
import Courses from './components/Courses';
import Booking from './components/Booking';
import Accessibility from './components/Accessibility';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsAndConditions from './components/TermsAndConditions';
import TwoDayCourseForm from './components/TwoDayCourseForm';
import FiveDayCourseForm from './components/FiveDayCourseForm';
import RefundPolicy from './components/RefundPolicy';
import NotFound from './pages/NotFound';

function App() {
  const location = useLocation();
  console.log('Current path:', location.pathname); // Debug logging

  return (
    <div className="min-h-screen bg-tactical-950">
      <Navbar />
      <Routes>
        <Route index element={
          <>
            <Hero />
            <FeaturedProducts />
            <About />
          </>
        } />
        <Route path="courses" element={<Courses />} />
        <Route path="booking" element={<Booking />} />
        <Route path="about" element={<About />} />
        <Route path="accessibility" element={<Accessibility />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsAndConditions />} />
        <Route path="two-day-course-registration" element={<TwoDayCourseForm />} />
        <Route path="five-day-course-registration" element={<FiveDayCourseForm />} />
        <Route path="refund-policy" element={<RefundPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
