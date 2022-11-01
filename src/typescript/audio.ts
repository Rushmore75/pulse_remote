interface AudioSink {
    name: string,
    index: number,
    volume: number,
    mute: boolean,
}

interface Devices {
    all: AudioSink[]
}

/**
 * Will send a command back to the server with the desired settings.
 * @param settings AudioSink with desired settings.
 */
function change_audio_settings(settings: AudioSink): void {
    const httpRequest = new XMLHttpRequest();

    httpRequest.onload = () => {
        // console.log(httpRequest.status)
    }
    var extension = 
        "/set/" + settings.index + 
        "/" + settings.volume + 
        "/" + settings.mute;
    httpRequest.open("POST", extension);
    httpRequest.send();
}

// TODO make this async and wait on the 200 response
/**
 * Gets all the available audio sinks from the host's system.
 * It will then populate the DOM with this information.
 */
function get_audio_clients() {
    const httpRequest = new XMLHttpRequest();

    httpRequest.onload = () => {    
        // once the 200 code is received add information to the page
        if (httpRequest.status === 200) {         
            console.debug(httpRequest.status);
            var template: Devices = JSON.parse(httpRequest.responseText);
            create_selector(template);
        }        
    }
    
    httpRequest.open("GET", "/outputs");
    httpRequest.send();
}