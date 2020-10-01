#!/usr/bin/env node
const os = require("os");
const exec = require("child_process").execSync;
const motherboard = exec("cat /sys/devices/virtual/dmi/id/product_name");

const { r, g, b, w, c, m, y, k } = [
  ["r", 1],
  ["g", 2],
  ["b", 4],
  ["w", 7],
  ["c", 6],
  ["m", 5],
  ["y", 3],
  ["k", 0],
].reduce(
  (cols, col) => ({
    ...cols,
    [col[0]]: (f) => `\x1b[3${col[1]}m${f}\x1b[0m`,
  }),
  {}
);

const mag = (text) => `\x1b[35m${text}\x1b[0m`;

const secondsToHM = (s) => {
  s = Number(s);
  let h = Math.floor(s / 3600);
  let m = Math.floor((s % 3600) / 60);
  return `${("0" + h).slice(-2)}:${("0" + m).slice(-2)}`;
};

const trimBuffer = (string) => string.toString("utf-8").trim();

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
${b(userName)}@${r(hostName)}
      ${y("os")} ~ ${distro}
      ${y("sh")} ~ ${shell}
      ${y("wm")} ~ ${trimBuffer(wm)}
      ${y("up")} ~ ${secondsToHM(up)}
     ${y("cpu")} ~ ${cpu[0]}
     ${y("mem")} ~ ${memory}MB
    ${y("code")} ~ ${codename}
    ${y("arch")} ~ ${arch}
    ${y("kern")} ~ ${kernel}
    ${y("term")} ~ ${terminal}
   ${y("board")} ~ ${trimBuffer(motherboard)}
  ${y("editor")} ~ ${editor}
    ${bars()}
  `;
console.clear();
console.log(sysinfo);
