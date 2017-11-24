import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.currentValue = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().currentValue.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    var json={};
    HTTP.call('POST', 'https://www.bitcointoyou.com/API/ticker.aspx', {
      data: { some: 'json', stuff: 1 }
    }, (error, result) => {
      if (!error) {
        json=JSON.parse(result.content);
        document.getElementById('currentValue').innerText=json.ticker.last;
        //instance.currentValue.set(json.ticker.last);
      }
    });
    // increment the counter when button is clicked
    // instance.currentValue.set(json.currentValue);
  },
});
