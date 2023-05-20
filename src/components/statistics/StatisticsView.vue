<script setup lang="ts">
import { useProjectStore } from "@/stores/project"
import * as echarts from "echarts"
import { computed, onMounted } from "vue"
var myChart
onMounted(() => {
	myChart = echarts.init(document.getElementById("echart")!)
    
	const store = useProjectStore()
	const tagMap = new Map<string, number>()
	const rootTopicID = computed(() => store.project.rootTopicID)
	console.log(rootTopicID.value)
	const rootNode = computed(() => {
		const result = store.project.nodeMap.get(rootTopicID.value)
		console.log(result)
		if (result === undefined) {
			throw new Error("node not found")
		}
		return result
	})
	console.log(rootNode.value.children)

	const getTags = (node: any) => {
		console.log(node)
        
		for (const item of node.labels) {
			tagMap.set(item, (tagMap.get(item) ?? 0) + 1)
		}

		for (const child of node.children) {
			getTags(child)
			// console.log(item)
		}
	}

	getTags(rootNode.value)
	console.log(Array.from(tagMap))
    

    
	const option = {
		tooltip: {
			trigger: "item"
		},
		legend: {
			top: "5%",
			left: "center"
		},
		series: [
			{
				name: "Statistics",
				type: "pie",
				radius: ["40%", "70%"],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: "#fff",
					borderWidth: 2
				},
				label: {
					show: false,
					position: "center"
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 40,
						fontWeight: "bold"
					}
				},
				labelLine: {
					show: false
				},
				data: [
					{ value: 1048, name: "Search Engine" },
					{ value: 735, name: "Direct" },
					{ value: 580, name: "Email" },
					{ value: 484, name: "Union Ads" },
					{ value: 300, name: "Video Ads" }
				]
			}
		]
	}
	option.series[0].data = []
	for (const item of tagMap) {
		const dataItem = {
			value: item[1],
			name: item[0]
		}
		option.series[0].data.push(dataItem)
	}
    
	myChart.setOption(option)
})

</script>

<template>
    <div id="echart">statistics</div>
</template>

<style scoped lang="scss">
#echart {
    width: 100%;
    height: 100%;
}
</style>
