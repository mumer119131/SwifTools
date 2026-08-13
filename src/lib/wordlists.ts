/**
 * Word lists for the generators.
 *
 * Deliberately hand-picked rather than scraped: a generator is only as good as
 * its vocabulary, and a list padded with obscure words produces output nobody
 * would actually use. Everything here is safe for a work channel.
 */

export const FIRST_NAMES_M = [
  "James","Oliver","Liam","Noah","Ethan","Lucas","Mason","Logan","Henry","Jack",
  "Samuel","Daniel","Owen","Leo","Felix","Miles","Arthur","Theo","Hugo","Isaac",
  "Julian","Adrian","Elias","Marcus","Victor","Simon","Oscar","Rowan","Caleb","Nathan",
];

export const FIRST_NAMES_F = [
  "Ava","Emma","Olivia","Sophia","Isabella","Mia","Amelia","Harper","Evelyn","Luna",
  "Clara","Nora","Iris","Hazel","Ruby","Alice","Freya","Maya","Elena","Ivy",
  "Rosa","Delia","Sylvia","Cora","Juno","Wren","Thea","Nadia","Esme","Lydia",
];

export const FIRST_NAMES_N = [
  "Alex","Jordan","Riley","Quinn","Avery","Rowan","Sage","Emerson","Finley","Hayden",
  "Kai","Reese","Skyler","Elliot","Charlie","Frankie","Marlowe","Blair","Remy","Toby",
];

export const LAST_NAMES = [
  "Hayes","Brooks","Sinclair","Vance","Okafor","Mercer","Delgado","Larsen","Whitfield","Nakamura",
  "Abbott","Castellan","Vega","Thornton","Rasmussen","Bellamy","Osei","Kowalski","Ferrari","Ibarra",
  "Sandoval","Ashford","Kaur","Novak","Petrov","Silva","Nguyen","Haddad","Lindqvist","Bianchi",
  "Ellery","Fairweather","Ravenscroft","Holloway","Crane","Marsh","Sterling","Winters","Blackwood","Ashby",
];

export const ADJECTIVES = [
  "Silent","Golden","Rapid","Iron","Crimson","Northern","Electric","Wild","Hidden","Royal",
  "Savage","Frozen","Burning","Restless","Fearless","Midnight","Velvet","Thunder","Crystal","Shadow",
  "Rogue","Radiant","Feral","Cobalt","Scarlet","Obsidian","Lunar","Solar","Ancient","Wandering",
  "Reckless","Nimble","Stubborn","Humble","Brutal","Quiet","Sharp","Rusty","Salty","Lucky",
];

export const NOUNS = [
  "Foxes","Ravens","Titans","Wolves","Comets","Anchors","Falcons","Badgers","Vipers","Lanterns",
  "Nomads","Pioneers","Rebels","Bandits","Sentinels","Mavericks","Otters","Hornets","Cyclones","Owls",
  "Kraken","Phantoms","Rangers","Marauders","Jackals","Puffins","Mammoths","Sharks","Dragons","Bison",
  "Engineers","Cartographers","Alchemists","Archivists","Wanderers","Outlaws","Drifters","Pilots","Miners","Poets",
];

export const NICKNAME_PREFIXES = [
  "Ace","Big","Captain","Chief","Doc","Duke","Fast","Ghost","Iron","King",
  "Lil","Mad","Nano","Neo","Pixel","Prof","Rex","Sir","Sly","Turbo",
  "Vex","Zen","Byte","Echo","Flux","Jazz","Kilo","Nova","Omega","Prime",
];

export const NICKNAME_SUFFIXES = [
  "blade","bolt","byte","claw","dash","dusk","fang","flare","forge","frost",
  "hawk","howl","jet","kick","lark","mane","nova","paw","quill","rider",
  "rush","shade","snap","spark","storm","surge","thorn","tide","wing","zap",
];

/** Story seeds, kept structural so the combinations stay coherent. */
export const STORY_PROTAGONISTS = [
  "a retired cartographer","a night-shift paramedic","an exiled royal archivist",
  "a teenage codebreaker","a disgraced sommelier","a lighthouse keeper's daughter",
  "an off-duty translator","a failing stage magician","a deep-sea welder",
  "a small-town coroner","a touring cellist","an orbital mechanic",
  "a hospice night nurse","a black-market botanist","a decommissioned war journalist",
  "a shipping-lane pilot","a museum forger","a rural postmaster",
];

export const STORY_WANTS = [
  "to find a sibling who was declared dead a decade ago",
  "to return an object they should never have taken",
  "to finish a piece of work their mentor abandoned",
  "to be believed about something nobody witnessed",
  "to get one message across a closed border",
  "to buy back a house their family lost",
  "to prove a signature was forged",
  "to reach a funeral three days' travel away",
  "to keep a promise made to someone now senile",
  "to disappear completely and start over",
];

export const STORY_OBSTACLES = [
  "the only person who can help is the one they wronged",
  "the evidence exists but proving it would ruin someone innocent",
  "they have eleven days before the records are destroyed",
  "everyone who knew the truth has agreed never to say it",
  "the journey requires a document they cannot legally obtain",
  "their own memory of the event keeps changing",
  "an old injury makes the necessary work impossible",
  "the person they need is under surveillance",
  "telling the truth would break the thing they are trying to save",
  "a rival is three steps ahead and knows the terrain",
];

export const STORY_TWISTS = [
  "the thing they were chasing was destroyed years before they started",
  "their antagonist has been quietly protecting them the whole time",
  "the secret is real but far more ordinary than anyone imagined",
  "they were the one who set the events in motion, without knowing",
  "the person they are trying to save does not want saving",
  "the deadline was never real — someone invented it to move them",
  "success requires giving up the very thing that made them capable",
  "there were two objects, and everyone has been arguing about the wrong one",
];

export const STORY_SETTINGS = [
  "a coastal town emptied by a failing industry",
  "a sleeper train crossing three borders",
  "an archive scheduled for demolition",
  "a research station between supply runs",
  "a city under an unseasonal, weeks-long fog",
  "a mountain village reachable only in summer",
  "a container port at the end of a strike",
  "a hospital during a week-long power rationing",
  "an island that appears on only one set of maps",
  "a university department being quietly dissolved",
];

/** Icebreakers that a real group would answer without wincing. */
export const ICEBREAKERS = [
  "What is something you were completely wrong about until recently?",
  "What is the best thing you have bought for under twenty pounds?",
  "Which fictional job would you actually be good at?",
  "What is a skill you picked up entirely by accident?",
  "What did you want to be at ten, and what does that say about you now?",
  "What is the most useful thing anyone has ever said to you?",
  "What is a small thing that instantly improves your day?",
  "Which everyday object do you think is badly designed?",
  "What is something you can talk about for an hour with no preparation?",
  "What is the strangest compliment you have received?",
  "What is a rule you follow that nobody asked you to?",
  "Which place have you been that you would not recommend?",
  "What is the last thing that genuinely surprised you?",
  "What is something you own that you would replace immediately if lost?",
  "Which piece of advice do you disagree with, even though everyone repeats it?",
  "What is a hobby you gave up, and would you go back?",
  "What is the best meal you have had that cost almost nothing?",
  "Which task do you enjoy far more than you should?",
  "What is something you have changed your mind about this year?",
  "What is the most memorable thing you have overheard?",
  "Which app or tool do you use every single day?",
  "What is a thing you are quietly very good at?",
  "What would you do with an unexpected free day tomorrow?",
  "Which small risk turned out much better than expected?",
  "What is something everyone should try once?",
];

/** Compliments about character, which land better than ones about looks. */
export const COMPLIMENTS = [
  "You explain complicated things without making anyone feel slow.",
  "You notice when someone has gone quiet, and you check in.",
  "You change your mind when the evidence changes, which is rarer than it sounds.",
  "Things you commit to actually happen.",
  "You ask the question everyone else was too polite to ask.",
  "You are the same person in a crisis as on an ordinary Tuesday.",
  "You give people credit in rooms they are not in.",
  "You make new people feel like they have been there a while.",
  "Your patience with slow processes is genuinely unusual.",
  "You tell people the useful truth rather than the comfortable one.",
  "You remember the small thing someone mentioned once.",
  "You are unbothered by looking like a beginner, which is why you learn fast.",
  "You take work seriously without taking yourself seriously.",
  "You are honest about what you do not know.",
  "You leave things better organised than you found them.",
  "Your enthusiasm is contagious and never performative.",
  "You disagree without making it personal.",
  "You are reliable in the unglamorous ways that actually matter.",
  "You listen to the whole sentence before answering.",
  "You make other people braver about trying things.",
];

/** Affectionate roasts — the kind you would read out at a leaving do. */
export const ROASTS = [
  "You have the confidence of someone who has never been fact-checked.",
  "Your sense of direction is a genuine achievement in the age of GPS.",
  "You reply \"sounds good\" to messages you have plainly not read.",
  "You have opinions about coffee that nobody solicited.",
  "Your idea of meal prep is buying the same sandwich five days running.",
  "You have four hundred unread emails and the serenity of a monk.",
  "You explain the plot of things nobody asked about, in full.",
  "Your desk setup costs more than your holiday.",
  "You are always five minutes away, and have been for an hour.",
  "You have started more hobbies this year than you have finished in your life.",
  "You take a photo of every meal like the food might otherwise deny it happened.",
  "Your browser has ninety tabs and you say you will get to them.",
  "You describe every mediocre film as underrated.",
  "You have strong views on productivity systems and use none of them.",
  "You say \"quick question\" and then talk for eleven minutes.",
  "Your phone battery is at 4% and you find this relaxing.",
  "You have never once left a meeting when it ended.",
  "You bought the gym membership. That was the whole plan, apparently.",
];

/** Balanced this-or-that pairs — both sides have to be defensible. */
export const THIS_OR_THAT: [string, string][] = [
  ["Mountains", "Ocean"], ["Coffee", "Tea"], ["Early bird", "Night owl"],
  ["Sweet", "Savoury"], ["Books", "Films"], ["Cats", "Dogs"],
  ["Call", "Text"], ["Summer", "Winter"], ["City", "Countryside"],
  ["Plan everything", "Wing it"], ["Window seat", "Aisle seat"],
  ["Cook at home", "Eat out"], ["Podcast", "Music"], ["Beach", "Forest"],
  ["Comedy", "Drama"], ["Shower in the morning", "Shower at night"],
  ["Save it", "Spend it"], ["Train", "Plane"], ["Sunrise", "Sunset"],
  ["One big trip", "Several small ones"], ["Paper book", "E-reader"],
  ["Board games", "Video games"], ["Salty snacks", "Sweet snacks"],
  ["Work from home", "Work from an office"], ["Tidy as you go", "Big clean at the end"],
  ["Spicy food", "Mild food"], ["Handwritten notes", "Typed notes"],
  ["Live music", "Studio recording"], ["Long walk", "Long nap"],
  ["Learn the rules first", "Just start playing"],
];
