"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Template } from "@/entities/Template";

interface TemplateFormProps {
    initialData?: Template | null;
    returnParams?: { [key: string]: string | string[] | undefined };
}

export default function TemplateForm({ initialData, returnParams }: TemplateFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [emailBody, setEmailBody] = useState(initialData?.emailBody || "");
    const [emailSubject, setEmailSubject] = useState(initialData?.emailSubject || "");
    const [message, setMessage] = useState(initialData?.message || "");
    const [title, setTitle] = useState(initialData?.title || "");
    const [variables, setVariables] = useState<string[]>(initialData?.variables || []);
    const [copiedVar, setCopiedVar] = useState<string | null>(null);

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

        const activeElement = document.activeElement as HTMLTextAreaElement | HTMLInputElement;

        if (activeElement && ["emailBody", "emailSubject", "message", "title"].includes(activeElement.name)) {
            const start = activeElement.selectionStart || 0;
            const end = activeElement.selectionEnd || 0;
            const text = activeElement.value;
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);
            const newValue = before + tag + after;

            if (activeElement.name === "emailBody") setEmailBody(newValue);
            else if (activeElement.name === "emailSubject") setEmailSubject(newValue);
            else if (activeElement.name === "message") setMessage(newValue);
            else if (activeElement.name === "title") setTitle(newValue);

            // Re-focus and set selection (selection might need a timeout or useEffect to be accurate after state update)
            setTimeout(() => {
                activeElement.focus();
                activeElement.setSelectionRange(start + tag.length, start + tag.length);
            }, 0);
        } else {
            // Default to emailBody if nothing else is focused
            setEmailBody(prev => prev + tag);
        }
    };

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

        // Use variables from state
        const varsArray = variables;

        // Basic validation
        if (!initialData && !data.code) {
            setError("Code is required");
            return;
        }

        // Validate variables in subject and body
        const extractVars = (text: string) => {
            const regex = /{{(.*?)}}/g;
            const matches = [];
            let match;
            while ((match = regex.exec(text)) !== null) {
                matches.push(match[1].trim());
            }
            return matches;
        };

        const subjectVars = extractVars(emailSubject);
        const bodyVars = extractVars(emailBody);
        const messageVars = extractVars(message);
        const titleVars = extractVars(title);
        const allUsedVars = Array.from(new Set([...subjectVars, ...bodyVars, ...messageVars, ...titleVars]));

        const invalidVars = allUsedVars.filter(v => !varsArray.includes(v));
        if (invalidVars.length > 0) {
            setError(`The following variables are not allowed: ${invalidVars.join(", ")}. Allowed variables: ${varsArray.join(", ")}`);
            return;
        }

        startTransition(async () => {
            const url = initialData ? `/api/templates/${initialData.id}` : "/api/templates";
            const method = initialData ? "PUT" : "POST";

            try {
                const res = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...data,
                        title,
                        message,
                        emailSubject,
                        emailBody,
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
