import SectionTitle from '@/components/SectionTitle';
import MachineCard from '@/components/MachineCard';
import { MACHINES, PASS_TYPES } from '@/lib/machines';

export default function BookPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-b from-pcl-blue/10 to-white">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book at <span className="text-pcl-blue">Paper Crane Lab</span>
          </h1>
          <p className="text-xl georgia-text max-w-2xl mb-4">
            If you haven't used a machine before, you'll need to complete a Tool Training session first — a short 1:1 with one of our team members. Once trained, you can book a PCL Pass to use the machine independently.
          </p>
          <a href="#tool-training" className="text-pcl-blue font-semibold hover:underline">
            Go to Tool Training →
          </a>
        </div>
      </section>

      {/* PCL Pass */}
      <section className="py-16 bg-white">
        <div className="container">
          <SectionTitle title="Book a PCL Pass" subtitle="For members who have already completed tool training" />

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
              <MachineCard key={machine.id} machine={machine} bookingType="pass" />
            ))}
          </div>
        </div>
      </section>

      {/* Tool Training */}
      <section className="py-16 bg-gray-50 paper-crane-bg" id="tool-training">
        <div className="container">
          <SectionTitle title="Book Tool Training" subtitle="1:1 guided session with a PCL team member · ₹500 flat fee" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MACHINES.map((machine) => (
              <MachineCard key={machine.id} machine={machine} bookingType="toolTraining" />
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="bg-pcl-yellow/20 border border-pcl-yellow rounded-lg p-6 flex gap-4">
            <span className="text-2xl shrink-0">💡</span>
            <div>
              <h3 className="font-bold text-pcl-dark-gray mb-1">First time here?</h3>
              <p className="text-gray-600 text-sm">
                PCL Passes are for members who have already completed tool training. Book a Tool
                Training session first if you haven't used the machine before. A maximum of{' '}
                <strong>2 passes</strong> can be active in the lab at any time. Tool training
                sessions are exclusive — no passes can be booked at the same time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
