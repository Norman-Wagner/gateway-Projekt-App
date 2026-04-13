// Gateway Process Historical Data & Meditation Scripts

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
}

// Historical Information
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
        content: "For a long time, page 25 was missing from published copies of the report, leading to much speculation. This page was finally found and made public in 2021."
      },
      {
        title: "Hemi-Sync Technology",
        content: "The method at the center is called 'Hemi-Sync' (Hemispheric Synchronization). The goal is to synchronize the brain waves of the left and right hemispheres to achieve an altered state of consciousness through binaural beats and meditation techniques."
      },
      {
        title: "The Monroe Institute",
        content: "The technology was not developed by the CIA itself, but by Robert Monroe. He was a broadcasting executive who began researching the effects of sounds on consciousness in the 1950s. In 1971, he founded the Monroe Institute in Virginia, which continues to offer and develop the Gateway Experience today."
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
        content: "Lange Zeit fehlte in den veröffentlichten Kopien des Berichts die Seite 25, was zu viel Spekulation führte. Diese Seite wurde schließlich 2021 gefunden und öffentlich gemacht."
      },
      {
        title: "Hemi-Sync Technologie",
        content: "Die Methode im Zentrum heißt 'Hemi-Sync' (Hemispheric Synchronization). Das Ziel ist es, die Gehirnwellen der linken und rechten Hemisphäre zu synchronisieren, um einen veränderten Bewusstseinszustand durch binaurale Beats und Meditationstechniken zu erreichen."
      },
      {
        title: "Das Monroe Institute",
        content: "Die Technologie wurde nicht von der CIA entwickelt, sondern von Robert Monroe. Er war ein Rundfunkmanager, der in den 1950er Jahren begann, die Wirkung von Klängen auf das Bewusstsein zu erforschen. 1971 gründete er das Monroe Institute in Virginia, das die Gateway-Erfahrung bis heute anbietet."
      }
    ]
  }
};

// Gateway Affirmation
export const gatewayAffirmation = {
  en: "I am more than my physical body. Because I am more than physical matter, I can perceive that which is greater than the physical world. I deeply desire to expand, to experience, to know, to understand, to control, to use such greater energies and energy systems as may be beneficial and constructive to me and to those who follow me. I deeply desire the help and cooperation, the assistance, the understanding of those individuals whose wisdom, development and experience are equal to or greater than my own. I ask their guidance and protection from any influence or any source that might provide me with less than my stated desires.",
  de: "Ich bin mehr als mein physischer Körper. Weil ich mehr als physische Materie bin, kann ich das wahrnehmen, was größer ist als die physische Welt. Ich wünsche mir zutiefst, mich zu erweitern, zu erfahren, zu wissen, zu verstehen, zu kontrollieren und solche größeren Energien und Energiesysteme zu nutzen, die mir und denen, die mir folgen, nützlich und konstruktiv sein können. Ich bitte um ihre Führung und ihren Schutz vor jedem Einfluss oder jeder Quelle, die mir weniger bieten könnte als meine erklärten Wünsche."
};

// Focus 10 Guided Meditation
export const focus10Meditation: GuidedMeditation = {
  id: 'focus_10_guided',
  focus_level: '10',
  title: 'Focus 10 - Mind Awake, Body Asleep',
  title_de: 'Focus 10 - Geist wach, Körper schläft',
  introduction: 'Welcome to the Gateway Process - Focus 10. This meditation is inspired by the research of the Monroe Institute and the CIA documents on consciousness expansion. You need comfortable clothing, a quiet place, and stereo headphones for the binaural beats. The following instructions will guide you into a state of "body asleep, mind awake". Make yourself comfortable. Start the recording when you are ready.',
  introduction_de: 'Willkommen beim Gateway-Prozess – Focus 10. Diese Meditation wurde inspiriert durch die Forschung des Monroe Institute und die Dokumente der CIA zur Bewusstseinserweiterung. Du benötigst bequeme Kleidung, einen ruhigen Ort und Stereo-Kopfhörer für die binauralen Beats. Die folgenden Anweisungen führen dich in einen Zustand von „Körper schläft, Geist ist wach". Mache es dir bequem. Starte die Aufnahme, wenn du bereit bist.',
  total_duration_minutes: 15,
  phases: [
    {
      id: 'preparation',
      title: 'Preparation',
      title_de: 'Vorbereitung',
      duration_seconds: 120,
      script: 'Sit upright or lie on your back. ... Close your eyes. ... Take three deep breaths in and out. ... With each exhale, you become calmer. ...\n\nSpeak the Gateway Affirmation internally: "I am more than my physical body. I am a consciousness that transcends space and time. I ask for guidance and protection wherever I travel." ...',
      script_de: 'Setze dich aufrecht hin oder lege dich auf den Rücken. … Schließe deine Augen. … Atme dreimal tief ein und aus. … Mit jeder Ausatmung wirst du ruhiger. …\n\nSprich innerlich die Gateway-Affirmation: „Ich bin mehr als mein physischer Körper. Ich bin ein Bewusstsein, das über Raum und Zeit hinausgeht. Ich bitte um Führung und Schutz, wo immer ich reise." …'
    },
    {
      id: 'relaxation',
      title: 'Relaxation',
      title_de: 'Entspannung',
      duration_seconds: 180,
      script: 'Direct your attention to your feet. ... Relax them completely. ... The warmth spreads. ... Move to your ankles, calves, knees. ... Every muscle becomes soft and heavy. ...\n\nFeel your hips, your belly, your chest. ... With each breath, you sink deeper into relaxation. ...\n\nRelax your shoulders, your arms, your hands. ... Your neck, your jaw, your tongue. ... Your forehead becomes smooth. ... Your eyelids are heavy. ...',
      script_de: 'Richte deine Aufmerksamkeit auf deine Füße. … Entspanne sie vollständig. … Die Wärme breitet sich aus. … Wandere zu den Knöcheln, Waden, Knien. … Jeder Muskel wird weich und schwer. …\n\nSpüre deine Hüften, deinen Bauch, deinen Brustkorb. … Mit jedem Atemzug sinkst du tiefer in die Entspannung. …\n\nEntspanne deine Schultern, deine Arme, deine Hände. … Dein Nacken, dein Kiefer, deine Zunge. … Die Stirn wird glatt. … Die Augenlider sind schwer. …'
    },
    {
      id: 'energy_balloon',
      title: 'Energy Balloon (REBAL)',
      title_de: 'Energieballon (REBAL)',
      duration_seconds: 120,
      script: 'Imagine a sphere of blue-white light around your body. ... It begins at your head and slowly descends. ... It completely envelops you. ...\n\nThis shell only allows benevolent energy to enter. ... Nothing can harm you. ... You are absolutely safe. ...',
      script_de: 'Stelle dir eine Kugel aus blau-weißem Licht um deinen Körper vor. … Sie beginnt an deinem Kopf und senkt sich langsam ab. … Sie umschließt dich vollständig. …\n\nDiese Hülle lässt nur wohlwollende Energie herein. … Nichts kann dir schaden. … Du bist absolut sicher. …'
    },
    {
      id: 'focus_10_state',
      title: 'Focus 10 State',
      title_de: 'Focus 10 Zustand',
      duration_seconds: 300,
      script: 'Now count backwards from 10 to 1. ... With each number, your body sinks further into sleep while your mind remains wide awake. ...\n\n10 ... your legs feel distant. ... 9 ... your back is heavy. ... 8 ... your arms are falling asleep. ... 7 ... your heartbeat is calm. ... 6 ... your breath is shallow and even. ... 5 ... your body is like an empty shell. ... 4 ... only your consciousness is active. ... 3 ... you hear nothing but the sound of silence. ... 2 ... you are in Focus 10. ... 1 ... now.\n\n(Long pause)\n\nYour body sleeps. Your mind is clear like a mountain lake. ... Observe thoughts without judging them. ... You are the silent witness. ...',
      script_de: 'Zähle nun von 10 rückwärts bis 1. … Bei jeder Zahl sinkt dein Körper weiter in den Schlaf, während dein Geist hellwach bleibt. …\n\n10 … deine Beine sind wie weg. … 9 … dein Rücken ist schwer. … 8 … deine Arme schlafen ein. … 7 … dein Herzschlag ist ruhig. … 6 … dein Atem ist flach und gleichmäßig. … 5 … dein Körper ist wie eine leere Hülle. … 4 … nur noch dein Bewusstsein ist aktiv. … 3 … du hörst nichts als den Ton der Stille. … 2 … du bist in Focus 10. … 1 … jetzt.\n\n(Lange Pause)\n\nDein Körper schläft. Dein Geist ist klar wie ein Bergsee. … Beobachte die Gedanken, ohne sie zu bewerten. … Du bist der stille Zeuge. …'
    },
    {
      id: 'return',
      title: 'Return',
      title_de: 'Rückkehr',
      duration_seconds: 120,
      script: 'In a few moments you will return. ... Now count from 1 to 5. ... At 5 you wake up refreshed. ... 1 ... consciousness back in the body. ... 2 ... fingertips and toes feel again. ... 3 ... light movement of the hands. ... 4 ... eyes slowly open. ... 5 ... You are fully here, rested and clear. ...\n\nRecord your experiences in your Gateway journal later. ... The meditation is complete.',
      script_de: 'In einigen Momenten wirst du zurückkommen. … Zähle nun von 1 bis 5. … Bei 5 wachst du erfrischt auf. … 1 … Bewusstsein zurück im Körper. … 2 … Fingerspitzen und Zehen spüren wieder. … 3 … Leichtes Bewegen der Hände. … 4 … Augen öffnen sich langsam. … 5 … Du bist ganz hier, ausgeruht und klar. …\n\nNotiere später deine Erfahrungen in deinem Gateway-Tagebuch. … Die Meditation ist beendet.'
    }
  ]
};

// Practical Daily Tools
export const practicalTools: PracticalTool[] = [
  {
    id: 'pain_relief',
    title: 'Pain Relief',
    title_de: 'Schmerzlinderung',
    description: 'A technique from the Gateway workbook for reducing pain through number repetition.',
    description_de: 'Eine Technik aus dem Gateway-Arbeitsheft zur Schmerzlinderung durch Zahlenwiederholung.',
    technique: 'Close your eyes and focus on the area of discomfort. Slowly and deliberately repeat the number sequence 55515 in your mind. Visualize the numbers as you repeat them. Continue for 2-5 minutes or until relief is felt.',
    technique_de: 'Schließe deine Augen und konzentriere dich auf den Bereich des Unbehagens. Wiederhole langsam und bewusst die Zahlenfolge 55515 in deinem Geist. Visualisiere die Zahlen während du sie wiederholst. Fahre 2-5 Minuten fort oder bis Erleichterung spürbar ist.',
    icon: 'medical-outline'
  },
  {
    id: 'memory_enhancement',
    title: 'Memory Enhancement',
    title_de: 'Gedächtnisverbesserung',
    description: 'Techniques to strengthen recall and improve memory function.',
    description_de: 'Techniken zur Stärkung der Erinnerung und Verbesserung der Gedächtnisfunktion.',
    technique: 'Enter a relaxed state. Visualize the information you want to remember as vivid images. Create a "memory palace" - a familiar location where you place these images. When recalling, mentally walk through your palace and retrieve the images.',
    technique_de: 'Gehe in einen entspannten Zustand. Visualisiere die Informationen, die du dir merken möchtest, als lebhafte Bilder. Erstelle einen „Gedächtnispalast" - einen vertrauten Ort, an dem du diese Bilder platzierst. Beim Erinnern gehe mental durch deinen Palast und rufe die Bilder ab.',
    icon: 'bulb-outline'
  },
  {
    id: 'energy_conversion',
    title: 'Energy Conversion Box',
    title_de: 'Energie-Umwandlungsbox',
    description: 'A visualization technique to release worries and concerns before meditation.',
    description_de: 'Eine Visualisierungstechnik, um Sorgen und Bedenken vor der Meditation loszulassen.',
    technique: 'Visualize a sturdy box with a lid. Before meditation, mentally place all your worries, fears, and distracting thoughts into this box. Close the lid firmly. Know that you can retrieve them after your session if needed. This frees your mind for deeper exploration.',
    technique_de: 'Visualisiere eine stabile Box mit Deckel. Lege vor der Meditation mental alle deine Sorgen, Ängste und ablenkenden Gedanken in diese Box. Schließe den Deckel fest. Wisse, dass du sie nach deiner Sitzung wieder herausholen kannst, wenn nötig. Dies befreit deinen Geist für tiefere Erkundung.',
    icon: 'cube-outline'
  },
  {
    id: 'resonant_tuning',
    title: 'Resonant Tuning',
    title_de: 'Resonanz-Abstimmung',
    description: 'A breathing technique to charge your body with energy before meditation.',
    description_de: 'Eine Atemtechnik, um deinen Körper vor der Meditation mit Energie aufzuladen.',
    technique: 'Breathe in deeply through your nose, visualizing energy entering your body. As you exhale through your mouth, make a humming or "OM" sound. Feel the vibration throughout your body. Repeat 7-10 times. This synchronizes your brain hemispheres and prepares you for deeper states.',
    technique_de: 'Atme tief durch die Nase ein und visualisiere, wie Energie in deinen Körper eintritt. Beim Ausatmen durch den Mund mache einen summenden oder „OM"-Ton. Spüre die Vibration durch deinen ganzen Körper. Wiederhole 7-10 Mal. Dies synchronisiert deine Gehirnhälften und bereitet dich auf tiefere Zustände vor.',
    icon: 'pulse-outline'
  }
];

// Focus Level Detailed Information
export const focusLevelDetails = {
  '10': {
    en: {
      name: 'Focus 10',
      subtitle: 'Mind Awake / Body Asleep',
      description: 'The foundation state for all Gateway exploration. Your physical body enters a sleep-like state while your mind remains fully alert and conscious.',
      benefits: [
        'Deep physical relaxation',
        'Enhanced mental clarity',
        'Reduced stress and anxiety',
        'Foundation for advanced states',
        'Improved meditation depth'
      ],
      brainwave: 'Alpha (10 Hz)',
      duration: '15 minutes'
    },
    de: {
      name: 'Focus 10',
      subtitle: 'Geist wach / Körper schläft',
      description: 'Der Grundzustand für alle Gateway-Erkundungen. Dein physischer Körper tritt in einen schlafähnlichen Zustand ein, während dein Geist vollständig wach und bewusst bleibt.',
      benefits: [
        'Tiefe körperliche Entspannung',
        'Verbesserte geistige Klarheit',
        'Reduzierter Stress und Angst',
        'Grundlage für fortgeschrittene Zustände',
        'Verbesserte Meditationstiefe'
      ],
      brainwave: 'Alpha (10 Hz)',
      duration: '15 Minuten'
    }
  },
  '12': {
    en: {
      name: 'Focus 12',
      subtitle: 'Expanded Awareness',
      description: 'A state of expanded awareness beyond the physical senses. Access to higher self, intuitive knowledge, and the ability to perceive non-physical realities.',
      benefits: [
        'Heightened intuition',
        'Access to inner guidance',
        'Expanded perception',
        'Enhanced creativity',
        'Deeper self-understanding'
      ],
      brainwave: 'Theta (7 Hz)',
      duration: '20 minutes'
    },
    de: {
      name: 'Focus 12',
      subtitle: 'Erweitertes Bewusstsein',
      description: 'Ein Zustand erweiterter Wahrnehmung jenseits der physischen Sinne. Zugang zum höheren Selbst, intuitivem Wissen und der Fähigkeit, nicht-physische Realitäten wahrzunehmen.',
      benefits: [
        'Gesteigerte Intuition',
        'Zugang zu innerer Führung',
        'Erweiterte Wahrnehmung',
        'Verbesserte Kreativität',
        'Tieferes Selbstverständnis'
      ],
      brainwave: 'Theta (7 Hz)',
      duration: '20 Minuten'
    }
  },
  '15': {
    en: {
      name: 'Focus 15',
      subtitle: 'No-Time State',
      description: 'Transcending time and space limitations. In this state, past, present, and future become accessible. Contact with guiding intelligences becomes possible.',
      benefits: [
        'Time perception dissolution',
        'Deep spiritual experiences',
        'Contact with guidance',
        'Remote viewing potential',
        'Profound insights'
      ],
      brainwave: 'Deep Theta/Delta (4 Hz)',
      duration: '25 minutes'
    },
    de: {
      name: 'Focus 15',
      subtitle: 'Zeitloser Zustand',
      description: 'Überschreiten von Zeit- und Raumbegrenzungen. In diesem Zustand werden Vergangenheit, Gegenwart und Zukunft zugänglich. Kontakt mit führenden Intelligenzen wird möglich.',
      benefits: [
        'Auflösung der Zeitwahrnehmung',
        'Tiefe spirituelle Erfahrungen',
        'Kontakt mit Führung',
        'Remote Viewing Potenzial',
        'Tiefgreifende Einsichten'
      ],
      brainwave: 'Tiefes Theta/Delta (4 Hz)',
      duration: '25 Minuten'
    }
  }
};
