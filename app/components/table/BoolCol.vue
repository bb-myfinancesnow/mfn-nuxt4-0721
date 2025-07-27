<script setup lang="ts">
defineProps<{ input: boolean | undefined }>();
</script>

<template>
	<i
		class="pi"
		:class="{
			'pi-check-circle text-green-500': input,
			'pi-times-circle text-red-400': !input
		}"
	/>
</template>
