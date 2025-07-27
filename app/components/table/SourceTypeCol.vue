<script lang="ts" setup>
import type { SourceType } from '~/generated/graphql';

interface Props {
	input: SourceType | undefined;
}
const props = defineProps<Props>();

const colorVal = computed(() => getSourceTypeColor(props.input));
</script>

<template>
	<UBadge :color="colorVal" variant="outline" :label="input" />
</template>
