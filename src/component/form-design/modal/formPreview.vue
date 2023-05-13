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

		<template #footer>
			<div style="text-align: center; width: 100%">
				<n-button type="tertiary" @click="handleClose"> 取 消</n-button>
				<n-button type="primary" style="margin-left: 15px" @click="handleOk">获取表单填报数据</n-button>
				<n-button type="primary" style="margin-left: 15px" @click="getFormAllData">获取整个表单数据</n-button>
				<n-button type="primary" style="margin-left: 15px" @click="calculateScore">计算得分</n-button>
			</div>
		</template>
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

// 获取表单填报数据
const handleOk = () => {
	generateFormRef.value.getData().then(res => {
		console.log(res);
	});
};

// 获取整个表单数据
const getFormAllData = () => {
	generateFormRef.value.getWidgetFormData().then(res => {
		console.log(res);
	});
};

// 计算得分
const calculateScore = () => {
	const result = generateFormRef.value.calculateTheScore();

	console.log("获取到表单得分以及需要计算得分的表单项", result);
};

const open = val => {
	widgetForm.value = val;
	visible.value = true;
};

defineExpose({ open });
</script>

<style scoped></style>
