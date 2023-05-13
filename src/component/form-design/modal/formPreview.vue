<template>
	<base-modal
		style="width: 1000px"
		title="生成JSON"
		subBtuText="验证表单"
		v-model:show="visible"
		@close="handleClose"
		@ok="handleOk"
	>
		<generate-form ref="generateFormRef" :data="widgetForm"></generate-form>
	</base-modal>
</template>

<script setup>
import { naiveui } from "@/config";
import GenerateForm from "@/component/form-render/index.vue";
import BaseModal from "@/component/BaseModal/index.vue";

const generateFormRef = ref();
const visible = ref(false);
const widgetForm = ref(JSON.parse(JSON.stringify(naiveui.widgetForm)));

const handleClose = () => {
	visible.value = false;
};

const handleOk = () => {
	generateFormRef.value.getData().then(res => {
		console.log(res);
	});
	generateFormRef.value.getWidgetFormData().then(res => {
		console.log(res);
	});
};

const open = val => {
	widgetForm.value = val;
	visible.value = true;
};

defineExpose({ open });
</script>

<style scoped></style>
