export const getUser = () => {
	return new Promise((resolve, reject) => {
		fetch("http://localhost:8080/graphql", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: `
                query user($username: String) {
                    user(username: $username) {
                        username
                        email
                        password
                        file {
							id
                            name
                            path
                        }
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