<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui';

const links = [
	[
		{
			label: 'Home',
			icon: 'i-lucide-house',
			to: '/dash/reporting',
			exact: true
		},
		{
			label: 'Periods',
			icon: 'i-lucide-calendar-cog'
			// to: '/settings/members'
		},
		{
			label: 'Financials',
			icon: 'i-lucide-receipt'
			// to: '/settings/notifications'
		},
		{
			label: 'Data View',
			icon: 'i-lucide-list'
			// to: '/settings/security'
		}
	],
	[
		{
			label: 'Tester',
			icon: 'i-lucide-pencil'
		},
		{
			label: 'Sample',
			icon: 'i-lucide-test-tube-diagonal'
		}
	]
] satisfies NavigationMenuItem[][];
</script>

<template>
	<UDashboardPanel
		id="reporting"
		:ui="{ body: 'lg:py-12' }"
	>
		<template #header>
			<UDashboardNavbar title="Settings">
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
			<div
				class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto"
			>
				<NuxtPage />
			</div>
		</template>
	</UDashboardPanel>
</template>
