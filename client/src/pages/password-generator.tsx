import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useClipboard } from "@/hooks/use-clipboard";
import { useToast } from "@/hooks/use-toast";
import { generatePassword, type PasswordOptions } from "@/lib/crypto-utils";
import { Copy, RefreshCw, Shield } from "lucide-react";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
  });
  
  const { copyToClipboard } = useClipboard();
  const { toast } = useToast();

  const handleGenerate = () => {
    const hasAtLeastOneOption = 
      options.includeUppercase || 
      options.includeLowercase || 
      options.includeNumbers || 
      options.includeSymbols;

    if (!hasAtLeastOneOption) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return;
    }

    const newPassword = generatePassword(options);
    setPassword(newPassword);
  };

  const updateOption = (key: keyof PasswordOptions, value: boolean | number) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const getStrengthColor = () => {
    let score = 0;
    if (options.includeUppercase) score++;
    if (options.includeLowercase) score++;
    if (options.includeNumbers) score++;
    if (options.includeSymbols) score++;
    
    if (options.length >= 12) score++;
    if (options.length >= 16) score++;

    if (score <= 2) return "text-red-500";
    if (score <= 4) return "text-yellow-500";
    return "text-green-500";
  };

  const getStrengthText = () => {
    let score = 0;
    if (options.includeUppercase) score++;
    if (options.includeLowercase) score++;
    if (options.includeNumbers) score++;
    if (options.includeSymbols) score++;
    
    if (options.length >= 12) score++;
    if (options.length >= 16) score++;

    if (score <= 2) return "Weak";
    if (score <= 4) return "Medium";
    return "Strong";
  };

  return (
    <div className="space-y-6">
      {/* Password Display */}
      {password && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generated Password</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(password, "Password copied to clipboard")}
                  data-testid="button-copy-password"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerate}
                  data-testid="button-regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <span className="text-lg font-mono break-all" data-testid="text-password">
                {password}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{password.length} characters</span>
              <span className={`font-medium ${getStrengthColor()}`}>
                Strength: {getStrengthText()}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Options */}
        <Card>
          <CardHeader>
            <CardTitle>Password Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Length Slider */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Length</label>
                <span className="text-sm text-muted-foreground">{options.length} characters</span>
              </div>
              <Slider
                value={[options.length]}
                onValueChange={([value]) => updateOption('length', value)}
                min={4}
                max={50}
                step={1}
                className="w-full"
                data-testid="slider-length"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>4</span>
                <span>50</span>
              </div>
            </div>

            {/* Character Options */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Include Characters</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uppercase"
                    checked={options.includeUppercase}
                    onCheckedChange={(checked) => updateOption('includeUppercase', !!checked)}
                    data-testid="checkbox-uppercase"
                  />
                  <label htmlFor="uppercase" className="text-sm">
                    Uppercase Letters (A-Z)
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lowercase"
                    checked={options.includeLowercase}
                    onCheckedChange={(checked) => updateOption('includeLowercase', !!checked)}
                    data-testid="checkbox-lowercase"
                  />
                  <label htmlFor="lowercase" className="text-sm">
                    Lowercase Letters (a-z)
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numbers"
                    checked={options.includeNumbers}
                    onCheckedChange={(checked) => updateOption('includeNumbers', !!checked)}
                    data-testid="checkbox-numbers"
                  />
                  <label htmlFor="numbers" className="text-sm">
                    Numbers (0-9)
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="symbols"
                    checked={options.includeSymbols}
                    onCheckedChange={(checked) => updateOption('includeSymbols', !!checked)}
                    data-testid="checkbox-symbols"
                  />
                  <label htmlFor="symbols" className="text-sm">
                    Symbols (!@#$%^&*)
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <span>Use at least 12 characters for better security</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <span>Include a mix of character types</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <span>Use unique passwords for each account</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <span>Consider using a password manager</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-1.5"></div>
                <span>Enable two-factor authentication when possible</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <Card>
        <CardContent className="p-6">
          <Button 
            onClick={handleGenerate} 
            size="lg"
            className="w-full"
            data-testid="button-generate"
          >
            <Shield className="w-5 h-5 mr-2" />
            Generate Secure Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
