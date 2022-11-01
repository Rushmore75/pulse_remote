pub mod clients;

use clients::Outputs;
use libpulse_binding::volume::Volume;
use pulsectl::controllers::{SinkController, DeviceControl};
use rocket::{fs::FileServer, serde::{json::Json}, routes, get, post};

#[rocket::main]
async fn main() -> Result<(), rocket::Error> {

    get_audio_clients();

    // exit(0);

    let _rocket = rocket::build()
        .mount("/", FileServer::from("www/"))
        .mount("/", routes![get_audio_clients])
        .mount("/", routes![set_output])
        .launch()
        .await?;
    Ok(())
}

#[get("/outputs")]
fn get_audio_clients() -> Json<Outputs> {
    let mut handler = SinkController::create().unwrap();
    let devices = handler.list_devices().unwrap();
    let mut outputs = clients::Outputs::new();
    for i in &devices {
        let sink = clients::Sink::new(&i.description, i.index, i.mute, i.volume.avg().0);
        println!("{:?}", &sink);
        outputs.add(sink);
    }    
    Json(outputs)
}

#[post("/set/<index>/<volume>/<mute>")]
fn set_output(index: u32, volume: u32, mute: bool) {
    let mut handler = SinkController::create().unwrap();
    let mut y = handler.get_device_by_index(index).unwrap().volume;
    y.set(2, Volume(volume));
    handler.set_device_volume_by_index(index, &y);
    handler.set_device_mute_by_index(index, mute);
}