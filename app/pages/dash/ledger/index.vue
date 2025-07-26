<script lang="ts" setup>

</script>

<template>
	<UDashboardPanel id="ledgerhome">
		<template #header>
			<UDashboardNavbar
				title="Ledger Home"
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
			<UPageGrid class="lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-px">
				<DisplaySpinner />
				<!-- <div>
					data:
					<pre>{{ data }}</pre>
				</div>
				<div>status: {{ status }}</div>
				<div><PButton label="Test" /></div> -->
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
