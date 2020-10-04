#!/usr/bin/env node

const os = require("os");
const exec = require("child_process").execSync;

if (os.platform() !== "linux") {
  throw new Error("OS Not Supported.");
  process.exit(1);
}

const red = (text) => `\x1b[31m${text}\x1b[0m`;
const blue = (text) => `\x1b[34m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const trimBuffer = (string) => string.toString("utf-8").trim();

const secondsToHM = (s) => {
  s = Number(s);
  let h = Math.floor(s / 3600);
  let m = Math.floor((s % 3600) / 60);
  return `${("0" + h).slice(-2)}:${("0" + m).slice(-2)}`;
};

const arch = os.arch();
const userName = os.userInfo().username;
const hostName = os.hostname();
const kernel = os.release().slice(0, 5);
const up = os.uptime();
const shell = os.userInfo().shell.split("/")[3];
const memory = Math.floor(os.totalmem() / 1048576);
const cpu = os.cpus()[0].model.split("CPU");
const wm = exec("echo $XDG_CURRENT_DESKTOP");
const editor = trimBuffer(exec("echo $EDITOR")).split("/")[3];
const ppid = trimBuffer(exec("ps -o 'ppid='")).split(" ");
const cmd = trimBuffer(exec(`ps -o 'cmd=' -p ${ppid[0]}`));
const terminal = !cmd.startsWith("/") ? cmd : cmd.split(" ")[0].split("/")[3];
const motherboard = exec("cat /sys/devices/virtual/dmi/id/product_name");
const distro = trimBuffer(exec("cat /etc/*-release | grep ^ID=")).slice(3);
const codename = trimBuffer(
  exec("cat /etc/*-release | grep ^DISTRIB_CODENAME=")
)
  .slice(17)
  .toLocaleLowerCase();

const bars = () => {
  let bar = "";
  for (let i = 1; i < 7; i++) {
    bar = bar + `\x1b[3${i}m▅▅\x1b[0m`;
  }
  return bar;
};

const sysinfo = `
${blue(userName)}@${red(hostName)}
      ${yellow("os")} ~ ${distro}
      ${yellow("sh")} ~ ${shell}
      ${yellow("wm")} ~ ${trimBuffer(wm)}
      ${yellow("up")} ~ ${secondsToHM(up)}
     ${yellow("cpu")} ~ ${cpu[0]}
     ${yellow("mem")} ~ ${memory}MB
    ${yellow("code")} ~ ${codename}
    ${yellow("arch")} ~ ${arch}
    ${yellow("kern")} ~ ${kernel}
    ${yellow("term")} ~ ${terminal}
   ${yellow("board")} ~ ${trimBuffer(motherboard)}
  ${yellow("editor")} ~ ${editor}
   ${bars()}
`;

process.stdout.write("\x1B[2J\x1B[3J\x1B[H");
console.log(sysinfo);
