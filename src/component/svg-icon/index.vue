<template>
	<div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$attrs" />
	<svg v-else :class="svgClass" arig-hidden="true" v-on="$attrs">
		<use :href="iconName" />
	</svg>
</template>

<script lang="ts">
function isExternalStr(path) {
	return /^(https?:|mailto:|tel:)/.test(path);
}

export default {
	name: "SvgIcon",
	props: {
		iconClass: {
			type: String,
			required: true
		},
		className: {
			type: String,
			default: ""
		}
	},
	setup(props) {
		const isExternal = computed(() => isExternalStr(props.iconClass));
		const iconName = computed(() => `#icon-${props.iconClass}`);
		const svgClass = computed(() => {
			if (props.className) {
				return `svg-icon ${props.className}`;
			}
			return "svg-icon";
		});
		const styleExternalIcon = computed(() => ({
			mask: `url(${props.iconClass}) no-repeat 50% 50%`,
			"-webkit-mask": `url(${props.iconClass}) no-repeat 50% 50%`
		}));

		return {
			isExternal,
			iconName,
			svgClass,
			styleExternalIcon
		};
	}
};
</script>

<style scoped>
.svg-icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
}
.svg-external-icon {
	background-color: currentColor;
	mask-size: cover !important;
	display: inline-block;
}
</style>
