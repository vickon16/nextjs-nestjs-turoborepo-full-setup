"use client";
import { cn } from "@/lib/utils";
import { HomeIcon, LayoutDashboard, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const data = [
  {
    title: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User2,
  },
];

const HeaderNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
      {data.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          className={cn(
            "flex items-center gap-2 hover:underline hover:underline-offset-4",
            {
              "text-primary font-bold": pathname === item.url,
            }
          )}
        >
          <item.icon />
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default HeaderNav;
