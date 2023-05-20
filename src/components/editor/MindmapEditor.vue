<script setup lang="ts">
import { useProjectStore } from "@/stores/project"
import NodeItem from "./node/NodeItem.vue"
import { computed, nextTick, onMounted, ref, watch } from "vue"
import { drawConnectLine } from "@/utils/action/drawLine"
import BoxCard from "../box-card/BoxCard.vue"
import NodeInfo from "../node-info/NodeInfo.vue"


const store = useProjectStore()

const rootTopicID = computed(() => store.project.rootTopicID)

const canvas = ref()
const editor = ref()

const setCanvas = () => {
	canvas.value.width = editor.value.offsetWidth
	canvas.value.height = editor.value.offsetHeight
}

onMounted(() => {
	setCanvas()
	document.title = store.state.storage.basename.split(".")[0]
	const rootTopic = store.project.nodeMap.get(store.project.rootTopicID)
	if (rootTopic === undefined) {
		throw new Error("root Node not found")
	}
	drawConnectLine(canvas.value, rootTopic)
})

watch(() => store.state.updateConnectLine, () => {
	nextTick(() => {
		const ctx = canvas.value.getContext("2d")
		ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
		const rootTopic = store.project.nodeMap.get(store.project.rootTopicID)
		if (rootTopic === undefined) {
			throw new Error("root Node not found")
		}
		drawConnectLine(canvas.value, rootTopic)
	})
})

watch(() => store.state.isUpdated, (value) => {
	if (value === true) {
		document.title += "*"
	} else {
		document.title = document.title.substring(0, document.title.length - 1)
	}
})

const singleSelected = computed(() => {
	console.log(store.actionsState.selected)
	
	if (typeof store.actionsState.selected === "string") {
		return store.actionsState.selected
	}
	return null
})

const isShowSideBar = ref(true)
const handleShowSideBar = () => {
	isShowSideBar.value = !isShowSideBar.value
	store.state.updateConnectLine = !store.state.updateConnectLine
	console.log(isShowSideBar.value)
}

const curNode = computed(() => {
	if (typeof store.actionsState.selected === "string") {
		const result = store.project.nodeMap.get(store.actionsState.selected)
		// console.log(result)
		return result
	}
	return undefined
})

</script>

<template>
    <section
        class="editor"
    >
        <div
			class="editor__panel"
			draggable="true" 
			tabindex="0"
			autofocus
			@click="store.execAction"
			@keydown="store.execAction"
			ref="editor"
		>
            <node-item :current-node-id="rootTopicID"></node-item>
        </div>
		<template v-if="curNode !== undefined">
			<div class="editor__item-info">
				<!-- <div @click="handleShowSideBar">123</div> -->
				<BoxCard :is-show="isShowSideBar">
					<NodeInfo :node-id="singleSelected"></NodeInfo>
					<!-- <InputBar :title="'Title'"></InputBar> -->
				</BoxCard>
			</div>
		</template>
        <canvas ref="canvas" class="editor__canvas"></canvas>
    </section>
</template>

<style scoped lang="scss">
@import "@/sass/main.scss";
.editor {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    z-index: 10;

    position: relative;
	overflow: hidden;

    &::-webkit-scrollbar {
		display: none;
	}

    &__canvas {
		position: absolute;
		left: 0;
		top: 0;
		z-index: -20;
		transition: all .2s;
	}
    

    &__panel {
		outline: none;
        backface-visibility: hidden;
		flex: 4 0 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
    }

	&__item-info {
		flex: 0 1 30rem;
		min-width: 30rem;
		max-width: 24rem;
		height: 100%;
	}
	
}

@keyframes fadeIn {
	0% {
		opacity: 0;
		flex: 0 0 0;
        // transform: scaleX(0);
		// transform: scale(1.2, 1.2);
	}

	100% {
		flex: 1 0 0;
	}
}
</style>
