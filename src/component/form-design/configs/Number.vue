<template>
	<n-form-item label="默认内容">
		<n-input-number v-model:value="data.options.defaultValue" />
	</n-form-item>
	<n-form-item label="最大值">
		<n-input-number v-model:value.number="data.options.max" />
	</n-form-item>

	<n-form-item label="最小值">
		<n-input-number v-model:value.number="data.options.min" />
	</n-form-item>

	<n-form-item label="精度">
		<n-input-number v-model:value.number="data.options.precision" :precision="0" :min="0" :max="5" />
	</n-form-item>

	<n-form-item label="步长">
		<n-input-number v-model:value.number="data.options.step" :min="0" />
	</n-form-item>
	<n-form-item label="加减按钮位置">
		<n-radio-group v-model:value="data.options.buttonPlacement" button-style="solid">
			<n-radio-button value="right">right</n-radio-button>
			<n-radio-button value="both">both</n-radio-button>
		</n-radio-group>
	</n-form-item>
	<n-form-item label="显示属性">
		<n-checkbox v-model:checked="data.options.showLabel">显示标签 </n-checkbox>
	</n-form-item>
	<n-form-item label="操作属性">
		<n-checkbox v-model:checked="data.options.rules.required">必填 </n-checkbox>
		<n-checkbox v-model:checked="data.options.disabled">禁用 </n-checkbox>
		<n-checkbox v-model:checked="data.options.allowClear">清除 </n-checkbox>
	</n-form-item>
</template>
<script setup>
defineOptions({ name: "NumberWidget" });
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
</script>

<style scoped></style>
