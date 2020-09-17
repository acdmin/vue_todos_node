import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Todo from '@/pages/Todo'
import TodoEdit from '@/components/todo/TodoEdit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/todo',
      name: 'todo',
      component: Todo
    },
    {
        path: "/todo",
        redirect: "todo"
    },
    {
        path: "*",
        redirect: "todo"
    },
    {
      path: '/todo/:id',
      name: 'todoedit',
      component: TodoEdit
    }
  ]
})
