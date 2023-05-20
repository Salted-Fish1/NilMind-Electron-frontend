<script setup lang="ts">
import { useProjectStore } from "@/stores/project"
import { computed, isRef, toRef } from "vue"

const store = useProjectStore()

const projects = toRef(store.mainProject, "projects")

const topicCounts = computed(() => {
	return store.project.nodeMap.size
})

const mode = toRef(store, "viewMode")

const isSelected = (id: string) => {
	return id === store.project.id
}

const handleChangeSubProject = (id: string) => {
	store.changeSubProject(id)
}

const handleChangeToMarkdownPreview = () => {
	store.viewMode === "markdown" ? 
		store.viewMode = "mindmap" :
		store.viewMode = "markdown"
}

const handleStatistics = () => {
	store.viewMode = "statistics"
}
</script>

<template>
    <div class="tab-bar">
        <div class="tab-bar__projects">
            <div
                v-for="project in projects"
                class="tab-bar__project-item"
                :class="{'tab-bar__selected': isSelected(project.id)}"
                :key="project.id"
                @click="handleChangeSubProject(project.id)"
            >
                {{ project.title }}
            </div>
        </div>
        <div class="tab-bar__meta-info">
            <div class="tab-bar__topic-counts">
                Topic Count: {{ topicCounts }}
            </div>
            <div class="tab-bar__topic-counts" @click="handleStatistics">
                Statistics
            </div>
            <div class="tab-bar__mode" @click="handleChangeToMarkdownPreview">
                {{ mode }}
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "@/sass/main.scss";

.tab-bar {
    display: flex;
    height: 100%;
    margin: 0 1rem;
    font-size: 1.4rem;
    align-items: center;
    justify-content: space-between;
    user-select: none;

    border-top: 1px solid $color-primary-light;

    &__projects {
        display: flex;
        gap: .5rem;

        & > div:not(:last-child)::after {
            content: "";
            margin-left: .5rem;
            border-right: 1px solid $color-primary-dark;
        }

        & > div {
            @include DarkWhenHover;
        }


    }

    &__projects > &__selected {
        color: $color-black;
    }

    &__meta-info {
        display: flex;
        gap: .5rem;

        & > div:not(:last-child)::after {
            content: "";
            margin-left: .5rem;
            border-right: 1px solid $color-primary-dark;
        }
    }

}


</style>
