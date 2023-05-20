enum modifierKeys {
	"Control" = "Control",
	"Shift" = "Shift",
	"Alt" = "Alt",
}

export class ActionsTrigger<T extends string> {
	actionsMapper: Record<T, (args: unknown) => void>
	keyToActionsMapper: Map<string, T>
	actionsArgs: unknown
	actionDevider = "-"
	keysArr: string[] = []

	static actionsArgs: any

	static setActionsArgs = (...args: any) => {
		this.actionsArgs = args
	}

	getKeysArr (event: KeyboardEvent | MouseEvent) {
		const modifierKeysArr: string[] = []
		if (event.ctrlKey) {
			modifierKeysArr.push(modifierKeys.Control)
		}
		if (event.shiftKey) {
			modifierKeysArr.push(modifierKeys.Shift)
		}
		if (event.altKey) {
			modifierKeysArr.push(modifierKeys.Alt)
		}

		if (event instanceof KeyboardEvent) {
			modifierKeysArr.push(event.key)
		} else if (event instanceof MouseEvent) {
			modifierKeysArr.push(event.type)
		}
		return modifierKeysArr
	}

	triggerAction (
		event: KeyboardEvent | MouseEvent
	) {
		// console.log("triggerAction")
		
		event.preventDefault()

		this.keysArr = this.getKeysArr(event)
		const key = this.keysArr.join(this.actionDevider)
		const actionName = this.keyToActionsMapper.get(key)

		// console.log(this.keyToActionsMapper)
		// console.log(key)

		if (actionName === undefined) {
			return
		}
		
		this.actionsMapper[actionName](this.actionsArgs)
	}

	constructor (
		actionsMapper: Record<T, (args: unknown) => void>,
		keyToActionsMapper: Array<[string, T]>
	) {
		this.actionsMapper = actionsMapper
		this.keyToActionsMapper = new Map(keyToActionsMapper)
	}
}
