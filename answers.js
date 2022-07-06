// const prompt = require("prompt-sync")(); //for testing

// pre-defined data
const affirmativeResponses = [
  "yes",
  "please",
  "sure",
  "ok",
  "okay",
  "affirmative",
  "y",
  "yeah",
  "exactly",
  "yep",
  "right",
];

const negativeResponses = ["no", "nope", "don't", "not", "negative"];

const availableDates = ["05/08/2022", "06/08/2022", "07/08/2022"];

const availableDepartments = [
  "neurology",
  "paedriatrics",
  "psychiatry",
  "cardiology",
];

// Helper functions
function checkEmail(email) {
  // this regEx matches almost every valid email address
  return /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/.test(
    email
  );
}

function assignScore(conversationObject, userMessage) {
  let wordsToMatch;
  let score = 0;
  let indexes;
  let data;

  // Define what to do for each special conversation state
  switch (conversationObject.sentenceId) {
    case "appo-avail":
      indexes = listIndexes(availableDepartments);
      wordsToMatch = indexes.concat(availableDepartments);
      data = registerInput(availableDepartments, userMessage);
      if (typeof data === "string") {
        conversationObject.mainPhrase = `These are the available dates for ${data}:#${availableDates}`;
      }
      break;

    case "pick-up-verify":
      wordsToMatch = affirmativeResponses;
      break;

    case "pick-up-success":
      if (checkEmail(userMessage)) {
        conversationObject.mainPhrase = `Your results are ready. You can pick them up on reception from 8:00 to 17:00 everyday\nIn addition, a digital version will be sent to ${userMessage}`;
        return { score: 100, data: { email: userMessage } };
      }

    case "appo-type":
      wordsToMatch = affirmativeResponses;
      break;

    case "appo-email":
      indexes = listIndexes(availableDates);
      wordsToMatch = indexes.concat(availableDates);
      data = registerInput(availableDates, userMessage);
      if (typeof data === "string") {
        conversationObject.mainPhrase = `Great! To finish with your booking on ${data} I'll have to ask you for an email`;
      }
      break;

    case "appo-success":
      if (checkEmail(userMessage)) {
        conversationObject.mainPhrase = `Your appointment was registered :)\nDetails will be sent to ${userMessage}`;
        return { score: 100, data: { email: userMessage } };
      }

    case "visit-call":
      if (userMessage.length > 2) return { score: 100 };

    case "visit-number":
      if (userMessage.length > 4) return { score: 100 };

    default:
      wordsToMatch = conversationObject.expect;
  }

  if (typeof wordsToMatch === "undefined") {
    wordsToMatch = [];
  }

  const messageWords = userMessage
    .toLowerCase()
    .replace(/[,.?!]/, "")
    .split(" ");
  messageWords.forEach((word) => {
    if (wordsToMatch.includes(word)) {
      score += 1;
    }
  });

  return { score: score };
}

// Display options with an index
function printOptions(list) {
  let prettyString = "";
  for (let word = 0; word < list.length; word++) {
    if (word + 1 === list.length) {
      prettyString = prettyString + `${word}. ` + `${list[word]}`;
    } else {
      prettyString = prettyString + `${word}. ` + `${list[word]}/n`;
    }
  }
  return prettyString;
}

// Keep user info in a variable
function registerInput(listOfOptions, userInput) {
  const messageWords = userInput
    .toLowerCase()
    .replace(/[,.?!]/, "")
    .split(" ");
  let registered;

  if (messageWords.length === 1) {
    let singleInput = messageWords[0];
    if (/^\d+$/.test(singleInput)) {
      registered = listOfOptions[+singleInput];
    } else {
      if (listOfOptions.includes(singleInput.toLowerCase())) {
        registered = singleInput.toLowerCase();
      }
    }
  } else {
    messageWords.forEach((word) => {
      if (listOfOptions.includes(word)) {
        registered = word;
      }
    });
  }
  return registered;
}

// Creates a list of indexes
function listIndexes(listOfOptions) {
  const indexes = [];
  for (let index = 0; index < listOfOptions.length; index++) {
    indexes.push(index.toString());
  }
  return indexes;
}

// Initial conversation tree
export const conversationRaw = {
  sentencecId: "base",
  mainPhrase: "Can I help you with something else?",
  thirdPhrase:
    "Sorry, I don't know how to do that. Is there anything else I can help you with?",
  conversationFlow: [
    {
      sentenceId: "help",
      mainPhrase: "I'm glad. Just tell me",
      expect: affirmativeResponses,
    },
    {
      sentenceId: "bye",
      mainPhrase: "Okay, good bye then :)",
      expect: negativeResponses,
    },
    {
      sentenceId: "hello",
      mainPhrase: "Hello! Can I help you with something?",
      expect: ["hello", "hi", "morning", "evening", "good"],
    },
    {
      sentenceId: "covid",
      expect: ["covid", "sars", "cov", "covid19"],
      mainPhrase: "Are you experiencing COVID symphtoms?",
      conversationFlow:[
        {
          sentenceId: "covid-fail",
          mainPhrase: "Oh, maybe I didn't get that. Can you please reformulate?",
          expect: negativeResponses
        },
        {
          sentenceId: "covid-symptoms",
          mainPhrase: "Are you having problems to breath or another emergency situation?",
          expect: affirmativeResponses,
          conversationFlow: [
            {
              sentenceId: "covid-emergency",
              mainPhrase: "Please call 102 for an ambulance as soon as possible. Immediate medical attention is required.",
              expect: affirmativeResponses
            },
            {
              sentenceId: "covid-not-emergency",
              mainPhrase: "Have you been fully vaccinated against COVID?",
              expect: negativeResponses,
              conversationFlow: [
                {
                  sentenceId: "covid-vaccinated",
                  mainPhrase: "Isolate until you test negative. Take measures to relieve fever, relax and play some videogames. Everything will be fine.",
                  expect: affirmativeResponses
                },
                {
                  sentenceId: "covid-non-vaccinated",
                  expect: negativeResponses,
                  mainPhrase: "Keep track on your fever and breathing activity. Try to regulate fever and isolate yourself as much as possible. If you develop issues to breathe please call this line immediatly +49-0000-0000."
                }
              ]
            }
          ]
        },
      ]
    },
    {
      sentenceId: "emergency",
      expect: ["urgency", "emergency", "ambulance"],
      mainPhrase:
        "If you have an emergency please call an ambulance (tel: 102).\nFor urgencies you can come without appointment to the Urgencies Department.",
    },
    {
      sentenceId: "visit",
      expect: ["visit", "patient"],
      mainPhrase: "What's the name of this patient?",
      conversationFlow: [
        {
          sentenceId: "visit-call",
          mainPhrase:
            "Unfortunately we can't give information about patients. But leave us a telephone number and we will contact you later",
          conversationFlow: [
            {
              sentenceId: "visit-call-fail",
              expect: negativeResponses,
              mainPhrase:
                "You can also call to reception to schedule a visit +49-0000-0000",
            },
            {
              sentenceId: "visit-number",
              mainPhrase:
                "We will check up this data and get in contact with you in the next 24 hours",
            },
          ],
        },
      ],
    },
    {
      sentenceId: "pick-up",
      mainPhrase: "Do you have to pick-up some study results?",
      secondPhrase: "You have to collect some results, is that right?",
      expect: [
        "pick",
        "up",
        "pickup",
        "collect",
        "results",
        "result",
        "study",
        "studies",
      ],
      conversationFlow: [
        {
          sentenceId: "pick-up-fail",
          mainPhrase:
            "Oh, I didn,t get that well then. Could you try to reformulate?",
          expect: negativeResponses,
        },
        {
          sentenceId: "pick-up-verify",
          mainPhrase:
            "please, write down your email to check if your results are available already",
          expect: affirmativeResponses,
          conversationFlow: [
            {
              sentenceId: "pick-up-success",
              mainPhrase:
                "Your results are ready. You can pick them up on reception from 8:00 to 17:00 everyday",
              direct: "base",
            },
          ],
        },
      ],
    },
    {
      sentenceId: "loc",
      mainPhrase:
        "The hospital is located on Example Street 123. Attention 24 hours for emergencies. Please, consult opening hours for specific departments",
      expect: [
        "street",
        "location",
        "located",
        "where",
        "entrance",
        "access",
        "open",
        "opening",
        "schedule",
        "direction",
        "address",
      ],
      direct: "base",
    },
    {
      sentenceId: "appo",
      mainPhrase: "Do you want to book an appointment?",
      secondPhrase:
        "All right, so we are booking an appointment then, is that ok?",
      expect: [
        "appointment",
        "consultation",
        "booking",
        "book",
        "date",
        "session",
        "when",
        "available",
        "free",
        "week",
        "month",
      ],
      conversationFlow: [
        {
          sentenceId: "appo-fail",
          mainPhrase:
            "Oh, I probably got that wrong. Could you try to reformulate?",
          expect: negativeResponses,
        },
        {
          sentenceId: "appo-type",
          mainPhrase: `These are the departments offering online turns. Please, choose one:#${availableDepartments}`,
          conversationFlow: [
            {
              sentenceId: "appo-avail",
              mainPhrase: `These are the available dates, please choose one:#${availableDates}`,
              level: 3,
              conversationFlow: [
                {
                  sentenceId: "appo-email",
                  mainPhrase: `Great! To finish with your booking I'll have to ask you for an email`,
                  conversationFlow: [
                    {
                      sentenceId: "appo-success",
                      mainPhrase: "Your appointment was registered :)",
                      direct: "base",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Functions to make conversation
export function talk(flow, userMessage, ite) {
  let depth = 0;
  let heighestScore = 0;
  let selectedPath;
  let altPath;
  let responseMsg;
  let currentObject;
  let conver;

  for (let index = 0; index < flow.length; index++) {
    currentObject = flow[index];
    let analyseMessage = assignScore(currentObject, userMessage);
    let score = analyseMessage.score;

    if (score > heighestScore) {
      selectedPath = currentObject;
      heighestScore = score;
      if (typeof altPath !== "undefined") {
        altPath = undefined;
      }
    } else if (score === heighestScore && score !== 0) {
      altPath = currentObject;
    }
  }
  if (heighestScore > 0) {
    ite = 0;
    if (typeof altPath !== "undefined") {
      selectedPath.expect.push("first", "1", "1st", "one", "a");
      altPath.expect.push("second", "two", "2", "2nd", "b");
      responseMsg = `I can just handle one thing at once :(\n${selectedPath.mainPhrase} or\n${altPath.mainPhrase}`;
      selectedPath.mainPhrase = selectedPath.secondPhrase;
      altPath.mainPhrase = altPath.secondPhrase;
      conver = { conversationFlow: flow };
    } else {
      if (typeof selectedPath.conversationFlow === "undefined") {
        if (
          selectedPath.sentenceId === "bye" ||
          selectedPath.sentenceId === "help" ||
          selectedPath.sentenceId === "hello"
        ) {
          responseMsg = selectedPath.mainPhrase;
        } else {
          responseMsg =
            selectedPath.mainPhrase + `\n${conversationRaw.mainPhrase}`;
        }
        conver = conversationRaw;
      } else {
        responseMsg = selectedPath.mainPhrase;
        conver = selectedPath;
      }
    }
  } else {
    if (ite < 2) {
      responseMsg = "I didn't get that. Please, try to reformulate";
      conver = { conversationFlow: flow };
      ite += 1;
    } else {
      conver = conversationRaw;
      responseMsg = conversationRaw.thirdPhrase;
    }
  }

  return {
    updatedConversation: conver,
    outMessageText: responseMsg,
    iteration: ite,
  };
}

// function someFancyLogic(inMessage, conversationState, iteration) {
//   const responseObject = talk(
//     conversationState.conversationFlow,
//     inMessage,
//     iteration
//   );
//   console.log(responseObject.outMessageText);
//   let nextMessage = prompt("Your response: ");
//   someFancyLogic(
//     nextMessage.toString(),
//     responseObject.updatedConversation,
//     responseObject.iteration
//   );
// }

// const firstMessage = prompt("Your query: ");
// someFancyLogic(firstMessage, conversationRaw, 0);
