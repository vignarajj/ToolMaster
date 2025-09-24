import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  exportAppData, 
  downloadAppData, 
  importAppData, 
  validateImportFile, 
  clearAllData,
  type AppData 
} from "@/lib/export-import";

export function DataManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleExport = () => {
    try {
      downloadAppData();
      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress(0);
    setImportStatus({type: null, message: ''});

    try {
      setImportProgress(25);
      const data = await validateImportFile(file);
      
      setImportProgress(50);
      await new Promise(resolve => setTimeout(resolve, 500)); // Show progress
      
      setImportProgress(75);
      const result = importAppData(data);
      
      setImportProgress(100);
      
      if (result.success) {
        setImportStatus({type: 'success', message: result.message});
        toast({
          title: "Import Successful",
          description: result.message,
        });
      } else {
        setImportStatus({type: 'error', message: result.message});
        toast({
          title: "Import Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      setImportStatus({
        type: 'error', 
        message: error instanceof Error ? error.message : 'Import failed'
      });
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : 'Import failed',
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all data? This action cannot be undone. Consider exporting your data first.'
    );

    if (confirmed) {
      const result = clearAllData();
      if (result.success) {
        toast({
          title: "Data Cleared",
          description: result.message,
        });
        setImportStatus({type: 'success', message: result.message});
      } else {
        toast({
          title: "Clear Failed",
          description: result.message,
          variant: "destructive",
        });
        setImportStatus({type: 'error', message: result.message});
      }
    }
  };

  const getDataSummary = () => {
    try {
      const data = exportAppData();
      let totalItems = 0;
      
      Object.values(data.toolData).forEach(toolData => {
        if ('history' in toolData && Array.isArray(toolData.history)) {
          totalItems += toolData.history.length;
        }
        if ('savedColors' in toolData && Array.isArray(toolData.savedColors)) {
          totalItems += toolData.savedColors.length;
        }
        if ('colorHistory' in toolData && Array.isArray(toolData.colorHistory)) {
          totalItems += toolData.colorHistory.length;
        }
      });

      return {
        totalItems,
        dataSize: `${(JSON.stringify(data).length / 1024).toFixed(1)} KB`,
        lastModified: data.timestamp,
      };
    } catch {
      return { totalItems: 0, dataSize: '0 KB', lastModified: new Date().toISOString() };
    }
  };

  const dataSummary = getDataSummary();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-data-management"
        >
          <Database className="w-4 h-4 mr-2" />
          Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Data Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Data Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{dataSummary.totalItems}</p>
                  <p className="text-xs text-muted-foreground">Total Items</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{dataSummary.dataSize}</p>
                  <p className="text-xs text-muted-foreground">Data Size</p>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {new Date(dataSummary.lastModified).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Download all your tool data, settings, and history as a JSON file. This creates a complete backup of your ToolMaster data.
              </p>
              <Button 
                onClick={handleExport}
                className="w-full"
                data-testid="button-export-data"
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
            </CardContent>
          </Card>

          {/* Import Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Restore your data from a previously exported JSON file. This will overwrite your current data.
              </p>
              
              {importing && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Importing...</span>
                    <span className="text-sm text-muted-foreground">{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} />
                </div>
              )}

              {importStatus.type && (
                <Alert className={`mb-4 ${importStatus.type === 'success' ? 'border-green-200 bg-green-50 dark:bg-green-950' : ''}`}>
                  {importStatus.type === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {importStatus.message}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-3">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={importing}
                  data-testid="input-import-file"
                />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="w-3 h-3" />
                  <span>Only JSON files exported from ToolMaster are supported</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clear Data Section */}
          <Card className="border-destructive/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-destructive">
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete all your ToolMaster data including tool history, settings, and saved items. This action cannot be undone.
              </p>
              <Button 
                variant="destructive"
                onClick={handleClearData}
                className="w-full"
                data-testid="button-clear-data"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>

          {/* Information */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-200">
              <p className="font-medium mb-1">Data Storage:</p>
              <ul className="space-y-1 text-xs">
                <li>• All data is stored locally in your browser</li>
                <li>• Export regularly to prevent data loss</li>
                <li>• Imported data will overwrite existing data</li>
                <li>• Page refresh required after import/clear operations</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}