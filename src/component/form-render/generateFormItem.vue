<template>
	<n-form-item
		v-if="element && element.options.show"
		:key="element.key"
		:label="element.label"
		:rule="element.options.rules"
		:show-require-mark="!config.hideRequiredMark && (element.options.rules ? element.options.rules.required : false)"
		:path="element.model"
		:show-label="element.options.showLabel"
	>
		<!--  输入框  -->
		<template v-if="element.type === 'input'">
			<n-input
				:type="element.options.type"
				:size="config.size"
				v-model:value="data"
				:style="{ width: element.options.width }"
				:placeholder="element.options.placeholder"
				:maxlength="parseInt(element.options.maxlength)"
				:disabled="disabled || element.options.disabled"
				:clearable="element.options.allowClear"
				:round="element.options.round"
				:show-count="element.options.showCount"
				show-password-on="click"
				@update:value="handleChange"
			>
				<template #prefix v-if="element.options.prefix">
					{{ element.options.prefix }}
				</template>
				<template #suffix v-if="element.options.suffix">
					{{ element.options.suffix }}
				</template>
				<template #count="{ value }">
					{{ value.length }}{{ element.options.maxlength ? " / " + element.options.maxlength : "" }}
				</template>
			</n-input>
		</template>

		<!--  数字输入框  -->
		<template v-if="element.type === 'number'">
			<n-input-number
				:clearable="element.options.allowClear"
				v-model:value="data"
				:size="config.size"
				:placeholder="element.options.placeholder"
				:style="{ width: element.options.width }"
				:max="element.options.max"
				:min="element.options.min"
				:button-placement="element.options.buttonPlacement"
				:precision="element.options.precision"
				:disabled="disabled || element.options.disabled"
				:round="element.options.round"
				@update:value="handleChange"
			/>
		</template>

		<!--  单选框  -->
		<template v-if="element.type === 'radio'">
			<n-radio-group
				v-model:value="data"
				:size="config.size"
				:disabled="disabled || element.options.disabled"
				@update:value="handleChange"
			>
				<n-space v-if="element.options.groupType === 'radioGroup'">
					<n-radio v-for="item of element.options.options" :key="item.value" :value="item.value">
						{{ element.options.showLabel ? item.label : item.value }}
					</n-radio>
				</n-space>
				<template v-if="element.options.groupType === 'buttonGroup'">
					<n-radio-button v-for="item of element.options.options" :key="item.value" :value="item.value">
						{{ element.options.showLabel ? item.label : item.value }}
					</n-radio-button>
				</template>
			</n-radio-group>
		</template>

		<!--  复选框  -->
		<template v-if="element.type === 'checkbox'">
			<n-checkbox-group
				v-model:value="data"
				:style="{ width: element.options.width }"
				:disabled="disabled || element.options.disabled"
				@update:value="handleChange"
			>
				<n-checkbox v-for="item of element.options.options" :key="item.value" :value="item.value">{{
					element.options.showLabel ? item.label : item.value
				}}</n-checkbox>
			</n-checkbox-group>
		</template>

		<!--  时间选择器  -->
		<template v-if="element.type === 'time'">
			<n-time-picker
				:size="config.size"
				v-model:value="data"
				:placeholder="element.options.placeholder"
				:inputReadOnly="element.options.readonly"
				:clearable="element.options.allowClear"
				:format="element.options.format"
				:valueFormat="element.options.valueFormat"
				:disabled="disabled || element.options.disabled"
				:style="{ width: element.options.width }"
				@update:value="handleChange"
			/>
		</template>
		<!--  日期选择器  -->
		<template v-if="element.type === 'date'">
			<n-date-picker
				:size="config.size"
				v-model:value="data"
				:placeholder="element.options.placeholder"
				:inputReadOnly="element.options.readonly"
				:clearable="element.options.allowClear"
				:format="element.options.format"
				:type="element.options.type"
				:disabled="disabled || element.options.disabled"
				:style="{ width: element.options.width }"
				@update:value="handleChange"
			/>
		</template>

		<!--  评分  -->
		<template v-if="element.type === 'rate'">
			<n-rate
				v-model:value="data"
				:count="element.options.max"
				:allowHalf="element.options.allowHalf"
				:clearable="element.options.allowClear"
				:readonly="disabled || element.options.disabled"
				@update:value="handleChange"
			/>
		</template>

		<!--  下拉选择  -->
		<template v-if="element.type === 'select'">
			<n-select
				:size="config.size"
				v-model:value="data"
				:placeholder="element.options.placeholder"
				:filter-option="handleFilterOption"
				:clearable="element.options.allowClear"
				:filterable="element.options.filterable"
				:disabled="disabled || element.options.disabled"
				:options="element.options.options"
				:multiple="element.options.multiple"
				:label-field="element.options.props.label"
				:value-field="element.options.props.value"
				:style="{ width: element.options.width }"
				@update:value="handleChange"
			>
			</n-select>
		</template>

		<!--  开关  -->
		<template v-if="element.type === 'switch'">
			<n-switch
				:size="config.size"
				v-model:value="data"
				@update:value="handleChange"
				:checked-value="element.options.checkedValue"
				:unchecked-value="element.options.uncheckedValue"
				:disabled="disabled || element.options.disabled"
			>
				<template #checked>
					{{ element.options.checkedChildren }}
				</template>
				<template #unchecked>
					{{ element.options.unCheckedChildren }}
				</template>
			</n-switch>
		</template>

		<!--  滑动选择   -->
		<template v-if="element.type === 'slider'">
			<n-slider
				v-model:value="data"
				:min="element.options.min"
				:max="element.options.max"
				:step="element.options.step"
				:range="element.options.range"
				:vertical="element.options.vertical"
				:reverse="element.options.reverse"
				:disabled="disabled || element.options.disabled"
				:style="{ width: element.options.width, height: element.options.height }"
			/>
		</template>

		<!--  颜色选择  -->
		<template v-if="element.type === 'color'">
			<n-color-picker
				v-model:value="data"
				:size="config.size"
				:modes="element.options.modes"
				:disabled="disabled || element.options.disabled"
				:show-alpha="element.options.showAlpha"
				:show-preview="element.options.showPreview"
				:placement="element.options.placement"
				:style="{ width: element.options.width }"
				@update:value="handleChange"
			/>
		</template>

		<template v-if="element.type === 'upload'">
			<n-upload
				:name="element.options.file"
				:action="element.options.action"
				:accept="element.options.accept"
				:max="element.options.maxCount"
				:defaultUpload="element.options.defaultUpload"
				:directory="element.options.directory"
				:directoryDnd="element.options.directoryDnd"
				:showDownloadButton="element.options.showDownloadButton"
				:showFileList="element.options.showFileList"
				:showRetryButton="element.options.showRetryButton"
				:showRemoveButton="element.options.showRemoveButton"
				:showCancelButton="element.options.showCancelButton"
				:showPreviewButton="element.options.showPreviewButton"
				:file-list="data"
				:listType="element.options.listType"
				:multiple="element.options.multiple"
				:disabled="disabled || element.options.disabled"
				@change="handleUploadChange"
			>
				<SvgIcon v-if="element.options.listType === 'image-card'" iconClass="insert" />
				<n-button v-else>
					<SvgIcon iconClass="img-upload" style="margin-right: 10px" />
					点击上传
				</n-button>
			</n-upload>
		</template>

		<template v-if="element.type === 'text'">
			<div :style="element.options.style">
				<span>{{ element.options.text }}</span>
			</div>
		</template>

		<template v-if="element.type === 'divider'">
			{{ element.options.vertical ? element.options.text : "" }}
			<n-divider
				:dashed="element.options.dashed"
				:title-placement="element.options.titlePlacement"
				:vertical="element.options.vertical"
			>
				{{ element.options.text }}
			</n-divider>
		</template>
		<template v-if="element.type === 'alert'">
			<n-alert
				:title="element.options.title"
				:type="element.options.type"
				:showIcon="element.options.showIcon"
				:closable="element.options.closable"
				:style="{ width: element.options.width, height: element.options.height }"
			>
				{{ element.options.content }}
			</n-alert>
		</template>
	</n-form-item>
</template>

<script>
import SvgIcon from "@/component/svg-icon/index.vue";
import { naiveui } from "@/config";

const message = useMessage();
const notification = useNotification();

export default {
	name: "generateFormItem",
	components: { SvgIcon },
	mixins: [],
	props: {
		widgetForm: {
			type: Object
		},
		config: {
			type: Object,
			required: true
		},
		element: {
			type: Object,
			required: true
		},
		model: {
			type: Object,
			required: true
		},
		disabled: {
			type: Boolean,
			required: true
		}
	},
	setup(props) {
		const data = computed({
			// get: () => 1,
			get: () => props.model[props.element.model],
			set: val => {
				// eslint-disable-next-line vue/no-mutating-props,no-param-reassign
				props.model[props.element.model] = val;
			}
		});

		const handleFilterOption = (input, option) => option.label.toLowerCase().includes(input);

		/**
		 * 对change事件执行自定义方法
		 * @param event
		 * @returns {*}
		 */
		const handleChange = event => {
			const widgetFormKey = "widgetForm";
			const widgetForm = props[widgetFormKey];
			// eslint-disable-next-line no-restricted-syntax
			for (const key in naiveui.widgetForm) {
				// eslint-disable-next-line no-prototype-builtins
				if (naiveui.widgetForm.hasOwnProperty(key)) {
					if (typeof naiveui.widgetForm[key] === "function") {
						widgetForm[key] = naiveui.widgetForm[key];
					}
				}
			}
			// eslint-disable-next-line no-new-func
			const customFn = new Function("form", "view", "message", "notification", "e", props.element.options.change);
			return customFn.call(this, props.model, props.widgetForm, message, notification, event);
		};

		/**
		 * 上传的change事件
		 * @param fileList
		 */
		const handleUploadChange = ({ fileList }) => {
			data.value = fileList;
		};
		return { data, handleChange, handleFilterOption, handleUploadChange };
	}
};
</script>

<style scoped></style>
