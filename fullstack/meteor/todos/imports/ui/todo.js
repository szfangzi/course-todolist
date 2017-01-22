import { Template } from 'meteor/templating';

import { Todos } from '../api/todos.js';

import './todo.html';

Template.todo.events({
  'click input[type=checkbox]'() {

    //更新是否完成的状态
    Todos.update(this._id, {
      $set: { isTick: ! this.isTick },
    });
  },
  //删除任务
  'click button'() {
    Todos.remove(this._id);
  },
});
