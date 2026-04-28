
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ContactSubmittedPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Submitted - Pro Mount USA</title>
        <meta name="description" content="Thank you for contacting Pro Mount USA. We've received your message and will respond within 24 hours." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950">
        <Header />
        
        <main className="flex-grow flex items-center justify-center px-4 py-20 mt-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl w-full text-center"
          >
            {/* Success Icon */}
            <motion.div
              variants={iconVariants}
              animate={["visible", "pulse"]}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <CheckCircle2 className="w-24 h-24 md:w-32 md:h-32 text-orange-500" strokeWidth={2} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                  className="absolute inset-0 rounded-full border-2 border-orange-500"
                />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6"
            >
              Thank You for{' '}
              <span className="text-orange-500">Contacting Us!</span>
            </motion.h1>

            {/* Confirmation Message */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/80 mb-6 leading-relaxed"
            >
              We've received your message and will get back to you as soon as possible. 
              Our team typically responds within <span className="text-orange-500 font-bold">24 hours</span>.
            </motion.p>

            {/* Additional Info */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 mb-10"
            >
              <p className="text-white/70 mb-4">
                <span className="font-bold text-white">What happens next?</span>
              </p>
              <ul className="text-left space-y-3 text-white/70">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">•</span>
                  <span>Our team will review your message and contact details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">•</span>
                  <span>We'll reach out via your preferred contact method</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">•</span>
                  <span>You'll receive a personalized quote and available appointment times</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-white/80 font-semibold mb-2">Need immediate assistance?</p>
                <a 
                  href="tel:9724303694" 
                  className="text-orange-500 hover:text-orange-400 font-bold text-lg transition-colors"
                >
                  Call us: (972) 430-3694
                </a>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                onClick={() => navigate('/')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full transition-all font-bold text-lg shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50"
              >
                <Home className="w-5 h-5" />
                Return to Home
              </motion.button>

              <motion.button
                onClick={() => navigate('/booking')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 hover:border-orange-500 px-8 py-4 rounded-full transition-all font-bold text-lg"
              >
                <Calendar className="w-5 h-5" />
                Schedule Installation
              </motion.button>
            </motion.div>

            {/* Trust Signal */}
            <motion.p
              variants={itemVariants}
              className="text-white/50 text-sm mt-8"
            >
              🔒 Your information is secure and will never be shared with third parties
            </motion.p>
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactSubmittedPage;
