'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Project {
  tool: string;
  name: string;
  learn: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    tool: 'Laser Cutter',
    name: 'NFC-enabled Keychain',
    learn: 'Vector prep, cutting & engraving',
    image: '/training/NFC-enabled Keychain.jpg',
  },
  {
    tool: 'Laser Cutter',
    name: 'Engraved Pen Stand',
    learn: 'Vector or raster engraving / etching',
    image: '/training/Engraved Pen Stand.jpg',
  },
  {
    tool: '3D Printer',
    name: 'Earrings / Keychain',
    learn: 'Designing in TinkerCAD, slicing and printing with Creality Print or Bambu Studio',
    image: '/training/Earrings Keychain.jpg',
  },
  {
    tool: 'Vinyl Cutter',
    name: 'Paper House',
    learn: 'Cutting & layering paper builds, using the Silhouette software',
    image: '/training/Paper House.jpg',
  },
  {
    tool: 'Vinyl Cutter',
    name: 'Layered Sticker Sheet',
    learn: 'Multi-layer placing, weeding, transfer tape, and using the Silhouette software',
    image: '/training/Layered Sticker Sheet.jpg',
  },
  {
    tool: 'Woodworking',
    name: 'Cat Design',
    learn: 'Straight cuts with scroll saw / jigsaw',
    image: '/training/Cat Design.jpg',
  },
  {
    tool: 'Electronics',
    name: 'Infinity Mirror',
    learn: 'Soldering, LEDs, basic circuits',
    image: '/training/Infinity Mirror.jpg',
  },
];

const TOOL_STYLES: Record<string, { badge: string; dot: string }> = {
  'Laser Cutter': { badge: 'bg-pcl-yellow/30 text-pcl-dark-gray', dot: 'bg-pcl-yellow' },
  '3D Printer':   { badge: 'bg-pcl-blue/10 text-pcl-blue',         dot: 'bg-pcl-blue' },
  'Vinyl Cutter': { badge: 'bg-pcl-pink/20 text-pcl-dark-gray',    dot: 'bg-pcl-pink' },
  'Woodworking':  { badge: 'bg-gray-100 text-pcl-dark-gray',        dot: 'bg-gray-400' },
  'Electronics':  { badge: 'bg-pcl-blue/10 text-pcl-blue',          dot: 'bg-pcl-blue' },
};

function ProjectCard({ project }: { project: Project }) {
  const style = TOOL_STYLES[project.tool] ?? { badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full self-start mb-2', style.badge)}>
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', style.dot)} />
          {project.tool}
        </span>
        <h4 className="font-bold text-pcl-dark-gray text-sm leading-snug mb-1">{project.name}</h4>
        <p className="text-gray-500 text-xs leading-relaxed">{project.learn}</p>
      </div>
    </div>
  );
}

export default function TrainingProjects() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <p className="font-bold text-pcl-dark-gray text-base">What can you make in tool training?</p>
          <p className="text-gray-400 text-sm mt-0.5">{PROJECTS.length} guided starter projects across all machines</p>
        </div>
        <span className={cn('text-pcl-blue transition-transform duration-200 text-lg font-bold', open && 'rotate-180')}>
          ↓
        </span>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {PROJECTS.map((p) => (
              <ProjectCard key={p.name} project={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
