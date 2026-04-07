import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "DrMindit | Your Mental Health Companion",
    description: "AI-powered mental wellness for students and professionals. Guided 21-day programs, sleep meditation, and secure therapy chat.",
    keywords: ["mental health app", "stress management", "anxiety relief", "sleep meditation", "corporate wellness"],
    openGraph: {
        title: "DrMindit | Mental Health Platform",
        description: "Supportive, clinical mental wellness designed for real life.",
        images: ["/drmindit_app_mockup_hero_1775565857971.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
