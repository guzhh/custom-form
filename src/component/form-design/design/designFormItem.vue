<template>
	<div class="widget-item-container">
		<n-form-item
			class="widget-view"
			v-if="element"
			:key="element.key"
			:class="{ active: selectWidget?.key === element.key }"
			:rules="element.options.rules"
			:label="element.label"
			:show-require-mark="!config.hideRequiredMark && (element.options.rules ? element.options.rules.required : false)"
			:show-label="element.options.showLabel"
		>
			<!--   文字输入框   -->
			<template v-if="element.type === 'input'">
				<n-input
					:type="element.options.type"
					:size="config.size"
					v-model:value="value"
					:style="{ width: element.options.width }"
					:placeholder="element.options.placeholder"
					:maxlength="parseInt(element.options.maxlength)"
					:disabled="element.options.disabled"
					:clearable="element.options.allowClear"
					:round="element.options.round"
					:show-count="element.options.showCount"
					show-password-on="click"
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
			<!--   数字输入框   -->
			<template v-if="element.type === 'number'">
				<n-input-number
					:clearable="element.options.allowClear"
					v-model:value="value"
					:size="config.size"
					:style="{ width: element.options.width }"
					:max="element.options.max"
					:min="element.options.min"
					:placeholder="element.options.placeholder"
					:button-placement="element.options.buttonPlacement"
					:precision="element.options.precision"
					:disabled="element.options.disabled"
					:round="element.options.round"
				/>
			</template>

			<!--  单选框  -->
			<template v-if="element.type === 'radio'">
				<n-radio-group v-model:value="element.options.defaultValue" :size="config.size" :disabled="element.options.disabled">
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

			<!--   复选框   -->
			<template v-if="element.type === 'checkbox'">
				<n-checkbox-group
					v-model:value="element.options.defaultValue"
					:style="{ width: element.options.width }"
					:disabled="element.options.disabled"
				>
					<n-checkbox v-for="item of element.options.options" :key="item.value" :value="item.value">
						{{ element.options.showLabel ? item.label : item.value }}
					</n-checkbox>
				</n-checkbox-group>
			</template>

			<!--   时间选择器   -->
			<template v-if="element.type === 'time'">
				<n-time-picker
					:size="config.size"
					v-model:value="element.options.defaultValue"
					:placeholder="element.options.placeholder"
					:inputReadOnly="element.options.readonly"
					:clearable="element.options.allowClear"
					:format="element.options.format"
					:valueFormat="element.options.valueFormat"
					:disabled="element.options.disabled"
					:style="{ width: element.options.width }"
				/>
			</template>
			<!--  日期选择器  -->
			<template v-if="element.type === 'date'">
				<n-date-picker
					:size="config.size"
					v-model:value="element.options.defaultValue"
					:placeholder="element.options.placeholder"
					:inputReadOnly="element.options.readonly"
					:clearable="element.options.allowClear"
					:format="element.options.format"
					:type="element.options.type"
					:disabled="element.options.disabled"
					:style="{ width: element.options.width }"
				/>
			</template>

			<!--   评分   -->
			<template v-if="element.type === 'rate'">
				<n-rate
					v-model:value="element.options.defaultValue"
					:count="element.options.max"
					:allowHalf="element.options.allowHalf"
					:clearable="element.options.allowClear"
					:readonly="element.options.disabled"
				/>
			</template>

			<template v-if="element.type === 'select'">
				<n-select
					:size="config.size"
					v-model:value="element.options.defaultValue"
					:placeholder="element.options.placeholder"
					:filter-option="handleFilterOption"
					:clearable="element.options.allowClear"
					:filterable="element.options.filterable"
					:disabled="element.options.disabled"
					:options="element.options.options"
					:multiple="element.options.multiple"
					:label-field="element.options.props.label"
					:value-field="element.options.props.value"
					:style="{ width: element.options.width }"
				>
				</n-select>
			</template>

			<!--   开关   -->
			<template v-if="element.type === 'switch'">
				<n-switch
					:size="config.size"
					:checked-value="element.options.checkedValue"
					:unchecked-value="element.options.uncheckedValue"
					v-model:value="element.options.defaultValue"
					:disabled="element.options.disabled"
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
					v-model:value="element.options.defaultValue"
					:min="element.options.min"
					:max="element.options.max"
					:step="element.options.step"
					:range="element.options.range"
					:vertical="element.options.vertical"
					:reverse="element.options.reverse"
					:disabled="element.options.disabled"
					:style="{ width: element.options.width, height: element.options.height }"
				/>
			</template>

			<template v-if="element.type === 'color'">
				<n-color-picker
					v-model:value="element.options.defaultValue"
					:size="config.size"
					:modes="element.options.modes"
					:disabled="element.options.disabled"
					:show-alpha="element.options.showAlpha"
					:show-preview="element.options.showPreview"
					:placement="element.options.placement"
					:style="{ width: element.options.width }"
				/>
			</template>
		</n-form-item>

		<div class="widget-view-action" v-if="selectWidget?.key === element.key">
			<SvgIcon iconClass="copy" @click.stop="$emit('copy')" />
			<SvgIcon iconClass="delete" @click.stop="$emit('delete')" />
		</div>

		<div class="widget-view-drag" v-if="selectWidget?.key === element.key">
			<SvgIcon iconClass="move" className="drag-widget" />
		</div>
	</div>
</template>

<script>
import { useThemeVars } from "naive-ui";
import SvgIcon from "@/component/svg-icon/index.vue";

export default {
	name: "NaiveWidgetFormItem",
	mixins: [],
	components: { SvgIcon },
	props: {
		config: {
			type: Object,
			required: true
		},
		element: {
			type: Object,
			required: true
		},
		selectWidget: {
			type: Object
		},
		widgetForm: {
			type: Object
		}
	},
	emits: ["copy", "delete"],
	data() {
		return {};
	},
	computed: {
		value: {
			get() {
				return this.element.options.defaultValue;
			},
			set(val) {
				// eslint-disable-next-line vue/no-mutating-props
				this.element.options.defaultValue = val;
			}
		}
	},
	setup() {
		const themeVars = useThemeVars();
		const handleFilterOption = (input, option) => option.label.toLowerCase().includes(input);

		return {
			themeVars,
			pattern: ref(""),
			handleFilterOption
		};
	}
};
</script>

<style scoped lang="less">
.widget-item-container {
	position: relative;

	&:hover {
		background: #eafaef;
		//outline-offset: 0;
		//outline: 1px solid v-bind("themeVars.primaryColor");
		//.widget-view-drag {
		//	display: block;
		//}
	}

	.widget-view {
		background-color: rgba(236, 245, 255, 0.3);
		border: 1px dashed rgba(170, 170, 170, 0.7);
		margin: 2px;
		position: relative;
		padding: 5px;

		&:after {
			bottom: 0;
			display: block;
			left: 0;
			position: absolute;
			right: 0;
			top: 0;
		}

		&:hover {
			background: #eafaef;
			outline-offset: 0;
			outline: 1px solid v-bind("themeVars.warningColor");

			.widget-view-drag {
				display: block;
			}
		}

		&:hover.active {
			border: 1px solid v-bind("themeVars.warningColor");
			outline-offset: 0;
			outline: 2px solid v-bind("themeVars.warningColor");
		}
	}

	.widget-view.active {
		border: 1px solid v-bind("themeVars.warningColor");
		outline: 2px solid v-bind("themeVars.warningColor");
	}

	.widget-view-action {
		background: v-bind("themeVars.warningColor");
		bottom: 0px;
		height: 24px;
		line-height: 24px;
		position: absolute;
		left: 0px;
		padding: 0 5px;
		z-index: 10;

		::v-deep(.svg-icon) {
			color: #ffffff;
			cursor: move;
			font-size: 14px;
			margin: 0 5px;
		}
		::v-deep(.svg-icon) {
			cursor: pointer;
		}
	}

	.widget-view-drag {
		background: v-bind("themeVars.warningColor");
		height: 24px;
		right: 0px;
		line-height: 24px;
		position: absolute;
		padding: 0 5px;
		top: 0px;
		z-index: 10;
		::v-deep(.svg-icon) {
			color: #fff;
			cursor: move;
			font-size: 14px;
			margin: 0 5px;
		}
	}
}
</style>
