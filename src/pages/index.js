/** @jsx jsx */
import React, { useContext } from "react"
import { Link, navigate } from "gatsby"
import { Styled, jsx } from "theme-ui"
import { Button } from "@theme-ui/components"

import ServiceContext from "../service-context"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => {
  const service = useContext(ServiceContext)
  const send = service.send
  return (
    <Layout>
      <SEO title="Home" />
      <Styled.h1>Welcome to the Nope Game</Styled.h1>
      <Styled.p>
        <Button
          onClick={() => {
            send(`START_GAME`)
            navigate(`/new-game/`)
          }}
        >
          Start new game
        </Button>
      </Styled.p>
    </Layout>
  )
}

export default IndexPage
