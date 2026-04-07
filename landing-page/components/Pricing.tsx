import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const Pricing = () => {
    const plans = [
        {
            name: 'Free',
            price: '$0',
            description: 'Find your feet with basic tools.',
            features: ['Daily Mood Tracking', '5 Basic Audio Sessions', 'AI Support (Limited)', 'Community Access'],
            cta: 'Get Started',
            popular: false,
        },
        {
            name: 'Premium',
            price: '$12',
            period: '/mo',
            description: 'The complete mental wellness toolkit.',
            features: ['All 21-Day Programs', '500+ Immersive Sounds', 'Unlimited AI Therapy', 'Detailed Stress Analytics'],
            cta: 'Start Free Trial',
            popular: true,
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            description: 'Support for your entire team.',
            features: ['Admin Dashboard', 'Organization Analytics', 'Trauma-Safe Training', 'Dedicated Support'],
            cta: 'Contact Sales',
            popular: false,
        }
    ];

    return (
        <section id="pricing" className="py-24 bg-surface-soft">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
                        Simple, Transparent <span className="text-primary italic">Pricing</span>.
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-8 rounded-[2rem] bg-white border ${plan.popular ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10' : 'border-slate-100'}`}
                        >
                            {plan.popular && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest">
                                    Most Popular
                                </span>
                            )}

                            <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                            <div className="flex items-baseline mb-4">
                                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                {plan.period && <span className="text-slate-500 ml-1">{plan.period}</span>}
                            </div>
                            <p className="text-slate-500 mb-8">{plan.description}</p>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((f, j) => (
                                    <li key={j} className="flex items-center text-slate-600 text-sm">
                                        <Check className="w-5 h-5 text-secondary mr-3 shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20' : 'bg-slate-50 text-slate-800 hover:bg-slate-100'}`}>
                                {plan.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
