'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Baby, HeartPulse, BookOpen, ArrowRight } from 'lucide-react';
import NannyAnimation from './NannyAnimation';

const services = [
  {
    title: 'Shadow Teacher',
    desc: 'Specialized educational support for unique learning needs.',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-secondary',
    textColor: 'text-white',
  },
  {
    title: 'Child Care',
    desc: 'Verified nannies and sitters for every age.',
    icon: <Baby className="w-6 h-6" />,
    color: 'bg-primary-900',
    textColor: 'text-white',
  },
  {
    title: 'Special Needs',
    desc: 'Professional support for unique requirements.',
    icon: <HeartPulse className="w-6 h-6" />,
    color: 'bg-terracotta',
    textColor: 'text-white',
  }
];

export const BentoServices = () => {
  return (
    <section className="h-dvh flex items-center justify-center px-6 bg-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta rounded-full mix-blend-multiply filter blur-[120px] opacity-10 translate-x-1/2 -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-900 rounded-full mix-blend-multiply filter blur-[120px] opacity-10 -translate-x-1/2 -z-10" />

      <div className="container max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col: Animation */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
                className="w-full"
            >
                <NannyAnimation />
            </motion.div>

            {/* Right Col: Content */}
            <div className="flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.0, ease: [0.2, 0.8, 0.2, 1] }}
                    className="mb-10"
                >
                    <span className="text-terracotta font-bold uppercase tracking-wider text-fluid-sm mb-2 block">Our Expertise</span>
                    <h2 className="text-fluid-4xl font-display font-medium text-primary-900 mb-6 leading-tight">
                        Compassionate care <br/>
                        <span className="text-gray-400">for every stage.</span>
                    </h2>
                    <p className="text-fluid-xl text-gray-500 font-medium">
                        We connect you with verified professionals who bring expertise, empathy, and reliability to your home.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {services.map((service, idx) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                            className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-background transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                        >
                            <div className={`${service.color} ${service.textColor} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                {service.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-fluid-xl font-bold text-primary-900 mb-1">{service.title}</h3>
                                <p className="text-gray-500 text-fluid-sm font-medium">{service.desc}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-primary-900 group-hover:border-primary-900 group-hover:text-white transition-all">
                                <ArrowRight size={18} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};
