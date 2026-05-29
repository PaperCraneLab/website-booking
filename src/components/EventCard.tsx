'use client';

import { useState } from 'react';
import { LabEvent } from '@/types';

interface Props {
  event: LabEvent;
}

export default function EventCard({ event }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      {/* 4:5 image */}
      <div className="aspect-[4/5] overflow-hidden bg-gray-100">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">📅</div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-pcl-dark-gray mb-3 leading-tight">{event.title}</h3>

        {/* Meta */}
        <div className="space-y-1.5 text-sm mb-3">
          <div className="flex items-center gap-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pcl-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{event.date}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pcl-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{event.time}</span>
            </div>
          )}
          {event.cost && (
            <div className="flex items-center gap-2">
              <span className="text-pcl-blue font-semibold text-sm shrink-0">₹</span>
              <span className={event.cost.toLowerCase() === 'free' ? 'text-green-600 font-semibold' : 'text-gray-700 font-semibold'}>
                {event.cost}
              </span>
            </div>
          )}
        </div>

        {/* Expandable description */}
        {event.description && (
          <div className="mb-4">
            {expanded && (
              <p className="text-gray-600 text-sm leading-relaxed mb-2">{event.description}</p>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-pcl-blue text-sm font-semibold hover:underline"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          </div>
        )}

        {event.bookingLink && (
          <a href={event.bookingLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-center text-sm !py-2.5 mt-auto">
            Book your spot
          </a>
        )}
      </div>
    </div>
  );
}
