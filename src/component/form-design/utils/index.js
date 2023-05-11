import { naiveui } from "@/config";

/**
 * 当前操作主要是为了拿出naiveui config配置中的widgetForm，并将其中的函数也拿出来，
 * 在之后修改widgetForm是不影响naiveui config
 * @returns {any}
 */
export function getWidgetForm() {
	const widgetForm = JSON.parse(JSON.stringify(naiveui.widgetForm));
	Object.keys(naiveui.widgetForm).forEach(key => {
		if (typeof naiveui.widgetForm[key] === "function") {
			widgetForm[key] = naiveui.widgetForm[key];
		}
	});
	return widgetForm;
}
