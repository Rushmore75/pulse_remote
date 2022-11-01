"use strict";
function change_audio_settings(settings) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
    };
    var extension = "/set/" + settings.index +
        "/" + settings.volume +
        "/" + settings.mute;
    httpRequest.open("POST", extension);
    httpRequest.send();
}
function get_audio_clients() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        if (httpRequest.status === 200) {
            console.debug(httpRequest.status);
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
    get_audio_clients();
}
function create_selector(devices) {
    var form = document.createElement("form");
    form.className = "form";
    form.id = "devices-form";
    var selectElement = document.createElement("select");
    selectElement.className = "select";
    var options = [];
    devices.all.forEach(function (device) {
        var option = document.createElement("option");
        option.innerHTML = device.name;
        option.id = device.index.toString();
        option.className = "option";
        options.push(option);
    });
    options.forEach(function (i) {
        selectElement.appendChild(i);
    });
    document.body.appendChild(form).appendChild(selectElement);
    form.onchange = function (event) {
        var _a;
        var name = (_a = event.target) === null || _a === void 0 ? void 0 : _a.value;
        console.debug("Selecting: " + name);
        devices.all.forEach(function (i) {
            var _a;
            if (i.name === name) {
                var old = document.getElementById("controls-div");
                (_a = old === null || old === void 0 ? void 0 : old.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(old);
                create_controller(i);
            }
        });
    };
}
function create_controller(device) {
    var top_div = document.createElement("div");
    top_div.id = "controls-div";
    function create_mute_button(device) {
        var mute_div = document.createElement("div");
        var muted_class = "mute-muted";
        var unmuted_class = "mute-un-muted";
        var button = document.createElement("button");
        button.innerHTML = "MUTE";
        button.className = device.mute ? muted_class : unmuted_class;
        button.onclick = function () {
            device.mute = device.mute ? false : true;
            button.className = device.mute ? muted_class : unmuted_class;
            change_audio_settings(device);
        };
        mute_div.appendChild(button);
        return mute_div;
    }
    function create_volume_slider(device) {
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
            device.volume = parseInt(volume);
            change_audio_settings(device);
        };
        slider_div.appendChild(create_mute_button(device));
        return slider_div;
    }
    top_div.appendChild(create_volume_slider(device));
    document.body.appendChild(top_div);
}
