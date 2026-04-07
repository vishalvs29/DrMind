import { motion } from 'framer-motion';
import { Headset, Brain, MessageSquare, BarChart3 } from 'lucide-react';

export const Features = () => {
    const features = [
        {
            title: 'Guided Audio Sessions',
            description: 'Expert-led meditations and immersive sleep sounds (Rain, 432Hz, Ocean).',
            icon: <Headset className="w-10 h-10 text-mental-teal" />,
            color: 'bg-teal-50',
        },
        {
            title: 'Structured Programs',
            description: 'Science-backed 21-day journeys for Exam Prep, Burnout, and Trauma recovery.',
            icon: <Brain className="w-10 h-10 text-mental-purple" />,
            color: 'bg-purple-50',
        },
        {
            title: 'Empathetic AI Chat',
            description: 'A 24/7 safe space for venting with built-in crisis detection and intervention.',
            icon: <MessageSquare className="w-10 h-10 text-primary" />,
            color: 'bg-blue-50',
        },
        {
            title: 'Deep Health Analytics',
            description: 'Track your mood trends and stress scores to see your progress visually.',
            icon: <BarChart3 className="w-10 h-10 text-mental-blue" />,
            color: 'bg-sky-50',
        },
    ];

    return (
        <section id="features" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
                        Everything you need to <span className="text-gradient">thrive</span>.
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-start p-8 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-primary/5 transition-all"
                        >
                            <div className={`w-20 h-20 shrink-0 ${f.color} rounded-[1.5rem] flex items-center justify-center mr-8`}>
                                {f.icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-800">{f.title}</h3>
                                <p className="text-lg text-slate-600 leading-relaxed">{f.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
