import { init } from "@instantdb/admin"
import schema from "instant.schema"

export const db = init({
  appId: import.meta.env.VITE_INSTANT_DB_APP_ID,
  adminToken: process.env.INSTANT_DB_ADMIN_TOKEN as string,
  schema: schema,
})
