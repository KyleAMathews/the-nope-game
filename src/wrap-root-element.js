import React from "react"
import { useMachine } from "@xstate/react"

import ServiceContext from "./service-context"
import gameMachine from "./machines/game-machine"

const XStateProvider = ({ children }) => {
  const [current, send] = useMachine(gameMachine, { devTools: true })
  return (
    <ServiceContext.Provider value={{ current, send }}>
      {children}
    </ServiceContext.Provider>
  )
}

export default ({ element }) => {
  return <XStateProvider>{element}</XStateProvider>
}
