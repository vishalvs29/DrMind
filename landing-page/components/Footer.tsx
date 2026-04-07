import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="pt-24 pb-12 bg-surface-soft border-t border-slate-100">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform rotate-12">
                                <span className="text-white font-bold text-lg -rotate-12">D</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-800">DrMindit</span>
                        </div>
                        <p className="text-slate-500 leading-relaxed mb-8">
                            Empowering students and professionals to reclaim their mental space with AI-driven,
                            science-backed clinical wellness.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors hover:border-primary">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors hover:border-primary">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-colors hover:border-primary">
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-xs">Platform</h4>
                        <ul className="space-y-4 text-slate-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Audio Sessions</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">21-Day Programs</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">AI Therapy Chat</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Sleep System</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-xs">Organization</h4>
                        <ul className="space-y-4 text-slate-500">
                            <li><a href="#" className="hover:text-primary transition-colors">For Schools</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">For Companies</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact Sales</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Request Demo</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-xs">Legal</h4>
                        <ul className="space-y-4 text-slate-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-12 text-center">
                    <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-8 font-medium">
                        Disclaimer: DrMindit is a mental wellness platform and is not a substitute for professional
                        medical advice, diagnosis, or treatment. Always seek the advice of your physician
                        or other qualified health provider with any questions you may have.
                    </p>
                    <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} DrMindit Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
