export interface AppData {
  version: string;
  timestamp: string;
  settings: {
    theme: string;
    preferences: Record<string, unknown>;
  };
  toolData: {
    textCounter: {
      lastText: string;
      history: Array<{
        text: string;
        timestamp: string;
        stats: any;
      }>;
    };
    textConverter: {
      lastInput: string;
      lastConversion: string;
      history: Array<{
        input: string;
        conversion: string;
        result: string;
        timestamp: string;
      }>;
    };
    base64Tool: {
      lastInput: string;
      lastMode: 'encode' | 'decode';
      history: Array<{
        input: string;
        output: string;
        mode: 'encode' | 'decode';
        timestamp: string;
      }>;
    };
    passwordGenerator: {
      settings: {
        length: number;
        includeUppercase: boolean;
        includeLowercase: boolean;
        includeNumbers: boolean;
        includeSymbols: boolean;
        excludeAmbiguous: boolean;
      };
      history: Array<{
        password: string;
        settings: any;
        timestamp: string;
      }>;
    };
    qrCodeGenerator: {
      lastText: string;
      lastSettings: {
        size: number;
        errorCorrectionLevel: string;
        margin: number;
      };
      history: Array<{
        text: string;
        settings: any;
        timestamp: string;
      }>;
    };
    colorPicker: {
      savedColors: Array<{
        hex: string;
        name?: string;
        timestamp: string;
      }>;
      colorHistory: Array<{
        hex: string;
        timestamp: string;
      }>;
    };
  };
}

export function exportAppData(): AppData {
  const appData: AppData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    settings: {
      theme: localStorage.getItem('theme') || 'light',
      preferences: {}
    },
    toolData: {
      textCounter: {
        lastText: localStorage.getItem('textCounter_lastText') || '',
        history: JSON.parse(localStorage.getItem('textCounter_history') || '[]')
      },
      textConverter: {
        lastInput: localStorage.getItem('textConverter_lastInput') || '',
        lastConversion: localStorage.getItem('textConverter_lastConversion') || 'uppercase',
        history: JSON.parse(localStorage.getItem('textConverter_history') || '[]')
      },
      base64Tool: {
        lastInput: localStorage.getItem('base64_lastInput') || '',
        lastMode: (localStorage.getItem('base64_lastMode') as 'encode' | 'decode') || 'encode',
        history: JSON.parse(localStorage.getItem('base64_history') || '[]')
      },
      passwordGenerator: {
        settings: {
          length: parseInt(localStorage.getItem('password_length') || '16'),
          includeUppercase: localStorage.getItem('password_includeUppercase') === 'true',
          includeLowercase: localStorage.getItem('password_includeLowercase') === 'true',
          includeNumbers: localStorage.getItem('password_includeNumbers') === 'true',
          includeSymbols: localStorage.getItem('password_includeSymbols') === 'true',
          excludeAmbiguous: localStorage.getItem('password_excludeAmbiguous') === 'true'
        },
        history: JSON.parse(localStorage.getItem('password_history') || '[]')
      },
      qrCodeGenerator: {
        lastText: localStorage.getItem('qr_lastText') || '',
        lastSettings: JSON.parse(localStorage.getItem('qr_lastSettings') || '{"size": 200, "errorCorrectionLevel": "M", "margin": 4}'),
        history: JSON.parse(localStorage.getItem('qr_history') || '[]')
      },
      colorPicker: {
        savedColors: JSON.parse(localStorage.getItem('colorPicker_savedColors') || '[]'),
        colorHistory: JSON.parse(localStorage.getItem('colorPicker_colorHistory') || '[]')
      }
    }
  };

  return appData;
}

export function downloadAppData(filename?: string): void {
  const appData = exportAppData();
  const dataStr = JSON.stringify(appData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `toolmaster-export-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}

export function importAppData(data: AppData): {success: boolean; message: string} {
  try {
    // Validate data structure
    if (!data.version || !data.timestamp || !data.toolData) {
      throw new Error('Invalid export file format');
    }

    // Import settings
    if (data.settings?.theme) {
      localStorage.setItem('theme', data.settings.theme);
    }

    // Import tool data
    const { toolData } = data;

    // Text Counter
    if (toolData.textCounter) {
      localStorage.setItem('textCounter_lastText', toolData.textCounter.lastText);
      localStorage.setItem('textCounter_history', JSON.stringify(toolData.textCounter.history));
    }

    // Text Converter
    if (toolData.textConverter) {
      localStorage.setItem('textConverter_lastInput', toolData.textConverter.lastInput);
      localStorage.setItem('textConverter_lastConversion', toolData.textConverter.lastConversion);
      localStorage.setItem('textConverter_history', JSON.stringify(toolData.textConverter.history));
    }

    // Base64 Tool
    if (toolData.base64Tool) {
      localStorage.setItem('base64_lastInput', toolData.base64Tool.lastInput);
      localStorage.setItem('base64_lastMode', toolData.base64Tool.lastMode);
      localStorage.setItem('base64_history', JSON.stringify(toolData.base64Tool.history));
    }

    // Password Generator
    if (toolData.passwordGenerator) {
      const { settings } = toolData.passwordGenerator;
      localStorage.setItem('password_length', settings.length.toString());
      localStorage.setItem('password_includeUppercase', settings.includeUppercase.toString());
      localStorage.setItem('password_includeLowercase', settings.includeLowercase.toString());
      localStorage.setItem('password_includeNumbers', settings.includeNumbers.toString());
      localStorage.setItem('password_includeSymbols', settings.includeSymbols.toString());
      localStorage.setItem('password_excludeAmbiguous', settings.excludeAmbiguous.toString());
      localStorage.setItem('password_history', JSON.stringify(toolData.passwordGenerator.history));
    }

    // QR Code Generator
    if (toolData.qrCodeGenerator) {
      localStorage.setItem('qr_lastText', toolData.qrCodeGenerator.lastText);
      localStorage.setItem('qr_lastSettings', JSON.stringify(toolData.qrCodeGenerator.lastSettings));
      localStorage.setItem('qr_history', JSON.stringify(toolData.qrCodeGenerator.history));
    }

    // Color Picker
    if (toolData.colorPicker) {
      localStorage.setItem('colorPicker_savedColors', JSON.stringify(toolData.colorPicker.savedColors));
      localStorage.setItem('colorPicker_colorHistory', JSON.stringify(toolData.colorPicker.colorHistory));
    }

    return { success: true, message: 'Data imported successfully! Please refresh to see changes.' };
  } catch (error) {
    console.error('Import error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to import data'
    };
  }
}

export function validateImportFile(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    if (!file.name.endsWith('.json')) {
      reject(new Error('Please select a valid JSON file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as AppData;
        
        if (!data.version || !data.toolData) {
          reject(new Error('Invalid export file format'));
          return;
        }
        
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function clearAllData(): {success: boolean; message: string} {
  try {
    const keysToRemove = [
      'theme',
      'textCounter_lastText',
      'textCounter_history',
      'textConverter_lastInput',
      'textConverter_lastConversion',
      'textConverter_history',
      'base64_lastInput',
      'base64_lastMode',
      'base64_history',
      'password_length',
      'password_includeUppercase',
      'password_includeLowercase',
      'password_includeNumbers',
      'password_includeSymbols',
      'password_excludeAmbiguous',
      'password_history',
      'qr_lastText',
      'qr_lastSettings',
      'qr_history',
      'colorPicker_savedColors',
      'colorPicker_colorHistory'
    ];

    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    return { success: true, message: 'All data cleared successfully! Please refresh to reset the app.' };
  } catch (error) {
    return { success: false, message: 'Failed to clear data' };
  }
}