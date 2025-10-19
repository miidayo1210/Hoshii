'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DomainHeatmap } from '@/components/domain-heatmap';
import { dataLayer, ActionDomain } from '@/lib/data';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function OrgOverviewPage() {
  const router = useRouter();
  const [totalStamps, setTotalStamps] = useState(0);
  const [domainBreakdown, setDomainBreakdown] = useState<Record<ActionDomain, number>>({
    health: 0,
    environment: 0,
    community: 0,
    learning: 0,
    wellbeing: 0,
  });
  const [monthlyTrend, setMonthlyTrend] = useState<Array<{ month: string; stamps: number }>>([]);

  useEffect(() => {
    const orgId = 'demo';
    
    const total = dataLayer.getOrgTotalStamps(orgId);
    setTotalStamps(total);

    const breakdown = dataLayer.getOrgDomainBreakdown(orgId);
    setDomainBreakdown(breakdown);

    const trend = dataLayer.getOrgMonthlyTrend(orgId);
    setMonthlyTrend(trend);
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        戻る
      </Button>

      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-purple-600" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          組織分析
        </h1>
      </div>

      {/* Total Stars Summary */}
      <Card className="mb-6 bg-gradient-to-br from-hoshii-earth to-hoshii-green text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">全社合計</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-6xl">⭐</span>
                <p className="text-5xl font-bold">×{totalStamps}</p>
              </div>
              <p className="text-sm opacity-90 mt-1">獲得した星</p>
            </div>
            <div className="bg-white/20 rounded-full p-4">
              <Award className="h-12 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Heatmap */}
      <div className="mb-6">
        <DomainHeatmap domainData={domainBreakdown} />
      </div>

      {/* Monthly Trend */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle>月次トレンド</CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyTrend.length > 0 ? (
            <div className="space-y-3">
              {monthlyTrend.map((item) => {
                const date = new Date(item.month + '-01');
                const monthName = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
                
                return (
                  <div key={item.month} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="font-medium">{monthName}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xl">⭐</span>
                    <span className="text-lg font-bold text-hoshii-earth">×{item.stamps}</span>
                  </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              まだアクティビティデータがありません。<br />
              アクションやイベントを完了させてみましょう！
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Award({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
