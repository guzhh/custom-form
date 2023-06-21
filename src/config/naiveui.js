// 获取验证规则
const getRules = defaultType => {
	const rules = {
		trigger: "blur", // 触发方式
		enum: "",
		len: undefined, // 长度
		max: undefined, // 最大值
		message: "", // 提示
		min: undefined, // 最小值
		pattern: "",
		required: false, // 是否必填
		type: "any" // 类型为any的时候，input空字符也将校验通过
	};
	rules.type = defaultType;
	return rules;
};

// 设计器默认数据
export const widgetForm = {
	list: [],
	config: {
		size: "medium", // 表单尺寸 'small' | 'medium' | 'large'
		hideRequiredMark: false, // 是否展示必填的星号
		groupType: "radioGroup",
		inline: false, // 	是否展示为行内表单
		labelAlign: "left", // 标签的文本对齐方式 'left' | 'right'
		labelWidth: "auto", // 标签的宽度
		labelPlacement: "top", // 标签显示的位置 'left' | 'top'
		showLabel: true, // 是否展示标签
		requireMarkPlacement: "left", // 必填星号的位置
		customFunc: "console.log(view)\nconsole.log(form)", // 表单设计者自定义的函数
		mountedFunc: "console.log(view)\nconsole.log(form)", // 表单渲染完成执行的函数
		beforeSubmit: "console.log(view)\nconsole.log(form)", // 表单提交前执行的函数
		afterSubmit: "console.log(view)\nconsole.log(form)" // 表单提交后执行的函数
	},

	/**
	 * 根据表单字段key获取表单项配置
	 * @param modelKey
	 * @returns {null}
	 */
	getWidget(modelKey) {
		let widget = null;
		this.list.forEach(value => {
			if (value.model === modelKey) {
				widget = value;
			} else if (value.type === "grid") {
				value.columns.forEach(column => {
					column.list.forEach(val => {
						if (val.model === modelKey) {
							widget = val;
						}
					});
				});
			}
		});
		return widget;
	},

	/**
	 * 获取表单字段key获取表单项得分
	 * @param modelKey
	 */
	getWidgetScores(modelKey) {
		const widget = this.getWidget(modelKey);
		if (widget.type === "radio" || (widget.type === "select" && widget.options.multiple === false)) {
			const selectedOptions = widget.options.options.find(option => option.value === widget.options.defaultValue);
			if (selectedOptions) {
				return typeof selectedOptions.score === "number" ? selectedOptions.score : 0;
			}
			return 0;
		}
		return 0;
	},

	/**
	 * 计算表单总分
	 * @returns {number}
	 */
	getTheTotalScore() {
		let fraction = 0;
		const calculateTheScore = list => {
			for (let index = 0; index < list.length; index++) {
				const { model } = list[index];
				// 判断是否存在绑定key
				if (!model) {
					return;
				}
				// 判断是否是否是栅格组件
				if (list[index].type === "grid") {
					// 如果是则递归调用
					list[index].columns.forEach(col => calculateTheScore(col.list));
				} else {
					// eslint-disable-next-line no-lonely-if
					if (list[index].type === "radio" || (list[index].type === "select" && list[index].options.multiple === false)) {
						const selectedOptions = list[index].options.options.find(option => option.value === list[index].options.defaultValue);
						if (selectedOptions) {
							fraction += typeof selectedOptions.score === "number" ? selectedOptions.score : 0;
						}
					}
				}
			}
		};
		calculateTheScore(this.list);
		return fraction;
	}
};

const rules = {
	trigger: "blur",
	enum: "",
	len: undefined,
	max: undefined,
	message: "",
	min: undefined,
	pattern: "",
	required: false,
	type: "any" // 类型为any的时候，input空字符也将校验通过
};

// 基础组件
export const basicComponents = [
	{
		label: "文本输入",
		type: "input",
		options: {
			change: "",
			show: true, // 是否显示
			showLabel: true,
			width: "100%",
			type: "text",
			defaultValue: "",
			placeholder: "",
			maxlength: null,
			showCount: false,
			prefix: "",
			suffix: "",
			disabled: false,
			allowClear: false,
			readonly: false,
			round: false,
			rules: getRules("string")
		}
	},
	{
		label: "数字输入",
		type: "number",
		options: {
			change: "",
			show: true, // 是否显示
			showLabel: true, // 是否显示标题
			width: "100%", // 宽度
			defaultValue: 0, // 默认值
			min: 0, // 最小值
			max: 100, // 最大值
			step: 1, // 步长
			placeholder: "", // 提示内容
			precision: undefined, // 精度
			buttonPlacement: "right", // 加减按钮的位置 'both' | 'right'
			readonly: false,
			disabled: false,
			rules: getRules("number")
		}
	},
	{
		label: "单选框组",
		type: "radio",
		options: {
			change: "",
			show: true, // 是否显示
			showLabel: true,
			click: "",
			width: "",
			defaultValue: null,
			groupType: "radioGroup",
			remote: false,
			remoteFunc: "https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json",
			options: [
				{
					value: "Option 1",
					label: "Option 1",
					score: 0
				},
				{
					value: "Option 2",
					label: "Option 2",
					score: 0
				},
				{
					value: "Option 3",
					label: "Option 3",
					score: 0
				}
			],
			remoteOptions: [],
			props: {
				value: "value",
				label: "label"
			},
			disabled: false,
			rules: getRules("string")
		}
	},
	{
		label: "多选框组",
		type: "checkbox",
		options: {
			change: "",
			show: true, // 是否显示
			showLabel: true,
			click: "",
			defaultValue: [],
			width: "",
			inline: true,
			remote: false,
			remoteFunc: "https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json",
			options: [
				{
					label: "Option 1",
					value: "Option 1"
				},
				{
					label: "Option 2",
					value: "Option 2"
				},
				{
					label: "Option 3",
					value: "Option 3"
				}
			],
			remoteOptions: [],
			props: {
				value: "value",
				label: "label"
			},
			disabled: false,
			rules: getRules("array")
		}
	},
	{
		label: "时间选择器",
		type: "time",
		options: {
			change: "",
			show: true, // 是否显示
			showLabel: true,
			defaultValue: null,
			width: "100%",
			placeholder: "请选择时间",
			format: "HH:mm:ss",
			valueFormat: "HH:mm:ss",
			readonly: false,
			allowClear: true,
			disabled: false,
			rules: getRules("string")
		}
	},
	{
		label: "日期选择器",
		type: "date",
		options: {
			change: "",
			show: true, // 是否显示
			showLabel: true,
			defaultValue: null,
			width: "100%",
			placeholder: "请选择日期",
			format: "yyyy-MM-dd",
			readonly: false,
			type: "date",
			allowClear: true,
			disabled: false,
			rules: getRules("string")
		}
	},
	{
		label: "评分",
		type: "rate",
		options: {
			change: "",
			click: "",
			show: true, // 是否显示
			showLabel: true,
			defaultValue: null,
			max: 5,
			allowClear: true,
			allowHalf: false, // 允许只激活一半图标
			disabled: false, // 是否可清空，在点击当前值对应的图标后值会被设为 null
			rules: getRules("number")
		}
	},
	{
		label: "下拉选择框",
		type: "select",
		options: {
			change: "",
			defaultValue: [],
			width: "100%",
			placeholder: "请选择",
			multiple: false,
			remote: false,
			show: true, // 是否显示
			showLabel: true,
			filterable: false,
			allowClear: false,
			disabled: false,
			props: {
				label: "label",
				value: "value"
			},
			options: [
				{
					label: "选项 1",
					value: "选项 1",
					score: 0
				},
				{
					label: "选项 2",
					value: "选项 2",
					score: 0
				},
				{
					label: "选项 3",
					value: "选项 3",
					score: 0
				}
			],
			remoteOptions: [],
			remoteFunc: "https://raw.githubusercontent.com/fuchengwei/vue-form-create/master/mock/mock.json",
			rules: getRules("string")
		}
	},
	{
		label: "开关",
		type: "switch",
		options: {
			change: "",
			click: "",
			show: true, // 是否显示
			showLabel: true,
			defaultValue: false,
			disabled: false,
			checkedValue: true,
			checkedChildren: "",
			uncheckedValue: false,
			unCheckedChildren: "",
			rules: getRules("boolean")
		}
	},
	{
		label: "滑块",
		type: "slider",
		options: {
			change: "",
			show: true, // 是否显示
			showLabel: true,
			defaultValue: 0,
			width: "",
			height: "",
			min: 0,
			max: 100,
			step: 1,
			disabled: false,
			range: false,
			vertical: false,
			reverse: false,
			rules: getRules("number")
		}
	},
	{
		label: "颜色选择器",
		type: "color",
		options: {
			change: "",
			show: true, // 是否显示
			showLabel: true,
			defaultValue: "",
			width: "",
			disabled: false,
			showAlpha: true,
			showPreview: false,
			placement: "bottom-start",
			modes: ["hex"],
			rules: getRules("string")
		}
	}
];

export const advanceComponents = [
	{
		label: "上传",
		type: "upload",
		options: {
			show: true, // 是否显示
			showLabel: true, // 是否显示标题
			defaultValue: [], // 默认值
			defaultUpload: true, // 选择文件时候是否默认上传
			directory: false, // 	是否支持目录上传（在文件选框中只能选择目录）
			directoryDnd: false, // 是否支持目录拖拽上传（如果不设定会默认跟随 directory）
			showDownloadButton: false, // 是否显示下载按钮（在 finished 后展示）
			showFileList: true, // 	是否显示文件列表
			showRetryButton: true, // 是否显示重新上传按钮（在 error 时展示）
			showRemoveButton: true, // 是否显示删除按钮（在 finished 后时候展示），点击删除按钮会触发 on-remove 回调
			showCancelButton: true, // 是否显示取消按钮（在 pending、uploading、error 的时候展示），点击取消按钮会触发 on-remove 回调
			showPreviewButton: true, // 是否允许显示预览按钮（在 list-type 为 image-card 时生效）
			name: "file", // 文件在提交表单中的字段名
			action: "http://example.com/upload", // 请求提交的地址
			method: "post", // HTTP 请求的方法
			listType: "text", // 文件列表的内建样式，text、image 和 image-card
			accept: "image/*", // 接受的文件类型，参考 accept
			maxCount: 3, // 限制上传文件数量
			multiple: false, // 是否支持多个文件
			disabled: false, // 	是否禁用
			rules
		}
	}
];

// 其他组件
export const otherComponents = [
	{
		type: "text",
		label: "文字",
		options: {
			show: true, // 是否显示
			showLabel: false,
			text: "文字",
			style: {
				width: "100%",
				height: "",
				textAlign: "center",
				fontWeight: "400",
				fontSize: "20px",
				lineHeight: "1.5"
			}
		}
	},
	{
		type: "divider",
		label: "分割线",
		options: {
			show: true, // 是否显示
			showLabel: false,
			text: "分割线",
			dashed: false,
			titlePlacement: "center",
			vertical: false
		}
	},
	{
		label: "警告信息",
		type: "alert",
		options: {
			show: true, // 是否显示
			showLabel: false,
			title: "This is a alert",
			content: "This is a alert",
			type: "default",
			width: "",
			height: "",
			showIcon: true,
			closable: false
		}
	},
	{
		label: "按钮",
		type: "button",
		options: {
			show: true, // 是否显示
			showLabel: false,
			text: "按钮",
			type: "default",
			width: "",
			height: "",
			block: false,
			bordered: true,
			dashed: false,
			circle: false,
			ghost: false,
			strong: false,
			textBtn: false,
			color: null,
			textColor: null,
			loading: false
		}
	}
];

// 布局容器
export const layoutComponents = [
	{
		label: "栅格布局",
		type: "grid",
		columns: [
			{
				span: 12,
				list: []
			},
			{
				span: 12,
				list: []
			}
		],
		options: {
			cols: 24,
			xGap: 0,
			yGap: 0,
			show: true, // 是否显示
			collapsed: false,
			collapsedRows: 1,
			responsive: "self",
			itemResponsive: false,
			justify: "start",
			align: "top"
		}
	},
	{
		label: "折叠面板",
		type: "collapse",
		items: [
			{
				name: "折叠面板 1",
				title: "折叠面板 1",
				list: []
			},
			{
				name: "折叠面板 2",
				title: "折叠面板 2",
				list: []
			},
			{
				name: "折叠面板 3",
				title: "折叠面板 3",
				list: []
			}
		],
		options: {
			show: true, // 是否显示
			defaultExpandedNames: "折叠面板 1", // 默认展开的项
			accordion: true, // 是否只允许展开一个面板
			arrowPlacement: "right" // 箭头位置
		}
	}
];
