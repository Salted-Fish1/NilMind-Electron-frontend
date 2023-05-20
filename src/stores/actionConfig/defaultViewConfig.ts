import { ActionsTrigger } from "@/utils/action/actionsTrigger"
import { useProjectStore } from "../project"

type IViewActions = "multi-select" | "select" | "redo" | "undo" | "save"

const actionsMapper: Record<IViewActions, (args: any) => void> = {
	"multi-select": (args: string[]) => {
		const store = useProjectStore()
		store.nodeActions("select", args)
	},
	select: (args: string[]) => {
		const store = useProjectStore()
		store.nodeActions("select", args)
	},
	redo: () => {
		console.log("redo")
	},
	undo: () => {
		console.log("undo")
	},
	save: () => {
		console.log("save")
		const store = useProjectStore()
		store.nodeActions("save")
	}
}

const keyToActionsMapper: Array<[string, IViewActions]> = [
	["click", "select"],
	["Control-click", "multi-select"],
	["Control-z", "undo"],
	["Control-y", "redo"],
	["Control-s", "save"]
]

export const viewActionTrigger = new ActionsTrigger<IViewActions>(actionsMapper, keyToActionsMapper)
