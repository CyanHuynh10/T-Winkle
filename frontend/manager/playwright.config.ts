import {defineConfig} from '@playwright/test'
export default defineConfig({testDir:'./tests',workers:1,timeout:60000,use:{baseURL:'http://localhost:5657',headless:true},reporter:[['list'],['json',{outputFile:'../../target/manager-review/browser-results.json'}]]})
