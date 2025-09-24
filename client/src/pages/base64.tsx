import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClipboard } from "@/hooks/use-clipboard";
import { useToast } from "@/hooks/use-toast";
import { encodeBase64, decodeBase64 } from "@/lib/crypto-utils";
import { Copy, ArrowUpDown } from "lucide-react";

export default function Base64() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const { copyToClipboard } = useClipboard();
  const { toast } = useToast();

  const handleConvert = () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to convert",
        variant: "destructive",
      });
      return;
    }

    try {
      if (mode === "encode") {
        setOutput(encodeBase64(input));
      } else {
        setOutput(decodeBase64(input));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: mode === "decode" ? "Invalid Base64 input" : "Failed to encode text",
        variant: "destructive",
      });
    }
  };

  const handleSwapMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    // Swap input and output if both have content
    if (input && output) {
      setInput(output);
      setOutput(input);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            {mode === "encode" ? "Base64 Encoder" : "Base64 Decoder"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {mode === "encode" 
              ? "Convert text to Base64 encoded string"
              : "Convert Base64 encoded string back to text"
            }
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={handleSwapMode}
          data-testid="button-swap-mode"
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Switch to {mode === "encode" ? "Decode" : "Encode"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle>
              {mode === "encode" ? "Text Input" : "Base64 Input"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={mode === "encode" 
                ? "Enter text to encode..."
                : "Enter Base64 string to decode..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-40"
              data-testid="textarea-input"
            />
            <div className="text-sm text-muted-foreground">
              {input.length} characters
            </div>
          </CardContent>
        </Card>

        {/* Output */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {mode === "encode" ? "Base64 Output" : "Text Output"}
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(output, "Output copied to clipboard")}
                disabled={!output}
                data-testid="button-copy-output"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md min-h-40 flex items-start">
              <span className="text-sm font-mono break-all whitespace-pre-wrap">
                {output || (
                  <span className="text-muted-foreground italic">
                    {mode === "encode" ? "Base64 encoded text" : "Decoded text"} will appear here
                  </span>
                )}
              </span>
            </div>
            {output && (
              <div className="mt-2 text-sm text-muted-foreground">
                {output.length} characters
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Button 
              onClick={handleConvert}
              disabled={!input.trim()}
              data-testid={`button-${mode}`}
            >
              {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
            </Button>
            <Button 
              variant="outline"
              onClick={handleClear}
              data-testid="button-clear"
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
