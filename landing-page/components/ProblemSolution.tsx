import { motion } from 'framer-motion';
import { AlertCircle, UserCheck, Briefcase, Shield } from 'lucide-react';

export const ProblemSolution = () => {
    const problems = [
        {
            title: 'Student Anxiety',
            description: 'Exam stress and academic pressure are at an all-time high.',
            icon: <UserCheck className="w-6 h-6 text-mental-blue" />,
        },
        {
            title: 'Corporate Burnout',
            description: 'Always-on culture is leading to massive professional fatigue.',
            icon: <Briefcase className="w-6 h-6 text-mental-purple" />,
        },
        {
            title: 'High-Risk Trauma',
            description: 'Police and military face trauma that standard apps don\u0027t address.',
            icon: <Shield className="w-6 h-6 text-primary" />,
        },
    ];

    return (
        <section className="py-24 bg-surface-soft">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-slate-900">
                        The world is getting <span className="text-primary italic">louder</span>.
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Traditional tools are too generic. DrMindit is built for the specific pressures
                        of your actual life and profession.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {problems.map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm"
                        >
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-slate-800">{item.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 p-8 lg:p-16 glass rounded-[3rem] text-center">
                    <h3 className="text-2xl lg:text-4xl font-bold mb-8 text-slate-900">
                        A safe haven in your pocket.
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-primary mb-2">21</span>
                            <span className="text-slate-500 uppercase tracking-widest text-xs">Day Programs</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-primary mb-2">500+</span>
                            <span className="text-slate-500 uppercase tracking-widest text-xs">Audio Sessions</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-primary mb-2">100%</span>
                            <span className="text-slate-500 uppercase tracking-widest text-xs">Private & Safe</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-4xl font-bold text-primary mb-2">24/7</span>
                            <span className="text-slate-500 uppercase tracking-widest text-xs">AI Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
