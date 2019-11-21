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

const YesNoQuestion = ({ children, context, value, send, current }) => {
  console.log(`YesNoQuestion context`, context)
  console.log(`YesNoQuestion value`, value)
  return (
    <Box as="form" mb={3} onSubmit={e => e.preventDefault()}>
      <Label sx={{ mb: 1 }}>{children}</Label>
      <Label htmlFor="yes" onClick={e => send({ type: `YES`, value })}>
        <Radio
          ref={input =>
            input &&
            (current.event.type === `NEXT` || current.event.type === `PREV`) &&
            typeof context[value] === `undefined` &&
            input.focus()
          }
          name="yes"
          value="yes"
          onChange={e => send({ type: `YES`, value })}
          checked={context[value] === `YES`}
        />{" "}
        Yes
      </Label>
      <Label htmlFor="no" onClick={() => send({ type: `NO`, value })}>
        <Radio
          name="no"
          value="no"
          onChange={() => send({ type: `NO`, value })}
          checked={context[value] === `NO`}
        />{" "}
        No
      </Label>
      <Button sx={{ mt: 3 }} onClick={() => send(`NEXT`)}>
        Continue
      </Button>
    </Box>
  )
}

const Question = ({ service }) => {
  const { current, send } = service
  console.log(`current`, current.value, current)
  const meta = Object.values(current.meta)[0]
  console.log({ meta })

  // Ignore welcome screen
  if (current.value === `isDone` || meta.welcome) return null

  // Create the current screen.
  let Screen
  if (meta.question.type === `yes/no`) {
    return (
      <Box>
        <YesNoQuestion
          send={send}
          value={current.value}
          context={current.context.answers}
          current={current}
        >
          {meta.question.question}
        </YesNoQuestion>
      </Box>
    )
  } else if (meta.question.type === `textarea`) {
    return (
      <Box>
        <Label sx={{ mb: 1 }}>{meta.question.question}</Label>
        <Textarea
          value={current.context.scenario}
          onChange={e => send({ type: `SET_SCENARIO`, value: e.target.value })}
          name="request"
          rows="4"
          mb={3}
        />
        <Button onClick={() => send(`NEXT`)}>Continue</Button>
      </Box>
    )
  }
}
const Welcome = () => {
  const service = useContext(ServiceContext)
  const send = service.send
  if (service.current.value === `welcome`) {
    return (
      <Box>
        <Styled.h1>New Game</Styled.h1>
        <Styled.p>
          Welcome to the Nope Game! This game can help you decide whether to say
          yes or no to someone’s request, and how strongly to say yes or no
        </Styled.p>
        <Button onClick={() => send(`NEXT`)}>Start the Game</Button>
      </Box>
    )
  } else {
    return null
  }
}

const DoneScreen = () => {
  const service = useContext(ServiceContext)
  if (service.current.value === `isDone`) {
    return (
      <Box>
        <Styled.h1>Game Finished</Styled.h1>
        <pre>{JSON.stringify(service.current.context.answers, null, 4)}</pre>
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
          // width: `50%`,
          margin: `0 auto`,
        }}
      >
        <Welcome key="welcome" />
        <Question service={service} />
        <DoneScreen />
        <Box>
          {current.value !== `welcome` &&
            Object.values(current.context.answers).length +
              (current.context.scenario ? 1 : 0) +
              ` / 10 answered`}
        </Box>
      </div>
    </Layout>
  )
}

export default IndexPage
