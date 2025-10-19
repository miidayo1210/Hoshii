'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionDomain } from '@/lib/data';
import { getDomainColor, getDomainLabel } from '@/lib/domain-colors';

interface DomainHeatmapProps {
  domainData: Record<ActionDomain, number>;
}

export function DomainHeatmap({ domainData }: DomainHeatmapProps) {
  const domains: ActionDomain[] = ['health', 'environment', 'community', 'learning', 'wellbeing'];
  const maxValue = Math.max(...Object.values(domainData), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>分野別アクティビティ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {domains.map((domain) => {
            const value = domainData[domain] || 0;
            const percentage = (value / maxValue) * 100;
            const colorClass = getDomainColor(domain);
            
            return (
              <div key={domain} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{getDomainLabel(domain)}</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="text-sm">⭐</span>
                    <span>×{value}</span>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${colorClass} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

