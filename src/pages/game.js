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
        color: isSelected ? `white` : `inherit`,
        border: `1px solid`,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function YesNoQuestion({ question, dispatch, index, state }) {
  return (
    <div
      sx={{
        display: `flex`,
        justifyContent: `space-between`,
        mb: 3,
        height: 52,
      }}
    >
      <label sx={{ pt: 1 }}>{question}</label>
      <ButtonGroup dispatch={dispatch} index={index} state={state} />
    </div>
  )
}

const questions = [
  "Can I do the thing being requested of me?",
  "Am i required by law or moral code to give or do what is wanted?",
  "Does the other person possess any kind of formal authority that permits them to tell me what to do or ask me to do things?",
  "Is what the person is requesting of me appropriate to my relationship with this person?",
  "Do I want to fulfill this request to avoid harming this relationship?",
  "Will saying no make me feel bad about myself?",
  "Do I owe this person a favor? (Does the person do a lot for me?)",
  "In the long term, will I regret saying no?",
  "Should I wait a while before saying no because the timing isn't great right now?",
]

const directives = [
  `Do it without being asked.`,
  `Don't complain; do it cheerfully.`,
  `Do it, even if you’re not cheerful about it.`,
  `Do it, but show that you’d rather not.`,
  `Say you’d rather not, but do it gracefully.`,
  `Say no firmly, but reconsider.`,
  `Say no confidently; resist saying yes.`,
  `Say no firmly; resist saying yes.`,
  `Say no firmly; resist; negotiate.`,
  `Don't do it.`,
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
          <Themed.h2>1. What is the request?</Themed.h2>
          <Input />
        </div>
        <div sx={{ display: `flex`, justifyContent: `space-between` }}>
          <div sx={{ mr: 5 }}>
            <Themed.h2 sx={{ mb: 3 }}>
              2. Mark "yes" or "no" for each question.
            </Themed.h2>
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
            <Themed.h2>3. Read the answer here.</Themed.h2>
            {directives.map((d, i) => (
              <Themed.p
                key={`directive-${i}`}
                sx={{
                  m: 0,
                  p: 2,
                  lineHeight: 1.4,
                  background: i === noCount ? `lightblue` : `none`,
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
