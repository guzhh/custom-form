<template>
	<n-form-item label="是否可搜索">
		<n-switch checked-children="是" un-checked-children="否" v-model:value="data.options.filterable">
			<template #checked> 是 </template>
			<template #unchecked> 否 </template>
		</n-switch>
	</n-form-item>
	<n-form-item label="模式">
		<n-radio-group button-style="solid" v-model:value="data.options.multiple" @update:value="handleSelectModeChange">
			<n-radio-button :value="false">单选</n-radio-button>
			<n-radio-button :value="true">多选</n-radio-button>
		</n-radio-group>
	</n-form-item>
	<n-form-item>
		<template #label>
			选项
			<n-tooltip trigger="hover">
				<template #trigger>
					<n-icon size="18">
						<SvgIcon iconClass="question" style="margin-right: 10px" />
					</n-icon>
				</template>
				选项分值只有在选择框为单选时才会参与计算表单得分
			</n-tooltip>
		</template>
		<div>
			<!--			<n-radio-group button-style="solid" v-model:value="data.options.remote">-->
			<!--				<n-radio-button :value="false">静态数据</n-radio-button>-->
			<!--				<n-radio-button :value="true">远端数据</n-radio-button>-->
			<!--			</n-radio-group>-->
			<n-space v-if="data.options.remote" direction="vertical" style="margin-top: 10px">
				<n-input-group>
					<n-input-group-label>远端方法</n-input-group-label>
					<n-input v-model:value="data.options.remoteFunc" />
				</n-input-group>

				<n-input-group>
					<n-input-group-label>标签</n-input-group-label>
					<n-input v-model:value="data.options.props.label" />
				</n-input-group>

				<n-input-group>
					<n-input-group-label>值</n-input-group-label>
					<n-input v-model:value="data.options.props.value" />
				</n-input-group>
			</n-space>
			<template v-else>
				<n-checkbox-group v-if="data.options.multiple" v-model:value="data.options.defaultValue" style="margin-top: 10px">
					<n-dynamic-input v-model:value="data.options.options" :on-create="handleInsertOption" show-sort-button>
						<template #default="{ value }">
							<div style="display: flex; align-items: center; width: 100%">
								<n-checkbox :value="value.value" style="margin-right: 5px" />
								<n-input v-model:value="value.label" type="text" style="width: 100px" placeholder="选项名" />
								<n-input v-model:value="value.value" type="text" placeholder="选项值" style="width: 100px" />
								<n-input-number v-model:value="value.score" placeholder="选项分值" style="width: 100px" min="0" :precision="0" />
							</div>
						</template>
					</n-dynamic-input>
				</n-checkbox-group>
				<n-radio-group v-else v-model:value="data.options.defaultValue" style="margin-top: 10px">
					<n-dynamic-input v-model:value="data.options.options" :on-create="handleInsertOption" show-sort-button>
						<template #default="{ value }">
							<div style="display: flex; align-items: center; width: 100%">
								<n-radio :value="value.value" style="margin-right: 5px" />
								<n-input v-model:value="value.label" type="text" style="width: 100px" placeholder="选项名" />
								<n-input v-model:value="value.value" type="text" placeholder="选项值" style="width: 100px" />
								<n-input-number v-model:value="value.score" placeholder="选项分值" style="width: 100px" min="0" :precision="0" />
							</div>
						</template>
					</n-dynamic-input>
				</n-radio-group>
			</template>
		</div>
	</n-form-item>
	<n-form-item label="显示属性">
		<n-checkbox v-model:checked="data.options.showLabel">显示标签 </n-checkbox>
	</n-form-item>
	<n-form-item label="操作属性">
		<n-checkbox v-model:checked="data.options.rules.required">必填 </n-checkbox>
		<n-checkbox v-model:checked="data.options.disabled">禁用 </n-checkbox>
		<n-checkbox v-model:checked="data.options.allowClear">清除 </n-checkbox>
	</n-form-item>
</template>

<script setup>
import SvgIcon from "@/component/svg-icon/index.vue";

defineOptions({ name: "SelectWidget" });
const props = defineProps({
	select: {
		type: Object
	}
});
const emits = defineEmits(["update:select"]);

const data = ref(props.select);

watch(
	() => props.select,
	val => {
		data.value = val;
	}
);
watch(data, val => emits("update:select", val));
const handleSelectModeChange = value => {
	// 如果是单选
	if (!value) {
		// 则表单项类型为数组
		data.value.options.rules.type = "string";
		// 判断是否默认值是否有length属性，如果有则默认值区第一个，如果没有则设为null
		// eslint-disable-next-line no-unused-expressions
		data.value.options.defaultValue?.length
			? // eslint-disable-next-line prefer-destructuring
			  (data.value.options.defaultValue = data.value.options.defaultValue[0])
			: (data.value.options.defaultValue = null);
	} else {
		// 如果是多选 则吧表单项类型设置为数组
		data.value.options.rules.type = "array";
		// 判断默认值是否有
		if (data.value.options.defaultValue) {
			// 判断默认值是否为数组
			if (!(data.value.options.defaultValue instanceof Array)) {
				// 如果不是则转为数组
				data.value.options.defaultValue = [data.value.options.defaultValue];
			}
		} else {
			data.value.options.defaultValue = [];
		}
	}
};

handleSelectModeChange(data.value.options.multiple);

const handleInsertOption = () => {
	const length = data.value.options.options.length + 1;
	return {
		label: `选项 ${length}`,
		value: `选项 ${length}`,
		score: 0
	};
};
</script>

<style scoped lang="less">
:deep(.n-dynamic-input .n-dynamic-input-item .n-dynamic-input-item__action) {
	margin: 0 0 0 10px;
}
</style>
