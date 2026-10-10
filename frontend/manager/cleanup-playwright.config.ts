import {defineConfig} from '@playwright/test'
export default defineConfig({testDir:'./tests',testMatch:'cleanup.spec.ts',workers:1,timeout:60000,use:{baseURL:'http://localhost:5657',headless:true},reporter:[['list'],['json',{outputFile:'../../target/cleanup-review/browser-results.json'}]]})
