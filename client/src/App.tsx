import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayout } from "@/components/layout/main-layout";
import TextCounter from "@/pages/text-counter";
import TextConverter from "@/pages/text-converter";
import Base64 from "@/pages/base64";
import PasswordGenerator from "@/pages/password-generator";
import QRCode from "@/pages/qr-code";
import ColorPicker from "@/pages/color-picker";
import NotFound from "@/pages/not-found";

// Determine if we're running on GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/ToolMaster' : '';

function AppRouter() {
  return (
    <Switch>
      <Route path="/">
        <MainLayout title="Text Counter" description="Real-time text analysis and statistics">
          <TextCounter />
        </MainLayout>
      </Route>
      <Route path="/text-converter">
        <MainLayout title="Text Converter" description="Transform text with multiple case and formatting options">
          <TextConverter />
        </MainLayout>
      </Route>
      <Route path="/base64">
        <MainLayout title="Base64 Encoder/Decoder" description="Encode and decode Base64 strings">
          <Base64 />
        </MainLayout>
      </Route>
      <Route path="/password">
        <MainLayout title="Password Generator" description="Generate secure passwords with customizable options">
          <PasswordGenerator />
        </MainLayout>
      </Route>
      <Route path="/qr-code">
        <MainLayout title="QR Code Generator" description="Create QR codes for text, URLs, emails, and phone numbers">
          <QRCode />
        </MainLayout>
      </Route>
      <Route path="/color-picker">
        <MainLayout title="Color Picker Manager" description="Pick colors and manage your color palette">
          <ColorPicker />
        </MainLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="toolmaster-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router base={basePath}>
            <AppRouter />
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
