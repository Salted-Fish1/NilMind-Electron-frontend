import { defineStore } from "pinia"
import { getIdGenerator } from "@/utils/model/idGenerator"
import { getDefaultBaseMainProject } from "@/utils/model/defaultBaseModel"
import { exportMainProjectTransformer, mainProjectTransformer } from "@/utils/model/node"
import { IStoragedFile } from "@/type/file/file"
import * as base from "@/type/model/baseModel"
import { Node } from "@/utils/model/node"
import { viewActionTrigger } from "./actionConfig/defaultViewConfig"
import { editActionTrigger } from "./actionConfig/defaultEditConfig"
import { selectedActionTrigger } from "./actionConfig/defaultSelectedConfig"
import { multiSelectedActionTrigger } from "./actionConfig/defaultMultiSelectedConfig"
import { ActionsTrigger } from "@/utils/action/actionsTrigger"
import JSZip from "jszip"
import path from "path"
import { ipcMain } from "electron/main"
import { ipcRenderer } from "electron"

// import { ipcMain } from "electron"

type storageState = {
	local: "Unsaved" | "Saved",
	dirname: string,
	basename: string,
}

export type IActions =
	"addNextSibling" |
	"addPreviousSibling" |
	"addChild" |
	"addNote" |
	"addLabel" |
	"moveLeft" |
	"moveRight" |
	"moveUp" |
	"moveDown" |
	"delete" |
	"deleteNote" |
	"deleteLabel" |
	"select" |
	"multiSelect" |
	"edit" |
	"view" |
	"redo" |
	"undo" |
	"save"

export type projectState = "View" | "Edit" | "Selected" | "Multi-Selected"

type IMode = "mindmap" | "markdown" | "statistics"

type actionsState = {
	state: projectState
	selected: string | Set<string> | null
	stateToTrigger: Record<projectState, ActionsTrigger<any>>
	actionsArgs: any
}

export const useProjectStore = defineStore("project", {
	state() {
		const stateToTrigger: Record<projectState, ActionsTrigger<any>> = {
			View: viewActionTrigger,
			Edit: editActionTrigger,
			Selected: selectedActionTrigger,
			"Multi-Selected": multiSelectedActionTrigger
		}
		const idGenerator = getIdGenerator()
		const mainBaseProject = getDefaultBaseMainProject(idGenerator)
		const mainProject = mainProjectTransformer(mainBaseProject)
		const actionsArgs: any = null
		const projectId: string | null = null
		return {
			projectId,
			idGenerator,
			mainProject,
			activeProjectIndex: 0,
			state: {
				isCreated: true,
				updateConnectLine: false,
				isUpdated: false,
				storage: {
					dirname: "",
					basename: "",
					local: "Unsaved"
				} as storageState,
			},
			viewMode: "mindmap" as IMode,
			actionsState: {
				stateToTrigger,
				state: "View",
				selected: null,
				actionsArgs
			} as actionsState,
		}
	},
	getters: {
		project(state) {
			const result = state.mainProject.projects[state.activeProjectIndex]
			return result
		},
		getNodeById() {
			return (id: string) => {
				// console.log(id)
				
				const result = this.project.nodeMap.get(id)
				if (!result) {
					throw new Error("node not found")
				}
				return result
			}
		}
	},
	actions: {
		execAction (event: KeyboardEvent | MouseEvent) {
			// console.log("store execAction")
			event.preventDefault()
			const trigger = this.actionsState.stateToTrigger[this.actionsState.state]
			trigger.actionsArgs = this.actionsState.actionsArgs
			// console.log(JSON.stringify(trigger.actionsArgs))
			
			trigger.triggerAction(event)
			
			trigger.actionsArgs = null
			this.actionsState.actionsArgs = null
		},
		export() {
			console.log(this.mainProject)
			
			return exportMainProjectTransformer(this.mainProject)
		},
		importExistedProject(file: IStoragedFile) {
			this.state.storage.basename = file.basename
			this.state.storage.dirname = file.dirname
			this.state.isCreated = true
			this.mainProject = mainProjectTransformer(file.content)
		},
		nodeActions(event: IActions, ...args: any[]) {
			const actionsMapper: Record<IActions, (args?: any) => void> = {
				select: (args?: string[]) => {
					// console.log(JSON.stringify(args))
					const set = new Set(args ?? [])

					if (set.size === 1) {
						for (const item of set) {
							this.actionsState.selected = item
						}
						this.actionsState.state = "Selected"
					} else if (set.size === 0) {
						this.actionsState.selected = null
						this.actionsState.state = "View"
					} else {
						this.actionsState.selected = set
						this.actionsState.state = "Multi-Selected"
					}
				},
				multiSelect: (args?: string[] | string) => {
					if (typeof this.actionsState.selected === "string") {
						const selected = this.actionsState.selected
						if (typeof args === "string") {
							this.actionsState.selected = new Set([args, selected])
						} else {
							this.actionsState.selected = new Set([...(args ?? []), selected])
						}
						this.actionsState.state = "Multi-Selected"
					} else if (typeof this.actionsState.selected === "undefined") {
						if (typeof args === "undefined") {
							this.actionsState.state = "View"
						} else if (typeof args === "string") {
							this.actionsState.selected = args
							this.actionsState.state = "Selected"
						} else {
							this.actionsState.selected = new Set(args)
							this.actionsState.state = "Multi-Selected"
						}
					} else {
						if (typeof args === "string") {
							this.actionsState.selected?.add(args)
						} else {
							for (const arg of args ?? []) {
								this.actionsState.selected?.add(arg)
							}
						}
						this.actionsState.state = "Multi-Selected"
					}
				},
				view: () => {
					this.actionsState.selected = null
				},
				addNextSibling: (curNodeId?: string, node?: Partial<base.INode>) => {
					const newNode = Node.create(this.idGenerator, node)
					if (typeof this.actionsState.selected !== "string") {
						throw new Error("wrong state action")
					}
					const curNode = this.project.nodeMap.get(curNodeId ?? this.actionsState.selected)
					const parentNode = curNode?.parentNode

					if (parentNode == null || curNode == null) {
						throw new Error("node not found")
					}
					newNode.parentNode = parentNode
					const index = parentNode.children.findIndex((node) => node.id === curNode.id)
					parentNode.children.splice(index + 1, 0, newNode)
					this.project.nodeMap.set(newNode.id, newNode)
					this.actionsState.selected = newNode.id
				},
				addPreviousSibling: (curNodeId?: string, node?: Partial<base.INode>) => {
					const newNode = Node.create(this.idGenerator, node)
					if (typeof this.actionsState.selected !== "string") {
						throw new Error("wrong state action")
					}
					const curNode = this.project.nodeMap.get(curNodeId ?? this.actionsState.selected)
					const parentNode = curNode?.parentNode

					if (parentNode == null || curNode == null) {
						throw new Error("node not found")
					}
					newNode.parentNode = parentNode
					const index = parentNode.children.findIndex((node) => node.id === curNode.id)
					parentNode.children.splice(index, 0, newNode)
					this.project.nodeMap.set(newNode.id, newNode)
					this.actionsState.selected = newNode.id
				},
				addChild: (curNodeId?: string, node?: Partial<base.INode>) => {
					const newNode = Node.create(this.idGenerator, node)
					if (typeof this.actionsState.selected !== "string") {
						throw new Error("wrong state action")
					}
					
					const curNode = this.project.nodeMap.get(curNodeId ?? this.actionsState.selected)
					if (curNode === undefined) {
						throw new Error("node not found")
					}
					newNode.parentNode = curNode
					curNode.children.push(newNode)
					this.project.nodeMap.set(newNode.id, newNode)
					this.actionsState.selected = newNode.id
				},
				moveLeft: (curNodeId?: string) => {
					// console.log(curNodeId)
					
					if (typeof this.actionsState.selected !== "string") {
						throw new Error("wrong state action")
					}
					const curNode = this.project.nodeMap.get(curNodeId ?? this.actionsState.selected)
					if (curNode == null) {
						throw new Error("node not found")
					}
					if (curNode.parentNode === null) {
						return
					}
					curNode.parentNode.lastVisitedChild = curNode
					this.actionsState.selected = curNode.parentNode.id
				},
				moveRight: (curNodeId?: string) => {
					if (typeof this.actionsState.selected !== "string") {
						throw new Error("wrong state action")
					}
					const curNode = this.project.nodeMap.get(curNodeId ?? this.actionsState.selected)
					if (curNode == null) {
						throw new Error("node not found")
					}
					if (curNode.lastVisitedChild) {
						this.actionsState.selected = curNode.lastVisitedChild.id
						return 
					}
					if (curNode.children[0]) {
						this.actionsState.selected = curNode.children[0].id
					}
				},
				moveUp: (curNodeId?: string) => {
					if (typeof this.actionsState.selected !== "string") {
						throw new Error("wrong state action")
					}
					const curNode = this.project.nodeMap.get(curNodeId ?? this.actionsState.selected)
					// console.log(curNode)
					// console.log(curNode?.previousSibling?.id)
					
					
					if (curNode == null) {
						throw new Error("node not found")
					}
					this.actionsState.selected = curNode.previousSibling?.id ?? curNode.id
				},
				moveDown: (curNodeId?: string) => {
					if (typeof this.actionsState.selected !== "string") {
						throw new Error("wrong state action")
					}
					const curNode = this.project.nodeMap.get(curNodeId ?? this.actionsState.selected)
					if (curNode == null) {
						throw new Error("node not found")
					}
					this.actionsState.selected = curNode.nextSibling?.id ?? curNode.id
				},
				delete: (curNodeId?: string) => {
					const deleteNode = (node: Node) => {
						if (node.parentNode === null) {
							return
						}
						node.children.forEach((child) => {
							deleteNode(child)
						})
						const index = node.parentNode.children.findIndex((value) => value.id === node.id)
						node.parentNode.children.splice(index, 1)
					}

					if (typeof this.actionsState.selected === "string") {
						const selected = this.project.nodeMap.get(this.actionsState.selected)
						if (selected == null) {
							throw new Error("node not found")
						}
						deleteNode(selected)
					} else {
						for (const item of this.actionsState.selected ?? []) {
							const selected = this.project.nodeMap.get(item)
							if (selected == null) {
								throw new Error("node not found")
							}
							deleteNode(selected)
						}
					}
					this.actionsState.selected = null
				},
				save: async () => {
					const filePath = path.join(this.state.storage.dirname, this.state.storage.basename, ) 
					console.log(filePath)
					// if (filePath === ".") {
						
					// }
					const response = await fetch("/cover/cover.png")
					
					const blob = await response.blob()
					const arrayBuffer = await blob.arrayBuffer()
					const uint8Array = new Uint8Array(arrayBuffer)
					const dataArray = JSON.stringify(uint8Array)

					console.log(blob)
					console.log(uint8Array)
					
					

					ipcRenderer.invoke("save-file", filePath, {
						thumbnail: dataArray,
						content: JSON.stringify(this.export())
					})
					
					// zip.generateAsync({ type: "blob" })
					// 	.then(function(content) {
					// 		saveAs(content, "example.zip")
					// 	})
					// console.log("save")
					// console.log(JSON.stringify(this.export()))
					// const sources = await desktopCapturer.getSources({ types: ["screen"] })
					// console.log(sources)
					// 截取当前页面的画面
					// webContents.capturePage().then((image: any) => {
					// 	// 在页面上展示截图
					// 	const img = document.createElement("img")
					// 	img.src = image.toDataURL()
					// 	document.body.appendChild(img)
					// }).catch((error: Error) => {
					// 	console.error(error)
					// })
					// const 
				}
			}
			actionsMapper[event](...args)
			this.state.updateConnectLine = !this.state.updateConnectLine
			this.state.isUpdated = true
			if (event === "save") {
				this.state.isUpdated = false
			}
		},
		changeSubProject(id: string) {
			this.activeProjectIndex = this.mainProject.projects.findIndex((project) => {
				return project.id === id
			})
			this.actionsState.selected = null
			this.actionsState.state = "View"
			this.state.updateConnectLine = !this.state.updateConnectLine
		}
	}
})
