<script setup lang="ts">
import { Milkdown, editorInfoCtxKey, useEditor } from "@milkdown/vue"
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core"
import { nord } from "@milkdown/theme-nord"
import { commonmark } from "@milkdown/preset-commonmark"
import { math } from "@milkdown/plugin-math"
import "katex/dist/katex.min.css"
import { toRef } from "vue"
import { editorViewOptionsCtx } from "@milkdown/core"

interface IProps {
	content: string
}

const props = defineProps<IProps>()

const markdown = toRef(props, "content")

let readonly = true

const editable = () => !readonly



useEditor((root) => {
	return Editor.make()
		.config(nord)
		.config((ctx) => {
			ctx.set(rootCtx, root)
			ctx.set(defaultValueCtx, markdown.value)
			ctx.update(editorViewOptionsCtx, (prev) => ({
				...prev,
				editable
			}))
		})
		.use(commonmark)
		.use(math)
	// return Editor.make().config((ctx) => {
	// 	ctx.update(editorViewOptionsCtx, (prev) => ({
	// 		...prev,
	// 		editable,
	// 	}))
	// })

})
</script>

<template>
  <Milkdown />
</template>
