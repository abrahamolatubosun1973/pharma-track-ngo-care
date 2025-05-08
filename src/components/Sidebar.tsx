
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Database, 
  LayoutDashboard, 
  Package, 
  Clipboard, 
  Users, 
  Settings, 
  ArrowRight,
  LogOut
} from "lucide-react";

type SidebarLink = {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: Array<"admin" | "state_manager" | "facility_manager" | "pharmacist">;
};

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const links: SidebarLink[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: Package,
    },
    {
      name: "Distribution",
      href: "/distribution",
      icon: ArrowRight,
      roles: ["admin", "state_manager"],
    },
    {
      name: "Dispensing",
      href: "/dispensing",
      icon: Clipboard,
      roles: ["facility_manager", "pharmacist"],
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
      roles: ["facility_manager", "pharmacist"],
    },
    {
      name: "Reports",
      href: "/reports",
      icon: Database,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["admin"],
    },
  ];

  // Filter links based on user role
  const filteredLinks = links.filter(link => {
    if (!link.roles) return true; // No restrictions, show to all
    if (!user) return false; // No user, don't show restricted links
    return link.roles.includes(user.role);
  });

  return (
    <div className={`h-full bg-sidebar flex flex-col border-r transition-all duration-300 ${collapsed ? "items-center" : ""}`}>
      <div className={`p-4 border-b ${collapsed ? "flex justify-center" : ""}`}>
        <div className="flex items-center gap-2">
          <div className="rounded-md">
            <img 
              src="/lovable-uploads/8fe3b472-30d4-4b11-88f3-e49e585a7b56.png" 
              alt="CARITAS logo" 
              className="h-8 w-8 object-contain" 
            />
          </div>
          {!collapsed && <h1 className="font-bold text-lg">CARITAS</h1>}
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className={`grid gap-1 ${collapsed ? "px-1" : "px-2"}`}>
          {filteredLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  collapsed 
                    ? "sidebar-link-collapsed" 
                    : "sidebar-link",
                  isActive && (collapsed 
                    ? "sidebar-link-collapsed-active" 
                    : "sidebar-link-active")
                )}
                title={collapsed ? link.name : undefined}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={`mt-auto p-4 border-t ${collapsed ? "flex justify-center" : ""}`}>
        {user && (
          <>
            <div className={`flex ${collapsed ? "flex-col" : "items-center gap-2"} mb-4`}>
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate capitalize">{user.role.replace("_", " ")}</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
