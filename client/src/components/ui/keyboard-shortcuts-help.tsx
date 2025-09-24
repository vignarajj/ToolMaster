import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Keyboard, HelpCircle } from "lucide-react";

interface ShortcutItemProps {
  keys: string;
  description: string;
}

function ShortcutItem({ keys, description }: ShortcutItemProps) {
  const keyParts = keys.split('+').map(key => key.trim());
  
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{description}</span>
      <div className="flex gap-1">
        {keyParts.map((key, index) => (
          <div key={index} className="flex items-center">
            <Badge variant="outline" className="px-2 py-1 text-xs font-mono">
              {key}
            </Badge>
            {index < keyParts.length - 1 && (
              <span className="mx-1 text-muted-foreground">+</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function KeyboardShortcutsHelp() {
  const globalShortcuts = [
    { keys: "Alt + 1", description: "Go to Text Counter" },
    { keys: "Alt + 2", description: "Go to Text Converter" },
    { keys: "Alt + 3", description: "Go to Base64 Tool" },
    { keys: "Alt + 4", description: "Go to Password Generator" },
    { keys: "Alt + 5", description: "Go to QR Code Generator" },
    { keys: "Alt + 6", description: "Go to Color Picker" },
  ];

  const textCounterShortcuts = [
    { keys: "Ctrl + Shift + C", description: "Copy all statistics" },
    { keys: "Ctrl + R", description: "Clear text" },
    { keys: "Ctrl + Shift + E", description: "Export statistics" },
  ];

  const generalShortcuts = [
    { keys: "Ctrl + C", description: "Copy selected text" },
    { keys: "Ctrl + V", description: "Paste text" },
    { keys: "Ctrl + A", description: "Select all text" },
    { keys: "Escape", description: "Close dialogs/modals" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-keyboard-shortcuts"
        >
          <Keyboard className="w-4 h-4 mr-2" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Global Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {globalShortcuts.map((shortcut, index) => (
                  <ShortcutItem 
                    key={index}
                    keys={shortcut.keys}
                    description={shortcut.description}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Text Counter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {textCounterShortcuts.map((shortcut, index) => (
                  <ShortcutItem 
                    key={index}
                    keys={shortcut.keys}
                    description={shortcut.description}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {generalShortcuts.map((shortcut, index) => (
                  <ShortcutItem 
                    key={index}
                    keys={shortcut.keys}
                    description={shortcut.description}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
            <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-200">
              <p className="font-medium mb-1">Pro Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Keyboard shortcuts work on all pages</li>
                <li>• Use Alt + number keys for quick navigation</li>
                <li>• Tool-specific shortcuts are shown in context</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}