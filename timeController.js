const request = require("request-promise");
const fs = require("fs");

const API_URL = process.env.TIME_API || "http://worldtimeapi.org/api/timezone/";
const STATE_FILE_PATH  = process.env.STATE_FILE_PATH || "./timepopularity.json";

class TimeController {

  constructor() {
    this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    this.state = this.getSavedState();
  }

  getSavedState () {
    let filepath = STATE_FILE_PATH;
    if (!fs.existsSync(filepath)) {
      // no previous state found
      return {};
    }

    let data = fs.readFileSync(filepath);
    return JSON.parse(data);
  }

  updateState(timezone) {
    timezone = timezone.toLowerCase();
    console.log(timezone);
    let parts =  timezone.split("/");
    let i = 0;
    let zone = "";
    while(i < parts.length) {
      zone += parts[i];
      console.log(i, zone);
      if (this.state.hasOwnProperty(zone)) {
        this.state[zone] += 1;
      } else {
        this.state[zone] = 1;
      }

      zone += "/";
      i++;
    }
  }

  saveStateFile () {
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(this.state));
  }

  async getTimeForLocation(location) {
    let uri = API_URL + location;
    console.log('location', uri);

    let options = {method: 'GET', uri: uri};
    return request(options).then((response) => {
      this.updateState(location); // update the count if the request was successful
      let timeObject = JSON.parse(response);
      let dateTime = timeObject['datetime'];

      // remove the offset eg. '-07:00'
      let dateTimeNoOffset = dateTime.substring(0, dateTime.length - 6);
      let time = new Date(dateTimeNoOffset);
      let timeString = `${time.getDate()} ${this.months[time.getMonth()]} ${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
      return timeString;

    }).catch((err) => {
      console.log(`Error response from '${uri}' for location: '${location}'`, err);
      return "unknown timezone";
    });
  }

  getPopularityForLocation(location) {
    location = location.toLowerCase();
    if (this.state.hasOwnProperty(location)) {
      return this.state[location];
    }
    return 0;
  }
}

module.exports = TimeController;
