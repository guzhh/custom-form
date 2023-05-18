<template>
	<n-form layout="vertical" v-if="data" :key="data.key">
		<n-form-item label="字段标识" v-if="data.type !== 'grid' && data.type !== 'collapse'">
			<n-input v-model:value="data.model" />
		</n-form-item>

		<n-form-item label="标题" v-if="data.type !== 'grid' && data.options.showLabel">
			<n-input v-model:value="data.label" />
		</n-form-item>

		<n-form-item label="宽度" v-if="hasKey('width')">
			<n-input v-model:value="data.options.width" />
		</n-form-item>

		<n-form-item label="高度" v-if="hasKey('height')">
			<n-input v-model:value="data.options.height" />
		</n-form-item>

		<n-form-item label="占位内容" v-if="hasKey('placeholder')">
			<n-input v-model:value="data.options.placeholder" />
		</n-form-item>
		<n-form-item v-if="hasKey('show')">
			<template #label>
				显示
				<n-tooltip trigger="hover">
					<template #trigger>
						<n-icon size="18">
							<SvgIcon iconClass="question" style="margin-right: 10px" />
						</n-icon>
					</template>
					是否在表单渲染器中显示<br />注意该属性在表单设计时不起作用，具体可在预览界面查看
				</n-tooltip>
			</template>
			<n-checkbox v-model:checked="data.options.show">显示</n-checkbox>
		</n-form-item>
		<!--		当前使用组件{{ data.type }} <br />是否有该元素 {{ checkComponent(data.type) }}-->
		<component v-if="checkComponent(data.type)" :is="componentsMap[data.type]" :select="data" />

		<template v-if="hasKey('rules')">
			<h4>验证规则</h4>

			<n-form-item label="触发时机">
				<n-radio-group v-model:value="data.options.rules.trigger" button-style="solid">
					<n-radio-button value="blur">Blur</n-radio-button>
					<n-radio-button value="change">Change</n-radio-button>
					<n-radio-button value="all">All</n-radio-button>
				</n-radio-group>
			</n-form-item>

			<n-form-item label="枚举类型">
				<n-input v-model:value="data.options.rules.enum" />
			</n-form-item>
			<n-form-item label="校验文案">
				<n-input v-model:value="data.options.rules.message" />
			</n-form-item>

			<n-form-item label="正则表达式">
				<n-input v-model:value="data.options.rules.pattern" />
			</n-form-item>

			<n-form-item label="校验类型">
				<n-select v-model:value="data.options.rules.type" :options="verifyOptions"></n-select>
			</n-form-item>
		</template>
	</n-form>
</template>

<script setup>
import Grid from "../configs/Grid.vue";
import Input from "../configs/Input.vue";
import Number from "../configs/Number.vue";
import Radio from "../configs/Radio.vue";
import Checkbox from "../configs/Checkbox.vue";
import Time from "../configs/Time.vue";
import Date from "../configs/Date.vue";
import Rate from "../configs/Rate.vue";
import Select from "../configs/Select.vue";
import Switch from "../configs/Switch.vue";
import Slider from "../configs/Slider.vue";
import Color from "../configs/Color.vue";
import Upload from "../configs/Upload.vue";
import Text from "../configs/Text.vue";
import Divider from "../configs/Divider.vue";
import Alert from "../configs/Alert.vue";
import { checkComponent } from "../enums";
import SvgIcon from "@/component/svg-icon/index.vue";

const emits = defineEmits(["update:select"]);

const props = defineProps({
	select: { type: Object }
});

const componentsMap = {
	grid: Grid,
	input: Input,
	number: Number,
	radio: Radio,
	checkbox: Checkbox,
	time: Time,
	date: Date,
	rate: Rate,
	select: Select,
	switch: Switch,
	slider: Slider,
	color: Color,
	upload: Upload,
	text: Text,
	divider: Divider,
	alert: Alert
};

const data = ref(props.select);

watch(
	() => props.select,
	val => {
		data.value = val;
	}
);

watch(data, val => emits("update:select", val));

const verifyOptions = [
	{ label: "字符串", value: "string" },
	{ label: "数字", value: "number" },
	{ label: "布尔值", value: "boolean" },
	{ label: "方法", value: "method" },
	{ label: "正则表达式", value: "regexp" },
	{ label: "整数", value: "integer" },
	{ label: "浮点数", value: "float" },
	{ label: "数组", value: "array" },
	{ label: "对象", value: "object" },
	{ label: "枚举", value: "enum" },
	{ label: "日期", value: "date" },
	{ label: "URL地址", value: "url" },
	{ label: "十六进制", value: "hex" },
	{ label: "邮箱地址", value: "email" },
	{ label: "任意类型", value: "any" },
	{ label: "无类型", value: undefined }
];

// 判断表单元素是否需要某个配置字段
const hasKey = key => Object.keys(data.value.options).includes(key);
</script>

<style lang="less" scoped>
h4 {
	border-bottom: 1px solid #e1e1e1;
	padding-bottom: 10px;
	margin-bottom: 15px;
}
</style>
