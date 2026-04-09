import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta",
    display: "swap",
});

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
    display: "swap",
});

export const metadata: Metadata = {
    title: "DrMindit | AI-Powered Mental Wellness for High-Stress Roles",
    description: "Personalized 21-day mental resilience programs and secure AI support designed for students, professionals, and emergency personnel.",
    keywords: ["mental health app", "anxiety relief", "sleep meditation", "resilience training", "corporate wellness"],
    openGraph: {
        title: "DrMindit | Mental Wellness Platform",
        description: "Science-backed support for your mental health journey.",
        images: ["/og-image.png"], // Assumed new OG image path or same hero
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "DrMindit | Mental Wellness Platform",
        description: "Personalized mental resilience programs.",
        images: ["/og-image.png"],
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${plusJakarta.variable} ${manrope.variable} scroll-smooth`}>
            <body className="antialiased font-sans">
                {children}
            </body>
        </html>
    );
}
