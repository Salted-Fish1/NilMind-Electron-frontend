export const deleteFile = (id: string) => {
	fetch("http://localhost:8080/files/" + id)
}