#!/usr/bin/env ts-node
// 直接引@umijs/openapi用，执行这个ts文件来生成接口

const openAPI = require('@umijs/openapi')

openAPI.generateService({
  // mock: false,
  serversPath: './servers',
  schemaPath: `${__dirname}/oneapi.json`,
  // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"   // 或者使用在线的版本
  requestLibPath: "import { request } from 'umi'",
});
