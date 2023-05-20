<script setup lang="ts">
import router from "@/router"
import { computed, ref } from "vue"
import { SignUp, VerifyCode, SignIn } from "@/api"
import { useUserStore } from "@/stores/user" 

export type IMode = "SignUp" | "SignIn"

interface IProps {
	mode: IMode
}

const props = defineProps<IProps>()

const username = ref("")
const email = ref("")
const password = ref("")
const verifyCode = ref(0)
const showVerifyCode = computed(() => {
	if (props.mode === "SignUp") {
		return true
	}
	return false
})

const handleSignIn = () => {
	SignIn({
		email: email.value,
		password: password.value
	}).then(async (res) => {
		const accessToken = JSON.parse(await res.text()).access_token
		console.log(accessToken)
		const userStore = useUserStore()
		userStore.email = email.value
		userStore.username = email.value
		localStorage.setItem("access_token", accessToken)
		router.push({name: "welcome"})
		console.log("here")
		
	})
}

const handleSignUp = () => {
	console.log("SignUp")
	console.log(username.value)
	console.log(email.value)
	console.log(password.value)
	SignUp({
		username: username.value,
		email: email.value,
		password: password.value
	})
}

const handleVerifyCode = () => {
	console.log(verifyCode.value)
	VerifyCode({
		"code": verifyCode.value
	}).then((res) => {
		console.log(res)
		if (res.status === 200) {
			router.push({ name: "signIn" })
		}
	})
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

			<div class="form-item" v-if="showVerifyCode">
				<input type="text" name="username" placeholder="Username" v-model="username">
				<label class="label" for="username">Username</label>
			</div>

			<div class="form-item">
				<input type="text" name="username" placeholder="Email" v-model="email">
				<label class="label" for="username">Email</label>
			</div>

			<div class="form-item">
				<input type="password" name="password" placeholder="Password" v-model="password">
				<label class="label" for="password">Password</label>
			</div>

			<div class="form-item" v-if="showVerifyCode">
				<input type="number" name="verify-code" placeholder="verify-code" v-model="verifyCode">
				<label class="label" for="password">Password</label>
				<div class="btn" @click="handleVerifyCode">Confirm Verify Code</div>
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

		gap: 1rem;
		margin: 5vh;
		padding: 5vh;

		width: 400px;
		height: 500px;

		border: 1px solid silver;

		.form-item {
			display: flex;

			// background-color: rgba(255, 255, 255, 0.5);
			// border: 1px solid silver;
			text-shadow: 0px 0px 20px black;
			// align-items: center;
			justify-content: center;

			// .label {
			// 	position: absolute;
			// 	flex: 1 0 0;
			// 	min-width: 0;

			// 	padding: 1vh;
			// 	margin: 1vh;

			// 	text-align: center;
			// }

			// .input {
			// 	position: relative;
			// 	flex: 2 0 0;
			// 	min-width: 0;

			// 	padding: 1vh;
			// 	margin: 1vh 0;
			// 	margin: 1rem;

			// 	input {
			// 		min-width: 0;

			// 		margin: -1.1vh 0;

			// 		position: absolute;
			// 		top: 0;
			// 		bottom: 0;
			// 		left: 0;
			// 		right: 0;

			// 		border: 1px solid silver;
			// 		text-indent: 10px;
			// 	}
			// }
			label {
				// position: absolute;
				width: 50px;
				transform: translate(0rem, 2rem);
				justify-self: flex-start;
				// top: 2rem;
				display: none;
			}

			input {
				min-width: 0;
				margin: 1rem;
				padding: 2rem;
				outline: none;
				border: none;
				border-radius: 5px;
				border: 1px solid grey;
				overflow: visible;
			}
			
			input::-webkit-input-placeholder {
				// trnas
				transform: translateY(5px);
			}

			input::placeholder {
				z-index: 1;
				color: black;
				transform: scale(1.2) translateX(2.5rem);
				transition: all .1s;
			}

			input:focus::placeholder {
				display: none;
				transform: scale(1) translateY(-1.6rem);
			}

			.btn {
				display: inline-block;
				max-width: 20rem;
				padding: 1rem;
				margin: 1rem;

				flex: 1 0 0;

				text-align: center;

				color: aliceblue;

				background-color: rgba(0, 0, 0, 0.4);
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
