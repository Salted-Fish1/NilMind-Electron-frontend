<script setup lang="ts">
import Milkdown from "./MilkdownEditor.vue"
import { MilkdownProvider } from "@milkdown/vue"
import "@milkdown/theme-nord/style.css"

interface IProps {
	Id: string
}

const props = defineProps<IProps>()
</script>

<template>
    <div class="md-editor">
        <MilkdownProvider>
          <Milkdown :Id="props.Id"/>
        </MilkdownProvider>
    </div>
</template>


<style scoped lang="scss">
.md-editor {
    outline: none;
    border: none;

    overflow-y: scroll;

    padding-left: 3rem;

    height: 30rem;

    width: 26rem;

    &::-webkit-scrollbar {
		display: none;
	}
    
    // .milkdown {
    //     margin: 2rem;
    // }
    .milkdown__editor--focused {
        box-shadow: none;
    }
}
</style>