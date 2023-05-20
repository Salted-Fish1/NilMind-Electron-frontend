import { ActionsTrigger } from "@/utils/action/actionsTrigger"
import { useProjectStore } from "../project"

type ISelectedActions =
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
	"multi-select" |
	"edit" |
	"view" |
	"redo" |
	"undo" |
	"save"

const actionsMapper: Record<ISelectedActions, (args: any) => void> = {
	addNextSibling () {
		const store = useProjectStore()
		store.nodeActions("addNextSibling")
	},
	addPreviousSibling () {
		const store = useProjectStore()
		store.nodeActions("addPreviousSibling")
	},
	addChild () {
		const store = useProjectStore()
		store.nodeActions("addChild")
	},
	addNote () {
		console.log("addNote")
	},
	addLabel () {
		console.log("addLabel")
	},
	moveLeft () {
		console.log("moveLeft")
		const store = useProjectStore()
		store.nodeActions("moveLeft")
	},
	moveRight () {
		console.log("moveRight")
		const store = useProjectStore()
		store.nodeActions("moveRight")
	},
	moveUp () {
		console.log("moveUp")
		const store = useProjectStore()
		store.nodeActions("moveUp")
	},
	moveDown () {
		console.log("moveDown")
		const store = useProjectStore()
		store.nodeActions("moveDown")
	},
	delete () {
		console.log("delete")
		const store = useProjectStore()
		store.nodeActions("delete")
	},
	deleteNote () {
		console.log("deleteNote")
	},
	deleteLabel () {
		console.log("deleteLabel")
	},
	select (args: string[]) {
		const store = useProjectStore()
		store.nodeActions("select", args)
	},
	"multi-select" (args: string[]) {
		const store = useProjectStore()
		store.nodeActions("multiSelect", args)
	},
	edit () {
		console.log("edit")
	},
	view () {
		console.log("view")
		const store = useProjectStore()
		store.nodeActions("view")
	},
	redo () {
		console.log("redo")
		const store = useProjectStore()
		// store.redo()
	},
	undo () {
		console.log("undo")
		const store = useProjectStore()
		// store.undo()
	},
	save() {
		console.log("save")
		const store = useProjectStore()
		store.nodeActions("save")
	}
}

const keyToActionsMapper: Array<[string, ISelectedActions]> = [
	["Enter", "addNextSibling"],
	["Shift-Enter", "addPreviousSibling"],
	["Tab", "addChild"],
	["Control-a", "addNote"],
	["Control-l", "addLabel"],
	["ArrowLeft", "moveLeft"],
	["ArrowRight", "moveRight"],
	["ArrowUp", "moveUp"],
	["ArrowDown", "moveDown"],
	["Backspace", "delete"],
	["Delete", "delete"],
	["Control-Shift-A", "deleteNote"],
	["Control-Shift-L", "deleteLabel"],
	["click", "select"],
	["Control-click", "multi-select"],
	[" ", "edit"],
	["Escape", "view"],
	["Control-y", "redo"],
	["Control-z", "undo"],
	["Control-s", "save"]
]

export const selectedActionTrigger = new ActionsTrigger<ISelectedActions>(actionsMapper, keyToActionsMapper)
