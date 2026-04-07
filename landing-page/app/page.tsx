"use client";

import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ProblemSolution } from '../components/ProblemSolution';
import { Features } from '../components/Features';
import { B2B } from '../components/B2B';
import { Pricing } from '../components/Pricing';
import { Footer } from '../components/Footer';

export default function Home() {
    return (
        <main className="min-h-screen">
            <Navbar />

            <Hero />

            <div className="space-y-12">
                <ProblemSolution />
                <Features />
                <B2B />
                <Pricing />
            </div>

            <Footer />
        </main>
    );
}
