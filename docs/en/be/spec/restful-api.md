# RESTful API Design Specification

RESTful API is a set of specifications for building APIs based on REST.

::: tip REST
REST is the abbreviation of `REpresentational State Transfer` ("resources" are "transferred" in a certain "form" during network transmission).
:::

## Structure

::: info Expect
The best structure is one that allows people to understand what the operation is at a glance.
:::

```
<METHOD> <ORIGIN>/<VERSION>/<URI>
```

### METHOD

| Request method |                      Description                       | Is the call idempotent ? |
| :------------: | :----------------------------------------------------: | :----------------------: |
|      GET       |             get resources from the server              |           yes            |
|      POST      |          create a new resource on the server           |            no            |
|      PUT       |     fully update specific resources on the server      |           yes            |
|     DELETE     |      delete the specified resource on the server       |           yes            |
|     PATCH      | partially update the specified resources on the server |           yes            |

### ORIGIN

API services should be deployed under a specific domain name as much as possible, with a structure such as: `https://one.litingyes.top`. If the front-end and back-end share the same domain name, they can be deployed under `https://one.litingyes.top/api`.

### VERSION

Control and manage version upgrades by adding version numbers to the `API path`, such as `v1`/`v2`.

### URI

Each URI represents a resource type, which can be a collection of resources or a specific resource.

#### Naming convention

- No verbs, only nouns, preferably **plural nouns**
- It cannot contain uppercase letters. It is recommended to use `-` instead of `_`, that is, the corresponding regular expression is `/[a-z\-]/`

### Example

```http
// Get a list of books
GET https://one.litingyes.top/api/v1/books

// Delete the book information with ID 1
DELETE https://one.litingyes.top/api/v1/books/1
```
