<template>
	<n-form
		ref="generateForm"
		:model="state.model"
		:rules="state.rules"
		:inline="state.widgetForm.config.inline"
		:labelAlign="state.widgetForm.config.labelAlign"
		:label-placement="state.widgetForm.config.labelPlacement"
		:labelWidth="state.widgetForm.config.labelWidth"
		:require-mark-placement="state.widgetForm.config.requireMarkPlacement"
		:show-require-mark="!state.widgetForm.config.hideRequiredMark"
		:show-label="state.widgetForm.config.showLabel"
	>
		<template v-for="(element, index) of state.widgetForm.list">
			<template v-if="element.type === 'grid' && element.options.show">
				<n-grid
					v-if="element.key"
					:key="element.key"
					:x-gap="element.options.xGap ?? 0"
					:y-gap="element.options.yGap ?? 0"
					:cols="element.options.cols ?? 24"
					:collapsed="element.options.collapsed"
					:collapsed-rows="element.options.collapsedRows"
					:responsive="element.options.responsive"
					:item-responsive="element.options.itemResponsive"
				>
					<n-gi v-for="(col, colIndex) of element.columns" :key="colIndex" :span="col.span ?? 0">
						<GenerateFormItem
							v-for="colItem of col.list"
							:model="state.model"
							:key="colItem.key"
							:element="colItem"
							:config="data.config"
							:disabled="disabled"
							:widgetForm="state.widgetForm"
						/>
					</n-gi>
				</n-grid>
			</template>
			<GenerateFormItem
				v-else
				:widgetForm="state.widgetForm"
				:model="state.model"
				:key="element.key"
				:element="state.widgetForm.list[index]"
				:config="data.config"
				:disabled="disabled"
			/>
		</template>
	</n-form>
</template>

<script setup>
import { naiveui } from "@/config";
import GenerateFormItem from "./generateFormItem.vue";

const props = defineProps({
	data: {
		type: Object,
		default: naiveui.widgetForm
	},
	value: {
		type: Object
	},
	disabled: {
		type: Boolean,
		default: false
	}
});
const message = useMessage();
const generateForm = ref();
const formJson = (props.data && JSON.parse(JSON.stringify(props.data))) ?? naiveui.widgetForm;
// 将 naiveui.widgetForm 上的函数放入 formJson上，因为formJson被json化后方法消失了
Object.keys(naiveui.widgetForm).forEach(key => {
	// 判断当前方法是否有，并且是函数
	if (naiveui.widgetForm.hasOwnProperty.call(key) && typeof naiveui.widgetForm[key] === "function") {
		formJson[key] = naiveui.widgetForm[key];
	}
});

const state = reactive({
	model: {},
	rules: {},
	widgetForm: formJson
});

// 生成表单项字段以及校验规则
const generateModel = list => {
	for (let index = 0; index < list.length; index++) {
		console.log("------------", list[index]);
		const { model } = list[index];
		// 判断是否存在绑定key
		if (!model) {
			return;
		}
		// 判断是否是否是栅格组件
		if (list[index].type === "grid") {
			// 如果是则递归调用
			list[index].columns.forEach(col => generateModel(col.list));
		} else {
			// 判断绑定的value数据是否有当前字段
			if (props.value && Object.keys(props.value).includes(model)) {
				// 如果有则赋初值
				state.model[model] = props.value[model];
			} else {
				// 如果没有则将默认值附上
				state.model[model] = list[index].options.defaultValue;
			}
			state.rules[model] = list[index].options.rules;
		}
	}
	console.log("rules=", state.rules);
};

/**
 * 为远端获取
 * 生成下拉选择等有选择项的组件选择项
 * @param list
 */
const generateOptions = list => {
	list.forEach(item => {
		if (item.type === "grid") {
			item.columns.forEach(col => generateOptions(col.list));
		} else if (item.options.remote && item.options.remoteFunc) {
			// 请求配置的接口地址
			fetch(item.options.remoteFunc)
				.then(resp => resp.json())
				.then(json => {
					if (json instanceof Array) {
						// eslint-disable-next-line no-param-reassign
						item.options.remoteOptions = json.map(data => ({
							label: data[item.options.props.label],
							value: data[item.options.props.value],
							children: data[item.options.props.children]
						}));
					}
				});
		}
	});
};

watch(
	() => props.data,
	val => {
		// 当新传递过来的json数据没有或者有问题是使用默认的
		state.widgetForm.value = (val && JSON.parse(JSON.stringify(val))) ?? naiveui.widgetForm;
		state.model.value = {}; // 当传递过来的json发生变化时将表单数据项清空
		state.rules.value = {}; // 当传递过来的json发生变化时将表单验证规则清空
		generateModel(state.widgetForm.list);
		generateOptions(state.widgetForm.list);
	},
	{ deep: true, immediate: true }
);

onMounted(() => {
	generateModel(state.widgetForm?.list ?? []);
	generateOptions(state.widgetForm?.list ?? []);
});

/**
 * 重置表单
 */
const reset = () => {
	generateForm.value?.restoreValidation();
};

/**
 * 校验表单并获取表单填写的值
 * @returns {Promise<unknown>}
 */
const getData = () => {
	return new Promise((resolve, reject) => {
		generateForm.value
			?.validate(errors => {
				console.log("errors=", errors);
				if (!errors) {
					resolve(state.model);
				} else {
					reject(new Error("验证失败"));
				}
			})
			.catch(error => {
				reject(error);
			});
	});
};

const setWidgetFormData = list => {
	for (let index = 0; index < list.length; index++) {
		const { model } = list[index];
		// 判断是否存在绑定key
		if (!model) {
			return;
		}
		// 判断是否是否是栅格组件
		if (list[index].type === "grid") {
			// 如果是则递归调用
			list[index].columns.forEach(col => generateModel(col.list));
		} else {
			// eslint-disable-next-line no-param-reassign
			list[index].options.defaultValue = state.model[model];
		}
	}
};

/**
 * 获取整个表单渲染json,并且包含填写的值
 * @returns {Promise<unknown>}
 */
const getWidgetFormData = () => {
	return new Promise((resolve, reject) => {
		generateForm.value
			?.validate(errors => {
				console.log("errors=", errors);
				if (!errors) {
					setWidgetFormData(state.widgetForm?.list ?? []);
					resolve(JSON.stringify(state.widgetForm));
				} else {
					reject(new Error("验证失败"));
				}
			})
			.catch(error => {
				reject(error);
			});
	});
};

defineExpose({ getData, reset, getWidgetFormData });
</script>

<style scoped></style>
