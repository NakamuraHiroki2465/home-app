import { connect } from "async-mqtt";
import { exec } from "child_process";
import dotenv from 'dotenv'

dotenv.config();

const client = connect("mqtt://mqtt.beebotte.com", {
  port: 1883,
  username: process.env.MQTT_USER_NAME,
  password: ''
});

client.on("connect", () => {
  client.subscribe("home/assistant");
});

client.on("message", (topic, message) => {
  console.log(`${topic}: ${message.toString()}`);
  const COMMAND = (message) => `sudo ~/bto_ir_cmd/bto_ir_cmd -e -t  \`cat ~/bto_ir_cmd/codes/${message.data}\``
  exec(
    COMMAND(message),
     (err, stdout, stderr) => {
       if (err) {
         console.log(`stderr: ${stderr}`);
         return;
       }
      console.log(`stdout: ${stdout}`);
    }
  );
});