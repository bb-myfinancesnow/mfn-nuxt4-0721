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
</script>

<template>
	<UPageCard :title="cardTitle" :description="cardDescription">
		<PFileUpload :accept="acceptFiles" :multiple="multipleFiles">
			<template #empty>
				<span>Drag and drop files to here to upload.</span>
			</template>
		</PFileUpload>
	</UPageCard>
</template>
