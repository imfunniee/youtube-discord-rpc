const clientId = '536162780303196161';
const RPC = require('discord-rpc');
const activeWin = require('active-win');
const client = new RPC.Client({ transport: 'ipc' });
 
var video = null;
var artist = null;

function getOccurrence(array, value) {
  return array.filter((v) => (v === value)).length;
}

async function youtube() {
  let window = activeWin.sync();

  try {
    let appExtension = isWin() ? ".exe" : ".app";
    let processName = window.owner.name;
    let windowTitle = window.title;

    if (processName.toLowerCase() == `chrome${appExtension}`) {
      if (windowTitle.includes('YouTube')) {
          let title = windowTitle.split('YouTube');
          if (title[0] !== video) {
            video = title[0].slice(0,-2);
            var splitEachChar = video.split('');
            var count = getOccurrence(splitEachChar,'-'); // prevent it from splittin to much, certain youtubers loves to put "-" in title
            if(count <= 1){
            artist = video.split("-")[0]; //for music channels get artist
            video = video.split("-")[1]; //and song name
            }
            if(video == null) {
                video = artist;
                artist = null;
            }
            updateRP(video,artist);
          }
      } else {
          if (video !== "Idling") {
            video = 'Idling';
            updateRP(video,null);
          }
      }
    }
  } catch(e) {
    console.log(e);
  }
}

function updateRP(status,artist) {
  if (status == null || status == "" || !status) {
    status = "Idling";
    return;
  }
  if (artist == null) artist = "Watching";
  client.setActivity({
    details: artist,
    state: status,
    largeImageKey: 'logo',
    largeImageText: 'Youtube', //todo : make it show thumbnails & maybe a timer
    instance: false
  }).catch(err => {
    console.log(err);
  });
  
  console.log(`Status Updated: ${status}`);
}

function isWin() {
  if (process.platform == "win32") return true;
  return false;
}

client.on('ready', () => {
  console.log("Connected to Discord!");

  setInterval(() => {
    youtube();
  }, 10000);
});

client.login({clientId}).catch(console.error);
