import type { Language } from '@/types';

export type TranslationKey =
  | 'app.title'
  | 'app.subtitle'
  | 'app.tagline'
  // MainMenu
  | 'menu.continueLearning'
  | 'menu.level'
  | 'menu.lessons'
  | 'menu.repairs'
  | 'menu.academy'
  | 'menu.academyStartHere'
  | 'menu.academyComplete'
  | 'menu.guidedRepair'
  | 'menu.guidedRepairLocked'
  | 'menu.guidedRepairComplete'
  | 'menu.guidedRepairReady'
  | 'menu.repairJobs'
  | 'menu.repairJobsLocked'
  | 'menu.repairJobsAvailable'
  | 'menu.workshop'
  | 'menu.workshop3D'
  | 'menu.components'
  | 'menu.componentsRef'
  | 'menu.progress'
  | 'menu.progressAchievements'
  | 'menu.settings'
  | 'menu.reset'
  | 'menu.resetConfirmTitle'
  | 'menu.resetConfirmBody'
  | 'menu.cancel'
  | 'menu.reset'
  // Settings
  | 'settings.title'
  | 'settings.soundEffects'
  | 'settings.soundDesc'
  | 'settings.volume'
  | 'settings.showSchematic'
  | 'settings.showSchematicDesc'
  | 'settings.language'
  | 'settings.languageDesc'
  | 'settings.english'
  | 'settings.romanUrdu'
  | 'settings.resetProgress'
  | 'settings.resetProgressDesc'
  | 'settings.resetAll'
  | 'settings.resetConfirm'
  | 'settings.yesReset'
  // PCBInspection
  | 'pcb.backToWorkshop'
  | 'pcb.schematic'
  | 'pcb.pcbView'
  | 'pcb.probesAndMeter'
  | 'pcb.proAutoRange'
  | 'pcb.standard'
  | 'pcb.red'
  | 'pcb.black'
  | 'pcb.redProbe'
  | 'pcb.blackProbe'
  | 'pcb.selectDot'
  | 'pcb.changeRed'
  | 'pcb.changeBlack'
  | 'pcb.clear'
  | 'pcb.measure'
  | 'pcb.setProbesMeasure'
  | 'pcb.selectTestPointRed'
  | 'pcb.selectTestPointBlack'
  | 'pcb.selectTestPoint'
  | 'pcb.cancel'
  | 'pcb.component'
  | 'pcb.reference'
  | 'pcb.type'
  | 'pcb.value'
  | 'pcb.package'
  | 'pcb.remove'
  | 'pcb.install'
  | 'pcb.removed'
  | 'pcb.replaced'
  | 'pcb.faulty'
  | 'pcb.normal'
  | 'pcb.removedTag'
  | 'pcb.objectives'
  | 'pcb.hints'
  | 'pcb.hintsUsed'
  | 'pcb.getHint'
  | 'pcb.runPostRepairTest'
  | 'pcb.repairSuccessful'
  | 'pcb.repairFailed'
  | 'pcb.leaveRepairTitle'
  | 'pcb.leaveRepairBody'
  | 'pcb.stay'
  | 'pcb.goHome'
  | 'pcb.inspect'
  | 'pcb.measureTool'
  | 'pcb.removeTool'
  | 'pcb.installReplacement'
  | 'pcb.selectReplacement'
  | 'pcb.compatibleParts'
  | 'pcb.incompatibleParts'
  | 'pcb.noCompatibleParts'
  | 'pcb.qty'
  // Workshop3D
  | 'workshop.workshop'
  | 'workshop.electronicsLab'
  | 'workshop.continueRepair'
  | 'workshop.dragRotate'
  | 'workshop.activeRepairBoard'
  | 'workshop.bench2'
  | 'workshop.home'
  | 'workshop.library'
  | 'workshop.missions'
  | 'workshop.shop'
  | 'workshop.inventory'
  | 'workshop.settingsBtn'
  // MissionSelect
  | 'missions.title'
  | 'missions.subtitle'
  | 'missions.requiresLevel'
  | 'missions.done'
  | 'missions.parts'
  // Shop
  | 'shop.title'
  | 'shop.subtitle'
  | 'shop.purchased'
  | 'shop.tools'
  | 'shop.workshopCat'
  | 'shop.inventoryCat'
  | 'shop.diagnostics'
  // Inventory
  | 'inventory.title'
  | 'inventory.subtitle'
  | 'inventory.empty'
  | 'inventory.emptyDesc'
  | 'inventory.resistors'
  | 'inventory.capacitors'
  | 'inventory.diodes'
  | 'inventory.fuses'
  | 'inventory.mosfets'
  | 'inventory.regulators'
  | 'inventory.ics'
  | 'inventory.connectors'
  | 'inventory.inductors'
  | 'inventory.leds'
  // PauseMenu
  | 'pause.paused'
  | 'pause.resume'
  | 'pause.backToWorkshop'
  | 'pause.mainMenu'
  | 'pause.resetProgress'
  | 'pause.confirmReset'
  // RepairReport
  | 'report.repairComplete'
  | 'report.repairFailed'
  | 'report.repairCompleteDesc'
  | 'report.repairFailedDesc'
  | 'report.grade'
  | 'report.accuracy'
  | 'report.reward'
  | 'report.xpEarned'
  | 'report.time'
  | 'report.wrongAttempts'
  | 'report.hintsUsed'
  | 'report.returnToWorkshop'
  | 'report.backToRepairBoard'
  // Academy
  | 'academy.title'
  | 'academy.subtitle'
  | 'academy.start'
  | 'academy.review'
  | 'academy.score'
  | 'academy.nextLesson'
  | 'academy.locked'
  // LessonViewer
  | 'lesson.next'
  | 'lesson.previous'
  | 'lesson.complete'
  | 'lesson.finish'
  | 'lesson.question'
  | 'lesson.correct'
  | 'lesson.incorrect'
  | 'lesson.score'
  | 'lesson.explanation'
  | 'lesson.home'
  // ComponentLibrary
  | 'library.title'
  | 'library.subtitle'
  | 'library.function'
  | 'library.howItWorks'
  | 'library.failureSymptoms'
  | 'library.testingMethod'
  | 'library.applications'
  | 'library.commonMistakes'
  | 'library.exampleValue'
  // ProgressScreen
  | 'progress.title'
  | 'progress.level'
  | 'progress.xp'
  | 'progress.money'
  | 'progress.repairsCompleted'
  | 'progress.lessonsCompleted'
  | 'progress.upgrades'
  // HUD
  | 'hud.pause'
  // GuidedRepair
  | 'guided.step'
  | 'guided.complete'
  | 'guided.backToAcademy'
  // Common
  | 'common.home'
  | 'common.back'
  | 'common.insufficientMoney'
  // Electronics explanations
  | 'electronics.voltage'
  | 'electronics.current'
  | 'electronics.resistance'
  | 'electronics.capacitor'
  | 'electronics.diode'
  | 'electronics.fuse'
  | 'electronics.mosfet'
  | 'electronics.pcb'
  | 'electronics.ol'
  | 'electronics.shortCircuit'
  | 'electronics.invalidMeasurement';

type TranslationDict = Record<TranslationKey, string>;

const en: TranslationDict = {
  'app.title': 'Electronics Academy',
  'app.subtitle': 'Repair Simulator',
  'app.tagline': 'Learn electronics from zero to professional repair technician',
  'menu.continueLearning': 'Continue Learning',
  'menu.level': 'Level',
  'menu.lessons': 'lessons',
  'menu.repairs': 'repairs',
  'menu.academy': 'Academy',
  'menu.academyStartHere': 'Start here',
  'menu.academyComplete': 'Complete',
  'menu.guidedRepair': 'Guided Repair',
  'menu.guidedRepairLocked': 'Locked',
  'menu.guidedRepairComplete': 'Complete',
  'menu.guidedRepairReady': 'Ready!',
  'menu.repairJobs': 'Repair Jobs',
  'menu.repairJobsLocked': 'Locked',
  'menu.repairJobsAvailable': 'available',
  'menu.workshop': 'Workshop',
  'menu.workshop3D': '3D Lab',
  'menu.components': 'Components',
  'menu.componentsRef': 'Reference',
  'menu.progress': 'Progress',
  'menu.progressAchievements': 'Achievements',
  'menu.settings': 'Settings',
  'menu.reset': 'Reset',
  'menu.resetConfirmTitle': 'Reset all progress?',
  'menu.resetConfirmBody': 'This will erase your lessons, money, level, completed missions, and upgrades. This cannot be undone.',
  'menu.cancel': 'Cancel',
  'settings.title': 'Settings',
  'settings.soundEffects': 'Sound Effects',
  'settings.soundDesc': 'Enable or disable game audio',
  'settings.volume': 'Volume',
  'settings.showSchematic': 'Show Schematic by Default',
  'settings.showSchematicDesc': 'Display circuit schematic instead of PCB view',
  'settings.language': 'Language',
  'settings.languageDesc': 'Choose interface language',
  'settings.english': 'English',
  'settings.romanUrdu': 'Roman Urdu',
  'settings.resetProgress': 'Reset Progress',
  'settings.resetProgressDesc': 'Erase all saved data and start over',
  'settings.resetAll': 'Reset All Progress',
  'settings.resetConfirm': 'Yes, reset everything',
  'settings.yesReset': 'Yes, reset everything',
  'pcb.backToWorkshop': 'Back to Workshop',
  'pcb.schematic': 'Schematic',
  'pcb.pcbView': 'PCB View',
  'pcb.probesAndMeter': 'Probes & Meter',
  'pcb.proAutoRange': 'Pro Auto-range',
  'pcb.standard': 'Standard',
  'pcb.red': 'Red',
  'pcb.black': 'Black',
  'pcb.redProbe': 'RED',
  'pcb.blackProbe': 'BLACK',
  'pcb.selectDot': 'Select...',
  'pcb.changeRed': 'Change red probe',
  'pcb.changeBlack': 'Change black probe',
  'pcb.clear': 'Clr',
  'pcb.measure': 'Measure',
  'pcb.setProbesMeasure': 'Set probes and press Measure',
  'pcb.selectTestPointRed': 'Select a test point on the PCB to connect the RED probe.',
  'pcb.selectTestPointBlack': 'Select a test point on the PCB to connect the BLACK probe.',
  'pcb.selectTestPoint': 'Select a test point on the PCB where you want to place a probe.',
  'pcb.cancel': 'Cancel',
  'pcb.component': 'Component',
  'pcb.reference': 'Reference:',
  'pcb.type': 'Type:',
  'pcb.value': 'Value:',
  'pcb.package': 'Package:',
  'pcb.remove': 'Remove',
  'pcb.install': 'Install',
  'pcb.removed': 'Removed',
  'pcb.replaced': 'Replaced',
  'pcb.faulty': 'Faulty',
  'pcb.normal': 'Normal',
  'pcb.removedTag': 'REMOVED',
  'pcb.objectives': 'Objectives',
  'pcb.hints': 'Hints',
  'pcb.hintsUsed': 'used',
  'pcb.getHint': 'Get Hint',
  'pcb.runPostRepairTest': 'Run Post-Repair Test',
  'pcb.repairSuccessful': 'Repair Successful!',
  'pcb.repairFailed': 'Repair Failed',
  'pcb.leaveRepairTitle': 'Leave this repair?',
  'pcb.leaveRepairBody': 'Leave this repair and return to the workshop? Your progress will be saved.',
  'pcb.stay': 'STAY',
  'pcb.goHome': 'GO HOME',
  'pcb.inspect': 'Inspect',
  'pcb.measureTool': 'Measure',
  'pcb.removeTool': 'Remove',
  'pcb.installReplacement': 'Install Replacement',
  'pcb.selectReplacement': 'Select a replacement for',
  'pcb.compatibleParts': 'Compatible Parts',
  'pcb.incompatibleParts': 'Incompatible Parts',
  'pcb.noCompatibleParts': 'No compatible parts in inventory.',
  'pcb.qty': 'Qty',
  'workshop.workshop': 'Workshop',
  'workshop.electronicsLab': 'Electronics Lab',
  'workshop.continueRepair': 'Continue Repair — click to inspect board',
  'workshop.dragRotate': 'Drag to rotate · Scroll to zoom · Pinch on mobile',
  'workshop.activeRepairBoard': 'Active Repair Board — Click to inspect',
  'workshop.bench2': 'Bench 2 — Ready',
  'workshop.home': 'Home',
  'workshop.library': 'Library',
  'workshop.missions': 'Missions',
  'workshop.shop': 'Shop',
  'workshop.inventory': 'Inventory',
  'workshop.settingsBtn': 'Settings',
  'missions.title': 'Repair Orders',
  'missions.subtitle': 'Select a customer repair order to begin',
  'missions.requiresLevel': 'Requires Level',
  'missions.done': 'Done',
  'missions.parts': 'part(s)',
  'shop.title': 'Upgrade Shop',
  'shop.subtitle': 'Buy tools and workshop upgrades',
  'shop.purchased': 'Purchased',
  'shop.tools': 'Tools',
  'shop.workshopCat': 'Workshop',
  'shop.inventoryCat': 'Inventory',
  'shop.diagnostics': 'Diagnostics',
  'inventory.title': 'Component Inventory',
  'inventory.subtitle': 'Your spare parts for repairs',
  'inventory.empty': 'Your inventory is empty.',
  'inventory.emptyDesc': 'Complete missions to earn components.',
  'inventory.resistors': 'Resistors',
  'inventory.capacitors': 'Capacitors',
  'inventory.diodes': 'Diodes',
  'inventory.fuses': 'Fuses',
  'inventory.mosfets': 'MOSFETs',
  'inventory.regulators': 'Regulators',
  'inventory.ics': 'Integrated Circuits',
  'inventory.connectors': 'Connectors',
  'inventory.inductors': 'Inductors',
  'inventory.leds': 'LEDs',
  'pause.paused': 'Paused',
  'pause.resume': 'Resume',
  'pause.backToWorkshop': 'Back to Workshop',
  'pause.mainMenu': 'Main Menu',
  'pause.resetProgress': 'Reset Progress',
  'pause.confirmReset': 'Confirm Reset',
  'report.repairComplete': 'Repair Complete!',
  'report.repairFailed': 'Repair Failed',
  'report.repairCompleteDesc': 'The circuit has been successfully repaired.',
  'report.repairFailedDesc': 'The circuit was not properly repaired. Try again.',
  'report.grade': 'Grade',
  'report.accuracy': 'Accuracy',
  'report.reward': 'Reward',
  'report.xpEarned': 'XP Earned',
  'report.time': 'Time',
  'report.wrongAttempts': 'Wrong Attempts',
  'report.hintsUsed': 'Hints Used',
  'report.returnToWorkshop': 'Return to Workshop',
  'report.backToRepairBoard': 'Back to Repair Board',
  'academy.title': 'Electronics Academy',
  'academy.subtitle': 'Learn electronics step by step',
  'academy.start': 'Start',
  'academy.review': 'Review',
  'academy.score': 'Score',
  'academy.nextLesson': 'Next Lesson',
  'academy.locked': 'Locked',
  'lesson.next': 'Next',
  'lesson.previous': 'Previous',
  'lesson.complete': 'Complete Lesson',
  'lesson.finish': 'Finish',
  'lesson.question': 'Question',
  'lesson.correct': 'Correct!',
  'lesson.incorrect': 'Incorrect',
  'lesson.score': 'Score',
  'lesson.explanation': 'Explanation',
  'lesson.home': 'Home',
  'library.title': 'Component Library',
  'library.subtitle': 'Learn about electronic components',
  'library.function': 'Function',
  'library.howItWorks': 'How It Works',
  'library.failureSymptoms': 'Failure Symptoms',
  'library.testingMethod': 'Testing Method',
  'library.applications': 'Applications',
  'library.commonMistakes': 'Common Mistakes',
  'library.exampleValue': 'Example Value',
  'progress.title': 'Progress',
  'progress.level': 'Level',
  'progress.xp': 'XP',
  'progress.money': 'Money',
  'progress.repairsCompleted': 'Repairs Completed',
  'progress.lessonsCompleted': 'Lessons Completed',
  'progress.upgrades': 'Upgrades',
  'hud.pause': 'Pause',
  'guided.step': 'Step',
  'guided.complete': 'Complete',
  'guided.backToAcademy': 'Back to Academy',
  'common.home': 'Home',
  'common.back': 'Back',
  'common.insufficientMoney': 'Paise kam hain.',
  'electronics.voltage': 'Voltage bijli ka potential difference hota hai. Isay Volt (V) mein naapte hain.',
  'electronics.current': 'Current electric charge ke flow ko kehte hain. Isay Ampere (A) mein naapte hain.',
  'electronics.resistance': 'Resistance current ke flow ki mukhalifat karta hai. Isay Ohm (\u03A9) mein naapte hain.',
  'electronics.capacitor': 'Capacitor electric charge store karta hai. Circuit mein iska kaam uski type aur connection par depend karta hai.',
  'electronics.diode': 'Diode aam tor par current ko ek direction mein guzarnay deta hai. Iski polarity check karna zaroori hai.',
  'electronics.fuse': 'Fuse overcurrent ki surat mein circuit ko disconnect karke protection deta hai. Hamesha circuit ke mutabiq sahi rating ka fuse lagayein.',
  'electronics.mosfet': 'MOSFET ek electronic switching component hai jo circuit mein current ko control kar sakta hai.',
  'electronics.pcb': 'PCB woh board hai jis par electronic components aur unke electrical connections lage hote hain.',
  'electronics.ol': 'OL ka matlab "Open Loop" ya "Out of Limit" hai. Iska matlab hai ke reading range se bahar hai ya circuit open hai.',
  'electronics.shortCircuit': 'Short circuit ka matlab hai ke do points jo alag hone chahiye thay, woh直接 connect ho gaye hain.',
  'electronics.invalidMeasurement': 'Yeh measurement valid nahi hai. Probes sahi test points par lagaayein.',
};

const ur: TranslationDict = {
  'app.title': 'Electronics Academy',
  'app.subtitle': 'Repair Simulator',
  'app.tagline': 'Electronics zero se professional repair technician tak seekhein',
  'menu.continueLearning': 'Aagey seekhein',
  'menu.level': 'Level',
  'menu.lessons': 'lessons',
  'menu.repairs': 'repairs',
  'menu.academy': 'Academy',
  'menu.academyStartHere': 'Yahan se shuru karein',
  'menu.academyComplete': 'Mukammal',
  'menu.guidedRepair': 'Guided Repair',
  'menu.guidedRepairLocked': 'Locked',
  'menu.guidedRepairComplete': 'Mukammal',
  'menu.guidedRepairReady': 'Tayyar!',
  'menu.repairJobs': 'Repair Jobs',
  'menu.repairJobsLocked': 'Locked',
  'menu.repairJobsAvailable': 'available',
  'menu.workshop': 'Workshop',
  'menu.workshop3D': '3D Lab',
  'menu.components': 'Components',
  'menu.componentsRef': 'Reference',
  'menu.progress': 'Progress',
  'menu.progressAchievements': 'Achievements',
  'menu.settings': 'Settings',
  'menu.reset': 'Reset',
  'menu.resetConfirmTitle': 'Saara progress reset karein?',
  'menu.resetConfirmBody': 'Isse aapke lessons, paise, level, completed missions, aur upgrades sab mit jayenge. Yeh wapas nahi hoga.',
  'menu.cancel': 'Cancel',
  'settings.title': 'Settings',
  'settings.soundEffects': 'Sound Effects',
  'settings.soundDesc': 'Game audio on ya off karein',
  'settings.volume': 'Volume',
  'settings.showSchematic': 'Schematic default dikhaayein',
  'settings.showSchematicDesc': 'PCB view ke bajaye circuit schematic dikhaayein',
  'settings.language': 'Language',
  'settings.languageDesc': 'Interface ki language chunein',
  'settings.english': 'English',
  'settings.romanUrdu': 'Roman Urdu',
  'settings.resetProgress': 'Progress Reset',
  'settings.resetProgressDesc': 'Saara saved data mita kar dobara shuru karein',
  'settings.resetAll': 'Saara Progress Reset',
  'settings.resetConfirm': 'Haan, sab reset karein',
  'settings.yesReset': 'Haan, sab reset karein',
  'pcb.backToWorkshop': 'Workshop par wapas',
  'pcb.schematic': 'Schematic',
  'pcb.pcbView': 'PCB View',
  'pcb.probesAndMeter': 'Probes & Meter',
  'pcb.proAutoRange': 'Pro Auto-range',
  'pcb.standard': 'Standard',
  'pcb.red': 'Red',
  'pcb.black': 'Black',
  'pcb.redProbe': 'RED',
  'pcb.blackProbe': 'BLACK',
  'pcb.selectDot': 'Select...',
  'pcb.changeRed': 'Red probe badlein',
  'pcb.changeBlack': 'Black probe badlein',
  'pcb.clear': 'Clr',
  'pcb.measure': 'Measure',
  'pcb.setProbesMeasure': 'Probes lagayein aur Measure dabayein',
  'pcb.selectTestPointRed': 'PCB par woh test point select karein jahan RED probe lagana hai.',
  'pcb.selectTestPointBlack': 'PCB par woh test point select karein jahan BLACK probe lagana hai.',
  'pcb.selectTestPoint': 'PCB par woh test point select karein jahan probe lagana hai.',
  'pcb.cancel': 'Cancel',
  'pcb.component': 'Component',
  'pcb.reference': 'Reference:',
  'pcb.type': 'Type:',
  'pcb.value': 'Value:',
  'pcb.package': 'Package:',
  'pcb.remove': 'Component nikaalein',
  'pcb.install': 'Install',
  'pcb.removed': 'Nikala hua',
  'pcb.replaced': 'Replaced',
  'pcb.faulty': 'Kharab',
  'pcb.normal': 'Normal',
  'pcb.removedTag': 'REMOVED',
  'pcb.objectives': 'Objectives',
  'pcb.hints': 'Hints',
  'pcb.hintsUsed': 'used',
  'pcb.getHint': 'Hint lein',
  'pcb.runPostRepairTest': 'Repair ke baad test karein',
  'pcb.repairSuccessful': 'Repair successful!',
  'pcb.repairFailed': 'Repair fail ho gaya',
  'pcb.leaveRepairTitle': 'Yeh repair chhor dein?',
  'pcb.leaveRepairBody': 'Yeh repair chhor kar workshop par wapas jayein? Aapki progress save ho jayegi.',
  'pcb.stay': 'RUK JAO',
  'pcb.goHome': 'HOME JAO',
  'pcb.inspect': 'Inspect',
  'pcb.measureTool': 'Measure',
  'pcb.removeTool': 'Nikaalein',
  'pcb.installReplacement': 'Replacement lagayein',
  'pcb.selectReplacement': 'Replacement ke liye sahi component chunein',
  'pcb.compatibleParts': 'Compatible Parts',
  'pcb.incompatibleParts': 'Incompatible Parts',
  'pcb.noCompatibleParts': 'Inventory mein compatible parts nahi hain.',
  'pcb.qty': 'Qty',
  'workshop.workshop': 'Workshop',
  'workshop.electronicsLab': 'Electronics Lab',
  'workshop.continueRepair': 'Repair continue karein — board inspect karne ke liye click karein',
  'workshop.dragRotate': 'Rotate karne ke liye drag karein · Zoom ke liye scroll · Mobile par pinch',
  'workshop.activeRepairBoard': 'Active Repair Board — Inspect karne ke liye click karein',
  'workshop.bench2': 'Bench 2 — Ready',
  'workshop.home': 'Home',
  'workshop.library': 'Library',
  'workshop.missions': 'Missions',
  'workshop.shop': 'Shop',
  'workshop.inventory': 'Inventory',
  'workshop.settingsBtn': 'Settings',
  'missions.title': 'Repair Orders',
  'missions.subtitle': 'Shuru karne ke liye customer ka repair order select karein',
  'missions.requiresLevel': 'Level zaroori hai',
  'missions.done': 'Done',
  'missions.parts': 'part(s)',
  'shop.title': 'Upgrade Shop',
  'shop.subtitle': 'Tools aur workshop upgrades khareedein',
  'shop.purchased': 'Purchased',
  'shop.tools': 'Tools',
  'shop.workshopCat': 'Workshop',
  'shop.inventoryCat': 'Inventory',
  'shop.diagnostics': 'Diagnostics',
  'inventory.title': 'Component Inventory',
  'inventory.subtitle': 'Repair ke liye aapke spare parts',
  'inventory.empty': 'Aapki inventory khaali hai.',
  'inventory.emptyDesc': 'Components kamane ke liye missions mukammal karein.',
  'inventory.resistors': 'Resistors',
  'inventory.capacitors': 'Capacitors',
  'inventory.diodes': 'Diodes',
  'inventory.fuses': 'Fuses',
  'inventory.mosfets': 'MOSFETs',
  'inventory.regulators': 'Regulators',
  'inventory.ics': 'Integrated Circuits',
  'inventory.connectors': 'Connectors',
  'inventory.inductors': 'Inductors',
  'inventory.leds': 'LEDs',
  'pause.paused': 'Paused',
  'pause.resume': 'Resume',
  'pause.backToWorkshop': 'Workshop par wapas',
  'pause.mainMenu': 'Main Menu',
  'pause.resetProgress': 'Progress Reset',
  'pause.confirmReset': 'Reset confirm karein',
  'report.repairComplete': 'Repair mukammal ho gaya!',
  'report.repairFailed': 'Repair fail ho gaya',
  'report.repairCompleteDesc': 'Circuit successfully repair ho gaya hai.',
  'report.repairFailedDesc': 'Circuit properly repair nahi hua. Dobara koshish karein.',
  'report.grade': 'Grade',
  'report.accuracy': 'Accuracy',
  'report.reward': 'Reward',
  'report.xpEarned': 'XP Earned',
  'report.time': 'Time',
  'report.wrongAttempts': 'Wrong Attempts',
  'report.hintsUsed': 'Hints Used',
  'report.returnToWorkshop': 'Workshop par wapas',
  'report.backToRepairBoard': 'Repair Board par wapas',
  'academy.title': 'Electronics Academy',
  'academy.subtitle': 'Electronics step by step seekhein',
  'academy.start': 'Start',
  'academy.review': 'Review',
  'academy.score': 'Score',
  'academy.nextLesson': 'Next Lesson',
  'academy.locked': 'Locked',
  'lesson.next': 'Next',
  'lesson.previous': 'Previous',
  'lesson.complete': 'Lesson mukammal karein',
  'lesson.finish': 'Finish',
  'lesson.question': 'Question',
  'lesson.correct': 'Sahi!',
  'lesson.incorrect': 'Galat',
  'lesson.score': 'Score',
  'lesson.explanation': 'Explanation',
  'lesson.home': 'Home',
  'library.title': 'Component Library',
  'library.subtitle': 'Electronic components ke baare mein seekhein',
  'library.function': 'Function',
  'library.howItWorks': 'How It Works',
  'library.failureSymptoms': 'Failure Symptoms',
  'library.testingMethod': 'Testing Method',
  'library.applications': 'Applications',
  'library.commonMistakes': 'Common Mistakes',
  'library.exampleValue': 'Example Value',
  'progress.title': 'Progress',
  'progress.level': 'Level',
  'progress.xp': 'XP',
  'progress.money': 'Money',
  'progress.repairsCompleted': 'Repairs Completed',
  'progress.lessonsCompleted': 'Lessons Completed',
  'progress.upgrades': 'Upgrades',
  'hud.pause': 'Pause',
  'guided.step': 'Step',
  'guided.complete': 'Mukammal',
  'guided.backToAcademy': 'Academy par wapas',
  'common.home': 'Home',
  'common.back': 'Wapas',
  'common.insufficientMoney': 'You do not have enough money.',
  'electronics.voltage': 'Voltage is the electrical potential difference. It is measured in volts (V).',
  'electronics.current': 'Current is the flow of electric charge. It is measured in amperes (A).',
  'electronics.resistance': 'Resistance opposes the flow of current. It is measured in ohms (Ω).',
  'electronics.capacitor': 'A capacitor temporarily stores electrical charge. Its job depends on its type and how it is connected.',
  'electronics.diode': 'A diode usually lets current flow in one direction. Check its polarity before installing it.',
  'electronics.fuse': 'A fuse protects a circuit by disconnecting it when too much current flows. Always use the correct rating.',
  'electronics.mosfet': 'A MOSFET is an electronic switch that can control current in a circuit.',
  'electronics.pcb': 'A PCB is a board that holds electronic components and their electrical connections.',
  'electronics.ol': 'OL means open loop or over limit. The reading is outside the meter range or the circuit is open.',
  'electronics.shortCircuit': 'A short circuit happens when two points that should be separate become directly connected.',
  'electronics.invalidMeasurement': 'This measurement is not valid. Place the probes on the correct test points.',
};

const translations: Record<Language, TranslationDict> = { en, ur };

const romanContent: Record<string, string> = {
  // Common interface labels and short instructions
  'Home': 'Ghar',
  'Return to Workshop Home': 'Workshop ke main safhe par wapas jayein',
  'Return to Home': 'Main safhe par wapas jayein',
  'Workshop': 'Kaam ki jagah',
  'Electronics Lab': 'Electronics ki lab',
  'Settings': 'Tarteebat',
  'Search components...': 'Components dhoondein...',
  'No components found.': 'Koi component nahi mila.',
  'Select a component from the list to see its details.': 'Tafseel dekhne ke liye fehrist se component chunein.',
  'Show Roman Urdu': 'Roman Urdu dikhayein',
  'Hide Roman Urdu': 'Roman Urdu chhupayein',
  'Show Hint': 'Ishara dikhayein',
  'Hide Hint': 'Ishara chhupayein',
  'Submit Answers': 'Jawabat jama karein',
  'Interactive demo not available.': 'Yeh amali mashq filhaal dastiyab nahi.',
  'Voltage:': 'Voltage:',
  'Resistance:': 'Resistance:',
  'Current (I = V÷R)': 'Current (I = V÷R)',
  'Power (P = V×I)': 'Power (P = V×I)',
  'Try: Set V=12, R=100 → I should be 0.12A (120mA). Now increase R and watch I decrease!': 'Mashq: V=12 aur R=100 rakhein; I 0.12A (120mA) hona chahiye. Ab R barhayein aur dekhein ke I kam hota hai.',
  'Click a component symbol, then click its correct name. Green = correct!': 'Component ki nishani par click karein, phir uska sahi naam chunein. Hara rang sahi jawab dikhata hai.',
  'Components': 'Components',
  'Names': 'Naam',
  'All matched! Great job!': 'Sab joriyan mil gayin! Bohat khoob!',
  'Series': 'Series circuit',
  'Parallel': 'Parallel circuit',
  'Working': 'Kaam kar raha hai',
  'Break R1': 'R1 ka connection kaatein',
  'Break R2': 'R2 ka connection kaatein',
  'Reset': 'Dobara shuru karein',
  'Select the correct multimeter mode for each task:': 'Har kaam ke liye multimeter ka sahi mode chunein:',
  'Based on the symptom, identify the fault type:': 'Alamat dekh kar kharabi ki qisam pehchanein:',
  'Symptom:': 'Alamat:',
  'Click each reference label to learn what type of component it represents:': 'Har reference label par click karke component ki qisam jaanain:',
  'The first letter tells the type:': 'Pehla harf component ki qisam batata hai:',
  'Something went wrong': 'Kuch ghalat ho gaya',
  'This part of the app hit an error. The rest of the app is still running.': 'Is hisse mein masla aaya hai, lekin app ke baqi hisse chal rahe hain.',
  'Try again': 'Dobara koshish karein',
  'Loading': 'Load ho raha hai',
  'Toggle Sidebar': 'Side menu kholein ya band karein',
  'Close': 'Band karein',
  'Previous': 'Pichla',
  'Next': 'Agla',
  'Go to previous page': 'Pichle safhe par jayein',
  'Go to next page': 'Agley safhe par jayein',
  'More pages': 'Mazeed safhe',
  'Sidebar': 'Side menu',
  'Displays the mobile sidebar.': 'Mobile side menu dikhata hai.',
  '404 Page Not Found': '404 — Safha nahi mila',
  'Did you forget to add the page to the router?': 'Kya aap safha router mein shamil karna bhool gaye?',
  'Mission: Blown Fuse Replacement': 'Mission: Jala hua fuse badlein',
  'Put your Academy training into practice. A step-by-step guided repair of a 12V power supply with a blown fuse.': 'Academy mein seekhi hui baaton ko azmayein. Is rehnumai wali repair mein 12V power supply ka jala hua fuse qadam-ba-qadam badlein.',
  'Reward': 'Inaam',
  'Difficulty': 'Mushkil ki satah',
  'This is a guided mission. You will receive step-by-step instructions with hints at every stage. After completing this, you will unlock real repair missions!': 'Yeh rehnumai wali mission hai. Har qadam par hidayat aur ishara milega. Isay mukammal karne ke baad asal repair missions khul jayengi!',
  'Start Guided Repair': 'Rehnumai wali repair shuru karein',
  'Test Results': 'Test ke nataij',
  'Congratulations! You have completed the Academy and your first guided repair. Real repair missions are now unlocked. Visit the Workshop to take on customer repair jobs!': 'Mubarak ho! Aap ne Academy aur pehli rehnumai wali repair mukammal kar li. Ab asal repair missions khul gayi hain. Customer ke kaam shuru karne ke liye Workshop par jayein!',
  'Continue to Workshop': 'Workshop par jari rakhein',
  'Prev': 'Pichla',
  'Voltage:': 'Voltage:',
  'Resistance:': 'Resistance:',
  'Current (I = V÷R)': 'Current (I = V÷R)',
  'Power (P = V×I)': 'Power (P = V×I)',
  'Try: Set V=12, R=100 → I should be 0.12A (120mA). Now increase R and watch I decrease!': 'Mashq: V=12 aur R=100 rakhein; I 0.12A (120mA) hona chahiye. Ab R barhayein aur dekhein ke I kam hota hai.',
  'Click a component symbol, then click its correct name. Green = correct!': 'Component ki nishani par click karein, phir uska sahi naam chunein. Hara rang sahi jawab dikhata hai.',
  'All matched! Great job!': 'Sab joriyan mil gayin! Bohat khoob!',
  'BROKEN': 'Toota hua',
  'NONE': 'Koi nahi',
  'Total resistance': 'Kul resistance',
  'Break R1': 'R1 ka connection kaatein',
  'Break R2': 'R2 ka connection kaatein',
  'In series, breaking one component stops ALL current!': 'Series circuit mein ek component ka connection tootne se sara current ruk jata hai!',
  'In parallel, the other branch still works!': 'Parallel circuit mein doosri branch phir bhi kaam karti rehti hai!',
  'Click "Break" to see what happens when a component fails.': 'Component kharab hone par kya hota hai, dekhne ke liye "Break" dabayein.',
  'DC Voltage': 'DC Voltage',
  'Resistance': 'Resistance',
  'Continuity': 'Continuity',
  'Diode Test': 'Diode test',
  'Select the correct multimeter mode for each task:': 'Har kaam ke liye multimeter ka sahi mode chunein:',
  'Correct!': 'Sahi!',
  'Wrong. Correct answer:': 'Jawab ghalat hai. Sahi jawab:',
  'Open': 'Open circuit',
  'Short': 'Short circuit',
  'Normal': 'Theek',
  'Value Drift': 'Value mein tabdeeli',
  'Based on the symptom, identify the fault type:': 'Alamat dekh kar kharabi ki qisam pehchanein:',
  'Symptom:': 'Kharabi ki alamat:',
  'Wrong — the answer is:': 'Jawab ghalat hai. Sahi jawab:',
  'Click each reference label to learn what type of component it represents:': 'Har reference label par click karke jaanain ke yeh kis qisam ka component hai:',
  'The first letter tells the type:': 'Pehla harf component ki qisam batata hai:',
  'The number': 'Number',
  'is just an identifier — it tells you which specific one on the board.': 'sirf pehchan ke liye hota hai. Is se board par woh khaas component maloom hota hai.',
  'Resistor': 'Resistor',
  'Capacitor': 'Capacitor',
  'Diode': 'Diode',
  'Fuse': 'Fuse',
  'MOSFET': 'MOSFET',
  'Connector': 'Connector',
  'Inductor': 'Inductor',
  'Voltage Regulator': 'Voltage Regulator',
  'Integrated Circuit (IC)': 'Integrated Circuit (IC)',
  'LED (Light Emitting Diode)': 'LED (roshni dene wala diode)',
  'Limits the amount of current flowing through a circuit.': 'Resistor circuit mein behne wale current ko mehdood karta hai.',
  'A resistor converts electrical energy into heat, reducing the current. The resistance value is marked with color bands. For example, brown-black-red = 1kΩ.': 'Resistor electrical energy ko heat mein badal kar current kam karta hai. Iski value rangin bands se maloom hoti hai. Misal ke taur par brown-black-red = 1kΩ.',
  'Resistors rarely fail on their own. If they burn, it is usually because another component shorted and caused too much current. An open resistor reads O.L (infinite resistance).': 'Resistor aam tor par khud kharab nahi hota. Jalne ki wajah aksar kisi doosre component ka short hona aur bohat zyada current guzarna hoti hai. Open resistor par O.L (be-inteha resistance) nazar aata hai.',
  'Set multimeter to resistance (Ω) mode. Place probes on both leads. Reading should match the color code value. O.L means open. 0Ω means short (very rare).': 'Multimeter ko resistance (Ω) mode par rakhein aur dono terminals par probes lagayein. Reading rangin bands wali value ke barabar honi chahiye. O.L ka matlab open hai aur 0Ω ka matlab short (jo bohat kam hota hai).',
  'Current limiting for LEDs, biasing transistors, voltage dividers, pull-up/pull-down signals.': 'LED ka current mehdood karna, transistor ko bias dena, voltage divide karna aur pull-up/pull-down signals.',
  'Reading color bands in the wrong direction. Not accounting for tolerance (5% or 10%). Measuring resistance while circuit is powered.': 'Color bands ko ulte rukh se parhna, tolerance (5% ya 10%) ko nazarandaz karna, ya circuit chalu honay par resistance naapna.',
  'Stores electrical charge temporarily and filters voltage.': 'Capacitor kuch waqt ke liye electric charge jama karta hai aur voltage ko filter karta hai.',
  'A capacitor has two plates separated by an insulator. When voltage is applied, charge builds up on the plates. In a power supply, a large capacitor smooths the pulsating DC into stable DC.': 'Capacitor mein do plates hoti hain jin ke darmiyan insulator hota hai. Voltage lagne par plates par charge jama hota hai. Power supply mein bara capacitor dharkan wali DC ko hamwar aur stable DC banata hai.',
  'Electrolytic capacitors can dry out, short (0Ω), or open. A bulging top or leaked fluid means it is bad. A shorted capacitor can blow fuses. A bad filter capacitor causes unstable output.': 'Electrolytic capacitor sookh sakta hai, short (0Ω) ya open ho sakta hai. Upar se phoola hua hona ya liquid ka risna kharabi ki nishani hai. Short capacitor fuse ura sakta hai, jabke kharab filter capacitor se output ghair mustahkam hota hai.',
  'With power OFF: Set to resistance mode. A good capacitor starts at low resistance then climbs to O.L as it charges. If it stays at 0Ω, it is shorted. If it reads O.L immediately, it may be open.': 'Power band karke multimeter ko resistance mode par rakhein. Theek capacitor pehle kam resistance dikhata hai, phir charge hotay waqt reading O.L tak barhti hai. 0Ω par rehna short hai; foran O.L aana open honay ki nishani ho sakta hai.',
  'Power supply filtering, coupling/decoupling signals, timing circuits, energy storage.': 'Power supply filtering, signals ko jorna ya alag karna, timing circuits aur energy jama karna.',
  'Installing electrolytic capacitors with wrong polarity (can explode). Not discharging large capacitors before testing. Expecting an exact capacitance reading from resistance mode.': 'Electrolytic capacitor ko ghalat polarity se lagana (yeh phat sakta hai), bare capacitor ko test se pehle discharge na karna, aur resistance mode se exact capacitance reading ki tawaqqo rakhna.',
  'Allows current to flow in only ONE direction.': 'Diode current ko sirf ek simt mein behne deta hai.',
  'A diode has an anode (positive) and cathode (negative, marked with a stripe). Current flows from anode to cathode only. In a power supply, diodes convert AC to DC by blocking one half of the AC waveform.': 'Diode ke do hisse anode (positive) aur cathode (negative) hain; cathode par stripe hoti hai. Current sirf anode se cathode ki taraf behta hai. Power supply mein diode AC waveform ka ek hissa rok kar AC ko DC mein badalta hai.',
  'A shorted diode reads 0V in both directions. An open diode reads O.L in both directions. A shorted rectifier diode can blow fuses or pass AC where it should not.': 'Short diode dono simton mein 0V dikhata hai, jabke open diode dono simton mein O.L dikhata hai. Short rectifier diode fuse ura sakta hai ya wahan AC pohancha sakta hai jahan nahi jana chahiye.',
  'Set to diode test mode. Red probe on anode, black on cathode: should read 0.5-0.7V. Reverse probes: should read O.L. 0V both ways = shorted. O.L both ways = open.': 'Diode test mode chunein. Laal probe anode par aur kaali probe cathode par lagayein: 0.5–0.7V aana chahiye. Probes ulatne par O.L aana chahiye. Dono simton mein 0V ho to short, aur dono mein O.L ho to open hai.',
  'Rectifiers in power supplies, reverse polarity protection, freewheel diodes in motor circuits, signal clipping.': 'Power supply ke rectifiers, ulat polarity se hifazat, motor circuits mein freewheel diodes aur signal clipping.',
  'Confusing anode and cathode (stripe = cathode = negative). Testing with resistance mode instead of diode mode. Not testing in both directions.': 'Anode aur cathode ko ghalat samajhna (stripe = cathode = negative), diode mode ke bajaye resistance mode mein test karna, ya dono simton mein test na karna.',
  'Protects the circuit by breaking the connection if too much current flows.': 'Fuse zyada current behne par connection kaat kar circuit ki hifazat karta hai.',
  'A fuse contains a thin wire that melts when current exceeds its rating. A 2A fuse allows up to 2 amps. If 3 amps flow, the wire melts and the circuit opens, protecting everything downstream.': 'Fuse ke andar bareek taar hota hai jo current apni rating se barhne par pighal jata hai. 2A fuse zyada se zyada 2 ampere bardasht karta hai. 3 ampere behne par taar pighal kar circuit khol deta hai aur aagay ke components ko bachata hai.',
  'A blown fuse reads O.L (open). The circuit has no power at all. IMPORTANT: A blown fuse usually means something else shorted — always find the cause before replacing!': 'Jala hua fuse O.L (open) dikhata hai aur circuit mein bilkul power nahi hoti. Zaroori: Fuse jalne ki wajah aksar koi doosra short component hota hai. Fuse badalne se pehle wajah zaroor dhoondein!',
  'With power OFF: Set to continuity mode. Place probes on both ends. Beep = good fuse. No beep = blown fuse. Can also use resistance mode: 0.1Ω = good, O.L = blown.': 'Power band karein, continuity mode chunein aur fuse ke dono siron par probes lagayein. Beep aaye to fuse theek hai; beep na aaye to jal gaya hai. Resistance mode mein bhi check kar sakte hain: 0.1Ω theek hai, O.L jala hua.',
  'Power supply input protection, overcurrent protection on power rails, USB port protection.': 'Power supply ke input, power rails ke zyada current aur USB port ki hifazat.',
  'Replacing a fuse without finding the short that caused it to blow. Using a higher-rated fuse (dangerous — can cause fire). Testing a fuse with power on.': 'Fuse uranay wala short dhoonde baghair fuse badalna, zyada rating wala fuse lagana (khatarnak hai aur aag laga sakta hai), ya power chalu honay par fuse test karna.',
  'An electronically controlled switch. Turns on or off based on voltage at the gate pin.': 'MOSFET aik electronic switch hai jo Gate pin ke voltage ke mutabiq chalu ya band hota hai.',
  'A MOSFET has three pins: Gate (control), Drain (input), Source (output). When voltage is applied to the gate, the Drain-Source path conducts. When gate voltage is removed, it blocks. Used in DC-DC converters to switch power on and off rapidly.': 'MOSFET ke teen pins hain: Gate (control), Drain (input) aur Source (output). Gate par voltage lagane se Drain-Source raasta current guzarta hai; voltage hatane par current ruk jata hai. DC-DC converter mein power ko tezi se chalu aur band karne ke liye istemal hota hai.',
  'A shorted MOSFET has 0Ω between Drain and Source — full voltage passes through uncontrolled. An open MOSFET blocks all current. Shorted MOSFETs often cause output overvoltage.': 'Short MOSFET mein Drain aur Source ke darmiyan 0Ω hota hai, jis se voltage baghair control ke guzar sakta hai. Open MOSFET sara current rok deta hai. Short MOSFET aksar output voltage bohat barha deta hai.',
  'With power OFF: Set to diode test mode. Test between Drain and Source. Normal: reads a diode drop one way, O.L the other. Shorted: 0V both ways. Can also use resistance: 0Ω D-S = shorted.': 'Power band karke diode test mode chunein aur Drain aur Source ke darmiyan test karein. Theek halat mein aik simt diode drop aur doosri simt O.L aata hai. Dono simton mein 0V short hai. Resistance mode mein D-S par 0Ω bhi short ki nishani hai.',
  'DC-DC converters, motor drivers, switching power supplies, load switches, H-bridges for inverters.': 'DC-DC converters, motor drivers, switching power supplies, load switches aur inverter ke H-bridges.',
  'Confusing pin assignments (Gate/Drain/Source varies by package). Not testing for short between D-S specifically. Replacing with a MOSFET that has different voltage/current rating.': 'Pins ka farq nazarandaz karna (Gate/Drain/Source ki jagah package ke mutabiq badal sakti hai), D-S ke darmiyan short alag se test na karna, ya mukhtalif voltage/current rating wala MOSFET lagana.',
  'Produces a fixed, stable output voltage from a higher or variable input voltage.': 'Voltage Regulator zyada ya badalte input voltage se aik muqarrar aur stable output deta hai.',
  'A linear regulator like the LM7805 takes an input (e.g., 12V) and outputs a precise 5V. It drops the excess voltage as heat. Has three pins: Input, Ground, Output.': 'LM7805 jaisa linear regulator input (misal ke taur par 12V) leta hai aur theek 5V output deta hai. Zyada voltage heat ki surat mein kam hota hai. Iske teen pins Input, Ground aur Output hain.',
  'Failed open: no output (0V). Failed short: input voltage passes straight through (e.g., 24V at a 12V output). Overheating can cause intermittent failure.': 'Open honay par output nahi hota (0V). Short honay par input voltage seedha output par aata hai (misal: 12V output ki jagah 24V). Zyada garam honay se kabhi chalta, kabhi band hota hai.',
  'With power ON: Set to DC voltage mode. Black probe on ground, red on output pin. Compare with rated output. 0V = open. Full input voltage = short. Correct voltage = good.': 'Power chalu karke DC voltage mode chunein. Kaali probe ground aur laal probe output pin par lagayein. Reading ko rated output se milayein: 0V = open, poora input voltage = short, aur sahi voltage = theek.',
  'Power supplies, battery chargers, microcontroller power, sensor voltage references.': 'Power supplies, battery chargers, microcontroller ki power aur sensor ke voltage references.',
  'Not checking input voltage before blaming the regulator (bad input = bad output). Forgetting the input-output relationship. Replacing with wrong voltage part (LM7805 vs LM7812).': 'Regulator ko zimmedar thehrane se pehle input voltage check na karna (input ghalat ho to output bhi ghalat hoga), input-output ka talluq bhoolna, ya ghalat voltage wala part lagana (LM7805 aur LM7812 mukhtalif hain).',
  'A complete mini-circuit in one package. Performs complex functions like amplification, control, or processing.': 'IC aik package mein mukammal chhota circuit hota hai. Yeh amplification, control aur processing jaise mushkil kaam karta hai.',
  'An IC contains many tiny components (transistors, resistors, capacitors) on a single silicon chip, sealed in a plastic package with pins. Each pin connects to a specific function. Pin 1 is marked with a dot or notch.': 'IC ke aik silicon chip par bohat se chhote components (transistors, resistors, capacitors) hote hain. Chip pins wale plastic package mein band hoti hai. Har pin ka khaas kaam hota hai. Pin 1 par nuqta ya kata hua nishan hota hai.',
  'ICs can fail from overvoltage, overheating, or static damage. Symptoms are varied: no output, wrong signals, overheating, or complete failure. Usually diagnosed by checking surrounding components and signals rather than the IC itself.': 'IC zyada voltage, garmi ya static electricity se kharab ho sakta hai. Alamat mein output na aana, ghalat signals, zyada garam hona ya bilkul band ho jana shamil hain. Aksar IC ke bajaye uske gird ke components aur signals check karke kharabi dhoondi jati hai.',
  'ICs are tested by checking power pins (VCC and GND), input signals, and output signals with DC voltage mode. If power is present but output is wrong, the IC may be bad. Compare with datasheet expected values.': 'IC ko DC voltage mode mein uske power pins (VCC aur GND), input signals aur output signals check karke test karein. Power maujood ho lekin output ghalat ho to IC kharab ho sakta hai. Reading ko datasheet ki values se milayein.',
  'Op-amps (LM358), timers (NE555), microcontrollers, gate drivers (IR2110), PWM controllers (TL494).': 'Op-amps (LM358), timers (NE555), microcontrollers, gate drivers (IR2110) aur PWM controllers (TL494).',
  'Assuming the IC is bad before checking power and input signals. Installing backwards (pin 1 alignment). Not using a socket for replacement.': 'Power aur input signals check karne se pehle IC ko kharab samajhna, ulta lagana (Pin 1 ki simt check karein), ya replacement ke liye socket istemal na karna.',
  'Stores energy in a magnetic field and opposes rapid current changes.': 'Inductor magnetic field mein energy jama karta hai aur current ki achanak tabdeeli ka muqabla karta hai.',
  'An inductor is a coil of wire. When current flows, it creates a magnetic field. If current tries to change, the magnetic field opposes the change. In DC-DC converters, inductors store and release energy to smooth the output.': 'Inductor taar ki coil hota hai. Current behne par magnetic field banta hai. Current badalne lage to yeh field us tabdeeli ki mukhalifat karta hai. DC-DC converter mein inductor energy jama aur release karke output ko hamwar karta hai.',
  'Inductors rarely fail. If they do, they usually open (break in the wire). A shorted inductor (windings touching) is uncommon but changes the inductance value. Symptoms: DC-DC converter stops working or has poor regulation.': 'Inductor kam hi kharab hota hai; kharab ho to aksar taar toot kar open ho jata hai. Coil ke lapetay aapas mein short hona kam hota hai, magar inductance badal deta hai. DC-DC converter band ho sakta hai ya voltage theek se regulate nahi hota.',
  'With power OFF: Set to resistance mode. A good inductor has very low resistance (near 0Ω to a few ohms). O.L means the wire is broken (open). Compare with a known good one if possible.': 'Power band karke resistance mode chunein. Theek inductor ka resistance bohat kam (qareeban 0Ω se chand ohms) hota hai. O.L ka matlab taar toot kar open ho gaya hai. Mumkin ho to theek inductor se muqabla karein.',
  'DC-DC converters, noise filters, energy storage in switching power supplies, radio frequency circuits.': 'DC-DC converters, noise filters, switching power supplies mein energy jama karna aur radio-frequency circuits.',
  'Expecting high resistance (inductors have LOW resistance). Replacing with wrong inductance value. Not checking for physical damage to the coil.': 'Zyada resistance ki tawaqqo rakhna (inductor ka resistance kam hota hai), ghalat inductance wala part lagana, ya coil ka zahiri nuqsan check na karna.',
  'Provides a removable physical connection between a circuit board and external devices or cables.': 'Connector circuit board ko bahar ke devices ya cables se alag ki ja sakne wali jori deta hai.',
  'A connector has metal pins that touch matching contacts on a plug. DC jacks, USB ports, and header pins are all connectors. They allow power and signals to flow in and out of the board.': 'Connector ke dhaati pins plug ke mutabiq contacts se milte hain. DC jack, USB port aur header pins sab connectors hain. In se power aur signals board mein aate aur bahar jate hain.',
  'Broken pins, bent contacts, cold solder joints, or corroded connections. Symptoms: intermittent operation, no power, works when wiggled. Cold solder joints on connectors are extremely common.': 'Pins toot ya mur sakte hain, solder joint thanda ho sakta hai ya connection par zang lag sakta hai. Alamat: kabhi chalna kabhi band hona, power na aana, ya hilaane par chalna. Connector ke cold solder joints bohat aam hain.',
  'With power OFF: Use continuity mode to check that each pin connects to its trace. With power ON: Use DC voltage to check that voltage is present at the connector pins. Wiggle the plug to test for intermittent connections.': 'Power band karke continuity mode mein har pin ka track se connection check karein. Power chalu karke DC voltage mode se connector pins par voltage dekhein. Plug ko hila kar ruk ruk kar honay wale connection ko test karein.',
  'DC power input jacks, USB ports, battery connectors, board-to-board links, sensor connections.': 'DC power input jacks, USB ports, battery connectors, board-to-board links aur sensor connections.',
  'Not checking solder joints on the connector pads. Assuming the connector is fine because it looks OK. Forgetting that connectors are the most common failure point due to mechanical stress.': 'Connector pads ke solder joints check na karna, sirf theek dikhne ki wajah se connector ko sahi samajhna, aur yeh bhoolna ke kheench-taan ki wajah se connectors aksar kharab hote hain.',
  'A diode that emits light when current flows through it in the correct direction.': 'LED aisa diode hai jo sahi simt mein current behne par roshni deta hai.',
  'An LED is a special diode. When forward current flows (anode positive, cathode negative), it releases energy as light. It needs a current-limiting resistor — connecting an LED directly to a battery will burn it out.': 'LED khaas qisam ka diode hai. Forward current behne par (anode positive, cathode negative) yeh energy ko roshni mein badalta hai. Iske saath current mehdood karne wala resistor zaroor lagayein; battery se seedha jorne par LED jal jayegi.',
  'Open: no light at all. Short: acts like a wire (no light, but current flows freely, which can damage other components). LED failure is usually caused by too much current or reverse voltage.': 'Open ho to bilkul roshni nahi hoti. Short ho to taar ki tarah current guzarta hai magar roshni nahi hoti, aur doosre parts ko nuqsan pohanch sakta hai. Aksar bohat zyada current ya ulta voltage LED ko kharab karta hai.',
  'With power OFF: Set to diode test mode. Red on anode (longer leg), black on cathode (shorter leg / flat side). A good LED lights dimly and reads 1.5-3.0V. Reverse probes: O.L. 0V both ways = shorted.': 'Power band karke diode test mode chunein. Laal probe anode (lambi leg) aur kaali probe cathode (chhoti leg ya seedhi kinari) par lagayein. Theek LED halki roshni degi aur 1.5–3.0V dikhayegi. Probes ulatne par O.L aana chahiye. Dono simton mein 0V short hai.',
  'Status indicators, lighting, displays, optocouplers, infrared remote controls.': 'Status lights, roshni, displays, optocouplers aur infrared remote controls.',
  'Connecting without a current-limiting resistor. Confusing anode (long) and cathode (short) legs. Expecting the LED to be bright in diode test mode (it will be dim).': 'Current mehdood karne wala resistor lagaye baghair jorna, anode (lambi leg) aur cathode (chhoti leg) ko ulat samajhna, ya diode test mode mein tez roshni ki tawaqqo rakhna (LED halki jalegi).',
};

export function translateContent(text: string, lang: Language): string {
  if (lang !== 'ur') return text;
  const normalized = text.replace(/\s+/g, ' ').trim();
  return romanContent[normalized] ?? romanContent[text] ?? text;
}

export function translateContentTree<T>(value: T, lang: Language): T {
  if (typeof value === 'string') return translateContent(value, lang) as T;
  if (Array.isArray(value)) return value.map((item) => translateContentTree(item, lang)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, translateContentTree(child, lang)]),
    ) as T;
  }
  return value;
}

export function translate(key: TranslationKey, lang: Language): string {
  const dict = translations[lang] ?? translations.en;
  const value = dict[key] ?? translations.en[key] ?? key;
  return lang === 'ur' ? translateContent(value, lang) : value;
}
