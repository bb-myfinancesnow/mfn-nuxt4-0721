<script lang="ts" setup>
interface Props {
	intId: number;
	createdAt: Date;
	updatedAt: Date;
}

defineProps<Props>();
</script>

<template>
	<div class="grid grid-cols-2 gap-y-3">
		<div class="place-self-start font-bold">
			Record Id
		</div>
		<div class="place-self-end">
			{{ intId }}
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
