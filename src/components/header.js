/** @jsx jsx */
import { Styled, jsx } from "theme-ui"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

const Header = ({ siteTitle, scenario }) => (
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
      <Styled.p sx={{ color: `muted` }}>{scenario}</Styled.p>
    </div>
  </Styled.div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
