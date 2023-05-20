import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/welcome",
			name: "welcome",
			component: () => import("@/views/welcome/WelcomePage.vue")
		},
		{
			path: "/mindmap",
			name: "mindmap",
			component: () => import("../views/mindmap/MindmapView.vue")
		},
		{
			path: "/account",
			name: "account",
			component: async () => await import("@/views/account/AccountView.vue"),
			children: [
				{
					path: "/sign-in",
					name: "signIn",
					component: async () => await import("@/views/account/AccountView.vue")
				},
				{
					path: "/sign-up",
					name: "signUp",
					component: async () => await import("@/views/account/AccountView.vue")
				}
			]
		},
	]
})

export default router