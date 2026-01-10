"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Template } from "@/entities/Template";

interface TemplateFormProps {
    initialData?: Template | null;
}

export default function TemplateForm({ initialData }: TemplateFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [emailBody, setEmailBody] = useState(initialData?.emailBody || "");

    const [testEmailAddress, setTestEmailAddress] = useState("");
    const [isSendingTest, setIsSendingTest] = useState(false);

    const handleTestEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testEmailAddress) return;

        setIsSendingTest(true);
        try {
            // Get current form values using FormData to ensure we send what's currently being edited (except controlled emailBody)
            const form = document.querySelector('form') as HTMLFormElement; // Safe enough locally
            const formData = new FormData(form);
            const currentSubject = formData.get('emailSubject') as string || initialData?.emailSubject || "Test Subject";

            const res = await fetch("/api/templates/test-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to: testEmailAddress,
                    subject: currentSubject,
                    html: emailBody, // Use the controlled state
                }),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error || "Failed to send test email");
            }

            alert("Test email sent successfully!");
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSendingTest(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.code) {
            setError("Code is required");
            return;
        }

        startTransition(async () => {
            const url = initialData ? `/api/templates/${initialData.id}` : "/api/templates";
            const method = initialData ? "PUT" : "POST";

            try {
                const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (!res.ok) {
                    const json = await res.json();
                    throw new Error(json.error || "Something went wrong");
                }

                router.refresh();
                router.push("/templates");
            } catch (err: any) {
                setError(err.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-full space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold dark:text-white">
                    {initialData ? "Edit Template" : "Create New Template"}
                </h1>
                <p className="mt-2 text-gray-500">
                    Define the system notification or email templates here.
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/10 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900 dark:text-white">Code *</label>
                        <input
                            name="code"
                            defaultValue={initialData?.code}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                            placeholder="e.g. WELCOME_EMAIL"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900 dark:text-white">Title</label>
                        <input
                            name="title"
                            defaultValue={initialData?.title || ""}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900 dark:text-white">Message</label>
                    <textarea
                        name="message"
                        defaultValue={initialData?.message || ""}
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800">
                    <h3 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">Send Test Email</h3>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={testEmailAddress}
                            onChange={(e) => setTestEmailAddress(e.target.value)}
                            placeholder="Enter email address"
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={handleTestEmail}
                            disabled={isSendingTest || !testEmailAddress}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isSendingTest ? "..." : "Send"}
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900 dark:text-white">Email Subject</label>
                        <input
                            name="emailSubject"
                            defaultValue={initialData?.emailSubject || ""}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900 dark:text-white">Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                name="color"
                                defaultValue={initialData?.color || "#000000"}
                                className="h-10 w-20 rounded cursor-pointer border-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900 dark:text-white">Email Body</label>
                    <div className="grid gap-6 md:grid-cols-2">
                        <textarea
                            name="emailBody"
                            value={emailBody}
                            onChange={(e) => setEmailBody(e.target.value)}
                            rows={20}
                            className="w-full font-mono text-sm rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                        />
                        <div className="space-y-2">

                            <label className="text-sm font-bold text-gray-500">Preview</label>
                            <div
                                className="h-full min-h-[400px] w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                                dangerouslySetInnerHTML={{ __html: emailBody }}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900 dark:text-white">Icon (Full Code/URL)</label>
                    <input
                        name="icon"
                        defaultValue={initialData?.icon || ""}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-4">

                <Link
                    href="/templates"
                    className="rounded-xl px-6 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-xl bg-gray-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                    {isPending ? "Saving..." : "Save Template"}
                </button>
            </div>
        </form>

    );
}
