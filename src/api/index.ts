export const SignUp = (userSignUpInfo: {username: string, password: string, email: string}) => {
	return fetch("http://localhost:8080/sign-up", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userSignUpInfo)
	})
}

export const VerifyCode = (verifyCode: any) => {
	return fetch("http://localhost:8080/verify-code", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(verifyCode)
	})
}

export const SignIn = (info: any) => {
	return fetch("http://localhost:8080/sign-in", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(info)
	})
}

export const getLibrary = () => {
	return new Promise((resolve, reject) => {
		fetch("http://localhost:8080/graphql", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: `
				query workspace($user_id: ID) {
					workspace(user_id: $user_id) {
						user_id
						name
						created_at
						last_update_time
						path
					}
				}
            `,
				variables: {
					"username": "nilexpr"
				}
			})
		}).then(async (res) => {
			const result = await res.json()
			resolve(result.data)
		})
	}) 
}