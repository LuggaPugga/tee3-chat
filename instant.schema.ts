// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  // We inferred 3 attributes!
  // Take a look at this schema, and if everything looks good,
  // run `push schema` again to enforce the types.
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    apiKeys: i.entity({
      key: i.string().unique().indexed(),
      model: i.string().optional(),
      provider: i.string().indexed().optional(),
    }),
    chats: i.entity({
      branch_from: i.string().optional(),
      created_at: i.date(),
      model: i.string().optional(),
      name: i.string().indexed().optional(),
      pinned: i.boolean().optional(),
      updated_at: i.date().indexed(),
    }),
    messages: i.entity({
      content: i.string().optional(),
      created_at: i.date(),
      error: i.string().optional(),
      grounding_data: i.json().optional(),
      model: i.string().optional(),
      request_duration_ms: i.number().optional(),
      role: i.string().optional(),
      status: i.string().optional(),
      thinking_text: i.string().optional(),
      tokens_per_second: i.number().optional(),
      tokens_used: i.number().optional(),
      updated_at: i.date(),
      user_name: i.string().optional(),
    }),
    preferences: i.entity({
      knowledge: i.string().optional(),
      name: i.string().indexed().optional(),
      pinned_models: i.json().optional(),
      traits: i.json().optional(),
      what_do_you_do: i.string().optional(),
    }),
    usage: i.entity({
      premium: i.number().indexed().optional(),
      standard: i.number().indexed().optional(),
    }),
  },
  links: {
    apiKeysUser: {
      forward: {
        on: "apiKeys",
        has: "one",
        label: "user",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "apiKeys",
      },
    },
    chatsUser: {
      forward: {
        on: "chats",
        has: "one",
        label: "user",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "chats",
      },
    },
    messages$files: {
      forward: {
        on: "messages",
        has: "many",
        label: "$files",
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "messages",
        onDelete: "cascade",
      },
    },
    messagesChat: {
      forward: {
        on: "messages",
        has: "one",
        label: "chat",
        onDelete: "cascade",
      },
      reverse: {
        on: "chats",
        has: "many",
        label: "messages",
      },
    },
    preferencesUser: {
      forward: {
        on: "preferences",
        has: "one",
        label: "user",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "one",
        label: "preferences",
      },
    },
    usageUser: {
      forward: {
        on: "usage",
        has: "one",
        label: "user",
      },
      reverse: {
        on: "$users",
        has: "one",
        label: "usage",
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
