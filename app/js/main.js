/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

//RNBT-2F2B
var bluetooth_adapter = null;
var paired_devices = null;
var PINCODE = "497154";

document.getElementById("reflesh").addEventListener("click", function(e) {
  window.location.reload();
});

document.getElementById("led-on").addEventListener("click", function(e) {
  /*
  var pick = new MozActivity({
    name: "share",
    data: {
      number: 1
    }
  });
  pick.onsuccess = function() {
  };
  pick.onerror = function() {
    alert(pick.error);
  }
  */
  send("1");
});

document.getElementById("led-off").addEventListener("click", function(e) {
  send("0");
});

function approach1(device, content) {  
  var blob = new Blob([content]); 
  var req = bluetooth_adapter.sendFile(device.address, blob);
  req.onsuccess = function() {
    alert("sent");
  };
  req.onerror = function() {
    alert(req.error.name);
  };
}

function approach2(device, content) {  
  // https://www.bluetooth.org/Technical/AssignedNumbers/service_discovery.htm
  var req = bluetooth_adapter.connect(device, 0x1124);
  req.onsuccess = function() {
    alert("success");
  };
  req.onerror = function() {
    alert(req.error.name);
  };
}

function send(content) {
  var index = document.getElementById("paired-devices").value;
  var device = paired_devices[index];
  approach1(device, content);
  approach2(device, content);
}

function initializeDefaultAdapter(callback) {
  var bluetooth = window.navigator.mozBluetooth;
  if (!bluetooth) {
    alert("bluetooth module is not found");
    return;
  }
  if (false == bluetooth.enabled) {
    alert("bluetooth is not enabled");
    return;
  }
  var req = bluetooth.getDefaultAdapter();
  req.onsuccess = function () {
    bluetooth_adapter = req.result;
    callback();
  };
  req.onerror = function () {
    alert("could not initialize default adapter");
  };  
}

function loadPairedDevice(adapter) {  
  var req = bluetooth_adapter.getPairedDevices();
  req.onsuccess = function () {
    var devices = req.result;
    var length = devices.length;
    if (length == 0) {
      var msg = "There is no paired device!";
      alert(msg);
      return;
    }
    var devicesSelect = document.getElementById("paired-devices");
    devicesSelect.options.length = 0;
    for (var i = 0; i < length; i++) {
      var device = devices[i];
      devicesSelect.options[i] = new Option(device.name, i);
    }
    paired_devices = devices;
  };
  req.onerror = function() {
    var msg = 'Can not get paired devices from adapter.';
    alert(msg);
  };
}

initializeDefaultAdapter(function() {
  loadPairedDevice();
});