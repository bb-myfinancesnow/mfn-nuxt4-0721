<script setup lang="ts">
// Mock data - replace with your actual data source
const mockData: SalesData[] = [
	{ id: '1', product: 'Laptop', region: 'North', salesperson: 'John', amount: 1200, date: '2024-01-15', category: 'Electronics' },
	{ id: '2', product: 'Mouse', region: 'North', salesperson: 'Jane', amount: 25, date: '2024-01-16', category: 'Electronics' },
	{ id: '3', product: 'Laptop', region: 'South', salesperson: 'Bob', amount: 1200, date: '2024-01-17', category: 'Electronics' },
	{ id: '4', product: 'Keyboard', region: 'East', salesperson: 'Alice', amount: 75, date: '2024-01-18', category: 'Electronics' },
	{ id: '5', product: 'Monitor', region: 'West', salesperson: 'Charlie', amount: 300, date: '2024-01-19', category: 'Electronics' },
	{ id: '6', product: 'Laptop', region: 'North', salesperson: 'John', amount: 1200, date: '2024-01-20', category: 'Electronics' },
	{ id: '7', product: 'Tablet', region: 'South', salesperson: 'Jane', amount: 500, date: '2024-01-21', category: 'Electronics' },
	{ id: '8', product: 'Phone', region: 'East', salesperson: 'Bob', amount: 800, date: '2024-01-22', category: 'Electronics' }
];
</script>

<template>
	<div class="w-full">
		<ClientOnly fallback-tag="span" fallback="Loading...">
			<PivotsMyPivot :data="mockData" />
		</ClientOnly>
	</div>
</template>
