import { NavLink, Outlet } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Contracts", path: "/contracts" },
  { label: "Invoices", path: "/invoices" },
];

function AppLayout() {
  return (
    <div className="min-h-screen bg-mint-50 text-foreground">
      <header className="border-b border-border/60 bg-transparent">
        <div className="container grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-6">
          <div className="text-2xl font-semibold tracking-tight justify-self-start">
            <span className="text-brand-green">Brand</span>
            <span className="text-brand-navy">ing</span>
          </div>
          <nav className="justify-self-center rounded-full bg-brand-navy px-1 py-1 shadow-soft">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-8 py-2 text-base font-semibold transition",
                      isActive
                        ? "bg-white text-brand-navy shadow-soft"
                        : "text-white/80 hover:text-white"
                    )
                  }
                  end={item.path === "/"}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          <button
            type="button"
            className="flex items-center gap-3 rounded-full border border-border bg-white px-4 py-2 text-left text-sm font-semibold text-foreground shadow-soft justify-self-end"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p>John Smith</p>
              <p className="text-xs font-normal text-slate-500">
                johnsmith@mail.com
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </header>

      <main className="pb-12 pt-8">
        <div className="container space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
