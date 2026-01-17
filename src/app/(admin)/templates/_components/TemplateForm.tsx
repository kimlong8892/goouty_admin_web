"use client";

import { useRef, useEffect, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Template } from "@/entities/Template";

const EmailEditor = dynamic(() => import("react-email-editor"), { ssr: false });

// Define the ref type locally to avoid top-level import of a client-only package
interface LocalEditorRef {
    editor: any;
}

interface TemplateFormProps {
    initialData?: Template | null;
    returnParams?: { [key: string]: string | string[] | undefined };
}

export default function TemplateForm({ initialData, returnParams }: TemplateFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [emailSubject, setEmailSubject] = useState(initialData?.emailSubject || "");
    const [message, setMessage] = useState(initialData?.message || "");
    const [title, setTitle] = useState(initialData?.title || "");
    const [variables, setVariables] = useState<string[]>(initialData?.variables || []);
    const [copiedVar, setCopiedVar] = useState<string | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const editorRef = useRef<LocalEditorRef>(null);

    useEffect(() => {
        if (isFullScreen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add("editor-full-screen");
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove("editor-full-screen");
        }
        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove("editor-full-screen");
        };
    }, [isFullScreen]);

    const [testEmailAddress, setTestEmailAddress] = useState("");
    const [isSendingTest, setIsSendingTest] = useState(false);

    const insertVariable = (variable: string) => {
        const tag = `{{${variable}}}`;

        // Copy to clipboard
        navigator.clipboard.writeText(tag).then(() => {
            setCopiedVar(variable);
            setTimeout(() => setCopiedVar(null), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleTestEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!testEmailAddress) return;

        setIsSendingTest(true);
        try {
            // Get HTML from editor
            const exportPromise = new Promise<{ html: string }>((resolve) => {
                editorRef.current?.editor?.exportHtml((data: any) => {
                    resolve(data);
                });
            });
            const { html } = await exportPromise;

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
                    html: html, // Use the exported html
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

        // Use variables from state
        const varsArray = variables;

        // Basic validation
        if (!initialData && !data.code) {
            setError("Code is required");
            return;
        }

        startTransition(async () => {
            const url = initialData ? `/api/templates/${initialData.id}` : "/api/templates";
            const method = initialData ? "PUT" : "POST";

            // Get HTML and Design from editor
            const exportPromise = new Promise<{ html: string, design: any }>((resolve) => {
                editorRef.current?.editor?.exportHtml((data: any) => {
                    resolve(data);
                });
            });

            try {
                const { html, design } = await exportPromise;
                const finalEmailBody = `${html}\n<!-- unlayer:design:${JSON.stringify(design)} -->`;

                const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...data,
                        title,
                        message,
                        emailSubject,
                        emailBody: finalEmailBody,
                        variables: varsArray
                    }),
                });

                if (!res.ok) {
                    const json = await res.json();
                    throw new Error(json.error || "Something went wrong");
                }

                const params = new URLSearchParams();
                if (returnParams) {
                    Object.entries(returnParams).forEach(([key, value]) => {
                        if (value !== undefined) {
                            if (Array.isArray(value)) {
                                value.forEach(v => params.append(key, v));
                            } else {
                                params.set(key, value);
                            }
                        }
                    });
                }
                if (initialData?.id) params.set("lastId", initialData.id);
                const queryString = params.toString();

                router.refresh();
                router.push(queryString ? `/templates?${queryString}` : "/templates");
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
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                            placeholder="e.g. WELCOME_EMAIL"
                            required
                            disabled={!!initialData}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900 dark:text-white">Title</label>
                        <input
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900 dark:text-white">Available Variables</label>
                    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
                        {variables.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {variables.map(v => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() => insertVariable(v)}
                                        title={`Click to copy & insert {{${v}}}`}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border rounded-lg transition-all shadow-sm active:scale-95 ${copiedVar === v
                                            ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                                            : "bg-white text-blue-600 border-blue-100 hover:bg-blue-50 hover:border-blue-200 dark:bg-gray-900 dark:border-gray-700 dark:text-blue-400"
                                            }`}
                                    >
                                        <span className={copiedVar === v ? "text-green-500" : "text-blue-400 font-normal"}>
                                            {copiedVar === v ? "✓" : "+"}
                                        </span>
                                        {v}
                                        {copiedVar === v && <span className="ml-1 text-[10px] font-normal opacity-70">Copied</span>}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No variables defined for this template.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900 dark:text-white">Message</label>
                    <textarea
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
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
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
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

                <div className={`space-y-4 ${isFullScreen ? "fixed inset-0 z-[999999] bg-white dark:bg-gray-900 p-4 flex flex-col" : ""}`}>
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-gray-900 dark:text-white">Email Body</label>
                        <div className="flex items-center gap-2">
                            {isFullScreen && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const form = document.querySelector('form') as HTMLFormElement;
                                        form.requestSubmit();
                                    }}
                                    disabled={isPending}
                                    className="rounded-lg bg-gray-900 px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                                >
                                    {isPending ? "Saving..." : "Save Template"}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 shadow-sm transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                {isFullScreen ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg>
                                        Exit Full Screen
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                                        Full Screen
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className={`rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm dark:border-gray-800 ${isFullScreen ? "flex-1" : ""}`}>
                        <EmailEditor
                            ref={editorRef}
                            onLoad={() => {
                                if (initialData?.emailBody) {
                                    const match = initialData.emailBody.match(/<!-- unlayer:design:([\s\S]*) -->/);
                                    if (match) {
                                        try {
                                            const design = JSON.parse(match[1]);
                                            editorRef.current?.editor?.loadDesign(design);
                                        } catch (e) {
                                            console.error("Failed to parse design", e);
                                        }
                                    }
                                }
                            }}
                            minHeight={isFullScreen ? "100%" : "600px"}
                            options={{
                                appearance: {
                                    theme: 'modern_light',
                                },
                                mergeTags: variables.reduce((acc, v) => ({
                                    ...acc,
                                    [v]: {
                                        name: v,
                                        value: `{{${v}}}`
                                    }
                                }), {})
                            }}
                        />
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

                <button
                    type="button"
                    onClick={() => {
                        const params = new URLSearchParams();
                        if (returnParams) {
                            Object.entries(returnParams).forEach(([key, value]) => {
                                if (value !== undefined) {
                                    if (Array.isArray(value)) {
                                        value.forEach(v => params.append(key, v));
                                    } else {
                                        params.set(key, value);
                                    }
                                }
                            });
                        }
                        if (initialData?.id) params.set("lastId", initialData.id);
                        const queryString = params.toString();
                        router.push(queryString ? `/templates?${queryString}` : "/templates");
                    }}
                    className="rounded-xl px-6 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                    Cancel
                </button>
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
