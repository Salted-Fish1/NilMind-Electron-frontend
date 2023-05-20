import { ActionsTrigger } from "@/utils/action/actionsTrigger"
import { useProjectStore } from "../project"

type IMultiSelectedActions =
	"delele" |
	"view" |
	"redo" |
	"undo" |
	"select" |
	"multi-select"

const actionsMapper: Record<IMultiSelectedActions, (args: any) => void> = {
	delele: () => {
		console.log("delele")
	},
	view: () => {
		console.log("view")
		const store = useProjectStore()
		store.nodeActions("view")
	},
	redo: () => {
		console.log("redo")
	},
	undo: () => {
		console.log("undo")
	},
	select: (args?: string[]) => {
		const store = useProjectStore()
		store.nodeActions("select", args)
	},
	"multi-select": (args: string[]) => {
		const store = useProjectStore()
		store.nodeActions("select", args)
	}
}

const keyToActionsMapper: Array<[string, IMultiSelectedActions]> = [
	["click", "select"],
	["Control-click", "multi-select"],
	["Escape", "view"]
]

export const multiSelectedActionTrigger = new ActionsTrigger<IMultiSelectedActions>(actionsMapper, keyToActionsMapper)
