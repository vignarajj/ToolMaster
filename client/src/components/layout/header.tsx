import { Button } from "@/components/ui/button";
import { KeyboardShortcutsHelp } from "@/components/ui/keyboard-shortcuts-help";
import { DataManagement } from "@/components/ui/data-management";
import { Menu } from "lucide-react";

interface HeaderProps {
  title: string;
  description: string;
  onMenuClick: () => void;
}

export function Header({ title, description, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden"
          onClick={onMenuClick}
          data-testid="button-mobile-menu"
        >
          <Menu className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <DataManagement />
        <KeyboardShortcutsHelp />
        <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Offline Mode</span>
        </div>
      </div>
    </header>
  );
}
