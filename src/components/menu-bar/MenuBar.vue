<script setup lang="ts">
import { useProjectStore } from "@/stores/project"
import { computed } from "vue"

const store = useProjectStore()
const title = computed(() => {
	return store.mainProject.mainProjectName + " / " + store.project.title
})
const handleAddChild = () => {
	store.nodeActions("addChild")
}
const handleAddNextSibling = () => {
	store.nodeActions("addNextSibling")
}
const handleAddPreviousSibling = () => {
	store.nodeActions("addPreviousSibling")
}
const handleAddNote = () => {
	store.nodeActions("addNote")
}
const handleAddLabel = () => {
	store.nodeActions("addLabel")
}
</script>

<template>
    <div class="menu-bar">
        <div class="menu-bar__title">
            {{ title }}
        </div>
        <div class="menu-bar__actions">
            <div class="menu-bar__actions-item"
                @click="handleAddChild"
            >
                <img src="/icons/arrow-right.svg" alt="">
                <span>subTopic</span>
            </div>
            <div class="menu-bar__actions-item"
                @click="handleAddNextSibling"
            >
                <img src="/icons/arrow-down.svg" alt="">
                <span>NextSibling</span>
            </div>
            <div class="menu-bar__actions-item"
                @click="handleAddPreviousSibling"
            >
                <img src="/icons/arrow-up.svg" alt="">
                <span>PreviousSibling</span>
            </div>
            <div class="menu-bar__actions-item"
                @click="handleAddNote"
            >
                <img src="/icons/file.svg" alt="">
                <span>Note</span>
            </div>
            <div class="menu-bar__actions-item"
                @click="handleAddLabel"
            >
                <img src="/icons/tag.svg" alt="">
                <span>Label</span>
            </div>
        </div>
        
    </div>
</template>

<style scoped lang="scss">
@import "@/sass/main.scss";
.menu-bar {
    font-size: 1.6rem;
    display: flex;

    &__title {
        margin: 1rem;
        padding: 1rem;
    }

    &__actions {
        display: flex;
        gap: 1rem;
        margin: 0 auto;

        align-items: center;

        &-item {
            @include Selectable;
            display: flex;
            align-items: center;
            padding: 1rem;
            cursor: pointer;
            user-select: none;

            & > img {
                margin: .5rem;
            }
        }
    }
}
</style>
