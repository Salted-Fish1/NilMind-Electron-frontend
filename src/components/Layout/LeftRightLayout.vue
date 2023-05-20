<script setup lang="ts">
// import BasicDivider from "@/c/Divider/BasicDivider.vue"
import BasicDivider from "@/components/divider/BasicDivider.vue"
export interface flexConf {
	flex: string,
	justifyContent: "center",
	alignItems: "center"
}

export interface IProps {
	leftFlexConf: flexConf
	rightFlexConf: flexConf
	direction: "horizontal" | "vertical"
}

const props = withDefaults(defineProps<IProps>(), {
	leftFlexConf: () => ({
		flex: "1 0 0",
		justifyContent: "center",
		alignItems: "center"
	}),
	rightFlexConf: () => ({
		flex: "1 0 0",
		justifyContent: "center",
		alignItems: "center"
	}),
	direction: "vertical"
})

</script>

<template>
	<div class="lr-layout">
		<div class="left">
			<slot name="left">
				LeftPanel
			</slot>
		</div>

		<BasicDivider :direction="props.direction" ref="divider"></BasicDivider>

		<div class="right">
			<slot name="right">
				RightPanel
			</slot>
		</div>
	</div>
</template>

<style scoped lang="less">
.lr-layout {
	height: 100vh;

	display: flex;
	flex-direction: row;

	animation: fadeInOut 0.5s ease-in-out;

	background-size: cover;
    background-image: url('/background/City.jpeg');

	.left {
		flex: v-bind('$props.leftFlexConf?.flex');
		min-width: 0;

		justify-content: v-bind('$props.leftFlexConf?.justifyContent');
		align-items: v-bind('$props.leftFlexConf?.alignItems');

		transition: flex 0.3s ease-in-out;
	}

	.right {
		flex: v-bind('$props.rightFlexConf?.flex');
		min-width: 0;

		justify-content: v-bind('$props.rightFlexConf?.justifyContent');
		align-items: v-bind('props.rightFlexConf.alignItems');

		transition: flex 0.3s ease-in-out;
	}
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
