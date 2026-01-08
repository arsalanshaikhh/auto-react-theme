import { useState, useEffect } from 'react';
import { AutoThemeProvider, useAutoTheme } from '@arsalanshaikhh/auto-time-theme-react';
import type { Mode, ThemeConfig } from '@arsalanshaikhh/auto-time-theme-react';

/**
 * Demo component showcasing the useAutoTheme hook
 */
function ThemeControls() {
  const { theme, mode, setLight, setDark, setAuto, toggleTheme } = useAutoTheme();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="demo-container">
      {/* Header */}
      <div className="demo-card">
        <h1 className="demo-title">React Auto Time Theme</h1>
        <p className="demo-subtitle">
          A lightweight React package for automatic time-based theme switching
        </p>

        {/* Current Time Display */}
        <div className="time-display">
          <div>
            <div className="time-value">{formatTime(currentTime)}</div>
            <div className="time-label">{formatDate(currentTime)}</div>
          </div>
        </div>

        {/* Theme Status */}
        <div className="status-badges">
          <span className={`theme-indicator ${theme}`}>
            Current Theme: <strong>{theme}</strong>
          </span>
          <span className={`status-badge ${mode === 'auto' ? 'mode-auto' : 'mode-manual'}`}>
            Mode: {mode}
          </span>
        </div>
      </div>

      {/* Theme Controls */}
      <div className="demo-card">
        <h2 className="demo-section-title">Theme Controls</h2>
        <div className="button-group">
          <button
            className={`demo-button ${mode === 'light' ? 'active' : ''}`}
            onClick={setLight}
          >
            ☀️ Light
          </button>
          <button
            className={`demo-button ${mode === 'dark' ? 'active' : ''}`}
            onClick={setDark}
          >
            🌙 Dark
          </button>
          <button
            className={`demo-button ${mode === 'auto' ? 'active primary' : ''}`}
            onClick={setAuto}
          >
            ⏰ Auto
          </button>
          <button className="demo-button" onClick={toggleTheme}>
            🔄 Toggle
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="demo-card">
        <h2 className="demo-section-title">How It Works</h2>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
          The package automatically switches between light and dark themes based on your
          local time. In auto mode, the default behavior is:
        </p>
        <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)' }}>
          <li><strong>Light Theme:</strong> 7:00 AM to 10:00 PM</li>
          <li><strong>Dark Theme:</strong> 10:00 PM to 7:00 AM</li>
        </ul>
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
          When you manually select a theme, auto-switching is paused until you restore
          auto mode. Your preference is saved to localStorage and persists across sessions.
        </p>
      </div>

      {/* Usage Example */}
      <div className="demo-card">
        <h2 className="demo-section-title">Usage</h2>
        <div className="code-block">
          <pre style={{ margin: 0 }}>
            <code>{`import { AutoThemeProvider, useAutoTheme } from '@arsalanshaikhh/auto-time-theme-react';

function App() {
  return (
    <AutoThemeProvider>
      <MyComponent />
    </AutoThemeProvider>
  );
}

function MyComponent() {
  const { theme, mode, setLight, setDark, setAuto } = useAutoTheme();

  return (
    <div data-theme={theme}>
      <p>Current theme: {theme}</p>
      <p>Current mode: {mode}</p>
      <button onClick={setLight}>Light</button>
      <button onClick={setDark}>Dark</button>
      <button onClick={setAuto}>Auto</button>
    </div>
  );
}`}</code>
          </pre>
        </div>
      </div>

      {/* Features */}
      <div className="demo-card">
        <h2 className="demo-section-title">Features</h2>
        <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <li>✅ Automatic time-based theme switching</li>
          <li>✅ Manual override with persistence</li>
          <li>✅ Auto, Light, Dark modes</li>
          <li>✅ Configurable time ranges</li>
          <li>✅ Zero UI framework dependencies</li>
          <li>✅ CSS variable friendly</li>
          <li>✅ Optimized and SSR safe</li>
          <li>✅ No constant polling</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="demo-footer">
        <p>
          Built with{' '}
          <a
            href="https://www.npmjs.com/package/react-auto-time-theme"
            target="_blank"
            rel="noopener noreferrer"
          >
            react-auto-time-theme
          </a>
        </p>
      </div>
    </div>
  );
}

/**
 * App component with AutoThemeProvider configuration
 */
function App() {
  const [config, setConfig] = useState<Partial<ThemeConfig>>({
    lightStart: '07:00',
    darkStart: '22:00',
    defaultMode: 'auto',
  });

  const handleConfigChange = (key: keyof ThemeConfig, value: string) => {
    setConfig((prev: Partial<ThemeConfig>) => ({ ...prev, [key]: value }));
  };

  return (
    <AutoThemeProvider
      config={{
        lightStart: config.lightStart!,
        darkStart: config.darkStart!,
        defaultMode: config.defaultMode as Mode,
      }}
    >
      <ThemeControls />
    </AutoThemeProvider>
  );
}

export default App;
