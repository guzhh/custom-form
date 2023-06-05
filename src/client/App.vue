<template>
	<n-notification-provider>
		<n-message-provider>
			<n-dialog-provider>
				<form-design />
				<server-form-render
					@beforeSubmit="beforeSubmit"
					@mounted="renderMounted"
					@submit-error="submitError"
					@submit-success="submitSuccess"
					temp-id="1665632943815626752"
					:form-all-id="'1659405163448266752'"
					:form-val-id="'1659405163599261696'"
					base-url="http://192.168.1.228:8600/panku-forms-server"
				/>
			</n-dialog-provider>
		</n-message-provider>
	</n-notification-provider>
</template>

<script setup>
import FormDesign from "@/component/form-design/index.vue";
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

<style>
* {
	box-sizing: border-box;
	padding: 0;
	margin: 0;
}
html,
body {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
	font-size: 14px;
	-moz-osx-font-smoothing: grayscale;
	-webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}
::-webkit-scrollbar-button {
	width: 0;
	height: 0;
}
::-webkit-scrollbar-thumb {
	background-color: rgb(0 0 0 / 10%);
	border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
	background-color: rgb(0 0 0 / 20%);
}
::-webkit-scrollbar-thumb:active {
	background-color: rgb(0 0 0 / 30%);
}
::-webkit-scrollbar-corner {
	background-color: transparent;
}
#app {
	height: 100vh;
	width: 100vw;
}
</style>
