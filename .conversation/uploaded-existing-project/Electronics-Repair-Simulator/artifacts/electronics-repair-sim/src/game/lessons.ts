import type { Lesson } from '@/types';

export const lessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'What Is Electronics?',
    description: 'Learn the basics of electronics, circuits, and safety.',
    module: 'basics',
    order: 1,
    xpReward: 50,
    pages: [
      {
        type: 'theory',
        title: 'Welcome to Electronics',
        content: `Electronics is the study of how to control electrical energy to do useful work.

A circuit is a complete path that electricity flows through. Think of it like a water pipe system — electricity flows from a source, through wires (like pipes), into components (like faucets or wheels), and back to the source.

The three most important things in electronics are:
- Voltage (V) — the "push" that moves electricity
- Current (I) — the amount of electricity flowing
- Resistance (R) — anything that slows down the flow

Electrical power means using electricity for energy (like a heater or motor). Electronic control means using small electrical signals to make decisions or control things (like a computer or remote control).

Safety: Always disconnect power before working on a circuit. Never touch live wires. Capacitors can hold charge even after power is off.`,
        urduHint: 'Electronics mein hum bijli ko control karte hain. Circuit ek raasta hai jis mein bijli hoti hai. Voltage bijli ko dhakelta hai, Current kitni bijli beh rahi hai, Resistance beh ko roakta hai.',
      },
      {
        type: 'interactive',
        title: 'Identify Circuit Components',
        content: 'Match each component to its correct name. This helps you recognize parts on a real circuit board.',
        interaction: {
          kind: 'component_match',
          data: {
            pairs: [
              { symbol: 'resistor', name: 'Resistor' },
              { symbol: 'capacitor', name: 'Capacitor' },
              { symbol: 'diode', name: 'Diode' },
              { symbol: 'fuse', name: 'Fuse' },
            ],
          },
        },
      },
      {
        type: 'quiz',
        title: 'Quick Check',
        content: 'Answer these questions to test your understanding.',
        quiz: [
          {
            question: 'What is a circuit?',
            options: [
              'A type of battery',
              'A complete path for electricity to flow',
              'A tool for measuring voltage',
              'A type of resistor',
            ],
            correctIndex: 1,
            explanation: 'A circuit is a complete, closed path that electricity flows through.',
          },
          {
            question: 'What does voltage represent?',
            options: [
              'The amount of electricity flowing',
              'The push that moves electricity',
              'Something that slows down electricity',
              'A type of safety device',
            ],
            correctIndex: 1,
            explanation: 'Voltage is the electrical "push" or pressure that moves current through a circuit.',
          },
          {
            question: 'What should you ALWAYS do before working on a circuit?',
            options: [
              'Touch the wires to check if they are live',
              'Disconnect the power',
              'Turn up the voltage',
              'Remove all resistors',
            ],
            correctIndex: 1,
            explanation: 'Always disconnect power before working on any circuit for safety.',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson-2',
    title: 'Voltage, Current, and Resistance',
    description: 'Understand V, I, R and Ohm\'s Law with an interactive calculator.',
    module: 'basics',
    order: 2,
    xpReward: 50,
    requiresLessonId: 'lesson-1',
    pages: [
      {
        type: 'theory',
        title: 'The Three Pillars',
        content: `Voltage (V) is measured in Volts. It is the potential difference — like water pressure in a pipe. A 12V battery pushes harder than a 5V battery.

Current (I) is measured in Amperes (Amps). It is the flow rate — how much electricity is moving. Like how much water flows through a pipe per second.

Resistance (R) is measured in Ohms (Ω). It is anything that opposes current flow — like a narrow section of pipe. A resistor limits how much current flows.

Ohm's Law connects all three:
  V = I × R  (Voltage = Current × Resistance)
  I = V ÷ R  (Current = Voltage ÷ Resistance)
  R = V ÷ I  (Resistance = Voltage ÷ Current)

Example: If a 12V battery connects to a 100Ω resistor, the current is:
  I = 12V ÷ 100Ω = 0.12A = 120mA`,
        urduHint: 'Voltage = dhakka (Volts), Current = beh (Amps), Resistance = rukaawat (Ohms). Ohm ka law: V = I × R. Agar 12V hai aur 100Ω hai, toh Current = 12/100 = 0.12A.',
      },
      {
        type: 'interactive',
        title: 'Ohm\'s Law Calculator',
        content: 'Change the voltage and resistance sliders to see how current changes. Try different values and observe the relationship.',
        interaction: {
          kind: 'ohms_law',
          data: { initialVoltage: 12, initialResistance: 100 },
        },
      },
      {
        type: 'quiz',
        title: 'Ohm\'s Law Quiz',
        content: 'Test your understanding of Ohm\'s Law.',
        quiz: [
          {
            question: 'What is the unit of resistance?',
            options: ['Volts (V)', 'Amperes (A)', 'Ohms (Ω)', 'Watts (W)'],
            correctIndex: 2,
            explanation: 'Resistance is measured in Ohms, symbolized by Ω (the Greek letter Omega).',
          },
          {
            question: 'Using Ohm\'s Law, if V = 10V and R = 200Ω, what is I?',
            options: ['2A', '0.05A', '2000A', '0.5A'],
            correctIndex: 1,
            explanation: 'I = V ÷ R = 10 ÷ 200 = 0.05A (50mA)',
          },
          {
            question: 'What happens to current if resistance increases (voltage stays the same)?',
            options: ['Current increases', 'Current decreases', 'Current stays the same', 'Current becomes zero'],
            correctIndex: 1,
            explanation: 'Since I = V ÷ R, increasing R while V stays constant means I decreases.',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson-3',
    title: 'Series and Parallel Circuits',
    description: 'Learn how components connect in series vs parallel.',
    module: 'basics',
    order: 3,
    xpReward: 50,
    requiresLessonId: 'lesson-2',
    pages: [
      {
        type: 'theory',
        title: 'Two Ways to Connect',
        content: `Series Circuit: Components are connected one after another in a single line. The same current flows through each component. Voltage is divided among them. If one component breaks (opens), the entire circuit stops working.

Example: Christmas lights (old style) — if one bulb burns out, all go dark.

Parallel Circuit: Components are connected across the same two points. Each component gets the full voltage. Current is divided among the branches. If one branch breaks, others keep working.

Example: House wiring — if one lamp breaks, the others still work.

Key rules:
- Series: R_total = R1 + R2 + R3 + ...
- Parallel: 1/R_total = 1/R1 + 1/R2 + 1/R3 + ...
- Series: Same current, divided voltage
- Parallel: Same voltage, divided current`,
        urduHint: 'Series mein sab ek line mein hain — ek kharab hua toh sab band. Parallel mein alag raaste hain — ek kharab hua toh baaki chalte rehte hain.',
      },
      {
        type: 'interactive',
        title: 'Explore Series vs Parallel',
        content: 'Toggle between series and parallel to see how current and voltage change. Click on a component to "break" it and see what happens.',
        interaction: {
          kind: 'series_parallel',
          data: { mode: 'series' },
        },
      },
      {
        type: 'quiz',
        title: 'Circuit Types Quiz',
        content: '',
        quiz: [
          {
            question: 'In a series circuit, if one component opens, what happens?',
            options: ['Other components still work', 'The entire circuit stops', 'Voltage increases', 'Current increases'],
            correctIndex: 1,
            explanation: 'In a series circuit, a break anywhere stops all current flow.',
          },
          {
            question: 'In a parallel circuit, what does each branch receive?',
            options: ['Divided voltage', 'Full voltage', 'Zero voltage', 'Increased current'],
            correctIndex: 1,
            explanation: 'In parallel, each branch gets the full source voltage.',
          },
          {
            question: 'Two 100Ω resistors in series give what total resistance?',
            options: ['50Ω', '100Ω', '200Ω', '400Ω'],
            correctIndex: 2,
            explanation: 'Series resistors add: 100 + 100 = 200Ω.',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson-4',
    title: 'Electronic Components',
    description: 'Learn about resistors, capacitors, diodes, fuses, transistors, and more.',
    module: 'components',
    order: 4,
    xpReward: 75,
    requiresLessonId: 'lesson-3',
    pages: [
      {
        type: 'theory',
        title: 'Component Overview',
        content: `Every electronic component has a job. Here are the most common ones:

RESISTOR: Limits current flow. Has color bands that tell its value. Never goes bad unless burned. Tested with resistance mode.

CAPACITOR: Stores electrical charge temporarily. Used for filtering and smoothing. Can short or open. Tested with resistance (should start low then go high) or capacitance mode.

DIODE: Lets current flow in only ONE direction. Has a stripe marking the cathode (negative). Can short (0V both ways) or open (O.L both ways). Tested with diode mode.

FUSE: Protects against overcurrent. Burns out (opens) if too much current flows. Tested with continuity — should beep.

MOSFET: A switch controlled by voltage. Has Gate, Drain, Source pins. Can short (D-S reads 0Ω) or open. Tested with diode mode between D-S.

VOLTAGE REGULATOR: Produces a fixed output voltage from a higher input. E.g., LM7805 gives 5V. Can fail open (no output) or short (full input passes through). Tested with DC voltage mode.

IC (Integrated Circuit): A complex circuit in one package. Many pins. Hard to test — usually by checking surrounding components and signals.

CONNECTOR: Provides a physical connection point. Can have broken pins or cold solder joints. Tested with continuity.`,
        urduHint: 'Resistor = current limit karta hai. Capacitor = charge store karta hai. Diode = ek direction mein behne deta hai. Fuse = zyada current hone par jal jata hai. MOSFET = voltage se switch karta hai.',
      },
      {
        type: 'interactive',
        title: 'Match Components to Functions',
        content: 'Match each component to what it does.',
        interaction: {
          kind: 'component_match',
          data: {
            pairs: [
              { symbol: 'resistor', name: 'Limits current' },
              { symbol: 'capacitor', name: 'Stores charge' },
              { symbol: 'diode', name: 'One-way flow' },
              { symbol: 'fuse', name: 'Protects circuit' },
              { symbol: 'mosfet', name: 'Voltage switch' },
              { symbol: 'regulator', name: 'Fixed voltage' },
            ],
          },
        },
      },
      {
        type: 'quiz',
        title: 'Component Knowledge Quiz',
        content: '',
        quiz: [
          {
            question: 'What does a fuse do?',
            options: ['Stores energy', 'Protects against too much current', 'Increases voltage', 'Reduces noise'],
            correctIndex: 1,
            explanation: 'A fuse burns out (opens) when current exceeds its rating, protecting the rest of the circuit.',
          },
          {
            question: 'A diode that reads 0V in both directions is:',
            options: ['Normal', 'Open', 'Shorted', 'Overheated'],
            correctIndex: 2,
            explanation: 'A diode should conduct in one direction only. 0V in both directions means it is shorted.',
          },
          {
            question: 'What does an LM7805 regulator output?',
            options: ['12V', '5V', '9V', '3.3V'],
            correctIndex: 1,
            explanation: 'The LM7805 is a 5V linear voltage regulator.',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson-5',
    title: 'Reading a PCB',
    description: 'Learn to identify components, labels, and traces on a circuit board.',
    module: 'components',
    order: 5,
    xpReward: 75,
    requiresLessonId: 'lesson-4',
    pages: [
      {
        type: 'theory',
        title: 'Understanding the Board',
        content: `A PCB (Printed Circuit Board) has copper tracks that connect components. These tracks are like wires embedded in the board.

Reference Designators: Each component has a label printed on the board:
- R1, R2, R3... = Resistors
- C1, C2, C3... = Capacitors
- D1, D2, D3... = Diodes
- Q1, Q2, Q3... = Transistors/MOSFETs
- U1, U2, U3... = ICs/Regulators
- F1, F2... = Fuses
- J1, J2... = Connectors
- L1, L2... = Inductors

Polarity: Some components must be inserted in the right direction. Electrolytic capacitors have a stripe on the negative side. Diodes have a stripe on the cathode. ICs have a dot or notch at pin 1.

Test Points: Small copper pads used for measuring during repair. Labeled TP1, TP2, etc.

Ground (GND): The common reference point, usually connected to the negative terminal. Many test points are ground.`,
        urduHint: 'PCB par R = Resistor, C = Capacitor, D = Diode, Q = MOSFET, U = IC, F = Fuse. TP = Test Point. GND = Ground (zameen).',
      },
      {
        type: 'interactive',
        title: 'Identify Reference Labels',
        content: 'Click on each component label to learn what type it represents.',
        interaction: {
          kind: 'circuit_path',
          data: { labels: ['R1', 'C3', 'D2', 'Q1', 'U5', 'F1'] },
        },
      },
      {
        type: 'quiz',
        title: 'PCB Reading Quiz',
        content: '',
        quiz: [
          {
            question: 'What does "C5" refer to on a PCB?',
            options: ['A connector', 'A capacitor', 'A coil', 'A circuit'],
            correctIndex: 1,
            explanation: 'C followed by a number always refers to a capacitor.',
          },
          {
            question: 'What is a test point (TP)?',
            options: [
              'A place to solder new components',
              'A copper pad for measuring during repair',
              'A type of fuse',
              'A connector for external devices',
            ],
            correctIndex: 1,
            explanation: 'Test points are exposed copper pads designed for probing with a multimeter.',
          },
          {
            question: 'Which component usually has polarity markings?',
            options: ['Resistor', 'Electrolytic capacitor', 'Fuse', 'Jumper wire'],
            correctIndex: 1,
            explanation: 'Electrolytic capacitors must be installed with correct polarity — the negative side is marked with a stripe.',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson-6',
    title: 'Learning the Multimeter',
    description: 'Master all four multimeter modes with interactive practice.',
    module: 'tools',
    order: 6,
    xpReward: 75,
    requiresLessonId: 'lesson-5',
    pages: [
      {
        type: 'theory',
        title: 'The Multimeter',
        content: `A multimeter is the most important tool for electronics repair. It has four main modes:

DC VOLTAGE (V=): Measures the voltage difference between two points. Red probe goes to the positive point, black probe to ground. Range: millivolts to hundreds of volts.

RESISTANCE (Ω): Measures how much a component resists current. IMPORTANT: Power must be OFF when measuring resistance! Measuring on a powered circuit gives wrong readings and can damage the meter.

CONTINUITY (♪): Tests if two points are electrically connected. Beeps if resistance is very low (typically under 50Ω). Great for checking fuses, traces, and switches.

DIODE TEST (▶): Measures the forward voltage drop across a diode or transistor junction. Good diode reads 0.5-0.7V in one direction, O.L in reverse. Shorted = 0V both ways. Open = O.L both ways.

Probe colors: RED is positive, BLACK is ground/common. Always connect black probe to ground first.`,
        urduHint: 'Multimeter ke 4 mode: Voltage (V), Resistance (Ω), Continuity (beep), Diode test. Resistance napein hamesha power band kar ke karein. Red = positive, Black = ground.',
      },
      {
        type: 'interactive',
        title: 'Choose the Right Mode',
        content: 'For each measurement task, select the correct multimeter mode.',
        interaction: {
          kind: 'multimeter_mode',
          data: {
            scenarios: [
              { task: 'Check if a fuse is broken', mode: 'continuity' },
              { task: 'Measure output of a 5V regulator', mode: 'dc_voltage' },
              { task: 'Check if a diode is shorted', mode: 'diode_test' },
              { task: 'Measure a 1kΩ resistor value', mode: 'resistance' },
            ],
          },
        },
      },
      {
        type: 'quiz',
        title: 'Multimeter Safety Quiz',
        content: '',
        quiz: [
          {
            question: 'Which mode should you use to check if a fuse is intact?',
            options: ['DC Voltage', 'Resistance', 'Continuity', 'Diode Test'],
            correctIndex: 2,
            explanation: 'Continuity mode beeps if the fuse is intact (low resistance). A blown fuse will not beep.',
          },
          {
            question: 'Why must power be OFF when measuring resistance?',
            options: [
              'It wastes battery',
              'Live circuit gives wrong readings and can damage the meter',
              'It is faster with power off',
              'Resistance does not exist with power on',
            ],
            correctIndex: 1,
            explanation: 'Measuring resistance on a powered circuit can give false readings and potentially damage the multimeter.',
          },
          {
            question: 'A good diode in diode test mode reads:',
            options: ['0V in both directions', 'O.L in both directions', '0.6V one way, O.L the other', '5V in both directions'],
            correctIndex: 2,
            explanation: 'A healthy diode conducts in one direction (~0.6V drop) and blocks in the other (O.L).',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson-7',
    title: 'Understanding Power Supplies',
    description: 'Learn how a power supply works: input, rectifier, filter, regulator.',
    module: 'tools',
    order: 7,
    xpReward: 75,
    requiresLessonId: 'lesson-6',
    pages: [
      {
        type: 'theory',
        title: 'Power Supply Basics',
        content: `A linear power supply converts high voltage AC into stable low voltage DC. Here is how it works step by step:

1. INPUT: Power enters through a connector or transformer.

2. FUSE: Protects against overcurrent. If too much current flows, the fuse burns out (opens) to protect the rest of the circuit.

3. RECTIFIER (Diodes): Converts AC (alternating current) to pulsating DC. Diodes only let current flow one way.

4. FILTER (Capacitor): Smooths the pulsating DC into a more stable voltage. A large capacitor (like 1000µF) charges and discharges to fill the gaps.

5. REGULATOR: Produces a precise, fixed output voltage. An LM7812 gives exactly 12V. An LM7805 gives 5V.

6. OUTPUT: The clean, regulated DC voltage is available at the output connector.

Common faults:
- Blown fuse: No output at all
- Shorted diode: Fuse blows again, or input voltage passes through
- Bad capacitor: Ripply or unstable output
- Failed regulator: No output, or full input voltage at output

NOTE: This is an educational simulation. Real mains power supplies contain dangerous high voltage. Never open or repair real mains equipment without proper training.`,
        urduHint: 'Power supply: Input -> Fuse -> Diode (AC to DC) -> Capacitor (smooth) -> Regulator (fixed voltage) -> Output. Agar fuse jal jaye toh output zero ho jata hai.',
      },
      {
        type: 'interactive',
        title: 'Power Supply Fault Identification',
        content: 'Given the symptoms, identify which component is most likely faulty.',
        interaction: {
          kind: 'fault_identify',
          data: {
            cases: [
              { symptom: 'No output at all, fuse reads open', fault: 'fuse', component: 'F1' },
              { symptom: 'Output voltage is same as input voltage', fault: 'regulator', component: 'U1' },
              { symptom: 'Output is unstable/ripple', fault: 'capacitor', component: 'C1' },
            ],
          },
        },
      },
      {
        type: 'quiz',
        title: 'Power Supply Quiz',
        content: '',
        quiz: [
          {
            question: 'What does the filter capacitor do in a power supply?',
            options: ['Converts AC to DC', 'Smooths pulsating DC', 'Regulates voltage', 'Protects against overcurrent'],
            correctIndex: 1,
            explanation: 'The filter capacitor smooths the pulsating DC from the rectifier into a more stable voltage.',
          },
          {
            question: 'If the output is 0V and the fuse is open, what is the likely fault?',
            options: ['The regulator is shorted', 'The fuse is blown', 'The capacitor is bad', 'The diode is shorted'],
            correctIndex: 1,
            explanation: 'An open fuse breaks the circuit — no power reaches the rest of the board.',
          },
          {
            question: 'What does an LM7812 regulator output?',
            options: ['5V', '12V', '24V', 'Adjustable voltage'],
            correctIndex: 1,
            explanation: 'The LM7812 is a 12V fixed linear voltage regulator.',
          },
        ],
      },
    ],
  },
  {
    id: 'lesson-8',
    title: 'Fault Finding Method',
    description: 'Learn a systematic approach to diagnosing and repairing faults.',
    module: 'repair',
    order: 8,
    xpReward: 100,
    requiresLessonId: 'lesson-7',
    pages: [
      {
        type: 'theory',
        title: 'The Diagnostic Method',
        content: `Good repair is about following a systematic process, not guessing. Here is the method professionals use:

STEP 1 — UNDERSTAND THE SYMPTOM: What does the customer report? "No output," "gets hot," "works intermittently." This tells you where to start looking.

STEP 2 — VISUAL INSPECTION: Look for burned components, bulging capacitors, cracked solder joints, or broken connectors. Many faults are visible.

STEP 3 — IDENTIFY THE SECTION: Which part of the circuit could cause this symptom? For "no output," check the power supply section first.

STEP 4 — CHOOSE A TEST: Pick the right multimeter mode. Voltage for powered tests, resistance/continuity for unpowered tests, diode test for semiconductors.

STEP 5 — MEASURE: Place probes on the correct test points. Red on the test point, black on ground. Compare with expected values.

STEP 6 — COMPARE: Is the reading normal or abnormal? A 12V output reading 0V is abnormal. A fuse reading O.L is abnormal.

STEP 7 — IDENTIFY THE FAULT: Based on the readings, which component is faulty? Is it open, shorted, or drifted?

STEP 8 — REPAIR: Remove the faulty component and install a correct replacement. Wrong value or wrong type = failed repair.

STEP 9 — VERIFY: Run the post-repair test. Check output voltage and all target components. If it passes, the repair is complete.

Common fault types:
- OPEN: Component has no connection (infinite resistance, O.L)
- SHORT: Component passes everything (0Ω, 0V drop)
- VALUE DRIFT: Component value has changed significantly`,
        urduHint: 'Fault finding: 1) Symptom samjho 2) Visual inspection 3) Circuit section pehchano 4) Sahi mode chuno 5) Measure karo 6) Compare karo 7) Fault identify karo 8) Repair karo 9) Verify karo.',
      },
      {
        type: 'interactive',
        title: 'Practice Fault Identification',
        content: 'Given measurement results, identify whether the component is open, shorted, or normal.',
        interaction: {
          kind: 'fault_identify',
          data: {
            cases: [
              { symptom: 'Diode reads 0V in both directions', fault: 'short', component: 'Diode' },
              { symptom: 'Resistor reads O.L (infinite)', fault: 'open', component: 'Resistor' },
              { symptom: 'Fuse beeps in continuity mode', fault: 'none', component: 'Fuse' },
              { symptom: 'Capacitor reads 0Ω in resistance mode', fault: 'short', component: 'Capacitor' },
              { symptom: 'MOSFET D-S reads 0Ω', fault: 'short', component: 'MOSFET' },
            ],
          },
        },
      },
      {
        type: 'quiz',
        title: 'Final Assessment',
        content: 'This final quiz covers everything you have learned. Pass it to unlock guided repair!',
        quiz: [
          {
            question: 'What is the FIRST step in fault finding?',
            options: ['Replace components randomly', 'Understand the reported symptom', 'Measure every test point', 'Remove all components'],
            correctIndex: 1,
            explanation: 'Always start by understanding what the customer reported — it guides your entire diagnosis.',
          },
          {
            question: 'A capacitor reads 0Ω in resistance mode. What is wrong?',
            options: ['It is normal', 'It is open', 'It is shorted', 'It needs charging'],
            correctIndex: 2,
            explanation: 'A capacitor should read as open (O.L) in resistance mode. 0Ω means it is shorted.',
          },
          {
            question: 'After replacing a component, what must you do?',
            options: ['Nothing — the repair is done', 'Run the post-repair test to verify', 'Remove the component again', 'Measure the input voltage only'],
            correctIndex: 1,
            explanation: 'Always verify the repair with a post-repair test before considering the job complete.',
          },
          {
            question: 'A regulator outputs the same voltage as the input. What is the fault?',
            options: ['Normal operation', 'Regulator is open', 'Regulator is shorted', 'Fuse is blown'],
            correctIndex: 2,
            explanation: 'If input voltage passes straight through, the regulator has failed short.',
          },
          {
            question: 'Which multimeter mode is best for checking a broken trace?',
            options: ['DC Voltage', 'Resistance', 'Continuity', 'Diode Test'],
            correctIndex: 2,
            explanation: 'Continuity mode beeps when points are connected. No beep means the trace is broken.',
          },
        ],
      },
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id);
}

export function isLessonUnlocked(lessonId: string, completedLessons: string[]): boolean {
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return false;
  if (!lesson.requiresLessonId) return true;
  return completedLessons.includes(lesson.requiresLessonId);
}

export function getNextLesson(completedLessons: string[]): Lesson | undefined {
  return lessons.find((l) => !completedLessons.includes(l.id) && isLessonUnlocked(l.id, completedLessons));
}

export function getAllLessonsCompleted(completedLessons: string[]): boolean {
  return lessons.every((l) => completedLessons.includes(l.id));
}
