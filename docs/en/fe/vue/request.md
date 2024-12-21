# Best Request Solution in Vue.js Ecosystem

So far, the best request solution for the [Vue.js](https://vuejs.org/) ecosystem (excluding [Nuxt](https://nuxt.com/)) I currently recommend [Axios](https://axios-http.com/) + [Pinia Colada](https://pinia-colada.esm.dev/).

## Background

Vue.js is one of the most popular front-end application development frameworks in the world. Countless front-end applications are built on it. In most CSR (client-side rendering) front-end applications, how to organize the code to interact with the back-end is an eternal technical point.

### Basic request library

#### Axios

[Axios](https://axios-http.com/zh/) is a network request library based on [promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), which can be used in browsers and [Node.js](https://nodejs.org/zh-cn) (it uses the native Node.js [http](https://nodejs.org/docs/latest/api/http.html) module on the server side, and [XMLHttpRequest](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) on the client side (browser side)). It is simple to use, small in size and provides an easy-to-extend interface. **Axios is almost the most popular front-end request library at present.**

#### ofetch

[ofetch](https://github.com/unjs/ofetch) is an enhanced version of the [fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API) API and is the underlying request dependency of the Nuxt framework.

### Traditional request encapsulation ideas

Currently, the most common request modules in Vue.js app are encapsulated based on Axios :

::: code-group

```ts [utils/request.ts]
import axios from 'axios'

export const request = axios.create({
  // Environment variable is often used to distinguish between local agents and online API
  baseURL: 'xxx',
  // Set Authorization, etc.
  headers: {},
  timeout: 10000,
})

// Request Interceptor
request.interceptors.request.use((config) => {
  return config
}, (error) => {
  return Promise.reject(error)
})

// Response Interceptor
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

Obviously, if you follow a certain paradigm to call the API, the whole process is still relatively cumbersome. From Axios encapsulation to data acquisition, you need to pass through three module nodes in sequence, and the code for obtaining data in the Vue component is always repeated code (sample code). Each request needs to be written from scratch, which leaves room for optimization.

## Pinia Colada

### Core API

Pinia Colada provides a set of optimal asynchronous state management solutions for the current Vue.js ecosystem based on [Pinia](https://pinia.vuejs.org/zh/). It uses the logic reuse solution [composables](https://cn.vuejs.org/guide/reusability/composables) provided by Vue.js to avoid writing a lot of boilerplate code to obtain data, and transparently supports practical functions such as **caching** and **request deduplication**.

#### useQuery

[useQuery](https://pinia-colada.esm.dev/guide/queries.html) is the basic query usage provided by Pinia Colada, which is mainly used in scenarios where data is obtained:

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

[useMutation](https://pinia-colada.esm.dev/guide/mutations.html) is mainly used to trigger and track the status of a step operation with side effects, mainly used in scenarios where data is written:

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

### Core Features

- The data obtained by useQuery will be cached using Pinia, and the cached value will be used first when it is called again
- Requests initiated at the same time by useQuery will be de-duplicated when the key value is the same

## Summarize

Pinia Colada is a rising star in the context of Vue.js 3.x. It embraces the Composition API and provides a more organized and modular code structure. It greatly reduces the boilerplate code for business requests while incorporating practical features such as caching and request deduplication. I personally think that in the context of fully embracing Vue.js 3.x, it is a more reasonable form of code organization than traditional writing.
