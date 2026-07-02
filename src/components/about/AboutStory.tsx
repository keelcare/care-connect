'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';

const warmBg =
  'linear-gradient(160deg, hsl(38, 60%, 97%) 0%, hsl(30, 50%, 95%) 50%, hsl(45, 55%, 96%) 100%)';

const isWaitlist = process.env.NEXT_PUBLIC_WAITLIST_MODE === 'true';

/* ---------- Shared: staggered line reveal ---------- */
const RevealLines = ({
  lines,
  className,
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });
  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            animate={isInView ? { y: '0%' } : {}}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * 0.12,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
};

/* ---------- Act 0: Opening title ---------- */
const OpeningAct = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  return (
    <section ref={ref} className="relative h-[130vh] bg-primary-900">
      <motion.div
        style={{ opacity, scale, y }}
        className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-sky-400/10 blur-[140px]" />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative text-xs md:text-sm font-bold uppercase tracking-[0.35em] text-white/40 mb-8"
        >
          The Keel Story
        </motion.p>

        <RevealLines
          delay={0.5}
          className="relative text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-medium text-white leading-[1.08] tracking-tight max-w-5xl"
          lines={[
            <>Every act of care begins</>,
            <>
              with someone who{' '}
              <span className="italic text-sky-300/90">understood.</span>
            </>,
          ]}
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="relative mt-10 text-base md:text-xl text-white/60 font-serif max-w-xl leading-relaxed"
        >
          This is the story of a boy, his mother, and the platform they
          unknowingly built together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Scroll</span>
          <ArrowDown size={16} className="animate-bounce" />
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ---------- Chapter heading ---------- */
const ChapterMark = ({ number, title, light = false }: { number: string; title: string; light?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-20%' }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center gap-4 mb-10"
  >
    <span className={`text-xs font-bold tabular-nums ${light ? 'text-white/30' : 'text-stone-300'}`}>
      {number}
    </span>
    <span className={`h-px w-12 ${light ? 'bg-white/20' : 'bg-stone-300'}`} />
    <span
      className={`text-xs font-bold uppercase tracking-[0.3em] ${
        light ? 'text-sky-300/70' : 'text-sky-700/70'
      }`}
    >
      {title}
    </span>
  </motion.div>
);

/* ---------- Act 1: The boy ---------- */
const ChapterBoy = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['8%', '-8%']);

  return (
    <section ref={ref} className="relative py-28 md:py-40 px-6 overflow-hidden" style={{ background: warmBg }}>
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-14 lg:gap-24 items-center">
        <div>
          <ChapterMark number="01" title="The Boy" />
          <RevealLines
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-900 leading-[1.12] tracking-tight mb-8"
            lines={[
              <>The classroom moved</>,
              <>
                at one speed. <span className="italic text-sky-700/80">His mind</span>
              </>,
              <>
                <span className="italic text-sky-700/80">moved at another.</span>
              </>,
            ]}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-5 text-base md:text-lg text-stone-500 leading-relaxed max-w-xl font-serif"
          >
            <p>
              Our founder grew up with ADHD, in classrooms that weren’t built
              for minds like his. Lessons blurred past. Instructions scattered.
              Sitting still felt like holding back a tide.
            </p>
            <p>
              Teachers saw a distracted child. Report cards saw missed
              potential. What nobody saw yet was how far he could go — with
              just one person beside him who understood.
            </p>
          </motion.div>
        </div>

        <motion.div style={{ y: imgY }} className="relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/ShadowTeacher.png"
              alt="A child navigating the classroom"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-primary-900/10" />
          </div>
          {/* Floating annotation card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute -bottom-6 -left-6 md:-left-10 bg-white rounded-2xl shadow-premium px-6 py-5 max-w-[240px] border border-stone-200/60"
          >
            <p className="text-sm text-primary-900 font-semibold leading-snug">
              “Bright, but doesn’t apply himself.”
            </p>
            <p className="text-xs text-stone-400 mt-2">— every report card, back then</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Act 2: The mother ---------- */
const ChapterMother = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  const quoteOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);
  const quoteY = useTransform(scrollYProgress, [0.35, 0.55], ['24px', '0px']);

  return (
    <section ref={ref} className="relative bg-primary-900 py-28 md:py-40 px-6 overflow-hidden">
      {/* soft glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-14 lg:gap-24 items-center">
          <motion.div style={{ y: imgY }} className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <Image
                src="/mother_child_caring.png"
                alt="A mother beside her child"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 via-transparent to-transparent" />
            </div>
          </motion.div>

          <div className="order-1 lg:order-2">
            <ChapterMark number="02" title="The Mother" light />
            <RevealLines
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium text-white leading-[1.12] tracking-tight mb-8"
              lines={[
                <>Before “shadow teacher”</>,
                <>was a profession,</>,
                <>
                  it was just <span className="italic text-sky-300/90">his mom.</span>
                </>,
              ]}
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="space-y-5 text-base md:text-lg text-white/60 leading-relaxed max-w-xl font-serif"
            >
              <p>
                She sat beside him through homework that took twice as long.
                She translated lessons into a language his mind could hold.
                She spoke to teachers, built routines, celebrated the small
                wins nobody else noticed.
              </p>
              <p>
                There was no job title for what she did. No training, no
                handbook, no one to ask. She invented the role out of love —
                years before the world would call it shadow teaching.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Cinematic pull-quote */}
        <motion.blockquote
          style={{ opacity: quoteOpacity, y: quoteY }}
          className="mt-24 md:mt-36 text-center max-w-4xl mx-auto"
        >
          <p className="text-2xl sm:text-3xl md:text-5xl font-display font-medium text-white leading-snug tracking-tight">
            “She was my shadow teacher{' '}
            <span className="italic text-sky-300/90">
              before shadow teachers existed.”
            </span>
          </p>
        </motion.blockquote>
      </div>
    </section>
  );
};

/* ---------- Act 3: The turn ---------- */
const ChapterTurn = () => (
  <section className="relative py-28 md:py-40 px-6 overflow-hidden" style={{ background: warmBg }}>
    <div className="max-w-4xl mx-auto text-center">
      <div className="flex justify-center">
        <ChapterMark number="03" title="The Turn" />
      </div>
      <RevealLines
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-900 leading-[1.12] tracking-tight mb-10"
        lines={[
          <>He made it — and then</>,
          <>
            asked one question: <span className="italic text-sky-700/80">what about</span>
          </>,
          <>
            <span className="italic text-sky-700/80">the kids whose mothers can’t?</span>
          </>,
        ]}
      />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="space-y-5 text-base md:text-lg text-stone-500 leading-relaxed max-w-2xl mx-auto font-serif"
      >
        <p>
          Not every family can put a parent in the classroom. Not every child
          gets a translator for the world. The difference between struggling
          and thriving is often just one trained, patient person — and finding
          that person shouldn’t depend on luck.
        </p>
        <p className="text-primary-900 font-semibold">
          So he built the platform he wishes his family had: verified shadow
          teachers, special needs caregivers, and nannies — one search away.
        </p>
      </motion.div>
    </div>
  </section>
);

/* ---------- Act 4: The founder ---------- */
const FounderReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  return (
    <section ref={ref} className="relative py-28 md:py-40 px-6 bg-primary-900 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-400/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">
        {/* Portrait */}
        <motion.div style={{ y: imgY }} className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/15">
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <Image
                src="/founder.jpg"
                alt="Founder of Keel"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white font-display text-xl font-medium">Founder, Keel</p>
              <p className="text-white/50 text-sm mt-1">A special child, all grown up.</p>
            </div>
          </div>
        </motion.div>

        {/* Words */}
        <div>
          <ChapterMark number="04" title="Today" light />
          <RevealLines
            className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-white leading-[1.12] tracking-tight mb-8"
            lines={[
              <>For special children.</>,
              <>
                <span className="italic text-sky-300/90">From a special child.</span>
              </>,
            ]}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-5 text-base md:text-lg text-white/60 leading-relaxed max-w-xl font-serif"
          >
            <p>
              Keel exists so that the kind of care that changed our founder’s
              life isn’t a stroke of luck — it’s something every family can
              find, vet, and trust.
            </p>
            <p>
              Every caregiver on the platform is verified the way he’d want
              for his younger self: identity checked, background screened,
              references called. Because he knows exactly what’s at stake when
              you let someone into your child’s world.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Act 5: Mission CTA ---------- */
const MissionCTA = () => (
  <section className="relative py-28 md:py-40 px-6 text-center" style={{ background: warmBg }}>
    <div className="max-w-3xl mx-auto">
      <RevealLines
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary-900 leading-[1.1] tracking-tight mb-8"
        lines={[
          <>Every child deserves</>,
          <>
            <span className="italic text-sky-700/80">someone who understands.</span>
          </>,
        ]}
      />
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-base md:text-lg text-stone-500 leading-relaxed font-serif mb-12"
      >
        Whether your family needs a shadow teacher, a special needs caregiver,
        a trusted nanny, or a companion for your parents — this platform was
        built from lived experience, for you.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        {isWaitlist ? (
          <a href="/welcome#waitlist">
            <button className="group flex items-center gap-2 bg-primary-900 text-white px-10 py-4 rounded-full font-semibold text-base md:text-lg hover:bg-primary-800 hover:scale-105 transition-all shadow-lg shadow-primary-900/20">
              Join the waitlist
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </a>
        ) : (
          <Link href="/auth/signup">
            <button className="group flex items-center gap-2 bg-primary-900 text-white px-10 py-4 rounded-full font-semibold text-base md:text-lg hover:bg-primary-800 hover:scale-105 transition-all shadow-lg shadow-primary-900/20">
              Find care for your family
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        )}
        <Link href="/welcome#services">
          <button className="px-10 py-4 rounded-full font-semibold text-base md:text-lg text-primary-900 border-2 border-primary-900/20 hover:border-primary-900 transition-all">
            Explore our services
          </button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export const AboutStory = () => (
  <div className="bg-primary-900">
    <OpeningAct />
    <ChapterBoy />
    <ChapterMother />
    <ChapterTurn />
    <FounderReveal />
    <MissionCTA />
  </div>
);
