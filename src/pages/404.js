import React, { useContext } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ServiceContext from "../service-context"

const NotFoundPage = () => {
  const service = useContext(ServiceContext)
  return (
    <Layout scenario={service.current.context.scenario}>
      <SEO title="404: Not found" />
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  )
}

export default NotFoundPage
