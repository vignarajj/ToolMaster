import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClipboard } from "@/hooks/use-clipboard";
import { useKeyboardShortcuts, type KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts";
import { calculateTextStats, type TextStats } from "@/lib/text-utils";
import { 
  Calculator, 
  Type, 
  FileText, 
  List, 
  Hash, 
  Clock, 
  HardDrive,
  Copy,
  Download,
  RotateCcw,
  Trash2,
  Info
} from "lucide-react";

const MAX_SIZE_KB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_KB * 1024;

export default function TextCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState<TextStats>(() => calculateTextStats(""));
  const { copyToClipboard } = useClipboard();

  useEffect(() => {
    setStats(calculateTextStats(text));
  }, [text]);

  const handleClear = () => {
    setText("");
  };

  const handleCopyAll = () => {
    const statsText = `Text Statistics:
Characters: ${stats.characters}
Characters (no spaces): ${stats.charactersNoSpaces}
Words: ${stats.words}
Lines: ${stats.lines}
Paragraphs: ${stats.paragraphs}
Sentences: ${stats.sentences}
Reading Time: ${stats.readingTime}
File Size: ${stats.fileSize}`;
    
    copyToClipboard(statsText, "All statistics copied to clipboard");
  };

  const handleExport = () => {
    const statsData = {
      text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      statistics: stats,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(statsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `text-stats-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Tool-specific keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'c',
      ctrl: true,
      shift: true,
      action: handleCopyAll,
      description: 'Copy all statistics (Ctrl+Shift+C)'
    },
    {
      key: 'r',
      ctrl: true,
      action: handleClear,
      description: 'Clear text (Ctrl+R)'
    },
    {
      key: 'e',
      ctrl: true,
      shift: true,
      action: handleExport,
      description: 'Export statistics (Ctrl+Shift+E)'
    }
  ];

  useKeyboardShortcuts(shortcuts);

  const currentSizeBytes = new Blob([text]).size;
  const isOverLimit = currentSizeBytes > MAX_SIZE_BYTES;

  const statCards = [
    { icon: Calculator, label: "Characters", value: stats.characters, color: "bg-primary/10 text-primary" },
    { icon: Type, label: "Chars (no spaces)", value: stats.charactersNoSpaces, color: "bg-blue-500/10 text-blue-500" },
    { icon: FileText, label: "Words", value: stats.words, color: "bg-green-500/10 text-green-500" },
    { icon: List, label: "Lines", value: stats.lines, color: "bg-purple-500/10 text-purple-500" },
    { icon: Hash, label: "Paragraphs", value: stats.paragraphs, color: "bg-indigo-500/10 text-indigo-500" },
    { icon: FileText, label: "Sentences", value: stats.sentences, color: "bg-yellow-500/10 text-yellow-500" },
    { icon: Clock, label: "Reading Time", value: stats.readingTime, color: "bg-pink-500/10 text-pink-500" },
    { icon: HardDrive, label: "File Size", value: stats.fileSize, color: "bg-red-500/10 text-red-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <label htmlFor="text-input" className="block text-sm font-medium text-foreground mb-2">
              Enter your text to analyze
            </label>
            <div className="relative">
              <Textarea
                id="text-input"
                placeholder="Start typing to see real-time statistics..."
                className="min-h-40 resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                data-testid="textarea-text-input"
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                <span className={isOverLimit ? "text-destructive font-medium" : ""}>
                  {(currentSizeBytes / 1024).toFixed(1)} KB
                </span> / {MAX_SIZE_KB} KB max
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Maximum text size: {MAX_SIZE_KB}KB</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClear}
                className="text-primary hover:text-primary/80 h-auto p-0"
                data-testid="button-clear"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
            {isOverLimit && (
              <div className="mt-2 text-xs text-destructive">
                Text exceeds maximum size limit of {MAX_SIZE_KB}KB
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={stat.label} className="stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="copy-btn"
                  onClick={() => copyToClipboard(stat.value.toString(), `${stat.label} copied`)}
                  data-testid={`button-copy-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleCopyAll}
              data-testid="button-copy-all"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All Stats
            </Button>
            <Button 
              variant="secondary"
              onClick={handleExport}
              data-testid="button-export"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Stats
            </Button>
            <Button 
              variant="outline"
              onClick={handleClear}
              data-testid="button-reset"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information Panel */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Reading Time Calculation</h4>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                Reading time is estimated based on an average reading speed of 200 words per minute for adults. 
                This calculation provides a general estimate and may vary based on text complexity and individual reading habits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
