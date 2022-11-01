## What?
Control your pulseaudio system remotely via a website. This (currently) allows you to change volume and mute selected audio sink.

## Setup
Just run the server built in Rust. It will provide a link to the ip & port of the server.

## Develop
Server is written in Rust using Rocket.rs. Very simple code.

The Javascript is all compiled from Typescript which lives in the `/src/typescript` directory. Compile using `tsc` or `tsc -w` which will watch the files and compile on every change.