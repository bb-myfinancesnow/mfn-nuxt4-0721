<script setup lang="ts">
import { data } from '~/example-data/hands-on-example';

const tableData = computed(() => {
	return data;
});
</script>

<template>
	<div class="w-full">
		<ClientOnly fallback-tag="span" fallback="Loading...">
			<HandGridExample :table-data="tableData" />
		</ClientOnly>
	</div>
</template>
