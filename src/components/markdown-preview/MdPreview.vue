<script setup lang="ts">
import { useProjectStore } from "@/stores/project"
import { Node } from "@/utils/model/node"
import { computed } from "vue"
import "katex/dist/katex.min.css"
import Milkdown from "./MilkdownEditor.vue"
import { MilkdownProvider, useEditor } from "@milkdown/vue"

import "@milkdown/theme-nord/style.css"

const store = useProjectStore()

const rootNode = computed(() => {
	const result = store.project.nodeMap.get(store.project.rootTopicID)

	if (!result) {
		throw new Error("Node not found")
	}
	return result
})

console.log(rootNode)

const getMindmapText = () => {
	let mindmapText = ""
	const getNodeText = (curNode: Node) => {
		let text = "\n" + "#".repeat(curNode.level) + " "
		mindmapText += text
		mindmapText += curNode.title
		curNode.note.content && (mindmapText += ("\n" + curNode.note.content))
		
		for (const child of curNode.children) {
			getNodeText(child)
		}
	}
	getNodeText(rootNode.value)

	return mindmapText
}

const mindmapText = getMindmapText()

console.log(mindmapText)
</script>

<template>
    <div class="md-previewer">
		<MilkdownProvider>
			<Milkdown :content="mindmapText"/>
		</MilkdownProvider>
	</div>
</template>

<style scoped lang="scss">
.md-previewer {
	font-size: 2rem;
}
</style>
