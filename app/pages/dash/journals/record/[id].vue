<script lang="ts" setup>
const route = useRoute();

if (!route.params.id) {
	console.log(`must provide id`);
}
</script>

<template>
	<div>
		{{ $route.params.id }}
	</div>
</template>
