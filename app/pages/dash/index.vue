<script lang="ts" setup>
import { gql, useQuery } from '@urql/vue';

definePageMeta({
	layout: 'dash'
});

const { data } = useQuery({
	query: gql`
		{
			books {
				id
				name
				system
			}
		}
	`
});
</script>

<template>
	<UDashboardPanel id="dashhome">
		<template #header>
			<UDashboardNavbar
				title="Reporting Home"
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
				<div>tester:</div>
				<div>res:</div>
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
