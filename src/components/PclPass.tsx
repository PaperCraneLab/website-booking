import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

function PricingTier({ name, price, description, features, isPopular }: PricingTierProps) {
  return (
    <Card className={`flex flex-col ${isPopular ? 'border-pcl-blue shadow-lg' : ''}`}>
      {isPopular && (
        <div className="bg-pcl-blue text-white py-1 px-4 text-center text-sm font-medium">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{price}</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start">
              <svg className="h-5 w-5 text-pcl-blue mr-2 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function PclPass() {
  return (
    <section className="py-16 bg-gray-50" id="pcl-pass">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4">PCL Pass</h2>
          <p className="text-lg text-gray-600">
            Come work from our space and use our tools! Choose the pass that works best for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <PricingTier
            name="Hourly Pass"
            price="₹200/hr"
            description="Use any tool for an hour during lab hours"
            features={['Access to all basic tools', 'Vinyl cutter', 'Soldering equipment', 'Electronics prototyping tools', 'Basic woodworking equipment', 'Drills & Jigsaw', 'Sewing machine']}
          />
          <PricingTier
            name="10 Hour Pack"
            price="₹1,500"
            description="Use 10 hours across multiple visits (3 weeks)"
            features={['10 hours total usage', 'Valid for 3 weeks', 'Flexible timing', 'Access to all basic tools', 'Vinyl cutter', 'Soldering & electronics tools', 'Complete workshop access']}
            isPopular
          />
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Additional Equipment Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="bg-pcl-blue/10 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pcl-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold mb-1">3D Printers</h4>
                  <p className="text-gray-600">₹200 machine fee (first hour) + filament cost per hour: Creality ₹50/hr · Bambu ₹100/hr</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-pcl-pink/10 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pcl-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold mb-1">Laser Cutter</h4>
                  <p className="text-gray-600">₹5 per minute of cutting</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-pcl-yellow/10 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> Pass costs do not include project materials. We suggest you visit the lab before getting your pass!
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/book" className="btn-primary">
            Book Your PCL Pass
          </Link>
          <p className="mt-4 text-gray-600">
            Or email us at{' '}
            <a href="mailto:lab@papercranelab.com" className="text-pcl-blue hover:underline">lab@papercranelab.com</a>
            {' '}with subject "PCL Pass"
          </p>
        </div>
      </div>
    </section>
  );
}
