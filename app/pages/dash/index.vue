<script lang="ts" setup>
import { gql, request } from 'graphql-request';

// definePageMeta({
// 	layout: 'dash'
// });

const document = gql`
	{
		books {
			id
			name
			system
		}
	}
`;
const config = useRuntimeConfig();

const { data, status } = await useAsyncData('testbooks', () =>
	request(config.public.gqlClientUrl, document)
);
// const res = await request(config.public.gqlClientUrl, document);
console.log('res: ', data.value);
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
				<div>
					data:
					<pre>{{ data }}</pre>
				</div>
				<div>status: {{ status }}</div>
			</UPageGrid>
		</template>
	</UDashboardPanel>
</template>
