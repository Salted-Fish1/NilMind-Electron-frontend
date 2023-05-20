import { Node } from "../model/node"

interface IPoint { x: number, y: number }

const drawLineCanvas = (canvas: any, from: IPoint, to: IPoint) => {
	const ctx = canvas.getContext("2d")
	ctx.lineWidth = 4
	ctx.strokeStyle = "#777"
	ctx.beginPath()
	ctx.moveTo(from.x, from.y)
	// ctx.bezierCurveTo(to.x, to.y, 0.9 * to.x + 0.1 * from.x, to.y, to.x, to.y)
	ctx.bezierCurveTo((from.x + to.x) / 2 + 10, from.y, (from.x + to.x) / 2 - 10, to.y, to.x, to.y)
	ctx.stroke()
	ctx.closePath()
}

export const drawConnectLine = (canvas: any, curNode: Node) => {
	const curEl = document.getElementById(curNode.id) as HTMLElement
	const curPoint: IPoint = {
		x: curEl.offsetLeft + curEl.offsetWidth,
		y: curEl.offsetTop + curEl.offsetHeight / 2
	}
	curNode.children.forEach((child) => {
		drawConnectLine(canvas, child)

		const childEl = document.getElementById(child.id) as HTMLElement
		const childPoint: IPoint = {
			x: childEl.offsetLeft,
			y: childEl.offsetTop + childEl.offsetHeight / 2
		}
		drawLineCanvas(canvas, curPoint, childPoint)
	})
}
