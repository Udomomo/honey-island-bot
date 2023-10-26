const prop = PropertiesService.getScriptProperties().getProperties()
const NOW_SOLVING = "挑戦中"
const SOLVED = "o"

function doGet(e: GoogleAppsScript.Events.DoGet) {
}

function doPost(e: GoogleAppsScript.Events.DoPost) {
  const json = JSON.parse(e.postData.contents)
  
  const reply_token = json.events[0].replyToken;
  const messageText = json.events[0].message.text;

  const sheet = SpreadsheetApp.openById(prop.SHEET_ID).getSheetByName("シート1");
  if (!sheet) {
    throw new Error("sheet not found");
  } 

  switch (messageText) {
    case "問題": {
      const message = randomPuzzle(sheet)
      reply(message, reply_token)
    }
    case "正解": {
      const solveMessage = resolvePuzzle(sheet)
      const nextMessage = randomPuzzle(sheet)
      reply(solveMessage + nextMessage, reply_token)
    }
  }
}

function resolvePuzzle(sheet: GoogleAppsScript.Spreadsheet.Sheet): string {
  const rows = sheet.getRange("A1:C10000").getValues();
  const solvingRow = rows.filter(row => row[2] == NOW_SOLVING).map(row => row[0])
  if (!solvingRow) {
    return "挑戦中の問題はありません。"
  }
  const solvedPuzzle = solvingRow[0]
  sheet.getRange(solvedPuzzle, 2).setValue(SOLVED)
  return `${solvedPuzzle}問目正解！\n`
}

function randomPuzzle(sheet: GoogleAppsScript.Spreadsheet.Sheet): string {
  // 挑戦中マーカーを削除する
  sheet.getRange("C1:C10000").clearContent();

  const rows = sheet.getRange("A1:B10000").getValues();
  const unsolvedRows = rows.filter(row => row[1] != SOLVED).map(row => row[0])
  if (!unsolvedRows) {
    return "全問を解きました。おめでとうございます！"
  }
  const nextPuzzle = unsolvedRows[Math.floor(Math.random() * unsolvedRows.length)]

  // 出題する行の3列目にマーカーを記録する
  sheet.getRange(nextPuzzle, 3).setValue(NOW_SOLVING)

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
