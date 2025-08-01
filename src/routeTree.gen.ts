/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as SettingsRouteImport } from './routes/settings'
import { Route as NewRouteImport } from './routes/new'
import { Route as IndexRouteImport } from './routes/index'
import { Route as SettingsIndexRouteImport } from './routes/settings/index'
import { Route as SettingsModelsRouteImport } from './routes/settings/models'
import { Route as SettingsHistoryRouteImport } from './routes/settings/history'
import { Route as SettingsCustomizationRouteImport } from './routes/settings/customization'
import { Route as SettingsContactRouteImport } from './routes/settings/contact'
import { Route as SettingsAttachmentsRouteImport } from './routes/settings/attachments'
import { Route as SettingsApiKeysRouteImport } from './routes/settings/api-keys'
import { Route as SettingsAccountRouteImport } from './routes/settings/account'
import { Route as ChatChatIdRouteImport } from './routes/chat/$chatId'

const SettingsRoute = SettingsRouteImport.update({
  id: '/settings',
  path: '/settings',
  getParentRoute: () => rootRouteImport,
} as any)
const NewRoute = NewRouteImport.update({
  id: '/new',
  path: '/new',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const SettingsIndexRoute = SettingsIndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => SettingsRoute,
} as any)
const SettingsModelsRoute = SettingsModelsRouteImport.update({
  id: '/models',
  path: '/models',
  getParentRoute: () => SettingsRoute,
} as any)
const SettingsHistoryRoute = SettingsHistoryRouteImport.update({
  id: '/history',
  path: '/history',
  getParentRoute: () => SettingsRoute,
} as any)
const SettingsCustomizationRoute = SettingsCustomizationRouteImport.update({
  id: '/customization',
  path: '/customization',
  getParentRoute: () => SettingsRoute,
} as any)
const SettingsContactRoute = SettingsContactRouteImport.update({
  id: '/contact',
  path: '/contact',
  getParentRoute: () => SettingsRoute,
} as any)
const SettingsAttachmentsRoute = SettingsAttachmentsRouteImport.update({
  id: '/attachments',
  path: '/attachments',
  getParentRoute: () => SettingsRoute,
} as any)
const SettingsApiKeysRoute = SettingsApiKeysRouteImport.update({
  id: '/api-keys',
  path: '/api-keys',
  getParentRoute: () => SettingsRoute,
} as any)
const SettingsAccountRoute = SettingsAccountRouteImport.update({
  id: '/account',
  path: '/account',
  getParentRoute: () => SettingsRoute,
} as any)
const ChatChatIdRoute = ChatChatIdRouteImport.update({
  id: '/chat/$chatId',
  path: '/chat/$chatId',
  getParentRoute: () => rootRouteImport,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/new': typeof NewRoute
  '/settings': typeof SettingsRouteWithChildren
  '/chat/$chatId': typeof ChatChatIdRoute
  '/settings/account': typeof SettingsAccountRoute
  '/settings/api-keys': typeof SettingsApiKeysRoute
  '/settings/attachments': typeof SettingsAttachmentsRoute
  '/settings/contact': typeof SettingsContactRoute
  '/settings/customization': typeof SettingsCustomizationRoute
  '/settings/history': typeof SettingsHistoryRoute
  '/settings/models': typeof SettingsModelsRoute
  '/settings/': typeof SettingsIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/new': typeof NewRoute
  '/chat/$chatId': typeof ChatChatIdRoute
  '/settings/account': typeof SettingsAccountRoute
  '/settings/api-keys': typeof SettingsApiKeysRoute
  '/settings/attachments': typeof SettingsAttachmentsRoute
  '/settings/contact': typeof SettingsContactRoute
  '/settings/customization': typeof SettingsCustomizationRoute
  '/settings/history': typeof SettingsHistoryRoute
  '/settings/models': typeof SettingsModelsRoute
  '/settings': typeof SettingsIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/new': typeof NewRoute
  '/settings': typeof SettingsRouteWithChildren
  '/chat/$chatId': typeof ChatChatIdRoute
  '/settings/account': typeof SettingsAccountRoute
  '/settings/api-keys': typeof SettingsApiKeysRoute
  '/settings/attachments': typeof SettingsAttachmentsRoute
  '/settings/contact': typeof SettingsContactRoute
  '/settings/customization': typeof SettingsCustomizationRoute
  '/settings/history': typeof SettingsHistoryRoute
  '/settings/models': typeof SettingsModelsRoute
  '/settings/': typeof SettingsIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/new'
    | '/settings'
    | '/chat/$chatId'
    | '/settings/account'
    | '/settings/api-keys'
    | '/settings/attachments'
    | '/settings/contact'
    | '/settings/customization'
    | '/settings/history'
    | '/settings/models'
    | '/settings/'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/new'
    | '/chat/$chatId'
    | '/settings/account'
    | '/settings/api-keys'
    | '/settings/attachments'
    | '/settings/contact'
    | '/settings/customization'
    | '/settings/history'
    | '/settings/models'
    | '/settings'
  id:
    | '__root__'
    | '/'
    | '/new'
    | '/settings'
    | '/chat/$chatId'
    | '/settings/account'
    | '/settings/api-keys'
    | '/settings/attachments'
    | '/settings/contact'
    | '/settings/customization'
    | '/settings/history'
    | '/settings/models'
    | '/settings/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  NewRoute: typeof NewRoute
  SettingsRoute: typeof SettingsRouteWithChildren
  ChatChatIdRoute: typeof ChatChatIdRoute
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/settings': {
      id: '/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/new': {
      id: '/new'
      path: '/new'
      fullPath: '/new'
      preLoaderRoute: typeof NewRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/settings/': {
      id: '/settings/'
      path: '/'
      fullPath: '/settings/'
      preLoaderRoute: typeof SettingsIndexRouteImport
      parentRoute: typeof SettingsRoute
    }
    '/settings/models': {
      id: '/settings/models'
      path: '/models'
      fullPath: '/settings/models'
      preLoaderRoute: typeof SettingsModelsRouteImport
      parentRoute: typeof SettingsRoute
    }
    '/settings/history': {
      id: '/settings/history'
      path: '/history'
      fullPath: '/settings/history'
      preLoaderRoute: typeof SettingsHistoryRouteImport
      parentRoute: typeof SettingsRoute
    }
    '/settings/customization': {
      id: '/settings/customization'
      path: '/customization'
      fullPath: '/settings/customization'
      preLoaderRoute: typeof SettingsCustomizationRouteImport
      parentRoute: typeof SettingsRoute
    }
    '/settings/contact': {
      id: '/settings/contact'
      path: '/contact'
      fullPath: '/settings/contact'
      preLoaderRoute: typeof SettingsContactRouteImport
      parentRoute: typeof SettingsRoute
    }
    '/settings/attachments': {
      id: '/settings/attachments'
      path: '/attachments'
      fullPath: '/settings/attachments'
      preLoaderRoute: typeof SettingsAttachmentsRouteImport
      parentRoute: typeof SettingsRoute
    }
    '/settings/api-keys': {
      id: '/settings/api-keys'
      path: '/api-keys'
      fullPath: '/settings/api-keys'
      preLoaderRoute: typeof SettingsApiKeysRouteImport
      parentRoute: typeof SettingsRoute
    }
    '/settings/account': {
      id: '/settings/account'
      path: '/account'
      fullPath: '/settings/account'
      preLoaderRoute: typeof SettingsAccountRouteImport
      parentRoute: typeof SettingsRoute
    }
    '/chat/$chatId': {
      id: '/chat/$chatId'
      path: '/chat/$chatId'
      fullPath: '/chat/$chatId'
      preLoaderRoute: typeof ChatChatIdRouteImport
      parentRoute: typeof rootRouteImport
    }
  }
}

interface SettingsRouteChildren {
  SettingsAccountRoute: typeof SettingsAccountRoute
  SettingsApiKeysRoute: typeof SettingsApiKeysRoute
  SettingsAttachmentsRoute: typeof SettingsAttachmentsRoute
  SettingsContactRoute: typeof SettingsContactRoute
  SettingsCustomizationRoute: typeof SettingsCustomizationRoute
  SettingsHistoryRoute: typeof SettingsHistoryRoute
  SettingsModelsRoute: typeof SettingsModelsRoute
  SettingsIndexRoute: typeof SettingsIndexRoute
}

const SettingsRouteChildren: SettingsRouteChildren = {
  SettingsAccountRoute: SettingsAccountRoute,
  SettingsApiKeysRoute: SettingsApiKeysRoute,
  SettingsAttachmentsRoute: SettingsAttachmentsRoute,
  SettingsContactRoute: SettingsContactRoute,
  SettingsCustomizationRoute: SettingsCustomizationRoute,
  SettingsHistoryRoute: SettingsHistoryRoute,
  SettingsModelsRoute: SettingsModelsRoute,
  SettingsIndexRoute: SettingsIndexRoute,
}

const SettingsRouteWithChildren = SettingsRoute._addFileChildren(
  SettingsRouteChildren,
)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  NewRoute: NewRoute,
  SettingsRoute: SettingsRouteWithChildren,
  ChatChatIdRoute: ChatChatIdRoute,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
