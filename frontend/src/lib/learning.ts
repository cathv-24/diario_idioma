import type { Entry, Level } from "./types";

export interface LearningUnit {
  id: string;
  title: string;
  level: "A1" | "A2" | "B1";
  focus: string;
  explanation: string;
  example: string;
  prompt: string;
  story: { title: string; text: string; question: string; choices: string[]; answer: number };
  words: [string, string, string][];
}
export interface LearningState {
  unidadActual: string;
  lecturasCompletadas: string[];
  palabrasGuardadas: string[];
}

// Original activities. The thematic order follows the user's photographed contents.
export const units: LearningUnit[] = [
  { id: "e1", title: "Your world", level: "A1", focus: "To be y posesivos",
    explanation: "Usa am con I, is con he/she/it y are con you/we/they. Los posesivos indican de quién es algo: my, your, her.", example: "I'm Ana. My sister is a teacher.", prompt: "Who is someone important to you? Tell a little of their story.",
    story: { title: "A new neighbour", text: "My name is Eva. I'm from Peru, but my new neighbour is from Scotland. Her name is Isla. She is a student, and her brother is a cook. We are different, but our favourite place is the same: the little café on our street. Today we are there together. It is the start of a friendship.", question: "What do Eva and Isla have in common?", choices: ["Their job", "Their favourite café", "Their country"], answer: 1 },
    words: [["neighbour", "vecino/a", "My neighbour is friendly."], ["together", "juntos/as", "We are here together."], ["street", "calle", "Our street is quiet."]] },
  { id: "e2", title: "My day", level: "A1", focus: "Rutinas y frecuencia",
    explanation: "En presente simple, agrega -s con he/she/it. Los adverbios de frecuencia suelen ir antes del verbo principal y después de be.", example: "I usually walk home. She is often busy.", prompt: "What small part of your routine do you enjoy?",
    story: { title: "Ten quiet minutes", text: "Leo usually starts work at eight. He often checks his phone on the bus, but today he leaves it in his bag. He looks out of the window. A woman walks her dog. Two children laugh. The city is busy, but Leo feels calm. He decides to spend ten minutes without his phone every morning.", question: "What does Leo want to change?", choices: ["His job", "His bus route", "His morning phone habit"], answer: 2 },
    words: [["usually", "normalmente", "I usually read at night."], ["quiet", "tranquilo/a", "I enjoy quiet mornings."], ["habit", "hábito", "Writing is my new habit."]] },
  { id: "e3", title: "The world of work", level: "A1", focus: "Preguntas con do y does",
    explanation: "Para preguntar en presente simple: Do/Does + sujeto + verbo base. Con does, el verbo principal queda sin -s.", example: "What does your friend do? Does she enjoy it?", prompt: "What do you enjoy about your work or studies?",
    story: { title: "More than a job", text: "Mara works in a small bookshop. People often ask her, 'Do you read all day?' She smiles. She answers emails, helps customers and cleans the shelves. Her favourite task is finding the right book for a visitor. She doesn't earn a lot, but she enjoys those conversations. Each visitor brings a different story.", question: "What does Mara enjoy most?", choices: ["Helping visitors choose books", "Cleaning shelves", "Writing emails"], answer: 0 },
    words: [["customer", "cliente", "I helped a customer today."], ["task", "tarea", "This task takes ten minutes."], ["earn", "ganar dinero", "She earns money at the shop."]] },
  { id: "e4", title: "Places and things", level: "A1", focus: "There is/are y preposiciones",
    explanation: "Usa there is para una cosa y there are para varias. Añade in, on, next to o opposite para ubicarla.", example: "There is a plant next to my desk.", prompt: "Describe a place where you feel comfortable.",
    story: { title: "A corner of my own", text: "There is a small desk in my room. It is next to the window. There are two plants on it and a blue chair in front of it. The room isn't big, but this corner is mine. In the afternoon, the sun comes through the window. I sit there with a cup of tea and a notebook.", question: "Where is the desk?", choices: ["Opposite the door", "Next to the window", "Behind the chair"], answer: 1 },
    words: [["corner", "rincón", "This is my favourite corner."], ["next to", "al lado de", "The café is next to the park."], ["window", "ventana", "I opened the window."]] },
  { id: "e5", title: "Clothes and shopping", level: "A1", focus: "Presente simple y continuo",
    explanation: "El presente simple cuenta hábitos. Am/is/are + verbo en -ing cuenta lo que está ocurriendo ahora.", example: "I wear jeans every day. Today I'm wearing a dress.", prompt: "What are you doing right now? How is today different?",
    story: { title: "The yellow coat", text: "I usually buy dark clothes. Today I'm looking at a yellow coat in a small shop. My friend is waiting outside. 'Can you try it on?' she asks. I put it on and look in the mirror. It is brighter than anything I own. I don't buy it, but I leave the shop smiling. Perhaps next time.", question: "What happens to the coat?", choices: ["The friend buys it", "It stays in the shop", "The narrator buys it"], answer: 1 },
    words: [["try on", "probarse", "Can I try this on?"], ["wear", "llevar puesto", "I'm wearing my old jacket."], ["bright", "brillante / vivo", "I like bright colours."]] },
  { id: "e6", title: "The past", level: "A2", focus: "Was/were y pasado regular",
    explanation: "Usa was con I/he/she/it y were con you/we/they. Muchos verbos forman el pasado con -ed: walk → walked.", example: "I was tired, so I stayed at home.", prompt: "What happened yesterday? Tell one moment you remember.",
    story: { title: "An unexpected evening", text: "Yesterday was a difficult day. My classes finished late, and I was tired. I wanted to watch a film, but my sister knocked on my door. We cooked dinner together and talked for an hour. Nothing special happened. Still, when I opened my diary, that conversation was the first thing I wanted to remember.", question: "What did the narrator want to remember?", choices: ["A film", "A class", "A conversation with their sister"], answer: 2 },
    words: [["yesterday", "ayer", "Yesterday was a long day."], ["tired", "cansado/a", "We were tired after class."], ["remember", "recordar", "I want to remember this moment."]] },
  { id: "e7", title: "Health and fitness", level: "A2", focus: "Pasado irregular y negaciones",
    explanation: "Algunos pasados cambian: go → went, feel → felt. Después de didn't usa el verbo base: didn't go.", example: "I went for a walk. I didn't feel tired afterwards.", prompt: "What did you do to take care of yourself today?",
    story: { title: "A slower afternoon", text: "On Saturday I felt tired, so I didn't go running. Instead, I took a slow walk with my cousin. We saw a little garden behind the library and sat there for a while. I drank some water and listened to the birds. I came home feeling better. Taking care of myself didn't have to mean doing more.", question: "Why did the narrator choose a walk?", choices: ["They felt tired", "The gym was closed", "They lost their shoes"], answer: 0 },
    words: [["take care of", "cuidar", "I take care of myself."], ["instead", "en cambio", "I stayed home instead."], ["afterwards", "después", "I felt better afterwards."]] },
  { id: "e8", title: "Travel and transport", level: "A2", focus: "Preguntas en pasado y consejos",
    explanation: "Pregunta con Did + sujeto + verbo base. Para consejos usa should + verbo base.", example: "Did you take the bus? You should leave early.", prompt: "Tell the story of a journey, even a very short one.",
    story: { title: "The wrong platform", text: "'Did we miss our train?' I asked. My friend checked the tickets. We were at the wrong platform. A worker showed us where to go, and we arrived just in time. On the train, we laughed about our mistake. Next time we should check the platform before buying coffee. The journey started with a little adventure.", question: "What was the problem?", choices: ["They forgot their tickets", "They were at the wrong platform", "The train was cancelled"], answer: 1 },
    words: [["journey", "viaje / trayecto", "The journey took an hour."], ["platform", "andén", "Our train leaves from platform two."], ["miss", "perder / no alcanzar", "I didn't miss the bus."]] },
  { id: "e9", title: "Cooking and eating", level: "A2", focus: "Cantidades y contables",
    explanation: "Usa many con plurales contables y much con incontables. Some y any ayudan a hablar de cantidades sin dar un número.", example: "There are some eggs, but there isn't much milk.", prompt: "What meal reminds you of a person or a place?",
    story: { title: "Enough for two", text: "There wasn't much food in my fridge, but I had some rice, two eggs and a tomato. My neighbour came over with a few vegetables. We didn't have a recipe. We just cooked what we had and tasted it as we went. There was enough for two, and the kitchen smelled wonderful. I wrote the recipe down afterwards.", question: "How did they choose what to cook?", choices: ["They used the food they had", "They followed a video", "They ordered a meal"], answer: 0 },
    words: [["enough", "suficiente", "There is enough for everyone."], ["a few", "unos pocos", "I bought a few tomatoes."], ["taste", "probar / sabor", "Taste the soup first."]] },
  { id: "e10", title: "The world around us", level: "A2", focus: "Comparativos y superlativos",
    explanation: "Compara con -er than o more ... than. Para destacar uno en un grupo usa the ...-est o the most ... .",
    example: "This park is quieter than the square.", prompt: "Compare two places you know. Where do you feel more at home?",
    story: { title: "The best view", text: "The hill behind our town is smaller than the mountains in travel photos. It isn't the most famous place in the area either. But from the top, I can see my school, my grandmother's house and the sea. Last Sunday I went there with a friend. She said it was the best view of our town. I agreed.", question: "Why is the view special to the narrator?", choices: ["It is famous", "It shows familiar places", "It is the highest mountain"], answer: 1 },
    words: [["view", "vista / paisaje", "The view was beautiful."], ["hill", "colina", "We walked up the hill."], ["familiar", "conocido / familiar", "I saw a familiar face."]] },
  { id: "e11", title: "Working together", level: "A2", focus: "Planes con going to",
    explanation: "Para un plan usa am/is/are + going to + verbo base. Usa to + verbo para explicar un propósito.", example: "We're going to meet to plan our project.", prompt: "What are you going to do with someone this week?",
    story: { title: "A small plan", text: "Our street has an empty corner full of old boxes. My friends and I are going to clean it on Sunday. We're going to bring plants to make a little garden. Nobody has much money, so we're asking neighbours for things they don't need. One person has a bench. Another has paint. A small plan is becoming something we can share.", question: "Why are they asking neighbours for things?", choices: ["To sell them", "To build a shop", "To make a garden with a small budget"], answer: 2 },
    words: [["share", "compartir", "We share our ideas."], ["plan", "plan / planear", "We made a small plan."], ["bring", "traer", "I'm going to bring some food."]] },
  { id: "e12", title: "Culture and arts", level: "A2", focus: "Experiencias y presente perfecto",
    explanation: "Usa have/has + participio para una experiencia sin fecha terminada. Con yesterday o last week, usa pasado simple.", example: "I've seen that film. I saw it last weekend.", prompt: "Have you tried something new recently? What happened?",
    story: { title: "My first drawing class", text: "I've always enjoyed looking at art, but I've never felt good at drawing. Last week I joined a class with a friend. We drew the same cup three times. My first drawing was strange. The last one was better. I haven't become an artist, but I've discovered that I enjoy trying. The drawing is now on my fridge.", question: "What did the narrator discover?", choices: ["They enjoy trying to draw", "They dislike art", "They want to teach the class"], answer: 0 },
    words: [["discover", "descubrir", "I've discovered a new hobby."], ["try", "intentar", "I tried something new."], ["join", "unirse / inscribirse", "I joined a drawing class."]] },
];

export function defaultUnit(level: Level) { return level === "A1" ? "e1" : "e7"; }
export function recommendUnit(entries: Entry[], level: Level): { unit: LearningUnit; reason: string } {
  const recent = entries.slice(0, 5).flatMap(entry => entry.correcciones);
  const evidence = recent.map(c => `${c.fragmentoOriginal} ${c.explicacion}`).join(" ").toLowerCase();
  const id = /pasad|past|didn|goed|went|was|were/.test(evidence) ? "e7"
    : /frecuencia|frequency|usually|always/.test(evidence) ? "e2"
    : /there is|there are|art[ií]culo/.test(evidence) ? "e4"
    : defaultUnit(level);
  return { unit: units.find(unit => unit.id === id)!, reason: recent.length
    ? "Una práctica relacionada con las correcciones de tus últimas entradas."
    : "Un punto de partida según el nivel que elegiste. Puedes explorar cualquier unidad." };
}
