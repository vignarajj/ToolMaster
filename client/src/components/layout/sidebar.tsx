import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Logo } from "@/components/ui/logo";
import {
  Calculator,
  Code,
  Key,
  QrCode,
  Palette,
  RefreshCw,
  X,
  Sun,
  Moon
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
    if (theme === "dark" || theme === "system") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
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
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border sidebar-transition transform lg:static lg:w-72 lg:transform-none lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:block`}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <Link href="/" className="flex items-center space-x-3 group" onClick={onClose}>
              <Logo size={32} className="transition-transform group-hover:scale-105" />
              <span className="font-bold text-xl text-sidebar-foreground">ToolMaster</span>
            </Link>
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
                        className={`w-full justify-start space-x-3 menu-bounce fade-in ${
                          location === item.path
                            ? "btn-primary-enhanced force-primary font-medium"
                            : "hover:btn-primary-enhanced hover:force-primary"
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
        </div>
      </aside>
    </>
  );
}
