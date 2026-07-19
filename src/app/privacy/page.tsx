import React from 'react';
import { Metadata } from 'next';
import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { LEGAL } from '@/lib/legal';

// Content kept 1:1 with the keel-mobile app (src/app/legal/privacy.tsx).
// REVIEW REQUIRED — drafted from the app's actual data flows, not reviewed by
// counsel. See src/lib/legal.ts for the placeholders that must be filled.

export const metadata: Metadata = {
  title: 'Privacy Policy | Keel',
  description:
    "How Keel collects, uses, and protects your personal data, including children's data, under India's Digital Personal Data Protection Act, 2023.",
};

const SECTIONS: LegalSection[] = [
  {
    heading: 'Who we are',
    body: [
      `${LEGAL.entity} ("Keel", "we") operates a platform connecting families with verified professionals for shadow teaching and special care sessions for children. We are the Data Fiduciary for the personal data described here, under India's Digital Personal Data Protection Act, 2023 ("DPDPA").`,
      'This policy explains what we collect, why, who we share it with, and the rights you can exercise. It covers both Parents and Caregivers.',
    ],
  },
  {
    heading: 'Data we collect',
    body: [
      'Account data: your name, email address, phone number, profile photo, and role (parent or caregiver).',
      "Children's data, provided by the parent: first and last name, date of birth, gender, allergies, special-needs status, diagnoses relevant to the sessions, and care instructions. Because our services centre on children who need learning or developmental support, we treat all of this as sensitive and process it only to deliver and safeguard care.",
      'Caregiver data: identity documents (Aadhaar, PAN), résumé, skills, teaching and special-needs qualifications, certifications, experience, availability, background-screening outcomes, and payout records — the earnings owed and released to you for completed sessions.',
      "Booking and payment data: addresses, session times, notes, prices, invoices, GST breakups, and payment status. Card details are handled entirely by our payment processor and never reach Keel's servers.",
      "Location data: your saved addresses, and a Caregiver's device location while a session is in progress, used for check-in verification and live session tracking. We do not collect location in the background or when the app is closed.",
      'Communications: in-app messages tied to a booking, support tickets, and reviews.',
      'Device data: a push notification token, used only to deliver alerts about your bookings.',
      'Crash reports: if the app crashes or hits an error, a technical report (stack trace, device model, OS version, app version) is sent to our error-monitoring provider, Sentry. These reports are scrubbed before sending — they contain no name, email, account identifier, location, or usage trail — and are used solely to fix defects.',
    ],
  },
  {
    heading: 'Why we process it',
    body: [
      'We process personal data to create and secure your account, verify Caregivers, match Parents with Caregivers, operate bookings and payments, calculate and release Caregiver payouts, deliver notifications, provide support, investigate safety incidents and disputes, and meet legal and tax obligations.',
      'Our legal basis is your consent, given at the point of collection, and — where applicable — the legitimate uses permitted under DPDPA s.7, such as complying with a legal obligation or responding to a medical emergency.',
    ],
  },
  {
    heading: "Children's data",
    body: [
      'Keel is used by adults to arrange shadow teaching and special care for children. Children do not hold accounts and do not use the app.',
      "Under DPDPA s.9, a child's personal data is processed only with the verifiable consent of a parent or lawful guardian. By adding a child to your family profile you confirm that you are that parent or guardian and consent to the processing described here.",
      "We do not use children's data for tracking, profiling, behavioural monitoring, or targeted advertising, and we never sell it. A child's health, diagnosis, and support information is disclosed only to the Caregiver assigned to that child's booking, and only for the duration of the engagement.",
      'You may view, correct, or delete a child\'s profile at any time from the My Family screen. Removing a profile hides it immediately; it is recoverable from "Recently removed" for 30 days and then permanently deleted.',
    ],
  },
  {
    heading: 'Who we share data with',
    body: [
      'We do not sell personal data and we do not use third-party advertising or analytics trackers in this app. We do not track how you use the app.',
      'We share the minimum necessary with:',
      [
        'Sentry — anonymised technical crash reports, as described under "Data we collect", so we can find and fix defects.',
        'Caregivers — the child and address details required to deliver a booking you made.',
        "Parents — a Caregiver's profile, qualifications, verification status, and reviews.",
        'Razorpay — to process payments, refunds, and Caregiver payouts. Razorpay is a PCI-DSS compliant processor and its own privacy terms apply.',
        'Google Maps Platform — an address string or coordinates, to convert between the two and to open directions. Sent without your name or account identifier.',
        'Apple and Google push services — a device token and the notification text.',
        'Email, SMS, and WhatsApp providers — to send booking and account notifications you have opted into.',
        'Background-verification partners — for Caregivers only, to run identity and criminal-record checks.',
        'Law enforcement, regulators, or courts — where we are legally required, or where disclosure is necessary to prevent serious harm to a child.',
      ],
    ],
  },
  {
    heading: 'Storage and security',
    body: [
      "Data is stored on servers in India. Authentication tokens are held in your device's hardware-backed secure storage (iOS Keychain / Android Keystore), never in general app storage. All traffic between the app and our servers is encrypted in transit with TLS, and the app refuses unencrypted connections.",
      "Access to children's data and identity documents is restricted to staff who need it, and is logged. We do not cache children's data, addresses, or phone numbers to your device's disk.",
      'If a personal data breach occurs, we will notify the Data Protection Board of India and affected users as required by DPDPA s.8(6).',
    ],
  },
  {
    heading: 'How long we keep it',
    body: [
      'We keep account and booking data for as long as your account is open, and afterwards only as long as needed for tax, accounting, safety, and dispute purposes — typically eight years for financial records, as required by Indian tax law.',
      'Caregiver identity documents are deleted once verification is complete and the outcome recorded. Session location traces are retained for 90 days and then deleted. Chat messages are retained for the life of the booking plus one year.',
      'When you ask us to delete your account, it is deactivated immediately and enters a 30-day retention window during which it is recoverable if you contact us — this guards against accidental or unauthorised deletion. At least 48 hours before the window ends we email you a reminder, as the DPDP Rules require. After 30 days we permanently anonymise your personal data so that it can no longer be attributed to you, retaining only the de-identified transaction records the law requires us to keep (typically eight years for financial records). Removed child profiles follow the same 30-day window and are then permanently deleted.',
    ],
  },
  {
    heading: 'Your rights',
    body: [
      'Under DPDPA you have the right to access a summary of your personal data and how it is processed, to correct or complete inaccurate data, to erase data no longer needed for the purpose it was collected, to nominate another person to exercise your rights if you die or become incapacitated, and to withdraw your consent at any time.',
      'You can exercise the first three directly in the app: "Download my data" and "Delete account" are on your profile screen, and profile, family, and address records are editable in place. Withdrawing consent for core processing means we can no longer provide the service, so it is equivalent to closing your account.',
      `For anything else, or to nominate someone, write to ${LEGAL.privacyEmail}. We respond within 30 days.`,
    ],
  },
  {
    heading: 'Grievance redressal',
    body: [
      `If you are not satisfied with how we have handled your data or your request, contact our Grievance Officer, ${LEGAL.grievanceOfficer.name}, at ${LEGAL.grievanceOfficer.email}. We acknowledge grievances within 48 hours and resolve them within 30 days, consistent with the Consumer Protection (E-Commerce) Rules, 2020 and DPDPA s.13.`,
      'If you remain dissatisfied you may complain to the Data Protection Board of India.',
    ],
  },
  {
    heading: 'Permissions we ask for',
    body: [
      'Location, only while you are using the app: to check a Caregiver in at a booking, to track a session in progress, and to find caregivers near you. Declining it means you must enter addresses manually.',
      'Camera and photo library: to set a profile picture and to upload verification documents.',
      'Notifications: to alert you about booking confirmations, arrivals, and payments.',
      'You can revoke any of these in your device settings at any time.',
    ],
  },
  {
    heading: 'Changes to this policy',
    body: [
      'We will notify you in the app before a material change takes effect, and update the version and effective date above.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalDocument
      title="Privacy Policy"
      intro="Our services are about children who need learning and developmental support, so some of the data we handle is sensitive and about children. We have tried to describe exactly what we collect and why, in plain language."
      sections={SECTIONS}
      contact={[
        { label: 'Privacy', email: LEGAL.privacyEmail },
        { label: 'Grievance Officer', email: LEGAL.grievanceOfficer.email },
      ]}
    />
  );
}
