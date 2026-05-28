'use client';

import { useState } from 'react';
import { LabEvent } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Props {
  event: LabEvent;
}

export default function EventCard({ event }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
        {/* 4:3 image — clickable to open description */}
        <button
          onClick={() => setOpen(true)}
          className="block w-full aspect-[4/3] overflow-hidden bg-gray-100 relative group"
        >
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">📅</div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 text-pcl-dark-gray text-xs font-semibold px-3 py-1.5 rounded-full">
              View details
            </span>
          </div>
        </button>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-pcl-dark-gray mb-3 leading-tight">{event.title}</h3>

          <div className="space-y-1.5 text-sm mb-5 flex-1">
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
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pcl-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={event.cost.toLowerCase() === 'free' ? 'text-green-600 font-semibold' : 'text-gray-700 font-semibold'}>
                {event.cost}
              </span>
            </div>
          </div>

          {event.bookingLink && (
            <a href={event.bookingLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-center text-sm !py-2.5">
              Book your spot
            </a>
          )}
        </div>
      </div>

      {/* Description popover */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-pcl-dark-gray">{event.title}</DialogTitle>
          </DialogHeader>

          {event.imageUrl && (
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 -mx-1">
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            </div>
          )}

          <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>

          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex items-center gap-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pcl-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{event.date}{event.time ? ` · ${event.time}` : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pcl-blue shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={event.cost.toLowerCase() === 'free' ? 'text-green-600 font-semibold' : 'text-gray-700 font-semibold'}>
                {event.cost}
              </span>
            </div>
          </div>

          {event.bookingLink && (
            <a href={event.bookingLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-center block">
              Book your spot
            </a>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
