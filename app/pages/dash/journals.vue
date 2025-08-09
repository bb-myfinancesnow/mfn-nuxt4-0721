<script lang="ts" setup>
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui';

const route = useRoute();

const toolbarDisabled = computed(() => {
	return route.fullPath.startsWith('/dash/journals/record');
});

const links = [
	[
		{
			label: 'Home',
			icon: 'i-lucide-house',
			to: '/dash/journals',
			exact: true
		},
		{
			label: 'List',
			icon: 'i-lucide-list',
			to: '/dash/journals/list'
		},
		{
			label: 'Schedules',
			icon: 'i-lucide-calendar-cog',
			to: '/dash/journals/schedules'
		}
	],
	[
		{
			label: 'Import CSV',
			icon: 'i-lucide-file-up',
			to: '/dash/journals/imports'
		},
		{
			label: 'Prime Import',
			icon: 'i-lucide-file-up',
			to: '/dash/journals/prime-imports'
		},
		{
			label: 'Tester',
			icon: 'i-lucide-pencil',
			to: '/dash/journals/tester'
		},
		{
			label: 'Sample',
			icon: 'i-lucide-test-tube-diagonal'
		}
	]
] satisfies NavigationMenuItem[][];

const items = [[{
	label: 'New mail',
	icon: 'i-lucide-send'
}, {
	label: 'New Journal',
	icon: 'i-lucide-clipboard-plus',
	to: '/dash/journals/record/create'
}]] satisfies DropdownMenuItem[][];
</script>

<template>
	<UDashboardPanel
		id="journalshome"
		:ui="{ body: 'lg:py-12' }"
	>
		<template #header>
			<UDashboardNavbar title="Journals">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>

				<template #right>
					<UDropdownMenu :items="items">
						<UButton
							:disabled="toolbarDisabled"
							icon="i-lucide-plus"
							size="md"
							class="rounded-full"
						/>
					</UDropdownMenu>
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
			<!-- <div>Record Check: {{ String(toolbarDisabled) }}</div> -->
			<div>{{ route.fullPath }}</div>
			<!-- <div
				class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto"
			>
				<NuxtPage />
			</div> -->
			<NuxtPage />
		</template>
	</UDashboardPanel>
</template>
