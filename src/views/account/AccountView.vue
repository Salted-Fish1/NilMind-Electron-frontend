<script setup lang="ts">
import LeftRightLayout, { IProps } from "@/components/Layout/LeftRightLayout.vue"
import { ref, computed, watch, shallowRef } from "vue"

import PromptComp from "@/components/SignUp&In/PromptComp.vue"
import AccountInput from "@/components/SignUp&In/AccountInput.vue"

import { useRoute } from "vue-router"

const leftInput = ref(1)
const rightInput = ref(1)

const layoutConf = computed<IProps>(() => ({
	leftFlexConf: {
		flex: `${leftInput.value} 0 0`,
		justifyContent: "center",
		alignItems: "center"
	},
	rightFlexConf: {
		flex: `${rightInput.value} 0 0`,
		justifyContent: "center",
		alignItems: "center"
	},
	direction: "vertical"
}))

const flexMapper = new Map<string, {left: number, right: number}>([
	["/welcome", { left: 1, right: 3 }],
	["/sign-in", { left: 3, right: 2 }],
	["/sign-up", { left: 2, right: 3 }]
])

const leftComp = shallowRef(AccountInput)
const rightComp = shallowRef(PromptComp)

const compMapper = new Map<string, any>([
	["/sign-in", { left: AccountInput, right: PromptComp }],
	["/sign-up", { left: PromptComp, right: AccountInput }]
])

const route = useRoute()

const mode = computed(() => {
	if (route.path === "/sign-in") {
		return "SignIn"
	} else if (route.path === "/sign-up") {
		return "SignUp"
	}
	return "SignUp"
})

watch(
	() => route.path,
	(value, oldValue) => {
		console.log(compMapper)
		console.log(value)
        
        
		leftComp.value = compMapper.get(value)!.left
		rightComp.value = compMapper.get(value)!.right

		leftInput.value = flexMapper.get(value)!.left
		rightInput.value = flexMapper.get(value)!.right
	}, {
		immediate: true
	}
)

</script>

<template>
	<LeftRightLayout
		:left-flex-conf="layoutConf.leftFlexConf"
		:right-flex-conf="layoutConf.rightFlexConf"
		:direction="layoutConf.direction"
	>
		<template v-slot:left>
			<component :is="leftComp" :mode="mode"></component>
		</template>

		<template v-slot:right>
			<component :is="rightComp" :mode="mode"></component>
		</template>
	</LeftRightLayout>
</template>

<style scoped lang="less">
.welcome {
	display: flex;
	height: 100vh;
	animation: fadeInOut 0.5s ease-in-out;
}

* {
	user-select: none;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
