import { LabEvent } from '@/types';

interface Props {
  event: LabEvent;
}

export default function EventCard({ event }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      {event.imageUrl && (
        <div className="h-48 overflow-hidden bg-gray-100">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-pcl-dark-gray mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-1">{event.description}</p>
        <div className="space-y-1.5 text-sm mb-5">
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
          <a
            href={event.bookingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-center text-sm !py-2.5"
          >
            Book your spot
          </a>
        )}
      </div>
    </div>
  );
}
