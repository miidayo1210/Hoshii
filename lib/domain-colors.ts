import { ActionDomain } from './data';

export function getDomainColor(domain: ActionDomain): string {
  const colors: Record<ActionDomain, string> = {
    health: 'bg-red-500',
    environment: 'bg-green-500',
    community: 'bg-blue-500',
    learning: 'bg-yellow-500',
    wellbeing: 'bg-purple-500',
  };
  return colors[domain] || 'bg-gray-500';
}

export function getDomainLabel(domain: ActionDomain): string {
  const labels: Record<ActionDomain, string> = {
    health: '健康',
    environment: '環境',
    community: 'コミュニティ',
    learning: '学習',
    wellbeing: 'ウェルビーイング',
  };
  return labels[domain] || domain;
}

export function getDomainEmoji(domain: ActionDomain): string {
  const emojis: Record<ActionDomain, string> = {
    health: '🏃',
    environment: '🌱',
    community: '👥',
    learning: '📚',
    wellbeing: '🧘',
  };
  return emojis[domain] || '✨';
}

