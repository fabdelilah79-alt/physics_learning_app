// =====================================================
// data.js — Contenu pédagogique SSPOE
// =====================================================
// Pour ajouter un cours : ajoutez un objet dans le tableau
// courses[] du niveau correspondant.
// Chaque texte est bilingue : { fr: "...", ar: "..." }
// =====================================================

const APP_DATA = {

  // ── Métadonnées de l'application ──
  app: {
    title: { fr: "Physique Interactive", ar: "الفيزياء التفاعلية" },
    subtitle: { fr: "Apprendre par la simulation", ar: "التعلم عبر المحاكاة" },
    welcome: {
      fr: "Bienvenue ! Choisis ton niveau pour commencer.",
      ar: "مرحبًا! اختر مستواك للبدء"
    },
    footer: {
      fr: "Application développée pour l'enseignement de la physique au collège — Maroc",
      ar: "تطبيق مطوّر لتعليم الفيزياء بالإعدادي — المغرب"
    }
  },

  // ── Labels d'interface ──
  ui: {
    home: { fr: "Accueil", ar: "الرئيسية" },
    courses: { fr: "Cours", ar: "الدروس" },
    activities: { fr: "Activités", ar: "الأنشطة" },
    back: { fr: "Retour", ar: "رجوع" },
    next: { fr: "Suivant", ar: "التالي" },
    previous: { fr: "Précédent", ar: "السابق" },
    validate: { fr: "Valider mes hypothèses", ar: "تأكيد فرضياتي" },
    startSimulation: { fr: "Lancer la simulation", ar: "ابدأ المحاكاة" },
    fullscreen: { fr: "Plein écran", ar: "شاشة كاملة" },
    exitFullscreen: { fr: "Quitter plein écran", ar: "إنهاء الشاشة الكاملة" },
    showExplanation: { fr: "Voir l'explication", ar: "عرض الشرح" },
    backToCourses: { fr: "Retour aux cours", ar: "العودة للدروس" },
    chooseLevel: { fr: "Choisir un niveau", ar: "اختر المستوى" },
    selectAnswer: { fr: "Sélectionne une réponse", ar: "اختر إجابة" },
    yourPrediction: { fr: "Ta prédiction", ar: "توقعك" },
    correctAnswer: { fr: "Bonne réponse", ar: "الإجابة الصحيحة" },
    stepPrediction: { fr: "Prédiction", ar: "التوقع" },
    stepObservation: { fr: "Observation", ar: "الملاحظة" },
    stepExplanation: { fr: "Explication", ar: "الشرح" },
    noCourses: { fr: "Cours en cours de préparation…", ar: "الدروس قيد التحضير…" },
    writeAnswer: { fr: "Écris ta réponse ici…", ar: "…اكتب إجابتك هنا" },
    installApp: { fr: "Installer l'application", ar: "تثبيت التطبيق" },
    language: { fr: "العربية", ar: "Français" }
  },

  // ── Niveaux scolaires ──
  levels: [
    {
      id: "1ac",
      name: { fr: "1ère Année Collège", ar: "السنة الأولى إعدادي" },
      shortName: { fr: "1AC", ar: "1إع" },
      icon: "🔬",
      color: "#4CAF50",
      gradient: "linear-gradient(135deg, #43A047, #66BB6A)",
      courses: [
        {
          id: "1ac_pression",
          title: { fr: "La Pression", ar: "الضغط" },
          description: {
            fr: "Découvre comment la force et la surface influencent la pression.",
            ar: "اكتشف كيف تؤثر القوة والمساحة على الضغط"
          },
          icon: "⬇️",
          activities: [
            {
              id: "1ac_pression_act1",
              title: {
                fr: "Activité 1 : La pression et la surface",
                ar: "النشاط 1: الضغط والمساحة"
              },

              // ── ÉTAPE 1 : PRÉDICTION ──
              prediction: {
                question: {
                  fr: "Si tu poses une brique à plat puis sur sa tranche dans du sable mou, dans quelle position la brique s'enfonce-t-elle le plus ?",
                  ar: "إذا وضعت طوبة بشكل مسطح ثم على حافتها في الرمل الناعم، في أي وضع ستغوص الطوبة أكثر؟"
                },
                type: "mcq",
                choices: [
                  {
                    id: "a",
                    text: {
                      fr: "La brique s'enfonce plus quand elle est à plat (grande surface de contact)",
                      ar: "تغوص الطوبة أكثر عندما تكون مسطحة (سطح تلامس كبير)"
                    }
                  },
                  {
                    id: "b",
                    text: {
                      fr: "La brique s'enfonce plus quand elle est sur la tranche (petite surface de contact)",
                      ar: "تغوص الطوبة أكثر عندما تكون على حافتها (سطح تلامس صغير)"
                    }
                  },
                  {
                    id: "c",
                    text: {
                      fr: "Ça ne change rien, la brique a le même poids",
                      ar: "لا فرق، الطوبة لها نفس الوزن"
                    }
                  }
                ],
                correctAnswer: "b"
              },

              // ── ÉTAPE 2 : OBSERVATION (Simulation) ──
              simulation: {
                file: "simulations/pression_sim.html",
                instructions: {
                  fr: "Clique sur la brique pour changer son orientation et observe comment elle s'enfonce dans le sable. Compare les deux positions.",
                  ar: "انقر على الطوبة لتغيير اتجاهها ولاحظ كيف تغوص في الرمل. قارن بين الوضعين."
                }
              },

              // ── ÉTAPE 3 : EXPLICATION ──
              explanation: {
                summary: {
                  fr: "La pression dépend de deux facteurs : la force exercée (le poids) ET la surface de contact.\n\n**Formule :**  P = F ÷ S\n\n• **P** = pression en Pascal (Pa)\n• **F** = force en Newton (N)\n• **S** = surface en m²\n\n📌 **Conclusion** : À force égale, plus la surface est petite, plus la pression est grande. C'est pourquoi la brique sur la tranche s'enfonce davantage dans le sable.",
                  ar: "يعتمد الضغط على عاملين: القوة المطبقة (الوزن) ومساحة سطح التلامس.\n\n**الصيغة:**  P = F ÷ S\n\n• **P** = الضغط بالباسكال (Pa)\n• **F** = القوة بالنيوتن (N)\n• **S** = المساحة بالمتر مربع (m²)\n\n📌 **الخلاصة**: عند ثبوت القوة، كلما كانت المساحة أصغر، زاد الضغط. لهذا تغوص الطوبة على حافتها أكثر في الرمل."
                },
                feedback: {
                  correct: {
                    fr: "🎉 Excellent ! Ta prédiction était correcte ! La brique s'enfonce plus sur la tranche car la surface de contact est plus petite, ce qui augmente la pression.",
                    ar: "🎉 ممتاز! توقعك كان صحيحًا! تغوص الطوبة أكثر على حافتها لأن سطح التلامس أصغر، مما يزيد الضغط."
                  },
                  incorrect: {
                    fr: "🤔 Pas tout à fait ! Mais ne t'inquiète pas, c'est justement le but de l'expérience. La bonne réponse est que la brique s'enfonce plus sur la tranche car la surface de contact est plus petite.",
                    ar: "🤔 ليس تمامًا! لكن لا تقلق، هذا هو هدف التجربة بالذات. الإجابة الصحيحة هي أن الطوبة تغوص أكثر على حافتها لأن سطح التلامس أصغر."
                  }
                }
              }
            }
          ]
        }
      ]
    },
    {
      id: "2ac",
      name: { fr: "2ème Année Collège", ar: "السنة الثانية إعدادي" },
      shortName: { fr: "2AC", ar: "2إع" },
      icon: "⚡",
      color: "#2196F3",
      gradient: "linear-gradient(135deg, #1E88E5, #42A5F5)",
      courses: []
    },
    {
      id: "3ac",
      name: { fr: "3ème Année Collège", ar: "السنة الثالثة إعدادي" },
      shortName: { fr: "3AC", ar: "3إع" },
      icon: "🧲",
      color: "#FF9800",
      gradient: "linear-gradient(135deg, #F57C00, #FFB74D)",
      courses: []
    }
  ]
};
