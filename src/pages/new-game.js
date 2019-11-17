/** @jsx jsx */
import React, { useState, useEffect, useContext } from "react"
import { Router, Link } from "@reach/router"
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
import useKeyPressEvent from "react-use/lib/useKeyPressEvent"

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

const YesNoQuestion = ({ children, context, value, send }) => {
  console.log(`YesNoQuestion context`, context)
  console.log(`YesNoQuestion value`, value)
  return (
    <Box as="form" mb={3} onSubmit={e => e.preventDefault()}>
      <Label>{children}</Label>
      <Label htmlFor="yes" onClick={e => send({ type: `YES`, value })}>
        <Radio
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
      <Button onClick={() => send(`NEXT`)}>Continue</Button>
    </Box>
  )
}

const Question = () => {
  const service = useContext(ServiceContext)
  const { current, send } = service
  console.log(`current`, current.value, current)
  const meta = Object.values(current.meta)[0]
  console.log({ meta })

  // Create the current screen.
  let Screen
  if (meta.question.type === `yes/no`) {
    Screen = () => (
      <Box>
        <YesNoQuestion
          send={send}
          value={current.value}
          context={current.context.answers}
        >
          {meta.question.question}
        </YesNoQuestion>
      </Box>
    )
  } else if (meta.question.type === `textarea`) {
    Screen = () => (
      <Box>
        <Label>{meta.question.question}</Label>
        <Textarea name="request" rows="4" mb={3} />
      </Box>
    )
  }
  return <Screen />
}
const Welcome = () => {
  const service = useContext(ServiceContext)
  const send = service.send
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

  useKeyPressEvent("Enter", sendNext)
  useKeyPressEvent("ArrowDown", sendNext)
  useKeyPressEvent("ArrowRight", sendNext)
  useKeyPressEvent("ArrowUp", sendPrev)
  useKeyPressEvent("ArrowLeft", sendPrev)

  useEffect(() => {
    console.log(`mounted`)
    // Specify how to clean up after this effect:
    return function cleanup() {
      console.log(`unmounted`)
    }
  })

  console.log(`current stuff:`, current.value, current.event, current)
  const meta = Object.values(current.meta)[0]
  console.log({ meta })

  // Create the current screen.
  let Screen
  if (meta.message) {
    Screen = () => <Styled.p>{meta.message}</Styled.p>
  } else if (meta.question) {
    if (meta.question.type === `yes/no`) {
      Screen = () => (
        <Box>
          <YesNoQuestion
            send={send}
            value={current.value}
            context={current.context.answers}
          >
            {meta.question.question}
          </YesNoQuestion>
        </Box>
      )
    } else if (meta.question.type === `textarea`) {
      Screen = () => (
        <Box>
          <Label>{meta.question.question}</Label>
          <Textarea name="request" rows="4" mb={3} />
        </Box>
      )
    }
  }

  return (
    <Layout>
      <Router>
        <Welcome path="/new-game/" />
        <Question path="/new-game/question/*" />
      </Router>
    </Layout>
  )

  return (
    <Layout>
      <SEO title="New Nope game" />
      <Styled.h1>New Game</Styled.h1>
      <Styled.p>
        Welcome to the Nope Game! This game can help you decide whether to say
        yes or no to someone’s request, and how strongly to say yes or no
      </Styled.p>
      <Box as="form" onSubmit={e => e.preventDefault()}>
        <YesNoQuestion>Do you know what is being asked of you?</YesNoQuestion>
        <Box>
          <Label>Please describe the request.</Label>
          <Textarea name="request" rows="4" mb={3} />
        </Box>
        <YesNoQuestion>
          Can you do the thing being requested of you?
        </YesNoQuestion>
        <YesNoQuestion>
          Am I required by law or moral code to give or do what is wanted, or
          does saying no violate this person’s rights?
        </YesNoQuestion>
        <YesNoQuestion>
          Is the other person responsible for telling me what to do?
        </YesNoQuestion>
        <YesNoQuestion>
          Is what the person is requesting of me appropriate to my relationship
          with this person?
        </YesNoQuestion>
        <YesNoQuestion>
          Is my relationship more important than saying no?
        </YesNoQuestion>
        <YesNoQuestion>
          Will saying no make me feel bad about myself (because it’s against my
          values to say no to this)?
        </YesNoQuestion>
        <YesNoQuestion>
          Do I owe this person a favor? (Does the person do a lot for me?)
        </YesNoQuestion>
        <YesNoQuestion>
          In the long term, will I regret saying no?
        </YesNoQuestion>
        <YesNoQuestion>
          Should I wait a while before saying no because the timing isn’t great
          right now?
        </YesNoQuestion>
        <Button>Submit</Button>
        <Styled.p>Well done! You’ve answered all the questions.</Styled.p>
      </Box>
    </Layout>
  )
}

export default IndexPage
