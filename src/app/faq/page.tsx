import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';

export const metadata = {
  title: 'FAQ — Paper Crane Lab',
  description: 'Frequently asked questions about the PCL Makerspace, passes, tool training, and machines.',
};

interface FAQItem {
  q: string;
  a: React.ReactNode;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Tool Training',
    q: 'When should I book tool training?',
    a: 'If you have never used a machine before, book a tool training session first. A PCL team member will walk you through safe and correct usage before you work independently.',
  },
  {
    category: 'Tool Training',
    q: 'What can I learn in tool training?',
    a: (
      <>
        Each tool training session is specific to the machine you are booking. Our team will cover safety, basic operation, and common techniques. Reach out to us at{' '}
        <a href="mailto:lab@papercranelab.com" className="text-pcl-blue hover:underline">lab@papercranelab.com</a>{' '}
        if you want more details on what a specific training covers.
      </>
    ),
  },
  {
    category: 'Using the Machines',
    q: 'If I\'m coming in to use a machine, what files should I have ready?',
    a: (
      <div className="space-y-2">
        <p>Here is a quick guide by machine:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li><strong>3D Printers</strong> — An STL, 3MF, or OBJ file of your model. We can help you slice it on arrival.</li>
          <li><strong>Laser Cutter</strong> — An SVG or DXF file with your cut/engrave paths. PNG or BITMAP works for engraving. Know your material thickness.</li>
          <li><strong>Vinyl Cutter</strong> — A PNG of what you want to cut works perfectly</li>
          <li><strong>Electronics</strong> — Your schematic or circuit diagram, and any code you plan to upload.</li>
          <li><strong>Woodworking / Sewing</strong> — Your design sketch or measurements. No file needed.</li>
        </ul>
        <p className="text-sm text-gray-500 mt-2">Not sure? Email us beforehand at{' '}
        <a href="mailto:lab@papercranelab.com" className="text-pcl-blue hover:underline">lab@papercranelab.com</a>{' '} and we can advise.</p>
      </div>
    ),
  },
  {
    category: 'Visiting the Lab',
    q: 'Can I talk to someone before coming in?',
    a: (
      <>
        Yes! Email us at{' '}
        <a href="mailto:lab@papercranelab.com" className="text-pcl-blue hover:underline">lab@papercranelab.com</a>{' '}
        and we will be happy to answer questions, help you plan your session, or schedule a quick call.
      </>
    ),
  },
  {
    category: 'Visiting the Lab',
    q: 'Are you a production house?',
    a: 'No — PCL is a makerspace. You come in, use the machines, learn, make mistakes, and try again. We are here to help you build skills and make things yourself, not to manufacture on your behalf.',
  },
  {
    category: '3D Printing',
    q: 'Can I send you files to 3D print on my behalf?',
    a: (
      <>
        We generally encourage you to come in and use the machines yourself — that is the spirit of a makerspace. If that is truly not possible, email us at{' '}
        <a href="mailto:lab@papercranelab.com" className="text-pcl-blue hover:underline">lab@papercranelab.com</a>{' '}
        and we will review it on a case-by-case basis. Pricing for remote prints is 1.5 times the standard PCL Pass rate.
      </>
    ),
  },
  {
    category: '3D Printing',
    q: 'Do you design files for me?',
    a: 'No, we do not design files. However, you can learn the basics of designing for specific machines through our workshops or as part of a tool training session. Ask us about upcoming workshops at lab@papercranelab.com.',
  },
  {
    category: 'Pricing & Passes',
    q: 'Do you have any discounts?',
    a: (
      <>
        Yes! School and college students get a <strong>20% discount</strong> on PCL Passes — just show your ID when you arrive. For other discount enquiries (NGOs, educators, bulk bookings), email us at{' '}
        <a href="mailto:lab@papercranelab.com" className="text-pcl-blue hover:underline">lab@papercranelab.com</a>.
      </>
    ),
  },
  {
    category: 'Pricing & Passes',
    q: 'How many hours of pass should I book?',
    a: (
      <>
        <p className="font-semibold text-pcl-dark-gray mb-2">Golden rule of making: if you think it will take 1 hour, plan for 2 hours.</p>
        <p>Things almost always take longer than expected — file tweaks, test runs, material swaps. If your file says 1 hour of print/cut time, book a 2-hour slot so you have time to set up, adjust, and wrap up comfortably.</p>
        <p className="mt-2 text-sm text-gray-500">The lab closes at the scheduled time — please plan accordingly.</p>
      </>
    ),
  },
];

const categories = Array.from(new Set(faqs.map((f) => f.category)));

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-pcl-blue/10 to-white">
        <div className="container max-w-3xl">
          <SectionTitle
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about using the PCL Makerspace"
          />
          <p className="text-gray-600 mt-2">
            Can&apos;t find your answer here?{' '}
            <a href="mailto:lab@papercranelab.com" className="text-pcl-blue hover:underline font-medium">
              Email us at lab@papercranelab.com
            </a>
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <section className="py-12">
        <div className="container max-w-3xl space-y-12">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-lg font-bold text-pcl-blue uppercase tracking-wide mb-4 border-b border-pcl-blue/20 pb-2">
                {category}
              </h2>
              <div className="space-y-4">
                {faqs.filter((f) => f.category === category).map((faq) => (
                  <div key={faq.q} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-pcl-dark-gray mb-2">{faq.q}</h3>
                    <div className="text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="container max-w-xl">
          <p className="text-gray-500 mb-6">Ready to come in and make something?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book" className="btn-primary">Book a PCL Pass</Link>
            <Link href="/makerspace" className="btn-secondary">Learn About the Makerspace</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
