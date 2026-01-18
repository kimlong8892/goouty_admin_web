"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ScrollToHighlight() {
    const searchParams = useSearchParams();
    const lastId = searchParams.get("lastId");

    useEffect(() => {
        if (lastId) {
            const element = document.getElementById(`template-${lastId}`);
            if (element) {
                // Wait a bit for the page to fully render and animations to finish
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });

                    // Optional: add a brief highlight effect
                    element.classList.add("bg-primary/5", "ring-2", "ring-primary/20");
                    setTimeout(() => {
                        element.classList.remove("bg-primary/5", "ring-2", "ring-primary/20");
                    }, 2000);
                }, 100);
            }
        }
    }, [lastId]);

    return null;
}
