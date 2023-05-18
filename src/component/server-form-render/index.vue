<template>
	<div style="width: 100%">
		<form-render
			:value="formValue"
			:disabled="disabled"
			v-if="visible && formJson"
			ref="formRenderRef"
			:data="formJson.formJson"
		></form-render>
		<div style="width: 100%; text-align: center">
			<n-button @click="resetForm">重 置</n-button>
			<n-button type="primary" style="margin-left: 20px" @click="submitData">提 交</n-button>
		</div>
	</div>
</template>

<script setup>
import request from "@/utils/request/request";
import FormRender from "@/component/form-render/index.vue";

const emits = defineEmits(["submitSuccess", "submitError"]);
const message = useMessage();
const props = defineProps({
	baseUrl: {
		type: String,
		required: true
	},
	/**
	 * 表单模板ID
	 */
	tempId: {
		type: String,
		required: true
	},
	/**
	 * 表单填写后保存全部数据的ID
	 */
	formAllId: {
		type: String
	},
	/**
	 * 表单填写后保存全部填写值的ID
	 */
	formValId: {
		type: String
	},
	/**
	 * 自定义传入的值
	 */
	value: {
		type: Object
	},
	/**
	 * 禁用表单
	 */
	disabled: {
		type: Boolean
	}
});
const formRenderRef = ref();
const visible = ref(true);
const formJson = ref(undefined);
const formValue = ref({});

/**
 * 重置表单
 */
const resetForm = () => {
	formRenderRef.value.reset();
};

/**
 * 提交表单，获取表单全部数据
 */
const submitData = () => {
	formRenderRef.value.getWidgetFormData().then(result => {
		const formDataJson = JSON.stringify({ ...formJson.value, formJson: result.widgetForm });
		request
			.post({
				url: `${props.baseUrl}/formValue/saveOrUpt`,
				data: {
					formAll: formDataJson,
					formValues: JSON.stringify({ ...result.model, _id: formJson.value.formValId })
				},
				customs: {
					isLoading: true,
					loadingText: "数据提交中..."
				}
			})
			.then(res => {
				if (res.success) {
					// eslint-disable-next-line no-underscore-dangle
					formJson.value._id = res.result.formAllId;
					formJson.value.formValId = res.result.formValId;
				} else {
					message.error("表单模板提交失败");
					emits("submitError", res);
				}
			})
			.catch(error => {
				message.error("submitError", error);
			});
	});
};

const getFormJson = () => {
	if (props.formValId && props.formAllId) {
		request
			.post({
				url: `${props.baseUrl}/formValue/getFormInfo`,
				data: { formAllId: props.formAllId, formValId: props.formValId },
				customs: {
					isLoading: true,
					loadingText: "数据获取中..."
				}
			})
			.then(res => {
				if (res.success) {
					visible.value = false;
					formJson.value = { ...res.result.formAllInfo };
					formValue.value = { ...res.result.formValInfo };
					nextTick(() => {
						visible.value = true;
					});
				} else {
					message.error("表单数据获取失败");
				}
			})
			.catch(() => {
				message.error("表单数据获取失败");
			});
	} else {
		request
			.post({
				url: `${props.baseUrl}/formTpl/getOne`,
				data: { id: props.tempId },
				customs: {
					isLoading: true,
					loadingText: "数据获取中..."
				}
			})
			.then(res => {
				if (res.success) {
					visible.value = false;
					// eslint-disable-next-line no-underscore-dangle
					formJson.value = { ...res.result, _id: undefined, tempId: res.result._id };
					nextTick(() => {
						visible.value = true;
					});
				} else {
					message.error("表单模板获取失败");
				}
			})
			.catch(() => {
				message.error("表单模板获取失败");
			});
	}
};

// w
watchEffect(() => {
	getFormJson();
});
</script>

<style scoped></style>
