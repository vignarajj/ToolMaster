import { useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = !shortcut.ctrl || event.ctrlKey;
      const altMatch = !shortcut.alt || event.altKey;
      const shiftMatch = !shortcut.shift || event.shiftKey;
      
      // Ensure modifiers match exactly
      const ctrlRequired = shortcut.ctrl && event.ctrlKey;
      const altRequired = shortcut.alt && event.altKey;
      const shiftRequired = shortcut.shift && event.shiftKey;
      const noModifiersRequired = !shortcut.ctrl && !shortcut.alt && !shortcut.shift;
      
      return keyMatch && (ctrlRequired || altRequired || shiftRequired || (noModifiersRequired && !event.ctrlKey && !event.altKey && !event.shiftKey));
    });

    if (matchingShortcut) {
      // Prevent default browser behavior for our shortcuts
      if (matchingShortcut.ctrl || matchingShortcut.alt) {
        event.preventDefault();
      }
      matchingShortcut.action();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}

// Global navigation shortcuts hook
export function useGlobalShortcuts() {
  const [, navigate] = useLocation();

  const globalShortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      alt: true,
      action: () => navigate('/'),
      description: 'Go to Text Counter (Alt+1)'
    },
    {
      key: '2',
      alt: true,
      action: () => navigate('/text-converter'),
      description: 'Go to Text Converter (Alt+2)'
    },
    {
      key: '3',
      alt: true,
      action: () => navigate('/base64'),
      description: 'Go to Base64 Tool (Alt+3)'
    },
    {
      key: '4',
      alt: true,
      action: () => navigate('/password'),
      description: 'Go to Password Generator (Alt+4)'
    },
    {
      key: '5',
      alt: true,
      action: () => navigate('/qr-code'),
      description: 'Go to QR Code Generator (Alt+5)'
    },
    {
      key: '6',
      alt: true,
      action: () => navigate('/color-picker'),
      description: 'Go to Color Picker (Alt+6)'
    }
  ];

  useKeyboardShortcuts(globalShortcuts);
  
  return globalShortcuts;
}