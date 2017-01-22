import { Template } from 'meteor/templating';
import { Todos } from '../api/todos.js';

import './todo.js';
import './body.html';

Template.body.helpers({
  todos() {
    return Todos.find({}, { sort: { name: 1 } });
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
});
