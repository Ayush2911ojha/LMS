"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import toast from "react-hot-toast";

// Form validation schema
const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is Required",
    }),
});

const CreatePage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            router.push(`/teacher/courses/${response.data.id}`);
            toast.success("Course created successfully!");
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-gray-100 to-white">
            <div className="max-w-lg w-full h-[80vh] bg-white rounded-lg shadow-xl p-8 border border-gray-200 overflow-y-auto">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-left">Create Your Course</h1>
                <p className="text-md text-gray-600 mb-6">Choose a descriptive title for your course. You can update this later.</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Course Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g., 'Advanced Web Development'"
                                            {...field}
                                            className="border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md transition duration-200"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-500">
                                        What will you teach in this course?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-between">
                            <Link href="/">
                                <Button variant="outline" type="button" className="flex-1 mr-2 hover:bg-gray-200 transition duration-150">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting} className="flex-1 ml-2 bg-blue-600 text-white hover:bg-blue-500 transition duration-150">
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreatePage;
