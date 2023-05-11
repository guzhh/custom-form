<template>
	<n-form-item label="默认内容">
		<n-input-group v-if="data.options.range">
			<n-input-number v-model:value.number="data.options.defaultValue[0]" :style="{ width: '33%' }" />
			<n-input-number v-model:value.number="data.options.defaultValue[1]" :style="{ width: '33%' }" />
		</n-input-group>
		<n-input-number v-else v-model:value.number="data.options.defaultValue" />
	</n-form-item>
	<n-form-item label="最大值">
		<n-input-number v-model:value.number="data.options.max" />
	</n-form-item>

	<n-form-item label="最小值">
		<n-input-number v-model:value.number="data.options.min" />
	</n-form-item>

	<n-form-item label="步长">
		<n-input-number v-model:value.number="data.options.step" :min="0" />
	</n-form-item>
	<n-form-item label="组件属性">
		<n-space item-style="display: flex;" align="center">
			<n-checkbox v-model:checked="data.options.range" @update:checked="handleSliderModeChange">双滑块模式 </n-checkbox>
			<n-tooltip trigger="hover">
				<template #trigger>
					<n-checkbox v-model:checked="data.options.vertical">垂直 </n-checkbox>
				</template>
				启用垂直，则必须设置组件的固定宽度、高度
			</n-tooltip>
			<n-checkbox v-model:checked="data.options.reverse">反向坐标轴 </n-checkbox>
		</n-space>
	</n-form-item>
</template>

<script setup>
defineOptions({ name: "SliderWidget" });
const props = defineProps({
	select: {
		type: Object
	}
});
const emits = defineEmits(["update:select"]);

const data = ref(props.select);

watch(
	() => props.select,
	val => {
		data.value = val;
	}
);
watch(data, val => emits("update:select", val));
const handleSliderModeChange = checked => {
	if (checked) data.value.options.defaultValue = [0, 0];
	else data.value.options.defaultValue = 0;
};
</script>

<style scoped></style>
