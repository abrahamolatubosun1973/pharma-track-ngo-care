
import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AppLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // If still loading, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 ${
          sidebarCollapsed ? "w-16" : "w-64"
        } transition-all duration-300 ease-in-out lg:translate-x-0 lg:static ${
          sidebarCollapsed ? "lg:w-16" : "lg:w-64"
        }`}
      >
        <div className="relative h-full">
          <Sidebar collapsed={sidebarCollapsed} />
          
          {/* Toggle collapse button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarCollapse}
            className="absolute top-4 -right-3 bg-card border shadow-sm rounded-full hidden lg:flex"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center h-16 px-4 border-b bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="ml-4 lg:ml-0">
            {user?.location && (
              <div>
                <span className="text-sm font-medium">{user.location.name}</span>
                <span className="text-xs text-muted-foreground ml-2 capitalize">
                  ({user.location.type})
                </span>
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Backdrop for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}
