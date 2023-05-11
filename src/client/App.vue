<template>
	<n-notification-provider>
		<n-message-provider>
			<n-dialog-provider>
				<form-design />
			</n-dialog-provider>
		</n-message-provider>
	</n-notification-provider>
</template>

<script setup>
import FormDesign from "@/component/form-design/index.vue";
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
