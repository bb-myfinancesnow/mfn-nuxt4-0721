<script lang="ts" setup>
interface Props {
	input: Date | undefined;
	dateTimeFormat?: boolean;
}

// defineProps<{ input: Date | undefined }>();

const props = withDefaults(defineProps<Props>(), {
	dateTimeFormat: false
});

const displayVal = computed<string>(() => {
	if (!props.input) {
		return '';
	} else if (props.dateTimeFormat) {
		return formatDateTimeObjVal(props.input);
	} else {
		return formatUSDate(props.input);
	}
});
</script>

<template>
	<div>
		{{ displayVal }}
	</div>
	<!-- <div v-if="input">
		{{ formatUSDate(input) }}
	</div> -->
</template>
