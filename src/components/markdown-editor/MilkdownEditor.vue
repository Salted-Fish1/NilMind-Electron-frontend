<script setup lang="ts">
import { Milkdown, useEditor } from "@milkdown/vue"
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core"
import { nord } from "@milkdown/theme-nord"
import { commonmark } from "@milkdown/preset-commonmark"
import { math } from "@milkdown/plugin-math"
import { prism } from "@milkdown/plugin-prism"
import { emoji } from "@milkdown/plugin-emoji"
import { diagram } from "@milkdown/plugin-diagram"
import { indent } from "@milkdown/plugin-indent"
// import { editorViewCtx, serializerCtx } from "@milkdown/core"
import "katex/dist/katex.min.css"
import { useProjectStore } from "@/stores/project"
import { computed } from "vue"
import { listener, listenerCtx } from "@milkdown/plugin-listener"

interface IProps {
	Id: string
}

const props = defineProps<IProps>()

const store = useProjectStore()

const curNode = computed(() => {
	if (typeof store.actionsState.selected === "string") {
		const result = store.project.nodeMap.get(store.actionsState.selected)
		return result
	}
	return undefined
})

const markdown = curNode.value?.note.content ?? ""

const { get } = useEditor((root) => {
	const editor =  Editor.make()
		.config(nord)
		.config((ctx) => {
			ctx.set(rootCtx, root)
			ctx.set(defaultValueCtx, markdown)
		})
		.config((ctx) => {
			ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
				if (curNode.value) {
					curNode.value.note.content = markdown
				}
			})
		})
		.use(listener)
		.use(commonmark)
		.use(math)
		.use(prism)
		.use(emoji)
		.use(diagram)
		.use(indent)

	return editor
})

</script>

<template>
  <Milkdown />
</template>
