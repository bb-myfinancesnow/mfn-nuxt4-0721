<script lang="ts" setup>
interface Props {
	field: ITargetField;
}
defineProps<Props>();
</script>

<template>
	<label class="font-medium text-white">
		{{ field.label }}
		<span v-if="field.required" class="text-red-500">*</span>
	</label>
</template>
