import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  title: string;
  description: string;
  onMenuClick: () => void;
}

const tools = [
  { path: "/", icon: null, label: "Text Counter" },
  { path: "/text-converter", icon: null, label: "Text Converter" },
  { path: "/base64", icon: null, label: "Base64 Encoder" },
  { path: "/password", icon: null, label: "Password Generator" },
  { path: "/qr-code", icon: null, label: "QR Code Generator" },
  { path: "/color-picker", icon: null, label: "Color Picker" },
];

export function Header({ title, description, onMenuClick }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 theme-transition">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Brand */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button - Only show on small screens (sm and below) */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="btn-transition focus-ring sm:hidden"
            onClick={onMenuClick}
            data-testid="button-mobile-menu"
          >
            <Menu className="w-4 h-4" />
          </Button>
          
          {/* App Brand - Always visible */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Menu className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">ToolMaster</span>
          </div>
        </div>
        
        {/* Center - Desktop Navigation */}
        <nav className="hidden sm:flex items-center space-x-1">
          {tools.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant={location === item.path ? "default" : "ghost"}
                className={`btn-transition focus-ring ${
                  location === item.path 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "hover:!bg-primary hover:!text-primary-foreground"
                }`}
                size="sm"
                data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        
        {/* Right side - Theme Toggle */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="btn-transition focus-ring hover:!bg-primary hover:!text-primary-foreground"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
