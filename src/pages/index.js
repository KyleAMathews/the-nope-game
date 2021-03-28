/** @jsx jsx */
import React, { useContext } from "react"
import { Link, navigate } from "gatsby"
import { Styled, jsx, useThemeUI } from "theme-ui"
import { Button } from "@theme-ui/components"
console.log({ Button })

import ServiceContext from "../service-context"
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => {
  console.log(`useThemeUI`, useThemeUI())
  const { theme } = useThemeUI()
  const service = useContext(ServiceContext)
  const send = service.send
  return (
    <Layout>
      <SEO title="Home" />
      <Styled.h2 sx={{ marginTop: 4 }}>Welcome to the Nope Game</Styled.h2>
      <Styled.p>
        <Button
          onClick={() => {
            navigate(`/game/`)
          }}
        >
          Start new game
        </Button>
      </Styled.p>
      <Styled.p>
        Game inspired by <Styled.em>The Dime Game</Styled.em> from{" "}
        <Styled.a href="https://en.wikipedia.org/wiki/Dialectical_behavior_therapy">
          Dialectical behavior therapy (DBT)
        </Styled.a>
        .
      </Styled.p>
    </Layout>
  )
}

export default IndexPage
