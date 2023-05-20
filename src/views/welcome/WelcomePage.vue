<script setup lang="ts">
import { Ref, computed, ref } from "vue"
import FileList from "@/components/ReadFile/FileList.vue"
import router from "@/router"
import { ipcRenderer } from "electron"
import jszip from "jszip"
import { useProjectStore } from "@/stores/project"
import { getUser } from "@/api/getUser"
// import fileSave from "file-saver"
import path from "path"
import fs from "fs"
import { useUserStore } from "@/stores/user"

const workplacePath = ref("/home/nilexpr/Documents/NilMind/Files")
const isCloud = ref(false)
type IStoragedFile = {
    dirname: string
    basename: string
    thumbnail: string
    content: string
}

const files = ref([] as IStoragedFile[])

const cloudIds: Ref<string[]> = ref([])
// const imageUrls = ref("")
ipcRenderer.invoke("read-files", workplacePath.value).then((res) => {
	const filesArr = JSON.parse(res)
	for (const file of filesArr) {
		file.content = JSON.parse(file.content)
		// file.
	}
	files.value = filesArr
	console.log(files.value)
})

const createNewMindmap = () => {
	console.log("createNewMindmap")
	router.push({ name: "mindmap" })
}

const fileSelector = ref()
const openLocalFile = () => {
	const result = fileSelector.value.click()
	// fileSelector.value.addEventListener("change", (event: any) => {
	// 	const selectedFile = event.target.files[0]
	// 	console.log(selectedFile)
		
	// 	// const fileReader = new FileReader()
	// 	// fileReader.readAsText(selectedFile)
	// 	// fileReader.addEventListener("load", (event) => {
	// 	// 	console.log(event.target.result) // 输出文件内容
	// 	// })
	// })
	// console.log(fileSelector.value)
}


const ReadFile = (event: any) => {
	const file: File = event.target.files[0]
	console.log(file)
	const newFile: IStoragedFile = {
		dirname: path.dirname(file.path),
		basename: path.basename(file.path),
		thumbnail: "",
		content: ""
	}
	if (!file) {
		return
	}
	jszip.loadAsync(file).then(
		(res) => {
			// type IStoragedFile = {
			//     dirname: string;
			//     basename: string;
			//     thumbnail: string;
			//     content: string;
			// }
			console.log(res)
			res.file("content.json")?.async("string").then((res) => {
				console.log(res)
				const content = JSON.parse(res)
				console.log(content)
				newFile.content = content

				console.log(newFile)
				
				router.push({ name: "mindmap" })


				const store = useProjectStore()
				store.importExistedProject(newFile as any)
			})
			res.file("Thumbnails/thumbnail.png")?.async("blob").then(async (blob) => {
				newFile.thumbnail =  JSON.stringify(await blob.arrayBuffer())
				const imageUrl = URL.createObjectURL(blob)
				const imgElement = document.createElement("img")
				imgElement.src = imageUrl
				document.body.appendChild(imgElement)
			})
		}
	)
}

const handleChangePath = () => {
	console.log("handleChangePath")
}

const handleOpenRecentFile = (file: IStoragedFile) => {
	console.log("handleOpenRecentFile")
	console.log(file)
	
	const store = useProjectStore()
	store.importExistedProject(file as any)
	router.push({ name: "mindmap" })
}

const handleCloudFile = () => {
	isCloud.value = true
	getUser().then(res => {
		const promiseArr: any[] = []
		console.log((res as any).user[0].file)
		
		for (const file of (res as any).user[0].file) {
			promiseArr.push(fetch(file.path, {
				method: "GET"
			}))
		}

		function deleteFolderRecursive(path: string) {
			if (fs.existsSync(path)) {
				fs.readdirSync(path).forEach(function(file, index) {
					const curPath = path + "/" + file
					if (fs.lstatSync(curPath).isDirectory()) { // recurse
						deleteFolderRecursive(curPath)
					} else { // delete file
						fs.unlinkSync(curPath)
					}
				})
				fs.rmdirSync(path)
			}
		}

		deleteFolderRecursive(path.join(workplacePath.value, "tmp"))
		fs.mkdir(path.join(workplacePath.value, "tmp"), { recursive: true }, (err) => {
			if (err) throw err
			console.log("Directory created!")
			Promise.all(promiseArr).then(async (resArr) => {
				// cloudIds.value = resArr[]
				console.log(resArr)
				cloudIds.value = []
				for (let i = 0; i < resArr.length; i ++) {
					const file = (res as any).user[0].file[i]
					console.log(file)
					const objectIdRegex = /ObjectID\("(\w+)"\)/
					const match = file.id.match(objectIdRegex)
					if (match) {
						const objectId = match[1]
						console.log(objectId) // 输出：6464fcedb6edeb5d09824f4c
						cloudIds.value.push(objectId)
					}
					// const fileName = file.name
					// console.log(fileName)
					const subRes = resArr[i]
					// console.log(subRes)
					// const filePath = "http://localhost:8080/download/" + file.path.split("http:/localhost:8080/files/")[1].split(".zip")[0]
					// const downloadPath = file.path
					// console.log(downloadPath)
					const folderPath = path.join(
						"/home/nilexpr/Documents/NilMind/Files/tmp", 
						file.path.split("http://localhost:8080/files/")[1].split(".zip")[0])
					// console.log(folderPath)
					if (!fs.existsSync(folderPath)) {
						fs.mkdirSync(folderPath)
					}
					if (String(file.name).includes(".zip") === false) {
						file.name += ".zip"
					}
					const desktopPath = path.join(
						"/home/nilexpr/Documents/NilMind/Files/tmp", 
						file.path.split("http://localhost:8080/files/")[1].split(".zip")[0],
						file.name)
					console.log("file.name", file.name)
						
					console.log("desktopPath", desktopPath)
					const buffer = Buffer.from(await (await subRes.blob()).arrayBuffer() )
					fs.writeFileSync(desktopPath, buffer)
				}
				const newFilePath = path.join(workplacePath.value, "tmp")
				console.log(newFilePath)
				
				ipcRenderer.invoke("read-files", newFilePath).then((res) => {
					// console.log(res)
					
					const filesArr = JSON.parse(res)
					for (const file of filesArr) {
						file.content = JSON.parse(file.content)
					}
					files.value = filesArr
					// console.log(files.value)
				})
			})
		})

	})
}

const handleLibrary = () => {
	isCloud.value = true
	getUser().then(res => {
		const promiseArr: any[] = []
		console.log((res as any).user[0].file)
		
		for (const file of (res as any).user[0].file) {
			promiseArr.push(fetch(file.path, {
				method: "GET"
			}))
		}

		function deleteFolderRecursive(path: string) {
			if (fs.existsSync(path)) {
				fs.readdirSync(path).forEach(function(file, index) {
					const curPath = path + "/" + file
					if (fs.lstatSync(curPath).isDirectory()) { // recurse
						deleteFolderRecursive(curPath)
					} else { // delete file
						fs.unlinkSync(curPath)
					}
				})
				fs.rmdirSync(path)
			}
		}

		deleteFolderRecursive(path.join(workplacePath.value, "tmp"))
		fs.mkdir(path.join(workplacePath.value, "tmp"), { recursive: true }, (err) => {
			if (err) throw err
			console.log("Directory created!")
			Promise.all(promiseArr).then(async (resArr) => {
				// cloudIds.value = resArr[]
				console.log(resArr)
				cloudIds.value = []
				for (let i = 0; i < resArr.length; i ++) {
					const file = (res as any).user[0].file[i]
					console.log(file)
					const objectIdRegex = /ObjectID\("(\w+)"\)/
					const match = file.id.match(objectIdRegex)
					if (match) {
						const objectId = match[1]
						console.log(objectId) // 输出：6464fcedb6edeb5d09824f4c
						cloudIds.value.push(objectId)
					}
					// const fileName = file.name
					// console.log(fileName)
					const subRes = resArr[i]
					// console.log(subRes)
					// const filePath = "http://localhost:8080/download/" + file.path.split("http:/localhost:8080/files/")[1].split(".zip")[0]
					// const downloadPath = file.path
					// console.log(downloadPath)
					const folderPath = path.join(
						"/home/nilexpr/Documents/NilMind/Files/tmp", 
						file.path.split("http://localhost:8080/files/")[1].split(".zip")[0])
					// console.log(folderPath)
					if (!fs.existsSync(folderPath)) {
						fs.mkdirSync(folderPath)
					}
					if (String(file.name).includes(".zip") === false) {
						file.name += ".zip"
					}
					const desktopPath = path.join(
						"/home/nilexpr/Documents/NilMind/Files/tmp", 
						file.path.split("http://localhost:8080/files/")[1].split(".zip")[0],
						file.name)
					console.log("file.name", file.name)
						
					console.log("desktopPath", desktopPath)
					const buffer = Buffer.from(await (await subRes.blob()).arrayBuffer() )
					fs.writeFileSync(desktopPath, buffer)
				}
				const newFilePath = path.join(workplacePath.value, "tmp")
				console.log(newFilePath)
				
				ipcRenderer.invoke("read-files", newFilePath).then((res) => {
					// console.log(res)
					
					const filesArr = JSON.parse(res)
					for (const file of filesArr) {
						file.content = JSON.parse(file.content)
					}
					files.value = filesArr
					// console.log(files.value)
				})
			})
		})

	})
}

const handleUploadFile = async () => {
	const formData = new FormData()
	formData.set("file", file)
	formData.set("userId", "64521d0b0f0075a4a403a7da")
	console.log(formData.get("file"))
	
	fetch("http://localhost:8080/files", {
		method: "POST",
		body: formData,
		// headers: {
		// "Content-Type": "multipart/form-data"
		// "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryiQBnQnYyyGr1j3cQ"
		// },
	}).then((res) => {
		console.log(res)
	}).catch((err) => {
		console.log(err)
	})
}
const handleRecentFile = () => {
	isCloud.value = false
	ipcRenderer.invoke("read-files", workplacePath.value).then((res) => {
		const filesArr = JSON.parse(res)
		for (const file of filesArr) {
			file.content = JSON.parse(file.content)
		}
		files.value = filesArr
		console.log(files.value)
	})
}

const handleAccount = () => {
	console.log("handleAccount")
	router.push({name: "signIn"})
}

let curFile: any
let curIndex = 0
const handleOpenItemMenu = (event: any) => {
	event.preventDefault() // 阻止默认行为，即禁用默认的右键菜单
	return (file: IStoragedFile, index: number) => {
		curFile = file
		curIndex = index
		ipcRenderer.send("show-context-menu")
	}

}
ipcRenderer.on("context-menu-command", (e, command) => {
	const actionMapper = new Map<string, () => void>([
		["Open", () => {
			handleOpenRecentFile(curFile)
		}],
		["Upload", () => {
			// todo...
			const formData = new FormData()
			console.log(curFile)
			const fileStream = fs.readFileSync(path.join(curFile.dirname, curFile.basename))
			const options = { type: "application/zip" }
			const fileBlob = new Blob([fileStream], {
				type: "application/zip",
			})
			// fs.createReadStream(path.join(curFile.dirname, curFile.basename))
			console.log(fileBlob)
			
			formData.set("file", fileBlob, curFile.basename)
			formData.set("userId", "6458959ad099661fb461697f")
			console.log(formData.get("file"))
	
			fetch("http://localhost:8080/files", {
				method: "POST",
				body: formData,
				// headers: {
				// "Content-Type": "multipart/form-data"
				// "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryiQBnQnYyyGr1j3cQ"
				// },
			}).then((res) => {
				console.log(res)
			}).catch((err) => {
				console.log(err)
			})
			// fetch("http://localhost:8080/files", )
		}],
		["Delete", () => {
			const store = useProjectStore()
			console.log(cloudIds)
			
			console.log(cloudIds.value[curIndex])
			// fetch()
			fetch("http://localhost:8080/files/" + cloudIds.value[curIndex], {
				method: "DELETE"
			}).then((res) => {
				console.log(res)
			})
			
			console.log("delete")
		}],
	])
	const action = actionMapper.get(command)
	action && action()
})


const userStore = useUserStore()
const accountName = computed(() => {
	if (userStore.username !== "") {
		return userStore.username
	}
	return "Account"
})
</script>

<template>
	<!-- <input type="file" @change="handleInputFile"/>
	<div @click="handleUploadFile">Upload File</div> -->
	<section class="files">
		<div class="files__tabs">
			<ul>
				<li class="option-item" @click="handleRecentFile">
					<img src="/icons/clock.svg">
					<span>Recent</span> 
				</li>
				<li class="option-item" @click="handleCloudFile">
					<img src="/icons/list.svg">
					<span>Cloud Files</span> 
				</li>
				<li class="option-item" @click="handleLibrary">
					<img src="/icons/layers.svg">
					<span>Library</span> 
				</li>
			</ul>

			<ul>
				<li class="option-item" @click="handleAccount">
					<img src="/icons/github.svg">
					<span>{{accountName}}</span>
				</li>
				<li class="option-item" @click="createNewMindmap">
					<img src="/icons/plus.svg">
					<span>Create New Map</span> 
				</li>
				<li class="option-item" @click="openLocalFile">
					<img src="/icons/folder-plus.svg">
					<input type="file" id="file-selector" ref="fileSelector" @change="ReadFile">
					<span>Open Local File</span> 
				</li>
			</ul>
		</div>
		<div class="files__list">
			<div class="files__path" @click="handleChangePath">Workplace path: {{ workplacePath }}</div>
			<div class="files__list-item">
				<template v-for="file, index in files" :key="[file.dirname, file.basename].join('-')">
					<FileList
						:file="file"
						@click="handleOpenRecentFile(file)"
						@contextmenu="(event) => handleOpenItemMenu(event)(file, index)"
					>
						<template v-if="isCloud"> 
							<img src="/icons/cloud.svg" class="files__list-item-cloud" />
						</template>
					</FileList>
				</template>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
@import "@/sass/main.scss";

.files {
	display: flex;
	font-size: $default-font-size;
	height: 100vh;

	&__tabs {
		display: flex;
		flex-direction: column;

		justify-content: space-around;

		flex: 1 1 0;
		max-width: 20rem;
		background-color: $color-primary;
		border-right: 1px solid $color-primary-dark;
	}

	&__list {
		flex: 1 1 0;

	}
	&__path {
		font-size: 2rem;
		padding: 1rem;
		margin: 2rem;
		@include Selectable;
	}

	&__list-item {
		position: relative;
		padding: 1rem;
		margin: 2rem;

		display: flex;
		flex-wrap: wrap;
		gap: 2rem;

		&-cloud {
			right: 0;
			top: 0;
			position: absolute;
			opacity: .8;
			// background-color: antiquewhite
		}
	}
}

.option-item {
	@include Selectable;
	padding: 1rem;
	margin: 1rem;
	display: flex;
	align-items: center;
	gap: 1rem;
	text-overflow: ellipsis;

	&:hover {
		background-color: rgba($color: $color-black, $alpha: .1);
	}
}

#file-selector {
	display: none;
}
</style>
