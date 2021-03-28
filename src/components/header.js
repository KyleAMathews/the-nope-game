/** @jsx jsx */
import React, { useState, useEffect, useContext } from "react"
import { Themed, jsx } from "theme-ui"
import { Box } from "@theme-ui/components"
import { Link } from "gatsby"
import PropTypes from "prop-types"

import ServiceContext from "../service-context"

const Header = ({ siteTitle, scenario }) => {
  const service = useContext(ServiceContext)
  if (typeof service === `undefined` || service.current.value === `inactive`) {
    return (
      <Themed.div
        g
        as="header"
        sx={{
          background: `background`,
        }}
      >
        <div
          sx={{
            // margin: `0 auto`,
            // maxWidth: 960,
            py: 4,
            px: 4,
          }}
        >
          <Themed.h1 sx={{ margin: 0 }}>
            <Link
              to="/"
              sx={{
                color: `white`,
                textDecoration: `none`,
              }}
            >
              {siteTitle}
            </Link>
          </Themed.h1>
        </div>
      </Themed.div>
    )
  } else {
    let answerCount = Object.values(service.current.context.answers).length
    if (scenario) answerCount += 1

    return (
      <Box>
        <Themed.h2 sx={{ my: 2, px: 2 }}>{scenario}</Themed.h2>
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
