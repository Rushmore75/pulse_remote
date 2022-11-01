"use strict";
function change_audio_settings(settings) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        // console.log(httpRequest.status)
    };
    var extension = "/set/" + settings.index +
        "/" + settings.volume +
        "/" + settings.mute;
    httpRequest.open("POST", extension);
    httpRequest.send();
}
// TODO make this async and wait on the 200 response
function get_audio_clients() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        // once the 200 code is received add information to the page
        if (httpRequest.status === 200) {
            console.log(httpRequest.status);
            var template = JSON.parse(httpRequest.responseText);
            create_selector(template);
        }
    };
    httpRequest.open("GET", "/outputs");
    httpRequest.send();
}
document.addEventListener("DOMContentLoaded", run);
function run() {
    var element = document.createElement("p");
    element.innerHTML = "JavaScript checking in!";
    document.body.appendChild(element);
    // change_vol(47, 65536, false);
    get_audio_clients();
}
// the function that gets called when devices are received 
function create_selector(devices) {
    console.log(devices);
    var form = document.createElement("form");
    form.action = "i haven't decided how this value gets moved";
    form.className = "form";
    form.id = "devices-form";
    var select = document.createElement("select");
    select.innerHTML = "Select audio output to manipulate\n"; // TODO this does nothing
    select.className = "select";
    // hold all the device's options elements
    var options = [];
    // create options from devices
    devices.all.forEach(function (device) {
        var option = document.createElement("option");
        option.innerHTML = device.name;
        option.id = device.index.toString();
        option.className = "option";
        options.push(option);
    });
    // append all available devices to the select element 
    options.forEach(function (i) {
        select.appendChild(i);
    });
    // finally append everything to DOM
    document.body.appendChild(form).appendChild(select);
    // Onchange callback
    form.onchange = function (event) {
        var _a;
        var name = (_a = event.target) === null || _a === void 0 ? void 0 : _a.value;
        console.log(name);
        devices.all.forEach(function (i) {
            if (i.name === name) {
                // populate interface with controls
                create_controller(i);
            }
        });
    };
}
function create_controller(device) {
    /*
    Create both the volume slider and a mute button.

    |> top div
    |   |> slider div
    |   |  |> mute div
    |   |  | mute button
    |   | volume slide
    */
    var top_div = document.createElement("div");
    function create_mute_button(device) {
        // setting up the mute button
        var mute_div = document.createElement("div");
        var muted_class = "mute-muted";
        var unmuted_class = "mute-un-muted";
        var button = document.createElement("button");
        button.innerHTML = "MUTE";
        button.className = device.mute ? muted_class : unmuted_class;
        // Call back
        button.onclick = function () {
            // TODO mute button
            device.mute = device.mute ? false : true; // flip flop
            button.className = device.mute ? muted_class : unmuted_class;
            change_audio_settings(device);
        };
        mute_div.appendChild(button);
        return mute_div;
    }
    function create_volume_slider(device) {
        // create all the elements and set their metadata
        // for the volume slider
        var slider_div = document.createElement("div");
        slider_div.className = "slider-div";
        var input = document.createElement("input");
        input.type = "range";
        input.min = "0";
        input.max = "100000";
        input.value = device.volume.toString();
        input.className = "volume-slider";
        slider_div.appendChild(input);
        input.onchange = function (event) {
            var _a;
            var volume = (_a = event.target) === null || _a === void 0 ? void 0 : _a.value;
            console.log(volume);
            device.volume = parseInt(volume);
            change_audio_settings(device);
        };
        slider_div.appendChild(create_mute_button(device));
        return slider_div;
    }
    top_div.appendChild(create_volume_slider(device));
    document.body.appendChild(top_div);
}
