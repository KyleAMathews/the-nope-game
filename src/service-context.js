import React from "react"
import { interpret } from "xstate"
import gameMachine from "./machines/game-machine"

export const service = interpret(gameMachine, { devTools: true }).start()

const ServiceContext = React.createContext(service)

export default ServiceContext
