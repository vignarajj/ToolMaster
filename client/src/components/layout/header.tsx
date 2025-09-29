import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Link, useLocation } from "wouter";
import { Logo } from "@/components/ui/logo";

interface HeaderProps {
  title: string;
  description: string;
  onMenuClick?: () => void;
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
        {/* Left side - Mobile Menu + Brand */}
        <div className="flex items-center space-x-3">
          {/* Mobile hamburger menu */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden btn-transition focus-ring hover:!bg-primary hover:!text-primary-foreground"
            onClick={onMenuClick}
            data-testid="button-mobile-menu"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* App Brand - Always visible */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Logo size={32} className="transition-transform group-hover:scale-105" />
            <span className="font-bold text-xl text-foreground">ToolMaster</span>
          </Link>
        </div>
        
        {/* Center - Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {tools.map((item) => (
            <Link key={item.path} href={item.path}>
              <Button
                variant={location === item.path ? "default" : "ghost"}
                className={`menu-bounce focus-ring ${
                  location === item.path
                    ? "btn-primary-enhanced force-primary"
                    : "hover:btn-primary-enhanced hover:force-primary"
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
            className="menu-bounce focus-ring hover:btn-primary-enhanced hover:force-primary"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
