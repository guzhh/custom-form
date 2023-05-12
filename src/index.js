import "virtual:svg-icons-register"; // 引入SVG注册脚本
/**
 * 引入封装好的组件
 */
import FormRender from "@/component/form-render/index.vue";
import FormDesign from "@/component/form-design/index.vue";

/**
 * 如果有多个其它组件,都可以写到这个数组里
 * @type {{}[]}
 */
// const componentArr = [FormRender, FormDesign];

/**
 * 批量组件注册
 * @param Vue
 */
// const install = Vue => {
// 	componentArr.forEach(com => {
// 		Vue.component(com.name, com);
// 	});
// };

export { FormRender, FormDesign };

// export default install; // 这个方法使用的时候可以被use调用
