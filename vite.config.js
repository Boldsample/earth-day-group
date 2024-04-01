import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	server: {
		port: 9000
	},
	resolve: {
		alias: {
			'@ui': '/src/ui',
			'@json': '/src/json',
			'@store': '/src/store',
			'@styles': '/src/styles',
			'@assets': '/src/assets',
			'@services': '/src/services',
			'@components': '/src/components',
			'@modules': '/src/components/modules'
		},
	},
})