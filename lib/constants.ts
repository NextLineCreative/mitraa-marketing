
export const SITE = {
  url: 'https://mitraa.shop',
  brand: 'Mitraa',
  tagline: 'Talk to someone new.',
  description:
    'Mitraa is a social calling app that lets you have meaningful voice and video conversations with new people.',
  androidPackageId: 'com.mitraa.app',
};


export const LEGAL = {
  companyName: 'Mitraa Technologies Pvt. Ltd',                
  registeredAddress: '312, World Tech Park, Gurgaon, Haryana',
  jurisdictionCity: 'Gurugram',                   
  grievanceOfficerName: 'Kuldeep Sahani',   

  grievanceHours: 'Mon to Fri, 10:00 AM to 6:00 PM IST (excluding public holidays)',
};

export const EMAILS = {
  contact: 'hello@mitraa.shop',
  support: 'support@mitraa.shop',
  privacy: 'privacy@mitraa.shop',
  legal:   'legal@mitraa.shop',
  grievance: 'grievance@mitraa.shop',
};


export const API = {
  baseUrl:
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL
      : 'https://api.mitraa.shop',
};


export const RAZORPAY = {
  keyId:
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
      : '', 
};


export const COIN_PURCHASE_ENABLED = RAZORPAY.keyId.length > 0;
