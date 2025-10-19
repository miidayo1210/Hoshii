'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StampCard } from '@/components/stamp-card';
import { dataLayer, User, ActionLog, EventParticipation, Redemption } from '@/lib/data';
import { User as UserIcon, Award, Calendar, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MePage() {
  const [user, setUser] = useState<User | null>(null);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [eventParticipations, setEventParticipations] = useState<EventParticipation[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);

  useEffect(() => {
    const currentUser = dataLayer.getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      const logs = dataLayer.getUserActionLogs(currentUser.id);
      setActionLogs(logs);

      const participations = dataLayer.getUserEventParticipations(currentUser.id);
      setEventParticipations(participations);

      const userRedemptions = dataLayer.getUserRedemptions(currentUser.id);
      setRedemptions(userRedemptions);
    }
  }, []);

  if (!user) {
    return (
      <div className="container max-w-2xl mx-auto px-5 md:px-8 py-8">
        <p className="text-center text-hoshii-ink/60">読み込み中...</p>
      </div>
    );
  }

  const completedActions = actionLogs.length;
  const completedEvents = eventParticipations.filter((p) => p.completedAt).length;
  const totalRedeemed = redemptions.reduce((sum, r) => sum + r.stampsSpent, 0);

  return (
    <div className="container max-w-2xl mx-auto px-5 md:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <UserIcon className="h-6 w-6 text-hoshii-green" strokeWidth={1.5} />
        <h1 className="text-3xl font-bold text-hoshii-ink">
          マイページ
        </h1>
      </div>

      {/* Stamp Card */}
      <div className="mb-8">
        <StampCard stamps={user.stamps} userName={user.name} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Award, value: completedActions, label: 'アクション', color: 'hoshii-green' },
          { icon: Calendar, value: completedEvents, label: 'イベント', color: 'hoshii-green2' },
          { icon: Gift, value: totalRedeemed, label: '交換済み', color: 'hoshii-rose' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="kawaii-card border-hoshii-green/10">
              <CardContent className="p-4 text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-hoshii-green" strokeWidth={1.5} />
                <p className="text-2xl font-bold text-hoshii-ink">{stat.value}</p>
                <p className="text-xs text-hoshii-ink/60">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="kawaii-card border-hoshii-green/10">
        <CardHeader>
          <CardTitle className="text-hoshii-ink">最近のアクティビティ</CardTitle>
        </CardHeader>
        <CardContent>
          {actionLogs.length === 0 && eventParticipations.length === 0 ? (
            <p className="text-center text-hoshii-ink/60 py-8 leading-relaxed">
              まだアクティビティがありません。<br />
              アクションやイベントに参加してみましょう！
            </p>
          ) : (
            <div className="space-y-4">
              {actionLogs.slice(-5).reverse().map((log, i) => {
                const action = dataLayer.getActionById(log.actionId);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between py-3 border-b border-hoshii-green/10 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {log.imageUrl && (
                        <img
                          src={log.imageUrl}
                          alt="proof"
                          className="w-12 h-12 object-cover rounded-xl border-2 border-hoshii-green/20 shadow-soft"
                        />
                      )}
                      <div>
                        <p className="font-medium text-hoshii-ink">{action?.title || 'アクション'}</p>
                        <p className="text-xs text-hoshii-ink/60">
                          {new Date(log.completedAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 rounded-full border-hoshii-earth/30 bg-hoshii-sand">
                      <span className="text-base">⭐</span>
                      <span className="text-hoshii-ink">×{log.stampsAwarded}</span>
                    </Badge>
                  </motion.div>
                );
              })}
              {eventParticipations.filter((p) => p.completedAt).slice(-3).reverse().map((p, i) => {
                const event = dataLayer.getEventById(p.eventId);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (actionLogs.length + i) * 0.05 }}
                    className="flex items-center justify-between py-3 border-b border-hoshii-green/10 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt="proof"
                          className="w-12 h-12 object-cover rounded-xl border-2 border-hoshii-green/20 shadow-soft"
                        />
                      )}
                      <div>
                        <p className="font-medium text-hoshii-ink">{event?.title || 'イベント'}</p>
                        <p className="text-xs text-hoshii-ink/60">
                          {p.completedAt && new Date(p.completedAt).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 rounded-full border-hoshii-earth/30 bg-hoshii-sand">
                      <span className="text-base">⭐</span>
                      <span className="text-hoshii-ink">×{p.stampsAwarded}</span>
                    </Badge>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
