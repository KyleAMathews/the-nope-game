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
