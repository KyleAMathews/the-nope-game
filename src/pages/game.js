/** @jsx jsx */
import React, { useState, useEffect, useContext } from "react"
import { Themed, jsx } from "theme-ui"

import { Input } from "@theme-ui/components"
import Layout from "../components/layout"
import { MdDone } from "react-icons/md"

function ButtonGroup({ dispatch, index, state }) {
  return (
    <div sx={{ flexShrink: 0, ml: 2 }}>
      <Button
        isSelected={state === `yes`}
        onClick={() => dispatch({ index, state: `yes` })}
      >
        Yes
      </Button>
      <Button
        isSelected={state === `no`}
        onClick={() => dispatch({ index, state: `no` })}
      >
        No
      </Button>
    </div>
  )
}

function Button({ children, isSelected, onClick }) {
  const yesColors = {
    color: (opacity = 1) => `rgba(57,40,128,${opacity})`,
    background: `#F1EDFF`,
    backgroundHover: `#D5CBFF`,
  }
  const noColors = {
    color: (opacity = 1) => `rgba(92,24,115,${opacity})`,
    background: `#F9EBFF`,
    backgroundHover: `#e2cbff`,
  }

  const colors = children === `Yes` ? yesColors : noColors

  return (
    <button
      sx={{
        marginLeft: 2,
        paddingLeft: `8px`,
        paddingRight: `8px`,
        py: `4px`,
        borderRadius: 2,
        background: colors.background,
        cursor: `pointer`,
        outline: `none`,
        font: `inherit`,
        fontSize: `90%`,
        width: `72px`,
        color: colors.color(),
        border: `2px solid ${colors.color(isSelected ? 1 : 0.5)}`,
        "&:hover": {
          background: colors.backgroundHover,
          border: `2px solid ${colors.color()}`,
        },
      }}
      onClick={onClick}
    >
      <span>{children}</span>{" "}
      <span sx={{ fontFamily: `monospace`, paddingLeft: `10px` }}>
        {isSelected ? (
          <MdDone size={16} sx={{ position: `relative`, top: `4px` }} />
        ) : (
          <span
            sx={{ display: `inline-block`, height: `16px`, width: `16px` }}
          />
        )}
      </span>
    </button>
  )
}

function YesNoQuestion({ question, dispatch, index, state }) {
  const showWarnIfNot = question.warnIfNo && state === `no`
  return (
    <div
      sx={{
        background: showWarnIfNot ? `lightpink` : `none`,
        p: 1,
        mb: showWarnIfNot ? 3 : 0,
        mt: showWarnIfNot ? 3 : 0,
      }}
    >
      <div
        sx={{
          display: `flex`,
          justifyContent: `space-between`,
        }}
      >
        <div sx={{ mr: 3 }}>
          <label>{question.question}</label>
          <Themed.div
            sx={{
              fontStyle: `italic`,
              lineHeight: 1.4,
            }}
          >
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
    question: "Is the request clear to me?",
    warnIfNo: `If the request isn't clear, consider asking for clarification before responding to the request.`,
  },
  {
    question: "Can I give the person what they want?",
    warnIfNo: `If you can't actually do the thing requested, your answer to the person is almost certainly "no".`,
  },
  {
    question: "Is maintaining the relationship more important than saying no?",
  },
  { question: "Will saying no be against my values and make me feel guilty?" },
  {
    question: "Am i required by law or moral code to do it?",
  },
  {
    question: "Is the other person responsible for telling me what to do?",
  },
  {
    question: "Is the request appropriate to my relationship with this person?",
  },
  {
    question: "Do I owe this person a favor because they do a lot for me?",
  },
  { question: "Is now a good time to say no?" },
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

const lightgray = `#e2e1e1`

export default function Game() {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const yesCount = state.filter((i) => i === `yes`).length
  const noCount = state.filter((i) => i === `no`).length
  return (
    <Layout>
      <div sx={{ maxWidth: `1280px` }}>
        <div sx={{ mb: 4 }}>
          <Themed.h5 sx={{ mb: 3 }}>1. What is the request?</Themed.h5>
          <Input
            sx={{
              background: `#F5F5F5`,
              px: 3,
              pt: 3,
              pb: 1,
              fontSize: `18px`,
              maxWidth: `600px`,
              borderRadius: 0,
              outline: 0,
              borderWidth: `0 0 1px`,
              borderColor: `blue`,
              "&:hover": {
                background: lightgray,
              },
            }}
          />
          <label sx={{ fontSize: `12px`, ml: 3 }}>
            A description of the request.
          </label>
        </div>
        <div sx={{ display: `flex`, justifyContent: `space-between` }}>
          <div sx={{ mr: 5 }}>
            <Themed.h5 sx={{ mb: 4 }}>
              2. Mark "yes" or "no" for each question.
            </Themed.h5>
            <div
              sx={{
                border: `1px solid ${lightgray}`,
                p: 2,
              }}
            >
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
          </div>
          <div>
            <Themed.h5 sx={{ mb: 4 }}>
              3. Read the advice here and consider following it.
            </Themed.h5>
            {directives.map((d, i) => {
              const isSelected = i === Math.min(noCount, 7)
              return (
                <Themed.p
                  key={`directive-${i}`}
                  sx={{
                    m: 0,
                    p: 2,
                    lineHeight: 1.4,
                    borderRadius: `2px`,
                    paddingLeft: isSelected ? 3 : 2,
                    borderLeft: isSelected
                      ? `3px solid rgba(57,40,128,1)`
                      : `inherit`,
                    fontSize: isSelected ? `21px` : `inherit`,
                    fontWeight: isSelected ? `bold` : `inherit`,
                    background: isSelected ? `#F1EDFF` : `none`,
                  }}
                >
                  {d}
                </Themed.p>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
