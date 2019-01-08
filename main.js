function doPost(e) {

  var text = e.postData.getDataAsString();
  var values = text.split(/[,;]\s*|\s+/);

  write(values[0], values[1]);
}

function write(weight, body_fat) {

  var properties = PropertiesService.getScriptProperties().getProperties();
  var id = properties.SPREADSHEET_ID;

  var date = new Date();
  var sheet_name = Utilities.formatDate(date, "JST", "yyyyMM");

  var spreadsheet = SpreadsheetApp.openById(id);
  var sheet = spreadsheet.getSheetByName(sheet_name);
  if (sheet == null) {
    sheet = createSheet(spreadsheet, sheet_name);
  }

  var row = date.getDate() + 1;

  var values = [ [weight, body_fat] ];

  sheet.getRange(row, 2, 1, 2).setValues(values);
}

function createSheet(spreadsheet, sheet_name) {

  // アクティブシートを複製
  var copy = spreadsheet.duplicateActiveSheet();
  copy.setName(sheet_name);

  // 先頭に移動
  copy.activate();
  spreadsheet.moveActiveSheet(1);

  // データを削除
  copy.getRange("A2:C32").clearContent();

  // 日付を入力
  var date = new Date();
  var num_days = getDayCount(date.getYear(), date.getMonth() + 1);

  var day1_range = copy.getRange(2, 1, 1, 1); // A2
  var days_range = copy.getRange(2, 1, num_days, 1); // A2:A??

  var day1_value = Utilities.formatDate(date, "JST", "yyyy/MM/01");

  day1_range.setValue(day1_value);
  day1_range.autoFill(days_range, SpreadsheetApp.AutoFillSeries.DEFAULT_SERIES);

  return copy;
}

function getDayCount(year, month) {
  // 翌月の 0 日で当月の最終日が返ってくる
  // Month は 0 ～ 11 で指定するので当月の値をそのまま渡せばよい
  return new Date(year, month, 0).getDate();
}
