<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import * as z from 'zod';
import { RecurrenceFrequency, Weekday } from '~/generated/graphql';

interface Props {
	templateJournal: TJournalPageRecordSchema;
	isOpenDisabled: boolean;
}

const props = defineProps<Props>();

const form = useTemplateRef('form');

const schema = z.object({
	name: z.string().min(3, {
		message: 'Name must be at least 3 characters.'
	}),
	startDate: z.coerce.date(),
	endDate: z.coerce.date().optional(),
	frequency: z.nativeEnum(RecurrenceFrequency),
	interval: z.coerce.number().int().min(1),
	isActive: z.boolean(),
	dayOfMonth: z.number().int().optional(),
	dayOfWeek: z.nativeEnum(Weekday).optional(),
	genToDate: z.date().optional(),
	templateJournalId: z.string()
});

type Schema = z.output<typeof schema>;

const open = ref(false);

const state = ref<Partial<Schema>>({
	name: undefined,
	startDate: props.templateJournal.tranDate,
	templateJournalId: props.templateJournal.id
});

const isSubmitting = ref(false);

async function onSubmit(event: FormSubmitEvent<Schema>) {
	isSubmitting.value = true;

	console.log(`form input: ${JSON.stringify(event.data, null, 2)}`);

	await new Promise((r) => setTimeout(r, 2000));
	isSubmitting.value = false;
}

const resetForm = () => {
	state.value = {
		name: undefined,
		startDate: props.templateJournal.tranDate,
		templateJournalId: props.templateJournal.id
	};
};
</script>

<template>
	<UModal
		v-model:open="open"
		title="New Tran Schedule"
		:close="{ onClick: () => resetForm() }"
		:dismissible="false"
		description="Generate a new transaction generate schedule"
	>
		<UButton
			label="New Schedule"
			icon="i-lucide-plus"
			:disabled="isOpenDisabled||isSubmitting"
			:loading="isSubmitting"
		/>

		<template #body>
			<UForm
				id="createtransched"
				ref="form"
				:state="state"
				:schema="schema"
				class="space-y-4"
				@submit="onSubmit"
			>
				<UFormField
					label="Name"
					placeholder="Scratch Book"
					name="name"
				>
					<UInput
						v-model="state.name"
						class="w-full"
					/>
				</UFormField>
			</UForm>
		</template>
	</UModal>
</template>
