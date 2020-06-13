const request = require("request-promise");

// TODO: make this pull from TIME_API env var
const apiBaseUrl = "http://worldtimeapi.org/api/timezone/";

class TimeController {

  constructor() {
    this.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  }

  async getTimeForLocation(location) {
    //  TODO: log location in db
    let uri = apiBaseUrl + location;
    console.log('location', uri);

    let options = {method: 'GET', uri: uri};
    return request(options).then((response) => {

      let timeObject = JSON.parse(response);
      let time = new Date(Date.parse(timeObject['utc_datetime']));
      let timeString = `${time.getDate()} ${this.months[time.getMonth()]} ${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
      console.log(timeString);
      return timeString;

    }).catch((err) => {
      console.log(`Error response from '${uri}' for location: '${location}'`, err);
      return "unknown timezone";
    });
  }

}


module.exports = TimeController;
