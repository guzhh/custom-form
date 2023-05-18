import { fileURLToPath, URL } from "node:url";
import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import DefineOptions from "unplugin-vue-define-options/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default defineConfig({
	plugins: [
		vue(),
		DefineOptions(),
		AutoImport({
			imports: [
				"vue",
				{
					"naive-ui": ["useDialog", "useMessage", "useNotification", "useLoadingBar"]
				}
			],
			eslintrc: {
				enabled: true, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成
				filepath: "./.eslintrc-auto-import.json", // 生成json文件
				globalsPropValue: true
			},
			dts: "src/auto-imports.d.ts"
		}),
		Components({
			resolvers: [NaiveUiResolver()]
		}),
		createSvgIconsPlugin({
			// 指定需要缓存的图标文件夹
			iconDirs: [resolve(process.cwd(), "src/icons/svg")],
			// 指定symbolId格式
			symbolId: "icon-[name]"
		})
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url))
		}
	},
	server: {
		host: "0.0.0.0",
		port: 8888
	},
	build: {
		// 到处文件目录，penk-ui 用于存放package.json，避免被覆盖
		// 这里不设置也是默认dist
		outDir: "dist",
		// 兼容
		target: "es2015",
		lib: {
			// 也可以是字典或多个入口点的数组
			entry: resolve(__dirname, "src/index.js"),
			name: "CustomForm",
			// 将添加适当的扩展名
			// 如果不用format文件后缀可能会乱
			fileName: format => `custom-form.${format}.js`
			// // 导出模块格式
			// formats: ["es", "umd", "iife"]
		},
		sourcemap: true, // 输出.map文件
		rollupOptions: {
			// 确保外部化处理那些你不想打包进库的依赖
			external: ["vue", "naive-ui", "vuedraggable", "axios"],
			output: {
				// 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
				globals: {
					vue: "Vue",
					axios: "axios",
					"naive-ui": "naive",
					vuedraggable: "vuedraggable"
				}
			}
		}
	}
});
