'use client';

import { useState } from 'react';

interface Props {
  name: string;
  role: string;
  image: string;
  bio: string;
  more: string;
}

export default function TeamMember({ name, role, image, bio, more }: Props) {
  const [showBio, setShowBio] = useState(false);

  return (
    <div className="group">
      <div
        className="relative overflow-hidden rounded-lg mb-4 bg-pcl-gray/20 cursor-pointer"
        onMouseEnter={() => setShowBio(true)}
        onMouseLeave={() => setShowBio(false)}
        onClick={() => setShowBio(!showBio)}
      >
        <div className="aspect-square">
          <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className={`absolute inset-0 bg-gradient-to-t from-pcl-dark-gray via-pcl-dark-gray/95 to-pcl-dark-gray/80 transition-opacity duration-300 ${showBio ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 p-4 flex flex-col items-center justify-center">
            <p className="text-white text-sm leading-relaxed">{bio}</p>
            <br />
            <a className="text-white font-bold text-sm" target="_blank" rel="noopener noreferrer" href={more}>Read more</a>
          </div>
        </div>
      </div>
      <h3 className="font-bold text-lg">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  );
}
