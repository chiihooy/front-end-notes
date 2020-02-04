// 要安装 redux react-redux （生产环境）和 redux-devtools （开发环境）
// yarn add redux react-redux
// yarn add redux-devtools --dev (-D)


// * 1.写组件
// 需要使用redux对数据进行操作时，先写store


// * 2.store的写法

import { createStore, compose } from 'redux'
import reducers from './reducer.js'
// 创建store
// 配置调试工具，compose、composeEnhancers都是用来配置调试工具的
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(reducers, composeEnhancers())
export default store

// 同时在首页还需用 Provider把store给传递进去
import { Provider } from 'react-redux'
import store from './store/store'
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
)

// store的创建，需要reducer参数


// * 3.reducer的写法

// reducer就是一个以state、action为参数的函数，这个函数里面写了当action.type为何种操作时，返回不同的想要得到的新对象，这一操作可以使用immer。
// 这个state参数可以给个初始值。同时reducer需要有默认返回值，直接返回原样的state就可以
// 多个不同的reducer可以合并combineReducers成一个大的reducer

// 最后生成的State存储就是以这个reducer的名字命名的对象，对象里面包含了state参数的初始值对象的各个属性

// {
//   todoList: {
//     todos: [],
//     filter: 'all'
//   }
// }

// reducers.js

import { combineReducers } from 'redux'
import produce from 'immer'

const initState = {
  todos: [],
  filter: 'all' //all,complete,active
}

// 这个一般放到action中去
const ADD_TODO = 'ADD_TODO'

// 这是reducer
const todoList = (state = initState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return produce(state, state => {
        state.todos.push({ content: action.content, complete: false })
      })
    default:
      return state
  }
}

// 可以合并多个reducer
const reducers = combineReducers({ todoList })

export default reducers


// * 4.APP组件中的数据处理

import React from 'react'
import { useState } from 'react'
import { connect } from 'react-redux'
// import { addTodo } from '../store/actions'

const App = props => {
  const [inputValue, setInputValue] = useState('')
  console.log('App->props', props)
  return (
    <div>
      <h1>Todo</h1>
      <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} />
      <button onClick={() => props.handleAddTodo(inputValue)}>添加</button>
    </div>
  )
}

// mapStateToProps
// state参数是todoList：{state的数据}，即总体的数据。（注：todoList是reducer的名字）
// 用到了总体state数据的哪些，就写在返回对象的属性上，它会被注入到props中去
const mapStateToProps = state => {
  // console.log('connect->state', state)
  return {
    todos: state.todoList
  }
}

// mapDispatchToProps
// 会把返回对象的属性，全部注入到props中去
// 可以仅返回一个{dispatch:dispatch}，之后在组件内部写个handleAddTodo = inputValue => { dispatch({ type: 'ADD_TODO', content: inputValue }) }，并通过按钮点击触发
// 这里的写法就是把组件内部的handleAddTodo提出来放在mapDispatchToProps里面，这样组件内部就是直接调用props上的handleAddTodo方法就可以了
const mapDispatchToProps = dispatch => {
  // console.log('connect->dispatch', dispatch)
  return {
    handleAddTodo: inputValue => {
      dispatch({ type: 'ADD_TODO', content: inputValue })
      // addTodo方法写在action中的，addTodo(text){ return { type: 'ADD_TODO', content: text} }
      // dispatch(addTodo(inputValue))
    }
  }
}

// connect方法就是一个高阶函数，传入App组件，之后把mapStateToProps, mapDispatchToProps返回的两个对象的可枚举属性全部注入到props上面
// 这样就让App组件既能拿到mapStateToProps传来的state值，也可以拿到mapDispatchToProps传来的dispatch方法（一般直接封装成组件内部要使用的函数）
// 需要会自己实现！
export default connect(mapStateToProps, mapDispatchToProps)(App)


// * 5.actions的写法

// actions文件不是必须的，在小项目里面没有必要把action type常量抽离成单独一个模块，甚至根本不需要定义
// 但在大型应用中把它们显式地定义成常量还是利大于弊的。

export const ADD_TODO = 'ADD_TODO'

// mapDispatchToProps函数里面 dispatch 调用的参数 就是底下 这个函数调用的返回值
export const addTodo = inputValue => {
  return {
    type: ADD_TODO,
    content: inputValue
  }
}
