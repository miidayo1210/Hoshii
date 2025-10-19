'use client';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  target: number;
  showNumbers?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'purple' | 'green' | 'blue' | 'yellow';
  className?: string;
}

export function ProgressBar({
  current,
  target,
  showNumbers = true,
  showPercentage = false,
  size = 'md',
  color = 'default',
  className,
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colorClasses = {
    default: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress Numbers */}
      {showNumbers && (
        <div className="flex justify-between items-center">
          <span className={cn('font-medium', textSizeClasses[size])}>
            {current.toLocaleString()}
          </span>
          <span className={cn('text-gray-500', textSizeClasses[size])}>
            / {target.toLocaleString()}
          </span>
          {showPercentage && (
            <span className={cn('font-medium', textSizeClasses[size])}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-in-out',
            colorClasses[color],
            isComplete && 'bg-green-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Percentage Only */}
      {!showNumbers && showPercentage && (
        <div className="text-center">
          <span className={cn('font-medium', textSizeClasses[size])}>
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Circular Progress Component
interface CircularProgressProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  color?: 'default' | 'purple' | 'green' | 'blue' | 'yellow';
  showText?: boolean;
  className?: string;
}

export function CircularProgress({
  current,
  target,
  size = 120,
  strokeWidth = 8,
  color = 'default',
  showText = true,
  className,
}: CircularProgressProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    default: 'stroke-blue-500',
    purple: 'stroke-purple-500',
    green: 'stroke-green-500',
    blue: 'stroke-blue-500',
    yellow: 'stroke-yellow-500',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-300 ease-in-out', colorClasses[color])}
        />
      </svg>
      
      {/* Center text */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(percentage)}%</div>
            <div className="text-xs text-gray-500">
              {current}/{target}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Multi-step Progress Component
interface Step {
  id: string;
  title: string;
  completed: boolean;
  current?: boolean;
}

interface MultiStepProgressProps {
  steps: Step[];
  className?: string;
}

export function MultiStepProgress({ steps, className }: MultiStepProgressProps) {
  const currentStepIndex = steps.findIndex(step => step.current);
  const completedSteps = steps.filter(step => step.completed).length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                step.completed
                  ? 'bg-green-500 text-white'
                  : step.current
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              )}
            >
              {step.completed ? '✓' : index + 1}
            </div>
            <div className="ml-3">
              <div className={cn(
                'text-sm font-medium',
                step.completed || step.current ? 'text-gray-900' : 'text-gray-500'
              )}>
                {step.title}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-4',
                  step.completed ? 'bg-green-500' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          ステップ {completedSteps} / {steps.length} 完了
        </p>
      </div>
    </div>
  );
}
