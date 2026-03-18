import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "browse": "Browse",
        "map": "Map",
        "municipal": "Municipal",
        "emergency": "Emergency",
        "about": "About",
        "report": "Report Issue",
        "login": "Login",
        "logout": "Logout"
      },
      "hero": {
        "title": "Empowering Communities for a",
        "titleAccent": "Safer Tunisia",
        "subtitle": "Report infrastructure issues, track resolutions, and collaborate with local authorities to build a better neighborhood together.",
        "ctaStart": "Report an Issue",
        "ctaBrowse": "Browse Reports"
      }
    }
  },
  fr: {
    translation: {
      "nav": {
        "home": "Accueil",
        "browse": "Parcourir",
        "map": "Carte",
        "municipal": "Municipal",
        "emergency": "Urgence",
        "about": "À propos",
        "report": "Signaler",
        "login": "Connexion",
        "logout": "Déconnexion"
      },
      "hero": {
        "title": "Autonomiser les communautés pour une",
        "titleAccent": "Tunisie plus sûre",
        "subtitle": "Signalez les problèmes d'infrastructure, suivez les résolutions et collaborez avec les autorités locales pour bâtir un meilleur quartier ensemble.",
        "ctaStart": "Signaler un problème",
        "ctaBrowse": "Parcourir les rapports"
      }
    }
  },
  ar: {
    translation: {
      "nav": {
        "home": "الرئيسية",
        "browse": "تصفح",
        "map": "الخريطة",
        "municipal": "البلدية",
        "emergency": "الطوارئ",
        "about": "حول",
        "report": "تبليغ",
        "login": "دخول",
        "logout": "خروج"
      },
      "hero": {
        "title": "تمكين المجتمعات من أجل",
        "titleAccent": "تونس أكثر أماناً",
        "subtitle": "بلغ عن مشاكل البنية التحتية، تتبع الحلول، وتعاون مع السلطات المحلية لبناء حي أفضل معاً.",
        "ctaStart": "بلغ عن مشكلة",
        "ctaBrowse": "تصفح البلاغات"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
