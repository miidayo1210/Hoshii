import { supabase } from '@/lib/supabase';

type AnalyticsEvent = {
  event_type: 'pageview' | 'click';
  page?: string;
  project_id?: string;
  metadata?: Record<string, any>;
};

export async function logEvent(event: AnalyticsEvent) {
  try {
    // If Supabase is not configured (placeholder), do nothing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
      return;
    }
    await supabase.from('analytics_events').insert({
      event_type: event.event_type,
      page: event.page,
      project_id: event.project_id ?? null,
      metadata: event.metadata ?? null,
    });
  } catch (_e) {
    // swallow
  }
}
