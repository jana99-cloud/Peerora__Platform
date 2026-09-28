export type Language = 'en' | 'ar' | 'fr' | 'ur';

export const translations: Record<Language, Record<string, string>> = {
  ar: {
    feed: 'الرئيسية',
    post: 'نشر',
    groups: 'المجموعات',
    conversations: 'المحادثات',
    searchPlaceholder: 'ابحث عن منشورات، طلاب، مجموعات...',
    signUp: 'تسجيل الدخول',
  },
  en: {
    feed: 'Feed',
    post: 'Post',
    groups: 'Groups',
    conversations: 'Conversations',
    searchPlaceholder: 'Search posts, students, groups...',
    signUp: 'Sign Up',
  },
  fr: {
    feed: 'Fil d\'actualité',
    post: 'Publier',
    groups: 'Groupes',
    conversations: 'Conversations',
    searchPlaceholder: 'Rechercher des publications, étudiants...',
    signUp: 'S\'inscrire',
  },
  ur: {
    feed: 'فीड',
    post: 'پوست',
    groups: 'گروپس',
    conversations: 'گفتگو',
    searchPlaceholder: 'پوسٹس، طلباء، گروپس تلاش کریں...',
    signUp: 'سائن اپ',
  },
};