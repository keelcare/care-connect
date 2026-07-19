import React from 'react';
import { Metadata } from 'next';
import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { LEGAL } from '@/lib/legal';

// Content kept 1:1 with the keel-mobile app (src/app/legal/terms.tsx).
// REVIEW REQUIRED — drafted from the platform's actual behaviour and business
// model, not reviewed by counsel. See src/lib/legal.ts for the placeholders
// that must be filled.

export const metadata: Metadata = {
  title: 'Terms of Service | Keel',
  description:
    'The terms that govern your use of the Keel app and services — a managed marketplace connecting families with verified shadow teachers and special-needs caregivers.',
};

const SECTIONS: LegalSection[] = [
  {
    heading: 'What Keel is',
    body: [
      `Keel is a managed marketplace operated by ${LEGAL.entity} that connects families ("Parents") with independent, verified care professionals ("Caregivers") for two services: shadow teaching — one-to-one learning support for a child, at school or at home — and special care, structured support sessions for children with special needs.`,
      'Keel is not an employer of Caregivers and does not itself provide care or teaching. Caregivers are independent professionals. Keel verifies them, matches them to your request, sets the standard service rates, and operates scheduling, payment, and support — but the care relationship is between the Parent and the Caregiver.',
    ],
  },
  {
    heading: 'Eligibility and accounts',
    body: [
      'You must be at least 18 years old and legally able to enter a contract to create an account. You are responsible for the accuracy of the information you provide and for all activity under your account.',
      'You may not share your account, impersonate another person, or create an account on behalf of someone who is barred from the platform. We may suspend or terminate an account that violates these Terms or presents a safety risk.',
    ],
  },
  {
    heading: 'Caregiver verification',
    body: [
      'Before a Caregiver profile becomes bookable, we carry out identity verification, background screening, reference checks, a structured interview, and a review of any claimed certifications and special-needs or teaching qualifications.',
      'Verification reduces risk but cannot eliminate it. Keel does not guarantee the conduct, suitability, or safety of any Caregiver, and screening reflects information available at the time it was performed. Parents remain responsible for their own judgement about who works with their child.',
    ],
  },
  {
    heading: 'Bookings and matching',
    body: [
      'When you request a session or a recurring plan, our team matches your request to a verified Caregiver with the right skills. A booking is confirmed once a Caregiver is assigned; until then it is shown as finding a match. If no Caregiver can be matched before a plan’s start date, the plan expires and you are notified — you are not charged for sessions that were never delivered.',
      'Recurring plans create a series of individual sessions billed per cycle. You may cancel a recurring plan at any time; upcoming sessions are removed and no further cycles are billed.',
      'You agree to provide accurate information about your child, including allergies, medical needs, diagnoses, and support requirements relevant to the sessions. Withholding material safety information may result in cancellation of the booking.',
    ],
  },
  {
    heading: 'Pricing, payment, and taxes',
    body: [
      'Service rates are set by Keel per service category and are shown to you, including any applicable taxes, before you confirm a booking. All amounts are in Indian Rupees.',
      'Keel operates on a commission model: the amount you pay includes the Caregiver’s service fee and Keel’s platform commission. The Caregiver receives their share after the session (or billing cycle) is completed. This does not change the price you see — it is always the full amount shown at booking.',
      'Payments are processed by Razorpay. Keel does not store your card details. A payment is only complete once our servers have verified the payment signature returned by the gateway.',
      'Taxes are charged in accordance with applicable GST law and are itemised at checkout and on the booking detail screen. A payment receipt showing the tax breakup is emailed to you after every successful payment, and you may request a copy or a tax invoice from support at any time.',
    ],
  },
  {
    heading: 'Cancellations and refunds',
    body: [
      'Any charge that applies to a cancellation is shown to you before you confirm it. In summary:',
      [
        'Cancel more than 12 hours before the session starts: free — a full refund of anything already paid for that session.',
        'Cancel within 12 hours of the start time: a cancellation charge may apply, shown to you at the time of cancellation. We levy such a charge only where we bear a corresponding cost, such as compensating the assigned Caregiver for the reserved time.',
        'Cancel after the Caregiver has checked in, or fail to be present at the booked address: the session is charged in full.',
        'If a Caregiver cancels or does not arrive, you are refunded in full for that session and we attempt to source a replacement.',
      ],
      'Refunds are returned to the original payment method and typically settle within 5–7 business days, subject to your bank. Recurring plans may be cancelled at any time; cycles already billed and delivered are not refunded, and no future cycles are charged.',
    ],
  },
  {
    heading: 'Your conduct',
    body: [
      'You agree not to arrange sessions off-platform with a Caregiver you met through Keel in order to avoid fees, harass or discriminate against any user, submit false reviews, or misuse the messaging, location, or emergency features.',
      'Off-platform arrangements also remove the verification, secure-payment, and dispute-resolution safeguards that Keel provides.',
    ],
  },
  {
    heading: 'Safety and emergencies',
    body: [
      'In a medical or safety emergency, contact local emergency services first. Keel is not an emergency service and cannot dispatch help.',
      'You must report any safety incident to us as soon as reasonably possible so that we can investigate, suspend accounts where warranted, and cooperate with authorities.',
    ],
  },
  {
    heading: 'Reviews and content',
    body: [
      'You retain ownership of the content you submit, and grant Keel a non-exclusive, worldwide licence to host and display it in connection with the service. We may remove content that is unlawful, defamatory, or that reveals another person’s private information.',
    ],
  },
  {
    heading: 'Liability',
    body: [
      'To the maximum extent permitted by law, Keel’s aggregate liability arising out of or relating to the service is limited to the total amount you paid to Keel in the three months preceding the event giving rise to the claim.',
      'Nothing in these Terms excludes liability that cannot lawfully be excluded, including liability for death or personal injury caused by our negligence, or for fraud.',
    ],
  },
  {
    heading: 'Grievances, disputes, and governing law',
    body: [
      `If something goes wrong, raise it through the in-app support flow or write to ${LEGAL.supportEmail}. Consistent with the Consumer Protection (E-Commerce) Rules, 2020, our Grievance Officer (${LEGAL.grievanceOfficer.name}, ${LEGAL.grievanceOfficer.email}) acknowledges complaints within 48 hours and resolves them within one month.`,
      'These Terms are governed by the laws of India. Before commencing formal proceedings, you agree to raise the dispute with us first so that we can attempt to resolve it. Courts at the location of our registered office have exclusive jurisdiction, subject to any consumer-protection rights you have to bring a claim locally.',
    ],
  },
  {
    heading: 'Changes to these Terms',
    body: [
      'We will notify you in the app before a material change takes effect. Continuing to use Keel after the effective date means you accept the updated Terms. Prior versions are available on request.',
    ],
  },
];

export default function TermsOfService() {
  return (
    <LegalDocument
      title="Terms of Service"
      intro={`These Terms govern your use of the Keel app and services operated by ${LEGAL.entity}. Please read them carefully — by creating an account you agree to them.`}
      sections={SECTIONS}
      contact={[{ label: 'Support', email: LEGAL.supportEmail }]}
    />
  );
}
