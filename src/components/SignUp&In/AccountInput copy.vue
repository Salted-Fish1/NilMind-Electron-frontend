<script setup lang="ts">
import router from "@/router"
import { computed } from "vue"

export type IMode = "SignUp" | "SignIn"

interface IProps {
	mode: IMode
}

const props = defineProps<IProps>()

const handleSignIn = () => {
	router.push("welcome")
}

const handleSignUp = () => {
	console.log("SignUp")
}

const operationMapper = new Map<IMode, () => void>([
	["SignIn", handleSignIn],
	["SignUp", handleSignUp]
])

const btnMsgMapper = new Map<IMode, string>([
	["SignIn", "Sign In"],
	["SignUp", "Sign Up"]
])

const btnMsg = computed(() => {
	return btnMsgMapper.get(props.mode)
})

const handleOperation = (e: MouseEvent) => {
	e.preventDefault()
	const handler = operationMapper.get(props.mode)
	if (!handler) return
	handler()
}
</script>

<template>
	<div class="container">
		<div class="form">

			<div class="form-item">
				<div class="label">
					<label class="label" for="username">Username</label>
				</div>
				<div class="input">
					<input type="text" name="username" placeholder="Username">
				</div>
			</div>

			<div class="form-item">
				<div class="label">
					<label class="label" for="username">Email</label>
				</div>
				<div class="input">
					<input type="text" name="username" placeholder="Email">
				</div>
			</div>

			<div class="form-item">
				<div class="label">
					<label class="label" for="password">Password</label>
				</div>
				<div class="input">
					<input type="password" name="password" placeholder="Password">
				</div>
			</div>

			<div class="form-item">
				<div class="btn" @click="handleOperation">{{ btnMsg }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="less">
.container {
	font-size: 1.4rem;
	height: 100%;
	display: flex;
	flex-direction: column;

	align-items: center;
	justify-content: center;

	animation: fadeInOut 0.5s ease-in-out;

	.form::before {
		content: '';
		backdrop-filter: blur(10px);
		background-color: rgba(255, 255, 255, 0.5);

		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;

		z-index: -1;

		animation: fadeInOut 1s ease-in;
	}

	.form {
		display: flex;
		flex-direction: column;
		justify-content: center;

		position: relative;
		z-index: 10;

		gap: 5vh;
		margin: 5vh;
		padding: 5vh;

		width: 400px;
		height: 400px;

		border: 1px solid silver;

		.form-item {
			display: flex;

			background-color: rgba(255, 255, 255, 0.5);
			border: 1px solid silver;
			text-shadow: 0px 0px 20px black;

			.label {
				position: absolute;
				flex: 1 0 0;
				min-width: 0;

				padding: 1vh;
				margin: 1vh;

				text-align: center;
			}

			.input {
				position: relative;
				flex: 2 0 0;
				min-width: 0;

				padding: 1vh;
				margin: 1vh 0;
				margin: 1rem;

				input {
					min-width: 0;

					margin: -1.1vh 0;

					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					right: 0;

					border: 1px solid silver;
					text-indent: 10px;
				}
			}

			.btn {
				padding: 1vh;
				margin: 1vh;

				flex: 1 0 0;

				text-align: center;
			}

			.btn:hover {

			}
		}

		.form-item:hover {
			box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
		}
	}
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
