document.addEventListener("DOMContentLoaded", run)

/**
 * Entrypoint into running actual code.
 */
function run(): void {
    var element = document.createElement("p");
    element.innerHTML = "JavaScript checking in!";
    document.body.appendChild(element);

    get_audio_clients();

}

/**
 * Creates the selection system for choosing the audio sink on
 * the host to manipulate.
 * @param devices Devices instance, which in turn, holds audio sinks.
 */
function create_selector(devices: Devices) {
    
    // Create form for holding sinks
    var form: HTMLFormElement = document.createElement("form");
        // form.action = "i haven't decided how this value gets moved"; // this is unneeded
        form.className = "form";
        form.id = "devices-form"
    var selectElement = document.createElement("select");
        // select.innerHTML = "Select audio output to manipulate\n" // TODO this does nothing
        selectElement.className = "select"

    // hold all the device's options elements
    const options: HTMLOptionElement[] = [];
    // populate options from devices
    devices.all.forEach(device => {
        var option = document.createElement("option");
        option.innerHTML = device.name;
        option.id = device.index.toString();
        option.className = "option";
        options.push(option)
    });

    // append all available devices to the select element 
    options.forEach(i => {
        selectElement.appendChild(i);
    })

    // finally append everything to DOM
    document.body.appendChild(form).appendChild(selectElement);
    

    // Callback // FIXME
    form.onchange = (event) => {
        let name = (event.target as HTMLSelectElement)?.value;
        console.debug("Selecting: " + name);
        devices.all.forEach(i => {
            if (i.name === name) {
                // remove old control panel (if present)
                let old = document.getElementById("controls-div");
                old?.parentNode?.removeChild(old);
                // populate interface with controls
                create_controller(i);
            }
        });
    }
}

/**
 * Populate the DOM with the givin device's options.
 * @param device Singular audio sink to create a controller for.
 */
function create_controller(device: AudioSink) {
    /*
    Create both the volume slider and a mute button.
    |> top div
    |   |> slider div
    |   |  |> mute div
    |   |  | mute button
    |   | volume slide
    */

    let top_div = document.createElement("div");
    top_div.id = "controls-div";

    /**
     * Only used here, once. Mostly just to keep the function cleaner.
     * Contains the callback for muting audio.
     * @param device 
     * @returns Div element with the mute button inside.
     */
    function create_mute_button(device: AudioSink): HTMLDivElement {
        // setting up the mute button
        var mute_div = document.createElement("div");

        var muted_class = "mute-muted"
        var unmuted_class = "mute-un-muted"

        var button = document.createElement("button");
        button.innerHTML = "MUTE";
        button.className = device.mute ? muted_class : unmuted_class; 
        
        // Callback
        button.onclick = () => {
            device.mute = device.mute ? false : true; // flip flop
            button.className = device.mute ? muted_class : unmuted_class; // flip flop the class so the css changes.
            change_audio_settings(device);
        }


        mute_div.appendChild(button);
        return mute_div;
    }
    /**
     * Same as when creating the mute button, just for cleanliness.
     * Contains volume slider callback. Also creates the mute button
     * and appends that to it's self.
     * @param device 
     * @returns The div element with the volume slider & mute button in it.
     */
    function create_volume_slider(device: AudioSink): HTMLDivElement {
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

        // callback
        input.onchange = (event) => {
            var volume = (event.target as HTMLSelectElement)?.value;
            device.volume = parseInt(volume);
            change_audio_settings(device);
        }

        slider_div.appendChild(create_mute_button(device));

        return slider_div;
    }

    top_div.appendChild(create_volume_slider(device));
    document.body.appendChild(top_div);
}