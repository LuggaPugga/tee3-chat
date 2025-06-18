import { init } from "@instantdb/react"
import schema from "instant.schema"

const APP_ID = "d93ce927-79f1-4dd7-8618-df5668c4f0f7"
export const db = init({ appId: APP_ID, schema })
