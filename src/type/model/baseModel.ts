interface INote {
    content: string | null
}

interface INode {
    id: string
    title: string

    note: INote
    labels: string[]

    children: INode[]
}

interface ITheme {
    id: string
}
interface IProject {
    id: string
    title: string
    rootTopic: INode
    theme: ITheme
}

interface IMainProject {
    mainProjectName: string
    projects: IProject[]
}

export type {
	INote,
	INode,
	ITheme,
	IProject,
	IMainProject
}
