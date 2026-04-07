import { CheckCircle2, Building2, School, Landmark } from 'lucide-react';

export const B2B = () => {
    return (
        <section id="b2b" className="py-24 bg-slate-900 text-white rounded-[4rem] mx-6 my-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl opacity-50" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
                            Support Your People <br /> <span className="text-primary-light">at Scale.</span>
                        </h2>
                        <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                            DrMindit for Organizations provides specialized tools to protect the mental
                            well-being of your students, employees, and personnel.
                        </p>

                        <div className="space-y-6">
                            {[
                                { icon: <School className="text-primary" />, title: 'Educational Institutions', desc: 'Custom anxiety programs for students.' },
                                { icon: <Building2 className="text-primary" />, title: 'Corporate Offices', desc: 'Burnout prevention and data insights.' },
                                { icon: <Landmark className="text-primary" />, title: 'Government & High-Risk', desc: 'Secure, trauma-informed support.' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                                        <p className="text-slate-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white/5 border border-white/10 p-8 lg:p-12 rounded-[3rem] backdrop-blur-xl">
                            <h3 className="text-2xl font-bold mb-6">Schedule a Discovery Call</h3>
                            <form className="space-y-4">
                                <input placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all" />
                                <input placeholder="Organization Email" className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all" />
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all text-slate-400">
                                    <option>Select Organization Type</option>
                                    <option>University / School</option>
                                    <option>Corporate Company</option>
                                    <option>Government / Military</option>
                                </select>
                                <button type="button" className="w-full btn-primary !shadow-none py-5 text-lg">
                                    Request Demo
                                </button>
                                <p className="text-center text-xs text-slate-500 mt-4">
                                    We respect your privacy. No spam, ever.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
