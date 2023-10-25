const prop = PropertiesService.getScriptProperties().getProperties()

function doGet(e: GoogleAppsScript.Events.DoGet) {
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  const json = JSON.parse(e.postData.contents)
  
  const reply_token = json.events[0].replyToken;
  const messageText = json.events[0].message.text;

  switch (messageText) {
    case "問題": {
      const url = randomPuzzle()
      reply(url, reply_token)
    }
  }
}

function randomPuzzle(): string {
  const sheet = SpreadsheetApp.openById(prop.SHEET_ID).getSheetByName("シート1");
  if (!sheet) {
    throw new Error("sheet not found");
  }
  
  const rows = sheet.getRange("A1:B10000").getValues();
  const unsolvedRows = rows.filter(row => row[1] != "o").map(row => row[0])
  if (!unsolvedRows) {
    return "問題はありません"
  }
  const nextPuzzle = unsolvedRows[Math.floor(Math.random() * unsolvedRows.length)]

  return `${nextPuzzle}問目\nhttps://wandsbox125.web.app/puzzle-tools/hex-editor/10000.html?id=${nextPuzzle}`
}

function reply(message: string, token: string) {
  const option: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + prop.LINE_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': token,
      'messages': [{
        'type': 'text',
        'text': message,
      }],
    }),
  }

  UrlFetchApp.fetch(prop.LINE_URL, option)
}