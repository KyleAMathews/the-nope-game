/** @jsx jsx */
import React, { useState, useEffect, useContext } from "react"
import { Styled, jsx } from "theme-ui"
import {
  Box,
  Button,
  Label,
  Input,
  Select,
  Textarea,
  Radio,
  Flex,
  Checkbox,
  Slider,
} from "@theme-ui/components"
import hotkeys from "hotkeys-js"
import { motion, AnimatePresence } from "framer-motion"

import ServiceContext from "../service-context"

import Layout from "../components/layout"
import SEO from "../components/seo"

// Stuff to figure out
// - syncing history events back into state
// - detecting when I leave the game (or I guess this would just be another
// state?)
//
// General rule of thumb is don't route — just send events & sync up with history
// when the user does use the back/forward buttons or go directly to pages
//
// Question pulls off questions from the state machine.
//
// TODO
// - done screen
// - results screen
//

const YesNoQuestion = ({ children, context, value, send, current, meta }) => {
  console.log(`YesNoQuestion context`, context)
  console.log(`YesNoQuestion value`, value, meta)
  return (
    <Box
      as="form"
      mb={3}
      onSubmit={e => e.preventDefault()}
      ref={input =>
        input &&
        (current.event.type === `NEXT` || current.event.type === `PREV`) &&
        typeof context[value] === `undefined` &&
        input.focus()
      }
    >
      <Label sx={{ mb: 1 }}>{children}</Label>
      <Label htmlFor="yes" onClick={e => send({ type: `YES`, value })}>
        <Radio
          name="yes"
          value="yes"
          onChange={e => send({ type: `YES`, value })}
          checked={context.tempAnswers[value] === `YES`}
        />{" "}
        Yes
      </Label>
      <Label htmlFor="no" onClick={() => send({ type: `NO`, value })}>
        <Radio
          name="no"
          value="no"
          onChange={() => send({ type: `NO`, value })}
          checked={context.tempAnswers[value] === `NO`}
        />{" "}
        No
      </Label>
      <Button sx={{ mt: 3 }} onClick={() => send(`NEXT`)}>
        Continue
      </Button>
      <div dangerouslySetInnerHTML={{ __html: meta.question.helpText }} />
    </Box>
  )
}

const Question = ({ service }) => {
  console.log(`inside Question`)
  const { current, send } = service
  console.log(`QUESTION: current`, current.value, current)
  const meta = Object.values(current.meta)[0]
  console.log({ meta })

  // Ignore welcome screen
  if (
    current.value.playing === `isDone` ||
    current.value.playing === `summaryScreen` ||
    current.value === `inactive` ||
    meta.welcome
  )
    return null

  // Create the current screen.
  let Screen
  if (meta.question.type === `yes/no`) {
    return (
      <Box>
        <motion.div
          key={current.value.playing}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <YesNoQuestion
            send={send}
            value={current.value.playing}
            context={current.context}
            current={current}
            meta={meta}
          >
            {meta.question.question}
          </YesNoQuestion>
        </motion.div>
      </Box>
    )
  } else if (meta.question.type === `textarea`) {
    return (
      <Box>
        <Label sx={{ mb: 1 }}>{meta.question.question}</Label>
        <Textarea
          value={current.context.scenario}
          onChange={e => send({ type: `SET_SCENARIO`, value: e.target.value })}
          placeholder={meta.question.placeholder}
          name="request"
          rows="4"
          mb={3}
        />
        <Button onClick={() => send(`NEXT`)}>Continue</Button>
        <div dangerouslySetInnerHTML={{ __html: meta.question.helpText }} />
      </Box>
    )
  }
}
const Welcome = () => {
  const service = useContext(ServiceContext)
  const send = service.send
  if (service.current.value.playing === `welcome`) {
    return (
      <Box>
        <Styled.h1>New Game</Styled.h1>
        <Styled.p>
          Welcome to the Nope Game! This game can help you decide whether to say
          yes or no to someone’s request, and how strongly to say yes or no
        </Styled.p>
        <Button onClick={() => send(`NEXT`)}>Start Game</Button>
      </Box>
    )
  } else {
    return null
  }
}

const DoneScreen = () => {
  const service = useContext(ServiceContext)
  const { current, send } = service
  if (service.current.value.playing === `isDone`) {
    return (
      <Box>
        <Styled.p>Well done! You’ve answered all the questions.</Styled.p>
        <Button onClick={() => send(`NEXT`)}>See Results</Button>
      </Box>
    )
  } else {
    return null
  }
}

const SummaryScreen = () => {
  const service = useContext(ServiceContext)
  const answers = service.current.context.answers
  if (service.current.value.playing === `summaryScreen`) {
    const directives = [
      `do it without being asked.`,
      `not complain; do it cheerfully.`,
      `do it, even if you’re not cheerful about it.`,
      `do it, but show that you’d rather not.`,
      `say you’d rather not, but do it gracefully.`,
      `say no firmly, but reconsider.`,
      `say no confidently; resist saying yes.`,
      `say no firmly; resist saying yes.`,
      `say no firmly; resist; negotiate.`,
      `not do it.`,
    ]

    const numberOfNOs = Object.values(answers).filter(a => a === `NO`).length

    return (
      <Box>
        <Styled.p>
          Based on your answers to the questions, you ought to{" "}
          {directives[numberOfNOs]}
        </Styled.p>
      </Box>
    )
  } else {
    return null
  }
}

const IndexPage = () => {
  const service = useContext(ServiceContext)
  const { current, send } = service
  console.log({ service, current, send })
  const sendPrev = () => {
    send(`PREV`)
  }
  const sendNext = () => {
    send(`NEXT`)
  }

  useEffect(() => {
    hotkeys("enter", sendNext)
    hotkeys("down", sendNext)
    hotkeys("right", sendNext)
    hotkeys("up", sendPrev)
    hotkeys("left", sendPrev)
    return function cleanup() {
      hotkeys.unbind("enter")
      hotkeys.unbind("left")
      hotkeys.unbind("up")
      hotkeys.unbind("right")
      hotkeys.unbind("down")
    }
  })

  return (
    <Layout scenario={current.context.scenario}>
      <div
        sx={{
          flexDirection: `column`,
          margin: `0 auto`,
          py: 5,
        }}
      >
        {current.value === `inactive` && (
          <Button onClick={() => send(`START_GAME`)}>Start Game</Button>
        )}
        <Welcome key="welcome" />
        <Question service={service} />
        <DoneScreen />
        <SummaryScreen />
      </div>
    </Layout>
  )
}

export default IndexPage
