<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import {
	CreateBookDocument,
	type BookInfoFragment,
	type CreateBookInput,
	type CreateBookMutation,
	type CreateBookMutationVariables
} from '~/generated/graphql';

const open = ref(false);

const emit = defineEmits<{
	savedNew: [BookInfoFragment];
}>();

const state = ref<Partial<TNewBookInput>>({
	name: undefined
});

const toast = useToast();

const isSubmitting = ref(false);

async function onSubmit(event: FormSubmitEvent<TNewBookInput>) {
	isSubmitting.value = true;

	const input: CreateBookInput = { name: event.data.name };
	console.log(`form input: ${JSON.stringify(input, null, 2)}`);

	// toast.add({
	// 	title: 'Success',
	// 	description: `New book ${event.data.name} added`,
	// 	color: 'success'
	// });

	const { request } = useGql();

	try {
		const res = await request<
			CreateBookMutation,
			CreateBookMutationVariables
		>(CreateBookDocument, { data: input });
		toast.add({
			title: 'Success',
			description: `New book ${res.createBook.id} added`,
			color: 'success',
			duration: 2000
		});

		await new Promise((r) => setTimeout(r, 2000));
		isSubmitting.value = false;
		emit('savedNew', res.createBook);
		open.value = false;
	} catch (e) {
		console.error(`error submit: ${e}`);
		await new Promise((r) => setTimeout(r, 2000));
		isSubmitting.value = false;
	}
}

const resetForm = () => {
	state.value.name = undefined;
};
</script>

<template>
	<UModal
		v-model:open="open"
		title="New Book"
		:close="{ onClick: () => resetForm() }"
		:dismissible="false"
		description="Add a new book to the database"
	>
		<UButton
			label="New Book"
			icon="i-lucide-plus"
		/>

		<template #body>
			<UForm
				ref="form"
				:schema="NewBookInputSchema"
				:state="state"
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
				<div class="flex justify-end gap-2">
					<!-- <UButton
						label="Cancel"
						color="neutral"
						variant="subtle"
						@click="open = false"
					/> -->
					<UButton
						label="Create"
						color="primary"
						variant="solid"
						type="submit"
						:loading="isSubmitting"
						:disabled="isSubmitting"
					/>
				</div>
			</UForm>
		</template>
	</UModal>
</template>
