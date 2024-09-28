import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
    return (  
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition duration-200">
                <Menu className="h-6 w-6 text-gray-800" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white shadow-lg rounded-md">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
};

  
