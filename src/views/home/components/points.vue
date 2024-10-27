<template>
	<div class="index1">
		<div class="inputArea">
			<div class="inputArea_input">
				<el-autocomplete
					:prefix-icon="Location"
					v-model.trim="start"
					:trigger-on-focus="false"
					clearable
					size="large"
					placement="top-start"
					:fetch-suggestions="querySearch"
					@select="handleSelectStart"
					placeholder="起点" />

				<el-autocomplete
					v-for="(item, index) in means"
					:prefix-icon="AddLocation"
					:key="index"
					@input="changeInput(index, $event)"
					@select="handleSelectMeans(index, $event)"
					:model-value="item.name"
					:trigger-on-focus="false"
					clearable
					size="large"
					placement="top-start"
					:fetch-suggestions="querySearch"
					:placeholder="'途径点' + (index + 1)" />

				<el-autocomplete
					:prefix-icon="LocationFilled"
					v-model.trim="end"
					:trigger-on-focus="false"
					clearable
					size="large"
					placement="top-start"
					:fetch-suggestions="querySearch"
					@select="handleSelectEnd"
					placeholder="终点" />
			</div>

			<!-- <el-button  :icon="Plus" circle /> -->
			<el-button
				type="primary"
				:icon="Plus"
				@click="addMeans"
				>途径点</el-button
			>
		</div>

		<div class="btn_grp">
			<el-button
				size="large"
				type="primary"
				v-if="status === 0 || status === 1"
				:loading="status === 1"
				@click="plan"
				>规划</el-button
			>
			<el-button
				size="large"
				type="warning"
				@click="exportGPX"
				v-if="status === 2"
				>导出</el-button
			>
			<el-button
				size="large"
				v-if="status === 2"
				@click="cancel"
				>取消</el-button
			>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Location, LocationFilled, Plus, AddLocation } from "@element-plus/icons-vue";
import { inputtips, driving } from "@/api/index.js";
import { events } from "@/utils/events.js";

const start = ref("");
const startPositoin = ref(null);

const end = ref("");
const endPosition = ref(null);

const means = ref([]);
let path = [];
const status = ref(0); // 0 未规划 ，1 规划中 ， 2 已规划

const querySearch = async (queryString, cb) => {
	if (!queryString) return;
	const res = await inputtips(queryString);
	console.log(res);

	if (res.status == "1") {
		const arr = res.tips.map((item) => {
			return {
				value: item.name,
				name: item.name,
				district: item.district,
				address: item.address,
				location: item.location,
			};
		});
		console.log(arr);

		cb(arr);
		return;
	}
};

const handleSelectStart = (item) => {
	start.value = item.value;
	startPositoin.value = item.location;
	events.emit("viewLocation", {
		name: item.value,
		position: item.location,
	});
};

const handleSelectEnd = (item) => {
	end.value = item.value;
	endPosition.value = item.location;

	events.emit("viewLocation", {
		name: item.value,
		position: item.location,
	});
};

const handleSelectMeans = (index, item) => {
	means.value[index].name = item.value;
	means.value[index].location = item.location;

	events.emit("viewLocation", {
		name: item.value,
		position: item.location,
	});
};

const plan = async () => {
	path = [];
	if (!startPositoin.value || !endPosition.value) return;
	status.value = 1;

	const res = await driving({
		origin: startPositoin.value,
		destination: endPosition.value,
		cartype: 1, //电动车/自行车
		waypoints: means.value.map((item) => item.location).join(";"),
	});

	console.log(res);

	if (res.status == "1") {
		setTimeout(() => {
			status.value = 2;
		}, 1000);

		res.route.paths[0].steps.map((item) => {
			const linestring = item.polyline;
			path = path.concat(
				linestring.split(";").map((item) => {
					const arr = item.split(",");
					return [Number(arr[0]), Number(arr[1])];
				})
			);

			console.log(path);
			events.emit("drawLine", path);
		});
	}
};

const changeInput = (index, value) => {
	console.log("change");

	means.value[index].name = value;
};

const addMeans = () => {
	means.value.push({
		name: "",
		position: "",
	});
};

const exportGPX = () => {
	events.emit("export");
};

const cancel = () => {
	status.value = 0;
	events.emit("clear");
};

onMounted(() => {});
</script>

<style lang="scss" scoped>
.index1 {
	display: flex;
	width: 100%;
	flex-direction: column;
	gap: 10px;
	overflow-y: scroll;
	/* position: relative;
  height: 100%; */
}
.btn_grp {
	/* position: absolute;
	bottom: 10px;
	left: 0;
	right: 0; */
	display: flex;
	width: 100%;
	flex-direction: row;
	margin-top: 20px;
	.el-button {
		flex: 1;
	}
}
.inputArea {
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;

	.el-button {
		margin-left: 10px;
		height: 100%;
	}

	.inputArea_input {
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
	}
}
:deep(.el-input__wrapper) {
	background-color: rgba(255, 255, 255, 0.1);
	box-shadow: none;
}

:deep(.el-input__inner) {
	background-color: transparent !important;
	color: #fff;
}

:deep(input:-webkit-autofill) {
	-webkit-text-fill-color: #fff;
	transition: background-color 5000s ease-out 0.5s;
}

/* :deep(input::-webkit-input-placeholder) {
	color: #fff;
} */
</style>
