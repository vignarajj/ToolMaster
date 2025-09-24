import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useClipboard } from "@/hooks/use-clipboard";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Download, Copy } from "lucide-react";

type QRType = "text" | "url" | "email" | "phone";

interface QRFormData {
  type: QRType;
  content: string;
}

export default function QRCodeGenerator() {
  const [formData, setFormData] = useState<QRFormData>({
    type: "text",
    content: "",
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
    // Using a public QR code API service
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(content)}`;
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
      link.download = `qr-code-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      });
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>QR Code Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
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
              <label className="text-sm font-medium">Content</label>
              {formData.type === "text" ? (
                <Textarea
                  placeholder={getPlaceholder()}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-32"
                  data-testid="textarea-content"
                />
              ) : (
                <Input
                  placeholder={getPlaceholder()}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  data-testid="input-content"
                />
              )}
            </div>

            <Button 
              onClick={generateQRCode} 
              className="w-full"
              disabled={!formData.content.trim()}
              data-testid="button-generate"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated QR Code
              {qrCodeUrl && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(formData.content, "Content copied to clipboard")}
                    data-testid="button-copy-content"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadQRCode}
                    data-testid="button-download"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center min-h-80 bg-muted rounded-md">
              {qrCodeUrl ? (
                <div className="text-center space-y-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="Generated QR Code" 
                    className="mx-auto max-w-full h-auto rounded-md bg-white p-4"
                    data-testid="img-qr-code"
                  />
                  <p className="text-sm text-muted-foreground">
                    Content: {formData.content}
                  </p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>QR code will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Usage Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
              <li>• Plain Text: Any text content you want to share</li>
              <li>• URL: Web addresses that open when scanned</li>
              <li>• Email: Opens email app with pre-filled recipient</li>
              <li>• Phone: Opens dialer with the phone number</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
