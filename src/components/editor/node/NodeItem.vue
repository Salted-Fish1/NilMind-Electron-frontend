<script setup lang="ts">
import { useProjectStore } from "@/stores/project"
import { computed, isReactive, isRef, onMounted, ref, watch } from "vue"
import BoxCard from "@/components/box-card/BoxCard.vue"

interface IProps {
	currentNodeId: string
}

const props = defineProps<IProps>()
const store = useProjectStore()

const nodeMap = computed(() => store.project.nodeMap)

let node = store.getNodeById(props.currentNodeId)

const parent = ref()
// onMounted(() => {
// 	parent.value.id = props.currentNodeId

// 	// watch(() => props.currentNodeId, () => {
// 	// 	node = store.getNodeById(props.currentNodeId)
// 	// })
// })

const labels = computed(() => {
	return node.labels
})


watch(() => props.currentNodeId, () => {
	node = store.getNodeById(props.currentNodeId)
})

const isSelected = computed(() => {
	if (typeof store.actionsState.selected === "string") {
		return store.actionsState.selected === props.currentNodeId
	} else if (store.actionsState.selected !== null) {
		return store.actionsState.selected.has(props.currentNodeId)
	}
	return false
})

const handleClick = () => {
	store.actionsState.actionsArgs = [props.currentNodeId]
}

</script>

<template>
	<div class="node-item"
		draggable="true"
	>
		<div class="node-item__body">
			<ul class="node-item__labels">
				<li class="node-item__label" v-for="item in labels" :key="item">{{ item }}</li>
			</ul>
			<div
				class="node-item__parent u-around u-border-radius"
				:class="{'node-item__parent--selected': isSelected}"
				:id="props.currentNodeId"
				@click="handleClick"
				ref="parent"
			>
				<!-- <span>{{ node.id.split('|')[0] }}</span> -->
				<span>{{ node.title }}</span>
				<!-- <BoxCard></BoxCard> -->
			</div>
		</div>
		

		<div class="node-item__children"
			v-if="node.children.length !== 0"
		>
		<!-- <TransitionGroup name="list"> -->
		<node-item
			v-for="item of node.children"
			:key="item.id"
			:current-node-id="item.id" ref="children"
		>
		</node-item>
		<!-- </TransitionGroup> -->
		</div>
	</div>
</template>

<style scoped lang="scss">
@import "@/sass/main.scss";
.node-item {
	display: flex;
	user-select: none;
	justify-items: center;

	&__body {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	
	&__parent {
		position: relative;
        background-color: rgba($color: $color-white, $alpha: .4);
		transition: all .2s;
		@include Selectable;
		align-self: center;
		backface-visibility: hidden;
		animation: fadeIn .2s ease-out;
		animation-fill-mode: backwards;
		backdrop-filter: blur(1rem);
		z-index: 10;


		&--selected {
			outline: 2px solid rgba($color: $color-black, $alpha: .4);

			& .node-item__labels {
				visibility: visible;
				opacity: 1;
			}
		}
		&:hover .node-item__labels {
			visibility: visible;
			opacity: 1;
		}
	}

	&__label {
		margin: .5rem;
		padding: .5rem;
		border-radius: .2rem;
		transition: all .2s;
		outline: 1px solid $color-primary-light;
		background-color: rgba($color: $color-white, $alpha: .6);
		// backdrop-filter: blur(3rem);
		margin: 5px;
		transform: translate(1rem, 1rem);
	}

	&__labels {
		display: flex;
		font-size: 1.2rem;
		// position: absolute;
		list-style: none;
		// visibility: hidden;
		// opacity: 0;

		bottom: 100%;
		left: 0;

		backface-visibility: hidden;

	}

	&__children {
		z-index: 5;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
}

@keyframes fadeIn {
	0% {
		opacity: 0;
		transform: scale(1.2, 1.2);
	}

	100% {
		opacity: 1;
		transform: none;
	}
}

.list-move {
  transition: all 0.2s ease;
}

.list-leave-active {
  position: absolute;
}

</style>
