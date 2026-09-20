import { LessonPlanData, QuizQuestionData, SlideData, StudentMarkRecord, WorkshopPackage } from '../types';

export interface PresetTopic {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  description: string;
  icon: string;
}

export const WORKSHOP_PRESETS: PresetTopic[] = [
  {
    subject: 'Science (Biology)',
    grade: 'Grade 7',
    topic: 'Photosynthesis: How Plants Make Food',
    duration: '45 Minutes',
    description: 'Cellular chloroplasts, stomata gas exchange, and the light-driven equation for plant energy.',
    icon: '🌱',
  },
  {
    subject: 'Mathematics',
    grade: 'Grade 9',
    topic: 'Quadratic Equations & Parabolas',
    duration: '50 Minutes',
    description: 'Factoring, quadratic formula, vertex points, and real-world projectile trajectory modeling.',
    icon: '📐',
  },
  {
    subject: 'English Language Arts',
    grade: 'Grade 8',
    topic: 'Mastering Figurative Language in Poetry',
    duration: '40 Minutes',
    description: 'Metaphors, similes, personification, hyperbole, and sensory imagery in classic verse.',
    icon: '📖',
  },
  {
    subject: 'Social Studies (History)',
    grade: 'Grade 8',
    topic: 'The Industrial Revolution & Urbanization',
    duration: '45 Minutes',
    description: 'Steam power, factory systems, child labor reforms, and dramatic demographic shifts.',
    icon: '🏭',
  },
  {
    subject: 'Computer Science',
    grade: 'Grade 6',
    topic: 'Algorithms, Sequencing & Loops',
    duration: '45 Minutes',
    description: 'Step-by-step problem decomposition, conditional branch logic, and debugging everyday routines.',
    icon: '💻',
  },
];

const DEFAULT_STUDENT_NAMES = [
  'Aarav Sharma',
  'Ananya Iyer',
  'Benjamin Cole',
  'Chloe Bennett',
  'Daniel Kim',
  'Emily Watson',
  'Farhan Ali',
  'Grace Taylor',
  'Harsh Patel',
  'Isabella Rossi',
  'Jacob Miller',
  'Kripa Menon',
  'Lucas Silva',
  'Maya Lin',
  'Noah Davies',
];

export function computeStudentStats(student: StudentMarkRecord) {
  const total = student.test1 + student.test2 + student.assignment + student.activity + student.finalExam;
  const percentage = Math.round(total);
  let grade = 'F';
  if (percentage >= 90) grade = 'A';
  else if (percentage >= 75) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 40) grade = 'D';

  const result: 'Pass' | 'Fail' = total >= 40 ? 'Pass' : 'Fail';

  return { total, percentage, grade, result };
}

export function computeClassStats(students: StudentMarkRecord[]) {
  if (students.length === 0) {
    return {
      average: 0,
      highest: 0,
      lowest: 0,
      passCount: 0,
      failCount: 0,
      passPercentage: 0,
      gradeCounts: { A: 0, B: 0, C: 0, D: 0, F: 0 },
    };
  }

  const totals = students.map((s) => computeStudentStats(s).total);
  const sum = totals.reduce((a, b) => a + b, 0);
  const average = +(sum / students.length).toFixed(1);
  const highest = Math.max(...totals);
  const lowest = Math.min(...totals);

  const gradeCounts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  let passCount = 0;

  students.forEach((s) => {
    const { grade, result } = computeStudentStats(s);
    if (grade in gradeCounts) {
      gradeCounts[grade as keyof typeof gradeCounts]++;
    }
    if (result === 'Pass') passCount++;
  });

  const failCount = students.length - passCount;
  const passPercentage = +((passCount / students.length) * 100).toFixed(1);

  return {
    average,
    highest,
    lowest,
    passCount,
    failCount,
    passPercentage,
    gradeCounts,
  };
}

export function generateStudents(subject: string, topic: string): StudentMarkRecord[] {
  // Generate realistic student scores with variation
  const baseScores = [
    { t1: 18, t2: 19, a: 10, act: 9, fe: 36 },
    { t1: 16, t2: 17, a: 8, act: 9, fe: 32 },
    { t1: 12, t2: 11, a: 7, act: 8, fe: 22 },
    { t1: 19, t2: 20, a: 10, act: 10, fe: 38 },
    { t1: 14, t2: 15, a: 8, act: 7, fe: 26 },
    { t1: 9, t2: 10, a: 6, act: 5, fe: 15 },
    { t1: 15, t2: 16, a: 9, act: 8, fe: 30 },
    { t1: 20, t2: 19, a: 10, act: 10, fe: 39 },
    { t1: 11, t2: 13, a: 6, act: 7, fe: 20 },
    { t1: 17, t2: 18, a: 9, act: 9, fe: 35 },
    { t1: 8, t2: 9, a: 5, act: 6, fe: 10 },
    { t1: 19, t2: 18, a: 10, act: 9, fe: 37 },
    { t1: 13, t2: 14, a: 7, act: 8, fe: 25 },
    { t1: 16, t2: 17, a: 9, act: 9, fe: 34 },
    { t1: 14, t2: 12, a: 8, act: 7, fe: 24 },
  ];

  return DEFAULT_STUDENT_NAMES.map((name, idx) => {
    const s = baseScores[idx % baseScores.length];
    return {
      id: `student-${idx + 1}`,
      name,
      test1: s.t1,
      test2: s.t2,
      assignment: s.a,
      activity: s.act,
      finalExam: s.fe,
    };
  });
}

export function generateLessonPlan(
  subject: string,
  grade: string,
  topic: string,
  duration: string
): LessonPlanData {
  const isPhotosynthesis = topic.toLowerCase().includes('photo') || topic.toLowerCase().includes('plant');
  const isMath = subject.toLowerCase().includes('math') || topic.toLowerCase().includes('quad') || topic.toLowerCase().includes('equation');
  const isEnglish = subject.toLowerCase().includes('eng') || topic.toLowerCase().includes('poem') || topic.toLowerCase().includes('figurative');

  if (isPhotosynthesis) {
    return {
      subject,
      grade,
      topic,
      duration,
      learningObjectives: [
        'Explain the role of sunlight, water, carbon dioxide, and chlorophyll in plant food production.',
        'Guide students through the balanced word equation of photosynthesis.',
        'Demonstrate how microscopic stomata facilitate gas exchange while roots absorb water.',
      ],
      learningOutcomes: [
        'Identify and list the four primary inputs required for photosynthesis.',
        'Write and recite the word equation: Carbon Dioxide + Water → Glucose + Oxygen.',
        'Distinguish between the chemical energy produced (glucose) and the atmospheric byproduct (oxygen).',
        'Appreciate how photosynthetic flora serve as the foundational energy source for terrestrial ecosystems.',
      ],
      previousKnowledge: [
        'Plants require moisture, soil nutrients, and sunlight to survive and grow.',
        'Living creatures inhale oxygen and exhale carbon dioxide in cellular respiration.',
      ],
      warmupActivity: {
        title: 'The Mystery Chef Hook',
        description: 'Ask the class: "If you were locked inside a sunlit glasshouse with only water and air, could you create a meal using your skin?" Discuss why animals must forage while green plants synthesize food autonomously.',
        time: '5 Minutes',
      },
      teachingActivities: [
        {
          step: 'Concept Introduction & Chloroplast Anatomy',
          time: '10 mins',
          details: 'Introduce chloroplasts containing chlorophyll as the light-absorbing pigment. Explain how stomatal pores regulate CO2 ingress and O2 egress.',
        },
        {
          step: 'Word Equation Breakdown',
          time: '5 mins',
          details: 'Write the complete word equation on the board: Carbon Dioxide + Water + Light Energy -> Glucose + Oxygen. Contrast reactants with products.',
        },
        {
          step: 'The Kitchen Analogy',
          time: '5 mins',
          details: 'Frame chloroplast as the kitchen, chlorophyll as the chef spatula, sunlight as the stove heat, water/CO2 as raw ingredients, and glucose as the cooked banquet.',
        },
      ],
      examples: [
        'Aquatic Elodea waterweed producing visible oxygen micro-bubbles under a desk lamp.',
        'Variegated ivy leaves showing starch deposition exclusively in green pigmented chlorophyll zones.',
      ],
      studentActivity: {
        title: 'The Leaf Factory Recipe Card',
        instructions: [
          'Draw a magnified leaf cross-section in your science journals.',
          'Sketch 3 incoming arrows for inputs (Sunlight, Carbon Dioxide, Water).',
          'Sketch 2 outgoing arrows for outputs (Glucose, Oxygen).',
          'Label the microscopic stomata pores on the leaf underside and the xylem water transport tubes.',
        ],
        time: '10 Minutes',
      },
      assessmentQuestions: [
        'What gas enters through leaf stomata to serve as a reactant in photosynthesis?',
        'Which green pigment within plant cells captures radiant light energy?',
        'What vital atmospheric gas is liberated as a byproduct into the air?',
      ],
      homework: [
        'Complete textbook reading for Chapter 4, Section 2 (Pages 82-87).',
        '"Stoma Hunt": Observe a fresh houseplant leaf using a magnifying glass or phone lens, sketching surface veins and writing a 3-sentence texture summary.',
      ],
      differentiationSlowLearners: [
        'Provide a color-coded fill-in-the-blank recipe card template with a dedicated word bank.',
        'Use tactile color cards: Blue (Water), Yellow (Sunlight), Grey (CO2), Green (Chlorophyll).',
      ],
      extensionAdvancedLearners: [
        'Investigate why deep-water algae and purple coleus plants can perform photosynthesis without appearing bright green.',
        'Draft a reasoned hypothesis regarding the agricultural impact of prolonged volcanic ash cloud cover.',
      ],
    };
  }

  // General Subject Generator
  return {
    subject,
    grade,
    topic,
    duration,
    learningObjectives: [
      `Introduce the core principles, terminology, and key concepts of ${topic}.`,
      `Demonstrate analytical problem-solving steps and practical applications for ${topic}.`,
      `Foster collaborative inquiry and structured critical thinking among students.`,
    ],
    learningOutcomes: [
      `Explain the fundamental definitions and mechanics of ${topic} in clear language.`,
      `Apply step-by-step methodologies to solve standard problems or analyze case studies.`,
      `Evaluate real-world scenarios and articulate reasoned conclusions based on evidence.`,
      `Synthesize learning through structured oral and written classroom reflections.`,
    ],
    previousKnowledge: [
      `Foundational prerequisite vocabulary and basic concepts covered in the preceding unit.`,
      `General observation of real-world phenomena related to ${topic}.`,
    ],
    warmupActivity: {
      title: `The 3-Minute Think-Pair-Share Challenge on ${topic}`,
      description: `Present an engaging puzzle or provocative real-life question related to ${topic}. Students spend 1 minute brainstorming individually, 1 minute comparing with a partner, and 1 minute sharing with the class.`,
      time: '5 Minutes',
    },
    teachingActivities: [
      {
        step: `Core Theory & Conceptual Foundation`,
        time: '10 mins',
        details: `Deliver a concise visual overview of key principles underpinning ${topic}, highlighting vocabulary, structural models, and common misconceptions.`,
      },
      {
        step: `Guided Worked Demonstration ("I Do, We Do")`,
        time: '10 mins',
        details: `Walk through two contrasting sample problems on the board, verbalizing decision-making thought processes and soliciting student input at critical junction points.`,
      },
      {
        step: `Collaborative Application ("You Do Together")`,
        time: '10 mins',
        details: `Students work in pairs on scaffolded problem sets or analysis prompts while the teacher circulates to provide targeted scaffolding and formative checks.`,
      },
    ],
    examples: [
      `Case Study 1: Standard real-life application demonstrating ${topic} under optimal conditions.`,
      `Case Study 2: An edge-case scenario illustrating how variations in key parameters impact overall outcomes.`,
    ],
    studentActivity: {
      title: `Hands-On Investigation & Concept Mapping: ${topic}`,
      instructions: [
        `Form pairs and review the provided task dossier or prompt sheet.`,
        `Apply the 3-step analytical framework demonstrated during instruction.`,
        `Synthesize your findings into a clear visual diagram or solution matrix.`,
        `Prepare a 30-second peer summary explaining your methodology.`,
      ],
      time: '12 Minutes',
    },
    assessmentQuestions: [
      `What is the primary defining characteristic of ${topic}?`,
      `How does changing one critical variable alter the expected outcome in this system?`,
      `Which common error should be avoided when analyzing or calculating ${topic}?`,
    ],
    homework: [
      `Complete practice exercises 1 through 6 on page 45 of the study module.`,
      `Identify one contemporary news article or real-world circumstance where ${topic} plays an active role.`,
    ],
    differentiationSlowLearners: [
      `Provide visual reference anchor charts, step-by-step cue cards, and pre-filled guided note templates.`,
      `Pair with a peer mentor and focus initially on single-step foundational problems.`,
    ],
    extensionAdvancedLearners: [
      `Challenge advanced learners with a multi-variable open-ended extension problem.`,
      `Prompt them to construct a counter-example or develop an alternative proof/solution strategy.`,
    ],
  };
}

export function generateSlides(subject: string, grade: string, topic: string): SlideData[] {
  const isPhotosynthesis = topic.toLowerCase().includes('photo') || topic.toLowerCase().includes('plant');

  if (isPhotosynthesis) {
    return [
      {
        slideNumber: 1,
        title: 'Photosynthesis: How Plants Power the Earth',
        content: [
          `Subject: ${subject} • ${grade}`,
          `Unit: Plant Physiology & Earth Energy Systems`,
          `Teacher: AI Workshop Demo Series`,
          `Key Question: Where does the mass of a giant tree actually originate?`,
        ],
        suggestedVisual: 'Vibrant macro photograph of a backlit green leaf showcasing leaf veins, chlorophyll glow, and natural sunlight.',
        speakingPoint: 'Welcome everyone! Today we examine nature’s premier solar engine: how silent green leaves harvest sunlight, air, and water to sustain all life on Earth.',
      },
      {
        slideNumber: 2,
        title: 'Our Learning Objectives',
        content: [
          '🌿 Discover the 4 essential raw ingredients for plant food production',
          '🧪 Master the universal photosynthesis word equation',
          '🔬 Investigate how leaves drink water and inhale carbon dioxide',
          '🌎 Realize why every breath you take is connected to plant life',
        ],
        suggestedVisual: 'Four clean graphic badges: Sun icon, Water droplet, Wind stream (CO2), and Chloroplast cell.',
        speakingPoint: 'By the end of our session, you will confidently write out the biological recipe plants use and explain why deforestation poses a direct threat to our atmosphere.',
      },
      {
        slideNumber: 3,
        title: 'The Big Mystery: Where Does Tree Mass Come From?',
        content: [
          'A tiny acorn weighing 5 grams grows into a 10-ton oak tree over decades.',
          'Does that gigantic weight come from eating bags of soil dirt?',
          'Historical experiments proved soil weight barely changes over 5 years.',
          'Surprise: Plants are literally woven out of air, water, and sunlight!',
        ],
        suggestedVisual: 'Split screen diagram showing a tiny acorn on a scale versus a massive 50-foot mature oak tree with deep roots.',
        speakingPoint: 'Centuries ago, scientists thought plants devoured dirt. But Jan Baptist van Helmont discovered soil mass stayed virtually the same. The mass came out of thin air!',
      },
      {
        slideNumber: 4,
        title: 'The 4 Crucial Ingredients & Cell Engines',
        content: [
          '1. Sunlight: Radiant energy captured by the pigment Chlorophyll',
          '2. Water (H2O): Sucked up through soil roots via microscopic xylem pipelines',
          '3. Carbon Dioxide (CO2): Inhaled through underside leaf pores called Stomata',
          '4. Chloroplasts: Microscopic cellular kitchens containing solar panels',
        ],
        suggestedVisual: 'Cross-section of a green leaf illustrating upper cuticle, palisade chloroplast cells, xylem water conduits, and open stomatal valves.',
        speakingPoint: 'Focus on two critical anatomical terms: Chlorophyll is the green solar collector, and Stomata are microscopic sliding doors that open and close for gases.',
      },
      {
        slideNumber: 5,
        title: 'The Chemical Recipe: Word Equation',
        content: [
          'Carbon Dioxide + Water ──(Sunlight / Chlorophyll)──> Glucose + Oxygen',
          'Reactants (Inputs): CO2 from atmospheric air + H2O from soil moisture',
          'Products (Outputs): Glucose sugar (stored energy) + Oxygen gas (liberated)',
          'Glucose feeds plant stems, roots, flowers, and fruits for cellular energy.',
        ],
        suggestedVisual: 'Bold colorful chemical equation banner with chemical flasks, radiant sunlight beams, sugar crystals, and clean oxygen clouds.',
        speakingPoint: 'Notice the transformation. What goes in is inorganic gas and water; what comes out is high-energy organic glucose that builds apples, potatoes, and wood!',
      },
      {
        slideNumber: 6,
        title: 'Classroom Activity: The Leaf Factory Blueprint',
        content: [
          'Step 1: Draw a large leaf outline in your notebooks (3 minutes).',
          'Step 2: Draw 3 incoming Blue/Yellow arrows for inputs (Sun, CO2, H2O).',
          'Step 3: Draw 2 outgoing Green arrows for outputs (Glucose, Oxygen).',
          'Step 4: Circle the Chloroplast organelle and label underside Stomata.',
        ],
        suggestedVisual: 'Student notebook exemplar with colorful hand-drawn callouts, color-coded arrows, and clean anatomical labels.',
        speakingPoint: 'Pens out! Spend the next 4 minutes mapping your leaf factory. I will walk down each aisle to inspect your input arrows versus output arrows.',
      },
      {
        slideNumber: 7,
        title: 'Quick Revision: Rapid-Fire Recall',
        content: [
          '✅ Why are leaves green? Because of the light-absorbing pigment Chlorophyll.',
          '✅ Where do gases enter and exit? Through microscopic pores called Stomata.',
          '✅ What is the primary food made? Glucose (sugar) used for energy & growth.',
          '✅ What is released to the atmosphere? Oxygen gas essential for animal respiration.',
        ],
        suggestedVisual: 'Four-panel quadrant scorecard with green checkmarks and bold highlighted keywords for rapid scanning.',
        speakingPoint: 'Let us check our collective understanding: Who can name the gas entering the leaf? Correct, carbon dioxide! And the gas exiting? Yes, oxygen!',
      },
      {
        slideNumber: 8,
        title: 'Assessment & Exit Ticket',
        content: [
          'Exit Ticket Question: If you place a green houseplant inside a dark cupboard for 2 weeks with water, what happens to starch production and why?',
          'Homework: Complete textbook Chapter 4 study guide and complete our 10-question Google Form quiz tonight.',
          'Next Class: Laboratory experiment using iodine to test for starch in illuminated leaves.',
        ],
        suggestedVisual: 'Exit ticket clipboard icon paired with an interactive Google Forms QR code and a beaker with leaf starch test illustration.',
        speakingPoint: 'Before you pack up, write your answer to the cupboard question on your index card. Hand it to me at the door as your ticket out!',
      },
    ];
  }

  // General Subject Slides
  return [
    {
      slideNumber: 1,
      title: `${topic}: An Introduction`,
      content: [
        `Subject: ${subject} • ${grade}`,
        `Core Academic Unit: Foundations & Applications`,
        `Target Duration: 45 Minutes`,
        `Central Inquiry: How does this concept explain patterns in the world?`,
      ],
      suggestedVisual: `Inspiring banner image depicting practical real-world manifestations of ${topic}.`,
      speakingPoint: `Welcome students. Today we investigate ${topic}, unpacking core mechanics and discovering how these principles govern real-world applications.`,
    },
    {
      slideNumber: 2,
      title: 'Our Learning Objectives',
      content: [
        `🎯 Define key concepts and terminology associated with ${topic}`,
        `🔍 Analyze standard operational steps, structural rules, or formulas`,
        `💡 Connect classroom principles to tangible practical examples`,
        `📝 Demonstrate mastery through guided collaborative problem solving`,
      ],
      suggestedVisual: 'Structured bullseye target graphic with numbered roadmap milestones.',
      speakingPoint: 'Here is our flight plan for the next 40 minutes. Keep these four clear checkpoints in mind as we journey through the lesson.',
    },
    {
      slideNumber: 3,
      title: 'Introduction & Real-World Hook',
      content: [
        `Why do we study ${topic}?`,
        'Every day, natural systems and modern technologies rely on this principle.',
        'Without these foundations, key processes would break down or remain mysterious.',
        'Observation: Notice how small inputs generate predictable, measurable impacts.',
      ],
      suggestedVisual: 'Engaging juxtaposition graphic contrasting a common misconception with the actual scientific or structural reality.',
      speakingPoint: 'Before we dive into technical details, let us observe this real-world paradox. Why does this phenomenon happen, and how can we model it?',
    },
    {
      slideNumber: 4,
      title: 'Key Concepts & Definitions',
      content: [
        'Fundamental Rule 1: Key definition establishing core constraints.',
        'Fundamental Rule 2: Mechanism governing transitions, inputs, and outputs.',
        'Vocabulary Focus: Identify essential academic terms and units.',
        'Structural Diagram: How different component parts interact harmoniously.',
      ],
      suggestedVisual: 'Minimalist bento-grid schematic breaking down the 3 core pillars of the topic.',
      speakingPoint: 'Pay close attention to these core definitions. Master these terms now so you can fluidly apply them during our hands-on activity.',
    },
    {
      slideNumber: 5,
      title: 'Examples & Practical Applications',
      content: [
        'Example 1: Step-by-step breakdown of a baseline textbook scenario.',
        'Example 2: Analyzing a real-world case study in contemporary industry or nature.',
        'Comparative View: What happens when core parameters are increased or decreased?',
        'Best Practice: Watch out for common pitfalls and sign errors.',
      ],
      suggestedVisual: 'Side-by-side comparative table contrasting standard execution with a frequent error.',
      speakingPoint: 'Notice the difference in this worked example. Notice how adhering strictly to the operational sequence guarantees an accurate outcome.',
    },
    {
      slideNumber: 6,
      title: 'Classroom Activity: Collaborative Challenge',
      content: [
        'Step 1: Assemble in your designated peer pairs (2 minutes).',
        'Step 2: Examine the problem scenario provided on your worksheets.',
        'Step 3: Apply our 3-step decision matrix to formulate a solution.',
        'Step 4: Be prepared to share your methodology with the classroom.',
      ],
      suggestedVisual: 'Student collaboration photo or diagram showing two learners mapping ideas on a whiteboard.',
      speakingPoint: 'Turn to your shoulder partner. You have 8 minutes to solve the challenge scenario. I will circulate around the room to answer questions.',
    },
    {
      slideNumber: 7,
      title: 'Quick Revision: Key Takeaways',
      content: [
        `✅ Concept Core: What constitutes the essential definition of ${topic}?`,
        '✅ Primary Mechanism: How do the components operate and interact?',
        '✅ Practical Impact: Where do we observe this principle in daily life?',
        '✅ Diagnostic Check: The one critical pitfall to always guard against.',
      ],
      suggestedVisual: 'Summary checklist card with clean green indicators for rapid retention.',
      speakingPoint: 'Let us do a 60-second summary check. Call out answers together as we review the four primary pillars of our discussion today.',
    },
    {
      slideNumber: 8,
      title: 'Assessment & Exit Ticket',
      content: [
        `Exit Slip Question: Summarize the central idea of ${topic} in one single sentence.`,
        'Homework Assignment: Complete practice exercises 1-5 in your workbook.',
        'Digital Assessment: Take our 10-question Google Forms self-grading quiz tonight.',
        'Preview for Next Lesson: Expanding these principles to advanced systems.',
      ],
      suggestedVisual: 'Checklist icon alongside a tablet displaying the interactive Google Forms quiz interface.',
      speakingPoint: 'Write your one-sentence summary on your exit ticket. Hand it to me on your way out the door. Great work today!',
    },
  ];
}

export function generateQuiz(subject: string, grade: string, topic: string): QuizQuestionData[] {
  const isPhotosynthesis = topic.toLowerCase().includes('photo') || topic.toLowerCase().includes('plant');

  if (isPhotosynthesis) {
    return [
      {
        id: 1,
        type: 'mcq',
        question: 'Which green pigment in plant leaves is primarily responsible for absorbing sunlight energy during photosynthesis?',
        options: ['Hemoglobin', 'Melanin', 'Chlorophyll', 'Carotene'],
        correctAnswer: 'Chlorophyll',
        marks: 1,
        explanation: 'Chlorophyll is the primary photosynthetic green pigment situated within chloroplast thylakoid membranes that captures solar energy.',
        autoGrading: true,
      },
      {
        id: 2,
        type: 'mcq',
        question: 'Through which microscopic openings on the underside of leaves does carbon dioxide gas enter the plant?',
        options: ['Chloroplasts', 'Stomata', 'Xylem vessels', 'Root hairs'],
        correctAnswer: 'Stomata',
        marks: 1,
        explanation: 'Stomata are microscopic pores flanked by guard cells that open and close to facilitate gas exchange (CO2 in, O2 out).',
        autoGrading: true,
      },
      {
        id: 3,
        type: 'mcq',
        question: 'What are the two primary end products generated by the photosynthetic reaction?',
        options: ['Carbon dioxide and water', 'Glucose and oxygen', 'Starch and nitrogen', 'Protein and carbon dioxide'],
        correctAnswer: 'Glucose and oxygen',
        marks: 1,
        explanation: 'Photosynthesis transforms inorganic carbon dioxide and water into glucose (food sugar) and oxygen (liberated gas).',
        autoGrading: true,
      },
      {
        id: 4,
        type: 'mcq',
        question: 'How is water transported from the surrounding soil to the green leaves of a tall tree?',
        options: ['Absorbed directly through leaf stomata from humidity', 'Transported upward through xylem vessels from root hair cells', 'Pumped downward from rain collecting in flowers', 'Diffusing through exterior bark pores'],
        correctAnswer: 'Transported upward through xylem vessels from root hair cells',
        marks: 1,
        explanation: 'Root hair cells absorb soil water via osmosis, which travels through specialized xylem tubes up to photosynthetic leaves.',
        autoGrading: true,
      },
      {
        id: 5,
        type: 'mcq',
        question: 'Into what kind of energy is radiant solar sunlight converted during photosynthesis?',
        options: ['Sound energy', 'Nuclear energy', 'Thermal energy', 'Chemical energy'],
        correctAnswer: 'Chemical energy',
        marks: 1,
        explanation: 'Solar radiant light is converted into stable chemical energy stored within the carbon bonds of glucose sugar molecules.',
        autoGrading: true,
      },
      {
        id: 6,
        type: 'mcq',
        question: 'In which cellular organelle does photosynthesis take place inside plant cells?',
        options: ['Cell Nucleus', 'Mitochondria', 'Chloroplast', 'Vacuole'],
        correctAnswer: 'Chloroplast',
        marks: 1,
        explanation: 'Chloroplasts are specialized plant organelles containing thylakoid discs and stroma enzymes that host the photosynthetic machinery.',
        autoGrading: true,
      },
      {
        id: 7,
        type: 'mcq',
        question: 'In what chemical form do plants store surplus glucose for nighttime or seasonal energy reserves?',
        options: ['Insoluble starch', 'Gaseous methane', 'Liquid petroleum', 'Dissolved mineral salt'],
        correctAnswer: 'Insoluble starch',
        marks: 1,
        explanation: 'Plants polymerize excess glucose into insoluble starch grains stored within roots, tubers, stems, and leaf cells.',
        autoGrading: true,
      },
      {
        id: 8,
        type: 'true_false',
        question: 'Photosynthesis can continue at maximum speed in absolute darkness as long as the plant is given abundant water and warm soil.',
        options: ['True', 'False'],
        correctAnswer: 'False',
        marks: 1,
        explanation: 'Light is mandatory for the light-dependent phase of photosynthesis; without light photon excitation, food synthesis ceases.',
        autoGrading: true,
      },
      {
        id: 9,
        type: 'true_false',
        question: 'The oxygen gas molecules released by green plants originate directly from splitting water (H2O) molecules during the light reaction.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        marks: 1,
        explanation: 'Photolysis splits water molecules into hydrogen ions, electrons, and oxygen gas (O2), releasing oxygen into the atmosphere.',
        autoGrading: true,
      },
      {
        id: 10,
        type: 'application',
        question: 'Application Challenge: A botanist places a healthy potted geranium inside an airtight sealed glass jar under continuous bright sunlight for 5 days without opening the lid or adding water. Explain which factor will eventually limit and halt photosynthesis, and describe what happens to the internal atmosphere.',
        correctAnswer: 'Depletion of carbon dioxide (CO2) inside the sealed jar, followed by water stress. As the plant consumes all available CO2 gas within the sealed enclosure, photosynthesis slows down and halts because a vital carbon reactant is exhausted. Oxygen levels will initially spike and then stabilize.',
        marks: 1,
        explanation: 'Carbon dioxide is a finite reactant in an enclosed space. Once the plant metabolizes the enclosed CO2, the rate of photosynthesis plummets to zero regardless of available light energy.',
        autoGrading: false,
      },
    ];
  }

  // General Subject Quiz
  return [
    {
      id: 1,
      type: 'mcq',
      question: `What is the fundamental definition or core principle that characterizes ${topic}?`,
      options: [
        `The primary rule establishing how ${topic} operates under standard conditions`,
        'An unrelated secondary effect observed only in rare laboratory anomalies',
        'A historical theory that has been entirely replaced in modern curricula',
        'An optional calculation technique used only for informal approximations',
      ],
      correctAnswer: `The primary rule establishing how ${topic} operates under standard conditions`,
      marks: 1,
      explanation: `By definition, ${topic} is structured around this primary operational rule that governs its behavior across canonical scenarios.`,
      autoGrading: true,
    },
    {
      id: 2,
      type: 'mcq',
      question: `Which key component or variable plays an essential role in driving the outcomes of ${topic}?`,
      options: ['The active governing variable', 'An inert decorative element', 'A static placeholder value', 'A discarded historical unit'],
      correctAnswer: 'The active governing variable',
      marks: 1,
      explanation: 'The governing variable directly determines the rate, magnitude, and direction of transformation in the system.',
      autoGrading: true,
    },
    {
      id: 3,
      type: 'mcq',
      question: `When analyzing a practical problem involving ${topic}, what is the recommended first procedural step?`,
      options: [
        'Identify known variables and state the governing formula or framework',
        'Guess the final value before reading the question parameters',
        'Invert all input values arbitrarily without justification',
        'Skip the structural setup and write down a single unverified number',
      ],
      correctAnswer: 'Identify known variables and state the governing formula or framework',
      marks: 1,
      explanation: 'Systematic problem solving always begins by cataloging givens, identifying unknowns, and selecting the validated framework.',
      autoGrading: true,
    },
    {
      id: 4,
      type: 'mcq',
      question: `How does an increase in the primary input parameter typically influence the final system output in ${topic}?`,
      options: [
        'It produces a predictable, directly correlated change based on governing principles',
        'It causes the entire system to spontaneously vanish',
        'It has permanently zero effect under any conceivable circumstance',
        'It reverses the chronological order of events',
      ],
      correctAnswer: 'It produces a predictable, directly correlated change based on governing principles',
      marks: 1,
      explanation: 'Governing relationships ensure that shifting inputs translates into consistent and mathematically or logically predictable outcomes.',
      autoGrading: true,
    },
    {
      id: 5,
      type: 'mcq',
      question: `Which of the following represents a classic real-world application of ${topic}?`,
      options: [
        'Industrial, natural, or computational workflows operating in everyday environments',
        'Fictional folklore unrelated to empirical observations',
        'Decorative artistic flourishes without structural utility',
        'Obsolete medieval myths regarding physical matter',
      ],
      correctAnswer: 'Industrial, natural, or computational workflows operating in everyday environments',
      marks: 1,
      explanation: 'The concepts behind this topic are applied extensively in contemporary science, technology, and social analysis.',
      autoGrading: true,
    },
    {
      id: 6,
      type: 'mcq',
      question: `What common mistake do beginner students frequently make when working with ${topic}?`,
      options: [
        'Confusing cause and effect or misapplying baseline units of measurement',
        'Writing with an excessively sharp pencil',
        'Double-checking calculations thoroughly',
        'Organizing their notes in neat chronological order',
      ],
      correctAnswer: 'Confusing cause and effect or misapplying baseline units of measurement',
      marks: 1,
      explanation: 'Unit conversion oversights and confusing dependent variables with independent variables are classic beginner stumbling blocks.',
      autoGrading: true,
    },
    {
      id: 7,
      type: 'mcq',
      question: `Which statement accurately contrasts the theoretical ideal model of ${topic} with real-world observed conditions?`,
      options: [
        'Theoretical models often assume ideal conditions, whereas real scenarios account for environmental friction and resistance',
        'Real-world conditions never follow any discernible natural laws',
        'Theoretical models are always completely false and useless',
        'There is never any difference between ideal textbook models and raw field data',
      ],
      correctAnswer: 'Theoretical models often assume ideal conditions, whereas real scenarios account for environmental friction and resistance',
      marks: 1,
      explanation: 'Scientists and engineers use idealized models as benchmarks, subsequently adjusting for friction, resistance, or systemic noise.',
      autoGrading: true,
    },
    {
      id: 8,
      type: 'true_false',
      question: `True or False: The fundamental laws and relationships governing ${topic} remain consistent regardless of geographical location.`,
      options: ['True', 'False'],
      correctAnswer: 'True',
      marks: 1,
      explanation: 'Core scientific and mathematical principles represent universal invariants that apply universally across identical boundary conditions.',
      autoGrading: true,
    },
    {
      id: 9,
      type: 'true_false',
      question: `True or False: In ${topic}, it is impossible to evaluate or test a hypothesis through controlled empirical experimentation.`,
      options: ['True', 'False'],
      correctAnswer: 'False',
      marks: 1,
      explanation: 'Hypotheses within this domain can be rigorously validated, refined, or falsified through structured experiments and observational trials.',
      autoGrading: true,
    },
    {
      id: 10,
      type: 'application',
      question: `Application & Reasoning Challenge: Describe a scenario where a sudden unexpected shift in environmental or structural constraints alters the normal behavior of ${topic}. What diagnostic steps would you implement to isolate the root cause?`,
      correctAnswer: 'First, measure and isolate baseline parameters against expected standard values. Second, systematically test each variable independently while holding others constant. Third, formulate an evidence-based conclusion tracing the observed deviation back to the perturbed input.',
      marks: 1,
      explanation: 'Rigorous diagnostic reasoning requires isolating variables, contrasting observed anomalies against baseline controls, and establishing root-cause causality.',
      autoGrading: false,
    },
  ];
}

export function generateWorkshopPackage(
  subject: string,
  grade: string,
  topic: string,
  duration: string
): WorkshopPackage {
  return {
    id: `workshop-${Date.now()}`,
    subject,
    grade,
    topic,
    duration,
    createdAt: Date.now(),
    lessonPlan: generateLessonPlan(subject, grade, topic, duration),
    students: generateStudents(subject, topic),
    slides: generateSlides(subject, grade, topic),
    quiz: generateQuiz(subject, grade, topic),
    checklist: {
      docsCompleted: true,
      sheetsCompleted: true,
      slidesCompleted: true,
      formsCompleted: true,
    },
  };
}

// ==========================================
// Exporters & Formatters
// ==========================================

export function formatLessonPlanForGoogleDocs(plan: LessonPlanData): string {
  return `LESSON PLAN: ${plan.topic.toUpperCase()}

1. Subject: ${plan.subject}
2. Class / Grade: ${plan.grade}
3. Topic: ${plan.topic}
4. Duration: ${plan.duration}

=======================================================
5. LEARNING OBJECTIVES
=======================================================
${plan.learningObjectives.map((obj, i) => `• ${obj}`).join('\n')}

=======================================================
6. LEARNING OUTCOMES
=======================================================
By the end of this lesson, students will be able to:
${plan.learningOutcomes.map((out, i) => `• ${out}`).join('\n')}

=======================================================
7. PREVIOUS KNOWLEDGE
=======================================================
${plan.previousKnowledge.map((pk) => `• ${pk}`).join('\n')}

=======================================================
8. INTRODUCTION / WARM-UP ACTIVITY (${plan.warmupActivity.time})
=======================================================
Title: ${plan.warmupActivity.title}
${plan.warmupActivity.description}

=======================================================
9. TEACHING AND LEARNING ACTIVITIES
=======================================================
${plan.teachingActivities.map((act, i) => `[${act.time}] ${act.step}:\n${act.details}`).join('\n\n')}

=======================================================
10. EXAMPLES
=======================================================
${plan.examples.map((ex, i) => `• Example ${i + 1}: ${ex}`).join('\n')}

=======================================================
11. STUDENT ACTIVITY (${plan.studentActivity.time})
=======================================================
Title: ${plan.studentActivity.title}
Instructions:
${plan.studentActivity.instructions.map((ins, i) => `  ${i + 1}. ${ins}`).join('\n')}

=======================================================
12. ASSESSMENT QUESTIONS
=======================================================
${plan.assessmentQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

=======================================================
13. HOMEWORK
=======================================================
${plan.homework.map((hw, i) => `• ${hw}`).join('\n')}

=======================================================
14. DIFFERENTIATION / SUPPORT FOR SLOW LEARNERS
=======================================================
${plan.differentiationSlowLearners.map((d) => `• ${d}`).join('\n')}

=======================================================
15. EXTENSION ACTIVITY FOR ADVANCED LEARNERS
=======================================================
${plan.extensionAdvancedLearners.map((e) => `• ${e}`).join('\n')}
`;
}

export function downloadLessonPlanAsDoc(plan: LessonPlanData) {
  const content = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${plan.topic} - Lesson Plan</title>
<style>
  body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #1e293b; padding: 40px; }
  h1 { color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; }
  h2 { color: #1d4ed8; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
  h3 { color: #2563eb; }
  .meta { background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
  .meta-item { margin: 6px 0; font-weight: 500; }
  ul { padding-left: 20px; }
  li { margin-bottom: 6px; }
  .step-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 12px 16px; margin-bottom: 12px; }
</style>
</head>
<body>
  <h1>${plan.topic} - Professional Lesson Plan</h1>
  <div class="meta">
    <div class="meta-item"><strong>1. Subject:</strong> ${plan.subject}</div>
    <div class="meta-item"><strong>2. Class / Grade:</strong> ${plan.grade}</div>
    <div class="meta-item"><strong>3. Topic:</strong> ${plan.topic}</div>
    <div class="meta-item"><strong>4. Duration:</strong> ${plan.duration}</div>
  </div>

  <h2>5. Learning Objectives</h2>
  <ul>
    ${plan.learningObjectives.map((o) => `<li>${o}</li>`).join('')}
  </ul>

  <h2>6. Learning Outcomes</h2>
  <ul>
    ${plan.learningOutcomes.map((o) => `<li>${o}</li>`).join('')}
  </ul>

  <h2>7. Previous Knowledge</h2>
  <ul>
    ${plan.previousKnowledge.map((pk) => `<li>${pk}</li>`).join('')}
  </ul>

  <h2>8. Introduction / Warm-Up Activity (${plan.warmupActivity.time})</h2>
  <div class="step-box">
    <strong>${plan.warmupActivity.title}</strong>
    <p>${plan.warmupActivity.description}</p>
  </div>

  <h2>9. Teaching & Learning Activities</h2>
  ${plan.teachingActivities
    .map(
      (a) => `
    <div class="step-box">
      <strong>[${a.time}] ${a.step}</strong>
      <p>${a.details}</p>
    </div>`
    )
    .join('')}

  <h2>10. Examples</h2>
  <ul>
    ${plan.examples.map((e) => `<li>${e}</li>`).join('')}
  </ul>

  <h2>11. Student Activity (${plan.studentActivity.time})</h2>
  <div class="step-box">
    <strong>${plan.studentActivity.title}</strong>
    <ol>
      ${plan.studentActivity.instructions.map((ins) => `<li>${ins}</li>`).join('')}
    </ol>
  </div>

  <h2>12. Assessment Questions</h2>
  <ol>
    ${plan.assessmentQuestions.map((q) => `<li>${q}</li>`).join('')}
  </ol>

  <h2>13. Homework</h2>
  <ul>
    ${plan.homework.map((hw) => `<li>${hw}</li>`).join('')}
  </ul>

  <h2>14. Differentiation / Support for Slow Learners</h2>
  <ul>
    ${plan.differentiationSlowLearners.map((d) => `<li>${d}</li>`).join('')}
  </ul>

  <h2>15. Extension Activity for Advanced Learners</h2>
  <ul>
    ${plan.extensionAdvancedLearners.map((ext) => `<li>${ext}</li>`).join('')}
  </ul>
</body>
</html>`;

  const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${plan.topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_lesson_plan.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatMarksheetForGoogleSheetsTSV(students: StudentMarkRecord[]): string {
  // Generates TSV text with live Google Sheets formulas that paste directly into A1 of Google Sheets!
  const header = ['Student Name', 'Test 1 (20)', 'Test 2 (20)', 'Assignment (10)', 'Activity (10)', 'Final Exam (40)', 'Total (100)', 'Percentage', 'Grade', 'Result'].join('\t');

  const rows = students.map((s, idx) => {
    const rowNum = idx + 2;
    const totalFormula = `=SUM(B${rowNum}:F${rowNum})`;
    const pctFormula = `=G${rowNum}/100`;
    const gradeFormula = `=IFS(H${rowNum}>=0.9,"A",H${rowNum}>=0.75,"B",H${rowNum}>=0.6,"C",H${rowNum}>=0.4,"D",TRUE,"F")`;
    const resultFormula = `=IF(G${rowNum}>=40,"Pass","Fail")`;

    return [s.name, s.test1, s.test2, s.assignment, s.activity, s.finalExam, totalFormula, pctFormula, gradeFormula, resultFormula].join('\t');
  });

  const lastRow = students.length + 1;
  const summaryRows = [
    '',
    ['Class Average', '', '', '', '', '', `=AVERAGE(G2:G${lastRow})`, `=AVERAGE(H2:H${lastRow})`, '', ''].join('\t'),
    ['Highest Mark', '', '', '', '', '', `=MAX(G2:G${lastRow})`, '', '', ''].join('\t'),
    ['Lowest Mark', '', '', '', '', '', `=MIN(G2:G${lastRow})`, '', '', ''].join('\t'),
    ['Passing Count', '', '', '', '', '', '', '', '', `=COUNTIF(J2:J${lastRow},"Pass")`].join('\t'),
    ['Pass Percentage', '', '', '', '', '', '', '', '', `=(COUNTIF(J2:J${lastRow},"Pass")/COUNTA(J2:J${lastRow}))*100`].join('\t'),
  ];

  return [header, ...rows, ...summaryRows].join('\n');
}

export function downloadMarksheetAsCSV(students: StudentMarkRecord[], topic: string) {
  const header = ['Student Name', 'Test 1', 'Test 2', 'Assignment', 'Activity', 'Final Exam', 'Total', 'Percentage', 'Grade', 'Result'].join(',');

  const rows = students.map((s) => {
    const { total, percentage, grade, result } = computeStudentStats(s);
    return [`"${s.name}"`, s.test1, s.test2, s.assignment, s.activity, s.finalExam, total, `${percentage}%`, grade, result].join(',');
  });

  const stats = computeClassStats(students);
  const summary = [
    '',
    `"Class Average",,,,,,"${stats.average}","${stats.average}%",,`,
    `"Highest Mark",,,,,,"${stats.highest}",,,`,
    `"Lowest Mark",,,,,,"${stats.lowest}",,,`,
    `"Pass Count",,,,,,,,, "${stats.passCount} / ${students.length}"`,
    `"Pass Percentage",,,,,,,,, "${stats.passPercentage}%"`,
  ];

  const csvContent = [header, ...rows, ...summary].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_student_marksheet.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatSlidesForGoogleSlides(slides: SlideData[], topic: string): string {
  return `GOOGLE SLIDES PRESENTATION: ${topic.toUpperCase()}
=======================================================
Total Slides: 8
=======================================================

${slides
  .map(
    (s) => `SLIDE ${s.slideNumber}: ${s.title}
-------------------------------------------------------
SLIDE CONTENT:
${s.content.map((c) => `• ${c}`).join('\n')}

SUGGESTED VISUAL / IMAGE:
🖼️ ${s.suggestedVisual}

TEACHER SPEAKING POINT:
🗣️ "${s.speakingPoint}"
=======================================================`
  )
  .join('\n\n')}`;
}

export function formatQuizForGoogleForms(quiz: QuizQuestionData[], topic: string): string {
  return `GOOGLE FORMS QUIZ: ${topic.toUpperCase()}
Total Questions: 10 (10 Marks)
Settings: Quiz Mode > Make this a quiz > Immediately after each submission
=======================================================

${quiz
  .map(
    (q) => `QUESTION ${q.id} [${q.marks} Mark] (${q.autoGrading ? '⚡ Auto-Graded in Google Forms' : '🧠 Application / Rubric'})
Type: ${q.type === 'mcq' ? 'Multiple Choice' : q.type === 'true_false' ? 'True / False' : 'Short Answer / Paragraph'}
Prompt: ${q.question}

${q.options ? q.options.map((opt, i) => `  ${String.fromCharCode(65 + i)}) ${opt}`).join('\n') : ''}

CORRECT ANSWER: ${q.correctAnswer}
EXPLANATION / FEEDBACK:
${q.explanation}
-------------------------------------------------------`
  )
  .join('\n\n')}`;
}
