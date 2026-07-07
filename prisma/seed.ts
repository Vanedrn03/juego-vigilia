import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const prizeLevels = [
  { step: 1, label: "Semilla", points: 100, isCheckpoint: false },
  { step: 2, label: "Brote", points: 200, isCheckpoint: false },
  { step: 3, label: "Raíz", points: 300, isCheckpoint: false },
  { step: 4, label: "Tallo", points: 500, isCheckpoint: false },
  { step: 5, label: "Rama", points: 1000, isCheckpoint: true },
  { step: 6, label: "Hoja", points: 2000, isCheckpoint: false },
  { step: 7, label: "Flor", points: 4000, isCheckpoint: false },
  { step: 8, label: "Fruto", points: 8000, isCheckpoint: false },
  { step: 9, label: "Cosecha", points: 16000, isCheckpoint: false },
  { step: 10, label: "Discípulo", points: 32000, isCheckpoint: true },
  { step: 11, label: "Siervo", points: 64000, isCheckpoint: false },
  { step: 12, label: "Testigo", points: 125000, isCheckpoint: false },
  { step: 13, label: "Vencedor", points: 250000, isCheckpoint: false },
  { step: 14, label: "Embajador", points: 500000, isCheckpoint: false },
  { step: 15, label: "Corona de Vida", points: 1000000, isCheckpoint: false },
] as const;

const questions = [
  // Nivel 1
  {
    text: "¿Quién construyó el arca por instrucción de Dios?",
    optionA: "Noé",
    optionB: "Abraham",
    optionC: "Moisés",
    optionD: "David",
    correctOption: "A",
    difficulty: 1,
    category: "ANTIGUO_TESTAMENTO",
    verseRef: "Génesis 6:14",
  },
  {
    text: "¿En qué ciudad nació Jesús?",
    optionA: "Nazaret",
    optionB: "Belén",
    optionC: "Jerusalén",
    optionD: "Jericó",
    correctOption: "B",
    difficulty: 1,
    category: "VIDA_DE_JESUS",
    verseRef: "Lucas 2:4-7",
  },
  // Nivel 2
  {
    text: "¿Cuántos discípulos principales escogió Jesús?",
    optionA: "7",
    optionB: "10",
    optionC: "12",
    optionD: "14",
    correctOption: "C",
    difficulty: 2,
    category: "VIDA_DE_JESUS",
    verseRef: "Marcos 3:14",
  },
  {
    text: "¿Quién traicionó a Jesús por 30 monedas de plata?",
    optionA: "Pedro",
    optionB: "Judas Iscariote",
    optionC: "Tomás",
    optionD: "Juan",
    correctOption: "B",
    difficulty: 2,
    category: "VIDA_DE_JESUS",
    verseRef: "Mateo 26:15",
  },
  // Nivel 3
  {
    text: "¿Quién fue el primer hombre creado por Dios?",
    optionA: "Adán",
    optionB: "Set",
    optionC: "Caín",
    optionD: "Noé",
    correctOption: "A",
    difficulty: 3,
    category: "ANTIGUO_TESTAMENTO",
    verseRef: "Génesis 2:7",
  },
  {
    text: "¿Qué apóstol escribió la mayoría de las epístolas del Nuevo Testamento?",
    optionA: "Pedro",
    optionB: "Pablo",
    optionC: "Santiago",
    optionD: "Juan",
    correctOption: "B",
    difficulty: 3,
    category: "NUEVO_TESTAMENTO",
    verseRef: null,
  },
  // Nivel 4
  {
    text: "¿Cuántos días y noches llovió durante el diluvio?",
    optionA: "7",
    optionB: "40",
    optionC: "90",
    optionD: "120",
    correctOption: "B",
    difficulty: 4,
    category: "ANTIGUO_TESTAMENTO",
    verseRef: "Génesis 7:12",
  },
  {
    text: "¿Qué apóstol negó conocer a Jesús tres veces la noche de su arresto?",
    optionA: "Pedro",
    optionB: "Andrés",
    optionC: "Felipe",
    optionD: "Bartolomé",
    correctOption: "A",
    difficulty: 4,
    category: "VIDA_DE_JESUS",
    verseRef: "Mateo 26:34,75",
  },
  // Nivel 5
  {
    text: "¿Qué rey mandó matar a los niños de Belén al enterarse del nacimiento de Jesús?",
    optionA: "Herodes",
    optionB: "Poncio Pilato",
    optionC: "César Augusto",
    optionD: "Nabucodonosor",
    correctOption: "A",
    difficulty: 5,
    category: "VIDA_DE_JESUS",
    verseRef: "Mateo 2:16",
  },
  {
    text: "¿Quién derrotó al gigante Goliat con una honda?",
    optionA: "Saúl",
    optionB: "David",
    optionC: "Sansón",
    optionD: "Jonatán",
    correctOption: "B",
    difficulty: 5,
    category: "PERSONAJES",
    verseRef: "1 Samuel 17",
  },
  // Nivel 6
  {
    text: "¿Cuál es el primer libro de la Biblia?",
    optionA: "Éxodo",
    optionB: "Génesis",
    optionC: "Levítico",
    optionD: "Job",
    correctOption: "B",
    difficulty: 6,
    category: "GENERAL",
    verseRef: null,
  },
  {
    text: "¿Cuántos libros tiene el Nuevo Testamento?",
    optionA: "27",
    optionB: "39",
    optionC: "66",
    optionD: "73",
    correctOption: "A",
    difficulty: 6,
    category: "GENERAL",
    verseRef: null,
  },
  // Nivel 7
  {
    text: "¿Qué profeta fue tragado por un gran pez?",
    optionA: "Elías",
    optionB: "Jonás",
    optionC: "Isaías",
    optionD: "Ezequiel",
    correctOption: "B",
    difficulty: 7,
    category: "ANTIGUO_TESTAMENTO",
    verseRef: "Jonás 1:17",
  },
  {
    text: "¿Cuántos panes y peces usó Jesús para alimentar a los 5000?",
    optionA: "2 panes y 3 peces",
    optionB: "5 panes y 2 peces",
    optionC: "7 panes y 1 pez",
    optionD: "3 panes y 5 peces",
    correctOption: "B",
    difficulty: 7,
    category: "VIDA_DE_JESUS",
    verseRef: "Juan 6:9",
  },
  // Nivel 8
  {
    text: "Según Gálatas 5, ¿cuál es el primer fruto del Espíritu que se menciona?",
    optionA: "Gozo",
    optionB: "Amor",
    optionC: "Paz",
    optionD: "Paciencia",
    correctOption: "B",
    difficulty: 8,
    category: "DOCTRINA",
    verseRef: "Gálatas 5:22",
  },
  {
    text: "¿Quién fue vendido como esclavo por sus propios hermanos?",
    optionA: "José",
    optionB: "Benjamín",
    optionC: "Rubén",
    optionD: "Judá",
    correctOption: "A",
    difficulty: 8,
    category: "PERSONAJES",
    verseRef: "Génesis 37",
  },
  // Nivel 9
  {
    text: "¿Cuántos años estuvo el pueblo de Israel en el desierto?",
    optionA: "10",
    optionB: "25",
    optionC: "40",
    optionD: "70",
    correctOption: "C",
    difficulty: 9,
    category: "ANTIGUO_TESTAMENTO",
    verseRef: "Números 14:33",
  },
  {
    text: "¿Quién bautizó a Jesús en el río Jordán?",
    optionA: "Pedro",
    optionB: "Juan el Bautista",
    optionC: "Andrés",
    optionD: "Felipe",
    correctOption: "B",
    difficulty: 9,
    category: "VIDA_DE_JESUS",
    verseRef: "Mateo 3:13",
  },
  // Nivel 10
  {
    text: '¿Qué versículo comienza "Porque de tal manera amó Dios al mundo..."?',
    optionA: "Juan 3:16",
    optionB: "Romanos 8:28",
    optionC: "Salmos 23:1",
    optionD: "Filipenses 4:13",
    correctOption: "A",
    difficulty: 10,
    category: "DOCTRINA",
    verseRef: "Juan 3:16",
  },
  {
    text: "¿Quién interpretó los sueños del Faraón en Egipto?",
    optionA: "José",
    optionB: "Daniel",
    optionC: "Moisés",
    optionD: "Josué",
    correctOption: "A",
    difficulty: 10,
    category: "PERSONAJES",
    verseRef: "Génesis 41",
  },
  // Nivel 11
  {
    text: "¿Quién fue echado al foso de los leones por orar a Dios?",
    optionA: "Daniel",
    optionB: "Sadrac",
    optionC: "Mesac",
    optionD: "Abed-nego",
    correctOption: "A",
    difficulty: 11,
    category: "ANTIGUO_TESTAMENTO",
    verseRef: "Daniel 6",
  },
  {
    text: "¿Cuál de estos NO es uno de los frutos del Espíritu (Gálatas 5:22-23)?",
    optionA: "Templanza",
    optionB: "Envidia",
    optionC: "Bondad",
    optionD: "Mansedumbre",
    correctOption: "B",
    difficulty: 11,
    category: "DOCTRINA",
    verseRef: "Gálatas 5:22-23",
  },
  // Nivel 12
  {
    text: "¿Quién fue el sucesor de Moisés como líder de Israel?",
    optionA: "Josué",
    optionB: "Caleb",
    optionC: "Aarón",
    optionD: "Finees",
    correctOption: "A",
    difficulty: 12,
    category: "PERSONAJES",
    verseRef: "Josué 1",
  },
  {
    text: "¿En qué isla estaba el apóstol Juan cuando recibió la revelación del Apocalipsis?",
    optionA: "Creta",
    optionB: "Patmos",
    optionC: "Chipre",
    optionD: "Malta",
    correctOption: "B",
    difficulty: 12,
    category: "NUEVO_TESTAMENTO",
    verseRef: "Apocalipsis 1:9",
  },
  // Nivel 13
  {
    text: "¿Cuál era el oficio de Mateo antes de seguir a Jesús?",
    optionA: "Pescador",
    optionB: "Cobrador de impuestos",
    optionC: "Médico",
    optionD: "Fariseo",
    correctOption: "B",
    difficulty: 13,
    category: "VIDA_DE_JESUS",
    verseRef: "Mateo 9:9",
  },
  {
    text: "¿Quién fue el suegro de Moisés?",
    optionA: "Jetro",
    optionB: "Labán",
    optionC: "Coré",
    optionD: "Aarón",
    correctOption: "A",
    difficulty: 13,
    category: "PERSONAJES",
    verseRef: "Éxodo 3:1",
  },
  // Nivel 14
  {
    text: "¿Cuál de los siguientes NO fue uno de los doce hijos de Jacob?",
    optionA: "Rubén",
    optionB: "Neftalí",
    optionC: "Ismael",
    optionD: "Zabulón",
    correctOption: "C",
    difficulty: 14,
    category: "ANTIGUO_TESTAMENTO",
    verseRef: "Génesis 35:23-26",
  },
  {
    text: "¿Hacia qué ciudad se dirigía Saulo (Pablo) cuando tuvo su encuentro con Jesús?",
    optionA: "Jerusalén",
    optionB: "Damasco",
    optionC: "Antioquía",
    optionD: "Roma",
    correctOption: "B",
    difficulty: 14,
    category: "NUEVO_TESTAMENTO",
    verseRef: "Hechos 9:3",
  },
  // Nivel 15
  {
    text: "Según Génesis 5, ¿cuántos años vivió Matusalén, el hombre más longevo de la Biblia?",
    optionA: "969",
    optionB: "777",
    optionC: "950",
    optionD: "912",
    correctOption: "A",
    difficulty: 15,
    category: "ANTIGUO_TESTAMENTO",
    verseRef: "Génesis 5:27",
  },
  {
    text: "¿Cómo se llamaba el sumo sacerdote ante quien Jesús fue llevado la noche de su arresto?",
    optionA: "Anás",
    optionB: "Caifás",
    optionC: "Simón",
    optionD: "Zacarías",
    correctOption: "B",
    difficulty: 15,
    category: "VIDA_DE_JESUS",
    verseRef: "Mateo 26:57",
  },
] as const;

async function main() {
  console.log("Sembrando escalera de premios...");
  for (const level of prizeLevels) {
    await prisma.prizeLevel.upsert({
      where: { step: level.step },
      update: level,
      create: level,
    });
  }

  console.log("Sembrando banco de preguntas...");
  for (const q of questions) {
    const existing = await prisma.question.findFirst({
      where: { text: q.text },
    });
    if (existing) continue;
    await prisma.question.create({
      data: {
        text: q.text,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        correctOption: q.correctOption,
        difficulty: q.difficulty,
        category: q.category,
        verseRef: q.verseRef ?? undefined,
      },
    });
  }

  console.log(`Listo: ${prizeLevels.length} niveles y ${questions.length} preguntas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
