import type * as base from "@/type/model/baseModel"

const getDefaultBaseProject = (idGenerator: Generator<string, string, unknown>): base.IProject => {
	const result: base.IProject = {
		id: idGenerator.next().value,
		title: "Project1",
		rootTopic: {
			id: idGenerator.next().value,
			title: "rootTopic",
			note: {
				content: "rootTopic"
			},
			labels: ["rootTopic"],
			children: [
				{
					id: idGenerator.next().value,
					title: "secondTopic",
					note: {
						content: "secondTopic"
					},
					labels: ["secondTopic"],
					children: []
				},
				{
					id: idGenerator.next().value,
					title: "Third",
					note: {
						content: null
					},
					labels: ["Third"],
					children: [
						{
							id: idGenerator.next().value,
							title: "Last4",
							note: {
								content: null
							},
							labels: ["Last4"],
							children: []
						},
						{
							id: idGenerator.next().value,
							title: "Last5",
							note: {
								content: null
							},
							labels: ["Last4"],
							children: [
								{
									id: idGenerator.next().value,
									title: "Last",
									note: {
										content: null
									},
									labels: ["Last4"],
									children: []
								}
							]
						}
					]
				}
			]
		},
		theme: {
			id: idGenerator.next().value
		}
	}
	return result
}

const getDefaultBaseMainProject = (idGenerator: Generator<string, string, unknown>): base.IMainProject => {
	const result: base.IMainProject = {
		mainProjectName: "Mindmap",
		projects: [
			getDefaultBaseProject(idGenerator),
			getDefaultBaseProject(idGenerator),
			getDefaultBaseProject(idGenerator),
		]
	}
	return result
}

export {
	getDefaultBaseMainProject,
	getDefaultBaseProject
}