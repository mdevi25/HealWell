import type { Language } from "@/lib/localStorage"

const en = {
  // ── Navigation ──────────────────────────────────────────
  nav: {
    home: "Home",
    checkin: "Check-In",
    coach: "Coach",
    story: "Story",
    trends: "Trends",
  },

  // ── Language toggle ─────────────────────────────────────
  languages: {
    en: "🇺🇸 English",
    es: "🇪🇸 Español",
    hi: "🇮🇳 हिन्दी",
    gu: "🇮🇳 ગુજરાતી",
  },

  // ── Home page ───────────────────────────────────────────
  home: {
    greeting: "Welcome back",
    tagline: "Let's help you recover from today's shift.",
    startCheckin: "Start Today's Check-In",
    checkinDone: "You've checked in today",
    viewCoach: "See Your Recovery Plan",
    score: "Recovery Score",
    risk: {
      low: "Low",
      moderate: "Moderate",
      high: "High",
    },
    noCheckin: "No check-in yet today.",
  },

  // ── Check-In page ────────────────────────────────────────
  checkin: {
    title: "Today's Check-In",
    hoursWorked: "How many hours did you work today?",
    sleepHours: "How many hours did you sleep last night?",
    energy: "How is your energy right now?",
    energyHint: "1 = exhausted, 10 = energised",
    wornOut: "How worn out do you feel?",
    wornOutHint: "1 = fine, 10 = completely drained",
    movements: "Where does your body need attention?",
    submit: "Save Check-In",
    saved: "Check-in saved!",
    disclaimer:
      "Your score reflects today's shift load — not a medical assessment.",
  },

  // ── Movement keys ────────────────────────────────────────
  movements: {
    feet: "Feet",
    legs: "Legs",
    back: "Back",
    wrists: "Wrists",
    shoulders: "Shoulders",
    breathing: "Breathing",
  },

  // ── Coach page ───────────────────────────────────────────
  coach: {
    title: "Your Recovery Plan",
    hydration: (hours: number, extra: number) =>
      `You worked ${hours} hours today — try to get ${extra} more glass${extra === 1 ? "" : "es"} of water in before you sleep.`,
    baseHydration: "Aim for 6 glasses of water today.",
    movementDisclaimer:
      "This is a gentle blood-flow reset, not medical treatment. If anything feels sharp or wrong, stop.",
    noCheckin: "Complete today's check-in to see your recovery plan.",
    goCheckin: "Go to Check-In",
    feedbackPrompt: "Did this help?",
    feedbackThanks: "Thanks ✓",
    proTeaser: "Unlock all 6 recovery movements with HealWell Pro.",
    unlockPro: "Unlock with HealWell Pro",
  },

  // ── Story page ───────────────────────────────────────────
  story: {
    title: "Your Shift Story",
    mood: "How would you describe your mood right now?",
    bodyArea: "Which part of your body feels it most?",
    challenge: "What was the hardest moment of your shift?",
    positiveMoment: "What was one good moment from today?",
    generate: "Generate My Story",
    generating: "Writing your story...",
    disclaimer:
      "General wellness support based on what you shared, not medical advice.",
    noCheckin: "Complete today's check-in first to unlock your Shift Story.",
    goCheckin: "Go to Check-In",
    feedbackPrompt: "Did this help?",
    feedbackThanks: "Thanks ✓",
    error:
      "We couldn't generate your story right now. Please try again in a moment.",
    proTeaser: "Get your full story with emotional themes and wellness patterns.",
    unlockPro: "Unlock with HealWell Pro",
    tinyAction: "One small thing you can do right now:",
  },

  // ── Trends page ──────────────────────────────────────────
  trends: {
    title: "Your Trends",
    recoveryScore: "Recovery Score",
    energy: "Energy",
    sleep: "Sleep",
    noData: "No check-ins yet. Start checking in daily to see your trends.",
    goCheckin: "Go to Check-In",
    proTeaser: "See your full 7-day pattern and emotional themes with Pro.",
    unlockPro: "Unlock with HealWell Pro",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },

  // ── Admin page ───────────────────────────────────────────
  admin: {
    title: "HealWell Admin",
    password: "Admin Password",
    login: "Login",
    wrongPassword: "Incorrect password.",
    totalSubscribers: "Total Subscribers",
    activeUsers: "Active Users (7 days)",
    featureUsage: "Feature Usage",
    feedback: "Feedback",
    thumbsUp: "👍",
    thumbsDown: "👎",
    positive: "% Positive",
    free: "Free",
    pro: "Pro",
  },

  // ── Pro gate ─────────────────────────────────────────────
  pro: {
    message: "Unlock with HealWell Pro",
    price: "$3.99 / month",
    cta: "Learn More",
  },

  // ── Footer ───────────────────────────────────────────────
  footer:
    "© 2026 HealWell. All rights reserved. · General wellness support only, not medical advice.",
}

// ── Spanish ──────────────────────────────────────────────────────────────────
const es: typeof en = {
  nav: {
    home: "Inicio",
    checkin: "Registro",
    coach: "Coach",
    story: "Historia",
    trends: "Tendencias",
  },
  languages: {
    en: "🇺🇸 English",
    es: "🇪🇸 Español",
    hi: "🇮🇳 हिन्दी",
    gu: "🇮🇳 ગુજરાતી",
  },
  home: {
    greeting: "Bienvenido de nuevo",
    tagline: "Vamos a ayudarte a recuperarte del turno de hoy.",
    startCheckin: "Comenzar el Registro de Hoy",
    checkinDone: "Ya registraste hoy",
    viewCoach: "Ver tu Plan de Recuperación",
    score: "Puntuación de Recuperación",
    risk: { low: "Baja", moderate: "Moderada", high: "Alta" },
    noCheckin: "Sin registro hoy todavía.",
  },
  checkin: {
    title: "Registro de Hoy",
    hoursWorked: "¿Cuántas horas trabajaste hoy?",
    sleepHours: "¿Cuántas horas dormiste anoche?",
    energy: "¿Cómo está tu energía ahora mismo?",
    energyHint: "1 = agotado, 10 = lleno de energía",
    wornOut: "¿Qué tan cansado te sientes?",
    wornOutHint: "1 = bien, 10 = completamente agotado",
    movements: "¿Qué parte de tu cuerpo necesita atención?",
    submit: "Guardar Registro",
    saved: "¡Registro guardado!",
    disclaimer:
      "Tu puntuación refleja la carga del turno de hoy, no una evaluación médica.",
  },
  movements: {
    feet: "Pies",
    legs: "Piernas",
    back: "Espalda",
    wrists: "Muñecas",
    shoulders: "Hombros",
    breathing: "Respiración",
  },
  coach: {
    title: "Tu Plan de Recuperación",
    hydration: (hours: number, extra: number) =>
      `Trabajaste ${hours} horas hoy — intenta tomar ${extra} vaso${extra === 1 ? "" : "s"} más de agua antes de dormir.`,
    baseHydration: "Intenta tomar 6 vasos de agua hoy.",
    movementDisclaimer:
      "Este es un reinicio suave del flujo sanguíneo, no un tratamiento médico. Si algo se siente agudo o incómodo, detente.",
    noCheckin: "Completa el registro de hoy para ver tu plan de recuperación.",
    goCheckin: "Ir al Registro",
    feedbackPrompt: "¿Te ayudó esto?",
    feedbackThanks: "Gracias ✓",
    proTeaser: "Desbloquea los 6 movimientos de recuperación con HealWell Pro.",
    unlockPro: "Desbloquear con HealWell Pro",
  },
  story: {
    title: "Tu Historia del Turno",
    mood: "¿Cómo describirías tu estado de ánimo ahora mismo?",
    bodyArea: "¿Qué parte de tu cuerpo lo siente más?",
    challenge: "¿Cuál fue el momento más difícil de tu turno?",
    positiveMoment: "¿Cuál fue un buen momento del día?",
    generate: "Generar Mi Historia",
    generating: "Escribiendo tu historia...",
    disclaimer:
      "Apoyo general de bienestar basado en lo que compartiste, no consejo médico.",
    noCheckin:
      "Completa el registro de hoy primero para desbloquear tu Historia del Turno.",
    goCheckin: "Ir al Registro",
    feedbackPrompt: "¿Te ayudó esto?",
    feedbackThanks: "Gracias ✓",
    error:
      "No pudimos generar tu historia en este momento. Por favor intenta de nuevo.",
    proTeaser:
      "Obtén tu historia completa con temas emocionales y patrones de bienestar.",
    unlockPro: "Desbloquear con HealWell Pro",
    tinyAction: "Una pequeña cosa que puedes hacer ahora mismo:",
  },
  trends: {
    title: "Tus Tendencias",
    recoveryScore: "Puntuación de Recuperación",
    energy: "Energía",
    sleep: "Sueño",
    noData:
      "Aún no hay registros. Comienza a registrarte diariamente para ver tus tendencias.",
    goCheckin: "Ir al Registro",
    proTeaser: "Ve tu patrón completo de 7 días y temas emocionales con Pro.",
    unlockPro: "Desbloquear con HealWell Pro",
    days: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  },
  admin: {
    title: "Admin HealWell",
    password: "Contraseña de Admin",
    login: "Entrar",
    wrongPassword: "Contraseña incorrecta.",
    totalSubscribers: "Total de Suscriptores",
    activeUsers: "Usuarios Activos (7 días)",
    featureUsage: "Uso de Funciones",
    feedback: "Retroalimentación",
    thumbsUp: "👍",
    thumbsDown: "👎",
    positive: "% Positivo",
    free: "Gratis",
    pro: "Pro",
  },
  pro: {
    message: "Desbloquear con HealWell Pro",
    price: "$3.99 / mes",
    cta: "Saber Más",
  },
  footer:
    "© 2026 HealWell. Todos los derechos reservados. · Solo apoyo general de bienestar, no consejo médico.",
}

// ── Hindi ────────────────────────────────────────────────────────────────────
const hi: typeof en = {
  nav: {
    home: "होम",
    checkin: "चेक-इन",
    coach: "कोच",
    story: "कहानी",
    trends: "ट्रेंड्स",
  },
  languages: {
    en: "🇺🇸 English",
    es: "🇪🇸 Español",
    hi: "🇮🇳 हिन्दी",
    gu: "🇮🇳 ગુજરાતી",
  },
  home: {
    greeting: "वापस स्वागत है",
    tagline: "आज की शिफ्ट से उबरने में आपकी मदद करते हैं।",
    startCheckin: "आज का चेक-इन शुरू करें",
    checkinDone: "आपने आज चेक-इन कर लिया है",
    viewCoach: "अपना रिकवरी प्लान देखें",
    score: "रिकवरी स्कोर",
    risk: { low: "कम", moderate: "मध्यम", high: "अधिक" },
    noCheckin: "आज अभी तक कोई चेक-इन नहीं।",
  },
  checkin: {
    title: "आज का चेक-इन",
    hoursWorked: "आपने आज कितने घंटे काम किया?",
    sleepHours: "कल रात आपने कितने घंटे सोए?",
    energy: "अभी आपकी ऊर्जा कैसी है?",
    energyHint: "1 = थका हुआ, 10 = ऊर्जावान",
    wornOut: "आप कितना थका हुआ महसूस कर रहे हैं?",
    wornOutHint: "1 = ठीक, 10 = पूरी तरह थका हुआ",
    movements: "आपके शरीर के किस हिस्से को ध्यान चाहिए?",
    submit: "चेक-इन सेव करें",
    saved: "चेक-इन सेव हो गया!",
    disclaimer:
      "आपका स्कोर आज की शिफ्ट के भार को दर्शाता है — कोई चिकित्सा मूल्यांकन नहीं।",
  },
  movements: {
    feet: "पैर",
    legs: "टांगें",
    back: "पीठ",
    wrists: "कलाइयां",
    shoulders: "कंधे",
    breathing: "सांस",
  },
  coach: {
    title: "आपका रिकवरी प्लान",
    hydration: (hours: number, extra: number) =>
      `आपने आज ${hours} घंटे काम किया — सोने से पहले ${extra} और गिलास पानी पिएं।`,
    baseHydration: "आज 6 गिलास पानी पीने का लक्ष्य रखें।",
    movementDisclaimer:
      "यह एक सौम्य रक्त प्रवाह रीसेट है, चिकित्सा उपचार नहीं। अगर कुछ तेज़ या गलत लगे, रुकें।",
    noCheckin: "अपना रिकवरी प्लान देखने के लिए आज का चेक-इन पूरा करें।",
    goCheckin: "चेक-इन पर जाएं",
    feedbackPrompt: "क्या इससे मदद मिली?",
    feedbackThanks: "धन्यवाद ✓",
    proTeaser: "HealWell Pro के साथ सभी 6 रिकवरी मूवमेंट अनलॉक करें।",
    unlockPro: "HealWell Pro के साथ अनलॉक करें",
  },
  story: {
    title: "आपकी शिफ्ट की कहानी",
    mood: "अभी आप अपने मूड को कैसे बताएंगे?",
    bodyArea: "आपके शरीर का कौन सा हिस्सा सबसे ज़्यादा महसूस कर रहा है?",
    challenge: "आपकी शिफ्ट का सबसे मुश्किल पल क्या था?",
    positiveMoment: "आज का एक अच्छा पल क्या था?",
    generate: "मेरी कहानी बनाएं",
    generating: "आपकी कहानी लिखी जा रही है...",
    disclaimer:
      "आपने जो साझा किया उसके आधार पर सामान्य वेलनेस सहायता, चिकित्सा सलाह नहीं।",
    noCheckin:
      "अपनी शिफ्ट की कहानी अनलॉक करने के लिए पहले आज का चेक-इन करें।",
    goCheckin: "चेक-इन पर जाएं",
    feedbackPrompt: "क्या इससे मदद मिली?",
    feedbackThanks: "धन्यवाद ✓",
    error:
      "अभी आपकी कहानी नहीं बना सके। कृपया एक पल बाद फिर कोशिश करें।",
    proTeaser:
      "भावनात्मक थीम और वेलनेस पैटर्न के साथ अपनी पूरी कहानी पाएं।",
    unlockPro: "HealWell Pro के साथ अनलॉक करें",
    tinyAction: "एक छोटी चीज़ जो आप अभी कर सकते हैं:",
  },
  trends: {
    title: "आपके ट्रेंड्स",
    recoveryScore: "रिकवरी स्कोर",
    energy: "ऊर्जा",
    sleep: "नींद",
    noData:
      "अभी तक कोई चेक-इन नहीं। अपने ट्रेंड्स देखने के लिए रोज़ चेक-इन करना शुरू करें।",
    goCheckin: "चेक-इन पर जाएं",
    proTeaser: "Pro के साथ अपना पूरा 7-दिन का पैटर्न और भावनात्मक थीम देखें।",
    unlockPro: "HealWell Pro के साथ अनलॉक करें",
    days: ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"],
  },
  admin: {
    title: "HealWell एडमिन",
    password: "एडमिन पासवर्ड",
    login: "लॉगिन",
    wrongPassword: "गलत पासवर्ड।",
    totalSubscribers: "कुल सब्सक्राइबर",
    activeUsers: "सक्रिय उपयोगकर्ता (7 दिन)",
    featureUsage: "फीचर उपयोग",
    feedback: "फीडबैक",
    thumbsUp: "👍",
    thumbsDown: "👎",
    positive: "% सकारात्मक",
    free: "मुफ्त",
    pro: "प्रो",
  },
  pro: {
    message: "HealWell Pro के साथ अनलॉक करें",
    price: "$3.99 / माह",
    cta: "अधिक जानें",
  },
  footer:
    "© 2026 HealWell. सर्वाधिकार सुरक्षित। · केवल सामान्य वेलनेस सहायता, चिकित्सा सलाह नहीं।",
}

// ── Gujarati ─────────────────────────────────────────────────────────────────
const gu: typeof en = {
  nav: {
    home: "હોમ",
    checkin: "ચેક-ઇન",
    coach: "કોચ",
    story: "વાર્તા",
    trends: "ટ્રેન્ડ્સ",
  },
  languages: {
    en: "🇺🇸 English",
    es: "🇪🇸 Español",
    hi: "🇮🇳 हिन्दी",
    gu: "🇮🇳 ગુજરાતી",
  },
  home: {
    greeting: "પાછા સ્વાગત છે",
    tagline: "આજની શિફ્ટમાંથી સ્વસ્થ થવામાં મદદ કરીએ.",
    startCheckin: "આજનો ચેક-ઇન શરૂ કરો",
    checkinDone: "તમે આજે ચેક-ઇન કર્યું છે",
    viewCoach: "તમારી રિકવરી પ્લાન જુઓ",
    score: "રિકવરી સ્કોર",
    risk: { low: "ઓછું", moderate: "મધ્યમ", high: "વધુ" },
    noCheckin: "આજે હજી ચેક-ઇન નથી.",
  },
  checkin: {
    title: "આજનો ચેક-ઇન",
    hoursWorked: "તમે આજે કેટલા કલાક કામ કર્યું?",
    sleepHours: "ગઈ રાત તમે કેટલા કલાક સૂઈ ગયા?",
    energy: "અત્યારે તમારી ઊર્જા કેવી છે?",
    energyHint: "1 = થાકેલ, 10 = ઊર્જાવાન",
    wornOut: "તમે કેટલા થાકેલ અનુભવો છો?",
    wornOutHint: "1 = ઠીક, 10 = સંપૂર્ણ થાકેલ",
    movements: "તમારા શરીરના કયા ભાગને ધ્યાન જોઈએ?",
    submit: "ચેક-ઇન સેવ કરો",
    saved: "ચેક-ઇન સેવ થઈ ગયું!",
    disclaimer:
      "તમારો સ્કોર આજની શિફ્ટનો ભાર દર્શાવે છે — તબીબી મૂલ્યાંકન નહીં.",
  },
  movements: {
    feet: "પગ",
    legs: "પગની પિંડી",
    back: "પીઠ",
    wrists: "કાંડા",
    shoulders: "ખભા",
    breathing: "શ્વાસ",
  },
  coach: {
    title: "તમારી રિકવરી પ્લાન",
    hydration: (hours: number, extra: number) =>
      `તમે આજે ${hours} કલાક કામ કર્યું — સૂતા પહેલાં ${extra} વધુ ગ્લાસ પાણી પીઓ.`,
    baseHydration: "આજે 6 ગ્લાસ પાણી પીવાનો લક્ષ્ય રાખો.",
    movementDisclaimer:
      "આ એક નમ્ર રક્ત પ્રવાહ રીસેટ છે, તબીબી સારવાર નહીં. જો કંઈ તીક્ષ્ણ અથવા ખોટું લાગે, તો રોકો.",
    noCheckin: "તમારી રિકવરી પ્લાન જોવા માટે આજનો ચેક-ઇન પૂર્ણ કરો.",
    goCheckin: "ચેક-ઇન પર જાઓ",
    feedbackPrompt: "શું આનાથી મદદ મળી?",
    feedbackThanks: "આભાર ✓",
    proTeaser: "HealWell Pro સાથે બધી 6 રિકવરી મૂવમેન્ટ અનલૉક કરો.",
    unlockPro: "HealWell Pro સાથે અનલૉક કરો",
  },
  story: {
    title: "તમારી શિફ્ટ વાર્તા",
    mood: "અત્યારે તમારો મૂડ કેવો છે?",
    bodyArea: "તમારા શરીરનો કયો ભાગ સૌથી વધુ અનુભવ કરે છે?",
    challenge: "તમારી શિફ્ટની સૌથી મુશ્કેલ ક્ષણ કઈ હતી?",
    positiveMoment: "આજની એક સારી ક્ષણ કઈ હતી?",
    generate: "મારી વાર્તા બનાવો",
    generating: "તમારી વાર્તા લખાઈ રહી છે...",
    disclaimer:
      "તમે જે શેર કર્યું તેના આધારે સામાન્ય વેલનેસ સહાય, તબીબી સલાહ નહીં.",
    noCheckin:
      "તમારી શિફ્ટ વાર્તા અનલૉક કરવા માટે પહેલાં આજનો ચેક-ઇન કરો.",
    goCheckin: "ચેક-ઇન પર જાઓ",
    feedbackPrompt: "શું આનાથી મદદ મળી?",
    feedbackThanks: "આભાર ✓",
    error:
      "અત્યારે તમારી વાર્તા બનાવી શકાઈ નહીં. કૃપા કરી થોડી વારમાં ફરી પ્રયાસ કરો.",
    proTeaser:
      "ભાવનાત્મક થીમ અને વેલનેસ પેટર્ન સાથે તમારી સંપૂર્ણ વાર્તા મેળવો.",
    unlockPro: "HealWell Pro સાથે અનલૉક કરો",
    tinyAction: "એક નાની વસ્તુ જે તમે અત્યારે કરી શકો:",
  },
  trends: {
    title: "તમારા ટ્રેન્ડ્સ",
    recoveryScore: "રિકવરી સ્કોર",
    energy: "ઊર્જા",
    sleep: "ઊંઘ",
    noData:
      "હજી કોઈ ચેક-ઇન નથી. તમારા ટ્રેન્ડ્સ જોવા માટે રોજ ચેક-ઇન કરવાનું શરૂ કરો.",
    goCheckin: "ચેક-ઇન પર જાઓ",
    proTeaser:
      "Pro સાથે તમારો સંપૂર્ણ 7-દિવસ પેટર્ન અને ભાવનાત્મક થીમ જુઓ.",
    unlockPro: "HealWell Pro સાથે અનલૉક કરો",
    days: ["સોમ", "મંગળ", "બુધ", "ગુરુ", "શુક્ર", "શનિ", "રવિ"],
  },
  admin: {
    title: "HealWell એડમિન",
    password: "એડમિન પાસવર્ડ",
    login: "લૉગિન",
    wrongPassword: "ખોટો પાસવર્ડ.",
    totalSubscribers: "કુલ સબ્સ્ક્રાઇબર",
    activeUsers: "સક્રિય વપરાશકર્તા (7 દિવસ)",
    featureUsage: "ફીચર ઉપયોગ",
    feedback: "પ્રતિસાદ",
    thumbsUp: "👍",
    thumbsDown: "👎",
    positive: "% સકારાત્મક",
    free: "મફત",
    pro: "પ્રો",
  },
  pro: {
    message: "HealWell Pro સાથે અનલૉક કરો",
    price: "$3.99 / મહિનો",
    cta: "વધુ જાણો",
  },
  footer:
    "© 2026 HealWell. સર્વ હક્કો સુરક્ષિત. · માત્ર સામાન્ય વેલનેસ સહાય, તબીબી સલાહ નહીં.",
}

export const strings: Record<Language, typeof en> = { en, es, hi, gu }

export function getStrings(lang: Language) {
  return strings[lang] ?? strings["en"]
}
