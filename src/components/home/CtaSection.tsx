import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { ConstellationBackground } from '../layout/MainBackground';
import ClientOnly from '../ClientOnly';
import AutoShimmer from '../AutoShimmer';

interface CtaSectionProps {
  isAuthenticated: boolean;
  isProfileComplete: boolean;
}

const CtaSection: React.FC<CtaSectionProps> = ({ isAuthenticated, isProfileComplete }) => {
  const router = useRouter();

  const handleCallToAction = () => {
    if (isAuthenticated) {
      if (isProfileComplete) {
        router.push('/report');
      } else {
        router.push('/profile');
      }
    } else {
      router.push('/login?redirect=/questionnaire/basic');
    }
  };

  return (
    <div className="bg-secondary-900 w-1/2 mx-auto mb-10 rounded-lg text-white py-16">
      <div className="absolute inset-0 opacity-30 pointer-events-none w-full h-min">
        <ConstellationBackground />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Begin Your Canadian Journey Today</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">
          Take the first step towards your new life in Canada. Our platform simplifies the complex immigration process with personalized guidance.
        </p>
        <ClientOnly fallback={<AutoShimmer />}>
          <Button 
            size="lg" 
            id="hero-button"
            className="bg-white text-primary-700 hover:bg-primary-50"
            onClick={handleCallToAction}
          >
            {isAuthenticated ? 
              (isProfileComplete ? 'View My Immigration Pathways' : 'Complete My Profile') : 
              'Start My Assessment'}
          </Button>
        </ClientOnly>
      </div>
    </div>
  );
};

export default CtaSection;