import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import Image from 'next/image';

const HERO_IMAGE = '/drmindit_app_mockup_hero_1775565857971.png';

export const Hero = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 min-h-[600px]" />;
    }

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase rounded-full mb-6 inline-block">
                                Trusted by 50k+ seekers
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-8 text-slate-900">
                                Your Mental Health <br />
                                <span className="text-gradient">Companion for Real Life</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                AI-powered, structured mental wellness programs designed for students,
                                professionals, and high-stress roles. Find your calm in the chaos.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button className="btn-primary flex items-center group">
                                    Start Your Journey
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="btn-secondary flex items-center">
                                    For Organizations
                                </button>
                            </div>

                            <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-slate-400">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-slate-800">4.9/5</span>
                                    <span className="text-xs uppercase tracking-wider">App Store</span>
                                </div>
                                <div className="h-10 w-px bg-slate-200" />
                                <div className="flex flex-col">
                                    <span className="text-2xl font-bold text-slate-800">21 Days</span>
                                    <span className="text-xs uppercase tracking-wider">To Resilience</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative z-10 animate-float"
                        >
                            <div className="relative rounded-3xl p-4 lg:p-8">
                                {/*  Using standard relative path since image is in public/ for Next.js  */}
                                <img
                                    src={HERO_IMAGE}
                                    alt="DrMindit App Mockup"
                                    className="w-full h-auto drop-shadow-2xl rounded-2xl"
                                />
                            </div>
                        </motion.div>

                        {/* Decorative Elements */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-mental-teal/20 blur-2xl rounded-full -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
};
