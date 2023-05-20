import { ActionsTrigger } from "@/utils/action/actionsTrigger"

type IEditActions = "view"

const actionsMapper: Record<IEditActions, (args: unknown) => void> = {
	view: () => {
		console.log("view")
	}
}

const keyToActionsMapper: Array<[string, IEditActions]> = [
	["Escape", "view"]
]

export const editActionTrigger = new ActionsTrigger<IEditActions>(actionsMapper, keyToActionsMapper)
