import React from "react"
import { useMachine } from "@xstate/react"

import ServiceContext from "./src/service-context"
import gameMachine from "./src/machines/game-machine"

const XStateProvider = ({ children }) => {
  const [current, send] = useMachine(gameMachine, { devTools: true })
  console.log({ current })
  return (
    <ServiceContext.Provider value={{ current, send }}>
      {children}
    </ServiceContext.Provider>
  )
}

export const wrapRootElement = ({ element }) => {
  return <XStateProvider>{element}</XStateProvider>
}
