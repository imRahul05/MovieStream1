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

const NEXT_THEME: Record<string, string> = {
  light: 'dark',
  dark: 'black',
  black: 'light',
};

interface ThemeSwitcherProps {
  /** Single icon button that cycles through themes. */
  compact?: boolean;
  /** Breakpoint from which text labels show next to the icons. */
  labelsFrom?: 'always' | 'xl';
}

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand';

export default function ThemeSwitcher({
  compact = false,
  labelsFrom = 'always',
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`skeleton h-9 rounded-full border border-border ${compact ? 'w-9' : 'w-28'}`}
        aria-hidden="true"
      />
    );
  }

  const currentTheme = theme && ['light', 'dark', 'black'].includes(theme) ? theme : 'black';

  if (compact) {
    const active = THEME_OPTIONS.find((t) => t.value === currentTheme) ?? THEME_OPTIONS[2];

    return (
      <button
        type="button"
        onClick={() => setTheme(NEXT_THEME[currentTheme] ?? 'black')}
        title={`Theme: ${active.label} (click to switch)`}
        aria-label={`Current theme ${active.label}. Switch theme`}
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface-elevated/70 text-foreground hover:bg-surface-hover hover:border-border-strong active:scale-90 transition-all duration-200 cursor-pointer ${FOCUS}`}
      >
        {THEME_OPTIONS.map(({ value, icon: Icon }) => {
          const on = value === currentTheme;
          return (
            <Icon
              key={value}
              aria-hidden="true"
              className={`absolute h-4 w-4 transition-all duration-500 ease-(--ease-spring) ${
                on ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          );
        })}
      </button>
    );
  }

  const labelClass =
    labelsFrom === 'xl' ? 'hidden xl:inline' : 'hidden sm:inline';

  return (
    <SegmentedControl
      aria-label="Color theme"
      value={currentTheme}
      onValueChange={(next) => {
        if (next) setTheme(next);
      }}
      className="rounded-full border border-border bg-surface-elevated/70 p-0.5 text-xs font-medium"
    >
      <SegmentedControlIndicator className="rounded-full border border-border-strong bg-surface shadow-sm" />
      {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
        <SegmentedControlItem
          key={value}
          value={value}
          aria-label={`${label} theme`}
          className={`group relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-muted-foreground transition-colors duration-300 cursor-pointer hover:text-foreground data-checked:text-foreground ${FOCUS}`}
        >
          <Icon
            className="h-3.5 w-3.5 transition-all duration-500 ease-(--ease-spring) group-data-checked:rotate-[360deg] group-data-checked:scale-110 group-data-checked:text-brand"
            aria-hidden="true"
          />
          <span className={labelClass}>{label}</span>
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  );
}
