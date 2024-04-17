import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	server: {
		port: 9000,
		host: '127.0.0.1'
	},
	resolve: {
		alias: {
			'@ui': '/src/ui',
			'@json': '/src/json',
			'@store': '/src/store',
			'@utils': '/src/utils',
			'@styles': '/src/styles',
			'@assets': '/src/assets',
			'@services': '/src/services',
			'@components': '/src/components',
			'@modules': '/src/components/modules'
		},
	},
	optimizeDeps: {
		exclude: ['@vis.gl/react-google-maps']
	},
})