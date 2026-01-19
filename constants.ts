
import { StrategyType, StrategyData } from './types';

export const STRATEGIES: StrategyData[] = [
  {
    id: StrategyType.WARM_UP_POLL,
    purpose: "Build immediate engagement, activate prior knowledge, and set the emotional tone for learning through a low-stakes, curiosity-driven poll.",
    totalTime: "7–10 minutes",
    tools: "Mentimeter",
    toolLink: "https://www.mentimeter.com/app/home",
    instructionalNote: "You can practice creating and running polls using Mentimeter. Try building a short 3-question quiz for your next session.",
    flow: [
      { 
        phase: "1. Launch — Create Curiosity", 
        time: "1 min",
        goal: "Start with enthusiasm and explain that this is a fun warm-up quiz, not a test.",
        action: "Launch the poll and invite students to join via code/QR.", 
        prompt: "Let’s begin with a quick warm-up quiz. Scan the code and pick the answer that feels right — no overthinking!",
        aiTip: "Encourage laughter or curiosity. Keep it light — this is to spark engagement, not assess."
      },
      { 
        phase: "2. Think & Vote — Answer Questions", 
        time: "2–3 min", 
        goal: "Engage students in rapid-fire intuitive response.",
        action: "Questions appear one at a time with a visible countdown timer (30-40s).", 
        prompt: "Take 30 seconds for this one. Speed and accuracy both count for the leaderboard!",
        aiTip: "Each question should last no more than 30–40 seconds. Keep pace brisk to sustain excitement."
      },
      { 
        phase: "3. Show Results — Reveal Leaderboard", 
        time: "1–2 min",
        goal: "Acknowledge both correct answers and fast responses.",
        action: "Display the mini-leaderboard showing scores based on speed and correctness.", 
        prompt: "Great job, everyone! Let’s celebrate our fastest correct responder — fantastic thinking!",
        aiTip: "Avoid ranking negativity — focus on energy and encouragement."
      },
      { 
        phase: "4. Recognition — Motivate Participation", 
        time: "Ongoing",
        goal: "Build positive emotional climate and support inclusion.",
        action: "Verbally recognize top scorers and applaud improvements.", 
        prompt: "Well done, [Name]! That was a fast and accurate answer. Keep it up, team — new question coming!",
        aiTip: "Recognition builds confidence and keeps even the competitive moments inclusive."
      },
      { 
        phase: "5. Anchor Learning — Wrap-Up", 
        time: "2 min",
        goal: "Connect the intuition from the poll to the upcoming lesson logic.",
        action: "Discuss how initial intuition compared to the logical reality of the question.", 
        prompt: "Notice how your initial intuition compared to your reasoning after the question — that’s how learning grows.",
        aiTip: "After the final leaderboard, briefly discuss the reasoning behind the trickiest question."
      }
    ],
    tips: [
      "Inclusive recognition: Highlight fast thinking as one skill, but emphasize participation too.",
      "Steady Tempo: Manage transitions smoothly between questions.",
      "Emotional Resets: Use leaderboard moments to celebrate and smile.",
      "Meta-learning: Discuss 'Why' a certain answer was chosen by the majority."
    ],
    mistakes: [
      "Treating it like a formal test — it should be a primer.",
      "Overloading with questions — 3 to 5 is the sweet spot.",
      "Ignoring lower performers — highlight progress over pure rank.",
      "Complex wording — keep the language simple for high accessibility."
    ],
    disciplineExamples: [
      { 
        discipline: "Aptitude", 
        example: "If the ratio of A to B is 2:3 and B to C is 4:5, what is the ratio of A to C?"
      },
      { 
        discipline: "English", 
        example: "Which of the following sentences uses the correct preposition?"
      },
      { 
        discipline: "Computer Science", 
        example: "What will be the output of this C code snippet?"
      }
    ],
    reflectionPrompts: [
      "What emotional tone did this activity set for your class?",
      "How did your students respond — enthusiasm, competition, or hesitation?",
      "What did you learn about their prior knowledge and confidence?",
      "How could you modify the next poll for more balance?"
    ]
  },
  {
    id: StrategyType.CURIOSITY_TRIGGER,
    purpose: "Pose a scenario-based mystery to spark interest and reveal the answer through exploration.",
    totalTime: "3–5 minutes",
    demoImage: "https://raw.githubusercontent.com/Anupam-NXTWave/Static-Assets/main/classroom_writing_demo.jpg", 
    demoCaption: "Classroom Demo: The instructor displays a slide with a real-world question or scenario (e.g., “Imagine Flipkart shows a bar graph of mobile sales for 3 companies over 5 years — what questions can we ask from this data?”). The instructor collects student responses verbally and writes them directly on the slide. Students begin to hypothesize, challenge each other, and build curiosity before the lesson starts.",
    flow: [
      { 
        phase: "Step 1: Pre-Session Setup — Prepare the Slide", 
        time: "Before Class",
        goal: "Prepare a single visual that makes students think, not recall.",
        action: "Display a curiosity-provoking image, chart, or short scenario with the main question. Avoid giving hints.", 
        prompt: "Prepare a single visual — it could be a graph, image, or a short case. Pose a question that makes students think, not recall. For example: ‘Why do you think this pattern occurs?’ or ‘How might we explain this difference?’" 
      },
      { 
        phase: "Step 2: Launch — Spark Curiosity", 
        time: "1 min",
        goal: "Reduce pressure and allow spontaneous responses with a casual tone.",
        action: "Start the activity as students enter. Point to the question and ask for their first guess.", 
        prompt: "What do you think is happening here? or What’s your first guess? This works best when students are not expecting a formal start. The casual tone reduces pressure and allows spontaneous responses." 
      },
      { 
        phase: "Step 3: Ask Verbally — Encourage Divergent Thinking", 
        time: "1–2 min",
        goal: "Keep asking 'why' to keep curiosity alive and prevent closure too soon.",
        action: "Invite verbal answers openly. Accept all responses. Ask 'why' and 'how' to build depth.", 
        prompt: "Keep asking why — ‘Why do you think that?’ or ‘How did you reach that conclusion?’ Each ‘why’ keeps curiosity alive and prevents closure too soon." 
      },
      { 
        phase: "Step 4: Write & Record — Capture the Responses", 
        time: "1–2 min",
        goal: "Make the process inclusive and safe by capturing all student guesses.",
        action: "Write student responses directly on the slide or whiteboard boxes. Keep answers visible.", 
        prompt: "Write down even partial or funny answers — this makes the process inclusive and safe. Avoid erasing; visible guesses keep tension alive and build engagement." 
      },
      { 
        phase: "Step 5: Lesson Hook — Connect Curiosity to Content", 
        time: "1 min",
        goal: "Frame the lesson as an answer-seeking journey to resolve the mystery.",
        action: "Once the session starts, refer back to the slide. Frame the lesson as the resolution to their raised questions.", 
        prompt: "You asked some brilliant questions earlier. By the end of today, we’ll have evidence to answer each of those." 
      }
    ],
    tips: [
      "Use a single slide or visual; keep it visible as students enter.",
      "Encourage laughter and guesses — avoid giving clues too early.",
      "Keep at least 3–5 student responses visible on screen or board.",
      "Transition naturally from curiosity to concept ('Let’s find out together')."
    ],
    mistakes: [
      "Explaining too soon — let ambiguity breathe.",
      "Correcting student guesses — curiosity fades with judgment.",
      "Using overly complex visuals — simplicity invites engagement.",
      "Moving to the next topic before linking back — always close the loop later."
    ],
    disciplineExamples: [
      { 
        discipline: "Aptitude", 
        example: "Two trains start from opposite directions — can both reach the same station at the same time if their speeds differ?"
      },
      { 
        discipline: "English", 
        example: "Why do we say ‘interested in’ and not ‘interested on’? Is there a rule — or just habit?"
      },
      { 
        discipline: "Computer Science", 
        example: "When two processes access the same variable, what do you think happens first — read or write?"
      }
    ],
    instructionalNote: "Select a question that challenges assumptions — something that students can’t answer instantly.",
    reflectionPrompts: [
      "Did students appear curious or passive during the discussion?",
      "Which “why” or “how” question triggered the most engagement?",
      "How did you connect the curiosity moment to your main topic?"
    ]
  },
  {
    id: StrategyType.THINK_PAIR_SHARE,
    purpose: "Facilitate reasoning-driven, collaborative discussions that empower students to think independently, discuss meaningfully, and share collectively.",
    totalTime: "10 minutes",
    extraContent: "Encourage deeper reasoning, peer learning, and engagement through structured dialogue.",
    flow: [
      { 
        phase: "Phase 1: THINK", 
        time: "2 min",
        goal: "Individual reflection and reasoning.",
        action: "Display a reasoning-based question. Students think silently and jot down their 'Why'.", 
        prompt: "Take 2 minutes to think on your own. Write down what you believe is the answer and—most importantly—why. Don’t worry about being right; focus on your reasoning.",
        aiTip: "Use prompts like: 'Why do you think that’s true?' or 'How would you justify your approach?'"
      },
      { 
        phase: "Phase 2: PAIR", 
        time: "2–3 min",
        goal: "Peer discussion and refinement of ideas.",
        action: "Students pair with neighbors to discuss reasoning. Instructor walks around to listen.", 
        prompt: "Now turn to your neighbor and share your thoughts. Try to explain your reasoning and listen to theirs carefully. See if you can agree, or if your perspectives differ — that’s where learning happens.",
        aiTip: "Listen in and ask groups subtle prompts like: 'Can you both agree on one reasoning?' or 'Can you defend your answer to your partner?'"
      },
      { 
        phase: "Phase 3: SHARE", 
        time: "3–5 min",
        goal: "Collective synthesis and reflection.",
        action: "Invite 2–3 pairs to share their reasoning with the class. Highlight diverse viewpoints.", 
        prompt: "Let’s come back together. I’d like to hear from 2 or 3 pairs about how they approached the question. Focus on explaining why you chose your method — not just your answer.",
        aiTip: "If time is short, summarize common patterns aloud. Reinforce that this is about understanding multiple ways of thinking."
      },
      { 
        phase: "Phase 4: DEBRIEF & CLOSE", 
        time: "1 min",
        goal: "Reinforce learning and reflection.",
        action: "Summarize collective reasoning and acknowledge valid approaches.", 
        prompt: "Notice how your reasoning evolved through discussion. The goal of TPS is not just to be correct, but to understand why and how others think differently.",
        aiTip: "Ask students: 'How did your answer change after hearing others’ perspectives?'"
      }
    ],
    tips: [
      "Pose only one question — but make it deep enough for debate.",
      "Ask 'why' and 'how' questions frequently to build depth.",
      "Move around actively during pair discussions to ensure inclusivity.",
      "Rotate pairs periodically to increase diversity of thinking."
    ],
    mistakes: [
      "Using factual recall questions (yes/no or definitions) instead of reasoning.",
      "Letting the same students or pairs dominate the Share phase every time.",
      "Moving to the next topic without a collective synthesis.",
      "Ignoring quieter or isolated pairs during the walk-around."
    ],
    disciplineExamples: [
      { 
        discipline: "Aptitude", 
        example: "If 60% of 30 equals x% of 50, which is greater — x or 30? Explain why."
      },
      { 
        discipline: "English", 
        example: "Which sentence better conveys empathy — ‘I understand how you feel’ or ‘That must have been hard’? Why?"
      },
      { 
        discipline: "Computer Science", 
        example: "In a multithreaded program, two threads update the same variable — what do you think happens first, and why?"
      }
    ],
    instructionalNote: "Choose reasoning-based, open-ended, or real-world questions that invite multiple viewpoints.",
    reflectionPrompts: [
      "How evenly were students participating in pairs?",
      "Did the discussion reveal reasoning diversity or consensus?",
      "How might you scaffold more hesitant students next time?",
      "What changes in engagement did you notice across phases?"
    ]
  },
  {
    id: StrategyType.SELF_REFLECTION,
    purpose: "Facilitate a calm moment of introspection where students review and internalize today’s learning.",
    totalTime: "5 minutes",
    tools: "Google Forms | Formbricks | SurveyHeart",
    instructionalNote: "This is a silent written reflection to help students consolidate their understanding before the session ends. Learners scan the QR code or open the form link, respond individually, and submit privately. There are no right or wrong answers — only insights about their own learning.",
    flow: [
      { 
        phase: "1. Launch & Recap", 
        time: "1 min",
        goal: "Anchor student memory before they reflect.",
        action: "Briefly list the key topics covered in the session. Then, share the form access details and explain the value of the exercise.", 
        prompt: "Before we finish, let's briefly look back at what we covered today: [Quickly recap main topics]. Now, let's take a few quiet minutes for a personal reflection. Scan the QR code or open the link. Please be honest — there are no right or wrong answers. This isn't a quiz; it's a way for you to think back and strengthen your memory of what we just learned. Even just attempting this will help you remember the class much better!" 
      },
      { 
        phase: "2. Reflect", 
        time: "3 min",
        goal: "Individual introspection time.",
        action: "Provide silence for students to answer the form questions.", 
        prompt: "Take three minutes to answer the questions. Focus on your own growth — what was clear, what was new, and what still feels a bit blurry." 
      },
      { 
        phase: "3. Reassure & Close", 
        time: "1 min",
        goal: "Provide closure and acknowledge the value of reflection.",
        action: "Closing the activity with encouragement.", 
        prompt: "Thank you for taking the time to reflect. Remember, the goal of this was to help you anchor your own learning. Your honest thoughts help both of us see the progress you're making." 
      }
    ],
    tips: [
      "Keep reflection short (≤ 5 min).",
      "Encourage a calm, quiet environment — no discussion.",
      "Assure students that submissions are confidential.",
      "Read 1–2 anonymous reflections aloud next class to normalize feedback."
    ],
    mistakes: [
      "Turning it into a quiz.",
      "Rushing — silence is productive here."
    ],
    reflectionPrompts: [
      "Which concept felt most clear to you today?",
      "Which part of today’s class was most challenging?",
      "What’s one question you still have?"
    ],
    disciplineExamples: [
      { discipline: "Google Forms", example: "https://forms.google.com" },
      { discipline: "Formbricks", example: "https://app.formbricks.com" },
      { discipline: "SurveyHeart", example: "https://surveyheart.com" }
    ]
  }
];

export const PDF_CONTENT_RAW = `
Instructor Delivery Guide: Active Learning Activities (Polaris 2.0 Update)
Shared Principles: Set the Stage, Create Safety, Be Active, Timebox Clearly, Debrief Effectively.
Warm-Up Poll (Polaris 2.0): 7-10 mins. Use Mentimeter. Flow: Launch (1m), Think & Vote (2-3m), Show Results/Leaderboard (1-2m), Recognition (ongoing), Anchor (2m).
Curiosity Trigger (Polaris 2.0): 3-5 mins. Interactive classroom warm-up. Flow: Prepare Slide (Pre-Session), Launch (1m), Ask Verbally (1-2m), Write & Record (1-2m), Lesson Hook (1m).
Think-Pair-Share (TPS) (Polaris 2.0): 10 mins total. Phases: Think (2m), Pair (2-3m), Share (3-5m), Debrief (1m). 
TPS Focus: Reasoning-driven, collaborative discussions. Instructor walk-around is critical. Use reasoning-based open-ended questions.
Self-Reflection (Polaris 2.0): 5 mins total. 1 min Launch, 3 min Reflect, 1 min Reassure. Use Google Forms, Formbricks, SurveyHeart.
`;
