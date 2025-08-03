<script lang="ts" setup>
interface Props {
	stringId: string;
	createdAt: Date;
	updatedAt: Date;
}

defineProps<Props>();
</script>

<template>
	<div class="grid grid-cols-2 gap-y-3 px-6 py-2">
		<div class="place-self-start font-bold">
			Record ID
		</div>
		<div class="place-self-end">
			{{ stringId }}
		</div>
		<div class="place-self-start font-bold">
			Created At
		</div>
		<div class="place-self-end">
			{{ formatDateTimeObjVal(createdAt) }}
		</div>
		<div class="place-self-start font-bold">
			Updated At
		</div>
		<div class="place-self-end">
			{{ formatDateTimeObjVal(updatedAt) }}
		</div>
	</div>
</template>
