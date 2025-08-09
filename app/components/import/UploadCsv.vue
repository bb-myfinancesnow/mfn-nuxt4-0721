<script lang="ts" setup>
interface Props {
	cardTitle: string;
	isParentDisabled: boolean;
	acceptFiles?: string;
	multipleFiles?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	acceptFiles: 'text/csv',
	multipleFiles: false
});

const cardDescription = computed(() => `Upload data for ${props.cardTitle}`);

// const updateFileModelVal = (val: File | File[] | null | undefined) => {
// 	console.log(`updateFileModelVal typeof: ${typeof val}`);
// };
</script>

<template>
	<UPageCard :title="cardTitle" :description="cardDescription">
		<UFileUpload
			:accept="acceptFiles"
			:multiple="multipleFiles"
		/>
	</UPageCard>
</template>
