<script setup lang="ts">
import { ref } from "vue"

type IStoragedFile = {
    dirname: string
    basename: string
    thumbnail: string
    content: string
}

type IProps = {
    file: IStoragedFile
}

const props = defineProps<IProps>()

const dataArray = JSON.parse(props.file.thumbnail)
const uint8Array = new Uint8Array(dataArray)
const binaryData = new Blob([uint8Array], { type: "image/png" })
const imageUrl = URL.createObjectURL(binaryData)

</script>

<template>
    <div class="file" ref="file">
        <img :src="imageUrl" alt="">
        <div class="file__name">{{ props.file.basename }}</div>
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
@import "@/sass/main.scss";

.file {
    user-select: none;
    display: inline-block;
    width: 20rem;
    height: 12rem;

    position: relative;
    text-align: center;

    background-image: linear-gradient(rgba($color: $color-primary, $alpha: .4) 60%, rgba($color: $color-black, $alpha: .5) 100%);

    border-radius: 1rem;

    // overflow: hidden;

    & > img {
        // background-size: cover;
        position: absolute;
        left: 5%;
        top: 5%;

        width: 90%;
        height: 90%;

        z-index: -1;


    }
    &__name {
        color: $color-white;
        position: absolute;
        bottom: 1rem;
        left: 0;
        right: 0;
    }
}
</style>
