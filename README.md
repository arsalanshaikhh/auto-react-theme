# Auto React Theme

[![npm version](https://img.shields.io/npm/v/auto-theme-react.svg)](https://www.npmjs.com/package/auto-theme-react)
[![License](https://img.shields.io/npm/l/auto-theme-react.svg)](https://opensource.org/licenses/MIT)

A lightweight React npm package that automatically switches between light and dark themes based on the user's local time, with full manual override support.

## Installation

```bash
npm install auto-theme-react
```

or

```bash
yarn add auto-theme-react
```

## Quick Start

### 1. Wrap your app with the provider

```tsx
import { AutoThemeProvider } from 'auto-theme-react';

function App() {
  return (
    <AutoThemeProvider>
      <YourApp />
    </AutoThemeProvider>
  );
}
```

### 2. Use the hook in your components

```tsx
import { useAutoTheme } from 'auto-theme-react';

function ThemeToggle() {
  const { theme, mode, setLight, setDark, setAuto, toggleTheme } = useAutoTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Current mode: {mode}</p>
      <button onClick={setLight}>Light</button>
      <button onClick={setDark}>Dark</button>
      <button onClick={setAuto}>Auto</button>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

## API Reference

### AutoThemeProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `lightStart` | `string` | `"07:00"` | Start time for light mode (HH:MM format) |
| `darkStart` | `string` | `"22:00"` | Start time for dark mode (HH:MM format) |
| `defaultMode` | `"auto" \| "light" \| "dark"` | `"auto"` | Initial mode when no stored preference exists |
| `storageKey` | `string` | `"auto-theme-mode"` | LocalStorage key for storing user preference |
| `applyTo` | `"html" \| "body"` | `"html"` | DOM element to apply the `data-theme` attribute to |
| `onThemeChange` | `(theme: Theme, mode: Mode) => void` | `undefined` | Callback invoked when the theme changes |

### useAutoTheme Return Value

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `Theme` | Current theme (`"light"` or `"dark"`) |
| `mode` | `Mode` | Current mode (`"auto"`, `"light"`, or `"dark"`) |
| `setLight` | `() => void` | Set the mode to light (manual override) |
| `setDark` | `() => void` | Set the mode to dark (manual override) |
| `setAuto` | `() => void` | Set the mode to auto (enables time-based switching) |
| `toggleTheme` | `() => void` | Toggle between light and dark themes |

### Additional Hooks

```tsx
// Get only the current theme
import { useTheme } from 'auto-theme-react';
const theme = useTheme();

// Get only the current mode
import { useMode } from 'auto-theme-react';
const mode = useMode();
```

## Theme Application Strategy

The package does not apply styles directly. It only adds a `data-theme` attribute to the specified DOM element:

```html
<html data-theme="light">
<!-- or -->
<html data-theme="dark">
```

Use CSS variables with the attribute selector:

```css
[data-theme="light"] {
  --bg-color: #ffffff;
  --text-color: #111111;
}

[data-theme="dark"] {
  --bg-color: #111111;
  --text-color: #ffffff;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

## Default Behavior

- **Light Theme**: 7:00 AM to 10:00 PM
- **Dark Theme**: 10:00 PM to 7:00 AM

Time is calculated using the user's local system time. Theme updates automatically when the time crosses a boundary without requiring a page refresh.

## Theme Priority Order

1. **User manual selection** - If the user has selected a manual theme
2. **Time-based automatic logic** - If mode is set to auto
3. **Default fallback** - The defaultMode prop value

If the user selects a manual theme, time-based switching is paused until auto mode is restored.

## Configuration Examples

### Custom Time Ranges

```tsx
<AutoThemeProvider
  config={{
    lightStart: '06:00',  // Light theme starts at 6 AM
    darkStart: '20:00',   // Dark theme starts at 8 PM
  }}
>
  <App />
</AutoThemeProvider>
```

### Custom Storage Key

```tsx
<AutoThemeProvider
  config={{
    storageKey: 'my-app-theme-preference',
  }}
>
  <App />
</AutoThemeProvider>
```

### Theme Change Callback

```tsx
<AutoThemeProvider
  config={{
    onThemeChange: (theme, mode) => {
      console.log(`Theme changed to ${theme} (mode: ${mode})`);
      // You can send analytics events here
    },
  }}
>
  <App />
</AutoThemeProvider>
```

### Apply to Body Instead of Html

```tsx
<AutoThemeProvider
  config={{
    applyTo: 'body',
  }}
>
  <App />
</AutoThemeProvider>
```

## Advanced Usage

### With a Theme Toggle Component

```tsx
import { useAutoTheme } from 'auto-theme-react';

function ThemeToggle() {
  const { theme, mode, setLight, setDark, setAuto, toggleTheme } = useAutoTheme();

  return (
    <div className="theme-toggle">
      <button
        onClick={setLight}
        className={mode === 'light' ? 'active' : ''}
      >
        ☀️ Light
      </button>
      <button
        onClick={setDark}
        className={mode === 'dark' ? 'active' : ''}
      >
        🌙 Dark
      </button>
      <button
        onClick={setAuto}
        className={mode === 'auto' ? 'active' : ''}
      >
        ⏰ Auto
      </button>
    </div>
  );
}
```

### Using with CSS-in-JS

```tsx
import { useTheme } from 'auto-theme-react';

function StyledComponent() {
  const theme = useTheme();
  const isDark = theme === 'dark';

  const styles = {
    backgroundColor: isDark ? '#111111' : '#ffffff',
    color: isDark ? '#ffffff' : '#111111',
  };

  return <div style={styles}>Content</div>;
}
```

## SSR Compatibility

The package is designed to be safe for server-side rendering:

- No `window` or `document` access during initial render
- Theme is applied on client-side mount
- Proper checks for environment before DOM access

```tsx
// This works with Next.js, Gatsby, Remix, etc.
import { AutoThemeProvider } from 'auto-theme-react';

export default function MyApp({ Component, pageProps }) {
  return (
    <AutoThemeProvider>
      <Component {...pageProps} />
    </AutoThemeProvider>
  );
}
```

## Edge Cases Handled

- ✅ Time range crossing midnight
- ✅ Tab sleeping and resuming (visibility change)
- ✅ System time change during app usage
- ✅ Invalid time configuration (falls back to defaults)
- ✅ Disabled localStorage (graceful fallback)
- ✅ SSR environments

## Performance Considerations

- **No constant polling** - Uses setTimeout to schedule only the next required theme switch
- **Minimal re-renders** - Efficient context design
- **Event listener cleanup** - Proper cleanup on unmount
- **Memoized callbacks** - Reduces unnecessary re-renders

## Folder Structure

```
src/
 ├── AutoThemeProvider.tsx   # Context provider component
 ├── useAutoTheme.ts         # Main hook and additional hooks
 ├── timeUtils.ts            # Time calculation utilities
 ├── storage.ts              # LocalStorage utilities
 ├── constants.ts            # Default values and constants
 ├── types.ts                # TypeScript type definitions
 └── index.ts                # Public exports
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this package in your projects.

## Future Enhancements

Potential features for future versions:

- System theme synchronization (prefers-color-scheme)
- Sunrise and sunset based themes (using geolocation)
- Multiple theme presets
- Cookie-based persistence
- Animation support for theme transitions

---

Built with ❤️ for the React community
