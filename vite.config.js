import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({plugins:[react(),VitePWA({registerType:'autoUpdate',manifest:{name:'Between Us',short_name:'Between Us',theme_color:'#fb7185',background_color:'#fff7f5',display:'standalone',orientation:'portrait',scope:'/',start_url:'/',icons:[{src:'/pwa.svg',sizes:'512x512',type:'image/svg+xml'}]}})]})
