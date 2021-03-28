/** @jsx jsx */
import React, { useState, useEffect, useContext } from "react"
import { Themed, jsx } from "theme-ui"

import { Input } from "@theme-ui/components"
import Layout from "../components/layout"

function ButtonGroup({ dispatch, index, state }) {
  return (
    <div sx={{ width: 128, flexShrink: 0, ml: 4 }}>
      <Button
        isSelected={state === `yes`}
        onClick={() => dispatch({ index, state: `yes` })}
      >
        yes
      </Button>
      <Button
        isSelected={state === `no`}
        onClick={() => dispatch({ index, state: `no` })}
      >
        no
      </Button>
    </div>
  )
}

function Button({ children, isSelected, onClick }) {
  return (
    <button
      sx={{
        marginLeft: 2,
        px: 3,
        py: 1,
        borderRadius: 5,
        background: isSelected ? `gray` : `none`,
        outline: `none`,
        font: `inherit`,
        color: isSelected ? `white` : `gray`,
        border: `1px solid gray`,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function YesNoQuestion({ question, dispatch, index, state }) {
  const showWarnIfNot = question.warnIfNo && state === `no`
  console.log({ showWarnIfNot })
  return (
    <div
      sx={{
        background: showWarnIfNot ? `lightpink` : `none`,
        p: 2,
      }}
    >
      <div
        sx={{
          display: `flex`,
          justifyContent: `space-between`,
          height: 52,
        }}
      >
        <div>
          <label sx={{ pt: 1 }}>{question.question}</label>
          <Themed.div sx={{ fontStyle: `italic` }}>
            {showWarnIfNot ? question.warnIfNo : ``}
          </Themed.div>
        </div>
        <ButtonGroup dispatch={dispatch} index={index} state={state} />
      </div>
    </div>
  )
}

const questions = [
  {
    question:
      "Is the request clear? (Is the other person clear about what they've asked for?)",
    warnIfNo: `If the request isn't clear, consider asking for clarification before responding to the request.`,
  },
  {
    question: "Can I do the thing being requested of me?",
    warnIfNo: `If you can't actually do the thing requested, your answer to the person is almost certainly "no".`,
  },
  {
    question:
      "Am i required by law or moral code to give or do what is wanted?",
  },
  {
    question:
      "Does the other person possess any kind of formal authority that permits them to tell me what to do or ask me to do things?",
  },
  {
    question:
      "Is what the person is requesting of me appropriate to my relationship with this person?",
  },
  {
    question:
      "Do I want to fulfill this request to avoid harming this relationship?",
  },
  { question: "Will saying no make me feel bad about myself?" },
  {
    question:
      "Do I owe this person a favor? (Does the person do a lot for me?)",
  },
  { question: "In the long term, will I regret saying no?" },
]

const directives = [
  `Do it without being asked.`,
  `Don't complain; do it cheerfully.`,
  `Do it, even if you’re not cheerful about it.`,
  `Do it, but show that you’d rather not.`,
  // `Say you’d rather not, but do it gracefully.`,
  // `Say no firmly, but reconsider.`,
  // `Say no confidently; resist saying yes.`,
  `Say no; be open to negotiate.`,
  `Say no firmly; resist; negotiate.`,
  `Say no firmly; resist saying yes.`,
  `Refuse to do it.`,
]

const initialState = []

function reducer(state, action) {
  state[action.index] = action.state

  return [...state]
}

export default function Game() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const yesCount = state.filter((i) => i === `yes`).length
  const noCount = state.filter((i) => i === `no`).length
  console.log({ yesCount, noCount })
  return (
    <Layout>
      <div>
        <div sx={{ mb: 4 }}>
          <Themed.h3>1. What is the request?</Themed.h3>
          <Input
            sx={{
              fontSize: `32px`,
              borderRadius: 0,
              outline: 0,
              borderWidth: `0 0 2px`,
              borderColor: `blue`,
              p: 0,
            }}
          />
        </div>
        <div sx={{ display: `flex`, justifyContent: `space-between` }}>
          <div sx={{ mr: 5 }}>
            <Themed.h3>2. Mark "yes" or "no" for each question.</Themed.h3>
            {questions.map((question, i) => (
              <YesNoQuestion
                key={`question-${i}`}
                state={state[i]}
                index={i}
                dispatch={dispatch}
                question={question}
              />
            ))}
          </div>
          <div>
            <Themed.h3>3. How to respond.</Themed.h3>
            {directives.map((d, i) => (
              <Themed.p
                key={`directive-${i}`}
                sx={{
                  m: 0,
                  p: 2,
                  lineHeight: 1.4,
                  background: i === Math.min(noCount, 7) ? `lightblue` : `none`,
                }}
              >
                {d}
              </Themed.p>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
