import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useClipboard } from "@/hooks/use-clipboard";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Download, Copy, Settings, Palette, Info } from "lucide-react";

type QRType = "text" | "url" | "email" | "phone";

interface QRSettings {
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  foregroundColor: string;
  backgroundColor: string;
}

interface QRFormData {
  type: QRType;
  content: string;
  settings: QRSettings;
}

export default function QRCodeGenerator() {
  const [formData, setFormData] = useState<QRFormData>({
    type: "text",
    content: "",
    settings: {
      size: 300,
      errorCorrectionLevel: 'M',
      margin: 4,
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF'
    }
  });
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const { copyToClipboard } = useClipboard();
  const { toast } = useToast();

  const validateInput = (): boolean => {
    if (!formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter content to generate QR code",
        variant: "destructive",
      });
      return false;
    }

    switch (formData.type) {
      case "url":
        try {
          new URL(formData.content);
        } catch {
          toast({
            title: "Error",
            description: "Invalid URL format",
            variant: "destructive",
          });
          return false;
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.content)) {
          toast({
            title: "Error",
            description: "Invalid email format",
            variant: "destructive",
          });
          return false;
        }
        break;
      case "phone":
        if (!/^[\d\s\-\+\(\)]+$/.test(formData.content)) {
          toast({
            title: "Error",
            description: "Invalid phone format",
            variant: "destructive",
          });
          return false;
        }
        break;
    }

    return true;
  };

  const formatContent = (): string => {
    switch (formData.type) {
      case "email":
        return `mailto:${formData.content}`;
      case "phone":
        return `tel:${formData.content}`;
      default:
        return formData.content;
    }
  };

  const generateQRCode = async () => {
    if (!validateInput()) return;

    const content = formatContent();
    const { settings } = formData;
    
    // Using QR Server API with enhanced customization
    const params = new URLSearchParams({
      data: content,
      size: `${settings.size}x${settings.size}`,
      ecc: settings.errorCorrectionLevel,
      margin: settings.margin.toString(),
      color: settings.foregroundColor.replace('#', ''),
      bgcolor: settings.backgroundColor.replace('#', ''),
      qzone: '0',  // Quiet zone
      format: 'png'
    });

    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
    setQrCodeUrl(qrApiUrl);
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${formData.settings.size}x${formData.settings.size}-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "QR code downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      });
    }
  };

  const resetToDefaults = () => {
    setFormData(prev => ({
      ...prev,
      settings: {
        size: 300,
        errorCorrectionLevel: 'M',
        margin: 4,
        foregroundColor: '#000000',
        backgroundColor: '#FFFFFF'
      }
    }));
  };

  const getErrorCorrectionDescription = (level: string) => {
    switch (level) {
      case 'L': return 'Low (~7%)';
      case 'M': return 'Medium (~15%)';
      case 'Q': return 'Quartile (~25%)';
      case 'H': return 'High (~30%)';
      default: return '';
    }
  };

  const getPlaceholder = (): string => {
    switch (formData.type) {
      case "url":
        return "https://example.com";
      case "email":
        return "user@example.com";
      case "phone":
        return "+1 (555) 123-4567";
      default:
        return "Enter your text here...";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Customize
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value: QRType) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger data-testid="select-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Plain Text</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                {formData.type === "text" ? (
                  <Textarea
                    id="content"
                    placeholder={getPlaceholder()}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="min-h-32"
                    data-testid="textarea-content"
                  />
                ) : (
                  <Input
                    id="content"
                    placeholder={getPlaceholder()}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    data-testid="input-content"
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  {formData.content.length} characters
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customize Tab */}
        <TabsContent value="customize" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Size and Quality Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Size & Quality
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="size">QR Code Size</Label>
                  <Select 
                    value={formData.settings.size.toString()} 
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, size: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger data-testid="select-size">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="150">Small (150×150)</SelectItem>
                      <SelectItem value="200">Medium (200×200)</SelectItem>
                      <SelectItem value="300">Large (300×300)</SelectItem>
                      <SelectItem value="400">Extra Large (400×400)</SelectItem>
                      <SelectItem value="500">Huge (500×500)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="error-correction">Error Correction Level</Label>
                  <Select 
                    value={formData.settings.errorCorrectionLevel} 
                    onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, errorCorrectionLevel: value }
                    }))}
                  >
                    <SelectTrigger data-testid="select-error-correction">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">L - {getErrorCorrectionDescription('L')}</SelectItem>
                      <SelectItem value="M">M - {getErrorCorrectionDescription('M')}</SelectItem>
                      <SelectItem value="Q">Q - {getErrorCorrectionDescription('Q')}</SelectItem>
                      <SelectItem value="H">H - {getErrorCorrectionDescription('H')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Higher error correction allows the QR code to be read even when partially damaged
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margin">Margin</Label>
                  <Select 
                    value={formData.settings.margin.toString()} 
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, margin: parseInt(value) }
                    }))}
                  >
                    <SelectTrigger data-testid="select-margin">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No margin</SelectItem>
                      <SelectItem value="2">Small margin</SelectItem>
                      <SelectItem value="4">Medium margin</SelectItem>
                      <SelectItem value="6">Large margin</SelectItem>
                      <SelectItem value="10">Extra large margin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Color Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Colors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fg-color">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="fg-color"
                      type="color"
                      value={formData.settings.foregroundColor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, foregroundColor: e.target.value }
                      }))}
                      className="w-16 h-10 p-1 border rounded"
                      data-testid="input-fg-color"
                    />
                    <Input
                      value={formData.settings.foregroundColor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, foregroundColor: e.target.value }
                      }))}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="bg-color"
                      type="color"
                      value={formData.settings.backgroundColor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, backgroundColor: e.target.value }
                      }))}
                      className="w-16 h-10 p-1 border rounded"
                      data-testid="input-bg-color"
                    />
                    <Input
                      value={formData.settings.backgroundColor}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, backgroundColor: e.target.value }
                      }))}
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Color Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          foregroundColor: '#000000',
                          backgroundColor: '#FFFFFF'
                        }
                      }))}
                      className="justify-start"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-black border rounded-sm"></div>
                        <div className="w-4 h-4 bg-white border rounded-sm"></div>
                        <span>Classic</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          foregroundColor: '#FFFFFF',
                          backgroundColor: '#000000'
                        }
                      }))}
                      className="justify-start"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border rounded-sm"></div>
                        <div className="w-4 h-4 bg-black border rounded-sm"></div>
                        <span>Inverted</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          foregroundColor: '#d45202',
                          backgroundColor: '#FFFFFF'
                        }
                      }))}
                      className="justify-start"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-600 border rounded-sm"></div>
                        <div className="w-4 h-4 bg-white border rounded-sm"></div>
                        <span>Orange</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        settings: {
                          ...prev.settings,
                          foregroundColor: '#1e40af',
                          backgroundColor: '#f8fafc'
                        }
                      }))}
                      className="justify-start"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-700 border rounded-sm"></div>
                        <div className="w-4 h-4 bg-slate-50 border rounded-sm"></div>
                        <span>Blue</span>
                      </div>
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetToDefaults}
                  className="w-full"
                  data-testid="button-reset-settings"
                >
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Generated QR Code
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">
                    {formData.settings.size}×{formData.settings.size}
                  </Badge>
                  <Badge variant="secondary">
                    {formData.settings.errorCorrectionLevel}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center min-h-80 bg-muted rounded-md">
                  {qrCodeUrl ? (
                    <div className="text-center space-y-4">
                      <div 
                        className="mx-auto rounded-md shadow-lg"
                        style={{ backgroundColor: formData.settings.backgroundColor, padding: '16px' }}
                      >
                        <img 
                          src={qrCodeUrl} 
                          alt="Generated QR Code" 
                          className="mx-auto max-w-full h-auto"
                          style={{ 
                            width: `${Math.min(formData.settings.size, 400)}px`,
                            height: `${Math.min(formData.settings.size, 400)}px`
                          }}
                          data-testid="img-qr-code"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Content:</p>
                        <p className="text-sm text-muted-foreground bg-muted p-2 rounded break-all">
                          {formData.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Enter content and generate QR code</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-3">
                  <Button 
                    onClick={generateQRCode} 
                    disabled={!formData.content.trim()}
                    data-testid="button-generate"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate QR Code
                  </Button>
                  {qrCodeUrl && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => copyToClipboard(formData.content, "Content copied to clipboard")}
                        data-testid="button-copy-content"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Content
                      </Button>
                      <Button
                        variant="outline"
                        onClick={downloadQRCode}
                        data-testid="button-download"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </>
                  )}
                </div>

                {qrCodeUrl && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Size</p>
                      <p className="text-sm font-medium">{formData.settings.size}×{formData.settings.size}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Error Correction</p>
                      <p className="text-sm font-medium">{getErrorCorrectionDescription(formData.settings.errorCorrectionLevel)}</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Margin</p>
                      <p className="text-sm font-medium">{formData.settings.margin}px</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Colors</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <div 
                          className="w-3 h-3 rounded-sm border" 
                          style={{ backgroundColor: formData.settings.foregroundColor }}
                        ></div>
                        <div 
                          className="w-3 h-3 rounded-sm border" 
                          style={{ backgroundColor: formData.settings.backgroundColor }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Information */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Usage Tips</h4>
              <ul className="text-sm text-primary/80 space-y-1">
                <li>• <strong>Plain Text:</strong> Any text content you want to share</li>
                <li>• <strong>URL:</strong> Web addresses that open when scanned</li>
                <li>• <strong>Email:</strong> Opens email app with pre-filled recipient</li>
                <li>• <strong>Phone:</strong> Opens dialer with the phone number</li>
                <li>• <strong>Error Correction:</strong> Higher levels make QR codes more resistant to damage</li>
                <li>• <strong>Colors:</strong> Ensure sufficient contrast for reliable scanning</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
