import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClipboard } from "@/hooks/use-clipboard";
import { convertText } from "@/lib/text-utils";
import { Copy, RotateCcw } from "lucide-react";

const conversions = [
  { key: 'uppercase', label: 'UPPERCASE', icon: '↑' },
  { key: 'lowercase', label: 'lowercase', icon: '↓' },
  { key: 'title', label: 'Title Case', icon: 'Tt' },
  { key: 'camel', label: 'camelCase', icon: 'cC' },
  { key: 'snake', label: 'snake_case', icon: '_' },
  { key: 'kebab', label: 'kebab-case', icon: '-' },
  { key: 'capitalize', label: 'Capitalize Words', icon: 'Ww' },
  { key: 'reverse', label: 'Reverse Text', icon: '⟲' },
  { key: 'remove-spaces', label: 'Remove Spaces', icon: '⌫' },
  { key: 'remove-lines', label: 'Remove Line Breaks', icon: '⤴' },
];

export default function TextConverter() {
  const [inputText, setInputText] = useState("");
  const { copyToClipboard } = useClipboard();

  const handleClear = () => {
    setInputText("");
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Text Input</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter text to convert..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-32"
              data-testid="textarea-input"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {inputText.length} characters
              </div>
              <Button 
                variant="outline"
                onClick={handleClear}
                data-testid="button-clear"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
            {!inputText.trim() && (
              <div className="text-sm text-destructive">
                Enter text to convert
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conversion Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conversions.map((conversion) => {
          const convertedText = inputText ? convertText(inputText, conversion.key) : "";
          
          return (
            <Card key={conversion.key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-mono">{conversion.icon}</span>
                    <h3 className="font-medium">{conversion.label}</h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(convertedText, `${conversion.label} copied`)}
                    disabled={!convertedText}
                    data-testid={`button-copy-${conversion.key}`}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-muted p-3 rounded-md min-h-[3rem] flex items-center">
                  <span className="text-sm font-mono break-all">
                    {convertedText || (
                      <span className="text-muted-foreground italic">
                        Converted text will appear here
                      </span>
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
