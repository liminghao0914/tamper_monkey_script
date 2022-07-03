// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://www.dpm.org.cn/*
// @icon         https://www.dpm.org.cn/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  // set global window storage
  var localStorage = window.localStorage;
  // get all elements
  var elements = document.getElementsByTagName("*");

  var record = { title: window.location.href };
  // read json
  if (localStorage.getItem("record") === null) {
    // save json
    var json = JSON.stringify(record);
    // save to local storage
    localStorage.setItem("record", json);
  }

  function addListeners() {
    for (var i = 0; i < elements.length; i++) {
      elements[i].onclick = function () {
        // print href
        if (this.href) {
          try {
            // template for step
            const step = {
              title: this.innerText,
              url: this.href,
              type: "body",
              time: (Date.now() / 1000) | 0,
            };
            // read local storage
            var localStorage_tmp = window.localStorage;
            var record_tmp = JSON.parse(localStorage_tmp.getItem("record"));
            console.log(this.href);
            console.log((Date.now() / 1000) | 0);
            console.log(record_tmp);
            // check if header
            checkIfHeader("header", this, step);
            // add step
            // if no key steps, create one
            if (!record_tmp.hasOwnProperty("steps")) {
              record_tmp.steps = [step];
            } else {
              record_tmp.steps.push(step);
            }
            // save json
            var json = JSON.stringify(record_tmp);
            // save to local storage
            localStorage_tmp.setItem("record", json);
          } catch (e) {
            console.log(e);
          }
        }
      };
    }
  }
  addListeners();
  // add keyboard listener
  document.addEventListener("keydown", function (e) {
    if (e.key === "s") {
      try {
        console.log("save");
        var curr_localStorage = window.localStorage;
        var curr_record = JSON.parse(curr_localStorage.getItem("record"));
        // save json
        var json = JSON.stringify(curr_record);
        var blob = new Blob([json]);
        var href = URL.createObjectURL(blob);
        download(href, 'record.json', 'text/json');
        URL.revokeObjectURL(href);
      } catch (e) {
        console.log(e);
      }
    }
    if (e.key === "t") {
      var localStorage_tmp = window.localStorage;
      var record_tmp = JSON.parse(localStorage_tmp.getItem("record"));
      console.log(record_tmp);
    }
    if (e.key === "r") {
      localStorage.clear();
    }
  });

  // download function
  function download(href, title) {
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('download', title);
    a.click();
  }

  // check if the node is in header
  function checkIfHeader(keyword, node, step) {
    if (node.parentNode) {
      if (
        node.parentNode.className === keyword ||
        node.parentNode.id === keyword
      ) {
        step.type = keyword;
      } else {
        checkIfHeader(keyword, node.parentNode, step);
      }
    }
  }
})();
