import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const CTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#0F172A] rounded-[60px] p-12 lg:p-24 relative overflow-hidden text-center">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E08E79] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1F6F5B] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/4" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
              Find the help your <br />
              <span className="text-[#F1B92B]">family deserves.</span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join over 50,000 families who trust Keel for their daily needs. Start your search today and find a verified professional in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/book-service">
                <button className="w-full sm:w-auto bg-[#F1B92B] text-[#0F172A] px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform">
                  Find Care Today
                </button>
              </Link>
              <Link href="/auth/signup?role=nanny">
                <button className="w-full sm:w-auto bg-white/10 text-white backdrop-blur-md px-12 py-5 rounded-full font-bold text-lg hover:bg-white/20 transition-all border border-white/20">
                  Become a Provider
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
