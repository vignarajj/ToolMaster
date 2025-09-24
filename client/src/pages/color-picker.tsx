import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClipboard } from "@/hooks/use-clipboard";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Download, Plus, Copy, Search } from "lucide-react";

interface ColorEntry {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
}

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState("#d45202");
  const [colorName, setColorName] = useState("");
  const [palette, setPalette] = useState<ColorEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { copyToClipboard } = useClipboard();
  const { toast } = useToast();

  // Load palette from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("color-palette");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPalette(parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt)
        })));
      } catch (error) {
        console.error("Failed to load palette:", error);
      }
    }
  }, []);

  // Save palette to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("color-palette", JSON.stringify(palette));
  }, [palette]);

  const addColor = () => {
    if (!colorName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the color",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate names
    if (palette.some(color => color.name.toLowerCase() === colorName.toLowerCase())) {
      toast({
        title: "Error",
        description: "Color name already exists",
        variant: "destructive",
      });
      return;
    }

    const newColor: ColorEntry = {
      id: Date.now().toString(),
      name: colorName,
      color: selectedColor,
      createdAt: new Date(),
    };

    setPalette(prev => [newColor, ...prev]);
    setColorName("");
    
    toast({
      title: "Success",
      description: `Color "${colorName}" added to palette`,
    });
  };

  const removeColor = (id: string) => {
    setPalette(prev => prev.filter(color => color.id !== id));
    toast({
      title: "Removed",
      description: "Color removed from palette",
    });
  };

  const exportPalette = (format: "json" | "css") => {
    if (palette.length === 0) {
      toast({
        title: "Error",
        description: "No colors in palette to export",
        variant: "destructive",
      });
      return;
    }

    let content: string;
    let filename: string;

    if (format === "json") {
      content = JSON.stringify(palette, null, 2);
      filename = `color-palette-${Date.now()}.json`;
    } else {
      content = `:root {\n${palette
        .map(color => `  --color-${color.name.toLowerCase().replace(/\s+/g, '-')}: ${color.color};`)
        .join('\n')}\n}`;
      filename = `color-palette-${Date.now()}.css`;
    }

    const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/css" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredPalette = palette.filter(color =>
    color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    color.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getColorInfo = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    return {
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
    };
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

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const colorInfo = getColorInfo(selectedColor);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Picker */}
        <Card>
          <CardHeader>
            <CardTitle>Color Picker</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Color</label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-16 h-16 rounded-md border border-border cursor-pointer"
                  data-testid="input-color-picker"
                />
                <div className="flex-1">
                  <Input
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    placeholder="#000000"
                    data-testid="input-color-hex"
                  />
                </div>
              </div>
            </div>

            {colorInfo && (
              <div className="space-y-3">
                <h4 className="font-medium">Color Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm font-mono">{colorInfo.hex}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(colorInfo.hex, "HEX copied")}
                      data-testid="button-copy-hex"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm font-mono">{colorInfo.rgb}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(colorInfo.rgb, "RGB copied")}
                      data-testid="button-copy-rgb"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm font-mono">{colorInfo.hsl}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(colorInfo.hsl, "HSL copied")}
                      data-testid="button-copy-hsl"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Color Name</label>
              <div className="flex space-x-2">
                <Input
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  placeholder="Enter color name..."
                  data-testid="input-color-name"
                />
                <Button onClick={addColor} data-testid="button-add-color">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Palette Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Palette Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Colors</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or color..."
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Export Options</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => exportPalette("json")}
                  disabled={palette.length === 0}
                  data-testid="button-export-json"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export JSON
                </Button>
                <Button
                  variant="outline"
                  onClick={() => exportPalette("css")}
                  disabled={palette.length === 0}
                  data-testid="button-export-css"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSS
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="text-center text-sm text-muted-foreground">
                <p>{palette.length} colors in palette</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color Palette Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPalette.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {palette.length === 0 ? (
                <p>No colors in your palette. Add some colors to get started!</p>
              ) : (
                <p>No colors match your search.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPalette.map((color) => (
                <div
                  key={color.id}
                  className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div
                    className="h-20 w-full"
                    style={{ backgroundColor: color.color }}
                  />
                  <div className="p-3">
                    <h4 className="font-medium truncate">{color.name}</h4>
                    <p className="text-sm text-muted-foreground font-mono">{color.color.toUpperCase()}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {color.createdAt.toLocaleDateString()}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(color.color, `${color.name} copied`)}
                          data-testid={`button-copy-color-${color.id}`}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeColor(color.id)}
                          data-testid={`button-delete-color-${color.id}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
