/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "onEvent" }] */
/*global PropertiesService */
/*global CalendarApp */
/*global UrlFetchApp */
/*global Logger */
function onEvent() {
  var SCRIPT_PROPERTIES = PropertiesService.getScriptProperties();
  var SLACK_TOKEN = SCRIPT_PROPERTIES.getProperty('SLACK_TOKEN');
  var CALENDAR_ID = SCRIPT_PROPERTIES.getProperty('CALENDAR_ID');

  var events = getEvent(CALENDAR_ID);
  var envelope = buildEnvelope(events);
  setStatus(envelope, SLACK_TOKEN);
}

function getEvent(id) {
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
}

function buildEnvelope(events) {
  var profile = {
    'status_emoji': '',
    'status_text': ''
  };
  events.forEach(function(event) {
    var title = event.getTitle();
    
    if (/休暇|有給|休み|やすみ/i.test(title)) {
      profile['status_emoji'] = ':palm_tree:';
      profile['status_text'] = '休み';
      return;
    }
    if (/自宅|remote/i.test(title)) {
      profile['status_emoji'] = ':house_with_garden:';
      profile['status_text'] = '自宅作業';
      return;
    }
    if (/外出|往訪/i.test(title)) {
      profile['status_emoji'] = ':walking:';
      profile['status_text'] = '外出中';
      return;
    }
    if (/ミーティング|MTG|会議/i.test(title)) {
      profile['status_emoji'] = ':spiral_calendar_pad:';
      profile['status_text'] = 'ミーティング中';
      return;
    }
  });

  return encodeURIComponent(JSON.stringify(profile));
}

function setStatus(envelope, token) {
  var result = UrlFetchApp.fetch('https://slack.com/api/users.profile.set?token=' + token + '&profile=' + envelope);

  Logger.log(result);
}
