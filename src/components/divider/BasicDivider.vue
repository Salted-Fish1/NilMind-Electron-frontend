<script setup lang="ts">
import { computed, ref } from "vue"

export interface IConf {
	direction: "horizontal" | "vertical"
	content?: string
}

interface IProps {
	direction: "horizontal" | "vertical"
}

const props = defineProps<IProps>()

const width = computed(() => {
	if (props.direction === "horizontal") {
		return "100%"
	}
	return "0px"
})

const height = computed(() => {
	if (props.direction === "horizontal") {
		return "0px"
	}
	return "100%"
})

const borderTop = computed(() => {
	if (props.direction === "horizontal") {
		return "1px solid silver"
	}
	return "none"
})

const boderLeft = computed(() => {
	if (props.direction === "vertical") {
		return "1px solid silver"
	}
	return "none"
})

const divider = ref(null)

defineExpose({
	divider
})

</script>

<template>
	<div class="divider" ref="divider"></div>
</template>

<style scoped lang="less">
.divider {
	display: inline-block;

	width: v-bind('width');
	height: v-bind('height');
	border-top: v-bind('borderTop');
	border-right: v-bind('boderLeft');

  transition: transform 0.3s ease-in-out;
}
</style>
