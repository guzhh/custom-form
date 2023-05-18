<template>
	<div style="display: flex; justify-content: space-between; height: 100%">
		<n-card
			size="small"
			title="组件"
			header-style="padding: 7px;"
			style="width: 200px; margin-right: 5px; flex-shrink: 0"
			content-style="overflow: auto; padding: 8px 0 8px 8px;"
			:style="{ height: `100%` }"
			:segmented="{ content: true }"
		>
			<n-scrollbar>
				<component-group title="基础组件" :fields="basicFields" :list="naiveui.basicComponents" />
				<!--				<ComponentGroup title="高级组件" :fields="advanceFields" :list="naiveui.advanceComponents" />-->
				<ComponentGroup title="布局组件" :fields="layoutFields" :list="naiveui.layoutComponents" />
				<ComponentGroup title="其他组件" :fields="otherFields" :list="naiveui.otherComponents" />
			</n-scrollbar>
		</n-card>
		<n-card
			size="small"
			title="设计器"
			header-style="padding: 7px;"
			content-style="overflow: auto;"
			:style="{ height: `100%` }"
			:segmented="{ content: true }"
		>
			<template #header-extra>
				<n-button text @click="handleGenerateJson"> {{ saveText ? saveText : "生成JSON" }} </n-button>
				<n-button text @click="exportJSON" style="margin-left: 20px"> 导出JSON </n-button>
				<n-button text @click="previewTheForm" style="margin-left: 20px"> 预览表单 </n-button>
			</template>
			<design-form v-model:widget-form="state.widgetForm" v-model:widgetFormSelect="state.widgetFormSelect" />
		</n-card>
		<n-card
			size="small"
			content-style="padding: 0; overflow: auto;"
			style="margin-left: 5px; width: 500px; flex-shrink: 0"
			:style="{ height: `100%` }"
		>
			<n-tabs type="line" :tabs-padding="20" pane-style="padding: 20px;" default-value="form">
				<n-tab-pane name="widget" tab="字段属性">
					<DesignConfig v-model:select="state.widgetFormSelect" />
				</n-tab-pane>
				<n-tab-pane name="form" tab="表单属性">
					<form-config v-model:config="widgetForm.config"></form-config>
				</n-tab-pane>
			</n-tabs>
		</n-card>
		<!--    <base-modal :show="" title=""/>-->
		<form-preview ref="formPreviewRef" />
	</div>
</template>

<script setup>
import { merge } from "lodash";
import { naiveui } from "@/config";
import ComponentGroup from "./components/componentGroup.vue";
import FormConfig from "./components/formConfig.vue";
import { getWidgetForm } from "@/component/form-design/utils";
import DesignForm from "./design/designForm.vue";
import DesignConfig from "./design/designConfig.vue";
import FormPreview from "./modal/formPreview.vue";

defineOptions({ name: "FormDesign" });

const emits = defineEmits(["ok"]);

const props = defineProps({
	widgetFormJson: {
		type: String,
		required: false
	},
	saveText: {
		type: String
	}
});
// 基础组件
const basicFields = ["input", "number", "radio", "checkbox", "time", "date", "rate", "select", "switch", "slider", "color"];
// 高级组件
// const advanceFields = ["upload"];
// 布局组件
const layoutFields = ["grid"];
// 其他组件
const otherFields = ["text", "alert", "divider"];
// 表单预览组件
const formPreviewRef = ref();

// 当前操作主要是为了拿出naiveui config配置中的widgetForm，并将其中的函数也拿出来，之后在修改widgetForm是不影响naiveui config
const widgetForm = getWidgetForm();

const state = reactive({
	widgetForm, // 这个地方通过引用类型的特性，之后在修改widgetForm是同时也会修改state.widgetForm
	widgetFormSelect: undefined // 当前选中的表单项配置
});

const setJson = json => {
	state.widgetForm.list = [];
	merge(state.widgetForm, json);
	if (json.list.length) {
		// eslint-disable-next-line prefer-destructuring
		state.widgetFormSelect = json.list[0];
	}
};

const getJson = () => state.widgetForm;

/**
 * json导入
 * @param jsonEg
 */
const handleUploadJson = jsonEg => {
	try {
		setJson(JSON.parse(jsonEg));
	} catch (e) {
		throw new Error("传入的json表单数据有问题，请检查");
	}
};

onMounted(() => {
	if (props.widgetFormJson && props.widgetFormJson !== "") {
		handleUploadJson(props.widgetFormJson);
	}
});

// 生成json
const handleGenerateJson = () => {
	// console.log(JSON.stringify(state.widgetForm, null, 2));
	// message.info("生成的json已打印到控制台请在控制台查看");
	emits("ok", state.widgetForm);
};
// 导出JSON
const exportJSON = () => {
	const blob = new Blob([JSON.stringify(state.widgetForm, null, 2)]);
	const a = document.createElement("a");
	const url = window.URL.createObjectURL(blob);
	a.href = url;
	a.download = "form.json";
	a.click();
};

// 预览表单
const previewTheForm = () => {
	formPreviewRef.value.open(JSON.parse(JSON.stringify(state.widgetForm)));
};

defineExpose({ getJson });
</script>

<style scoped></style>
