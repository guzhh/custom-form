<template>
	<n-form>
		<n-form-item label="表单布局">
			<n-tooltip trigger="hover">
				<template #trigger>
					<n-switch v-model:value="data.inline">
						<template #checked> 行内表单</template>
						<template #unchecked>普通表单</template>
					</n-switch>
				</template>
				推荐使用【栅格布局】实现行内表单
			</n-tooltip>
		</n-form-item>
		<n-form-item label="标签显示位置">
			<n-radio-group v-model:value="data.labelPlacement" button-style="solid" @change="changeLabelPlacement">
				<n-radio-button value="top">上</n-radio-button>
				<n-radio-button value="left">左</n-radio-button>
			</n-radio-group>
		</n-form-item>
		<n-form-item label="标签宽度">
			<n-radio-group v-model:value="labelWidthType" button-style="solid">
				<n-radio-button value="auto" :disabled="data.labelPlacement === 'left'">自动</n-radio-button>
				<n-radio-button value="custom" :disabled="data.labelPlacement === 'top'">自定义</n-radio-button>
			</n-radio-group>
			<n-input-number v-if="labelWidthType === 'custom'" v-model:value="data.labelWidth" />
		</n-form-item>
		<n-form-item label="标签对齐方式">
			<n-radio-group v-model:value="data.labelAlign" button-style="solid">
				<n-radio-button value="left">左对齐</n-radio-button>
				<n-radio-button value="right" :disabled="data.labelPlacement === 'left'">右对齐</n-radio-button>
			</n-radio-group>
		</n-form-item>

		<n-form-item label="组件尺寸">
			<n-radio-group v-model:value="data.size" button-style="solid">
				<n-radio-button value="large">大</n-radio-button>
				<n-radio-button value="medium">默认</n-radio-button>
				<n-radio-button value="small">小</n-radio-button>
			</n-radio-group>
		</n-form-item>
		<n-form-item label="隐藏必填标记">
			<n-switch v-model:value="data.hideRequiredMark">
				<template #checked> 隐藏</template>
				<template #unchecked> 显示</template>
			</n-switch>
		</n-form-item>
		<n-form-item label="必填星号的位置" v-if="!data.hideRequiredMark">
			<n-radio-group v-model:value="data.requireMarkPlacement" button-style="solid">
				<n-radio-button value="left">左</n-radio-button>
				<n-radio-button value="right">右</n-radio-button>
				<n-radio-button value="right-hanging">右侧悬停</n-radio-button>
			</n-radio-group>
		</n-form-item>
		<h4>自定义事件</h4>
		<n-form-item label="自定义函数">
			<n-button type="info" dashed @click="editTheCode">编辑代码</n-button>
		</n-form-item>
		<n-alert type="warning" style="margin-bottom: 10px">注意：此功能在设计状态时无效，可点击预览查看效果</n-alert>
	</n-form>
	<code-editing ref="codeEditingRef" @ok="codeOk"></code-editing>
</template>

<script setup>
import CodeEditing from "@/component/form-design/modal/codeEditing.vue";

defineOptions({ name: "formConfig" });
defineEmits(["update:config"]);

const codeEditingRef = ref();

const props = defineProps({
	config: {
		type: Object,
		required: true
	}
});

const data = ref(props.config); // 表单配置
const labelWidthType = ref("auto");

const changeLabelPlacement = () => {
	if (data.value.labelPlacement === "top") {
		labelWidthType.value = "auto";
		data.value.labelWidth = "auto";
	} else {
		labelWidthType.value = "custom";
		data.value.labelAlign = "left";
		data.value.labelWidth = 80;
	}
};

const codeOk = jsStr => {
	data.value.customFunc = jsStr;
};

const editTheCode = () => {
	codeEditingRef.value.show(data.value.customFunc);
};
</script>

<style scoped>
h4 {
	border-bottom: 1px solid #e1e1e1;
	padding-bottom: 10px;
	margin-bottom: 15px;
}
</style>
