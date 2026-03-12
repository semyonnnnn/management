import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";


export default function CreateDoc() {
    const [file, setFile] = useState<File | null>(null);

    // Handle selecting files
    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };


    // Handle removing a file
    const removeFile = (index: number) => {
        const newFile = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.length) {
            toast.error("No files selected");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => formData.append("files[]", file));

        router.post("/file", formData, {
            onSuccess: () => toast.success("Files uploaded!"),
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    сохранить документ
                </h2>
            }
        >
            <Head title="сохранить документ" />
            <Toaster />
            <Card className="max-w-md mx-auto mt-10">
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Upload your files</Label>
                            <input
                                type="file"
                                multiple
                                className="block w-full mt-2"
                                onChange={handleFiles}
                            />
                        </div>

                        {files.length > 0 && (
                            <div className="space-y-2">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-gray-100 p-2 rounded"
                                    >
                                        <span>{file.name}</span>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => removeFile(index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Button type="submit" className="w-full">
                            Upload
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
