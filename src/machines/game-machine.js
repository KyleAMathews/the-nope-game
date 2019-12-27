import { Machine, assign } from "xstate"
import * as gatsby from "gatsby"

// Guard to prevent final submission if not all
// questions have been answered. Maybe last screen
// links them to the ones they haven't answered if that's the case?
//
// answers are stored onChange
//
// two guarded screen navigations are to the final results screen
// & to anything past "do you know what's requested of you?"
//
// Users can havigate around all they like
// - keyboard up and down
// - clicks on arrows
// - enough scroll up and down to trigger the animation
//
// Progress indicator shows the number of answered questions

const gameStates = {
  initial: "welcome",
  states: {
    welcome: {
      meta: {
        welcome: {
          header: `New Game`,
          body: `Welcome to the Nope Game! This game can help you decide whether to say yes or no to someone’s request, and how strongly to say yes or no`,
        },
      },
      on: {
        NEXT: "describeRequest",
      },
    },
    describeRequest: {
      meta: {
        question: {
          type: "textarea",
          question: "What is someone requesting me to do, think, or feel?",
          placeholder: "My neighbor wants me to walk his dog tomorrow night",
          helpText:
            "<p>Note: If it’s difficult to describe the request, consider asking the person to clarify their request.</p> <p>If you decide to continue without asking the person for clarification right now, your results may be less helpful.</p>",
        },
      },
      on: {
        SET_SCENARIO: {
          actions: `setScenario`,
        },
        PREV: `welcome`,
        NEXT: "canYouDo",
      },
    },
    doYouKnow: {
      exit: `copyTempValuesToPerm`,
      entry: [assign({ entryState: `doYouKnow` }), `copyPermValuesToTemp`],
      meta: {
        path: `/new-game/question/1`,
        question: {
          type: `yes/no`,
          question: "Do you know what is being asked of you?",
        },
      },
      on: {
        NEXT: "moralOrLaw",
        PREV: `describeRequest`,
        YES: {
          actions: "setYes",
        },
        NO: {
          actions: "setNo",
        },
      },
    },
    canYouDo: {
      exit: `copyTempValuesToPerm`,
      entry: [assign({ entryState: `canYouDo` }), `copyPermValuesToTemp`],
      meta: {
        question: {
          type: "yes/no",
          question: "Can I do the thing being requested of me?",
        },
      },
      on: {
        PREV: "describeRequest",
        NEXT: "moralOrLaw",
        YES: {
          actions: "setYes",
        },
        NO: {
          actions: "setNo",
        },
      },
    },
    moralOrLaw: {
      exit: `copyTempValuesToPerm`,
      entry: [assign({ entryState: `moralOrLaw` }), `copyPermValuesToTemp`],
      meta: {
        question: {
          type: "yes/no",
          question: `Am I required by law or moral code to give or do what is wanted?`,
        },
      },
      on: {
        PREV: `canYouDo`,
        NEXT: "whoIsResponsible",
        YES: {
          actions: "setYes",
        },
        NO: {
          actions: "setNo",
        },
      },
    },
    whoIsResponsible: {
      exit: `copyTempValuesToPerm`,
      entry: [
        assign({ entryState: `whoIsResponsible` }),
        `copyPermValuesToTemp`,
      ],
      meta: {
        question: {
          type: "yes/no",
          question: `Does the other person possess any kind of formal authority that permits them to tell me what to do or ask me to do things?`,
        },
      },
      on: {
        PREV: `moralOrLaw`,
        NEXT: "appropriate",
        YES: {
          actions: "setYes",
        },
        NO: {
          actions: "setNo",
        },
      },
    },
    appropriate: {
      exit: `copyTempValuesToPerm`,
      entry: [assign({ entryState: `appropriate` }), `copyPermValuesToTemp`],
      meta: {
        question: {
          type: "yes/no",
          question: `Is what the person is requesting of me appropriate to my relationship with this person?`,
        },
      },
      on: {
        PREV: `whoIsResponsible`,
        NEXT: "howImportant",
        YES: {
          actions: "setYes",
        },
        NO: {
          actions: "setNo",
        },
      },
    },
    howImportant: {
      exit: `copyTempValuesToPerm`,
      entry: [assign({ entryState: `howImportant` }), `copyPermValuesToTemp`],
      meta: {
        question: {
          type: "yes/no",
          question: `Do I want to fulfill this request to avoid harming this relationship?`,
        },
      },
      on: {
        PREV: `appropriate`,
        NEXT: "againstValues",
        YES: {
          actions: "setYes",
        },
        NO: {
          actions: "setNo",
        },
      },
    },
    againstValues: {
      exit: `copyTempValuesToPerm`,
      entry: [assign({ entryState: `againstValues` }), `copyPermValuesToTemp`],
      meta: {
        question: {
          type: "yes/no",
          question: `Will saying no make me feel bad about myself?`,
          helpText:
            "<p>Note: Usually you should only feel bad if it is against your values to say no to this request.</p>",
        },
      },
      on: {
        PREV: `howImportant`,
        NEXT: "oweFavor",
        YES: {
          actions: "setYes",
        },
        NO: {
          actions: "setNo",
        },
      },
    },
    oweFavor: {
      exit: `copyTempValuesToPerm`,
      entry: [assign({ entryState: `oweFavor` }), `copyPermValuesToTemp`],
      meta: {
        question: {
          type: "yes/no",
          question: `Do I owe this person a favor? (Does the person do a lot for me?)`,
        },
      },
      on: {
        PREV: `againstValues`,
        NEXT: "longTermRegret",
        YES: {
          actions: "setYes",
        },
        NO: {
          actions: "setNo",
        },
      },
    },
    longTermRegret: {
      exit: `copyTempValuesToPerm`,
      entry: [assign({ entryState: `longTermRegret` }), `copyPermValuesToTemp`],
      meta: {
        question: {
          type: "yes/no",
          question: `In the long term, will I regret saying no?`,
        },
      },
      on: {
        PREV: `oweFavor`,
        NEXT: "timingBad",
        YES: {
          actions: "setYes",
        },
        NO: {
          actions: "setNo",
        },
      },
    },
    timingBad: {
      exit: `copyTempValuesToPerm`,
      entry: [assign({ entryState: `timingBad` }), `copyPermValuesToTemp`],
      meta: {
        question: {
          type: "yes/no",
          question: `Should I wait a while before saying no because the timing isn’t great
        right now?`,
        },
      },
      on: {
        PREV: `longTermRegret`,
        NEXT: "isDone",
        YES: {
          actions: "setYes",
        },
        NO: {
          actions: "setNo",
        },
      },
    },
    isDone: {
      on: {
        PREV: `timingBad`,
        NEXT: "summaryScreen",
      },
    },
    summaryScreen: {
      on: {
        PREV: `isDone`,
      },
    },
  },
}

const machine = Machine(
  {
    id: "nopeGameMachine",
    context: {
      answers: {},
      tempAnswers: {},
    },
    initial: `inactive`,
    states: {
      inactive: {
        on: {
          START_GAME: `playing`,
        },
      },
      playing: {
        on: {
          PAUSE_GAME: `inactive`,
        },
        ...gameStates,
      },
    },
  },
  {
    actions: {
      setScenario: assign((context, event) => {
        context.scenario = event.value
        return context
      }),
      setYes: assign((context, event) => {
        context.tempAnswers[event.value] = event.type
        return context
      }),
      setNo: assign((context, event) => {
        context.tempAnswers[event.value] = event.type
        return context
      }),
      copyTempValuesToPerm: assign((context, event) => {
        context.answers = { ...context.answers, ...context.tempAnswers }
        context.tempAnswers = {}
        return context
      }),
      copyPermValuesToTemp: assign((context, event, actionMeta) => {
        const question = context.entryState
        if (context.answers[question]) {
          context.tempAnswers[question] = context.answers[question]
        }
        return context
      }),
    },
  }
)

export default machine
