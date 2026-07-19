import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { LEGAL } from '@/lib/legal';

export interface LegalSection {
  heading: string;
  /** Each string is a paragraph; a string[] renders as a bulleted list. */
  body: (string | string[])[];
}

export interface LegalDocumentProps {
  title: string;
  intro: string;
  sections: LegalSection[];
  /** Contact rows shown under the document, e.g. the Grievance Officer. */
  contact: { label: string; email: string }[];
}

/**
 * Shared web renderer for the Terms and Privacy pages. Content is kept 1:1 with
 * the keel-mobile in-app screens (src/app/legal) so the hosted copy and the app
 * state exactly the same thing.
 */
export function LegalDocument({ title, intro, sections, contact }: LegalDocumentProps) {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="bg-primary-900 pb-20">
        <Navbar />
        <div className="pt-32 px-6 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
          <p className="text-white/70">
            Version {LEGAL.version} · Effective {LEGAL.effectiveDate}
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-16 prose prose-lg prose-blue">
        <p className="lead">{intro}</p>

        {sections.map((section, i) => (
          <section key={section.heading}>
            <h2>
              {i + 1}. {section.heading}
            </h2>
            {section.body.map((block, j) =>
              Array.isArray(block) ? (
                <ul key={j}>
                  {block.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p key={j}>{block}</p>
              )
            )}
          </section>
        ))}

        <section>
          <h2>Contact us</h2>
          <p>
            {LEGAL.entity}, {LEGAL.registeredOffice}
          </p>
          <ul>
            {contact.map((c) => (
              <li key={c.email}>
                {c.label}:{' '}
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
