<template>
	<UDashboardGroup unit="rem">
		<UDashboardSidebar
			id="default"
			v-model:open="open"
			collapsible
			resizable
			class="bg-elevated/25"
			:ui="{ footer: 'lg:border-t lg:border-default' }"
		>
			<template #header="{ collapsed }">
				<BaseLayoutMenu :collapsed="collapsed" />
			</template>

			<template #default="{ collapsed }">
				<UDashboardSearchButton
					:collapsed="collapsed"
					class="bg-transparent ring-default"
				/>

				<UNavigationMenu
					:collapsed="collapsed"
					:items="navLinks[0]"
					orientation="vertical"
					tooltip
					popover
				/>

				<UNavigationMenu
					:collapsed="collapsed"
					:items="navLinks[1]"
					orientation="vertical"
					tooltip
					class="mt-auto"
				/>
			</template>

			<template #footer="{ collapsed }">
				<BaseUserMenu :collapsed="collapsed" />
			</template>
		</UDashboardSidebar>

		<UDashboardSearch :groups="groups" />

		<slot />
	</UDashboardGroup>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui';

// const route = useRoute();
const toast = useToast();

const open = ref(false);

const navLinks = ref<NavigationMenuItem[][]>([
	[
		{
			label: 'Home',
			icon: 'i-lucide-house',
			// to: '/dashboard',
			onSelect: () => {
				open.value = false;
			}
		},
		{
			label: 'Books',
			icon: 'i-lucide-book-open',
			// to: '/books',
			description: 'Example Page Table for Books',
			onSelect: () => {
				open.value = false;
			}
		},
		{
			label: 'Accounting',
			icon: 'i-lucide-columns-3-cog',
			type: 'trigger',
			// defaultOpen: route.path.startsWith('/books'),
			children: [
				{
					label: 'Periods',
					icon: 'i-lucide-calendar-cog',
					children: [
						{
							label: 'View'
						},
						{
							label: 'Manage'
						}
					]
				},
				{
					label: 'GL Account Types',
					icon: 'i-lucide-flag'
				},
				{
					label: 'GL Accounts',
					icon: 'i-lucide-notebook-tabs'
				}
			]
		},
		{
			label: 'Lists',
			icon: 'i-lucide-list',
			children: [
				{
					label: 'Entities'
					// to: '/app/lists/entities'
				},
				{
					label: 'Assets'
				},
				{
					label: 'Loans'
				},
				{
					label: 'Investments'
				}
			]
		},

		{
			label: 'Setup',
			icon: 'i-lucide-settings',
			type: 'trigger',
			children: [
				{
					label: 'General',
					onSelect: () => {
						open.value = false;
					}
				},
				{
					label: 'Users',
					onSelect: () => {
						open.value = false;
					}
				},
				{
					label: 'Books',
					onSelect: () => {
						open.value = false;
					}
				}
			]
		}
	],
	[
		{
			label: 'Feedback',
			icon: 'i-lucide-message-circle',
			to: 'https://github.com/nuxt-ui-pro/dashboard',
			target: '_blank'
		},
		{
			label: 'Help & Support',
			icon: 'i-lucide-info',
			to: 'https://github.com/nuxt/ui-pro',
			target: '_blank'
		}
	]
]);

const groups = computed(() => [
	{
		id: 'links',
		label: 'Go to',
		items: navLinks.value.flat()
	},
	{
		id: 'code',
		label: 'Code',
		items: [
			{
				id: 'source',
				label: 'View page source',
				icon: 'i-simple-icons-github',
				to: `https://github.com/bb-myfinancesnow/mfn-nuxt-v0525`,
				target: '_blank'
			}
		]
	}
]);

onMounted(async () => {
	const cookie = useCookie('cookie-consent');
	if (cookie.value === 'accepted') {
		return;
	}

	toast.add({
		title:
			'We use first-party cookies to enhance your experience on our website.',
		duration: 0,
		close: false,
		actions: [
			{
				label: 'Accept',
				color: 'neutral',
				variant: 'outline',
				onClick: () => {
					cookie.value = 'accepted';
				}
			},
			{
				label: 'Opt out',
				color: 'neutral',
				variant: 'ghost'
			}
		]
	});
});
</script>
