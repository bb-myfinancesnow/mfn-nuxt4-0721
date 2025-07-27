<script lang="ts" setup>
interface Props {
	input: number | undefined;
	negativeMulti?: boolean;
	accountingFormat?: boolean;
	isDecimal?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	negativeMulti: false,
	accountingFormat: true,
	isDecimal: false
});

const displayVal = computed<string>(() => {
	if (props.input) {
		let num = props.input;

		if (props.negativeMulti) num *= -1;

		if (props.isDecimal) num *= 100;

		if (props.accountingFormat) return formatIntAccountingCurrency(num);
		else return formatIntCurrency(num);
	}
	return '-';
});
</script>

<template>
	<div>
		{{ displayVal }}
	</div>
</template>
