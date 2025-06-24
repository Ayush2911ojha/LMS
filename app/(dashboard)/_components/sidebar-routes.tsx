"use client";

import { BarChart, Compass, Layout, List, User, Settings, BookOpen, Users, FileText, Edit3, MessageSquare, HelpCircle } from "lucide-react";
import { SidebarItem } from "./sidebar-icon";
import { usePathname } from "next/navigation";

const guestRoutes = [
     { icon: Layout, label: "Dashboard", href: "/" },
//   { icon: BookOpen, label: "My Courses", href: "/student/courses" },
//   { icon: BarChart, label: "Progress", href: "/student/progress" },
  { icon: Compass, label: "Browse", href: "/search" },
  { icon: FileText, label: "Notes", href: "/notes" },
  { icon: Edit3, label: "Tests", href: "/tests" },
  { icon: MessageSquare, label: "Discussion Forum", href: "/forum" },
  { icon: HelpCircle, label: "Doubts & Support", href: "/support" },
    //   { icon: User, label: "Profile", href: "/profile" },
   { icon: Settings, label: "Tools", href: "/tools" },
];

const studentRoutes = [
    { icon: Layout, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "My Courses", href: "/courses" },
    { icon: BarChart, label: "Progress", href: "/progress" },
    { icon: Compass, label: "Browse More", href: "/search" },
    { icon: Settings, label: "Tools", href: "/tools" }, // Changed icon to Settings for "Tools"
];

const teacherRoutes = [
    { icon: List, label: "Courses", href: "/teacher/courses" },
    { icon: BarChart, label: "Analytics", href: "/teacher/analytics" },
    { icon: Users, label: "Manage Students", href: "/teacher/students" },
    { icon: Settings, label: "Settings", href: "/teacher/settings" },
];

const adminRoutes = [
    { icon: Layout, label: "Admin Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Manage Users", href: "/admin/users" },
    { icon: List, label: "Manage Courses", href: "/admin/courses" },
    { icon: BarChart, label: "Site Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Site Settings", href: "/admin/settings" },
];

export const SidebarRoutes = () => {
    const pathname = usePathname();

    let routes = guestRoutes; // default

    if (pathname?.startsWith("/student")) {
        routes = studentRoutes;
    } else if (pathname?.startsWith("/teacher")) {
        routes = teacherRoutes;
    } else if (pathname?.startsWith("/admin")) {
        routes = adminRoutes;
    }

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
};

