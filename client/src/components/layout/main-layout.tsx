import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useGlobalShortcuts } from "@/hooks/use-keyboard-shortcuts";

interface MainLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function MainLayout({ title, description, children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Enable global keyboard shortcuts
  useGlobalShortcuts();

  return (
    <div className="flex h-screen overflow-hidden theme-transition">
      {/* Sidebar - Only show on mobile/tablet */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden theme-transition">
        <Header
          title={title}
          description={description}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 theme-transition">
          <div className="max-w-7xl mx-auto page-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
