function doGet() {
  return HtmlService.createHtmlOutputFromFile("visaservice");
}

var spreadsheetId = "1aJnk-SiFXdgs4Czv9Jg2qi37fQhKks0373-v0hx7-_U";
var sheetNames = ["Visit", "Fiance", "Spouse", "Married", "Unmarried"];
var invoicesheet = "Payments";

function doPost(e) {
  var email = e.parameter.email;
  var rentaflight = e.parameter.raf;
  var hotelacc = e.parameter.har;
  var philacco = e.parameter.pas;
  var manilapa = e.parameter.mpa;
  var manilapadays = e.parameter.days;

  var responseText = verifyEmail(
    email,
    rentaflight,
    hotelacc,
    philacco,
    manilapa,
    manilapadays
  );

  return ContentService.createTextOutput(responseText);
}

function verifyEmail(
  email,
  rentaflight,
  hotelacc,
  philacco,
  manilapa,
  manilapadays
) {
  email = email.toLowerCase();
  manilapadays = parseInt(manilapadays, 10);

  var sheet, dataRange, values, row;
  var lastName, firstName, address, country, postalCode;

  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var randomInvoiceNumber = "MISC-" + Math.floor(Math.random() * 9000 + 1000);
  var invoiceTemplateId = "1J03ghsWUTflreObBg1Z4K4skOaS45Ara5bg_d_oMLyM";

  for (var i = 0; i < sheetNames.length; i++) {
    sheet = spreadsheet.getSheetByName(sheetNames[i]);
    dataRange = sheet.getDataRange();
    values = dataRange.getValues();

    for (var j = 1; j < values.length; j++) {
      row = values[j];
      if (row[3] === email) {
        lastName = row[1];
        firstName = row[2];
        address = row[5];
        country = row[6];
        postalCode = row[7];
        break;
      }
    }

    if (lastName) {
      break;
    }
  }

  if (lastName) {
    var invoiceDate = new Date();
    var dueDate = new Date(invoiceDate);
    dueDate.setDate(invoiceDate.getDate() + 3);
    var currency = country === "United Kingdom" ? "GBP" : "PHP";

    if (rentaflight === "Rent-a-flight (Return)") {
      var unitprice2 = currency === "PHP" ? 2500 : 25;
      var rafqty = "";
    } else if (rentaflight === "Rent-a-flight (One way)") {
      var unitprice2 = currency === "PHP" ? 1000 : 20;
      var rafqty = "";
    } else if (rentaflight === "Rent-a-flight with hotel accommodation") {
      var unitprice2 = currency === "PHP" ? 2000 : 30;
      var rafqty = "";
    }

    if (hotelacc === "Hotel Accommodation Reservation") {
      var unitprice3 = currency === "PHP" ? 1000 : 20;
      var hotelaccqty = "1";
    } else {
      var unitprice3 = "";
      var hotelaccqty = "";
    }

    if (philacco === "Philippine Accommodation (Studio)") {
      var unitprice4 = currency === "PHP" ? 2250 : 35;
      var philaccoqty = "1";
    } else {
      var unitprice4 = "";
      var philaccoqty = "";
    }

    if (manilapa === "Manila Personal Assistant") {
      var unitprice5 = currency === "PHP" ? 1000 : 20;
      var manilapadays = manilapadays;
    } else {
      var unitprice5 = "";
      var manilapadays = "";
    }

    var manilapaprice = unitprice5 * manilapadays;
    var amount = unitprice2 + unitprice3 + unitprice4 + manilapaprice;

    const checkednames = [rentaflight, hotelacc, philacco, manilapa];
    const checkedqty = [rafqty, hotelaccqty, philaccoqty, manilapadays];
    const checkedvalues = [unitprice2, unitprice3, unitprice4, manilapapaprice];

    var invoiceData = [
      firstName,
      lastName,
      address,
      country,
      postalCode,
      randomInvoiceNumber,
      invoiceDate,
      dueDate,
      currency,
      amount,
    ];

    var placeholders = [
      "First_Name",
      "Last_Name",
      "Insert_Address",
      "Insert_Country",
      "Insert_Pcode",
      "invoice_in",
      "today_in",
      "duedate_in",
      "currency_",
      "total_",
    ];

    // Call the createInvoicePdf function with the placeholders array
    var pdfBlob = createInvoicePdf(
      invoiceTemplateId,
      invoiceData,
      placeholders,
      checkednames,
      checkedvalues,
      checkedqty
    );

    var folderId = "1Y7_xZgNCZsjXdIauI67gENueMFcCe8M0";
    var folder = DriveApp.getFolderById(folderId);
    var file = folder.createFile(pdfBlob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    var sheet33 = spreadsheet.getSheetByName(invoicesheet);
    sheet33.appendRow([
      new Date(),
      lastName,
      firstName,
      email,
      randomInvoiceNumber,
      file.getUrl(),
    ]);

    return file.getUrl();
  } else {
    return "EmailNotFound";
  }
}

function createInvoicePdf(
  templateId,
  invoiceData,
  placeholders,
  checkednames,
  checkedvalues,
  checkedqty
) {
  var template = DriveApp.getFileById(templateId);
  var tempDoc = template.makeCopy().getId();
  var doc = DocumentApp.openById(tempDoc);
  var body = doc.getBody();

  for (var i = checkednames.length + 1; i <= 3; i++) {
    body.replaceText(`{{Misc${i}}}`, "");
  }

  for (var i = checkedvalues.length + 1; i <= 3; i++) {
    body.replaceText(`{{unit_price${i}}}`, "");
    body.replaceText(`{{amount_in${i}}}`, "");
  }

  for (var i = checkedqty.length + 1; i <= 3; i++) {
    body.replaceText(`{{qty${i}}}`, "");
  }

  // Iterate through the placeholders array and replace the placeholders with their respective values
  for (var i = 0; i < placeholders.length; i++) {
    // Get the value from the invoiceData array
    var value = invoiceData[i];

    // Check if the value is a number
    if (typeof value === "number") {
      value = value.toFixed(2);
    }
    // Check if the value is a date
    else if (value instanceof Date) {
      value = formatDate(value);
    }

    // Ensure value is a string before replacing the text
    if (typeof value === "string") {
      body.replaceText("{{" + placeholders[i] + "}}", value);
    } else {
      console.error("Value is not a string: ", value);
    }
  }

  doc.saveAndClose();

  var pdfBlob = DriveApp.getFileById(tempDoc).getAs("application/pdf");
  pdfBlob.setName("Invoice-" + invoiceData[6] + ".pdf");

  DriveApp.getFileById(tempDoc).setTrashed(true);

  return pdfBlob;
}

function formatDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  return month + "/" + day + "/" + year;
}

function processForm(fileData) {
  var folderId = "1hFTz_wyjSKfjNLc6O7iJhJf8hTeM7am-";
  var folder = DriveApp.getFolderById(folderId);
  var contentType = fileData.data.substring(5, fileData.data.indexOf(";"));
  var bytes = Utilities.base64Decode(fileData.data.split(",")[1]);
  var blob = Utilities.newBlob(bytes, contentType, fileData.name);
  var file = folder.createFile(blob);

  var ss = SpreadsheetApp.openById(spreadsheetId);
  var ws = ss.getSheetByName(invoicesheet);

  var data = ws.getRange(1, 1, ws.getLastRow(), ws.getLastColumn()).getValues();
  var emailColumn = 3; // Change this to the index of the email column in your sheet (0-based)
  var fileUrlColumn = 6; // Change this to the index of the file URL column in your sheet (0-based)

  for (var i = 0; i < data.length; i++) {
    if (data[i][emailColumn] === fileData.email) {
      ws.getRange(i + 1, fileUrlColumn + 1).setValue(file.getUrl());
      break;
    }
  }
}
