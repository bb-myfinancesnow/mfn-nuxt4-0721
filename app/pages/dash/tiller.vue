<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui';

const links = [
	[
		{
			label: 'Home',
			icon: 'i-lucide-house',
			to: '/dash/tiller',
			exact: true
		},
		{
			label: 'Accounts',
			icon: 'i-lucide-notebook-tabs',
			to: '/dash/tiller/accounts'
		},
		{
			label: 'Categories',
			icon: 'i-lucide-list',
			to: '/dash/tiller/categories'
		}
	],
	[
		{
			label: 'Imports',
			icon: 'i-lucide-file-down'
		},
		{
			label: 'Tester',
			icon: 'i-lucide-test-tube-diagonal',
			to: '/dash/tiller/tester'
		}

	]
] satisfies NavigationMenuItem[][];
</script>

<template>
	<UDashboardPanel
		id="tillerdash"
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
			<!-- <div
				class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto"
			>
				<NuxtPage />
			</div> -->
			<NuxtPage />
		</template>
	</UDashboardPanel>
</template>
