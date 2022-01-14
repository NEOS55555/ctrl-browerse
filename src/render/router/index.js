import Page1 from '@/pages/contentList'
import HomePage from '@/pages/homePage'
import { eventBus } from '@/util/eventBus'
import { routerPathTrans } from '@/util/routerUtil'
import React from 'react'

// export const routeGuard
eventBus.on('abc')
const routes = [
  {
    path: '/page1',
    component: HomePage,
  },
  {
    path: '/',
    component: Page1,
  },
]
routerPathTrans(routes)

export { routes }
