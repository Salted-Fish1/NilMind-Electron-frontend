import * as base from "@/type/model/baseModel"

export class Node {
	id = "id"
	title = "Created"
	
	parentNode: Node | null = null
	children: Node[] = []
	
	note: {
		content: string | null
	} = {
			content: null
		}
	labels: string[] = ["unUsed", "Welcome"]

	lastVisitedChild: Node | null = null

	get level(): number {
		if (this.parentNode === null) {
			return 1
		}
		return this.parentNode.level + 1
	}
	
	get index() {
		if (this.parentNode === null) {
			return null
		}
		const index = this.parentNode.children.findIndex(
			(child) => {
				return child.id === this.id
			}
		)
		if (index === -1) {
			throw new Error("wrong child node")
		}
		return index
	}

	get nextSibling(): Node | null {
		if (this.parentNode === null || this.index === null) return null
		const nextIndex = this.index + 1
		if (this.parentNode.children.length <= nextIndex) return null
		return this.parentNode.children[nextIndex]
	}

	get previousSibling(): Node | null {
		if (this.parentNode === null || this.index === null) return null
		const preIndex = this.index - 1
		if (preIndex < 0) return null
		return this.parentNode.children[preIndex]
	}

	static create(idGenerator: Generator<string, string, unknown>, node?: Partial<base.INode>) {
		const newNode = new Node(node)
		newNode.id = idGenerator.next().value
		return newNode
	}

	constructor(node?: Partial<base.INode>) {
		if (node) {
			node.id && (this.id = node.id)
			node.labels && (this.labels = node.labels)
			node.note && (this.note = node.note)
			node.title && (this.title = node.title)

			if (node.children) {
				this.children = node.children.map((child) => new Node(child))
			}
		}
	}
}

const nodeTransformer = (node: base.INode, nodeMap: Map<string, Node>) => {
	const result = new Node(node)
	const fixRelation = (node: Node, parentNode: Node | null) => {
		nodeMap.set(node.id, node)
		node.parentNode = parentNode
		node.children.forEach((child) => {
			fixRelation(child, node)
		})
	}
	fixRelation(result, null)
	return result
}

const projectTransformer = (project: base.IProject) => {
	const {rootTopic, ...rest} = project
	const nodeMap = new Map<string, Node>()
	nodeTransformer(rootTopic, nodeMap)
	const result = {
		...rest,
		rootTopicID: rootTopic.id,
		nodeMap,
		// rootTopic: nodeTransformer(rootTopic, nodeMap)
	}
	return result
}

type IActiveModel = {
	projects: {
        rootTopicID: string;
        nodeMap: Map<string, Node>;
        id: string;
        title: string;
        theme: base.ITheme;
    }[];
    mainProjectName: string;
}

export const mainProjectTransformer = (mainProject: base.IMainProject): IActiveModel => {
	const {projects, ...rest} = mainProject
	const result = {
		...rest, 
		projects: projects.map((project) =>  projectTransformer(project))
	}
	return result
}

const exportNodeTransformer = (node: Node): base.INode => {
	const {level, index, previousSibling, lastVisitedChild, nextSibling, parentNode, children, ...rest} = node
	const result: base.INode = {
		...rest,
		children: children.map((child) => exportNodeTransformer(child))
	}
	return result
}

const exportProjectTransformer = (project: IActiveModel["projects"][number]): base.IProject=> {
	const {rootTopicID, nodeMap, ...rest} = project
	const rootTopic = nodeMap.get(rootTopicID)
	// console.log(rootTopic)
	
	if (!rootTopic) {
		throw new Error("node Error!")
	}
	const result: base.IProject = {
		...rest,
		rootTopic: exportNodeTransformer(rootTopic)
	}
	return result
}

export const exportMainProjectTransformer = (model: IActiveModel): base.IMainProject => {
	const {projects, ...rest} = model
	const result: base.IMainProject = {
		...rest, 
		projects: projects.map((project) =>  exportProjectTransformer(project))
	}
	return result
}