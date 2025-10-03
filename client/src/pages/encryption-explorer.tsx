import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useClipboard } from "@/hooks/use-clipboard";
import { useToast } from "@/hooks/use-toast";
import { Copy, Shield, Key, Lock, Hash } from "lucide-react";
import {
  caesarCipher,
  generateAESKey,
  aesEncrypt,
  aesDecrypt,
  generateRSAKeys,
  rsaEncrypt,
  rsaDecrypt,
  sha256Hash,
  generateRandomBase64Key,
  type RSAKeyPair
} from "@/lib/encryption-utils";

type EncryptionMethod = "caesar" | "aes" | "rsa" | "sha256";
type Action = "encrypt" | "decrypt";

interface MethodConfig {
  name: string;
  icon: React.ComponentType<any>;
  tooltip: string;
  supportsDecrypt: boolean;
}

const methods: Record<EncryptionMethod, MethodConfig> = {
  caesar: {
    name: "Caesar Cipher",
    icon: Shield,
    tooltip: "Simple substitution cipher - historically insecure, for educational purposes only",
    supportsDecrypt: true,
  },
  aes: {
    name: "AES",
    icon: Lock,
    tooltip: "Advanced Encryption Standard - fast and secure symmetric encryption",
    supportsDecrypt: true,
  },
  rsa: {
    name: "RSA",
    icon: Key,
    tooltip: "Asymmetric encryption using public/private key pairs",
    supportsDecrypt: true,
  },
  sha256: {
    name: "SHA-256",
    icon: Hash,
    tooltip: "Cryptographic hash function - one-way, cannot be decrypted",
    supportsDecrypt: false,
  },
};

export default function EncryptionExplorer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [activeMethod, setActiveMethod] = useState<EncryptionMethod>("caesar");
  const [action, setAction] = useState<Action>("encrypt");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Method-specific states
  const [caesarShift, setCaesarShift] = useState([3]);
  const [aesKey, setAesKey] = useState("");
  const [rsaKeys, setRsaKeys] = useState<RSAKeyPair | null>(null);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);

  const { copyToClipboard } = useClipboard();
  const { toast } = useToast();
  const debounceRef = useRef<NodeJS.Timeout>();

  // Generate initial AES key
  useEffect(() => {
    generateNewAESKey();
  }, []);

  // Debounced processing for real-time methods
  const debouncedProcess = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (activeMethod !== "rsa") {
      debounceRef.current = setTimeout(() => {
        processEncryption();
      }, 300);
    }
  }, [input, activeMethod, action, caesarShift, aesKey]);

  useEffect(() => {
    debouncedProcess();
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [debouncedProcess]);

  const generateNewAESKey = async () => {
    try {
      const key = await generateAESKey();
      setAesKey(key);
      toast({
        title: "AES Key Generated",
        description: "A new 256-bit AES key has been generated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AES key",
        variant: "destructive",
      });
    }
  };

  const generateNewRSAKeys = async () => {
    setIsGeneratingKeys(true);
    try {
      const keys = await generateRSAKeys();
      setRsaKeys(keys);
      toast({
        title: "RSA Keys Generated",
        description: "New RSA public/private key pair has been generated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate RSA keys",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  const processEncryption = async () => {
    setError("");
    setOutput("");

    if (!input.trim()) {
      setError("Please enter text to process");
      return;
    }

    try {
      setIsProcessing(true);

      switch (activeMethod) {
        case "caesar":
          const caesarResult = caesarCipher(input, caesarShift[0], action === "decrypt");
          setOutput(caesarResult);
          break;

        case "aes":
          if (!aesKey) {
            setError("AES key is required");
            return;
          }
          if (action === "encrypt") {
            const aesResult = await aesEncrypt(input, aesKey);
            setOutput(aesResult);
          } else {
            const aesResult = await aesDecrypt(input, aesKey);
            setOutput(aesResult);
          }
          break;

        case "rsa":
          if (!rsaKeys) {
            setError("RSA keys are required. Please generate keys first.");
            return;
          }
          if (action === "encrypt") {
            const rsaResult = await rsaEncrypt(input, rsaKeys.publicKey);
            setOutput(rsaResult);
          } else {
            const rsaResult = await rsaDecrypt(input, rsaKeys.privateKey);
            setOutput(rsaResult);
          }
          break;

        case "sha256":
          if (action === "decrypt") {
            setError("SHA-256 is a one-way hash function and cannot be decrypted");
            return;
          }
          const hashResult = await sha256Hash(input);
          setOutput(hashResult);
          break;

        default:
          setError("Unknown encryption method");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessRSA = () => {
    processEncryption();
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const copyInput = () => {
    copyToClipboard(input, "Input copied to clipboard");
  };

  const copyOutput = () => {
    copyToClipboard(output, "Output copied to clipboard");
  };

  const copyKey = (key: string, type: string) => {
    copyToClipboard(key, `${type} key copied to clipboard`);
  };

  const activeMethodConfig = methods[activeMethod];
  const MethodIcon = activeMethodConfig.icon;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Encryption Explorer</h1>
        <p className="text-muted-foreground">
          Interactive platform for experimenting with encryption methods
        </p>
      </div>

      {/* Method Tabs */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(methods).map(([method, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={method}
                  variant={activeMethod === method ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setActiveMethod(method as EncryptionMethod)}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{config.name}</span>
                </Button>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <MethodIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {activeMethodConfig.tooltip}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Selector and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Action</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={action}
              onValueChange={(value) => setAction(value as Action)}
              disabled={activeMethod === "sha256"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="encrypt">Encrypt</SelectItem>
                {activeMethodConfig.supportsDecrypt && (
                  <SelectItem value="decrypt">Decrypt</SelectItem>
                )}
              </SelectContent>
            </Select>
            {activeMethod === "sha256" && action === "decrypt" && (
              <p className="text-sm text-red-600 mt-2">
                SHA-256 cannot be decrypted
              </p>
            )}
          </CardContent>
        </Card>

        {/* Method-Specific Options */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{activeMethodConfig.name} Options</CardTitle>
          </CardHeader>
          <CardContent>
            {activeMethod === "caesar" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Shift Value: {caesarShift[0]}</label>
                  <Slider
                    value={caesarShift}
                    onValueChange={setCaesarShift}
                    max={25}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Caesar cipher shifts each letter by the specified number of positions
                </p>
              </div>
            )}

            {activeMethod === "aes" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">AES Key (Base64)</label>
                  <div className="flex gap-2 mt-2">
                    <Textarea
                      value={aesKey}
                      onChange={(e) => setAesKey(e.target.value)}
                      placeholder="Enter 256-bit AES key in Base64 format"
                      className="flex-1 min-h-20 text-xs font-mono"
                    />
                    <Button
                      variant="outline"
                      onClick={generateNewAESKey}
                      className="px-3"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  AES-256-GCM with 96-bit IV for secure symmetric encryption
                </p>
              </div>
            )}

            {activeMethod === "rsa" && (
              <div className="space-y-4">
                <Button
                  onClick={generateNewRSAKeys}
                  disabled={isGeneratingKeys}
                  className="w-full"
                >
                  {isGeneratingKeys ? "Generating..." : "Generate RSA Keys"}
                </Button>
                
                {rsaKeys && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium">Public Key</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyKey(rsaKeys.publicKey, "Public")}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <Textarea
                        value={rsaKeys.publicKey}
                        readOnly
                        className="min-h-20 text-xs font-mono"
                      />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-medium">Private Key</label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyKey(rsaKeys.privateKey, "Private")}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <Textarea
                        value={rsaKeys.privateKey}
                        readOnly
                        className="min-h-20 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  RSA-OAEP with 2048-bit keys for asymmetric encryption
                </p>
              </div>
            )}

            {activeMethod === "sha256" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  SHA-256 produces a fixed-size 256-bit hash of the input data.
                  This is a one-way function - the original data cannot be recovered from the hash.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Input/Output Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Input Text
              <Button
                variant="outline"
                size="sm"
                onClick={copyInput}
                disabled={!input}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text to encrypt or decrypt..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-40"
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
              Output
              <Button
                variant="outline"
                size="sm"
                onClick={copyOutput}
                disabled={!output}
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
                    {action === "encrypt" ? "Encrypted" : "Decrypted"} result will appear here
                  </span>
                )}
              </span>
            </div>
            {output && (
              <div className="mt-2 text-sm text-muted-foreground">
                {output.length} characters
              </div>
            )}
            {error && (
              <div className="mt-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RSA Process Button */}
      {activeMethod === "rsa" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Button
                onClick={handleProcessRSA}
                disabled={!input.trim() || !rsaKeys || isProcessing}
              >
                {isProcessing ? "Processing..." : `Process RSA ${action === "encrypt" ? "Encryption" : "Decryption"}`}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Note */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
        <CardContent className="p-6">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Educational Purpose Only
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            This Encryption Explorer is designed for educational purposes to help understand different encryption methods. 
            Do not use this tool for production security applications. Real-world encryption requires proper key management, 
            secure implementation, and thorough security testing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
