<script setup lang="ts">
import { computed, ref } from "vue"

interface IProps {
    isShow: boolean
}

const props = defineProps<IProps>()

const isShow = computed<string>(() => {
	if (props.isShow) {
		return "flex"
	}
	return "none"
})
console.log(isShow)
</script>

<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "@/sass/main.scss";
.card {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
    box-shadow: 0  0.1rem 0.5rem rgba($color: $color-black, $alpha: .6);
    animation: fadeIn .2s ease-out;
    // overflow: hidden;
    
    &::after {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        backdrop-filter: blur(2rem);
        z-index: -10;
    }
}


</style>
