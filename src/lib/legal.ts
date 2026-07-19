/**
 * Company identity and contact points referenced by the Terms of Service and
 * Privacy Policy pages, and by the DPDPA grievance-redressal disclosures.
 *
 * Kept in sync with the keel-mobile app (src/lib/legal.ts) so the hosted web
 * copies and the in-app screens state exactly the same thing.
 *
 * REVIEW REQUIRED: the documents in src/app/privacy and src/app/terms are
 * drafted from the app's actual data flows but have NOT yet been reviewed by
 * counsel. The registered-entity identity below is filled in; before release,
 * confirm the privacy@ / support@ inboxes are live (or repoint them), and note
 * that DPDPA 2023 s.13 requires the Grievance Officer to remain reachable.
 */
export const LEGAL = {
  /** Registered legal entity operating the Keel platform. */
  entity: 'KEEL CARE LLP',
  /** Registered office address, required on the GST invoice and in the policy. */
  registeredOffice:
    'C-60, 3rd Floor, Shivaji Park West, Punjabi Park, Shivaji Park (West Delhi), Punjabi Bagh Police Station, New Delhi, West Delhi - 110026, Delhi, India',
  /** DPDPA 2023 s.13 Grievance Officer. */
  grievanceOfficer: {
    name: 'Mannat Mitra',
    email: 'keelcarecon@gmail.com',
  },
  privacyEmail: 'privacy@keel.app',
  supportEmail: 'support@keel.app',

  /**
   * Canonical hosted copies. App Store Connect and the Play Console both
   * require a reachable URL; the in-app screens mirror these documents so they
   * remain readable offline and before sign-in.
   */
  termsUrl: 'https://keel.app/legal/terms',
  privacyUrl: 'https://keel.app/legal/privacy',

  /** Bump whenever the substance of either document changes. */
  effectiveDate: '17 July 2026',
  version: '1.2',
} as const;
