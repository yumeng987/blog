import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const navbar = () => import("@/components/navbar/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/index",
    children: [
      {
        path: "/index",
        component: () => import("@/views/index/index.vue"),
        name: "首页",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: false
        }
      }
    ]
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/blog/:blogId",
    component: () => import("@/views/blog/index.vue"),
    name: "博客",
    meta: {
      hidden: true
    }
  },
  {
    path: "/archive",
    component: () => import("@/views/archive/index.vue"),
    name: "归档",
    meta: {
      hidden: true
    }
  },
  {
    path: "/mine",
    component: () => import("@/views/mine/index.vue"),
    name: "我的",
    meta: {
      hidden: true
    }
  },
  {
    path: "/about",
    component: () => import("@/views/about/index.vue"),
    name: "关于",
    meta: {
      hidden: true
    }
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch (error) {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
