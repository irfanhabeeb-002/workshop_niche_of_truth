const SPREADSHEET_ID = '13XxXUFO1egDtZLeEo7VgjuR7-4uBBWCXPKL3FboQsrU';
const SHEET_NAME = 'workshop';

// --- Helper: Capitalize ---
function capitalize(str) {
  if (!str) return '';
  str = str.toString().trim();
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// --- Handle GET (testing) ---
function doGet(e) {
  return sendJSON({ status: 'Workshop Registration API is running 🚀' });
}

// Ensure target sheet exists and headers are present
function getOrCreateSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  const headerRow = [
    'Serial No',
    'Timestamp',
    'Name',
    'Age',
    'Sex',
    'District',
    'Zone',
    'Phone',
    'WhatsApp',
    'Previous Participation',
    "Da'wa Designation",
    'Payment Mode',
    'Payment Status',
    'Remarks'
  ];

  const lastRow = sheet.getLastRow();
  if (lastRow === 0) {
    sheet.appendRow(headerRow);
  } else {
    // If first row is empty or not matching headers count, set headers
    const firstRowValues = sheet.getRange(1, 1, 1, headerRow.length).getValues()[0];
    const hasAnyHeader = firstRowValues.some(function(v){ return String(v).trim() !== ''; });
    if (!hasAnyHeader) {
      sheet.getRange(1, 1, 1, headerRow.length).setValues([headerRow]);
    }
  }

  return sheet;
}

// Compute next serial by scanning last non-empty value in column A
function getNextSerial_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 1; // header only
  const lastSerial = sheet.getRange(lastRow, 1).getValue();
  var n = Number(lastSerial);
  if (!n) {
    // Fallback: find last numeric in column A
    const colA = sheet.getRange(2, 1, Math.max(0, lastRow - 1), 1).getValues().flat();
    for (var i = colA.length - 1; i >= 0; i--) {
      var maybeNum = Number(colA[i]);
      if (maybeNum) return maybeNum + 1;
    }
    return 1;
  }
  return n + 1;
}

// --- Handle POST (main form submit) ---
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('No request body received');
    }

    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseErr) {
      throw new Error('Invalid JSON body');
    }

    // Basic validation
    var required = ['name','age','sex','district','phone','previous_camp','designation','payment_mode'];
    var missing = required.filter(function(k){ return !data[k]; });
    if (missing.length > 0) {
      throw new Error('Missing required field(s): ' + missing.join(', '));
    }

    var sheet = getOrCreateSheet_();
    var nextSerial = getNextSerial_(sheet);

    var district = capitalize(data.district);
    var zone = capitalize(data.zone);
    var zoneValue = district === 'Ernakulam' ? zone : 'Nil';

    // Append row in correct order
    var newRow = [
      nextSerial,                  // A: Serial No.
      new Date(),                  // B: Timestamp
      data.name || '',             // C: Name
      data.age || '',              // D: Age
      data.sex || '',              // E: Sex
      district,                    // F: District
      zoneValue,                   // G: Zone
      data.phone || '',            // H: Phone No.
      data.whatsapp || '',         // I: WhatsApp No.
      data.previous_camp || '',    // J: Previous Participation
      data.designation || '',      // K: Da’wa Designation
      data.payment_mode || '',     // L: Payment Mode
      '',                          // M: Payment Status (manual)
      ''                           // N: Remarks (manual)
    ];

    sheet.appendRow(newRow);

    return sendJSON({ success: true, message: 'Data added successfully ✅' });
  } catch (err) {
    return sendJSON({ success: false, error: err && err.message ? err.message : 'Unknown error' });
  }
}

// --- Proper JSON + CORS Handling ---
function sendJSON(obj) {
  const output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);

  // Apps Script doesn’t allow headers here, so we use a trick:
  // the `doOptions` handler allows CORS preflight.
  return output;
}

// --- Handle preflight CORS requests ---
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}
