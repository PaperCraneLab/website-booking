'use client';

import { useState } from 'react';
import Link from 'next/link';
import SectionTitle from '@/components/SectionTitle';
import TeamMember from '@/components/TeamMember';
import ProjectCard from '@/components/ProjectCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function HomePage() {
  const [isDonateOpen, setIsDonateOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-pcl-blue/10 to-white overflow-hidden">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                <span className="text-pcl-blue">Inspire</span> Curiosity.<br />
                <span className="text-pcl-yellow">Build</span> Knowledge.<br />
                <span className="text-pcl-pink">Create</span> the Future.
              </h1>
              <p className="text-xl georgia-text mb-8">
                At Paper Crane Lab, we're fostering the next generation of innovators through hands-on STEM education.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#what-we-do" className="btn-primary">Explore Our Programs</a>
                <Link href="/makerspace" className="btn-secondary">Visit Makerspace</Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="w-full h-full max-w-md mx-auto">
                <div className="w-64 h-64 bg-pcl-pink/20 rounded-full absolute top-0 right-0 -z-10 animate-pulse" />
                <div className="w-48 h-48 bg-pcl-yellow/20 rounded-full absolute bottom-0 left-0 -z-10 animate-pulse" />
                <img src="/homepage/home.jpg" alt="Students exploring STEM" className="w-full h-auto rounded-lg shadow-xl relative z-10 animate-fade-in" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16" id="who-we-are">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img src="/homepage/home1.jpeg" alt="Students in a workshop" className="rounded-lg shadow-lg w-full h-auto" />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <SectionTitle title="Who We Are" subtitle="Creating a new generation of curious STEM explorers" />
              <p className="mb-4">Paper Crane Lab is a non-profit organisation dedicated to fostering STEM education through experimentation and curiosity. We believe that every student should have the opportunity to explore, create, and innovate in a supportive environment.</p>
              <p className="mb-4">Our name is inspired by the paper crane, a symbol of creativity, patience, and exploration — all qualities we aim to nurture in young minds as they engage with science, technology, engineering, and mathematics.</p>
              <p>Run by educators and industry professionals, we're on a mission to bridge the gap between traditional education and the skills needed for future innovation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 bg-gray-50 paper-crane-bg" id="what-we-do">
        <div className="container">
          <SectionTitle title="Ongoing Programs" subtitle="Making learning hands-on, meaningful, and exciting" centered />
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-center text-gray-700">
              At Paper Crane Lab, every program is designed to spark curiosity, build confidence, and make learning hands-on. Here's a brief about a couple of the programs that we run:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProjectCard title="Computer Skilling Program" partner="Buguri (library by Hasiru Dala)" description="Students get hands-on with 3D printers, design tools like Canva, and creative projects that bring ideas to life. Along the way, they build computer skills, problem-solving habits, and the confidence to explore new technologies." image="/homepage/hd1.jpeg" />
            <ProjectCard title="Making at the Library" partner="Buguri (library by Hasiru Dala)" description="Our library program brings creativity and curiosity together right in the heart of the community. Students dive into 'making' through simple electronics, pop-up art, and craft-based design." image="/homepage/hd2.jpeg" />
            <ProjectCard title="After School Science Program" partner="Resurrection High School" description="Once a week, our team visits a local high school for after-school math and science sessions that make learning come alive through creative projects and hands-on activities." image="/homepage/ress.jpeg" />
          </div>
          <div className="max-w-4xl mx-auto my-8">
            <p className="text-lg text-center text-gray-700">You can read about our other programs in our annual reports.</p>
          </div>
          <div className="mt-4 text-center">
            <a target="_blank" rel="noopener noreferrer" href="https://drive.google.com/file/d/1SQy5LVr4M7E4Nx_mNrfV2yjaw1AO4SN_/view?usp=sharing" className="btn-primary">
              2024–2025 Annual Report
            </a>
          </div>
        </div>
      </section>

      {/* Donate */}
      <section className="py-20 bg-pcl-blue text-white" id="donate">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Support Our Mission</h2>
              <p className="mb-6">Your contribution helps us expand our reach and impact, providing more students with access to quality STEM education resources.</p>
              <ul className="mb-8 space-y-2">
                {['Fund project materials for underserved schools', 'Support programs for students', 'Help develop new learning materials'].map((item) => (
                  <li key={item} className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-pcl-yellow shrink-0 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mb-6">Paper Crane Lab is a registered public charitable trust under the Indian Trusts Act, bearing 12A and 80G.</p>
              <button className="btn-donate" onClick={() => setIsDonateOpen(true)}>Donate Now</button>
            </div>
            <div className="md:w-1/2 md:pl-12 relative">
              <img src="/homepage/support.jpg" alt="Students in a classroom" className="rounded-lg shadow-lg relative z-10 w-full h-auto" />
              <div className="absolute -bottom-5 -right-5 w-full h-full border-4 border-pcl-yellow rounded-lg -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Collaborators */}
      <section className="py-16 bg-white">
        <div className="container">
          <SectionTitle title="Collaborators Over the Years" subtitle="Organisations and institutions we've worked with" centered />
          <div className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory">
            {['/logos/samagata.webp', '/logos/goodera.png', '/logos/hd.png', '/logos/qa.png', '/logos/sia.png', '/logos/Buguri.webp', '/logos/avanti.jpeg', '/logos/underline.png', '/logos/Srishti.jpeg', '/logos/rbanms.png'].map((logo, i) => (
              <div key={i} className="flex-shrink-0 snap-center w-48 h-32 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center p-4">
                <img src={logo} alt={`Collaborator ${i + 1}`} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50" id="team">
        <div className="container">
          <SectionTitle title="Meet Our Team" subtitle="The passionate individuals behind Paper Crane Lab" centered />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <TeamMember name="Mathura Govindarajan" role="Trustee, Director" image="/team/mathura.jpeg" bio="Creative technologist and educator blending art, design, and technology to inspire hands-on learning in maker spaces and universities worldwide." more="https://mathuramg.com/" />
            <TeamMember name="M. V. Govindarajan" role="Trustee" image="/team/mvg.jpeg" bio="Engineering leader with decades of product development expertise, now guiding strategy and business growth through thoughtful, technology-driven consulting." more="https://www.linkedin.com/in/govindarajan-mv-b774a524/" />
            <TeamMember name="Himadri Banerjee" role="Business Development, Operations Head" image="/team/himadri.jpeg" bio="Business strategist and operations lead passionate about partnerships, quizzing, food, and travel, combining corporate experience with creative entrepreneurial spirit." more="https://www.linkedin.com/in/himadribanerjee5/" />
            <TeamMember name="Aditi Bhat" role="Lab Manager" image="/team/aditi.jpeg" bio="Performer and educator merging science, art, and movement through flow arts, making abstract concepts tangible for diverse and neurodivergent learners." more="https://www.linkedin.com/in/aditibhat7/" />
            <TeamMember name="Dipti Dayal" role="Content Designer, Educator" image="/team/dipti.jpeg" bio="Educator and curriculum designer crafting student-centered learning experiences, with expertise in project management, teacher training, and creative engagement strategies." more="https://www.linkedin.com/in/dipti-dayal-7715896/" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-pcl-blue to-pcl-blue-light text-white text-center">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join Our Mission?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Volunteer, donate, or partner with us to help shape the future of STEM education.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#donate" className="btn-donate">Support Our Cause</a>
            <Link href="/makerspace" className="btn-secondary">Visit Makerspace</Link>
          </div>
        </div>
      </section>

      {/* Donate dialog */}
      <Dialog open={isDonateOpen} onOpenChange={setIsDonateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Support Paper Crane Lab</DialogTitle>
            <DialogDescription className="text-center">Help us continue our mission to foster STEM education</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <img src="/qr.jpeg" alt="Payment QR Code" className="w-full h-full object-contain" />
            </div>
            <div className="text-center space-y-2 px-4">
              <p className="text-sm text-gray-700">Scan the QR code to make your donation</p>
              <div className="bg-pcl-blue/10 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">After donating, please email us at:</p>
                <p className="text-pcl-blue font-semibold">info@papercranelab.org</p>
                <p className="text-xs text-gray-600 mt-2">Include your name and PAN details so we can share your 80G tax receipt</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
