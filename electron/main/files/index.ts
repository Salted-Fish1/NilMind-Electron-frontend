import { dialog, ipcMain } from "electron"
import fs from "fs"
import path from "path"
import JSZip, { file } from "jszip"
import download from "download"

export type IStoragedFile = {
    dirname: string
    basename: string
    thumbnail: string
    content: string
}

export type IActiveFile = {
	thumbnail: string
    content: string
}

ipcMain.handle("read-files", async (event, workplacePath: string, isTemp: boolean) => {
	const filesArr: IStoragedFile[] = []
	const readDirRecursive = async (dirPath: string) => {
		// console.log(dirPath)
		
		const files = fs.readdirSync(dirPath)
		// console.log(files)
		
		for await(const file of files) {
			// console.log(file)
			
			const filePath = path.join(dirPath, file)

			
			const stat = fs.statSync(filePath)
			if (stat.isDirectory()) {
				// console.log("isDirectory", filePath)
				
				if (!isTemp) {
					// console.log("here")
					const paths = filePath.split("/")
					// console.log(paths)
					if (paths[paths.length - 1] === "tmp") {
						continue
					}
				}
				
				await readDirRecursive(filePath)
				// continue
			}
			if (path.extname(filePath) !== ".zip") {
				continue
			}

			
			
			try {
				const fd = fs.openSync(filePath, "r")
				const fileContent = fs.readFileSync(fd)
				const file = await JSZip.loadAsync(fileContent)
				// console.log(await (await file.file("Thumbnails/thumbnail.png").async("blob")).text())
				const buffer = await((await file.file("Thumbnails/thumbnail.png").async("blob")).arrayBuffer())
				const uint8Array = new Uint8Array(buffer)
				const dataArray = Array.from(uint8Array)
				const serializedData = JSON.stringify(dataArray)
				
				// console.log("last", filePath)
				filesArr.push({
					dirname: path.dirname(filePath),
					basename: path.basename(filePath),
					thumbnail: serializedData,
					content: await file.file("content.json").async("string")
				})
				
			} catch (err) {
				console.error(err)
			}
		}
	}
	await readDirRecursive(workplacePath)
	// console.log("return")
	
	return JSON.stringify(filesArr)
})

ipcMain.handle("save-file", async (event, filePath: string, fileContent: IActiveFile) => {
	const zip = new JSZip()
	zip.file("content.json", fileContent.content)

	const uint8Array = new Uint8Array(Object.values(JSON.parse(fileContent.thumbnail)))
	const blob = new Blob([uint8Array], { type: "image/png" })
	console.log(blob)
	const buffer = Buffer.from(uint8Array.buffer)
	

	zip.file("Thumbnails/thumbnail.png", buffer, { binary: true })

	zip.generateAsync({ type: "nodebuffer" })
		.then(function(content) {
			if (filePath === ".") {
				dialog.showSaveDialog({
					title: "Save File",
					defaultPath: "/home/nilexpr/Documents/NilMind/Files",
					buttonLabel: "Save",
					filters: [
						{ name: "Zip Files", extensions: ["zip"] },
						// { name: "All Files", extensions: ["*"] }
					]
				}).then(result => {
					fs.writeFileSync(result.filePath, content)
					// console.log(result.filePath)
				}).catch(err => {
					console.log(err)
				})
			} else {
				fs.writeFileSync(filePath, content)
			}
		})
})

ipcMain.handle("download", async (event, fileName: string, fileUrl: string) => {
	const fileDest = path.join(
		"/home/nilexpr/Documents/NilMind/Files/tmp", 
		fileUrl.split("http:/localhost:8080/files/")[1].split(".zip")[0],
		fileName)
	// console.log(fileDest)

	fs.writeFileSync(fileDest, await download(fileUrl))
})
