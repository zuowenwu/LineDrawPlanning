<template>
	<div
		class="tool"
		:style="{ bottom: active }">
		<div class="tool_main">
			<div class="dece"></div>

			<el-segmented
				style="width: 100%"
				v-model="value"
				@click="change"
				:options="options">
				<template #default="{ item }">
					<div class="flex flex-col items-center gap-2 p-2">
						<el-icon size="20">
							<component :is="item.icon" />
						</el-icon>
						<div>{{ item.label }}</div>
					</div>
				</template>
			</el-segmented>

			<transition
				mode="out-in"
				name="dialog-fade">
				<draw v-if="value == '手绘'"></draw>
				<points v-else-if="value == '起始点'"></points>
			</transition>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import draw from "./draw.vue";
import points from "./points.vue";
import { EditPen, Sort } from "@element-plus/icons-vue";
import { events } from "@/utils/events.js";
const fold = ref(false);

const value = ref("手绘");

const options = [
	{
		label: "手绘",
		value: "手绘",
		icon: EditPen,
	},
	{
		label: "起始点",
		value: "起始点",
		icon: Sort,
	},
];

const active = computed(() => (fold.value ? "-360px" : "0"));

events.on("mapMovingStart", () => (fold.value = true));
events.on("mapMovingEnd", () => (fold.value = false));

const change = () => {
	events.emit("clear");
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.tool {
	position: fixed;
	height: 400px;
	width: 100%;

	/* bottom: 0; */
	left: 0;
	right: 0;
	padding: 15px;
	box-sizing: border-box;
	z-index: 9;
	transition: all 0.5s cubic-bezier(0.18, 0.685, 0, 1);

	.tool_main {
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		box-sizing: border-box;
		padding: 10px;
		display: flex;
		/* justify-content: center; */
		align-items: center;
		flex-direction: column;
		gap: 15px;
		/* margin: 0 20px; */
		.dece {
			height: 8px;
			width: 70px;
			background-color: rgba(255, 255, 255, 0.2);
			border-radius: 50px;
			margin: 0px auto;
			/* padding: 10px 0 ; */
			/* box-sizing: border-box; */
		}
	}
}
.dialog-fade-enter-active {
	animation: flip-horizontal-top 0.3s;
}

.dialog-fade-leave-active {
	animation: flip-horizontal-bck 0.3s cubic-bezier(0.755, 0.05, 0.855, 0.06) both;
}

@keyframes flip-horizontal-top {
	0% {
		transform: translateY(-20px);
		opacity: 0;
		/* filter: blur(10px); */
		/* scale: 0.98; */
	}

	100% {
		transform: translateY(0);
		opacity: 1;
		/* filter: blur(0px); */
		/* scale: 1; */
	}
}

@keyframes flip-horizontal-bck {
	0% {
		transform: translateY(0);
		opacity: 1;
		/* scale: 1; */
		/* filter: blur(0px); */
	}

	100% {
		transform: translateY(20px);
		opacity: 0;
		/* scale: 0.98; */
		/* filter: blur(10px); */
	}
}
</style>

<style>
.el-segmented {
	--el-segmented-bg-color: rgba(255, 255, 255, 0.1);
	border-radius: 10px;
	--el-segmented-padding: 5px;
}
.el-segmented__item {
	padding: 4px 10px;
}

.el-segmented__item-selected {
	border-radius: 10px !important;
}
</style>
