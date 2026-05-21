// Single source of truth for site-wide constants.
// Edit values here, not in individual pages.

export const SITE = {
  url: 'https://mitraa.shop',
  brand: 'Mitraa',
  tagline: 'Talk to someone new.',
  description:
    'Mitraa is a social calling app that lets you have meaningful voice and video conversations with new people.',
  androidPackageId: 'com.mitraa.app',
};

// Replace these placeholders with the registered legal entity before going live.
// They render in legal docs and footer.
export const LEGAL = {
  companyName: '__COMPANY_NAME__',                 // TODO: e.g. "Mitraa Technologies Pvt. Ltd."
  registeredAddress: '312, World Tech Park, Gurgaon, Haryana',
  jurisdictionCity: 'Gurugram',                    // courts + arbitration seat
  grievanceOfficerName: '__GRIEVANCE_OFFICER__',   // TODO: must be a real person
  // Hours for grievance officer (IT Rules 2021 requires publishing these)
  grievanceHours: 'Mon to Fri, 10:00 AM to 6:00 PM IST (excluding public holidays)',
};

export const EMAILS = {
  contact: 'hello@mitraa.shop',
  support: 'support@mitraa.shop',
  privacy: 'privacy@mitraa.shop',
  legal:   'legal@mitraa.shop',
  grievance: 'grievance@mitraa.shop',
};

// Backend API base. Used by the future buy-coins flow.
// Same JWT the mobile app uses (issued by /api/auth/verify-otp).
export const API = {
  baseUrl:
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL
      : 'https://api.mitraa.shop',
};

// Razorpay key id for the web checkout. NEVER put the secret here.
export const RAZORPAY = {
  keyId:
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      : '', // Phase 9
};

// Convenience: detect whether the current build has the bare minimum
// to enable the live buy flow. Used by /coins to flip the page from
// "Coming soon" placeholders into real buttons.
export const COIN_PURCHASE_ENABLED = RAZORPAY.keyId.length > 0;
