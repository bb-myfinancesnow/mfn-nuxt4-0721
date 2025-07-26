<template>
	<div
		:class="[
			'flex items-center justify-center p-5',
			fullscreen && 'fixed inset-0 bg-white/90 backdrop-blur-sm z-50 dark:bg-black/90'
		]"
	>
		<div class="flex flex-col items-center gap-3">
			<!-- Dots variant -->
			<div
				v-if="variant === 'dots'"
				class="flex items-center gap-1"
				:style="{ width: `${size}px`, height: `${size}px` }"
			>
				<div
					v-for="i in 3"
					:key="i"
					:class="[
						'rounded-full dots-bounce',
						getColorClass()
					]"
					:style="{
						width: `${size / 4}px`,
						height: `${size / 4}px`,
						backgroundColor: !getColorClass() ? color : undefined,
						animationDelay: `${(i - 1) * 0.16}s`
					}"
				/>
			</div>

			<!-- Ring variant -->
			<div
				v-else-if="variant === 'ring'"
				:class="[
					'border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin',
					getRingColorClass()
				]"
				:style="{
					width: `${size}px`,
					height: `${size}px`,
					borderTopColor: !getRingColorClass() ? color : undefined
				}"
			/>

			<!-- Pulse variant -->
			<div
				v-else-if="variant === 'pulse'"
				:class="[
					'rounded-full pulse-scale',
					getColorClass()
				]"
				:style="{
					width: `${size}px`,
					height: `${size}px`,
					backgroundColor: !getColorClass() ? color : undefined
				}"
			/>

			<!-- Bars variant -->
			<div
				v-else-if="variant === 'bars'"
				class="flex items-center gap-0.5"
				:style="{ width: `${size}px`, height: `${size}px` }"
			>
				<div
					v-for="i in 3"
					:key="i"
					:class="[
						'bars-stretch',
						getColorClass()
					]"
					:style="{
						width: `${size / 8}px`,
						height: '60%',
						backgroundColor: !getColorClass() ? color : undefined,
						animationDelay: `${(i - 1) * 0.1}s`
					}"
				/>
			</div>

			<p
				v-if="text"
				class="text-sm text-gray-600 dark:text-gray-300 font-medium m-0"
			>
				{{ text }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
type SpinnerVariant = 'dots' | 'ring' | 'pulse' | 'bars';

interface Props {
	size?: number;
	color?: string;
	variant?: SpinnerVariant;
	text?: string;
	fullscreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	size: 40,
	color: '#00dc82', // Nuxt green
	variant: 'dots',
	text: '',
	fullscreen: false
});

const getColorClass = (): string => {
	const colorMap: Record<string, string> = {
		'#00dc82': 'bg-green-400',
		'#3b82f6': 'bg-blue-500',
		'#ef4444': 'bg-red-500',
		'#f59e0b': 'bg-yellow-500',
		'#8b5cf6': 'bg-purple-500',
		'#10b981': 'bg-emerald-500',
		'#06b6d4': 'bg-cyan-500',
		'#f97316': 'bg-orange-500',
		'#ec4899': 'bg-pink-500',
		'#84cc16': 'bg-lime-500'
	};

	return colorMap[props.color] || '';
};

const getRingColorClass = (): string => {
	const colorMap: Record<string, string> = {
		'#00dc82': 'border-t-green-400',
		'#3b82f6': 'border-t-blue-500',
		'#ef4444': 'border-t-red-500',
		'#f59e0b': 'border-t-yellow-500',
		'#8b5cf6': 'border-t-purple-500',
		'#10b981': 'border-t-emerald-500',
		'#06b6d4': 'border-t-cyan-500',
		'#f97316': 'border-t-orange-500',
		'#ec4899': 'border-t-pink-500',
		'#84cc16': 'border-t-lime-500'
	};

	return colorMap[props.color] || '';
};
</script>

<style scoped>
/* Dots animation */
.dots-bounce {
  animation: dots-bounce 1.4s infinite ease-in-out both;
}

@keyframes dots-bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Pulse animation */
.pulse-scale {
  animation: pulse-scale 1s infinite ease-in-out;
}

@keyframes pulse-scale {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Bars animation */
.bars-stretch {
  animation: bars-stretch 1.2s infinite ease-in-out;
}

@keyframes bars-stretch {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>
