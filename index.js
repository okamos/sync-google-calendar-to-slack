/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "onEvent" }] */
/*global PropertiesService */
/*global CalendarApp */
/*global UrlFetchApp */
/*global Logger */
const getEvents = (id) => {
  var now = new Date();
  var fiveMinutesAgo = new Date(now.getTime() + (5 * 60 * 1000));
  var calendar = CalendarApp.getCalendarById(id);
  var events = calendar.getEvents(now, fiveMinutesAgo);
  
  // allDayEvents is low priority.
  return events.sort(function (a /* , b */) {
    if (a.isAllDayEvent()) {
      return 1;
    }
    return -1;
  });
};

const buildEnvelope = (events) => {
  var profile = {
    'status_emoji': '',
    'status_text': ''
  };
  events.forEach(function(event) {
    const title = event.getTitle();

    const items = require('./dict.json');

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const re = new RegExp(item['regexp'], 'i');
      if (re.test(title)) {
        profile['status_emoji'] = item['status_emoji'];
        profile['status_text'] = item['status_text'];
        break;
      }
    }
  });

  return encodeURIComponent(JSON.stringify(profile));
};

const setStatus = (envelope, token) => {
  var result = UrlFetchApp.fetch('https://slack.com/api/users.profile.set?token=' + token + '&profile=' + envelope);

  Logger.log(result);
};

global.onEvent = () => {
  const SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
  const SLACK_TOKEN = SCRIPT_PROPERTIES.getProperty('SLACK_TOKEN');
  const CALENDAR_ID = SCRIPT_PROPERTIES.getProperty('CALENDAR_ID');

  const events = getEvents(CALENDAR_ID);
  const envelope = buildEnvelope(events);
  setStatus(envelope, SLACK_TOKEN);
};
