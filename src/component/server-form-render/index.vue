<template>
	<div style="width: 100%">
		<form-render
			:value="formValue"
			:disabled="disabled"
			v-if="visible && formJson"
			ref="formRenderRef"
			:data="formJson.formJson"
			@mounted="renderSuccess"
		></form-render>
		<div style="width: 100%; text-align: center" v-if="!customSubmit">
			<n-button @click="resetForm">重 置</n-button>
			<n-button type="primary" style="margin-left: 20px" @click="submitData">提 交</n-button>
		</div>
	</div>
</template>

<script setup>
import request from "@/utils/request/request";
import FormRender from "@/component/form-render/index.vue";

const emits = defineEmits(["submitSuccess", "submitError", "mounted", "beforeSubmit"]);
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
		type: String
	},

	/**
	 * 表单提交后返回的 表单填写后保存全部数据的ID：formAllId、表单填写后保存全部填写值的ID：formValId
	 * 格式：{ formAllId: '', formValId: '' }
	 */
	formData: {
		type: Object
	},
	// /**
	//  * 表单填写后保存全部数据的ID
	//  */
	// formAllId: {
	// 	type: String
	// },
	// /**
	//  * 表单填写后保存全部填写值的ID
	//  */
	// formValId: {
	// 	type: String
	// },
	/**
	 * 自定义传入的值
	 */
	params: {
		type: Object
	},
	/**
	 * 禁用表单
	 */
	disabled: {
		type: Boolean
	},
	/**
	 * 是否自定义提交按钮
	 */
	customSubmit: {
		type: Boolean
	}
});
const formRenderRef = ref();
const visible = ref(false);
const formJson = ref(undefined);
const formValue = ref({ ...props.params });

/**
 * 执行自定义方法
 * @returns {any}
 */
const executeustomFunc = () => {
	return formRenderRef.value.executeustomFunc();
};

/**
 * 表单渲染完成
 */
const renderSuccess = () => {
	console.log("-------表单渲染完成-------");
	// 调用自定义方法
	const result = formRenderRef.value.mountedFunc();
	emits("mounted", result);
};

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
	formRenderRef.value.getWidgetFormData().then(() => {
		// 调用表单提交前函数
		const resultData = formRenderRef.value.beforeSubmit();
		formRenderRef.value.getWidgetFormData().then(result => {
			emits("beforeSubmit", resultData); // 抛出表单提交前方法
			//
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
						// 调用表单提交后函数
						const data = formRenderRef.value.afterSubmit();
						// 提交成功后回调方法
						emits("submitSuccess", {
							submitData: res.result,
							funcData: data
						}); // 抛出表单提交后方法
					} else {
						message.error("表单模板提交失败");
						// 调用表单提交后函数
						const data = formRenderRef.value.afterSubmit();
						emits("submitError", {
							errorData: res,
							funcData: data
						});
					}
				})
				.catch(error => {
					message.error("表单模板提交失败");
					// 调用表单提交后函数
					const data = formRenderRef.value.afterSubmit();
					emits("submitError", {
						errorData: error,
						funcData: data
					});
				});
		});
	});
};

/**
 * 获取表单渲染数据
 */
const getFormJson = () => {
	if (props?.formData?.formValId && props?.formData?.formAllId) {
		request
			.post({
				url: `${props.baseUrl}/formValue/getFormInfo`,
				data: { formAllId: props.formData.formAllId, formValId: props.formData.formValId },
				customs: {
					isLoading: true,
					loadingText: "数据获取中..."
				}
			})
			.then(res => {
				if (res.success) {
					visible.value = false;
					formJson.value = { ...res.result.formAllInfo };
					formValue.value = { ...res.result.formValInfo, ...props.params };
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
	} else if (props.tempId) {
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
	} else {
		throw new Error("模板ID tempId 和 表单填写值ID formData 必须传递一个， formData格式为：{ formAllId: '', formValId: '' }");
	}
};

// w
watchEffect(() => {
	getFormJson();
});

defineExpose({ executeustomFunc, resetForm, submitData });
</script>

<style scoped></style>
