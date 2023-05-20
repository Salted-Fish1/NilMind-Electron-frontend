<script setup lang="ts">
import MenuBar from "@/components/menu-bar/MenuBar.vue"
import TabBar from "@/components/tab-bar/TabBar.vue"
import MindmapEditor from "@/components/editor/MindmapEditor.vue"
import MdPreviewer from "@/components/markdown-preview/MdPreview.vue"
import StatisticsView from "@/components/statistics/StatisticsView.vue"
import { useProjectStore } from "@/stores/project"
import { toRef } from "vue"

const store = useProjectStore()
const mode = toRef(store, "viewMode")
</script>

<template>
    <section class="mindmap">
        <div class="mindmap__menu-bar">
            <template v-if="mode === 'mindmap'">
                <MenuBar></MenuBar>
            </template>
        </div>
        <div class="mindmap__editor">
            <template v-if="mode === 'mindmap'">
                <MindmapEditor></MindmapEditor>
            </template>
            <template v-else-if="mode === 'markdown'">
                <MdPreviewer></MdPreviewer>
            </template>
            <template v-else-if="mode === 'statistics'">
                <StatisticsView></StatisticsView>
            </template>
        </div>
        <div class="mindmap__tab-bar">
            <TabBar></TabBar>
        </div>
    </section>
</template>

<style scoped lang="scss">
@import "@/sass/main.scss";

.mindmap {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    height: 100vh;

    // background-size: cover;
    background-image: url('/background/City.jpeg');

    &__menu-bar {
        flex: 0 0 4rem;
        background-color: rgba($color: $color-white, $alpha: .8);
    }

    &__editor {
        flex: 4 0 0;
        background-color: rgba($color: $color-white, $alpha: .6);
    }

    &__tab-bar {
        flex: 0 0 3rem;
        background-color: rgba($color: $color-white, $alpha: .8);
    }
}
</style>
