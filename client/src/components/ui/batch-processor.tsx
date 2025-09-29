import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Layers, 
  Play, 
  Download, 
  Copy,
  X,
  FileText,
  Settings,
  Info,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useClipboard } from "@/hooks/use-clipboard";
import { calculateTextStats, convertText, type TextStats } from "@/lib/text-utils";

interface BatchItem {
  id: string;
  text: string;
  processed: boolean;
  result?: any;
}

interface BatchProcessorProps {
  mode: 'counter' | 'converter';
  onProcess?: (items: BatchItem[]) => void;
}

export function BatchProcessor({ mode, onProcess }: BatchProcessorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<BatchItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [conversionType, setConversionType] = useState('uppercase');
  const [separator, setSeparator] = useState('\n---\n');
  const { toast } = useToast();
  const { copyToClipboard } = useClipboard();

  const addItems = (text: string) => {
    const texts = text.split(separator).filter(t => t.trim());
    const newItems: BatchItem[] = texts.map((text, index) => ({
      id: `item-${Date.now()}-${index}`,
      text: text.trim(),
      processed: false
    }));
    setItems(prev => [...prev, ...newItems]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
    setProgress(0);
  };

  const processBatch = async () => {
    if (items.length === 0) return;

    setProcessing(true);
    setProgress(0);

    const processedItems: BatchItem[] = [];
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let result: any;

      if (mode === 'counter') {
        result = calculateTextStats(item.text);
      } else if (mode === 'converter') {
        result = {
          original: item.text,
          converted: convertText(item.text, conversionType),
          conversion: conversionType
        };
      }

      processedItems.push({
        ...item,
        processed: true,
        result
      });

      setProgress(((i + 1) / items.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing time
    }

    setItems(processedItems);
    setProcessing(false);
    onProcess?.(processedItems);

    toast({
      title: "Batch Processing Complete",
      description: `Processed ${processedItems.length} items successfully.`,
    });
  };

  const exportResults = () => {
    if (mode === 'counter') {
      const results = items
        .filter(item => item.processed && item.result)
        .map(item => ({
          text: item.text.substring(0, 100) + (item.text.length > 100 ? '...' : ''),
          statistics: item.result,
          timestamp: new Date().toISOString()
        }));

      const dataStr = JSON.stringify(results, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `batch-text-analysis-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (mode === 'converter') {
      const results = items
        .filter(item => item.processed && item.result)
        .map(item => `${item.result.converted}`)
        .join('\n\n');

      copyToClipboard(results, "Batch conversion results copied to clipboard");
    }
  };

  const copySummary = () => {
    if (mode === 'counter') {
      const summary = items
        .filter(item => item.processed && item.result)
        .map((item, index) => {
          const stats = item.result as TextStats;
          return `Text ${index + 1}: ${stats.words} words, ${stats.characters} chars, ${stats.readingTime}`;
        })
        .join('\n');

      copyToClipboard(summary, "Batch summary copied to clipboard");
    } else if (mode === 'converter') {
      const summary = `Batch Conversion Summary:
Conversion Type: ${conversionType}
Items Processed: ${items.filter(item => item.processed).length}
Total Items: ${items.length}`;
      
      copyToClipboard(summary, "Batch summary copied to clipboard");
    }
  };

  const processedCount = items.filter(item => item.processed).length;
  const modeTitle = mode === 'counter' ? 'Text Analysis' : 'Text Conversion';
  const modeIcon = mode === 'counter' ? FileText : Settings;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="btn-primary-enhanced force-primary menu-bounce border-primary"
          data-testid={`button-batch-${mode}`}
        >
          <Layers className="w-4 h-4 mr-2" />
          Batch {modeTitle}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-card border-border fade-in">
        <DialogHeader className="fade-in">
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Layers className="w-5 h-5 text-primary" />
            Batch {modeTitle}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="input" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Input
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Process
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Results ({processedCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4 fade-in">
            <Card className="card-hover bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base text-foreground">Add Texts to Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Text Separator
                  </label>
                  <Select value={separator} onValueChange={setSeparator}>
                    <SelectTrigger data-testid="select-separator">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="\n---\n">Line separator (---)</SelectItem>
                      <SelectItem value="\n\n">Double line break</SelectItem>
                      <SelectItem value="\n">Single line break</SelectItem>
                      <SelectItem value="|">Pipe (|)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {mode === 'converter' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Conversion Type
                    </label>
                    <Select value={conversionType} onValueChange={setConversionType}>
                      <SelectTrigger data-testid="select-conversion">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="uppercase">UPPERCASE</SelectItem>
                        <SelectItem value="lowercase">lowercase</SelectItem>
                        <SelectItem value="title">Title Case</SelectItem>
                        <SelectItem value="camel">camelCase</SelectItem>
                        <SelectItem value="snake">snake_case</SelectItem>
                        <SelectItem value="kebab">kebab-case</SelectItem>
                        <SelectItem value="capitalize">Capitalize Words</SelectItem>
                        <SelectItem value="reverse">Reverse Text</SelectItem>
                        <SelectItem value="remove-spaces">Remove Spaces</SelectItem>
                        <SelectItem value="remove-lines">Remove Line Breaks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Paste multiple texts (separated by your chosen separator)
                  </label>
                  <Textarea
                    placeholder={`Enter texts separated by "${separator}"\n\nExample:\nFirst text here${separator}Second text here${separator}Third text here`}
                    className="min-h-32"
                    onChange={(e) => {
                      if (e.target.value.trim()) {
                        addItems(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    data-testid="textarea-batch-input"
                  />
                </div>
              </CardContent>
            </Card>

            {items.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">
                    Items to Process ({items.length})
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <Badge variant={item.processed ? "default" : "secondary"}>
                            {index + 1}
                          </Badge>
                          <p className="text-sm truncate">
                            {item.text.substring(0, 60)}
                            {item.text.length > 60 ? '...' : ''}
                          </p>
                          {item.processed && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="processing" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                {items.length === 0 ? (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Add some texts in the Input tab before processing.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Ready to Process</h3>
                        <p className="text-sm text-muted-foreground">
                          {items.length} items ready • {mode === 'counter' ? 'Text analysis' : `${conversionType} conversion`}
                        </p>
                      </div>
                      <Button
                        onClick={processBatch}
                        disabled={processing || items.length === 0}
                        data-testid="button-start-processing"
                        className="btn-primary-enhanced force-primary menu-bounce"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {processing ? 'Processing...' : 'Start Processing'}
                      </Button>
                    </div>

                    {processing && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Processing...</span>
                          <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={progress} />
                      </div>
                    )}

                    {processedCount > 0 && !processing && (
                      <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Successfully processed {processedCount} out of {items.length} items!
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {processedCount === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No results yet. Process your texts first.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4 fade-in">
              <Card className="card-hover bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base text-foreground">Results Summary</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copySummary} className="menu-bounce hover:btn-primary-enhanced hover:force-primary">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Summary
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportResults} className="menu-bounce hover:btn-primary-enhanced hover:force-primary">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-primary">{processedCount}</p>
                        <p className="text-xs text-muted-foreground">Processed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{items.length}</p>
                        <p className="text-xs text-muted-foreground">Total Items</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {items.length > 0 ? ((processedCount / items.length) * 100).toFixed(0) : 0}%
                        </p>
                        <p className="text-xs text-muted-foreground">Success Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Individual Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {items.filter(item => item.processed).map((item, index) => (
                        <div
                          key={item.id}
                          className="p-3 bg-muted rounded-md"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline">{index + 1}</Badge>
                            <p className="text-xs text-muted-foreground">
                              {item.text.length} characters
                            </p>
                          </div>
                          
                          {mode === 'counter' && item.result && (
                            <div className="text-sm space-y-1">
                              <p><strong>Words:</strong> {item.result.words}</p>
                              <p><strong>Characters:</strong> {item.result.characters}</p>
                              <p><strong>Reading Time:</strong> {item.result.readingTime}</p>
                              {item.result.readability && (
                                <p><strong>Reading Level:</strong> {item.result.readability.readingLevel}</p>
                              )}
                            </div>
                          )}
                          
                          {mode === 'converter' && item.result && (
                            <div className="text-sm space-y-2">
                              <div>
                                <p className="font-medium text-muted-foreground">Original:</p>
                                <p className="bg-background p-2 rounded border">
                                  {item.result.original}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Converted:</p>
                                <p className="bg-background p-2 rounded border">
                                  {item.result.converted}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}