// const { Menu } = require("electron")
import { BrowserWindow, Menu } from "electron"
import { ipcMain } from "electron"

ipcMain.on("show-context-menu", (event) => {
	const template = [
		{
			label: "Open",
			click: () => { event.sender.send("context-menu-command", "Open") }
		},
		{ type: "separator" },
		{ 
			label: "Upload", 
			click: () => { event.sender.send("context-menu-command", "Upload") }
		},
		{ type: "separator" },
		{ 
			label: "Delete", 
			click: () => { event.sender.send("context-menu-command", "Delete") }
		}
	]
	const menu = Menu.buildFromTemplate(template)
	menu.popup(BrowserWindow.fromWebContents(event.sender))
})