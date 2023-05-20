<script setup lang="ts">
import { computed } from "vue"
import { useRouter } from "vue-router"

export type IMode = "SignUp" | "SignIn"

interface IProps {
	mode: IMode
}
const titleMapper = new Map<IMode, string>([
	["SignIn", "Please sign in your account to continue."],
	["SignUp", "Sign up a new account."]
])

const props = defineProps<IProps>()

const title = computed(() => {
	return titleMapper.get(props.mode)
})

const router = useRouter()

const jumpMapper = new Map<IMode, {msg: string, action: () => void}>([
	["SignUp", {
		msg: "Already has a account? Click here to sign in.",
		action: () => {
			router.push({ name: "signIn" })
		}
	}],
	["SignIn", {
		msg: "Sign up a new account? Click here to sign up.",
		action: () => {
			router.push({ name: "signUp" })
		}
	}]
])

</script>

<template>
	<div class="prompt">
		<div class="title">{{ title }}</div>
		<div
			class="jump"
			@click="jumpMapper.get(props.mode)?.action()"
		>
			{{ jumpMapper.get(props.mode)?.msg }}
		</div>
	</div>
</template>

<style scoped lang="less">
.prompt::before {
	content: "";
	backdrop-filter: blur(10px);
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;

	z-index: -1;

	animation: fadeInOut 1s ease-in;
}
.prompt {
	position: relative;

	display: flex;
	flex-direction: column;

	height: 100%;
	justify-content: center;
	align-items: center;

	z-index: 10;

	animation: fadeInOut 0.5s ease-in-out;

	.title {
		color: silver;
		font-size: 30px;
		text-align: center;
	}

	.jump {
		color: azure;
		opacity: 0.5;
		border-bottom: 1px solid #F5F5F5;
		margin: 10px 50px;
	}

	.jump:hover {
		opacity: 1;
		border-bottom: 1px solid #C0C0C0;
		color: silver
	}
}

</style>
