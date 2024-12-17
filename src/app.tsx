import { ThemeProvider } from './components/theme/theme-provider';
import { ThemeToggle } from './components/theme/theme-toggle';

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="@fundatec/theme">
      <header className="h-16 border-b border-border">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <div></div>
          <ThemeToggle />
        </div>
      </header>
    </ThemeProvider>
  );
}
