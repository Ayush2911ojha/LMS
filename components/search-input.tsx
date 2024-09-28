"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useDebounce } from "@/hooks/use-debounce";

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value, 500);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams(); // Get the current URL search params

    // Extract `categoryId` from the current search params
    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const query = {
            title: debouncedValue || undefined,  // Only include if it's not an empty string
            categoryId: currentCategoryId || undefined,  // Preserve categoryId if it exists
        };

        const url = qs.stringifyUrl({
            url: pathname,
            query: query,
        }, { skipNull: true, skipEmptyString: true });

        router.push(url);  // Update the URL with new query parameters
    }, [debouncedValue, currentCategoryId, router, pathname]);

    return (
        <div className="relative">
            <Search className="h-4 w-4 top-3 absolute left-3 text-slate-600 dark:text-slate-200" />
            <Input 
                onChange={(e) => setValue(e.target.value)}
                value={value}
                className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 dark:bg-slate-800 focus-visible:ring-slate-200"
                placeholder="Search for courses"
            />
        </div>
    );
}
