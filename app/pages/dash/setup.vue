<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui';

const links: NavigationMenuItem[][] = [
	[
		{
			label: 'Setup Home',
			icon: 'i-lucide-cog',
			to: '/dash/setup',
			exact: true
		},
		{
			label: 'Jobs',
			icon: 'i-lucide-file-up',
			to: '/dash/setup/jobs'
		}

	],
	[
		{
			label: 'Documentation',
			icon: 'i-lucide-book-open',
			to: 'https://ui.nuxt.com/getting-started/installation/pro/nuxt',
			target: '_blank'
		},
		{
			label: 'Buy now',
			icon: 'i-lucide-shopping-cart',
			to: 'https://ui.nuxt.com/pro/purchase',
			target: '_blank'
		}
	]
];
</script>

<template>
	<UDashboardPanel
		id="setupdash"
		:ui="{ body: 'lg:py-12' }"
	>
		<template #header>
			<UDashboardNavbar title="Tiller App">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>

			<UDashboardToolbar>
				<!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
				<UNavigationMenu
					:items="links"
					highlight
					class="-mx-1 flex-1"
				/>
			</UDashboardToolbar>
		</template>

		<template #body>
			<NuxtPage />
		</template>
	</UDashboardPanel>
</template>
