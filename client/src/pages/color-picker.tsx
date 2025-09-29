import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClipboard } from "@/hooks/use-clipboard";
import { Copy, Palette, Sparkles } from "lucide-react";

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState("#d45202");
  const [colorName, setColorName] = useState("");
  const { copyToClipboard } = useClipboard();

  // Automatic color naming based on HSL values
  const getColorName = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return "Unknown Color";
    
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const { h, s, l } = hsl;
    
    // Determine base color name
    let baseName = "";
    if (s < 10) {
      if (l < 20) baseName = "Black";
      else if (l > 90) baseName = "White";
      else if (l < 40) baseName = "Dark Gray";
      else if (l < 70) baseName = "Gray";
      else baseName = "Light Gray";
    } else {
      if (h < 15 || h >= 345) baseName = "Red";
      else if (h < 45) baseName = "Orange";
      else if (h < 75) baseName = "Yellow";
      else if (h < 150) baseName = "Green";
      else if (h < 190) baseName = "Cyan";
      else if (h < 270) baseName = "Blue";
      else if (h < 330) baseName = "Purple";
      else baseName = "Pink";
    }
    
    // Add modifiers based on saturation and lightness
    let modifiers = [];
    
    if (s > 80) modifiers.push("Vibrant");
    else if (s > 50) modifiers.push("Rich");
    else if (s > 25) modifiers.push("Muted");
    else if (s > 10) modifiers.push("Pale");
    
    if (l < 20) modifiers.push("Deep");
    else if (l < 40) modifiers.push("Dark");
    else if (l > 80) modifiers.push("Light");
    else if (l > 60) modifiers.push("Bright");
    
    return modifiers.length > 0 ? `${modifiers.join(" ")} ${baseName}` : baseName;
  };

  // Update color name automatically when color changes
  useEffect(() => {
    setColorName(getColorName(selectedColor));
  }, [selectedColor]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      string: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
    };
  };

  const getColorInfo = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    return {
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: hsl.string,
      name: getColorName(hex)
    };
  };

  const colorInfo = getColorInfo(selectedColor);

  const copyAllFormats = () => {
    if (!colorInfo) return;
    
    const allFormats = `Color: ${colorInfo.name}
HEX: ${colorInfo.hex}
RGB: ${colorInfo.rgb}
HSL: ${colorInfo.hsl}`;
    
    copyToClipboard(allFormats, "All color formats copied");
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Main Color Picker */}
      <Card className="card-hover bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Palette className="w-5 h-5 text-primary" />
            Color Picker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Color Input Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="relative group">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-32 h-32 rounded-2xl border-4 border-border cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl glow-primary"
                  data-testid="input-color-picker"
                />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                    Click to pick
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse-enhanced" />
                <h3 className="text-lg font-semibold text-foreground">{colorName}</h3>
                <Sparkles className="w-4 h-4 text-primary animate-pulse-enhanced" />
              </div>
              <Input
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                placeholder="#000000"
                className="text-center font-mono input-transition"
                data-testid="input-color-hex"
              />
            </div>
          </div>

          {/* Color Information Grid */}
          {colorInfo && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
              <Card className="card-hover animate-fade-in">
                <CardContent className="p-4 text-center">
                  <div className="space-y-2">
                    <h4 className="font-medium text-muted-foreground">HEX</h4>
                    <p className="text-lg font-mono font-bold text-foreground">{colorInfo.hex}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(colorInfo.hex, "HEX copied")}
                      className="w-full btn-interactive hover:btn-primary-enhanced hover:force-primary"
                      data-testid="button-copy-hex"
                    >
                      <Copy className="w-3 h-3 mr-2" />
                      Copy HEX
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover animate-fade-in">
                <CardContent className="p-4 text-center">
                  <div className="space-y-2">
                    <h4 className="font-medium text-muted-foreground">RGB</h4>
                    <p className="text-lg font-mono font-bold text-foreground">{colorInfo.rgb}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(colorInfo.rgb, "RGB copied")}
                      className="w-full btn-interactive hover:btn-primary-enhanced hover:force-primary"
                      data-testid="button-copy-rgb"
                    >
                      <Copy className="w-3 h-3 mr-2" />
                      Copy RGB
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover animate-fade-in">
                <CardContent className="p-4 text-center">
                  <div className="space-y-2">
                    <h4 className="font-medium text-muted-foreground">HSL</h4>
                    <p className="text-lg font-mono font-bold text-foreground">{colorInfo.hsl}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(colorInfo.hsl, "HSL copied")}
                      className="w-full btn-interactive hover:btn-primary-enhanced hover:force-primary"
                      data-testid="button-copy-hsl"
                    >
                      <Copy className="w-3 h-3 mr-2" />
                      Copy HSL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex justify-center">
            <Button
              onClick={copyAllFormats}
              className="btn-primary-enhanced force-primary btn-interactive glow-primary"
              data-testid="button-copy-all-formats"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All Formats
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Color Information Panel */}
      <Card className="bg-primary/5 border-primary/20 slide-in-left">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Palette className="w-5 h-5 text-primary mt-0.5 flex-shrink-0 animate-float" />
            <div>
              <h4 className="font-medium text-primary mb-1">Color Information</h4>
              <div className="space-y-1 text-sm text-primary/80">
                <p>• Color names are automatically generated based on hue, saturation, and lightness</p>
                <p>• All color formats (HEX, RGB, HSL) are available for easy copying</p>
                <p>• Click the color wheel to pick any color you need</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
