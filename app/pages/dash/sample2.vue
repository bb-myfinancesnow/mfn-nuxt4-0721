<script lang="ts" setup>

</script>

<template>
	<UDashboardPanel id="samplepage2">
		<template #header>
			<UDashboardNavbar
				title="Sample Page 2"
				:ui="{ right: 'gap-3' }"
			>
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
				<template #right>
					<UColorModeSelect />
				</template>
			</UDashboardNavbar>
		</template>
		<template #body>
			<!-- <div>sample</div> -->
			<div>
				<PivotsTestNested />
			</div>
			<!-- <UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">

				<div>status: {{ String(pending) }}</div>

				<div>
					data:
					<pre>{{ jeData }}</pre>
				</div>
			</UPageGrid> -->
		</template>
	</UDashboardPanel>
</template>
