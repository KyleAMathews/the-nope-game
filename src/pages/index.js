/** @jsx jsx */
import React from "react"
import { Link } from "gatsby"
import { Styled, jsx } from "theme-ui"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Styled.h1>Welcome to the Nope Game</Styled.h1>
    <Styled.p>
      <Link to="/new-game/">Start new game</Link>
    </Styled.p>
  </Layout>
)

export default IndexPage
