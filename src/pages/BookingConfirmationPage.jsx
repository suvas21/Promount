import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookingModal from '@/components/BookingModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SuccessState from '@/components/booking/SuccessState';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const prefillFormData = location.state?.formData || null;
  const prefillStep = location.state?.step || 1;
  const successData = location.state?.successData || null;

  if (successData?.formData) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-12 mt-4">
              <SuccessState
                formData={successData.formData}
                stripeCheckoutUrl={successData.stripeCheckoutUrl}
                onClose={() => navigate('/')}
                onReset={() => navigate(`/booking${location.search || ''}`)}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <BookingModal
      isOpen={true}
      onClose={() => navigate('/')}
      initialFormData={prefillFormData}
      initialStep={prefillStep}
    />
  );
};

export default BookingConfirmationPage;
