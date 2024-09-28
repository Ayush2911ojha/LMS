"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";

export const NavbarRoutes = () => { 
    const pathname = usePathname();
   
    const isTeacherPage = pathname?.startsWith('/teacher'); // Switch mode between student and teacher
    const isCoursePage = pathname?.includes('/courses');    // Change sidebar for course chapters
    const isSearchPage = pathname === '/search';

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-4 ml-auto items-center">
                {isTeacherPage || isCoursePage ? (
                    <Link href="/">
                        <Button 
                            size="sm" 
                            variant="outline"
                            className="flex items-center text-blue-600 border-blue-600 hover:bg-blue-100 transition duration-150 shadow-md"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                ) : (
                    <Link href="/teacher/courses">
                        <Button 
                            size="sm" 
                            // variant="filled" // Changed to filled for more engagement
                            className="flex items-center bg-sky-600 text-white hover:bg-sky-700 transition duration-150 rounded-lg shadow-lg py-2 px-4"
                        >
                            Teacher Mode
                        </Button>
                    </Link>
                )}
                <UserButton />
            </div>
        </>
    );
};

