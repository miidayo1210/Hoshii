'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EventCard } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { dataLayer, Event, EventParticipation } from '@/lib/data';
import { Calendar, Plus } from 'lucide-react';

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [participations, setParticipations] = useState<EventParticipation[]>([]);

  useEffect(() => {
    const allEvents = dataLayer.getEvents();
    setEvents(allEvents);

    const user = dataLayer.getCurrentUser();
    if (user) {
      const userParticipations = dataLayer.getUserEventParticipations(user.id);
      setParticipations(userParticipations);
    }
  }, []);

  const getEventStatus = (eventId: string) => {
    const participation = participations.find((p) => p.eventId === eventId);
    return {
      isJoined: !!participation,
      isCompleted: !!participation?.completedAt,
    };
  };

  const handleViewDetails = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <div className="container max-w-2xl mx-auto px-5 md:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-hoshii-green" strokeWidth={1.5} />
          <h1 className="text-3xl font-bold text-hoshii-ink">
            イベント
          </h1>
        </div>
        <Button
          onClick={() => router.push('/events/new')}
          size="sm"
          className="gap-1"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          新規
        </Button>
      </div>

      {events.length > 0 ? (
        <div className="space-y-5">
          {events.map((event) => {
            const { isJoined, isCompleted } = getEventStatus(event.id);
            return (
              <EventCard
                key={event.id}
                event={event}
                isJoined={isJoined}
                isCompleted={isCompleted}
                onViewDetails={() => handleViewDetails(event.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">まだイベントがありません</p>
          <p className="text-sm text-muted-foreground mt-2">
            最初のイベントを作成してみましょう！
          </p>
        </div>
      )}
    </div>
  );
}
