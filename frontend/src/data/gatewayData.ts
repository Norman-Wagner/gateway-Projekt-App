// Gateway Process Historical Data & Meditation Scripts - ENHANCED VERSION

export interface MeditationPhase {
  id: string;
  title: string;
  title_de: string;
  duration_seconds: number;
  script: string;
  script_de: string;
}

export interface GuidedMeditation {
  id: string;
  focus_level: string;
  title: string;
  title_de: string;
  introduction: string;
  introduction_de: string;
  total_duration_minutes: number;
  phases: MeditationPhase[];
}

export interface PracticalTool {
  id: string;
  title: string;
  title_de: string;
  description: string;
  description_de: string;
  technique: string;
  technique_de: string;
  icon: string;
  disclaimer?: string;
  disclaimer_de?: string;
}

export interface FocusLevelInfo {
  id: string;
  name: string;
  name_de: string;
  subtitle: string;
  subtitle_de: string;
  description: string;
  description_de: string;
  beatFrequency: number;
  baseFrequency: number;
  durationMinutes: number;
  isAdvanced: boolean;
  warning?: string;
  warning_de?: string;
  benefits: string[];
  benefits_de: string[];
}

// Daily CIA Facts
export const ciaFacts = {
  en: [
    "The CIA spent over $20 million on PSI research (Project Star Gate) between 1972-1995.",
    "Page 25 of the Gateway Report was missing for 38 years before being found in 2021.",
    "Lt. Col. Wayne M. McDonnell wrote the Gateway Report while assigned to the US Army Intelligence.",
    "Robert Monroe founded the Monroe Institute in 1971 after experiencing spontaneous out-of-body experiences.",
    "The term 'Hemi-Sync' stands for Hemispheric Synchronization - synchronizing left and right brain waves.",
    "The Gateway Experience was originally developed for CIA intelligence gathering via Remote Viewing.",
    "Binaural beats were first discovered by physicist Heinrich Wilhelm Dove in 1839.",
    "The Schumann Resonance (7.83 Hz) is the Earth's natural electromagnetic frequency - used in advanced Gateway work.",
    "Focus 21 is called 'The Bridge' because it represents the edge of space-time reality.",
    "The Gateway Report concludes that consciousness is a form of energy that can exist independent of the body."
  ],
  de: [
    "Die CIA gab über 20 Millionen Dollar für PSI-Forschung aus (Projekt Star Gate) zwischen 1972-1995.",
    "Seite 25 des Gateway-Berichts fehlte 38 Jahre lang, bevor sie 2021 gefunden wurde.",
    "Lt. Col. Wayne M. McDonnell verfasste den Gateway-Bericht während seiner Zuweisung zum US Army Intelligence.",
    "Robert Monroe gründete das Monroe Institute 1971 nach spontanen außerkörperlichen Erfahrungen.",
    "Der Begriff 'Hemi-Sync' steht für Hemispheric Synchronization - Synchronisation der linken und rechten Gehirnwellen.",
    "Die Gateway-Erfahrung wurde ursprünglich für die CIA-Informationsbeschaffung via Remote Viewing entwickelt.",
    "Binaurale Beats wurden erstmals 1839 vom Physiker Heinrich Wilhelm Dove entdeckt.",
    "Die Schumann-Resonanz (7.83 Hz) ist die natürliche elektromagnetische Frequenz der Erde - wird in fortgeschrittener Gateway-Arbeit verwendet.",
    "Focus 21 wird 'Die Brücke' genannt, weil es den Rand der Raumzeit-Realität darstellt.",
    "Der Gateway-Bericht kommt zum Schluss, dass Bewusstsein eine Form von Energie ist, die unabhängig vom Körper existieren kann."
  ]
};

// Extended Focus Levels (10, 12, 15, 21, 23)
export const focusLevels: FocusLevelInfo[] = [
  {
    id: '10',
    name: 'Focus 10',
    name_de: 'Focus 10',
    subtitle: 'Mind Awake / Body Asleep',
    subtitle_de: 'Geist wach / Körper schläft',
    description: 'The foundation state for all Gateway exploration. Your physical body enters a sleep-like state while your mind remains fully alert and conscious. This is the starting point for all deeper states.',
    description_de: 'Der Grundzustand für alle Gateway-Erkundungen. Dein physischer Körper tritt in einen schlafähnlichen Zustand ein, während dein Geist vollständig wach und bewusst bleibt. Dies ist der Ausgangspunkt für alle tieferen Zustände.',
    beatFrequency: 10,
    baseFrequency: 200,
    durationMinutes: 15,
    isAdvanced: false,
    benefits: [
      'Deep physical relaxation',
      'Enhanced mental clarity',
      'Reduced stress and anxiety',
      'Foundation for advanced states'
    ],
    benefits_de: [
      'Tiefe körperliche Entspannung',
      'Verbesserte geistige Klarheit',
      'Reduzierter Stress und Angst',
      'Grundlage für fortgeschrittene Zustände'
    ]
  },
  {
    id: '12',
    name: 'Focus 12',
    name_de: 'Focus 12',
    subtitle: 'Expanded Awareness',
    subtitle_de: 'Erweitertes Bewusstsein',
    description: 'A state of expanded awareness beyond the physical senses. Access to higher self, intuitive knowledge, and the ability to perceive non-physical realities. Ideal for Memory Palace work.',
    description_de: 'Ein Zustand erweiterter Wahrnehmung jenseits der physischen Sinne. Zugang zum höheren Selbst, intuitivem Wissen und der Fähigkeit, nicht-physische Realitäten wahrzunehmen. Ideal für Memory Palace Arbeit.',
    beatFrequency: 7,
    baseFrequency: 200,
    durationMinutes: 20,
    isAdvanced: false,
    benefits: [
      'Heightened intuition',
      'Access to inner guidance',
      'Enhanced creativity',
      'Energetic memory anchoring'
    ],
    benefits_de: [
      'Gesteigerte Intuition',
      'Zugang zu innerer Führung',
      'Verbesserte Kreativität',
      'Energetische Gedächtnisverankerung'
    ]
  },
  {
    id: '15',
    name: 'Focus 15',
    name_de: 'Focus 15',
    subtitle: 'No-Time State',
    subtitle_de: 'Zeitloser Zustand',
    description: 'Transcending time and space limitations. In this state, past, present, and future become accessible. The perception of linear time dissolves.',
    description_de: 'Überschreiten von Zeit- und Raumbegrenzungen. In diesem Zustand werden Vergangenheit, Gegenwart und Zukunft zugänglich. Die Wahrnehmung linearer Zeit löst sich auf.',
    beatFrequency: 4,
    baseFrequency: 200,
    durationMinutes: 25,
    isAdvanced: false,
    benefits: [
      'Time perception dissolution',
      'Deep spiritual experiences',
      'Access to past/future insights',
      'Profound inner peace'
    ],
    benefits_de: [
      'Auflösung der Zeitwahrnehmung',
      'Tiefe spirituelle Erfahrungen',
      'Zugang zu Vergangenheit/Zukunft',
      'Tiefgreifender innerer Frieden'
    ]
  },
  {
    id: '21',
    name: 'Focus 21',
    name_de: 'Focus 21',
    subtitle: 'The Bridge',
    subtitle_de: 'Die Brücke',
    description: 'The edge of space-time reality. Focus 21 represents the boundary between physical and non-physical existence. Contact with guiding intelligences becomes possible.',
    description_de: 'Der Rand der Raumzeit-Realität. Focus 21 repräsentiert die Grenze zwischen physischer und nicht-physischer Existenz. Kontakt mit führenden Intelligenzen wird möglich.',
    beatFrequency: 3,
    baseFrequency: 200,
    durationMinutes: 30,
    isAdvanced: true,
    warning: 'Advanced level. Ensure solid experience with Focus 10-15 before attempting. Practice grounding techniques before and after.',
    warning_de: 'Fortgeschrittenes Level. Stelle sicher, dass du solide Erfahrung mit Focus 10-15 hast. Übe Erdungstechniken vor und nach der Sitzung.',
    benefits: [
      'Contact with non-physical guides',
      'Boundary exploration',
      'Deep transformational experiences',
      'Enhanced Remote Viewing'
    ],
    benefits_de: [
      'Kontakt mit nicht-physischen Führern',
      'Grenzenerkundung',
      'Tiefe transformative Erfahrungen',
      'Verbessertes Remote Viewing'
    ]
  },
  {
    id: '23',
    name: 'Focus 23',
    name_de: 'Focus 23',
    subtitle: 'Out-of-Body State',
    subtitle_de: 'Außerkörperlicher Zustand',
    description: 'The direct out-of-body experience state. Full separation of consciousness from physical form. This is the state described by Robert Monroe in his books.',
    description_de: 'Der direkte außerkörperliche Erfahrungszustand. Vollständige Trennung des Bewusstseins von der physischen Form. Dies ist der Zustand, den Robert Monroe in seinen Büchern beschreibt.',
    beatFrequency: 2,
    baseFrequency: 200,
    durationMinutes: 35,
    isAdvanced: true,
    warning: 'Expert level. Strong foundation in all previous Focus levels required. May induce intense experiences. Not recommended for beginners or those with anxiety disorders.',
    warning_de: 'Expertenlevel. Starke Grundlage in allen vorherigen Focus-Levels erforderlich. Kann intensive Erfahrungen auslösen. Nicht empfohlen für Anfänger oder Personen mit Angststörungen.',
    benefits: [
      'Full OBE (Out-of-Body Experience)',
      'Exploration of non-physical realms',
      'Direct consciousness expansion',
      'Profound life perspective shifts'
    ],
    benefits_de: [
      'Vollständige OBE (Außerkörperliche Erfahrung)',
      'Erkundung nicht-physischer Bereiche',
      'Direkte Bewusstseinserweiterung',
      'Tiefgreifende Perspektivwechsel'
    ]
  }
];

// Historical Information with Sources
export const gatewayHistory = {
  en: {
    title: "The Gateway Process",
    subtitle: "Declassified CIA Research on Consciousness",
    sections: [
      {
        title: "The Core Document",
        content: "The heart of the project is the 1983 'Analysis and Assessment of Gateway Process' report, declassified by the CIA in 2003. Written by Lieutenant Colonel Wayne M. McDonnell with technical support from biomedical engineer Itzhak Bentov. The report concludes that the described techniques are 'plausible' from a scientific perspective and have potential for intelligence work."
      },
      {
        title: "The Mysterious Page 25",
        content: "For a long time, page 25 was missing from published copies of the report, leading to much speculation. This page was finally found and made public in 2021. It contains information about consciousness returning to the 'Absolute' - the infinite energy field."
      },
      {
        title: "Hemi-Sync Technology",
        content: "The method at the center is called 'Hemi-Sync' (Hemispheric Synchronization). By playing slightly different frequencies in each ear (e.g., 200 Hz left, 210 Hz right), the brain creates a third 'phantom' frequency (10 Hz) that synchronizes both hemispheres."
      },
      {
        title: "The Monroe Institute",
        content: "The technology was developed by Robert Monroe, a broadcasting executive who began researching the effects of sounds on consciousness in the 1950s. In 1971, he founded the Monroe Institute in Virginia, which continues to offer and develop the Gateway Experience today."
      }
    ],
    sources: [
      {
        title: "Analysis and Assessment of Gateway Process",
        author: "Lt. Col. Wayne M. McDonnell",
        year: "1983",
        link: "https://www.cia.gov/readingroom/docs/CIA-RDP96-00788R001700210016-5.pdf"
      },
      {
        title: "Journeys Out of the Body",
        author: "Robert Monroe",
        year: "1971",
        link: ""
      },
      {
        title: "The Holographic Universe",
        author: "Michael Talbot",
        year: "1991",
        link: ""
      }
    ]
  },
  de: {
    title: "Der Gateway-Prozess",
    subtitle: "Freigegebene CIA-Forschung zum Bewusstsein",
    sections: [
      {
        title: "Das Kerndokument",
        content: "Das Herzstück des Projekts ist der 1983 erstellte 'Analysis and Assessment of Gateway Process' Bericht, der 2003 von der CIA freigegeben wurde. Verfasst von Lieutenant Colonel Wayne M. McDonnell mit technischer Unterstützung des Biomedizin-Ingenieurs Itzhak Bentov. Der Bericht kommt zu dem Schluss, dass die beschriebenen Techniken aus wissenschaftlicher Sicht 'plausibel' seien."
      },
      {
        title: "Die mysteriöse Seite 25",
        content: "Lange Zeit fehlte in den veröffentlichten Kopien des Berichts die Seite 25, was zu viel Spekulation führte. Diese Seite wurde schließlich 2021 gefunden und öffentlich gemacht. Sie enthält Informationen über das Zurückkehren des Bewusstseins zum 'Absoluten' - dem unendlichen Energiefeld."
      },
      {
        title: "Hemi-Sync Technologie",
        content: "Die zentrale Methode heißt 'Hemi-Sync' (Hemispheric Synchronization). Durch das Abspielen leicht unterschiedlicher Frequenzen auf jedem Ohr (z.B. 200 Hz links, 210 Hz rechts) erzeugt das Gehirn eine dritte 'Phantom'-Frequenz (10 Hz), die beide Hemisphären synchronisiert."
      },
      {
        title: "Das Monroe Institute",
        content: "Die Technologie wurde von Robert Monroe entwickelt, einem Rundfunkmanager, der in den 1950er Jahren begann, die Wirkung von Klängen auf das Bewusstsein zu erforschen. 1971 gründete er das Monroe Institute in Virginia, das die Gateway-Erfahrung bis heute anbietet."
      }
    ],
    sources: [
      {
        title: "Analysis and Assessment of Gateway Process",
        author: "Lt. Col. Wayne M. McDonnell",
        year: "1983",
        link: "https://www.cia.gov/readingroom/docs/CIA-RDP96-00788R001700210016-5.pdf"
      },
      {
        title: "Journeys Out of the Body",
        author: "Robert Monroe",
        year: "1971",
        link: ""
      },
      {
        title: "The Holographic Universe",
        author: "Michael Talbot",
        year: "1991",
        link: ""
      }
    ]
  }
};

// Gateway Affirmation
export const gatewayAffirmation = {
  en: "I am more than my physical body. Because I am more than physical matter, I can perceive that which is greater than the physical world. I deeply desire to expand, to experience, to know, to understand, to control, to use such greater energies and energy systems as may be beneficial and constructive to me and to those who follow me. I deeply desire the help and cooperation, the assistance, the understanding of those individuals whose wisdom, development and experience are equal to or greater than my own. I ask their guidance and protection from any influence or any source that might provide me with less than my stated desires.",
  de: "Ich bin mehr als mein physischer Körper. Weil ich mehr als physische Materie bin, kann ich das wahrnehmen, was größer ist als die physische Welt. Ich wünsche mir zutiefst, mich zu erweitern, zu erfahren, zu wissen, zu verstehen, zu kontrollieren und solche größeren Energien und Energiesysteme zu nutzen, die mir und denen, die mir folgen, nützlich und konstruktiv sein können. Ich bitte um ihre Führung und ihren Schutz vor jedem Einfluss oder jeder Quelle, die mir weniger bieten könnte als meine erklärten Wünsche."
};

// Practical Daily Tools - ENHANCED
export const practicalTools: PracticalTool[] = [
  {
    id: 'pain_relief',
    title: 'Pain Relief (55515)',
    title_de: 'Schmerzlinderung (55515)',
    description: 'A technique from the Gateway workbook for reducing pain through number repetition.',
    description_de: 'Eine Technik aus dem Gateway-Arbeitsheft zur Schmerzlinderung durch Zahlenwiederholung.',
    technique: '1. Close your eyes and focus on the area of discomfort.\n2. Slowly and deliberately repeat the number sequence 55515 in your mind.\n3. Visualize each number as a glowing digit.\n4. Feel the numbers dissolving the discomfort.\n5. Continue for 2-5 minutes or until relief is felt.\n\nThe sequence 55515 is believed to create a specific vibrational pattern that interrupts pain signals.',
    technique_de: '1. Schließe deine Augen und konzentriere dich auf den Bereich des Unbehagens.\n2. Wiederhole langsam und bewusst die Zahlenfolge 55515 in deinem Geist.\n3. Visualisiere jede Zahl als leuchtende Ziffer.\n4. Spüre, wie die Zahlen das Unbehagen auflösen.\n5. Fahre 2-5 Minuten fort oder bis Erleichterung spürbar ist.\n\nDie Sequenz 55515 soll ein spezifisches Schwingungsmuster erzeugen, das Schmerzsignale unterbricht.',
    icon: 'medical-outline',
    disclaimer: '⚠️ IMPORTANT: This technique is historically documented but has no verified medical evidence. It does NOT replace professional medical treatment. For chronic or acute pain, please consult a doctor.',
    disclaimer_de: '⚠️ WICHTIG: Diese Technik ist historisch dokumentiert, aber hat keine verifizierte medizinische Evidenz. Sie ERSETZT KEINE professionelle medizinische Behandlung. Bei chronischen oder akuten Schmerzen suche bitte einen Arzt auf.'
  },
  {
    id: 'energy_conversion',
    title: 'Energy Conversion Box (ECB)',
    title_de: 'Energie-Umwandlungsbox (ECB)',
    description: 'A core Gateway visualization technique to release worries and distractions before meditation.',
    description_de: 'Eine zentrale Gateway-Visualisierungstechnik, um Sorgen und Ablenkungen vor der Meditation loszulassen.',
    technique: '1. VISUALIZE: Imagine a massive, sturdy box with a lid - made of steel, heavy wood, or any impenetrable material.\n\n2. FILL: Mentally place ALL your worries, fears, physical sensations, work thoughts, and distracting ideas into this box. One by one.\n\n3. CLOSE: Firmly shut the lid. HEAR the click or clang as it seals. Maybe add a heavy lock.\n\n4. DISTANCE: Move the box OUTSIDE your Energy Balloon (REBAL). Place it far away from your meditation space.\n\n5. ACKNOWLEDGE: Know that everything remains safe in the box. You can retrieve it after your session if truly needed.\n\nThis frees your consciousness completely for deeper exploration.',
    technique_de: '1. VISUALISIERE: Stelle dir eine massive, stabile Kiste mit Deckel vor - aus Stahl, schwerem Holz oder anderem undurchdringlichem Material.\n\n2. FÜLLE: Lege mental ALLE deine Sorgen, Ängste, körperlichen Empfindungen, Arbeitsgedanken und ablenkende Ideen in diese Kiste. Eine nach der anderen.\n\n3. SCHLIEßE: Schließe den Deckel fest. HÖRE das Klicken oder Klingen beim Versiegeln. Füge vielleicht ein schweres Schloss hinzu.\n\n4. ENTFERNE: Bewege die Kiste AUßERHALB deines Energieballons (REBAL). Platziere sie weit weg von deinem Meditationsort.\n\n5. AKZEPTIERE: Wisse, dass alles sicher in der Kiste bleibt. Du kannst es nach deiner Sitzung zurückholen, wenn wirklich nötig.\n\nDies befreit dein Bewusstsein vollständig für tiefere Erkundung.',
    icon: 'cube-outline'
  },
  {
    id: 'resonant_tuning',
    title: 'Resonant Tuning',
    title_de: 'Resonanz-Abstimmung',
    description: 'The Gateway breathing technique to charge your body with energy and synchronize brain hemispheres.',
    description_de: 'Die Gateway-Atemtechnik, um deinen Körper mit Energie aufzuladen und Gehirnhälften zu synchronisieren.',
    technique: 'PHASE 1 - "M-A-U-U-U-U-U" (5-7 breaths)\n• Inhale deeply through your nose\n• Exhale with a prolonged "M-A-U-U-U-U-U" sound\n• Keep mouth closed, feel vibration in your chest\n• Visualize energy flowing through your body\n\nPHASE 2 - "A-U-U-U-U-U" (5-7 breaths)\n• Inhale deeply\n• Exhale with "A-U-U-U-U-U", mouth slightly open\n• Feel vibration rising to your throat and head\n\nPHASE 3 - "O-O-O-O-O-O" (5-7 breaths)\n• Inhale deeply\n• Exhale with rounded "O-O-O-O-O-O"\n• Feel vibration expanding around you\n\nThis sequence synchronizes your brain hemispheres and prepares you for deeper states.',
    technique_de: 'PHASE 1 - "M-A-U-U-U-U-U" (5-7 Atemzüge)\n• Atme tief durch die Nase ein\n• Atme mit einem lang gezogenen "M-A-U-U-U-U-U" aus\n• Halte den Mund geschlossen, spüre Vibration in der Brust\n• Visualisiere Energie, die durch deinen Körper fließt\n\nPHASE 2 - "A-U-U-U-U-U" (5-7 Atemzüge)\n• Atme tief ein\n• Atme mit "A-U-U-U-U-U" aus, Mund leicht geöffnet\n• Spüre Vibration, die zu Hals und Kopf aufsteigt\n\nPHASE 3 - "O-O-O-O-O-O" (5-7 Atemzüge)\n• Atme tief ein\n• Atme mit rundem "O-O-O-O-O-O" aus\n• Spüre Vibration, die sich um dich herum ausbreitet\n\nDiese Sequenz synchronisiert deine Gehirnhälften und bereitet dich auf tiefere Zustände vor.',
    icon: 'pulse-outline'
  },
  {
    id: 'memory_enhancement',
    title: 'Gateway Memory Palace',
    title_de: 'Gateway-Gedächtnispalast',
    description: 'The classical Memory Palace technique enhanced with Gateway Focus 12 for energetic memory anchoring.',
    description_de: 'Die klassische Gedächtnispalast-Technik erweitert mit Gateway Focus 12 für energetische Gedächtnisverankerung.',
    technique: 'CLASSICAL TECHNIQUE:\n1. Choose a familiar location (your home, a route you know)\n2. Create vivid, absurd images for information\n3. Place these images at specific locations\n4. Walk through mentally to recall\n\nGATEWAY ENHANCEMENT:\n• Enter Focus 12 (Expanded Awareness) first\n• In this state, information is anchored not just spatially, but ENERGETICALLY\n• The expanded awareness allows for multi-dimensional memory encoding\n• Recall becomes faster and more complete\n\nNote: The Memory Palace is an ancient Greek/Roman technique. In the Gateway context, it becomes amplified through the altered state of consciousness.',
    technique_de: 'KLASSISCHE TECHNIK:\n1. Wähle einen vertrauten Ort (dein Zuhause, eine bekannte Route)\n2. Erstelle lebhafte, absurde Bilder für Informationen\n3. Platziere diese Bilder an bestimmten Orten\n4. Gehe mental durch, um abzurufen\n\nGATEWAY-ERWEITERUNG:\n• Gehe zuerst in Focus 12 (Erweitertes Bewusstsein)\n• In diesem Zustand werden Informationen nicht nur räumlich, sondern ENERGETISCH verankert\n• Das erweiterte Bewusstsein ermöglicht multi-dimensionale Gedächtniskodierung\n• Abrufen wird schneller und vollständiger\n\nHinweis: Der Gedächtnispalast ist eine antike griechisch/römische Technik. Im Gateway-Kontext wird sie durch den veränderten Bewusstseinszustand verstärkt.',
    icon: 'bulb-outline'
  },
  {
    id: 'rebal',
    title: 'REBAL (Resonant Energy Balloon)',
    title_de: 'REBAL (Resonanter Energieballon)',
    description: 'The protective energy shield used in all Gateway sessions.',
    description_de: 'Der schützende Energieschild, der in allen Gateway-Sitzungen verwendet wird.',
    technique: '1. After Resonant Tuning, visualize energy gathering at the top of your head\n\n2. Let this energy flow DOWN around your body like a waterfall of blue-white light\n\n3. The energy flows under your feet and back UP through your body\n\n4. It creates a complete SPHERE of energy around you - about arm\'s length in all directions\n\n5. This balloon is PERMEABLE to positive energy only\n\n6. AFFIRM: "Only that which is beneficial to me may enter. I am completely protected."\n\n7. Maintain this shield throughout your entire session\n\nThe REBAL serves as energetic protection and helps define your personal space during exploration.',
    technique_de: '1. Nach der Resonanz-Abstimmung visualisiere Energie, die sich oben an deinem Kopf sammelt\n\n2. Lass diese Energie wie ein Wasserfall aus blau-weißem Licht um deinen Körper HERAB fließen\n\n3. Die Energie fließt unter deinen Füßen hindurch und HOCH durch deinen Körper zurück\n\n4. Sie erzeugt eine vollständige KUGEL aus Energie um dich - etwa Armlänge in alle Richtungen\n\n5. Dieser Ballon ist nur für positive Energie DURCHLÄSSIG\n\n6. BEKRÄFTIGE: "Nur das, was mir nützt, darf eintreten. Ich bin vollständig geschützt."\n\n7. Halte diesen Schild während deiner gesamten Sitzung aufrecht\n\nDer REBAL dient als energetischer Schutz und hilft, deinen persönlichen Raum während der Erkundung zu definieren.',
    icon: 'shield-outline'
  }
];

// Binaural Beat Presets
export const binauralPresets = [
  {
    id: 'schumann',
    name: 'Schumann Resonance',
    name_de: 'Schumann-Resonanz',
    frequency: 7.83,
    baseFrequency: 200,
    description: "Earth's natural electromagnetic frequency",
    description_de: 'Natürliche elektromagnetische Frequenz der Erde'
  },
  {
    id: 'alpha',
    name: 'Alpha Waves',
    name_de: 'Alpha-Wellen',
    frequency: 10,
    baseFrequency: 200,
    description: 'Relaxed alertness (8-12 Hz)',
    description_de: 'Entspannte Wachheit (8-12 Hz)'
  },
  {
    id: 'theta',
    name: 'Theta Waves',
    name_de: 'Theta-Wellen',
    frequency: 6,
    baseFrequency: 200,
    description: 'Deep meditation (4-8 Hz)',
    description_de: 'Tiefe Meditation (4-8 Hz)'
  },
  {
    id: 'delta',
    name: 'Delta Waves',
    name_de: 'Delta-Wellen',
    frequency: 2,
    baseFrequency: 200,
    description: 'Deep sleep/OBE states (0.5-4 Hz)',
    description_de: 'Tiefschlaf/OBE Zustände (0.5-4 Hz)'
  }
];
