import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const PRODUCTIVITY_TOOLS: readonly Tool[] = [
  {
    id: 'productivity-smart-to-do-list',
    name: 'Smart To-Do List',
    slug: 'productivity-smart-to-do-list',
    category: 'productivity-tools',
    url: '/productivity-smart-to-do-list',
    description:
      'Manage tasks with high, medium, and low priority tags and filter active or completed items—saved locally in your browser.',
    longDescription:
      'Organize daily action items with clear high, medium, and low priority levels, switch views between all, active, and completed tasks, and keep everything stored directly in your browser with zero account login and no AI.',
    keywords: [
      'smart to-do list',
      'todo list priority',
      'high medium low tasks',
      'browser task list',
      'checklist',
    ],
    icon: 'CheckSquare',
    acceptedFormats: ['Browser Input'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Smart To-Do List | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Track tasks with high, medium, and low priorities and filter active or completed items locally in your browser.',
    howTo: [
      {
        title: 'Add a task and priority',
        description:
          'Type your task title and assign a high, medium, or low priority badge.',
      },
      {
        title: 'Filter active or completed',
        description:
          'Switch tabs to focus strictly on pending tasks or review completed items.',
      },
      {
        title: 'Keep tasks saved in browser',
        description:
          'Your to-do list persists locally in browser storage on your device with zero sign-up.',
      },
    ],
    faqs: [
      {
        question: 'Where are my Smart To-Do List tasks stored?',
        answer:
          'All tasks and priorities are saved locally in your browser storage on your device—no cloud account or server database is used.',
      },
      {
        question: 'Does Smart To-Do List use AI to prioritize tasks?',
        answer:
          'No. You manually set high, medium, or low priorities and filter active or completed tasks directly—no AI is involved.',
      },
      {
        question: 'Will my tasks stay available after refreshing the page?',
        answer:
          'Yes, as long as you do not clear your browser site data or use private incognito sessions.',
      },
      {
        question: 'Is this tool free with no watermark or login?',
        answer:
          'Yes. It runs completely free in your browser with zero login required.',
      },
    ],
    relatedTools: [
      'productivity-task-board',
      'productivity-daily-planner',
      'productivity-habit-streak',
      'productivity-sticky-notes',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-task-board',
    name: 'Task Board',
    slug: 'productivity-task-board',
    category: 'productivity-tools',
    url: '/productivity-task-board',
    description:
      'Visual Kanban board with To Do, In Progress, and Done columns and drag-and-drop cards saved in your browser.',
    longDescription:
      'Move tasks smoothly across To Do, In Progress, and Done Kanban columns via browser drag-and-drop or quick move buttons. Your board state saves automatically in local browser storage with zero sign-up.',
    keywords: [
      'task board',
      'kanban board',
      'to do in progress done',
      'drag and drop tasks',
      'browser kanban',
    ],
    icon: 'Kanban',
    acceptedFormats: ['Browser Input'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Task Board | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Organize projects on a browser Kanban Task Board with To Do, In Progress, and Done columns and drag-and-drop.',
    howTo: [
      {
        title: 'Create task cards',
        description:
          'Add task titles and optional short notes directly inside the To Do column.',
      },
      {
        title: 'Drag tasks across columns',
        description:
          'Drag cards smoothly between To Do, In Progress, and Done as work advances.',
      },
      {
        title: 'Save board automatically',
        description:
          'Every column change is saved automatically in your browser with no account required.',
      },
    ],
    faqs: [
      {
        question: 'Can I drag cards between To Do, In Progress, and Done?',
        answer:
          'Yes. The board is designed around native drag-and-drop across all three Kanban columns, plus accessible keyboard/button controls.',
      },
      {
        question: 'Does Task Board save my columns between visits?',
        answer:
          'Yes. Cards and column positions are saved locally inside your browser.',
      },
      {
        question: 'Is there any limit on projects or team login required?',
        answer:
          'No login is required. Everything stays private inside your browser tab.',
      },
      {
        question: 'Does Task Board export images or add watermarks?',
        answer:
          'No. There is no watermark on any Productivity tool.',
      },
    ],
    relatedTools: [
      'productivity-smart-to-do-list',
      'productivity-daily-planner',
      'productivity-meeting-notes',
      'productivity-pomodoro-timer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-daily-planner',
    name: 'Daily Planner',
    slug: 'productivity-daily-planner',
    category: 'productivity-tools',
    url: '/productivity-daily-planner',
    description:
      'Plan your day by time slot with timed tasks, notes, and completion checkboxes—saved locally in your browser.',
    longDescription:
      'Structure your workday hour by hour with time-slotted tasks, session notes, and quick tick-off checkboxes. Daily Planner saves your schedule cleanly inside your browser without accounts or remote syncing.',
    keywords: [
      'daily planner',
      'time blocking',
      'time slot planner',
      'day schedule',
      'browser planner',
    ],
    icon: 'CalendarClock',
    acceptedFormats: ['Browser Input'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Daily Planner | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Map out your day by time slot with tasks, times, notes, and tick-off checkboxes saved in your browser.',
    howTo: [
      {
        title: 'Assign tasks to time slots',
        description:
          'Enter start/end times or pick hourly slots along with task labels.',
      },
      {
        title: 'Attach brief notes',
        description:
          'Add links, prep reminders, or context notes to any scheduled block.',
      },
      {
        title: 'Tick off completed blocks',
        description:
          'Check off finished time slots throughout the day—all saved locally in your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does Daily Planner sync with external calendars or require sign-in?',
        answer:
          'No. Daily Planner is a fast, standalone browser time-slot planner that saves locally without external logins.',
      },
      {
        question: 'Can I add notes to individual time blocks?',
        answer:
          'Yes. Each scheduled slot supports task text, time range, and optional notes.',
      },
      {
        question: 'Are completed tasks saved when I reload the page?',
        answer:
          'Yes. Your daily schedule and tick marks persist in browser storage.',
      },
      {
        question: 'Does Daily Planner use AI scheduling?',
        answer:
          'No. You remain in full manual control of every time block—no AI is used.',
      },
    ],
    relatedTools: [
      'productivity-smart-to-do-list',
      'productivity-task-board',
      'productivity-pomodoro-timer',
      'productivity-countdown-timer',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-sticky-notes',
    name: 'Sticky Notes',
    slug: 'productivity-sticky-notes',
    category: 'productivity-tools',
    url: '/productivity-sticky-notes',
    description:
      'Create colourful yellow, blue, green, pink, and purple sticky notes that save automatically in your browser.',
    longDescription:
      'Capture quick ideas, phone numbers, snippets, and reminders on colour-coded sticky notes in yellow, blue, green, pink, or purple. Every note saves automatically inside your browser with zero sign-up.',
    keywords: [
      'sticky notes',
      'online sticky notes',
      'colourful notes',
      'browser memo pad',
      'quick notes',
    ],
    icon: 'StickyNote',
    acceptedFormats: ['Text'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Sticky Notes | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Write quick yellow, blue, green, pink, and purple sticky notes saved locally inside your browser.',
    howTo: [
      {
        title: 'Create a colourful note',
        description:
          'Click New Note and choose yellow, blue, green, pink, or purple.',
      },
      {
        title: 'Write and organize freely',
        description:
          'Type quick reminders or snippets and switch colours anytime to group topics.',
      },
      {
        title: 'Keep saved in browser',
        description:
          'Notes stay stored locally in your browser without creating an account.',
      },
    ],
    faqs: [
      {
        question: 'Which colours are included in Sticky Notes?',
        answer:
          'Sticky Notes supports five classic note colours: yellow, blue, green, pink, and purple.',
      },
      {
        question: 'Do my sticky notes stay saved if I close the tab?',
        answer:
          'Yes. All notes are saved locally in browser storage so they reopen when you return on the same browser.',
      },
      {
        question: 'Are my notes uploaded to any server?',
        answer:
          'No. Everything stays privately on your device inside your browser.',
      },
      {
        question: 'Is there any watermark or note fee?',
        answer:
          'No. Sticky Notes is 100% free with zero watermarks.',
      },
    ],
    relatedTools: [
      'productivity-meeting-notes',
      'productivity-smart-to-do-list',
      'productivity-daily-planner',
      'productivity-mood-tracker',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-meeting-notes',
    name: 'Meeting Notes',
    slug: 'productivity-meeting-notes',
    category: 'productivity-tools',
    url: '/productivity-meeting-notes',
    description:
      'Log meeting title, date, time, attendees, agenda, and history—and download any meeting as a .txt file.',
    longDescription:
      'Document every meeting cleanly with structured fields for title, date, time, attendees, agenda, and discussion notes. Review past meetings in your local browser history and export any record as a clean plain-text (.txt) file with zero watermark.',
    keywords: [
      'meeting notes',
      'meeting minutes',
      'agenda notes',
      'download meeting txt',
      'attendees tracker',
    ],
    icon: 'FileText',
    acceptedFormats: ['Text', 'TXT'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Meeting Notes | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Record meeting title, date, time, attendees, and agenda locally, browse history, and download as a .txt file.',
    howTo: [
      {
        title: 'Enter meeting metadata',
        description:
          'Fill in the meeting title, date, time, and attendees list.',
      },
      {
        title: 'Write agenda and minutes',
        description:
          'Capture agenda topics, decisions, and follow-up points during the call.',
      },
      {
        title: 'Save history or export TXT',
        description:
          'Keep meetings stored in browser history or download any meeting cleanly as a .txt file.',
      },
    ],
    faqs: [
      {
        question: 'Can I download any saved meeting note as a file?',
        answer:
          'Yes. Any entry in your meeting history can be downloaded directly as a clean .txt text file.',
      },
      {
        question: 'Does Meeting Notes record audio or use AI transcription?',
        answer:
          'No. It is a fast manual meeting minutes editor with structured fields, local history, and .txt download—no audio capture and no AI.',
      },
      {
        question: 'Where is the meeting history saved?',
        answer:
          'Meeting records are stored locally inside your browser on your device.',
      },
      {
        question: 'Will exported .txt meeting files include any watermark?',
        answer:
          'No. Exported text files are completely clean.',
      },
    ],
    relatedTools: [
      'productivity-sticky-notes',
      'productivity-daily-planner',
      'productivity-task-board',
      'productivity-smart-to-do-list',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-countdown-timer',
    name: 'Countdown Timer',
    slug: 'productivity-countdown-timer',
    category: 'productivity-tools',
    url: '/productivity-countdown-timer',
    description:
      'Set custom minutes, start or pause anytime, and hear an alert beep when the countdown finishes.',
    longDescription:
      'Run a clean, distraction-free browser countdown timer for study blocks, cooking, workouts, or presentations. Set any minute duration, start, pause, or reset with one click, and hear an audible browser beep when time runs out.',
    keywords: [
      'countdown timer',
      'online timer',
      'minute timer beep',
      'study timer',
      'pause timer',
    ],
    icon: 'Timer',
    acceptedFormats: ['Browser Timer'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Countdown Timer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Set minutes, start or pause a clean browser countdown timer, and get an alert beep when time is up.',
    howTo: [
      {
        title: 'Set target minutes',
        description:
          'Enter your desired minute count or choose a quick preset.',
      },
      {
        title: 'Start or pause anytime',
        description:
          'Run the live countdown in your browser tab, pause mid-way, or reset whenever needed.',
      },
      {
        title: 'Hear completion beep',
        description:
          'A crisp browser audio beep sounds when the timer reaches 00:00.',
      },
    ],
    faqs: [
      {
        question: 'Will Countdown Timer play a sound when finished?',
        answer:
          'Yes. It generates a clean alert beep directly in your browser using Web Audio when the countdown reaches zero.',
      },
      {
        question: 'Can I pause and resume the countdown?',
        answer:
          'Yes. You can start, pause, resume, or reset at any point.',
      },
      {
        question: 'Does the timer work offline once the page is loaded?',
        answer:
          'Yes. Timing logic and audio tone generation run entirely locally in your browser.',
      },
      {
        question: 'Need structured focus and break intervals instead?',
        answer:
          'Use Pomodoro Timer for alternating focus sessions and breaks with session tracking.',
      },
    ],
    relatedTools: [
      'productivity-pomodoro-timer',
      'productivity-daily-planner',
      'productivity-habit-streak',
      'productivity-smart-to-do-list',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-pomodoro-timer',
    name: 'Pomodoro Timer',
    slug: 'productivity-pomodoro-timer',
    category: 'productivity-tools',
    url: '/productivity-pomodoro-timer',
    description:
      'Classic 25-minute focus and 5-minute break intervals with adjustable lengths and completed session counter.',
    longDescription:
      'Stay locked in with structured 25-minute focus sprints followed by 5-minute breaks. Adjust focus and break durations to fit your workflow and track your completed Pomodoro session count locally in your browser.',
    keywords: [
      'pomodoro timer',
      '25 minute focus timer',
      'study focus timer',
      'session counter',
      'work break timer',
    ],
    icon: 'Hourglass',
    acceptedFormats: ['Browser Timer'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Pomodoro Timer | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Run 25-minute focus and 5-minute break cycles with adjustable durations and session count in your browser.',
    howTo: [
      {
        title: 'Use 25/5 or customize lengths',
        description:
          'Start with the classic 25-min focus + 5-min break preset or adjust minutes.',
      },
      {
        title: 'Alternate focus and breaks',
        description:
          'Complete focused intervals with audible cues signaling when to rest or resume.',
      },
      {
        title: 'Track completed sessions',
        description:
          'View your running focus session count across the day inside your browser.',
      },
    ],
    faqs: [
      {
        question: 'Can I adjust the 25-minute focus and 5-minute break durations?',
        answer:
          'Yes. Classic 25/5 defaults are preloaded, and both focus and break lengths are adjustable.',
      },
      {
        question: 'Does Pomodoro Timer count completed sessions?',
        answer:
          'Yes. Completed focus blocks increment your daily session counter locally in your browser.',
      },
      {
        question: 'Does it require an account or tracking cookies?',
        answer:
          'No. Session counts save locally without sign-in.',
      },
      {
        question: 'Is there a simpler single-countdown option?',
        answer:
          'Yes. Countdown Timer gives a quick one-off minute countdown with a completion beep.',
      },
    ],
    relatedTools: [
      'productivity-countdown-timer',
      'productivity-daily-planner',
      'productivity-task-board',
      'productivity-smart-to-do-list',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-habit-streak',
    name: 'Habit Streak',
    slug: 'productivity-habit-streak',
    category: 'productivity-tools',
    url: '/productivity-habit-streak',
    description:
      'Add daily habits, tick them off each day, and view both your current streak and longest streak.',
    longDescription:
      'Build consistency around daily routines—reading, exercise, language study, or journaling. Add custom habits, check them off once per day, and monitor current and longest streak counts saved privately in your browser.',
    keywords: [
      'habit streak',
      'habit tracker',
      'daily habits',
      'streak counter',
      'longest streak',
    ],
    icon: 'Flame',
    acceptedFormats: ['Browser Input'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Habit Streak | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Add habits, check them off daily, and track current and longest streaks locally in your browser.',
    howTo: [
      {
        title: 'Add a daily habit',
        description:
          'Enter one or more habits you want to practice every day.',
      },
      {
        title: 'Mark done daily',
        description:
          'Click to mark a habit complete for today’s calendar date.',
      },
      {
        title: 'Watch current and longest streaks',
        description:
          'Track consecutive completed days and all-time best streaks saved in your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does Habit Streak track both current and longest streaks?',
        answer:
          'Yes. Each habit displays your active consecutive-day streak alongside your personal-best longest streak.',
      },
      {
        question: 'Where is my habit history stored?',
        answer:
          'All habits and daily check-in dates are saved locally inside your browser.',
      },
      {
        question: 'Can I track multiple habits at once?',
        answer:
          'Yes. Add as many personal habits as you like with independent streak counters.',
      },
      {
        question: 'Does Habit Streak send push notifications?',
        answer:
          'No. It is a lightweight browser check-in tracker with zero account setup.',
      },
    ],
    relatedTools: [
      'productivity-water-tracker',
      'productivity-mood-tracker',
      'productivity-smart-to-do-list',
      'productivity-medicine-reminder',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-water-tracker',
    name: 'Water Tracker',
    slug: 'productivity-water-tracker',
    category: 'productivity-tools',
    url: '/productivity-water-tracker',
    description:
      'Log daily water intake against an adjustable ml goal with 250 ml, 500 ml, and 1,000 ml quick-add buttons.',
    longDescription:
      'Keep tabs on daily hydration effortlessly with one-tap 250 ml, 500 ml, and 1,000 ml quick-add buttons, a visual daily progress bar, and an adjustable target goal stored directly in your browser.',
    keywords: [
      'water tracker',
      'hydration tracker',
      'daily water intake',
      '250ml 500ml water log',
      'water goal',
    ],
    icon: 'Droplet',
    acceptedFormats: ['Browser Input'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Water Tracker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Track daily water vs goal with 250, 500, and 1,000 ml quick-add buttons and an adjustable target in your browser.',
    howTo: [
      {
        title: 'Set your daily ml goal',
        description:
          'Adjust your daily hydration target in millilitres (such as 2,000 ml or 2,500 ml).',
      },
      {
        title: 'Tap quick-add amounts',
        description:
          'Log glasses or bottles instantly with 250 ml, 500 ml, and 1,000 ml quick-add buttons.',
      },
      {
        title: 'Monitor daily progress',
        description:
          'See remaining ml toward your goal—saved locally inside your browser.',
      },
    ],
    faqs: [
      {
        question: 'Which quick-add buttons are included in Water Tracker?',
        answer:
          'Water Tracker provides one-click quick-add buttons for 250 ml, 500 ml, and 1,000 ml.',
      },
      {
        question: 'Can I customize my daily water target?',
        answer:
          'Yes. You can adjust the daily millilitre target anytime to suit your preference.',
      },
      {
        question: 'Does my water log reset each new day?',
        answer:
          'Yes. Daily intake tracks cleanly by date and resets automatically on a new day.',
      },
      {
        question: 'Is this medical or clinical hydration advice?',
        answer:
          'No. Water Tracker is a simple personal hydration counter saved locally in your browser.',
      },
    ],
    relatedTools: [
      'productivity-habit-streak',
      'productivity-medicine-reminder',
      'productivity-mood-tracker',
      'productivity-daily-planner',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-mood-tracker',
    name: 'Mood Tracker',
    slug: 'productivity-mood-tracker',
    category: 'productivity-tools',
    url: '/productivity-mood-tracker',
    description:
      'Log one of six moods with an optional note and browse recent entries in your browser to spot patterns.',
    longDescription:
      'Check in quickly by picking from six clear mood states and adding an optional short reflection note. Review your recent entries chronologically in your browser to spot personal triggers and weekly patterns—privately stored on your device.',
    keywords: [
      'mood tracker',
      'mood journal',
      'six moods log',
      'daily mood patterns',
      'browser mood diary',
    ],
    icon: 'Smile',
    acceptedFormats: ['Browser Input'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Mood Tracker | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Log one of six moods plus an optional note and review recent browser-saved entries to spot patterns.',
    howTo: [
      {
        title: 'Choose one of six moods',
        description:
          'Tap whichever of the six mood options best fits how you feel right now.',
      },
      {
        title: 'Add an optional note',
        description:
          'Include a brief context note about sleep, work, or events if helpful.',
      },
      {
        title: 'Review recent patterns',
        description:
          'Scroll through your recent locally saved check-ins to notice helpful trends.',
      },
    ],
    faqs: [
      {
        question: 'How many mood options does Mood Tracker include?',
        answer:
          'You choose from six straightforward mood options, each supporting an optional short note.',
      },
      {
        question: 'Does Mood Tracker use AI sentiment analysis or upload entries?',
        answer:
          'No. Entries stay strictly in your browser with no AI analysis and zero server uploads.',
      },
      {
        question: 'Can I review past entries to see patterns?',
        answer:
          'Yes. Recent entries list timestamps, selected moods, and notes cleanly.',
      },
      {
        question: 'Is Mood Tracker a mental health diagnostic tool?',
        answer:
          'No. It is a private self-reflection journal saved locally in your browser.',
      },
    ],
    relatedTools: [
      'productivity-habit-streak',
      'productivity-sticky-notes',
      'productivity-water-tracker',
      'productivity-daily-planner',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-expense-reminder',
    name: 'Expense Reminder',
    slug: 'productivity-expense-reminder',
    category: 'productivity-tools',
    url: '/productivity-expense-reminder',
    description:
      'Record daily expenses with amount, category, note, and category filtering—currency-neutral for any currency.',
    longDescription:
      'Keep a fast daily log of spending with amount, category, and an optional note, filter entries by category, and view instant total spending. Currency-neutral by design—type your preferred currency symbol or code (USD, EUR, GBP, INR, PKR, etc.) without forced bank links.',
    keywords: [
      'expense reminder',
      'daily expense log',
      'currency neutral expense tracker',
      'spending filter',
      'browser budget log',
    ],
    icon: 'Wallet',
    acceptedFormats: ['Browser Input'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Expense Reminder | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Log daily expenses with amount, category, and note, filter by category, and view currency-neutral totals.',
    howTo: [
      {
        title: 'Type currency & expense amount',
        description:
          'Set any currency code or symbol you prefer and log an expense amount.',
      },
      {
        title: 'Pick a category and note',
        description:
          'Tag each entry by category and optional description (groceries, transit, rent, etc.).',
      },
      {
        title: 'Filter categories and view total',
        description:
          'Filter logged entries by category to see filtered and overall spending totals in your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does Expense Reminder support my local currency?',
        answer:
          'Yes. It is completely currency-neutral—you type any currency symbol or code you want.',
      },
      {
        question: 'Can I filter spending by category?',
        answer:
          'Yes. Filtering updates both the visible expense list and the calculated spending total.',
      },
      {
        question: 'Does it connect to bank accounts or payment cards?',
        answer:
          'No. You enter expenses manually and all data stays privately in your browser.',
      },
      {
        question: 'Will it convert currencies automatically?',
        answer:
          'No. For currency conversions, use our Currency Converter tool under Unit Converters.',
      },
    ],
    relatedTools: [
      'unit-currency-converter',
      'productivity-daily-planner',
      'productivity-smart-to-do-list',
      'productivity-medicine-reminder',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'productivity-medicine-reminder',
    name: 'Medicine Reminder',
    slug: 'productivity-medicine-reminder',
    category: 'productivity-tools',
    url: '/productivity-medicine-reminder',
    description:
      'List medicines with dose and time, tick them off once taken, and reset daily ticks automatically in your browser.',
    longDescription:
      'Keep a straightforward daily schedule of medicines with dosage notes and target times, check each item off once taken, and start fresh every morning with daily ticks resetting automatically—saved privately in your browser.',
    keywords: [
      'medicine reminder',
      'pill checklist',
      'dosage tracker',
      'daily medicine ticks',
      'browser pill log',
    ],
    icon: 'Pill',
    acceptedFormats: ['Browser Input'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Medicine Reminder | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Track daily medicines with dose and time, tick off taken doses, and auto-reset ticks daily in your browser.',
    howTo: [
      {
        title: 'Add medicine, dose, and time',
        description:
          'Enter each medicine name, dosage strength, and scheduled time.',
      },
      {
        title: 'Tick off doses once taken',
        description:
          'Check off each scheduled dose after taking it so you never double-dose by mistake.',
      },
      {
        title: 'Automatic daily tick reset',
        description:
          'Checkmarks reset automatically when a new calendar day begins—saved locally in your browser.',
      },
    ],
    faqs: [
      {
        question: 'Do Medicine Reminder checkmarks reset every day?',
        answer:
          'Yes. Your medicine list stays saved in your browser while daily "taken" ticks reset automatically each new date.',
      },
      {
        question: 'Does this send SMS or mobile push alarms?',
        answer:
          'No. It is a browser-based visual checklist stored locally on your device.',
      },
      {
        question: 'Is Medicine Reminder medical advice?',
        answer:
          'No. Always follow your doctor or pharmacist instructions; this tool is a personal reminder checklist only.',
      },
      {
        question: 'Is any account or personal health upload required?',
        answer:
          'No. Nothing leaves your browser.',
      },
    ],
    relatedTools: [
      'productivity-water-tracker',
      'productivity-habit-streak',
      'productivity-daily-planner',
      'productivity-smart-to-do-list',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
