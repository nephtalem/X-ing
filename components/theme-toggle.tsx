'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Sun className="h-4 w-4 text-gray-700" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-9 h-9 relative overflow-hidden group hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-gray-300" />
      ) : (
        <Sun className="h-5 w-5 text-gray-700" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

