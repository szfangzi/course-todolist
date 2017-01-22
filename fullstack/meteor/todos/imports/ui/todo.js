import { Template } from 'meteor/templating';

import { Todos } from '../api/todos.js';

import './todo.html';

Template.todo.events({
  'click input[type=checkbox]'() {
    console.log(this);
    // Set the checked property to the opposite of its current value
    Todos.update(this._id, {
      $set: { isTick: ! this.checked },
    });
  },
  'click button'() {
    Todos.remove(this._id);
  },
});
