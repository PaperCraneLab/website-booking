import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import PclPass from '@/components/PclPass';
import EventCard from '@/components/EventCard';
import { getEvents } from '@/lib/google-sheets';
import { LabEvent } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Makerspace — Paper Crane Lab',
  description: 'Book a PCL Pass and use our makerspace machines.',
};

export default async function MakerspacePage() {
  let events: LabEvent[] = [];
  try {
    events = await getEvents();
  } catch {
    // Sheet may not exist yet or credentials not configured — show no events
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 hero-pattern overflow-hidden">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">PCL Makerspace</h1>
              <p className="text-xl georgia-text mb-8">
                A collaborative environment where creativity meets technology, and ideas turn into reality.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#about" className="btn-primary">Explore the Space</a>
                <Link href="/book" className="btn-secondary">Book a PCL Pass</Link>
                {events.length > 0 && (
                  <a href="#events" className="border-2 border-pcl-blue text-pcl-blue font-bold py-3 px-6 rounded-md transition-all hover:bg-pcl-blue hover:text-white">
                    Upcoming Events
                  </a>
                )}
              </div>

              <div className="mt-12 pt-8">
                <div className="flex items-center justify-start gap-6">
                  <div className="w-32 h-32 flex items-center justify-center">
                    <img src="/logos/samagata.jpeg" alt="Samāgata Foundation" className="w-full h-full object-contain p-2" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Makerspace supported by</p>
                    <h3 className="text-xl font-bold text-gray-800">Samāgata Foundation</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="w-full h-full max-w-md mx-auto">
                <div className="w-64 h-64 bg-pcl-pink/20 rounded-full absolute top-0 right-0 -z-10 animate-pulse" />
                <div className="w-48 h-48 bg-pcl-yellow/20 rounded-full absolute bottom-0 left-0 -z-10 animate-pulse" />
                <img src="/maker/home.jpeg" alt="Makerspace" className="w-full h-auto rounded-lg shadow-xl relative z-10 animate-fade-in" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events — prominent, second section */}
      <section className="py-16 bg-pcl-blue/5 border-y border-pcl-blue/10" id="events">
        <div className="container">
          <div className="mb-10">
            <p className="text-pcl-blue font-semibold text-sm uppercase tracking-wide mb-1">At the Lab</p>
            <h2 className="text-3xl md:text-4xl font-bold text-pcl-dark-gray">Upcoming Events</h2>
            <p className="text-gray-500 mt-2">Workshops, meetups and hands-on sessions at the PCL Makerspace</p>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard key={i} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-pcl-blue/30">
              <p className="text-4xl mb-4">📅</p>
              <h3 className="font-bold text-lg text-pcl-dark-gray mb-2">No upcoming events right now</h3>
              <p className="text-gray-500 text-sm">Check back soon — we run regular workshops and sessions.</p>
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section className="py-16" id="about">
        <div className="container">
          <SectionTitle title="About Our Makerspace" subtitle="Where ideas come to life" />
          <p className="text-lg mb-6">
            Designed to cater to a diverse audience of makers, learners, and creators, the PCL Makerspace aims to empower individuals to explore their passions, develop new skills, and bring their ideas to life. By encouraging collaboration, sharing knowledge, and fostering a sense of belonging, we've built a thriving community where beginners and experts alike can work together to create, innovate, and grow.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { title: 'State-of-the-Art Equipment', color: 'border-pcl-blue', desc: 'Access a wide range of tools and technologies, from 3D printers and laser cutters to electronics workstations and woodworking tools.' },
              { title: 'Expert Guidance', color: 'border-pcl-yellow', desc: 'Our knowledgeable staff and volunteers are always available to help you learn new skills, troubleshoot problems, and bring your projects to fruition.' },
              { title: 'Community Events', color: 'border-pcl-pink', desc: 'Join workshops, meetups, and hackathons where you can connect with like-minded creators, share ideas, and collaborate on exciting projects.' },
            ].map(({ title, color, desc }) => (
              <div key={title} className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${color}`}>
                <h3 className="font-bold text-xl mb-3">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <SectionTitle title="Equipment & Facilities" subtitle="Tools and resources to bring your ideas to life" centered />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { src: '/maker/3Dprinter.png', label: '3D Printers' },
              { src: '/maker/laserCutter.jpeg', label: 'Laser Cutter' },
              { src: '/maker/vinylCutter.png', label: 'Vinyl Cutters' },
              { src: '/maker/penPlotter.png', label: 'Pen Plotters' },
              { src: '/maker/scrollSaw.png', label: 'Scroll Saw' },
              { src: '/maker/soldering.png', label: 'Electronics Prototyping' },
              { src: '/maker/woodworking.jpeg', label: 'Woodworking Tools' },
              { src: '/maker/sewingMachine.png', label: 'Sewing Machine' },
            ].map(({ src, label }) => (
              <div key={label} className="bg-white p-4 rounded-lg shadow-md">
                <img src={src} alt={label} className="w-full h-48 object-cover rounded mb-3" />
                <h4 className="font-bold">{label}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PCL Pass pricing */}
      <PclPass />

      {/* Visit */}
      <section className="py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="md:w-1/2">
              <img src="/maker/visit.jpg" alt="Paper Crane Lab Makerspace" className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/2 p-8">
              <h2 className="text-3xl font-bold mb-4">Visit the Makerspace</h2>
              <p className="mb-6">We'd love to show you around. Drop us an email to schedule your visit!</p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pcl-blue mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <div><h4 className="font-bold">Location</h4><p>835, 10th Main Road, Water Tank Road, Indiranagar, Bangalore - 38</p></div>
                </div>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pcl-blue mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div><h4 className="font-bold">Hours</h4><p>Monday – Saturday: 10AM – 6PM<br />Visit by appointment only</p></div>
                </div>
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pcl-blue mr-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <div><h4 className="font-bold">Contact</h4><p>hello@papercranelab.com<br />9845620061</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <SectionTitle title="Frequently Asked Questions" subtitle="Common questions about our makerspace" centered />
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              { q: 'Do I need experience to use the makerspace?', a: 'Not at all! We welcome makers of all experience levels. For beginners, we offer 1:1 orientation sessions and basic skills workshops to help you get started. You can book the same with our PCL Pass.' },
              { q: 'Can I bring my own materials?', a: "Yes, you're welcome to bring your own materials. We also have a variety of materials available for purchase in our lab." },
              { q: 'Is there an age requirement?', a: 'Members must be 18+ to use the space independently. We offer supervised sessions for younger makers, and family workshops where adults can work with children.' },
              { q: 'Do you offer any discounts on PCL Pass?', a: 'We offer reduced rates for nonprofits and community organisations. Contact us for more information.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg mb-2">{q}</h3>
                <p className="text-gray-700">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pcl-pink to-pcl-pink text-pcl-dark-gray text-center">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Making?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join our creative community and turn your ideas into reality.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book" className="btn-primary">Book a PCL Pass</Link>
            <a href="mailto:hello@papercranelab.com" className="bg-white text-pcl-dark-gray font-bold py-3 px-6 rounded-md transition-all transform hover:scale-105">Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  );
}
