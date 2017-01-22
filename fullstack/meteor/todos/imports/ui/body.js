import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Todos } from '../api/todos.js';

import './todo.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
});

Template.body.helpers({
  todos() {
    const instance = Template.instance();
    if (instance.state.get('todosType') === 'unf') {
      //未完成任务
      return Todos.find({ isTick:false });
    }else if (instance.state.get('todosType') === 'f') {
      //已完成任务
      return Todos.find({ isTick:true });
    }
    // 所有任务
    return Todos.find({});
  },
  unflen() {
    return Todos.find({ isTick:false}).count();
  },
});
Template.body.events({
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const name = target.todo.value;

    // Insert a task into the collection
    Todos.insert({
      name,
      isTick: false
    });

    // Clear form
    target.todo.value = '';
  },
  'click #all-btn'(event, instance) {
    instance.state.set('todosType', 'all');
  },
  'click #unf-btn'(event, instance) {
    instance.state.set('todosType', 'unf');
  },
  'click #f-btn'(event, instance) {
    instance.state.set('todosType', 'f');
  },
  'click #del-f-btn'(event, instance) {
    Todos.find({ isTick:true }).map(function (n) {
      Todos.remove(n._id)
    });
  }
});
