import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative bg-white z-1 dark:bg-gray-900 min-h-screen">
      <ThemeProvider>
        <div className="relative flex w-full min-h-screen justify-center items-center dark:bg-gray-900">
          {children}
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
