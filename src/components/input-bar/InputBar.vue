<script setup lang="ts">
import { ref } from "vue"
interface IProps {
    title: string
}

const props = defineProps<IProps>()

const text = ref("")

</script>

<template>
    <div class="input">
        <span>{{ props.title }}</span>
        <input class="input__element" type="text" v-model="text">
    </div>
</template>

<style scoped lang="scss">
@import "@/sass/main.scss";

.input {
    margin: 1rem;
    font-size: 1.8rem;

    &__element {
        margin: .5rem;
        padding: 0.5rem 1rem;

        outline: none;
        border: none;
        border: 1px solid $color-primary-dark;

        box-sizing: border-box;
        width: 20rem;
        display: block;
    }
}
</style>
