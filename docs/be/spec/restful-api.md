# RESTful API 设计规范

RESTful API 是一套基于 REST 构建 API 的规范。

::: tip REST
REST 是 `REpresentational State Transfer` 的缩写，这个词组翻译过来可称 “表现层状态转化”（“资源”在网络传输中以某种“表现形式”进行“状态转移”）。
:::

## 结构

::: info 期望
最好的结构是能让人一眼读懂是什么操作
:::

```
<METHOD> <ORIGIN>/<VERSION>/<URI>
```

### METHOD（方法）

| 请求方法 |           描述           | 调用是否幂等 |
| :------: | :----------------------: | :----------: |
|   GET    |    从服务器上获取资源    |      是      |
|   POST   |   在服务器上创建新资源   |      否      |
|   PUT    | 全量更新服务器上特定资源 |      是      |
|  DELETE  |   删除服务器上指定资源   |      是      |
|  PATCH   | 部分更新服务器上指定资源 |      是      |

### ORIGIN（域名）

API 服务应该尽量部署在特定的域名下，结构如：`https://one.litingyes.top`，若前后端共用一个域名，则可部署在 `https://one.litingyes.top/api` 下。

### VERSION（版本）

通过在 `API path` 中添加版本号来控制和管理版本的升级迭代，如 `v1`/`v2`。

### URI（资源）

每个 URI 代表一种资源类型，它既可以是一组资源的集合，也可以是特定的某一个资源。

#### 命名规则

- 不能有动词，只能是名词，并且最好是 **复数名词**
- 不能含有大写字母，建议用 `-` 而不是 `_`，即对应正则为 `/[a-z\-]/`

### 示例

```http
// 获取书籍列表
GET https://one.litingyes.top/api/v1/books

// 删除 ID 为 1 的书籍信息
DELETE https://one.litingyes.top/api/v1/books/1
```
