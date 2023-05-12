<template>
	<n-form-item label="文字">
		<n-input v-model:value="data.options.text" />
	</n-form-item>
	<n-form-item label="标题位置">
		<n-radio-group v-model:value="data.options.titlePlacement" button-style="solid">
			<n-radio-button value="left">居左</n-radio-button>
			<n-radio-button value="center">居中</n-radio-button>
			<n-radio-button value="right">居右</n-radio-button>
		</n-radio-group>
	</n-form-item>
	<n-form-item label="显示属性">
		<n-checkbox v-model:checked="data.options.dashed">虚线 </n-checkbox>
		<n-tooltip trigger="hover">
			<template #trigger>
				<n-checkbox v-model:checked="data.options.vertical">垂直 </n-checkbox>
			</template>
			启用垂直后标题位置将不再受控，标题默认将放置在线左侧
		</n-tooltip>
	</n-form-item>
</template>
<script setup>
defineOptions({ name: "DividerWidget" });
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
