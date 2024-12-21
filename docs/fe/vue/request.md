# Vue.js 生态最佳请求方案

迄今为止，[Vue.js](https://cn.vuejs.org/) 生态（不包括 [Nuxt](https://nuxt.com/)）最佳的请求方案我当前推崇 [Axios](https://axios-http.com/zh/) + [Pinia Colada](https://pinia-colada.esm.dev/)。

## 背景

Vue.js 作为当前全世界最流行的前端应用开发框架之一，有无数的前端应用构建在其之上。而在绝大部分 CSR（客户端渲染）的前端应用中，以何种代码组织形式与后端交互是一个永恒的技术点。

### 基础请求库

#### Axios

[Axios](https://axios-http.com/zh/) 是一个基于 [promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 的网络请求库，可用于浏览器和 [Node.js](https://nodejs.org/zh-cn)（在服务端它使用原生 Node.js [http](https://nodejs.org/docs/latest/api/http.html) 模块, 而在客户端 (浏览端) 则使用 [XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)），它使用简单,包体积小且提供了易于扩展的接口。**Axios 几乎是当前最流行的前端请求库。**

#### ofetch

[ofetch](https://github.com/unjs/ofetch) 是 [fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) API 的增强版，是 Nuxt 框架的底层请求依赖。

### 传统请求封装思路

当前，在 Vue.js app 中最常见的的请求模块都是基于 Axios 进行封装：

::: code-group

```ts [utils/request.ts]
import axios from 'axios'

export const request = axios.create({
  // 通常使用环境变量区分本地代理和线上 API
  baseURL: 'xxx',
  // 设置 Authorization 等
  headers: {},
  timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  return Promise.reject(error)
})
```

```ts [apis/business.ts]
import { request } from '@/utils/request'

export function getBusinessByIdApi(id) {
  if (!id) {
    return
  }

  return request.get(`/business?id=${id}`)
}
```

```vue [views/business.vue]
<script lang="ts" setup>
import { getBusinessByIdApi } from '@/apis/business'
import { ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

const detail = shallowRef()
const loading = ref(false)
function refreshDetail(id) {
  if (loading.value) {
    return
  }

  loading.value = true
  getBusinessByIdApi(id).then((data) => {
    detail.value = data
  }).catch((e) => {
    console.error(e)
  }).finally(() => {
    loading.value = false
  })
}

const route = useRoute()
watch(() => route.query.id, (id) => {
  refreshDetail(id)
}, {
  immediate: true
})
</script>
```

:::

显然，如果遵循一定范式来调用 API 的话，整个流程还是较为繁琐的，从 Axios 的封装到数据的获取，需要依次通过三个模块节点，并且在 Vue 组件中获取数据的代码总是重复代码（样本代码），每次发起请求都需要从头写一遍，这就留下了优化空间。

## Pinia Colada

### 核心 API

[Pinia Colada](https://pinia-colada.esm.dev/) 基于 [Pinia](https://pinia.vuejs.org/zh/) 提供了一套当前 Vue.js 生态最优的异步状态管理方案，它利用 Vue.js 提供的逻辑复用方案 [composables](https://cn.vuejs.org/guide/reusability/composables) 避免了业务为了获取数据而写大量的样本代码，并透明支持**缓存**以及**请求去重**等实用功能。

#### useQuery

[useQuery](https://pinia-colada.esm.dev/guide/queries.html) 是 Pinia Colada 提供的基础查询用法，主要用于获取数据的场景中：

::: code-group

```vue [views/business.vue]
<script lang="ts" setup>
import { getBusinessByIdApi } from '@/apis/business'
import { useQuery } from '@pinia/colada' // [!code ++]
import { ref, shallowRef, watch } from 'vue' // [!code --]
import { useRoute } from 'vue-router'

const detail = shallowRef() // [!code --]
const loading = ref(false) // [!code --]
function refreshDetail(id) { // [!code --]
  if (loading.value) { // [!code --]
    return // [!code --]
  } // [!code --]
  loading.value = true // [!code --]
  getBusinessByIdApi(id).then((data) => { // [!code --]
    detail.value = data // [!code --]
  }).catch((e) => { // [!code --]
    console.error(e) // [!code --]
  }).finally(() => { // [!code --]
    loading.value = false // [!code --]
  }) // [!code --]
} // [!code --]

const route = useRoute()

const { data, isLoading, refresh } = useQuery({ // [!code ++]
  key: () => ['getBusinessByIdApi', route.query.id], // [!code ++]
  query: () => getBusinessByIdApi(route.query.id) // [!code ++]
}) // [!code ++]
</script>
```

:::

#### useMutation

[useMutation](https://pinia-colada.esm.dev/guide/mutations.html) 主要用于触发和跟踪具有副作用的一步操作状态，主要用于写入数据的场景：

::: code-group

```vue [views/business.vue]
<script lang="ts" setup>
import { createBusinessApi } from '@/apis/business'
import { useMutation } from '@pinia/colada'

const {
  mutate,
  isLoading
} = useMutation({
  mutation: data => createBusinessApi(data)
})
</script>
```

```ts [apis/business.ts]
import { request } from '@/utils/request'

export function createBusinessApi(data) {
  if (!id) {
    return
  }

  return request.post(`/business`, data)
}
```

:::

### 核心功能

- useQuery 获取的数据会利用 Pinia 进行缓存，再次调用时会优先使用缓存值
- useQuery 同一时间发起的请求，当 key 值相同时，会去重处理

## 总结

Pinia Colada 是在 Vue.js 3.x 版本背景下的新星，它拥抱 Composition API 并提供了一种更加有组织、模块化的代码结构，一边大幅度**减少了业务请求的样本代码**，一边又融入了**缓存**、**请求去重**等实用功能。个人认为在当前全面拥抱 Vue.js 3.x 的背景下，相比传统写法来说是一种更加合理的代码组织形式。
