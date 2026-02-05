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
  Eye,
  ChevronDown,
  Baby,
  GraduationCap,
  HeartHandshake,
  Calendar,
  MessageCircle
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

// Floating trust pill with elastic animation
function TrustPill({ children, icon: Icon, delay = 0 }: { children: React.ReactNode; icon: React.ElementType; delay?: number }) {
  return (
    <motion.div
      className="frosted-pill px-4 py-2.5 flex items-center gap-2"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: delay + 0.6, 
        duration: 0.5,
        type: 'spring',
        stiffness: 200,
        damping: 15
      }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5 + delay, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon className="w-4 h-4 text-[#6B4E71]" />
      </motion.div>
      <span className="text-sm font-medium text-[#3A2F3D]">{children}</span>
    </motion.div>
  );
}

// Service Card Component
function ServiceCard({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  glowClass,
  cardClass,
  href,
  delay = 0 
}: { 
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  glowClass: string;
  cardClass: string;
  href: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`relative group ${cardClass} rounded-2xl p-6 md:p-8 backdrop-blur-sm transition-all duration-400`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Glow effect on hover */}
      <motion.div 
        className={`absolute inset-0 rounded-2xl ${glowClass} opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-xl -z-10`}
        style={{ background: color }}
      />
      
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${glowClass}`} style={{ background: color }}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      
      <h3 className="fluid-xl font-medium mb-3 text-[#3A2F3D]">{title}</h3>
      <p className="text-[#6B6560] fluid-base leading-relaxed mb-5 line-clamp-2">{description}</p>
      
      <Link 
        href={href}
        className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 group/link"
        style={{ color: '#6B4E71' }}
      >
        Book Now
        <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
      </Link>
    </motion.div>
  );
}

// Timeline Step Component
function TimelineStep({ 
  number, 
  title, 
  description, 
  icon: Icon,
  isLast = false,
  delay = 0 
}: { 
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  isLast?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      {/* Connector line */}
      {!isLast && (
        <motion.div 
          className="hidden md:block absolute top-[52px] left-[calc(50%+40px)] w-[calc(100%-32px)] h-0.5 bg-gradient-to-r from-[#6B4E71] to-[#9B7EA4]"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: delay + 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: 'left' }}
        />
      )}
      
      {/* Icon node */}
      <motion.div
        className="relative z-10 w-[72px] h-[72px] md:w-[88px] md:h-[88px] rounded-full bg-white border-2 border-[#E8DCC4] flex items-center justify-center shadow-soft"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay, duration: 0.4, type: 'spring', stiffness: 200 }}
      >
        <motion.div
          animate={isInView ? { scale: [1, 1.1, 1] } : {}}
          transition={{ delay: delay + 0.5, duration: 0.6 }}
        >
          <Icon className="w-7 h-7 md:w-8 md:h-8 text-[#6B4E71]" />
        </motion.div>
        
        {/* Number badge */}
        <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-[#6B4E71] to-[#9B7EA4] text-white text-xs font-semibold flex items-center justify-center">
          {number}
        </span>
      </motion.div>
      
      {/* Content */}
      <motion.div
        className="mt-5 text-center max-w-[180px]"
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: delay + 0.2, duration: 0.4 }}
      >
        <h4 className="font-medium text-[#3A2F3D] mb-2">{title}</h4>
        <p className="text-sm text-[#6B6560] leading-relaxed">{description}</p>
      </motion.div>
    </div>
  );
}

// Testimonial Card
function TestimonialCard({ 
  quote, 
  author, 
  role, 
  rating,
  delay = 0 
}: { 
  quote: string;
  author: string;
  role: string;
  rating: number;
  delay?: number;
}) {
  return (
    <motion.div
      className="glass-card p-8 min-w-[320px] md:min-w-[380px] snap-center"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Quote mark */}
      <span className="text-5xl leading-none text-[#E8DCC4] font-serif">&ldquo;</span>
      
      <p className="text-[#3A2F3D] italic leading-relaxed mt-2 mb-6">{quote}</p>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-[#3A2F3D]">{author}</p>
          <p className="text-sm text-[#6B6560]">{role}</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: delay + 0.1 * i, duration: 0.3 }}
            >
              <Star className="w-4 h-4 fill-[#D4927C] text-[#D4927C]" />
            </motion.div>
          ))}
        </div>
      </div>
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
          ? 'bg-[#6B4E71] text-white shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm text-[#6B6560] border border-[#E8DCC4] hover:border-[#6B4E71]/30'
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
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const services = [
    {
      title: 'Special Care',
      description: 'Specialized caregivers trained in autism, ADHD, sensory processing, and developmental support.',
      icon: HeartHandshake,
      color: 'linear-gradient(135deg, #C89B9B 0%, #9B7EA4 100%)',
      glowClass: 'icon-glow-special',
      cardClass: 'service-card-special',
      href: '/book-service?type=special-care',
    },
    {
      title: 'Elderly Care',
      description: 'Compassionate companions and caregivers for your loved ones with dignity and respect.',
      icon: Heart,
      color: 'linear-gradient(135deg, #D4927C 0%, #E8DCC4 100%)',
      glowClass: 'icon-glow-elderly',
      cardClass: 'service-card-elderly',
      href: '/book-service?type=elderly-care',
    },
    {
      title: 'Shadow Teacher',
      description: 'Educational support specialists who help children thrive in learning environments.',
      icon: GraduationCap,
      color: 'linear-gradient(135deg, #7B9B94 0%, #A8B5A8 100%)',
      glowClass: 'icon-glow-shadow',
      cardClass: 'service-card-shadow',
      href: '/book-service?type=shadow-teacher',
    },
  ];

  const steps = [
    { number: '1', title: 'Search', description: 'Find verified specialists for your needs', icon: Search },
    { number: '2', title: 'Connect', description: 'Message and review providers', icon: MessageCircle },
    { number: '3', title: 'Book', description: 'Schedule with flexible timing', icon: Calendar },
    { number: '4', title: 'Care', description: 'Receive quality, trusted care', icon: Heart },
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
        {/* Floating Orbs */}
        <motion.div 
          className="floating-orb orb-plum w-[400px] h-[400px] -top-20 -left-20"
          style={{ y: orbY1 }}
          animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="floating-orb orb-mauve w-[300px] h-[300px] top-1/3 -right-10"
          style={{ y: orbY2 }}
          animate={{ x: [0, -15, 0], y: [0, -25, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="floating-orb orb-sand w-[500px] h-[500px] -bottom-40 left-1/4"
          animate={{ x: [0, 25, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="floating-orb orb-sage w-[250px] h-[250px] bottom-20 right-1/4"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="container-wide py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <motion.h1 
                className="fluid-5xl font-heading optical-margin text-balance"
                style={{ color: '#3A2F3D' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Care That Understands{' '}
                <span className="gradient-text">Every Need</span>
              </motion.h1>
              
              <motion.p 
                className="fluid-lg text-[#6B6560] max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Connect with certified specialists who understand and celebrate 
                your family&apos;s unique needs. Trusted by thousands of families.
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
                  className="btn-primary btn-shimmer"
                >
                  Book a Service
                  <ArrowRight className="w-4 h-4 ml-2" />
                </MagneticButton>
                <Link 
                  href="/how-it-works" 
                  className="btn-secondary"
                >
                  Learn How It Works
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="flex flex-wrap gap-3 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <TrustPill icon={Sparkles} delay={0}>Instant Matching</TrustPill>
                <TrustPill icon={Shield} delay={0.1}>Verified Caregivers</TrustPill>
                <TrustPill icon={Clock} delay={0.2}>24/7 Support</TrustPill>
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
                  alt="Warm caregiver interaction"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
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
                    <div className="w-12 h-12 rounded-full bg-[#F5F0EB] flex items-center justify-center">
                      <Heart className="w-6 h-6 text-[#6B4E71]" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-[#3A2F3D]">98%</p>
                      <p className="text-sm text-[#6B6560]">Happy Families</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="animate-scroll-indicator"
          >
            <ChevronDown className="w-6 h-6 text-[#6B4E71]/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Service Access */}
      <section className="section-padding bg-white relative">
        <div className="container-wide">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#9B7EA4] font-medium fluid-sm uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="fluid-4xl mt-4 text-balance text-[#3A2F3D]">
              Specialized Care for Every Journey
            </h2>
          </motion.div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.title}
                {...service}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="section-padding bg-section-alt noise-overlay">
        <div className="container-wide">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#7B9B94] font-medium fluid-sm uppercase tracking-wider">
              How It Works
            </span>
            <h2 className="fluid-4xl mt-4 text-balance text-[#3A2F3D]">
              Your Journey to Trusted Care
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <TimelineStep
                key={step.number}
                {...step}
                isLast={index === steps.length - 1}
                delay={index * 0.15}
              />
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              href="/how-it-works" 
              className="inline-flex items-center gap-2 text-[#6B4E71] font-medium hover:underline"
            >
              See Full Process
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats & Social Proof */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          {/* Stats Bento Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bento-card p-6 md:p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <p className="fluid-4xl font-semibold gradient-text">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[#6B6560] fluid-base mt-2">{stat.label}</p>
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
            <span className="text-[#C89B9B] font-medium fluid-sm uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="fluid-3xl mt-4 text-[#3A2F3D]">Trusted by Families</h2>
          </motion.div>

          {/* Horizontal Scrollable Testimonials */}
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.author}
                {...testimonial}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-primary noise-overlay py-20 md:py-28">
          <div className="container-wide text-center relative z-10">
            <motion.h2 
              className="fluid-4xl text-white mb-6 text-balance"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Ready to Find the Perfect Care?
            </motion.h2>
            <motion.p 
              className="text-white/80 fluid-lg max-w-xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Join thousands of families who trust Keel for specialized care services.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <MagneticButton 
                href="/book-service" 
                className="inline-flex items-center gap-3 bg-white text-[#6B4E71] font-semibold px-8 py-4 rounded-full shadow-elevated hover:shadow-float transition-all duration-300 btn-shimmer"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </section>
    </ParentLayout>
  );
}
