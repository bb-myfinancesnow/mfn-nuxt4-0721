<script lang="ts" setup>
import type { FileUploadSelectEvent, FileUploadUploaderEvent } from 'primevue/fileupload';

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

const uploadFile = defineModel<File>('uploadFile');

const cardDescription = computed(() => `Upload data for ${props.cardTitle}`);

const fileSelected = (event: FileUploadSelectEvent) => {
	console.log(`fileSelected emit ${event.files}`);
};

const runUploader = (event: FileUploadUploaderEvent) => {
	console.log(`runUploader emit ${event.files}`);

	if (Array.isArray(event.files)) {
		console.log(`files is array`);
		uploadFile.value = event.files[0];
	} else {
		console.log(`files is not array`);
		uploadFile.value = event.files;
	}
};

const clearFileModel = () => {
	console.log(`clearFileModel`);
	uploadFile.value = undefined;
};
</script>

<template>
	<UPageCard :title="cardTitle" :description="cardDescription">
		<PFileUpload
			:accept="acceptFiles"
			:multiple="multipleFiles"
			:file-limit="1"
			auto
			custom-upload
			:disabled="isParentDisabled"
			@select="fileSelected"
			@uploader="runUploader"
			@clear="clearFileModel"
			@remove="clearFileModel"
			@remove-uploaded-file="clearFileModel"
		>
			<template #empty>
				<span>Drag and drop files to here to upload.</span>
			</template>
		</PFileUpload>
	</UPageCard>
</template>
