<template>
	<div class="main">
		<router-view v-slot="{ Component }">
			<component :is="Component" />
		</router-view>
	</div>
</template>

<script setup>

</script>

<style scoped>
.main {
	width: 100%;
	height: 100%;

	position: relative;
}
</style>
