use rocket::serde::{Deserialize, Serialize};


#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Sink {
    name: String,
    index: u32,
    mute: bool,
    volume: u32, // this one will be some custom wizardry
}

impl Sink {
    pub fn new(opt_name: &Option<String>, index: u32, mute: bool, volume: u32) -> Self {
        let name = match opt_name {
            Some(x) => x.clone(),
            None => "Unnamed".to_string(),
        };
        Self { name: name.to_string(), index, mute, volume}
    }
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Outputs {
    all: Vec<Sink>
}

impl Outputs {
    pub fn new() -> Self {
        Self { all: Vec::new() }
    }
    pub fn add(&mut self, sink: Sink) {
        self.all.push(sink);
    }
}