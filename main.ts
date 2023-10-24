function doGet(e: GoogleAppsScript.Events.DoGet) {
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  const prop = PropertiesService.getScriptProperties().getProperties()

  const json = JSON.parse(e.postData.contents)
  
  const reply_token = json.events[0].replyToken;
  const messageId = json.events[0].message.id;
  const messageType = json.events[0].message.type;
  const messageText = json.events[0].message.text;

  const option: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + prop.LINE_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': [{
        'type': 'text',
        'text': messageText,
      }],
    }),
  }

  UrlFetchApp.fetch(prop.LINE_URL, option)
}
