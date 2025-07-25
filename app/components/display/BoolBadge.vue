<script setup lang="ts">
defineProps({
	val: {
		type: Boolean,
		required: true
	}
});
</script>

<template>
	<UBadge
		v-if="val"
		color="success"
		icon="i-lucide-check"
		class="rounded-full"
	/>
	<UBadge
		v-else
		color="error"
		icon="i-lucide-x"
		class="rounded-full"
	/>
</template>
