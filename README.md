<p align="center">基于Vue3、Naive UI、JavaScript的表单生成器，支持常用组件</p>
<p align="center">
  <a href="./LICENSE"><img allt="MIT License" src="https://badgen.net/badge/naive-ui/^2.34.3/green"/></a>
  <a href="./LICENSE"><img allt="MIT License" src="https://badgen.net/badge/vue/^3.2.47/green"/></a>
  <a href="./LICENSE"><img allt="MIT License" src="https://badgen.net/badge/vite/^E4.3.2/green"/></a>
</p>

> 当前仓库主要是借鉴和抄袭了 `LvHuaiSheng` 大佬的 [naiveui-form-generate](https://gitee.com/sourcenet/naiveui-form-generate)，再次特别提出感谢

> 当前仓库主要包含两个组件，分别为表单设计器、表单渲染器
> 
> 表单设计器 form-design
> 
> 表单渲染器 form-render

### 版本格式

一般为：x.y.z-state

x – 主版本号，y – 次版本号，z – 修订号

state – 版本状态，可选字段，可选值包括以下几种

+ alpha，内部测试版本，bug较多
+ beta，公测版本，给外部进行测试的版本，有缺陷
+ rc，release candidate，前面三种测试版本的进一步版本，实现了全部功能，解决了大部分bug，接近发布，正式版本的候选版本

### 版本号递增规则

+ 主版本号：做了不兼容旧版本的API修改，大版本修改，主版本号递增时，次版本号和修订号必须归零
+ 次版本号：向下兼容的功能性新增或弃用，feature 版本，每次次版本号递增时，修订号必须归零
+ 修订号：向下的版本问题修复，bug fix 版本
+ 数字型的标识符为非负整数，且不能在前面补零
+ 0.y.z 表示开发阶段，一切可能随时改变，非稳定版
+ 1.0.0 界定此版本为初始稳定版，后面的一切更新都基于此版本修改
+ 在发布重要版本时，可以先发布alpha，beta，rc等先行版本，先行版本版本状态是以 .
  分隔的标识符，由数字字母组成，alpha、beta、rc后需要带上次数信息，比如1.0.0-alpha.1
+ 某个软件版本发行后，后续修改都必须以新版本发行