/** @jsx jsx */
import { Styled, jsx } from "theme-ui"
import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import "normalize.css"

import Header from "./header"

const Layout = ({ children, scenario }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Styled.root>
      <div sx={{ display: `flex`, flexDirection: `column` }}>
        <Header
          sx={{ flex: 1 }}
          scenario={scenario}
          siteTitle={data.site.siteMetadata.title}
        />
        <div
          sx={{
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
            flex: 1,
          }}
        >
          <main sx={{ width: `75%` }}>{children}</main>
        </div>
      </div>
    </Styled.root>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
