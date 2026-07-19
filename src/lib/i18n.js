import { useCallback } from 'react'
import { useTvStore } from '../store/tvStore'

/**
 * Lightweight i18n: UI chrome (nav, hero, common labels) in English,
 * Sinhala and Tamil. Channel/category names stay as-is.
 */

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
]

const STRINGS = {
  en: {
    home: 'Home',
    search: 'Search',
    myList: 'My List',
    settings: 'Settings',
    more: 'More',
    liveTvFree: 'Live TV · Free',
    heroTitle: 'Unlimited live TV.',
    heroSubtitle: 'One place. Zero cost.',
    play: 'Play',
    resume: 'Resume',
    browseAll: 'Browse All',
    continueWatching: 'Continue Watching',
    viewAll: 'View all',
    resultsFor: 'Results for',
    continueWatchingToast: 'Continue watching',
    language: 'Language',
    languageHint: 'UI language for menus and buttons.',
  },
  si: {
    home: 'මුල් පිටුව',
    search: 'සොයන්න',
    myList: 'මගේ ලැයිස්තුව',
    settings: 'සැකසුම්',
    more: 'තවත්',
    liveTvFree: 'සජීවී TV · නොමිලේ',
    heroTitle: 'අසීමිත සජීවී රූපවාහිනිය.',
    heroSubtitle: 'එක තැනකින්. නොමිලේ.',
    play: 'නරඹන්න',
    resume: 'දිගටම නරඹන්න',
    browseAll: 'සියල්ල බලන්න',
    continueWatching: 'දිගටම නරඹන්න',
    viewAll: 'සියල්ල',
    resultsFor: 'ප්‍රතිඵල',
    continueWatchingToast: 'දිගටම නරඹන්න',
    language: 'භාෂාව',
    languageHint: 'මෙනු සහ බොත්තම් සඳහා භාෂාව.',
  },
  ta: {
    home: 'முகப்பு',
    search: 'தேடல்',
    myList: 'என் பட்டியல்',
    settings: 'அமைப்புகள்',
    more: 'மேலும்',
    liveTvFree: 'நேரலை TV · இலவசம்',
    heroTitle: 'வரம்பற்ற நேரலை டிவி.',
    heroSubtitle: 'ஒரே இடம். இலவசம்.',
    play: 'பார்க்க',
    resume: 'தொடர்ந்து பார்க்க',
    browseAll: 'அனைத்தையும் பார்',
    continueWatching: 'தொடர்ந்து பார்க்க',
    viewAll: 'அனைத்தும்',
    resultsFor: 'முடிவுகள்',
    continueWatchingToast: 'தொடர்ந்து பார்க்க',
    language: 'மொழி',
    languageHint: 'மெனுக்கள் மற்றும் பொத்தான்களுக்கான மொழி.',
  },
}

/** Hook returning the translate function for the active language. */
export function useT() {
  const lang = useTvStore((state) => state.settings.language) || 'en'
  return useCallback((key) => STRINGS[lang]?.[key] ?? STRINGS.en[key] ?? key, [lang])
}
