
const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
    ]
  },


  {
    path: '/home',
    name: '/home',
    component: () => import('layouts/ListFileLayout.vue'),
  },


  {
    path: '/list-user',
    name: '/list-user',
    component: () => import('layouts/ListUserLayout.vue'),
  },


  {
    path: '/login',
    name: '/login',
    component: () => import('layouts/LoginLayout.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
