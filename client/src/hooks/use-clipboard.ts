import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useClipboard() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, successMessage?: string) => {
    setIsLoading(true);
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: successMessage || "Text copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { copyToClipboard, isLoading };
}
