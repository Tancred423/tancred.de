import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import AdminProjects from '../views/AdminProjects.vue'
import AdminProjectForm from '../views/AdminProjectForm.vue'
import AdminUrls from '../views/AdminUrls.vue'
import AdminUrlForm from '../views/AdminUrlForm.vue'
import Privacy from '../views/Privacy.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
  },
  {
    path: '/admin/projects',
    name: 'AdminProjects',
    component: AdminProjects,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/projects/create',
    name: 'AdminProjectCreate',
    component: AdminProjectForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/projects/edit/:id',
    name: 'AdminProjectEdit',
    component: AdminProjectForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/urls',
    name: 'AdminUrls',
    component: AdminUrls,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/urls/create',
    name: 'AdminUrlCreate',
    component: AdminUrlForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/urls/edit/:id',
    name: 'AdminUrlEdit',
    component: AdminUrlForm,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

export default router
