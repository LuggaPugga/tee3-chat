// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  chats: {
    bind: [
      "isOwner",
      "auth.id != null && data.id in auth.ref('$user.chats.id')",
    ],
    allow: {
      view: "isOwner",
      create: "isOwner",
      delete: "isOwner",
      update: "isOwner",
    },
  },
  usage: {
    bind: ["isOwner", "auth.id != null && auth.id == data.user"],
    allow: {
      view: "isOwner",
      create: "false",
      delete: "false",
      update: "false",
    },
  },
  $files: {
    bind: [
      "isInMessagesFolder",
      "auth.id != null && data.path.startsWith(auth.id)",
    ],
    allow: {
      view: "isInMessagesFolder",
      create: "isInMessagesFolder",
      delete: "isInMessagesFolder",
      update: "isInMessagesFolder",
    },
  },
  apiKeys: {
    bind: ["isOwner", "auth.id != null && auth.id == data.user"],
    allow: {
      view: "isOwner",
      create: "false",
      delete: "isOwner",
      update: "false",
    },
  },
  messages: {
    bind: [
      "isChatOwner",
      "auth.id != null && data.id in auth.ref('$user.chats.messages.id')",
    ],
    allow: {
      view: "isChatOwner",
      create: "isChatOwner",
      delete: "isChatOwner",
      update: "isChatOwner",
    },
  },
  preferences: {
    bind: ["isOwner", "auth.id != null && auth.id == data.id"],
    allow: {
      view: "isOwner",
      create: "size(auth.ref('$user.preferences.id')) <= 1 && auth.id != null",
      delete: "isOwner",
      update: "isOwner",
    },
  },
} satisfies InstantRules;

export default rules;
