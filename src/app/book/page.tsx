import SectionTitle from '@/components/SectionTitle';
import MachineCard from '@/components/MachineCard';
import TrainingProjects from '@/components/TrainingProjects';
import { MACHINES, PASS_TYPES } from '@/lib/machines';
import Link from 'next/link';
export default function BookPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-pcl-blue/10 to-white">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book at <span className="text-pcl-blue">Paper Crane Lab</span>
          </h1>
          <p className="text-xl georgia-text max-w-2xl">
            Choose a machine below to book a PCL Pass. If you haven't used the machine before,
            you can tick <strong>Tool Training</strong> on the booking form and we'll guide you through it.
          </p>
        </div>
      </section>

        {/* FAQ callout */}
      <section className="py-12 bg-gray-50">
        <div className="container max-w-3xl">
          <div className="bg-white rounded-xl border border-pcl-blue/20 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="text-4xl shrink-0">🤔</div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-bold text-xl text-pcl-dark-gray mb-1">
                Not sure whether you need a Pass or Tool Training?
              </h3>
              <p className="text-gray-500 text-sm">
                We&apos;ve answered the most common questions — from what to bring, how long to book, and when to get trained.
              </p>
            </div>
            <Link href="/faq" className="btn-primary shrink-0 whitespace-nowrap">
              Check our FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* Training projects */}
      <section className="py-6 bg-gray-50">
        <div className="container">
          <TrainingProjects />
        </div>
      </section>

      {/* Pass pricing */}
      <section className="py-16 bg-white">
        <div className="container">
          <SectionTitle title="Book a PCL Pass" subtitle="Access to any machine during lab hours" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {Object.entries(PASS_TYPES).map(([key, pt]) => (
              <div key={key} className="bg-gray-50 rounded-lg border border-gray-200 p-5 text-center">
                <div className="font-bold text-pcl-dark-gray">{pt.label}</div>
                <div className="text-pcl-blue font-bold text-xl mt-1">{pt.description.split(' ')[0]}</div>
                <div className="text-gray-400 text-sm mt-1">{pt.shortDesc}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MACHINES.map((machine) => (
              <MachineCard key={machine.id} machine={machine} />
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <div className="bg-pcl-yellow/20 border border-pcl-yellow rounded-lg p-6 flex gap-4">
            <span className="text-2xl shrink-0">💡</span>
            <div>
              <h3 className="font-bold text-pcl-dark-gray mb-1">First time on a machine?</h3>
              <p className="text-gray-600 text-sm">
                No problem — just tick <strong>I need Tool Training</strong> on the booking form.
                A PCL team member will guide you through a 1:1 session (₹500 flat fee).
                A maximum of <strong>2 passes</strong> can be active in the lab at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
