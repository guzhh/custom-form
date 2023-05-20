<p align="center">基于Vue3、Naive UI、JavaScript的表单生成器，支持常用组件</p>
<p align="center">
  <a href="./LICENSE"><img allt="MIT License" src="https://badgen.net/badge/naive-ui/^2.34.3/green"/></a>
  <a href="./LICENSE"><img allt="MIT License" src="https://badgen.net/badge/vue/^3.2.47/green"/></a>
  <a href="./LICENSE"><img allt="MIT License" src="https://badgen.net/badge/vite/^E4.3.2/green"/></a>
</p>

> 当前仓库主要是借鉴和~~抄~~（学）了 `LvHuaiSheng` 大佬的 [naiveui-form-generate](https://gitee.com/sourcenet/naiveui-form-generate)，在此特别提出感谢

> 当前仓库主要包含两个组件，分别为表单设计器、表单渲染器
>
> 表单设计器 form-design
>
> 表单渲染器 form-render
>
> 结合服务端的表单渲染器 server-form-render

### 快速使用

#### 安装依赖

```shell
# npm
npm init vue@latest axios naive-ui vuedraggable@next @guzhh/custom-form --save
 
# yarn
yarn add vue@latest axios naive-ui vuedraggable@next @guzhh/custom-form

# pnpm
pnpm install vue@latest axios naive-ui vuedraggable@next @guzhh/custom-form
```



### 表单设计器 `form-design`

#### 属性
| 名称             | 类型        | 默认值 | 说明                                              |
|----------------|-----------|-----|-------------------------------------------------|
| widgetFormJson | String    | 见下方 | 需要传递符合规范的的数据，最好是表单设计器自己生成的数据，其他自定义数据可能导致表单设计器报错 |
| saveText       | string    |   生成JSON  | 保存表单设计按钮的文字                                     |
| on-ok          | ()=> void |     | 点击保存按钮触发的事件                                     |

##### widgetFormJson 说明

```javascript
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
```

#### 方法

| 名称 | 类型           | 说明               |
|----|--------------|------------------|
|  getJson  | () => Object | 获取表单设计器设计出来的json |

### 表单渲染器 `form-render`

#### 属性

| 名称  | 类型      | 默认值             | 说明     |
|---|---------|-----------------|--------|
| data  | naiveui.widgetForm | 见上方widgetForm说明 | 表单设计器设计出来的json |
| value  | Object  | {}              | 表单绑定的值，一般用结构化存储 |
| disabled  | Boolean | false | 是否禁用表单 |

#### 方法

| 名称 | 类型         | 说明                        |
|----|------------|---------------------------|
|  getData  | Promise()  | 校验表单并获取表单填写的值             |
|  reset  | ()=>void   | 重置表单                      |
|  handleValidateForm  | Promise()   | 手动验证表单输入                  |
|  getWidgetFormData  | Promise()  | 获取整个表单渲染json,并且包含填写的值     |
|  calculateTheScore  | ()=>Number | 计算当前表单得分                  |
|  executeustomFunc  | ()=>{}     | 执行自定义函数, 函数返回具体看自定义函数如何编写 |

### 结合服务端的表单渲染器 `server-form-render`

> 这个渲染器集成了更加模板id获取表单填报id等自动渲染表单，同时基础成自动提交表单，自动执行自定义函数，对外暴露生命周期等等

#### 属性

| 名称         | 类型    | 默认值 | 说明                                                         |
| ------------ | ------- | ------ | ------------------------------------------------------------ |
| baseUrl      | String  | 无     | 表单对接后台请求的服务跟地址                                 |
| tempId       | String  | 无     | 在盘古通用表单服务中设计保存的模板ID                         |
| formData     | String  | 无     | 表单提交后返回的 表单填写后保存全部数据的ID：formAllId、表单填写后保存全部填写值的ID：formValId <br />格式：{ formAllId: '', formValId: '' } |
| params       | Object  | 无     | 要传递给表单设计器的值，注意：通过value传递的值需要在设计表单时定义一个相同key的表单项，否则可能导致在最后存储表单填写数据时无法拿到传递的值。同时在编辑表单时传递value则可能会导致表单原来填写的相同key的值被覆盖<br /><br />使用场景：例如当设计的表单中有姓名（name）字段时，不想让用户进行手动填写，直接用数据库中的值进行填充值进行填充则传递 :params="{name:'张三'}" |
| disabled     | Boobean | false  | 是否禁用表单                                                 |
| customSubmit | Boobean | false  | 是否自定义提交按钮                                           |

#### 钩子函数

| 方法名        | 签名                             | 说明                                                         |      |
| ------------- | -------------------------------- | ------------------------------------------------------------ | ---- |
| mounted       | (event) => void                  | 表单渲染完成执行调用的钩子函数<br />event：执行 *表单提交前函数* 返回的值 |      |
| beforeSubmit  | （event）=> void                 | 点击表单提交按后，调用验证表单成功后，调用表单提交接口前，调用的钩子函数<br />event：执行 *渲染成功执行函数* 返回的值 |      |
| submitSuccess | ({submitData, funcData}) => void | 表单提交成功后调用的钩子函数<br />submitData： 表单提交返回的结果，一般为 formAllId 和 formValId<br />funcData：调用 *表单提交后函数* 返回的值 |      |
| submitError | ({errorData,funcData}) => void   | 表单提交失败调用的钩子函数<br />errorData：提交失败返回的错误信息<br />funcData：调用 *表单提交后函数* 返回的值 |      |

#### 方法

| 方法名称         | 方法签名   | 说明                         |
| ---------------- | ---------- | ---------------------------- |
| executeustomFunc | ()=>       | 手动调用执行定义的自定义函数 |
| resetForm        | () => void | 重置表单数据                 |
| submitData       | () => void | 提交表单                     |

#### 使用示例

```vue
<template>
<server-form-render
    @beforeSubmit="beforeSubmit"
    @mounted="renderMounted"
    @submit-error="submitError"
    @submit-success="submitSuccess"
    temp-id="1658722046437560320"
    :formData="{ formAllId: '1659405163448266752', formValId: '1659405163599261696' }"
    base-url="http://192.168.1.88:8600/panku-forms-server"
/>
</template>

<script setup>
import ServerFormRender from "@/component/server-form-render/index.vue";

/**
 * 表单渲染完成
 * @param result
 */
const renderMounted = result => {
	console.log("-----表单渲染完成------", result);
};

/**
 * 表单提交前执行的回调
 * @param result
 */
const beforeSubmit = result => {
	console.log("---------表单提交前执行的回调--------", result);
};

/**
 * 表单提交失败
 */
const submitError = result => {
	console.log("--------表单提交失败-------", result);
};

/**
 * 表单执行成功回调
 * @param result
 */
const submitSuccess = result => {
	console.log("--------表单执行成功回调-------", result);
};
</script>

```

