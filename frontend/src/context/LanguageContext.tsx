import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export type SupportedLanguage = 'en' | 'te' | 'hi';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];

export const NAV_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    frontPage: 'Front Page',
    home: 'Home',
    latest: 'Latest Wire',
    trending: 'Trending',
    videos: 'Videos',
    saved: 'Saved Articles',
    liked: 'Liked Articles',
    preferences: 'Reading Preferences',
    admin: 'Admin Console',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    register: 'Register',
    profile: 'My Profile',
    globalEdition: 'Global Edition',
    search: 'Search'
  },
  te: {
    frontPage: 'హోమ్',
    home: 'హోమ్',
    latest: 'తాజా వార్తలు',
    trending: 'ట్రెండింగ్',
    videos: 'వీడియోలు',
    saved: 'భద్రపరిచిన కథనాలు',
    liked: 'ఇష్టపడిన కథనాలు',
    preferences: 'పఠన ప్రాధాన్యతలు',
    admin: 'అడ్మిన్ కన్సోల్',
    signIn: 'సైన్ ఇన్',
    signOut: 'లాగ్ అవుట్',
    register: 'రిజిస్టర్',
    profile: 'నా ప్రొఫైల్',
    globalEdition: 'గ్లోబల్ ఎడిషన్',
    search: 'శోధించండి'
  },
  hi: {
    frontPage: 'होम',
    home: 'होम',
    latest: 'ताज़ा खबरें',
    trending: 'ट्रेंडिंग',
    videos: 'वीडियो',
    saved: 'सहेजे गए लेख',
    liked: 'पसंद किए गए लेख',
    preferences: 'पठन प्राथमिकताएं',
    admin: 'एडमिन कंसोल',
    signIn: 'साइन इन',
    signOut: 'लॉग आउट',
    register: 'रजिस्टर',
    profile: 'मेरी प्रोफाइल',
    globalEdition: 'ग्लोबल संस्करण',
    search: 'खोजें'
  }
};

export const CATEGORY_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  national: { en: 'National', te: 'జాతీయం', hi: 'राष्ट्रीय' },
  international: { en: 'International', te: 'అంతర్జాతీయం', hi: 'अंतर्राष्ट्रीय' },
  politics: { en: 'Politics', te: 'రాజకీయాలు', hi: 'राजनीति' },
  business: { en: 'Business', te: 'వ్యాపారం', hi: 'व्यापार' },
  technology: { en: 'Technology', te: 'టెక్నాలజీ', hi: 'टेक्नोलॉजी' },
  sports: { en: 'Sports', te: 'క్రీడలు', hi: 'खेल' },
  entertainment: { en: 'Entertainment', te: 'వినోదం', hi: 'मनोरंजन' },
  regional: { en: 'Regional', te: 'ప్రాంతీయం', hi: 'क्षेत्रीय' },
  'andhra-pradesh': { en: 'Andhra Pradesh', te: 'ఆంధ్రప్రదేశ్', hi: 'आंध्र प्रदेश' },
  telangana: { en: 'Telangana', te: 'తెలంగాణ', hi: 'तेलंगाना' }
};

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (code: SupportedLanguage) => void;
  availableLanguages: LanguageInfo[];
  t: (key: string) => string;
  getCategoryName: (slug: string, defaultName: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Session-explicit language priority
  const [explicitLanguage, setExplicitLanguageState] = useState<SupportedLanguage | null>(() => {
    try {
      const stored = sessionStorage.getItem('reader_language');
      if (stored === 'en' || stored === 'te' || stored === 'hi') {
        return stored;
      }
    } catch {
      // sessionStorage unavailable
    }
    return null;
  });

  const setLanguage = (code: SupportedLanguage) => {
    setExplicitLanguageState(code);
    try {
      sessionStorage.setItem('reader_language', code);
    } catch {
      // Ignore
    }
  };

  // Determine current active language based on priority rules:
  // 1. Explicit navbar/session selection
  // 2. User profile preferred language (if logged in)
  // 3. English fallback ('en')
  let currentLanguage: SupportedLanguage = 'en';
  if (explicitLanguage) {
    currentLanguage = explicitLanguage;
  } else if (user?.preferredLanguage) {
    const pref = user.preferredLanguage.toLowerCase().trim();
    if (pref === 'te' || pref === 'telugu') currentLanguage = 'te';
    else if (pref === 'hi' || pref === 'hindi') currentLanguage = 'hi';
    else currentLanguage = 'en';
  }

  const t = (key: string): string => {
    const langDict = NAV_TRANSLATIONS[currentLanguage] || NAV_TRANSLATIONS.en;
    return langDict[key] || NAV_TRANSLATIONS.en[key] || key;
  };

  const getCategoryName = (slug: string, defaultName: string): string => {
    const normalizedSlug = (slug || '').toLowerCase().trim();
    const catDict = CATEGORY_TRANSLATIONS[normalizedSlug];
    if (catDict && catDict[currentLanguage]) {
      return catDict[currentLanguage];
    }
    return defaultName;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        availableLanguages: SUPPORTED_LANGUAGES,
        t,
        getCategoryName
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
