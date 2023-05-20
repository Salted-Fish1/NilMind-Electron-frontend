<script setup lang="ts">
import { useProjectStore } from "@/stores/project"
import { computed, ref } from "vue"
import MdEditor from "../markdown-editor/MdEditor.vue"

const store = useProjectStore()

const curNode = computed(() => {
	if (typeof store.actionsState.selected === "string") {
		const result = store.project.nodeMap.get(store.actionsState.selected)
		// console.log(result)
		return result
	}
	return undefined
})

const newTagText = ref("")
const handleAddTag = () => {
	console.log("handleAddTag")
	if (curNode.value === undefined) {
		return
	}
	const tagSet = new Set(curNode.value?.labels)
	if (newTagText.value === "") {
		return
	}
	tagSet.add(newTagText.value)
	const newTagArr = [...tagSet]
	curNode.value.labels = newTagArr
	newTagText.value = ""
	store.state.updateConnectLine = !store.state.updateConnectLine
}

const handleRemoveTag = (tag: string) => {
	if (curNode.value === undefined) {
		return
	}
	const tagSet = new Set(curNode.value?.labels)
	tagSet.delete(tag)
	const newTagArr = [...tagSet]
	curNode.value.labels = newTagArr
	newTagText.value = ""
	store.state.updateConnectLine = !store.state.updateConnectLine
}

</script>

<template>
    <div v-if="curNode !== undefined">
        <div class="node-info" v-if="curNode !== undefined">
            <!-- <InputBar title="Title" v-model="curNode.title"></InputBar> -->
            <div class="node-info__title node-info__item">Title</div>
            <div class="node-info__item node-info__tag-input">
                <input type="text" v-model="curNode.title" @keydown.enter="handleAddTag">
            </div>
    
            <div class="node-info__title node-info__item">Tag</div>
            <ul class="node-info__tags node-info__item">
                <li
                    v-for="tag in curNode.labels" :key="tag"
                    @click="handleRemoveTag(tag)"
                >
                    {{ tag }}
                    <img src="/icons/x.svg" alt="">
                </li>
            </ul>
            <div class="node-info__item node-info__tag-input">
                <input type="text" v-model="newTagText" @keydown.enter="handleAddTag">
            </div>
            <div class="node-info__title node-info__item">Note</div>
            <div class="node-info__item">
                <MdEditor :Id="curNode.id"></MdEditor>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "@/sass/main.scss";
.node-info {
    &__tags {
        font-size: 1.6rem;
        & > li {
            margin: .5rem;
            @include Selectable;
            padding: .5rem;
            display: inline-block;
            list-style: none;
            border: 1px solid $color-black;
            border-radius: .2rem;



            & > img {
                width: 1rem;
            }
        }

    }
    &__tag-content {
        display: inline-block;
        border: none;
        outline: none;
        // padding: .5rem;
    }
    
    &__item {
        margin: 1rem;
    }

    &__tag-input {
        padding: .5rem;

        & > input {
            padding: .2rem .5rem;
            outline: none;
            border: none;
            border: 1px solid rgba($color: $color-black, $alpha: .4);
            width: 20rem;
        }
    }
}
</style>
