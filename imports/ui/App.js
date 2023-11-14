import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TasksCollection } from "../api/TasksCollection";
import './App.html';

const IS_LOADING_STRING = "isLoading";

const HIDE_COMPLETED_STRING = "hideCompleted";


Template.mainContainer.events({
  "click #hide-completed-button"(event, instance) {
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  }
});



Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();

  const handler = Meteor.subscribe('tasks');
  Tracker.autorun(() => {
    this.state.set(IS_LOADING_STRING, !handler.ready());
  });
  console.log(handler.ready());
});

Template.mainContainer.helpers({
  
  isLoading() {
    const instance = Template.instance();
    return instance.state.get(IS_LOADING_STRING);
  },
  tasks() {
    const instance = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

    const hideCompletedFilter = { isChecked: { $ne: true } };

    const query = hideCompleted ? hideCompletedFilter : {}
    
    const tasks = TasksCollection.find(query, {
      sort: { createdAt: -1 }}
    ).fetch();
    return tasks
  },
  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },
});


