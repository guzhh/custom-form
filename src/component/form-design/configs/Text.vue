<template>
	<n-form-item label="文字">
		<n-input v-model:value="data.options.text" />
	</n-form-item>
	<n-form-item label="对齐方式">
		<n-radio-group v-model:value="data.options.style.textAlign" button-style="solid">
			<n-radio-button value="left">左对齐</n-radio-button>
			<n-radio-button value="center">居中</n-radio-button>
			<n-radio-button value="right">右对齐</n-radio-button>
		</n-radio-group>
	</n-form-item>
	<n-form-item label="文字粗细">
		<n-radio-group v-model:value="data.options.style.fontWeight" button-style="solid">
			<n-radio-button value="400">正常</n-radio-button>
			<n-radio-button value="600">加粗</n-radio-button>
		</n-radio-group>
	</n-form-item>
	<n-form-item label="文字大小">
		<n-input v-model:value="data.options.style.fontSize" />
	</n-form-item>
	<n-form-item label="行高">
		<n-input v-model:value="data.options.style.lineHeight" />
	</n-form-item>
</template>

<script setup>
defineOptions({ name: "TextWidget" });
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
