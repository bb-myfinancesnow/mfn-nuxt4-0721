<script lang="ts" setup>
const route = useRoute();

const { getJournalPageRecord } = useJournals();

if (!route.params.id) {
	console.log(`must provide id`);
}

const {
	data: tranData,
	pending
} = await getJournalPageRecord({
	where: {
		id: Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
	}
});
</script>

<template>
	<div>
		{{ $route.params.id }}
		<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
			<div>
				tranData:
				<pre>{{ tranData }}</pre>
			</div>
			<div>status: {{ String(pending) }}</div>
		</UPageGrid>
	</div>
</template>
