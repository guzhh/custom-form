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

### 表单设计器 `form-design`
#### 属性
| 名称  | 类型     | 默认值 | 说明                                              |
|---|--------|-----|-------------------------------------------------|
|  widgetFormJson | Object | 见下方 | 需要传递符合规范的的数据，最好时表单设计器自己生成的数据，其他自定义数据可能导致表单设计器报错 |
| saveText  | string |   生成JSON  | 保存表单设计按钮的文字  |

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
        customFunc: "console.log(view)\nconsole.log(form)" // 表单设计者自定义的函数
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
                const {model} = list[index];
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

### 表单设计器 `form-render`

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
|  getWidgetFormData  | Promise()  | 获取整个表单渲染json,并且包含填写的值     |
|  calculateTheScore  | ()=>Number | 计算当前表单得分                  |
|  executeustomFunc  | ()=>{}     | 执行自定义函数, 函数返回具体看自定义函数如何编写 |
