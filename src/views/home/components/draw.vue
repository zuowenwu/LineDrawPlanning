<template>
	<div class="index">
		<!-- <div
			class="primary_btn"
			@click="start">
			开启绘制
		</div> -->


		<img :src="img" alt="" />

		<el-button
			v-if="!status"
			size="large"
			:icon="Pointer"
			:loading="loading"
			@click="start"
			type="primary"
			>开启绘制</el-button
		>

		<div
			class="btn"
			v-if="status">
			<el-button
				size="large"
				type="success"
				@click="correct"
				:disabled="isCorrect"
				:icon="isCorrect ? Select : Star"
				>线路纠偏</el-button
			>
		</div>

		<div
			class="btn_group"
			v-if="status">
			<el-button type="warning" @click="exportGPX">导出</el-button>
			<el-button @click="clear">取消</el-button>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { events } from "@/utils/events.js";
import { ElMessage } from "element-plus";
import { Star, Pointer, Select } from "@element-plus/icons-vue";

const img = new URL("@/assets/svg.svg", import.meta.url).href;

const status = ref(false);
const loading = ref(false);
const isCorrect = ref(false);

const start = () => {
	loading.value = true;
	events.emit("startDraw");
};

const correct = () => {
	events.emit("StartCorrect");
	isCorrect.value = true;
	ElMessage({
		message: "线路纠偏完成",
		type: "success",
		plain: true,
	});
};

events.on("mapMovingEnd", () => {
	loading.value = false;
	status.value = true;
	
});

const clear = () => {
	events.emit("clear");
	loading.value = false;
	status.value = false;
	isCorrect.value = false;
};

const exportGPX = () =>{
	events.emit("export");
}

onMounted(() => {});
</script>

<style lang="scss" scoped>
.index {
	display: flex;
	width: 100%;
	flex-direction: column;
	gap: 10px;
	/* height: 100%; */
}
.btn {
	width: 100%;
	display: flex;
}
.el-button {
	flex: 1;
}
.btn_group {
	width: 100%;
	display: flex;
	flex-direction: row;
}
</style>
