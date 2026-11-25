import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Eclipse } from 'lucide-react';
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from '@ui-sdk/react/segmented-control';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'black', label: 'Black', icon: Eclipse },
] as const;

interface ThemeSwitcherProps {
  compact?: boolean;
}

export default function ThemeSwitcher({ compact = false }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-28 rounded-full bg-surface-elevated border border-border animate-pulse"
        aria-hidden="true"
      />
    );
  }

  const currentTheme = theme && ['light', 'dark', 'black'].includes(theme) ? theme : 'black';

  if (compact) {
    const nextMap: Record<string, string> = {
      light: 'dark',
      dark: 'black',
      black: 'light',
    };
    const active = THEME_OPTIONS.find((t) => t.value === currentTheme) ?? THEME_OPTIONS[2];
    const ActiveIcon = active.icon;

    return (
      <button
        type="button"
        onClick={() => setTheme(nextMap[currentTheme] ?? 'black')}
        title={`Theme: ${active.label} (click to switch)`}
        aria-label={`Current theme ${active.label}. Switch theme`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
      >
        <ActiveIcon className="h-4 w-4" />
      </button>
    );
  }

  return (
    <SegmentedControl
      aria-label="Color theme"
      value={currentTheme}
      onValueChange={(next) => {
        if (next) setTheme(next);
      }}
      className="rounded-full border border-border bg-surface-elevated p-0.5 text-xs font-medium"
    >
      <SegmentedControlIndicator className="rounded-full bg-surface shadow-sm border border-border" />
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
        <SegmentedControlItem
          key={value}
          value={value}
          aria-label={`${label} theme`}
          className="relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-muted-foreground transition-colors cursor-pointer hover:text-foreground data-checked:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
        >
          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">{label}</span>
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}
