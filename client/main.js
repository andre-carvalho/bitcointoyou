import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor'

import './main.html';

Template.info.onCreated(function infoOnCreated() {
  Template.info.values=[];
  Template.info.refreshRate=5;// in minutes
  Template.info.historyCache=2;// history in hours
  Template.info.defaultVarRate=1;
  Template.info.taskId=-1;
  Template.info.startingCallAPI();
});

Template.info.storeLastValue=function(aValue) {
  var maxLength=Template.info.historyCache*60/Template.info.refreshRate;
  if(Template.info.values.length>maxLength) {
    Template.info.values.shift();
  }
  Template.info.values.push(aValue);
  
};

Template.info.restartTask=function() {
  if(Template.info.taskId>0) {
    Meteor.clearTimeout(Template.info.taskId);
    Template.info.startingCallAPI();
  }
};

Template.info.events({
  'change #selectRates'(event) {
    event.preventDefault();
    var selectedValue = event.target.value;
    Template.info.defaultVarRate=+selectedValue;
    Template.info.restartTask();
  },
  'change #selectRefresh'(event) {
    event.preventDefault();
    var selectedValue = event.target.value;
    Template.info.refreshRate=+selectedValue;
    Template.info.restartTask();
  },
  'change #selectCache'(event) {
    event.preventDefault();
    var selectedValue = event.target.value;
    Template.info.historyCache=+selectedValue;
    Template.info.restartTask();
  }
});

Template.info.verifyLimiar=function(percent) {
  var reference=Template.info.defaultVarRate;
  if(percent>=reference && Meteor.isCordova) {
    // meteor add cordova:org.apache.cordova.dialogs@0.2.10
    // meteor update
    navigator.notification.beep(2);
  }
};

Template.info.calculatingVariation=function() {
  var first=Template.info.values[0],
  last=Template.info.values[Template.info.values.length-1],
  diff=0, ref=0, percent=0,upOrDown='';
  if(first>last) { // price down
    ref=first;
    diff=first-last;
    upOrDown='-';
  }else {// price up
    ref=last;
    diff=last-first;
    upOrDown='+';
  }
  // ref  === 100%
  // diff === X%
  percent=diff*100/ref;
  percent=percent.toFixed(3);
  
  return {variation:upOrDown,percent:+percent};
};

Template.info.startingCallAPI=function() {

  var json={};
  HTTP.call('POST', 'https://www.bitcointoyou.com/API/ticker.aspx', {
    data: {}
  }, (error, result) => {
    if (!error) {
      json=JSON.parse(result.content);
      json=json.ticker;
      var buy=+json.buy;
      buy=buy.toFixed(3);
      var sell=+json.sell;
      sell.toFixed(3);
      document.getElementById('last').innerText=json.last;
      document.getElementById('high').innerText=json.high;
      document.getElementById('low').innerText=json.low;
      document.getElementById('buy').innerText=buy;
      document.getElementById('sell').innerText=sell;
      Template.info.storeLastValue(json.last);
      var values=Template.info.calculatingVariation();
      Template.info.verifyLimiar(values.percent);// to play beep
      document.getElementById('percent').innerText=' '+values.variation+values.percent+'%';
      document.getElementById('percent').style.color=( (values.variation=='+')?('#006600'):('#CC0000') );
      Template.info.taskId=Meteor.setTimeout(Template.info.startingCallAPI, Template.info.refreshRate*60000);
    }
  });
};
