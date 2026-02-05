'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import ParentLayout from '@/components/layout/ParentLayout';
import { 
  Search, 
  Shield, 
  Heart, 
  Star,
  CheckCircle,
  ArrowRight,
  Users,
  Clock,
  Sparkles,
  Eye
} from 'lucide-react';

// Animated counter with skeleton loading
function AnimatedCounter({ 
  end, 
  duration = 2000, 
  suffix = '' 
}: { 
  end: number; 
  duration?: number; 
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    
    const loadTimeout = setTimeout(() => setIsLoading(false), 300);
    
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const animTimeout = setTimeout(animate, 400);
    return () => {
      clearTimeout(loadTimeout);
      clearTimeout(animTimeout);
    };
  }, [isInView, end, duration]);

  if (isLoading && isInView) {
    return <span ref={ref} className="skeleton inline-block w-16 h-10 md:w-20 md:h-12" />;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

// Magnetic button with spring physics
function MagneticButton({ 
  children, 
  className = '',
  href
}: { 
  children: React.ReactNode; 
  className?: string;
  href: string;
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) * 0.15;
    const y = (e.clientY - centerY) * 0.15;
    setPosition({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 15 }}
    >
      {children}
    </motion.a>
  );
}

// Specialty constellation visualization
function SpecialtyConstellation() {
  const specialties = [
    { name: 'Autism Support', x: 50, y: 20, color: '252 70% 85%', connections: [1, 2, 4] },
    { name: 'ADHD Care', x: 20, y: 40, color: '190 60% 82%', connections: [0, 2, 3] },
    { name: 'Developmental', x: 80, y: 40, color: '340 65% 85%', connections: [0, 1, 5] },
    { name: 'Speech Therapy', x: 10, y: 65, color: '45 80% 85%', connections: [1, 4] },
    { name: 'Sensory Processing', x: 50, y: 55, color: '165 55% 82%', connections: [0, 3, 5, 6] },
    { name: 'Physical Therapy', x: 90, y: 65, color: '25 75% 85%', connections: [2, 4] },
    { name: 'Behavioral Support', x: 50, y: 85, color: '280 60% 85%', connections: [4] },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  return (
    <div ref={containerRef} className="relative w-full h-[350px] md:h-[450px]">
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        {/* Connection lines */}
        {specialties.map((specialty, i) =>
          specialty.connections.map((connIndex) => {
            if (connIndex <= i) return null;
            return (
              <motion.line
                key={`${i}-${connIndex}`}
                x1={`${specialty.x}%`}
                y1={`${specialty.y}%`}
                x2={`${specialties[connIndex].x}%`}
                y2={`${specialties[connIndex].y}%`}
                className={`transition-all duration-300 ${
                  hoveredIndex === i || hoveredIndex === connIndex
                    ? 'stroke-[#8B7FDB]/40'
                    : 'stroke-neutral-200'
                }`}
                strokeWidth={hoveredIndex === i || hoveredIndex === connIndex ? 2 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
              />
            );
          })
        )}
      </svg>
      
      {/* Specialty nodes */}
      {specialties.map((specialty, i) => (
        <motion.div
          key={specialty.name}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{ left: `${specialty.x}%`, top: `${specialty.y}%` }}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 20, 
            delay: 0.2 + i * 0.08 
          }}
          whileHover={{ scale: 1.1 }}
        >
          <div
            className={`relative flex items-center justify-center w-[72px] h-[72px] md:w-[90px] md:h-[90px] rounded-full transition-shadow duration-300 ${
              hoveredIndex === i ? 'shadow-elevated' : 'shadow-soft'
            }`}
            style={{ backgroundColor: `hsl(${specialty.color})` }}
          >
            {/* Glow effect on hover */}
            <motion.div 
              className="absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: `hsl(${specialty.color})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === i ? 0.5 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative text-[10px] md:text-xs font-medium text-center px-2 text-neutral-700 leading-tight">
              {specialty.name}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Floating trust pill
function TrustPill({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      className="frosted-pill px-4 py-2.5 flex items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.6, duration: 0.5 }}
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        <CheckCircle className="w-4 h-4 text-[#8B7FDB]" />
      </motion.div>
      <span className="text-sm font-medium text-neutral-700">{children}</span>
    </motion.div>
  );
}

// Sensory mode toggle
function SensoryModeToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('sensory-friendly-mode');
    if (saved === 'true') {
      setEnabled(true);
      document.documentElement.classList.add('sensory-friendly');
    }
  }, []);

  const toggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    localStorage.setItem('sensory-friendly-mode', String(newValue));
    if (newValue) {
      document.documentElement.classList.add('sensory-friendly');
    } else {
      document.documentElement.classList.remove('sensory-friendly');
    }
  };

  return (
    <button
      onClick={toggle}
      className={`fixed top-24 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
        enabled 
          ? 'bg-[#8B7FDB] text-white shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm text-neutral-600 border border-neutral-200 hover:border-[#8B7FDB]/30'
      }`}
      aria-label="Toggle sensory-friendly mode"
    >
      <Eye className="w-4 h-4" />
      <span className="hidden sm:inline">Sensory Mode</span>
    </button>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const steps = [
    {
      number: '01',
      title: 'Search & Discover',
      description: 'Browse our network of certified specialists trained in various special needs care approaches.',
      icon: Search,
      span: 'md:col-span-2',
    },
    {
      number: '02',
      title: 'Review & Connect',
      description: 'Read verified reviews and message providers directly.',
      icon: Users,
      span: 'md:col-span-1',
    },
    {
      number: '03',
      title: 'Book with Confidence',
      description: 'Schedule care with our secure booking system and flexible payment options.',
      icon: Shield,
      span: 'md:col-span-2',
    },
  ];

  const testimonials = [
    {
      quote: "Finding specialized care for my son with autism was always a challenge. Keel connected us with an amazing caregiver who truly understands his needs.",
      author: "Sarah M.",
      role: "Parent of 8-year-old",
      rating: 5,
    },
    {
      quote: "The peace of mind knowing our daughter is with trained professionals is priceless. The booking process is seamless.",
      author: "David & Lisa K.",
      role: "Parents of 5-year-old",
      rating: 5,
    },
    {
      quote: "As a parent of a child with ADHD, I appreciate that Keel verifies all their providers' specialized training.",
      author: "Michael R.",
      role: "Parent of 10-year-old",
      rating: 5,
    },
  ];

  const stats = [
    { value: 500, suffix: '+', label: 'Certified Specialists' },
    { value: 98, suffix: '%', label: 'Parent Satisfaction' },
    { value: 15000, suffix: '+', label: 'Care Hours Provided' },
    { value: 50, suffix: '+', label: 'Specializations' },
  ];

  return (
    <ParentLayout>
      <SensoryModeToggle />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center bg-hero-gradient noise-overlay overflow-hidden"
      >
        <div className="container-wide py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <motion.h1 
                className="fluid-5xl font-heading optical-margin text-balance"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Finding the Perfect Care for Your{' '}
                <span className="gradient-text">Unique Child</span>
              </motion.h1>
              
              <motion.p 
                className="fluid-lg text-neutral-600 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Connect with certified specialists who understand and celebrate 
                your child&apos;s individual needs. Trusted by thousands of families.
              </motion.p>

              {/* Dual CTA */}
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <MagneticButton 
                  href="/book-service" 
                  className="btn-primary"
                >
                  Find Care Providers
                  <ArrowRight className="w-4 h-4 ml-2" />
                </MagneticButton>
                <Link 
                  href="/auth/caregiver-signup" 
                  className="btn-secondary"
                >
                  Become a Provider
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="flex flex-wrap gap-3 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <TrustPill delay={0}>500+ Certified Specialists</TrustPill>
                <TrustPill delay={0.15}>Special Needs Trained</TrustPill>
                <TrustPill delay={0.3}>Background Verified</TrustPill>
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div 
              className="relative"
              style={{ y: heroImageY }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-float">
                <Image
                  src="/image1.png"
                  alt="Warm caregiver interaction with child"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
              </div>
              
              {/* Floating stat card */}
              <motion.div 
                className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 glass-card p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#F5F3FF] flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#8B7FDB]" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-neutral-800">98%</p>
                      <p className="text-sm text-neutral-500">Happy Families</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding bg-white relative">
        <div className="container-wide">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#8B7FDB] font-medium fluid-sm uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="fluid-4xl mt-4 text-balance">
              Your Journey to Trusted Care
            </h2>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid md:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`bento-card p-8 ${step.span}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#F5F3FF] flex items-center justify-center icon-glow">
                    <step.icon className="w-7 h-7 text-[#8B7FDB]" />
                  </div>
                  <motion.span 
                    className="fluid-3xl font-light text-neutral-200"
                    initial={{ fontWeight: 300 }}
                    whileInView={{ fontWeight: 500 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                  >
                    {step.number}
                  </motion.span>
                </div>
                <h3 className="fluid-xl font-medium mb-3 text-neutral-800">{step.title}</h3>
                <p className="text-neutral-600 fluid-base leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialty Showcase */}
      <section className="section-padding bg-section-alt noise-overlay">
        <div className="container-wide">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#7FC7D9] font-medium fluid-sm uppercase tracking-wider">
              Our Expertise
            </span>
            <h2 className="fluid-4xl mt-4 text-balance">
              Specialized Care for Every Need
            </h2>
            <p className="text-neutral-600 fluid-lg mt-4 leading-relaxed">
              Our providers are trained across a constellation of specializations 
              to support your child&apos;s unique journey.
            </p>
          </motion.div>

          <SpecialtyConstellation />
        </div>
      </section>

      {/* Stats & Trust Section */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <p className="fluid-4xl font-semibold gradient-text">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-neutral-600 fluid-base mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Testimonials */}
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#8B7FDB] font-medium fluid-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="fluid-3xl mt-4">Trusted by Families</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                className="glass-card p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-neutral-700 fluid-base mb-6 leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div>
                  <p className="font-medium text-neutral-800">{testimonial.author}</p>
                  <p className="text-neutral-500 fluid-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-hero-gradient noise-overlay">
        <div className="container-narrow text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-12 h-12 text-[#8B7FDB] mx-auto mb-6" />
            <h2 className="fluid-4xl text-balance mb-6">
              Ready to Find the <span className="gradient-text">Perfect Care</span>?
            </h2>
            <p className="text-neutral-600 fluid-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join thousands of families who have found trusted, specialized 
              care for their children through Keel.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton 
                href="/book-service" 
                className="btn-primary"
              >
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </MagneticButton>
              <Link href="/how-it-works" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </ParentLayout>
  );
}
