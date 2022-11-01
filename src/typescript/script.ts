document.addEventListener("DOMContentLoaded", run)

function run(): void {
    var element = document.createElement("p");
    element.innerHTML = "JavaScript checking in!";
    document.body.appendChild(element);

    // change_vol(47, 65536, false);
    get_audio_clients();

}


// the function that gets called when devices are received 
function create_selector(devices: Devices) {
    
    console.log(devices);
    var form: HTMLFormElement = document.createElement("form");
        form.action = "i haven't decided how this value gets moved";
        form.className = "form";
        form.id = "devices-form"
    var select = document.createElement("select");
        select.innerHTML = "Select audio output to manipulate\n" // TODO this does nothing
        select.className = "select"

    // hold all the device's options elements
    const options: HTMLOptionElement[] = [];
    // create options from devices
    devices.all.forEach(device => {
        var option = document.createElement("option");
        option.innerHTML = device.name;
        option.id = device.index.toString();
        option.className = "option";
        options.push(option)
    });
    // append all available devices to the select element 
    options.forEach(i => {
        select.appendChild(i);
    })

    // finally append everything to DOM
    document.body.appendChild(form).appendChild(select);
    

    // Onchange callback
    form.onchange = (event) => {
        var name = (event.target as HTMLSelectElement)?.value;
        console.log(name);
        devices.all.forEach(i => {
            if (i.name === name) {
                // populate interface with controls
                create_controller(i);
            }
        });
    }
}

function create_controller(device: Audio) {

    /*
    Create both the volume slider and a mute button.

    |> top div
    |   |> slider div
    |   |  |> mute div
    |   |  | mute button
    |   | volume slide
    */

    var top_div = document.createElement("div");

    function create_mute_button(device: Audio): HTMLDivElement {
        // setting up the mute button
        var mute_div = document.createElement("div");

        var muted_class = "mute-muted"
        var unmuted_class = "mute-un-muted"

        var button = document.createElement("button");
        button.innerHTML = "MUTE";
        button.className = device.mute ? muted_class : unmuted_class; 
        // Call back
        button.onclick = () => {
            device.mute = device.mute ? false : true; // flip flop
            button.className = device.mute ? muted_class : unmuted_class;
            change_audio_settings(device);
        }


        mute_div.appendChild(button);
        return mute_div;
    }
    function create_volume_slider(device: Audio): HTMLDivElement {
        // create all the elements and set their metadata
        // for the volume slider
        var slider_div = document.createElement("div");
        slider_div.className = "slider-div";
        var input = document.createElement("input");
        input.type = "range";
        input.min = "0";
        input.max = "100000";
        input.value = device.volume.toString();
        input.className = "volume-slider"
        slider_div.appendChild(input);

        input.onchange = (event) => {
            var volume = (event.target as HTMLSelectElement)?.value;
            console.log(volume);
            device.volume = parseInt(volume);
            change_audio_settings(device);
        }

        slider_div.appendChild(create_mute_button(device));

        return slider_div;
    }

    top_div.appendChild(create_volume_slider(device));    

    document.body.appendChild(top_div);
}