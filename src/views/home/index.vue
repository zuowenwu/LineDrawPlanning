<template>
	<div class="index">
		<div
			class="map"
			ref="mapContainer"></div>

			<Lmenu ></Lmenu>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { GaoDeMap } from "./Map.js";

import Lmenu from './components/menu.vue'

const mapContainer = ref(null);

let instance;

onMounted(() => {
	instance = new GaoDeMap(mapContainer.value);
});
</script>

<style lang="scss" scoped>
.index {
	width: 100vw;
	height: 100vh;
	position: relative;
	/* background-color: red; */
	.map {
		width: 100%;
		height: 100%;
	}
}
</style>
