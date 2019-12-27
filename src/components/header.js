/** @jsx jsx */
import React, { useState, useEffect, useContext } from "react"
import { Styled, jsx } from "theme-ui"
import { Box } from "@theme-ui/components"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import ServiceContext from "../service-context"

const Header = ({ siteTitle, scenario }) => {
  const service = useContext(ServiceContext)
  if (typeof service === `undefined` || service.current.value === `inactive`) {
    return (
      <Styled.div
        g
        as="header"
        sx={{
          background: `background`,
        }}
      >
        <div
          sx={{
            margin: `0 auto`,
            maxWidth: 960,
            py: 4,
            px: 3,
          }}
        >
          <Styled.h1 sx={{ margin: 0 }}>
            <Link
              to="/"
              sx={{
                color: `muted`,
                textDecoration: `none`,
              }}
            >
              {siteTitle}
            </Link>
          </Styled.h1>
        </div>
      </Styled.div>
    )
  } else {
    let answerCount = Object.values(service.current.context.answers).length
    if (scenario) answerCount += 1

    return (
      <Box>
        <Styled.p sx={{ my: 2, px: 2 }}>Request: {scenario}</Styled.p>
        <div
          sx={{
            transition: `width 0.333s ease-in-out`,
            width: (answerCount / 10) * 100 + `%`,
            background: `linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%);`,
            height: 3,
          }}
        />
      </Box>
    )
  }
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
