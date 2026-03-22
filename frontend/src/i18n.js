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
        "logout": "Logout",
        "profile": "Profile",
        "admin": "Admin",
        "moderator": "Moderator"
      },
      "category": {
        "Roads": "Roads",
        "Lighting": "Lighting",
        "Sanitation": "Sanitation",
        "Water": "Water",
        "Other": "Other"
      },
      "browse": {
        "title": "Community Dashboard",
        "subtitle": "Stay informed about issues in your district. Upvote reports to increase their visibility to local authorities and track their resolution progress.",
        "filterCategory": "All Categories",
        "filterLocation": "All Tunisia",
        "refresh": "Refresh",
        "new": "NEW",
        "active": "ACTIVE",
        "solved": "SOLVED",
        "details": "Details",
        "noReports": "No reports found matching your filters.",
        "statusReported": "Reported",
        "statusActive": "Active",
        "statusSolved": "Solved",
        "share": "Share",
        "postComment": "Post Comment",
        "writeComment": "Write a comment...",
        "noComments": "No comments yet. Be the first to start the discussion!",
        "upvote": "Upvote",
        "upvoted": "Upvoted"
      },
      "report": {
        "title": "Report an Issue",
        "subtitle": "Help us improve Tunisia by reporting infrastructure or safety concerns in your area.",
        "step1": "What kind of issue are you reporting?",
        "step2": "Where is it located?",
        "stepPin": "Pin location on map",
        "detecting": "Detecting precise address...",
        "clickMap": "Click the map or drag the pin to set location",
        "useLocation": "Use My Location",
        "back": "Back",
        "next": "Next: Final Details",
        "step3": "Final Details",
        "issueTitle": "Issue Title",
        "issueDesc": "Detailed Description",
        "titlePlaceholder": "Briefly describe the problem (e.g. Large Pothole on main road)",
        "descPlaceholder": "Provide more details to help us identify the exact problem...",
        "submit": "Submit Official Report",
        "submitting": "Submitting Report...",
        "uploadError": "Failed to upload image. Please check your connection and try again.",
        "uploadConfigError": "Image upload is not configured correctly."
      },
      "admin": {
        "title": "User Administration",
        "subtitle": "Manage community roles and citizen permissions.",
        "totalCitizens": "Total Citizens",
        "moderators": "Moderators",
        "colInfo": "Citizen Info",
        "colContact": "Contact",
        "colRole": "Role",
        "colManage": "Management",
        "noUsers": "No users found in the system.",
        "citizen": "Citizen"
      },
      "mod": {
        "title": "Community Moderation",
        "subtitle": "Monitor and resolve community issues efficiently.",
        "totalIssues": "Total Issues",
        "pending": "Pending",
        "colIssue": "Issue Details",
        "colLoc": "Location",
        "colStatus": "Status",
        "colAction": "Actions",
        "noReports": "No reports in the system.",
        "delete": "Delete",
        "confirmDel": "Are you sure you want to delete this report permanently?"
      },
      "profile": {
        "title": "Activity Dashboard",
        "subtitle": "Manage your reports and track their progress.",
        "total": "Total Reports",
        "solved": "Solved Issues",
        "pending": "Pending Action",
        "noReportsTitle": "No reports submitted yet",
        "noReportsDesc": "Help us make Tunisia better! Report issues like potholes, broken lights, or sanitation problems in your area.",
        "submitFirst": "Submit My First Report",
        "verified": "Verified",
        "verifiedCit": "Verified Citizen",
        "email": "Email",
        "phone": "Phone",
        "location": "Location",
        "notProvided": "Not provided",
        "signOut": "Sign Out",
        "edit": "Edit Profile"
      },
      "hero": {
        "title": "Empowering Communities for a",
        "titleAccent": "Safer Tunisia",
        "subtitle": "Report infrastructure issues, track resolutions, and collaborate with local authorities to build a better neighborhood together.",
        "ctaStart": "Report an Issue",
        "ctaBrowse": "Browse Reports"
      },
      "common": {
        "save": "Save",
        "cancel": "Cancel",
        "confirmDelete": "Are you sure?"
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
        "logout": "Déconnexion",
        "profile": "Profil",
        "admin": "Admin",
        "moderator": "Modérateur"
      },
      "category": {
        "Roads": "Routes",
        "Lighting": "Éclairage",
        "Sanitation": "Ass.",
        "Water": "Eau",
        "Other": "Autre"
      },
      "browse": {
        "title": "Tableau de Bord",
        "subtitle": "Restez informé des problèmes dans votre quartier. Votez pour les signalements pour augmenter leur visibilité auprès des autorités.",
        "filterCategory": "Toutes Catégories",
        "filterLocation": "Toute la Tunisie",
        "refresh": "Actualiser",
        "new": "NOUVEAU",
        "active": "ACTIF",
        "solved": "RÉSOLU",
        "details": "Détails",
        "noReports": "Aucun signalement ne correspond à vos filtres.",
        "statusReported": "Signalé",
        "statusActive": "Actif",
        "statusSolved": "Résolu",
        "share": "Partager",
        "postComment": "Publier",
        "writeComment": "Écrivez un commentaire...",
        "noComments": "Aucun commentaire pour le moment. Soyez le premier!",
        "upvote": "Voter",
        "upvoted": "Voté"
      },
      "report": {
        "title": "Signaler un Problème",
        "subtitle": "Aidez-nous à améliorer la Tunisie en signalant des problèmes d'infrastructure ou de sécurité.",
        "step1": "Quel type de problème signalez-vous?",
        "step2": "Où est-il situé?",
        "stepPin": "Épingler sur la carte",
        "detecting": "Détection de l'adresse...",
        "clickMap": "Cliquez sur la carte ou déplacez l'épingle",
        "useLocation": "Ma Position",
        "back": "Retour",
        "next": "Suivant: Détails",
        "step3": "Détails Finaux",
        "issueTitle": "Titre du problème",
        "issueDesc": "Description Détaillée",
        "titlePlaceholder": "Décrivez brièvement (ex: Grand nid de poule)",
        "descPlaceholder": "Fournissez plus de détails...",
        "submit": "Soumettre le signalement",
        "submitting": "Envoi en cours...",
        "uploadError": "Échec du téléchargement de l'image. Veuillez vérifier votre connexion.",
        "uploadConfigError": "Le téléchargement d'images n'est pas configuré correctement."
      },
      "admin": {
        "title": "Administration",
        "subtitle": "Gérer les rôles de la communauté et les permissions.",
        "totalCitizens": "Total Citoyens",
        "moderators": "Modérateurs",
        "colInfo": "Info Citoyen",
        "colContact": "Contact",
        "colRole": "Rôle",
        "colManage": "Gestion",
        "noUsers": "Aucun utilisateur trouvé.",
        "citizen": "Citoyen"
      },
      "mod": {
        "title": "Modération",
        "subtitle": "Surveiller et résoudre les problèmes efficacement.",
        "totalIssues": "Total Problèmes",
        "pending": "En Attente",
        "colIssue": "Détails du problème",
        "colLoc": "Lieu",
        "colStatus": "Statut",
        "colAction": "Actions",
        "noReports": "Aucun signalement.",
        "delete": "Supprimer",
        "confirmDel": "Voulez-vous vraiment supprimer ce signalement ?"
      },
      "profile": {
        "title": "Tableau de Bord",
        "subtitle": "Gérez vos signalements et suivez leur avancement.",
        "total": "Total Signalements",
        "solved": "Problèmes Résolus",
        "pending": "En Attente",
        "noReportsTitle": "Aucun signalement",
        "noReportsDesc": "Aidez-nous à améliorer la Tunisie ! Signalez les nids de poule ou les fuites d'eau dans votre zone.",
        "submitFirst": "Soumettre mon premier signalement",
        "verified": "Vérifié",
        "verifiedCit": "Citoyen Vérifié",
        "email": "Email",
        "phone": "Téléphone",
        "location": "Lieu",
        "notProvided": "Non fourni",
        "signOut": "Déconnexion",
        "edit": "Modifier le profil"
      },
      "hero": {
        "title": "Autonomiser les communautés pour une",
        "titleAccent": "Tunisie plus sûre",
        "subtitle": "Signalez les problèmes d'infrastructure, suivez les résolutions et collaborez avec les autorités locales pour bâtir un meilleur quartier ensemble.",
        "ctaStart": "Signaler un problème",
        "ctaBrowse": "Parcourir les rapports"
      },
      "common": {
        "save": "Enregistrer",
        "cancel": "Annuler",
        "confirmDelete": "Êtes-vous sûr ?"
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
        "logout": "خروج",
        "profile": "حسابي",
        "admin": "الإدارة",
        "moderator": "مراقب"
      },
      "category": {
        "Roads": "طرق",
        "Lighting": "إنارة",
        "Sanitation": "صرف صحي",
        "Water": "مياه",
        "Other": "أخرى"
      },
      "browse": {
        "title": "لوحة متابعة المجتمع",
        "subtitle": "ابق على اطلاع بالمشاكل في منطقتك. صوّت للبلاغات لزيادة رؤيتها لدى السلطات المحلية وتابع تقدم حلها.",
        "filterCategory": "جميع الفئات",
        "filterLocation": "كل تونس",
        "refresh": "تحديث",
        "new": "جديد",
        "active": "نشط",
        "solved": "تم الحل",
        "details": "التفاصيل",
        "noReports": "لم يتم العثور على بلاغات تطابق تصفيتك.",
        "statusReported": "تم التبليغ",
        "statusActive": "نشط",
        "statusSolved": "تم الحل",
        "share": "مشاركة",
        "postComment": "نشر",
        "writeComment": "اكتب تعليقاً...",
        "noComments": "لا توجد تعليقات بعد. كن أول من يبدأ النقاش!",
        "upvote": "تصويت",
        "upvoted": "تم التصويت"
      },
      "report": {
        "title": "الإبلاغ عن مشكلة",
        "subtitle": "ساعدنا في تحسين تونس من خلال الإبلاغ عن مشاكل البنية التحتية أو السلامة في منطقتك.",
        "step1": "ما نوع المشكلة التي تبلغ عنها؟",
        "step2": "أين تقع؟",
        "stepPin": "تحديد الموقع على الخريطة",
        "detecting": "جاري تحديد العنوان بدقة...",
        "clickMap": "انقر على الخريطة أو اسحب الدبوس",
        "useLocation": "إستخدام موقعي",
        "back": "العودة",
        "next": "التالي: التفاصيل",
        "step3": "التفاصيل النهائية",
        "issueTitle": "عنوان المشكلة",
        "issueDesc": "الوصف التفصيلي",
        "titlePlaceholder": "صف المشكلة باختصار (مثال: حفرة كبيرة...)",
        "descPlaceholder": "قدم المزيد من التفاصيل...",
        "submit": "إرسال البلاغ الرسمي",
        "submitting": "جاري الإرسال...",
        "uploadError": "فشل تحميل الصورة. يرجى التحقق من الاتصال وإعادة المحاولة.",
        "uploadConfigError": "لم يتم تكوين تحميل الصور بشكل صحيح."
      },
      "admin": {
        "title": "إدارة المستخدمين",
        "subtitle": "إدارة أدوار المجتمع وصلاحيات المواطنين.",
        "totalCitizens": "إجمالي المواطنين",
        "moderators": "المشرفين",
        "colInfo": "معلومات المواطن",
        "colContact": "جهة الاتصال",
        "colRole": "الدور",
        "colManage": "الإدارة",
        "noUsers": "لم يتم العثور على مستخدمين.",
        "citizen": "مواطن"
      },
      "mod": {
        "title": "إشراف المجتمع",
        "subtitle": "مراقبة وحل مشاكل المجتمع بكفاءة.",
        "totalIssues": "إجمالي المشاكل",
        "pending": "قيد الانتظار",
        "colIssue": "تفاصيل المشكلة",
        "colLoc": "الموقع",
        "colStatus": "الحالة",
        "colAction": "الإجراءات",
        "noReports": "لا توجد بلاغات.",
        "delete": "حذف",
        "confirmDel": "هل أنت متأكد من رغبتك في حذف هذا البلاغ؟"
      },
      "profile": {
        "title": "لوحة النشاط",
        "subtitle": "إدارة بلاغاتك ومتابعة تقدمها.",
        "total": "إجمالي البلاغات",
        "solved": "المشاكل المحلولة",
        "pending": "قيد الانتظار",
        "noReportsTitle": "لا توجد بلاغات بعد",
        "noReportsDesc": "ساعدنا في جعل تونس أفضل! أبلغ عن المشاكل في منطقتك.",
        "submitFirst": "تقديم أول بلاغ",
        "verified": "موثق",
        "verifiedCit": "مواطن موثق",
        "email": "البريد الإلكتروني",
        "phone": "الهاتف",
        "location": "الموقع",
        "notProvided": "غير متوفر",
        "signOut": "تسجيل خروج",
        "edit": "تعديل الملف الشخصي"
      },
      "hero": {
        "title": "تمكين المجتمعات من أجل",
        "titleAccent": "تونس أكثر أماناً",
        "subtitle": "بلغ عن مشاكل البنية التحتية، تتبع الحلول، وتعاون مع السلطات المحلية لبناء حي أفضل معاً.",
        "ctaStart": "بلغ عن مشكلة",
        "ctaBrowse": "تصفح البلاغات"
      },
      "common": {
        "save": "حفظ",
        "cancel": "إلغاء",
        "confirmDelete": "هل أنت متأكد؟"
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
