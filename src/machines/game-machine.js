import { Machine, assign } from "xstate"
import * as gatsby from "gatsby"

console.log(gatsby)

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
//

const machine = Machine(
  {
    id: "nopeGameMachine",
    initial: "welcome",
    context: {
      answers: {},
    },
    states: {
      welcome: {
        meta: {
          welcome: {
            header: `New Game`,
            body: `Welcome to the Nope Game! This game can help you decide whether to say yes or no to someone’s request, and how strongly to say yes or no`,
          },
        },
        on: {
          SET_SCENARIO: {
            actions: `setScenario`,
          },
          NEXT: "doYouKnow",
        },
      },
      doYouKnow: {
        // entry: `setRoute`,
        meta: {
          path: `/new-game/question/1`,
          question: {
            type: `yes/no`,
            question: "Do you know what is being asked of you?",
          },
        },
        on: {
          NEXT: "describeRequest",
          PREV: `welcome`,
          YES: {
            actions: "setYes",
          },
          NO: {
            actions: "setNo",
          },
        },
      },
      getClarification: {
        meta: {
          // Or just make this its own component.
          message: `Since you answered no, this might be a good time to pause and ask the person what they are requesting of you.
        If you decide to continue without asking the person for clarification right now, your results may be less helpful.`,
        },
      },
      describeRequest: {
        meta: {
          question: {
            type: "textarea",
            question: "Please describe the request.",
          },
        },
        on: {
          SET_SCENARIO: {
            actions: `setScenario`,
          },
          PREV: `doYouKnow`,
          NEXT: "canYouDo",
        },
      },
      canYouDo: {
        meta: {
          question: {
            type: "yes/no",
            question: "Can you do the thing being requested of you?",
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
        meta: {
          question: {
            type: "yes/no",
            question: `Am I required by law or moral code to give or do what is wanted, or does
        saying no violate this person’s rights?`,
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
        meta: {
          question: {
            type: "yes/no",
            question: `Is the other person responsible for telling me what to do?`,
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
        meta: {
          question: {
            type: "yes/no",
            question: `Is my relationship more important than saying no?`,
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
        meta: {
          question: {
            type: "yes/no",
            question: `Will saying no make me feel bad about myself (because it’s against my
        values to say no to this)?`,
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
        },
      },
      summaryScreen: {},
    },
  },
  {
    actions: {
      // setRoute: (context, event, meta) => {
      // console.log(`setRoute`, { context, event, meta })
      // console.log(Object.values(meta.state.meta)[0].path)
      // gatsby.navigate(Object.values(meta.state.meta)[0].path)
      // },
      setYes: assign((context, event) => {
        context.answers[event.value] = event.type
        return context
      }),
      setScenario: assign((context, event) => {
        context.scenario = event.value
        return context
      }),
      setNo: assign((context, event) => {
        context.answers[event.value] = event.type
        return context
      }),
    },
  }
)

export default machine
