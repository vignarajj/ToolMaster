import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { 
  Calculator, 
  Code, 
  Key, 
  QrCode, 
  Palette, 
  RefreshCw,
  Moon,
  Sun,
  X,
  Menu
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const tools = [
  {
    category: "Text Tools",
    items: [
      { path: "/", icon: Calculator, label: "Text Counter" },
      { path: "/text-converter", icon: RefreshCw, label: "Text Converter" },
      { path: "/base64", icon: Code, label: "Base64 Encoder" },
    ]
  },
  {
    category: "Security",
    items: [
      { path: "/password", icon: Key, label: "Password Generator" },
    ]
  },
  {
    category: "Visual Tools",
    items: [
      { path: "/qr-code", icon: QrCode, label: "QR Code Generator" },
      { path: "/color-picker", icon: Palette, label: "Color Picker" },
    ]
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 mobile-menu-overlay z-40 lg:hidden"
          onClick={onClose}
          data-testid="mobile-overlay"
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border sidebar-transition transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Menu className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-sidebar-foreground">ToolMaster</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="lg:hidden"
              onClick={onClose}
              data-testid="button-close-sidebar"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {tools.map((category) => (
              <div key={category.category} className="mb-6">
                <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3 px-3">
                  {category.category}
                </h3>
                <div className="space-y-1">
                  {category.items.map((item) => (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={location === item.path ? "default" : "ghost"}
                        className={`w-full justify-start space-x-3 ${
                          location === item.path 
                            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium" 
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                        onClick={() => window.innerWidth < 1024 && onClose()}
                        data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Theme Toggle & Settings */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-sidebar-foreground/70">Theme</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleTheme}
                data-testid="button-theme-toggle"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
