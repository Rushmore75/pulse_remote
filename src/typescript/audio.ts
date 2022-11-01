interface Audio {
    name: string,
    index: number,
    volume: number,
    mute: boolean,
}

interface Devices {
    all: Audio[]
}

function change_audio_settings(settings: Audio): void {
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
function get_audio_clients() {
    const httpRequest = new XMLHttpRequest();

    httpRequest.onload = () => {    
        // once the 200 code is received add information to the page
        if (httpRequest.status === 200) {            
            console.log(httpRequest.status);
            var template: Devices = JSON.parse(httpRequest.responseText);
            create_selector(template);
        }        
    }
    
    httpRequest.open("GET", "/outputs");
    httpRequest.send();
}