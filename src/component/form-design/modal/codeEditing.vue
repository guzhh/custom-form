<template>
	<base-modal
		style="width: 1000px"
		title="代码编辑"
		subBtuText="保存代码"
		v-model:show="visible"
		@close="handleClose"
		@ok="handleOk"
		@window-change="windowChange"
	>
		<n-alert type="info" style="margin-bottom: 10px">
			<n-space>
				使用示例
				<n-button text type="primary" @click="setTestEvent('dynamicDisabled')">动态禁用/启用</n-button>
				<n-button text type="primary" @click="setTestEvent('dynamicSetValue')">动态赋值</n-button>
				<n-button text type="primary" @click="setTestEvent('dynamicRequired')">必填项修改</n-button>
				<n-button text type="primary" @click="setTestEvent('dynamicHideLabel')">Label动态显隐</n-button>
				<n-button text type="primary" @click="setTestEvent('dynamicGetPoints')">获取表单项得分</n-button>
				<n-button text type="primary" @click="setTestEvent('dynamicGetTotalScore')">获取表单总得分</n-button>
				(提示：仅支持Javascript语法)
			</n-space>
		</n-alert>
		<div class="code-bord">
			function {{ eventType }}(view,form,message,notification){
			<n-tooltip trigger="hover">
				<template #trigger>
					<n-icon size="18">
						<SvgIcon iconClass="question" style="margin-right: 10px" />
					</n-icon>
				</template>
				view：视图组件信息（<a href="https://www.npmjs.com/package/@guzhh/custom-form" target="_blank" style="color: #2878fc"
					>更多操作查看</a
				>）<br />
				form：表单填写的信息<br />
				message：naive-ui 信息 Message （<a
					href="https://www.naiveui.com/zh-CN/os-theme/components/message"
					target="_blank"
					style="color: #2878fc"
					>更多操作查看</a
				>）<br />
				notification：naive-ui 通知 Notification （<a
					href="https://www.naiveui.com/zh-CN/os-theme/components/notification"
					target="_blank"
					style="color: #2878fc"
					>更多操作查看</a
				>）<br />
			</n-tooltip>
		</div>
		<CodeEditor style="height: calc(100% - 120px)" v-model:value="jsStr" language="javascript" v-if="isShowCode" />
		<div class="code-bord">}</div>
	</base-modal>
</template>

<script setup>
import BaseModal from "@/component/BaseModal/index.vue";
import CodeEditor from "@/component/CodeEditor/index.vue";
import SvgIcon from "@/component/svg-icon/index.vue";

defineOptions({ name: "codeEditing" });

const emits = defineEmits(["ok"]);
const isShowCode = ref(true);
const visible = ref(false);
const jsStr = ref("");
const eventType = ref("customFunc");

const windowChange = () => {
	isShowCode.value = false;
	nextTick(() => {
		isShowCode.value = true;
	});
};

const show = code => {
	jsStr.value = code;
	visible.value = true;
};

const handleClose = () => {
	jsStr.value = "";
	visible.value = false;
};

const handleOk = () => {
	emits("ok", jsStr.value);
	handleClose();
};

const setTestEvent = type => {
	console.log(type);
	let code = "";
	switch (type) {
		case "dynamicDisabled":
			code = "let widget = view.getWidget('字段标识')\nif (widget){\n  widget.options.disabled = !widget.options.disabled\n}";
			break;
		case "dynamicHideLabel":
			code = "let widget = view.getWidget('字段标识')\nif (widget){\n  widget.options.showLabel = false\n}";
			break;
		case "dynamicSetValue":
			code = `form['字段标识'] = '新值'`;
			break;
		case "dynamicRequired":
			code = "let widget = view.getWidget('字段标识')\nif (widget){\n  widget.options.rules.required = true\n }";
			break;
		case "dynamicGetPoints":
			code = `let score = view.getWidgetScores('字段标识')`;
			break;
		case "dynamicGetTotalScore":
			code = `let totalScore = view.getTheTotalScore()`;
			break;
		default:
			console.log(type);
	}
	jsStr.value = code;
};

defineExpose({ show });
</script>

<style scoped>
.code-bord {
	color: #7b7979;
	background: #e8e8e8;
	font-size: 16px;
	padding-left: 5px;
}
</style>
