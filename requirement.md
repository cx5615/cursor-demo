1. 技术栈
react ^19
react-router-dom ^7
vite ^7
@xyflow/react ^12
redux ^5
antd ^6
typescript ^5

2. 项目描述
生成一个react项目模板，包含路由和路由访问控制，可以模拟一个登录用户存放在sessionStorage中，如果已经登录了才可以访问内容页面。
包含多个页面，登录页面、Home页面、About页面、react-flow流程展示页面。
react-flow页面的展示数据用redux存取。
页面基于antd开发，内容页以广字形展示，顶部是log、快速搜素框、多语言切换、用户登录信息等，左侧是系统菜单且支持折叠，右下角是页面内容展示区。
加上一个前端proxy，将前端所有以/api开头的请求都指向http://localhost:3000，前端默认用3002端口登录。

3. 集成接口
3.1 登录接口
URL：http://localhost:3000/api/chefs/login
Method：POST
Headers
    content-type：application/json
Payload：{"username":"ChefJohn","password":"123456"}
Response：
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Chef John",
        "username": "ChefJohn"
    },
    "message": "Login successful"
}

登录成功之后，所有的请求都会在headers中加一个x-chef-id字段，传当地登录用户的id。

3.2 列表页面
新增一个Ingredient管理页面。

3.2.1 列表展示
支持模糊搜索和分页，列表上方左侧是一个搜索框，右侧是一个New 按钮，列表每一行数据后面有Edit和Delete按钮。
URL：http://localhost:3000/api/ingredients
Method：GET
Headers
    content-type：application/json
    x-chef-id：1
Payload：current=1&pageSize=10&search=W
Response：
{
    "success": true,
    "data": [
        {
            "id": 3,
            "name": "Water",
            "unit": "ml",
            "createdAt": "2025-11-27T12:42:23.730Z",
            "updatedAt": "2025-11-27T12:42:23.730Z"
        }
    ],
    "total": 1,
    "current": 1,
    "pageSize": 10
}

3.2.2 新增Ingredient
点击Ingredient列表右上方的New按钮弹出新增Ingredient窗体。
Ingredient包含Name和Unit属性，都是必填项且长度小于等于255个字符。
新增成功需刷新列表，否则弹出错误信息。
URL：http://localhost:3000/api/ingredients
Method：POST
Headers
    content-type：application/json
    x-chef-id：1
Payload：{"name":"Milk","unit":"ml"}
Response：
{
    "success": true,
    "data": {
        "id": 4,
        "name": "Milk",
        "unit": "ml",
        "createdAt": "2025-11-30T02:19:04.990Z",
        "updatedAt": "2025-11-30T02:19:04.990Z"
    },
    "message": "Ingredient created successfully"
}

3.2.3 编辑Ingredient
点击列表每一行的Edit按钮，弹出编辑框并填充初始数据。
编辑可以和新增公用一个Form，通过标记字段来区分是新增还是编辑。
URL：http://localhost:3000/api/ingredients/4
Method：PUT
Headers
    content-type：application/json
    x-chef-id：1
Payload：{"name":"Milk","unit":"ml"}
Response：
{
    "success": true,
    "data": {
        "id": 4,
        "name": "Milk",
        "unit": "ml",
        "createdAt": "2025-11-30T02:19:04.990Z",
        "updatedAt": "2025-11-30T02:19:04.990Z"
    },
    "message": "Ingredient created successfully"
}

3.2.3 删除Ingredient
点击列表每一行的Delete按钮，先弹出提示是否确定删除，如果选确定执行删除操作。
URL：http://localhost:3000/api/ingredients/4
Method：DELETE
Headers
    content-type：application/json
    x-chef-id：1
Response：
{
    "success": true,
    "message": "Ingredient deleted successfully"
}