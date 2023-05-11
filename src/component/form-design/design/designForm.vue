<template>
	<div class="widget-form-container">
		<n-form
			:inline="widgetForm.config.inline"
			:labelAlign="widgetForm.config.labelAlign"
			:label-placement="widgetForm.config.labelPlacement"
			:labelWidth="widgetForm.config.labelWidth"
			:show-require-mark="!widgetForm.config.hideRequiredMark"
			:require-mark-placement="widgetForm.config.requireMarkPlacement"
			:show-label="widgetForm.config.showLabel"
		>
			<Draggable
				class="widget-form-list"
				item-key="key"
				ghostClass="ghost"
				handle=".drag-widget"
				:animation="200"
				:group="{ name: 'people' }"
				:list="widgetForm.list"
				@add="handleMoveAdd"
			>
				<template #item="{ element, index }">
					<transition-group name="fade" tag="div">
						<template v-if="element.type === 'grid'">
							<n-grid
								v-if="element.key"
								:key="element.key"
								:class="{ active: widgetFormSelect?.key === element.key }"
								:x-gap="element.options.xGap ?? 0"
								:y-gap="element.options.yGap ?? 0"
								:cols="element.options.cols ?? 24"
								:collapsed="element.options.collapsed"
								:collapsed-rows="element.options.collapsedRows"
								:responsive="element.options.responsive"
								:item-responsive="element.options.itemResponsive"
								@click="handleItemClick(element)"
								class="widget-col widget-view"
							>
								<n-gi v-for="(col, colIndex) of element.columns" :key="colIndex" :span="col.span ?? 0">
									<Draggable
										class="widget-col-list"
										item-key="key"
										ghostClass="ghost"
										handle=".drag-widget"
										:animation="200"
										:group="{ name: 'people' }"
										:no-transition-on-drag="true"
										:list="col.list"
										@add="handleColMoveAdd($event, element, colIndex)"
									>
										<template #item="{ element, index }">
											<DesignFormItem
												v-if="element.key"
												:key="element.key"
												:element="element"
												:config="widgetForm.config"
												:selectWidget="widgetFormSelect"
												@click.stop="handleItemClick(element)"
												@copy="handleCopyClick(index, col.list)"
												@delete="handleDeleteClick(index, col.list)"
											/>
										</template>
									</Draggable>
									<div class="widget-view-action widget-col-action" v-if="widgetFormSelect?.key === element.key">
										<SvgIcon iconClass="delete" class-name="delete" @click.stop="handleDeleteClick(index, widgetForm.list)" />
									</div>

									<div class="widget-view-drag widget-col-drag" v-if="widgetFormSelect?.key === element.key">
										<SvgIcon iconClass="move" className="drag-widget" />
									</div>
								</n-gi>
							</n-grid>
						</template>
						<template v-else>
							<DesignFormItem
								:widgetForm="widgetForm"
								v-if="element.key"
								:key="element.key"
								:element="element"
								:config="widgetForm.config"
								:selectWidget="widgetFormSelect"
								@click="handleItemClick(element)"
								@copy="handleCopyClick(index, widgetForm.list)"
								@delete="handleDeleteClick(index, widgetForm.list)"
							/>
						</template>
					</transition-group>
				</template>
			</Draggable>
		</n-form>
	</div>
</template>

<script setup>
import Draggable from "vuedraggable";
import { useThemeVars } from "naive-ui";
import { nanoid } from "nanoid";
import SvgIcon from "@/component/svg-icon/index.vue";
import DesignFormItem from "./designFormItem.vue";

defineOptions({ name: "designForm" });
const themeVars = useThemeVars();
const emits = defineEmits(["update:widgetForm", "update:widgetFormSelect"]);
const props = defineProps({
	widgetForm: {
		type: Object,
		required: true
	},
	widgetFormSelect: {
		type: Object
	}
});

/**
 * 插入一个元素
 * @param key
 * @param list
 * @param obj
 * @returns {*[]}
 */
const handleListInsert = (key, list, obj) => {
	const newList = [];
	list.forEach(item => {
		// 循环传递过来的表单项list，如果传递过来的key以存在，则将传递过来的表单项复制到该项下面
		if (item.key === key) {
			newList.push(item);
			newList.push(obj);
		} else {
			if (item.type === "table") {
				// 如果该项表单项存在自己，则递归调用
				// eslint-disable-next-line no-param-reassign
				item.columns = item.columns.map(tr => tr.map(td => ({ ...td, list: handleListInsert(key, td.list, obj) })));
			} else if (item.columns) {
				// eslint-disable-next-line no-param-reassign
				item.columns = item.columns.map(col => ({
					...col,
					list: handleListInsert(key, col.list, obj)
				}));
			}
			newList.push(item);
		}
	});
	console.log("newList=", newList);
	return newList;
};

/**
 * 监听到有新元素拖到编辑器
 * @param event 拖入的元素信息
 */
const handleMoveAdd = event => {
	console.log("-----监听到有新元素拖到编辑器-----", event);
	const { newIndex } = event;

	const key = nanoid().replaceAll("-", ""); // 为拖进来的节点生成一个key
	// 纯数据深拷贝，防止污染原数据, 当拖动进来一个数据时，vuedraggable 会自动把数据插入拖动到的位置
	const list = JSON.parse(JSON.stringify(props.widgetForm.list));
	// // 对数据进行格式化, 为数据插入 key 和 model 以及 rules 校验规则集合
	list[newIndex] = { ...list[newIndex], key, model: `${list[newIndex].type}_${key}`, rules: [] };

	// 更新表单json串
	emits("update:widgetForm", { ...props.widgetForm, list });
	// 更新当前选中的表单项，
	emits("update:widgetFormSelect", list[newIndex]);
};

/**
 * 删除一个元素,对编辑器配置数据进行删除一个表单项
 * @param key
 * @param list
 * @returns {*[]}
 */
const handleListDelete = (key, list) => {
	const newList = [];
	list.forEach(item => {
		if (item.key !== key) {
			if (item.type === "table") {
				// eslint-disable-next-line no-param-reassign
				item.columns = item.columns.map(tr =>
					tr.map(td => ({
						...td,
						list: handleListDelete(key, td.list)
					}))
				);
			} else if (item.columns) {
				// eslint-disable-next-line no-param-reassign
				item.columns = item.columns.map(col => ({
					...col,
					list: handleListDelete(key, col.list)
				}));
			}
			newList.push(item);
		}
	});
	return newList;
};

/**
 * 点击删除按钮删除一个元素
 * @param index
 * @param list
 */
const handleDeleteClick = (index, list) => {
	console.log("---------点击删除一个元素---------", index, list);
	const oldList = JSON.parse(JSON.stringify(props.widgetForm.list));

	// 更新当前选中的表单项
	if (list.length - 1 === index) {
		if (index === 0) {
			nextTick(() => emits("update:widgetFormSelect", null));
		} else {
			emits("update:widgetFormSelect", list[index - 1]);
		}
	} else {
		emits("update:widgetFormSelect", list[index + 1]);
	}

	// 更新表单配置数据
	emits("update:widgetForm", {
		...props.widgetForm,
		list: handleListDelete(list[index].key, oldList) // 调用表单数组项删除方法
	});
};

/**
 * 添加表单元素到栅格布局中
 * @param event 拖入的元素信息
 * @param row 当前栅格元素数据详情
 * @param index 是当前栅格的第几个元素
 */
const handleColMoveAdd = (event, row, index) => {
	console.log("-----监听到有新的元素被拖到栅格布局中-------", event, row, index);
	const { newIndex, oldIndex, item } = event;
	// 克隆父组件传递过来的全部表单项
	const list = JSON.parse(JSON.stringify(props.widgetForm.list));

	// 判断拖进来的是栅格布局组件还是其他组件，如果是栅格布局组件则不进行接收
	if (row.columns[index].list[newIndex].type === "grid") {
		// eslint-disable-next-line no-unused-expressions
		item.tagName === "DIV" && list.splice(oldIndex, 0, row.columns[index].list[newIndex]);
		row.columns[index].list.splice(newIndex, 1);
	} else {
		// 生成当前表单项的key
		const key = nanoid().replaceAll("-", "");
		// 组装拖入的表单项数据
		row.columns[index].list[newIndex] = {
			...row.columns[index].list[newIndex], // 表单项的默认配置
			key, // 唯一key
			model: `${row.columns[index].list[newIndex].type}_${key}`,
			rules: [] // 校验规则
		};
		// 将选中的项切换为当前项
		emits("update:widgetFormSelect", row.columns[index].list[newIndex]);
	}
};

/**
 * 点击子项
 * @param row 当前点击的元素信息
 */
const handleItemClick = row => {
	emits("update:widgetFormSelect", row);
};

/**
 * 点击了组件复制
 * @param index
 * @param list
 */
const handleCopyClick = (index, list) => {
	const key = nanoid().replaceAll("-", "");
	// 取出复制来源表单项
	const oldList = JSON.parse(JSON.stringify(props.widgetForm.list));

	// 根据表单复制
	let copyData = {
		...list[index],
		key,
		model: `${list[index].type}_${key}`,
		rules: list[index].rules ?? []
	};

	// 因为直接取的默认表单配置
	if (list[index].type === "radio" || list[index].type === "checkbox" || list[index].type === "select") {
		copyData = {
			...copyData,
			options: {
				...copyData.options,
				options: copyData.options.options.map(item => ({ ...item }))
			}
		};
	}

	emits("update:widgetForm", {
		...props.widgetForm,
		list: handleListInsert(list[index].key, oldList, copyData)
	});

	emits("update:widgetFormSelect", copyData);
};
</script>

<style scoped lang="less">
.widget-form-container {
	width: 100%;
	height: 100%;

	::v-deep(.n-form) {
		height: 100%;
	}

	.widget-form-list {
		border: 1px dashed v-bind("themeVars.borderColor");
		//margin: 5px;
		min-height: 100%;
		//background-color: red;
		padding: 5px 10px;
		box-sizing: border-box;

		::v-deep(.ghost) {
			background: v-bind("themeVars.primaryColor");
			border: 2px solid v-bind("themeVars.primaryColorHover");
			box-sizing: border-box;
			content: "";
			font-size: 0;
			height: 3px;
			outline-width: 0;
			overflow: hidden;
			padding: 0;
		}
	}

	::v-deep(.n-form--inline .widget-form-list) {
		width: 100%;
		display: inline-flex;
		align-items: flex-start;
		align-content: space-around;
	}
}

.widget-col-list {
	background: #fff;
	border: 1px dashed #ccc;
	min-height: 50px;
	height: auto;
}

.widget-col {
	background-color: rgba(253, 246, 236, 0.3);
	padding: 5px;
	position: relative;

	&:hover {
		background: v-bind("themeVars.dividerColor");
		outline-offset: 0px;
		outline: 1px solid v-bind("themeVars.warningColor");
	}

	&:hover.active {
		border: 1px solid v-bind("themeVars.warningColor");
		outline-offset: 0;
		outline: 2px solid v-bind("themeVars.warningColor");
	}
	.widget-view-action.widget-col-action {
		background: v-bind("themeVars.warningColor");
		bottom: -2px;
		height: 24px;
		line-height: 24px;
		position: absolute;
		left: -2px;
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
	.widget-view-drag.widget-col-drag {
		//padding: 100px;
		background: v-bind("themeVars.warningColor");
		height: 24px;
		right: -2px;
		line-height: 24px;
		position: absolute;
		padding: 0 5px;
		top: -2px;
		z-index: 10;
		::v-deep(.svg-icon) {
			color: #fff;
			cursor: move;
			font-size: 14px;
			margin: 0 5px;
		}
	}
	&:after {
		display: none;
	}
}
.widget-col.active {
	border: 1px solid v-bind("themeVars.warningColor");
	outline: 2px solid v-bind("themeVars.warningColor");
}
</style>
