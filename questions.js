// ========================================
// 50 ASSESSMENT QUESTIONS FOR GRADE 6
// 25 Reading Comprehension + 25 Grammar
// ========================================

const questions = [
    // ===== READING COMPREHENSION (25 questions) =====
    {
        id: 1,
        category: "Reading Comprehension",
        difficulty: "easy",
        passage: "The rainforest is home to millions of species of plants and animals. Many of these species cannot be found anywhere else on Earth. The trees in the rainforest are very tall and create a canopy that blocks most of the sunlight from reaching the forest floor. This unique environment has existed for millions of years, but it is now threatened by deforestation and climate change.",
        question: "Based on the passage, what can we infer about the rainforest ecosystem?",
        options: [
            "The rainforest has very few species of animals",
            "Most of the sun's energy reaches the forest floor",
            "Deforestation has helped protect the unique species",
            "It is a long-standing, unique, and biologically diverse habitat"
        ],
        correct: 3
    },
    {
        id: 2,
        category: "Reading Comprehension",
        difficulty: "easy",
        passage: "Maria loved to read books about adventure. Every night before bed, she would imagine herself as the hero in the stories she read. One day, her teacher announced a writing contest. Maria decided to write her own adventure story. She worked on it for weeks, carefully crafting each sentence. When she finally submitted her story, she felt proud of her work.",
        question: "What is the main idea of this passage?",
        options: [
            "Maria's teacher likes writing contests",
            "Maria enjoys reading and decides to write her own story",
            "Books about adventure are the best books to read",
            "Writing a story takes a long time"
        ],
        correct: 1
    },
    {
        id: 3,
        category: "Reading Comprehension",
        difficulty: "medium",
        passage: "Photosynthesis is the process by which plants make their own food. Plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. The green pigment called chlorophyll, found in plant leaves, captures the sunlight needed for this process. This is why plants are called producers in the food chain.",
        question: "According to the passage, what do plants need for photosynthesis?",
        options: [
            "Only water and carbon dioxide",
            "Only sunlight and oxygen",
            "Sunlight, water, and carbon dioxide",
            "Glucose, oxygen, and chlorophyll"
        ],
        correct: 2
    },
    {
        id: 4,
        category: "Reading Comprehension",
        difficulty: "medium",
        passage: "The ancient Egyptians built pyramids as tombs for their pharaohs. These massive structures took decades to complete and required thousands of workers. The largest pyramid, the Great Pyramid of Giza, was built around 2560 BC and remained the tallest man-made structure for over 3,800 years. Today, these pyramids continue to amaze visitors from around the world.",
        question: "What is the author's purpose in this passage?",
        options: [
            "To persuade readers to visit Egypt",
            "To inform readers about Egyptian pyramids",
            "To entertain readers with a story about pharaohs",
            "To explain how to build a pyramid"
        ],
        correct: 1
    },
    {
        id: 5,
        category: "Reading Comprehension",
        difficulty: "easy",
        passage: "Recycling is one of the best ways to help protect our environment. When we recycle materials like paper, plastic, and glass, we reduce the amount of waste that goes into landfills. Recycling also saves energy and natural resources. For example, recycling one aluminum can saves enough energy to run a television for three hours.",
        question: "What can you conclude from this passage?",
        options: [
            "Recycling is too difficult for most people",
            "Television uses very little energy",
            "Recycling has multiple environmental benefits",
            "Landfills are the best place for waste"
        ],
        correct: 2
    },
    {
        id: 6,
        category: "Reading Comprehension",
        difficulty: "medium",
        passage: "The water cycle is a continuous process that circulates water throughout Earth. First, the sun heats water in oceans, lakes, and rivers, causing evaporation. The water vapor rises into the atmosphere and cools, forming clouds through condensation. Eventually, the water falls back to Earth as precipitation in the form of rain, snow, or hail. This water then collects in bodies of water, and the cycle begins again.",
        question: "According to the passage, what happens after water vapor rises into the atmosphere?",
        options: [
            "It immediately falls as rain",
            "It cools and forms clouds",
            "It evaporates again",
            "It returns to the ocean"
        ],
        correct: 1
    },
    {
        id: 7,
        category: "Reading Comprehension",
        difficulty: "hard",
        passage: "Bioluminescence is the ability of living organisms to produce light. Fireflies, certain fish, and some jellyfish possess this remarkable ability. These organisms create light through a chemical reaction that occurs in their bodies. While scientists understand the basic chemistry behind bioluminescence, they continue to study why different species evolved this trait. Some theories suggest it helps with attracting mates, deterring predators, or luring prey.",
        question: "What is the main purpose of this paragraph?",
        options: [
            "To explain only how fireflies create light",
            "To describe bioluminescence and possible reasons organisms have it",
            "To prove that bioluminescence helps organisms find mates",
            "To argue that scientists don't understand bioluminescence"
        ],
        correct: 1
    },
    {
        id: 8,
        category: "Reading Comprehension",
        difficulty: "easy",
        passage: "Anna woke up early, excited for the field trip. She quickly got dressed, ate breakfast, and packed her lunch. When she arrived at school, she saw her classmates gathering near the bus. Their teacher checked everyone's permission slips before they boarded. Anna chose a seat next to her best friend, and they talked excitedly about visiting the science museum.",
        question: "Based on the passage, where are Anna and her classmates going?",
        options: [
            "To the zoo",
            "To a science museum",
            "To the park",
            "To another school"
        ],
        correct: 1
    },
    {
        id: 9,
        category: "Reading Comprehension",
        difficulty: "medium",
        passage: "The invention of the printing press by Johannes Gutenberg in 1440 revolutionized the spread of information. Before this invention, books had to be copied by hand, which was time-consuming and expensive. The printing press made it possible to produce books quickly and cheaply, making knowledge accessible to more people. This innovation played a crucial role in the spread of literacy and education throughout Europe.",
        question: "How did the printing press change society?",
        options: [
            "It made books more expensive",
            "It made knowledge accessible to more people",
            "It eliminated the need for education",
            "It replaced handwriting completely"
        ],
        correct: 1
    },
    {
        id: 10,
        category: "Reading Comprehension",
        difficulty: "hard",
        passage: "Climate change refers to long-term shifts in global temperatures and weather patterns. While climate has changed throughout Earth's history, current changes are occurring at an unprecedented rate, primarily due to human activities. The burning of fossil fuels releases greenhouse gases that trap heat in the atmosphere. Scientists warn that without significant action, these changes could have severe consequences for ecosystems, weather patterns, and human societies worldwide.",
        question: "What is the author's tone in this passage?",
        options: [
            "Humorous and lighthearted",
            "Concerned and informative",
            "Angry and accusatory",
            "Indifferent and neutral"
        ],
        correct: 1
    },
    {
        id: 11,
        category: "Reading Comprehension",
        difficulty: "easy",
        passage: "Dolphins are highly intelligent marine mammals known for their playful behavior and complex communication. They live in groups called pods and work together to hunt for fish. Dolphins use echolocation, a biological sonar system, to navigate and find prey in the ocean. They emit clicking sounds that bounce off objects, helping them 'see' their surroundings even in murky water.",
        question: "What is echolocation used for?",
        options: [
            "To communicate with other dolphins",
            "To breathe underwater",
            "To navigate and find prey",
            "To swim faster"
        ],
        correct: 2
    },
    {
        id: 12,
        category: "Reading Comprehension",
        difficulty: "medium",
        passage: "The human body has an amazing defense system called the immune system. When harmful bacteria or viruses enter your body, white blood cells spring into action. These cells identify and attack the invaders, helping you recover from illness. Some white blood cells even 'remember' diseases you've had before, which is why you usually don't get the same illness twice. Vaccines work by teaching your immune system to recognize and fight specific diseases.",
        question: "Based on the passage, why don't you usually get the same illness twice?",
        options: [
            "Because bacteria can't enter your body again",
            "Because white blood cells remember previous diseases",
            "Because vaccines prevent all illnesses",
            "Because your body becomes immune to all diseases"
        ],
        correct: 1
    },
    {
        id: 13,
        category: "Reading Comprehension",
        difficulty: "easy",
        passage: "Basketball was invented by Dr. James Naismith in 1891. He was a physical education teacher looking for an indoor game to keep his students active during winter. He nailed a peach basket to a wall and used a soccer ball for the first game. The original game had 13 rules, and players had to climb a ladder to retrieve the ball from the basket after each score. Today, basketball is one of the most popular sports in the world.",
        question: "Why did Dr. Naismith invent basketball?",
        options: [
            "To replace soccer as a popular sport",
            "To keep students active during winter indoors",
            "To make climbing ladders more fun",
            "To use up old peach baskets"
        ],
        correct: 1
    },
    {
        id: 14,
        category: "Reading Comprehension",
        difficulty: "hard",
        passage: "Metamorphosis is a biological process in which an animal undergoes a dramatic physical transformation. Butterflies provide a classic example: they begin life as caterpillars, form a chrysalis, and emerge as butterflies. This transformation involves completely reorganizing their body structure. Not all insects undergo complete metamorphosis; some, like grasshoppers, experience gradual changes through incomplete metamorphosis, where young insects resemble smaller versions of adults.",
        question: "What distinguishes complete metamorphosis from incomplete metamorphosis?",
        options: [
            "Complete metamorphosis occurs only in butterflies",
            "Incomplete metamorphosis takes longer to complete",
            "Complete metamorphosis involves dramatic transformation; incomplete involves gradual changes",
            "There is no difference between the two processes"
        ],
        correct: 2
    },
    {
        id: 15,
        category: "Reading Comprehension",
        difficulty: "medium",
        passage: "The Great Wall of China is one of the most impressive architectural achievements in history. Construction began over 2,000 years ago to protect Chinese territories from invasions. The wall stretches over 13,000 miles and was built by millions of workers over several dynasties. Contrary to popular belief, the Great Wall is not visible from space with the naked eye, but it remains one of the world's most visited tourist attractions.",
        question: "What is a common misconception about the Great Wall mentioned in the passage?",
        options: [
            "That it was built in one year",
            "That it is visible from space with the naked eye",
            "That it is the longest wall in the world",
            "That it was built by one dynasty"
        ],
        correct: 1
    },
    {
        id: 16,
        category: "Reading Comprehension",
        difficulty: "easy",
        passage: "Thomas Edison is famous for inventing the practical electric light bulb, but he also invented many other devices. He held over 1,000 patents for his inventions, including the phonograph and motion picture camera. Edison believed in hard work and persistence. He once said, 'Genius is one percent inspiration and ninety-nine percent perspiration,' meaning that success comes from hard work rather than natural talent alone.",
        question: "What did Edison believe about success?",
        options: [
            "Success comes naturally to talented people",
            "Success is mostly about hard work",
            "Success requires only inspiration",
            "Success is impossible without genius"
        ],
        correct: 1
    },
    {
        id: 17,
        category: "Reading Comprehension",
        difficulty: "medium",
        passage: "Coral reefs are often called the 'rainforests of the sea' because they support an incredible diversity of marine life. Despite covering less than 1% of the ocean floor, coral reefs are home to 25% of all marine species. These underwater ecosystems are formed by tiny animals called coral polyps. However, coral reefs face serious threats from pollution, overfishing, and rising ocean temperatures, which cause coral bleaching.",
        question: "Why are coral reefs compared to rainforests?",
        options: [
            "Because they are found in tropical areas",
            "Because they both have many trees",
            "Because they support great biodiversity",
            "Because they are both threatened by climate change only"
        ],
        correct: 2
    },
    {
        id: 18,
        category: "Reading Comprehension",
        difficulty: "hard",
        passage: "The placebo effect is a fascinating phenomenon in medical research. When patients believe they are receiving treatment, they sometimes experience real improvements in their condition, even if the treatment has no active ingredients. This effect demonstrates the powerful connection between mind and body. Researchers must account for the placebo effect when testing new medications by comparing them against inactive placebos to determine the drug's true effectiveness.",
        question: "What does the placebo effect demonstrate?",
        options: [
            "That all medications are ineffective",
            "That belief alone can cure any disease",
            "The connection between mind and body",
            "That medical research is unnecessary"
        ],
        correct: 2
    },
    {
        id: 19,
        category: "Reading Comprehension",
        difficulty: "easy",
        passage: "Owls are fascinating nocturnal birds known for their excellent hunting abilities. Their large eyes allow them to see well in low light, and their exceptional hearing helps them locate prey in complete darkness. Unlike most birds, owls can turn their heads almost 270 degrees, giving them a wide field of vision. Their soft feathers enable nearly silent flight, making them effective predators.",
        question: "What adaptation helps owls hunt silently?",
        options: [
            "Their large eyes",
            "Their ability to turn their heads",
            "Their soft feathers",
            "Their exceptional hearing"
        ],
        correct: 2
    },
    {
        id: 20,
        category: "Reading Comprehension",
        difficulty: "medium",
        passage: "The Industrial Revolution, which began in the late 1700s, transformed how goods were produced. Before this period, most items were made by hand in small workshops or at home. The invention of machines and the development of factories changed everything. Products could be manufactured faster and in larger quantities. While this brought economic growth and new jobs, it also created challenging working conditions and environmental pollution that society still grapples with today.",
        question: "What was both a benefit and a consequence of the Industrial Revolution?",
        options: [
            "It brought economic growth but also created problems like pollution",
            "It eliminated all hand-made goods permanently",
            "It only had positive effects on society",
            "It slowed down production of goods"
        ],
        correct: 0
    },
    {
        id: 21,
        category: "Reading Comprehension",
        difficulty: "easy",
        passage: "Honeybees play a crucial role in agriculture through pollination. As bees collect nectar from flowers, pollen sticks to their bodies and transfers to other flowers they visit. This process helps plants reproduce and produce fruits and seeds. Scientists estimate that one-third of the food we eat depends on pollination by bees and other insects. Unfortunately, bee populations are declining due to pesticides, disease, and habitat loss.",
        question: "Why are honeybees important to agriculture?",
        options: [
            "They produce honey for humans",
            "They help plants reproduce through pollination",
            "They control pest populations",
            "They improve soil quality"
        ],
        correct: 1
    },
    {
        id: 22,
        category: "Reading Comprehension",
        difficulty: "hard",
        passage: "Democracy is a form of government where power rests with the people. In a democratic society, citizens participate in decision-making through voting and can freely express their opinions. The concept originated in ancient Greece but has evolved significantly over time. Modern democracies typically include features like free elections, protection of individual rights, separation of powers, and the rule of law. However, maintaining a healthy democracy requires active citizen participation and vigilant protection of democratic institutions.",
        question: "What can be inferred about democracy from this passage?",
        options: [
            "Democracy is a perfect system with no challenges",
            "Democracy requires ongoing effort and participation to maintain",
            "Democracy only existed in ancient Greece",
            "Democracy doesn't protect individual rights"
        ],
        correct: 1
    },
    {
        id: 23,
        category: "Reading Comprehension",
        difficulty: "medium",
        passage: "Earthquakes occur when stress that has built up along fault lines in Earth's crust is suddenly released. The ground shakes as energy travels through the earth in waves. The magnitude of an earthquake is measured on the Richter scale, with higher numbers indicating more powerful quakes. While earthquakes can't be predicted with certainty, scientists monitor seismic activity to better understand these natural phenomena and improve building codes in earthquake-prone areas.",
        question: "What is the main focus of this passage?",
        options: [
            "How to predict earthquakes accurately",
            "The causes of earthquakes and how they are measured",
            "The history of the Richter scale",
            "Why earthquakes only occur in certain countries"
        ],
        correct: 1
    },
    {
        id: 24,
        category: "Reading Comprehension",
        difficulty: "easy",
        passage: "The library was quiet except for the occasional rustle of turning pages. Sarah sat at her favorite table near the window, completely absorbed in her book. She had been reading for hours, lost in the story's magical world. When the librarian announced that the library would close in fifteen minutes, Sarah looked up in surprise. It felt like only moments had passed since she'd arrived.",
        question: "What can we infer about Sarah from this passage?",
        options: [
            "She doesn't enjoy reading",
            "She was very engaged in her book",
            "She arrived at the library late",
            "She prefers noisy environments"
        ],
        correct: 1
    },
    {
        id: 25,
        category: "Reading Comprehension",
        difficulty: "medium",
        passage: "Renewable energy sources like solar, wind, and hydroelectric power are becoming increasingly important as alternatives to fossil fuels. Unlike coal, oil, and natural gas, renewable sources don't produce harmful emissions that contribute to climate change. Solar panels convert sunlight into electricity, wind turbines harness wind energy, and hydroelectric dams use flowing water to generate power. As technology improves and costs decrease, more countries are investing in renewable energy infrastructure.",
        question: "What advantage do renewable energy sources have over fossil fuels?",
        options: [
            "They are always cheaper to produce",
            "They don't produce harmful emissions",
            "They are easier to transport",
            "They work in all weather conditions"
        ],
        correct: 1
    },

    // ===== GRAMMAR QUESTIONS (25 questions) =====
    {
        id: 26,
        category: "Grammar",
        difficulty: "easy",
        question: "Choose the sentence with correct subject-verb agreement:",
        options: [
            "The group of students are going on a field trip.",
            "The group of students is going on a field trip.",
            "The group of students were going on a field trip.",
            "The group of students be going on a field trip."
        ],
        correct: 1
    },
    {
        id: 27,
        category: "Grammar",
        difficulty: "easy",
        question: "Which sentence uses the correct form of the verb?",
        options: [
            "She have finished her homework yesterday.",
            "She has finished her homework yesterday.",
            "She had finished her homework yesterday.",
            "She finishing her homework yesterday."
        ],
        correct: 2
    },
    {
        id: 28,
        category: "Grammar",
        difficulty: "medium",
        question: "Identify the sentence with the correct use of pronouns:",
        options: [
            "Me and John went to the store.",
            "John and me went to the store.",
            "John and I went to the store.",
            "I and John went to the store."
        ],
        correct: 2
    },
    {
        id: 29,
        category: "Grammar",
        difficulty: "easy",
        question: "Which sentence correctly uses commas?",
        options: [
            "My favorite foods are pizza, burgers and ice cream.",
            "My favorite foods are pizza burgers, and ice cream.",
            "My favorite foods are, pizza burgers and ice cream.",
            "My favorite foods are pizza, burgers, and ice cream."
        ],
        correct: 3
    },
    {
        id: 30,
        category: "Grammar",
        difficulty: "easy",
        question: "Choose the sentence with the correct use of apostrophes:",
        options: [
            "The dogs bone was buried in the yard.",
            "The dog's bone was buried in the yard.",
            "The dogs' bone was buried in the yard.",
            "The dog's' bone was buried in the yard."
        ],
        correct: 1
    },
    {
        id: 31,
        category: "Grammar",
        difficulty: "medium",
        question: "Which sentence uses the correct comparative form?",
        options: [
            "This book is more better than that one.",
            "This book is more good than that one.",
            "This book is better than that one.",
            "This book is gooder than that one."
        ],
        correct: 2
    },
    {
        id: 32,
        category: "Grammar",
        difficulty: "hard",
        question: "Identify the sentence with proper parallel structure:",
        options: [
            "She enjoys reading, to write, and painting.",
            "She enjoys reading, writing, and to paint.",
            "She enjoys reading, writing, and painting.",
            "She enjoys to read, writing, and painting."
        ],
        correct: 2
    },
    {
        id: 33,
        category: "Grammar",
        difficulty: "easy",
        question: "Which sentence uses the correct preposition?",
        options: [
            "The book is in the table.",
            "The book is at the table.",
            "The book is on the table.",
            "The book is to the table."
        ],
        correct: 2
    },
    {
        id: 34,
        category: "Grammar",
        difficulty: "medium",
        question: "Choose the sentence with correct adjective order:",
        options: [
            "She bought a beautiful small red car.",
            "She bought a red small beautiful car.",
            "She bought a small beautiful red car.",
            "She bought a beautiful red small car."
        ],
        correct: 3
    },
    {
        id: 35,
        category: "Grammar",
        difficulty: "easy",
        question: "Which sentence is punctuated correctly?",
        options: [
            "Yes I would love to come to the party.",
            "Yes, I would love to come to the party.",
            "Yes I would love, to come to the party.",
            "Yes, I would, love to come to the party."
        ],
        correct: 1
    },
    {
        id: 36,
        category: "Grammar",
        difficulty: "medium",
        question: "Identify the sentence with correct use of 'their,' 'there,' or 'they're':",
        options: [
            "Their going to the beach tomorrow.",
            "There going to the beach tomorrow.",
            "They're going to the beach tomorrow.",
            "Theyre going to the beach tomorrow."
        ],
        correct: 2
    },
    {
        id: 37,
        category: "Grammar",
        difficulty: "hard",
        question: "Which sentence uses the subjunctive mood correctly?",
        options: [
            "If I was rich, I would travel the world.",
            "If I were rich, I would travel the world.",
            "If I am rich, I would travel the world.",
            "If I be rich, I would travel the world."
        ],
        correct: 1
    },
    {
        id: 38,
        category: "Grammar",
        difficulty: "easy",
        question: "Choose the sentence with correct capitalization:",
        options: [
            "We visited the eiffel tower in paris.",
            "We visited the Eiffel tower in Paris.",
            "We visited the Eiffel Tower in Paris.",
            "We visited the Eiffel Tower in paris."
        ],
        correct: 2
    },
    {
        id: 39,
        category: "Grammar",
        difficulty: "medium",
        question: "Which sentence correctly uses a semicolon?",
        options: [
            "I love reading books; my sister prefers movies.",
            "I love reading books, my sister prefers movies.",
            "I love reading books; and my sister prefers movies.",
            "I love reading; books my sister prefers movies."
        ],
        correct: 0
    },
    {
        id: 40,
        category: "Grammar",
        difficulty: "easy",
        question: "Identify the sentence with correct use of 'its' or 'it's':",
        options: [
            "The dog wagged it's tail.",
            "The dog wagged its tail.",
            "The dog wagged its' tail.",
            "The dog wagged it is tail."
        ],
        correct: 1
    },
    {
        id: 41,
        category: "Grammar",
        difficulty: "medium",
        question: "Which sentence uses an adverb correctly?",
        options: [
            "She sings beautiful.",
            "She sings beautifully.",
            "She sings beautifuly.",
            "She beautiful sings."
        ],
        correct: 1
    },
    {
        id: 42,
        category: "Grammar",
        difficulty: "hard",
        question: "Choose the sentence that correctly uses a dependent clause:",
        options: [
            "Although it was raining we went outside.",
            "Although it was raining, we went outside.",
            "Although, it was raining we went outside.",
            "Although it was raining. We went outside."
        ],
        correct: 1
    },
    {
        id: 43,
        category: "Grammar",
        difficulty: "easy",
        question: "Which sentence uses the correct article?",
        options: [
            "I saw a elephant at the zoo.",
            "I saw an elephant at the zoo.",
            "I saw the elephant at a zoo.",
            "I saw elephant at the zoo."
        ],
        correct: 1
    },
    {
        id: 44,
        category: "Grammar",
        difficulty: "medium",
        question: "Identify the sentence with correct word usage:",
        options: [
            "Your going to love this movie!",
            "You're going to love this movie!",
            "Youre going to love this movie!",
            "Yore going to love this movie!"
        ],
        correct: 1
    },
    {
        id: 45,
        category: "Grammar",
        difficulty: "easy",
        question: "Which sentence has correct singular/plural agreement?",
        options: [
            "Each of the students have their own desk.",
            "Each of the students has their own desk.",
            "Each of the students have his own desk.",
            "Each of the students has his or her own desk."
        ],
        correct: 3
    },
    {
        id: 46,
        category: "Grammar",
        difficulty: "hard",
        question: "Choose the sentence with correct use of quotation marks:",
        options: [
            "She said that \"I will be there soon.\"",
            "She said, \"I will be there soon.\"",
            "She said, \"I will be there soon\".",
            "She said \"I will be there soon\"."
        ],
        correct: 1
    },
    {
        id: 47,
        category: "Grammar",
        difficulty: "medium",
        question: "Which sentence uses the past perfect tense correctly?",
        options: [
            "By the time I arrived, the movie started.",
            "By the time I arrived, the movie had started.",
            "By the time I arrived, the movie has started.",
            "By the time I arrived, the movie was started."
        ],
        correct: 1
    },
    {
        id: 48,
        category: "Grammar",
        difficulty: "easy",
        question: "Identify the sentence with correct double negative usage:",
        options: [
            "I don't have no homework.",
            "I don't have any homework.",
            "I have no not homework.",
            "I not have no homework."
        ],
        correct: 1
    },
    {
        id: 49,
        category: "Grammar",
        difficulty: "medium",
        question: "Which sentence uses modifiers correctly?",
        options: [
            "Walking down the street, the trees were beautiful.",
            "The trees walking down the street were beautiful.",
            "Walking down the street, I saw beautiful trees.",
            "The beautiful trees were walking down the street."
        ],
        correct: 2
    },
    {
        id: 50,
        category: "Grammar",
        difficulty: "hard",
        question: "Choose the sentence with correct conditional form:",
        options: [
            "If she studied harder, she will pass the test.",
            "If she studies harder, she would pass the test.",
            "If she had studied harder, she would have passed the test.",
            "If she study harder, she will passed the test."
        ],
        correct: 2
    }
];

// Log to confirm questions loaded
console.log("Questions loaded successfully! Total questions:", questions.length);