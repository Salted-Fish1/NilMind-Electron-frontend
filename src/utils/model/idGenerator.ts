import dayjs from "dayjs"

function getCurrentTime (format: string) {
	return dayjs().format(format)
}

function generateRandomStr (length: number): string {
	let result = ""
	const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return result
}

function * getIdGenerator (): Generator<string, string, unknown> {
	const timeFormat = ["YY", "MM", "DD", "HH", "mm", "ss"].join("-")
	while (true) {
		const randomStr = generateRandomStr(8)
		const timestamp = getCurrentTime(timeFormat)
		yield [randomStr, timestamp].join("|")
	}
}

export { getIdGenerator }
