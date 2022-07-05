// ==UserScript==
// @name         DPM
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
  // get body
  var body = document.getElementsByTagName("body")[0];

  var record = { title: window.location.href };
  // read json
  if (localStorage.getItem("record") == null) {
    // save json
    var json = JSON.stringify(record);
    // save to local storage
    localStorage.setItem("record", json);
  } else {
    // recording on
    createElementRC(body);
  }

  // init
  addListeners();
  createElementTime(body);

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
        download(href, "DPM_record.json", "text/json");
        URL.revokeObjectURL(href);
      } catch (e) {
        console.log(e);
      }
    }
    if (e.key === "r") {
      var localStorage_tmp = window.localStorage;
      var record_tmp = JSON.parse(localStorage_tmp.getItem("record"));
      console.log(record_tmp);
      // if recording is not exist, create it
      if (document.getElementById("recording") === null) {
        createElementRC(body);
        // createVideoRecorder();
      } else {
        alert("recording...");
      }
    }
    if (e.key === "c") {
      localStorage.clear();
      // refresh page
      window.location.reload();
      if (document.getElementById("recording") === null) {
        alert("has already cleared!");
      }
      // if timestamp is exist, remove it
      else {
        body.removeChild(document.getElementById("recording"));
      }
    }
    if (e.key === "t") {
      // if timestamp is not exist, create it
      if (document.getElementById("timestamp") === null) {
        createElementTime(body);
      }
      // if timestamp is exist, remove it
      else {
        body.removeChild(document.getElementById("timestamp"));
      }
    }
    if (e.key === "p") {
      var localStorage_tmp = window.localStorage;
      var record_tmp = JSON.parse(localStorage_tmp.getItem("record"));
      console.log(record_tmp);
    }
  });

  // add mouse scroll listener
  document.addEventListener("scroll", function () {
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      console.log("reach the bottom");
      var scroll = {
        title: window.location.href,
        time: (Date.now() / 1000) | 0,
        event: "pageend",
      };
      modifyRecords("scrolls",scroll);
    }
  });

  // add onready listener
  document.addEventListener("readystatechange", function(){
    var scroll = {
      title: window.location.href,
      time: (Date.now() / 1000) | 0,
      event: "pagestart",
    };
    modifyRecords("scrolls",scroll);
  })

  async function createVideoRecorder() {
    let stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    // recording in mp4 format

    let mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
      ? "video/webm; codecs=vp9"
      : "video/webm";
    let mediaRecorder = new MediaRecorder(stream, {
      mimeType: mime,
    });
    let recordedChunks = [];
    mediaRecorder.addEventListener("dataavailable", (event) => {
      recordedChunks.push(event.data);
    });
    mediaRecorder.addEventListener("stop", () => {
      let blob = new Blob(recordedChunks, {
        type: mime,
      });
      let href = URL.createObjectURL(blob);
      download(href, "record.webm");
      URL.revokeObjectURL(href);
    });
    mediaRecorder.start();
  }

  // download function
  function download(href, title) {
    const a = document.createElement("a");
    a.setAttribute("href", href);
    a.setAttribute("download", title);
    a.click();
  }

  // create element recording
  function createElementRC(elem) {
    var recording = document.createElement("div");

    const keyframe =
      "@keyframes recording{\
      from {\
          opacity: 1.0;\
      }\
      50% {\
          opacity: 0.4;\
      }\
      to {\
          opacity: 1.0;\
      }\
    }";
    const style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = keyframe;
    document.getElementsByTagName("head")[0].appendChild(style);

    // set recording styles
    recording.style.position = "fixed";
    recording.style.top = "6px";
    recording.style.left = "140px";
    recording.style.width = "12px";
    recording.style.height = "12px";
    recording.style.backgroundColor = "#ff0000bf";
    recording.style.borderRadius = "50%";
    recording.style.zIndex = "9999";
    recording.style.animation = "recording 1s infinite";

    recording.setAttribute("id", "recording");
    elem.appendChild(recording);
  }

  // create element timestamp
  function createElementTime(elem) {
    var time_elem = document.createElement("time");

    // set time_elem styles
    time_elem.style.position = "fixed";
    time_elem.style.top = "0";
    time_elem.style.left = "0";
    time_elem.style.width = "130px";
    time_elem.style.padding = "0 2px 0 2px";
    time_elem.style.color = "white";
    time_elem.style.backgroundColor = "#1c1d1e";
    time_elem.style.opacity = "80%";
    time_elem.style.fontSize = "large";
    time_elem.style.fontWeight = "bold";
    time_elem.style.fontFamily = "system-ui";
    time_elem.style.zIndex = "9999";
    time_elem.style.textAlign = "center";

    time_elem.setAttribute("id", "timestamp");
    elem.appendChild(time_elem);
    // update every second
    setInterval(function () {
      var time = (Date.now() / 1000) | 0;
      time_elem.innerHTML = time;
    }, 100);
  }

  // modify records
  function modifyRecords(key_name, key) {
    // read local storage
    var localStorage_tmp = window.localStorage;
    var record_tmp = JSON.parse(localStorage_tmp.getItem("record"));

    // add step
    // if no key steps, create one
    if (!record_tmp.hasOwnProperty(key_name)) {
      record_tmp[key_name] = [key];
    } else {
      record_tmp[key_name].push(key);
    }

    // save json
    var json = JSON.stringify(record_tmp);
    // save to local storage
    localStorage_tmp.setItem("record", json);
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

  // add listeners to all elements
  function addListeners() {
    for (var i = 0; i < elements.length; i++) {
      elements[i].onclick = function () {
        // print href
        if (this.href) {
          try {
            // template for click
            var click = {
              title: this.innerText,
              url: this.href,
              type: "body",
              time: (Date.now() / 1000) | 0,
            };
            // check if header
            checkIfHeader("header", this, click);
            modifyRecords("clicks", click);
          } catch (e) {
            console.log(e);
          }
        }
      };
      elements[i].onmouseenter = function () {
        if (this.tagName === "A") {
          try {
            // template for hover
            var hover = {
              title: this.innerText,
              type: "body",
              time: (Date.now() / 1000) | 0,
              event: "mouseenter",
            };
            if (this.href) {
              hover.url = this.href;
            } else {
              hover.url = "";
            }
            // check if header
            checkIfHeader("header", this, hover);
            modifyRecords("hovers", hover);
          } catch (e) {
            console.log(e);
          }
        }
      };
      elements[i].onmouseleave = function () {
        if (this.tagName === "A") {
          try {
            // template for hover
            var hover = {
              title: this.innerText,
              type: "body",
              time: (Date.now() / 1000) | 0,
              event: "mouseleave",
            };
            if (this.href) {
              hover.url = this.href;
            } else {
              hover.url = "";
            }
            // check if header
            checkIfHeader("header", this, hover);
            modifyRecords("hovers", hover);
          } catch (e) {
            console.log(e);
          }
        }
      };
    }
  }
})();