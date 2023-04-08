function doGet() {
  return HtmlService.createHtmlOutputFromFile("visaservice");
}

var spreadsheetId = "1aJnk-SiFXdgs4Czv9Jg2qi37fQhKks0373-v0hx7-_U";
var sheetNames = ["Visit", "Fiance", "Spouse", "Married", "Unmarried"];
var invoicesheet = "Payments";
function doPost(e) {
  var email = e.parameter.email.toLowerCase();
  var visaservice = e.parameter.visaservice;
  var priority = e.parameter.priority;
  const randomInvoiceNumber = e.parameter.randomInvoiceNumber;

  var responseText = verifyEmail(
    email,
    visaservice,
    priority,
    randomInvoiceNumber
  );

  return ContentService.createTextOutput(responseText);
}

function verifyEmail(email, visaservice, priority, randomInvoiceNumber) {
  if (visaservice === "Visit Visa") {
    var unitprice2 = 17000;
  } else if (visaservice === "Fiancé Visa") {
    var unitprice2 = 40800;
  } else if (visaservice === "Spouse Visa (FLR-M) Inside UK") {
    var unitprice2 = 40800;
  } else if (visaservice === "Spouse Visa (FLR-M) Outside UK Processing") {
    var unitprice2 = 40800;
  } else if (visaservice === "Married Visit Visa") {
    var unitprice2 = 17000;
  } else if (visaservice === "Unmarried Partner Visa") {
    var unitprice2 = 40800;
  } else if (visaservice === "PBS/Skilled Worker Spouse Visa") {
    var unitprice2 = 40800;
  } else if (visaservice === "PBS/Skilled Worker Unmarried Partner Visa") {
    var unitprice2 = 40800;
  } else if (visaservice === "PBS/Skilled Worker Same-sex Partner Visa") {
    var unitprice2 = 40800;
  } else if (visaservice === "PBS/ Skilled Worker Child Dependant Visa") {
    var unitprice2 = 40800;
  } else if (visaservice === "Indefinite Leave to Remain (ILR)") {
    var unitprice2 = 40800;
  } else if (visaservice === "British Citizenship Processing") {
    var unitprice2 = 40800;
  } else if (visaservice === "Child Dependant Visa") {
    var unitprice2 = 40800;
  }

  if (priority === "Priority Service (7 working days)") {
    var unitprice3 = 6800;
    var prioqty = "1";
  } else if (priority === "Priority Service (After Final Declaration)") {
    var unitprice3 = 3400;
    var prioqty = "1";
  } else if (priority === "") {
    var unitprice3 = "";
    var prioqty = "";
  }

  var sheet, dataRange, values, row;
  var lastName, firstName, address, country, postalCode;

  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);

  var invoiceTemplateId = "1Tyf4n9a_mvyAEaM52Em8UhJGqH3UPdhVOh6DVUHE4xI";

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
        country = row[6]; // Make sure to update the column index for the country field
        postalCode = row[7]; // Make sure to update the column index for the postal code field
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
    var getConversionRate = 68.0;

    // Get the conversion rate if the currency is not PHP
    var conversionRate = currency === "PHP" ? 1 : getConversionRate;

    var visaprice = unitprice2;
    var prioprice = unitprice3;
    var amount = visaprice + prioprice;

    // Convert the amount to the target currency using the conversion rate
    if (conversionRate !== 1) {
      visaprice = unitprice2 / conversionRate;
      prioprice = unitprice3 / conversionRate;

      amount = amount / conversionRate;
    }

    var invoiceData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      address: address,
      country: country,
      postalCode: postalCode,
      invoiceNumber: randomInvoiceNumber,
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      unitPrice: amount,
      visa: visaprice,
      prio: prioprice,
      visaname: visaservice,
      prioname: priority,
      currency: currency,
      amount: amount,
      qty1: prioqty,
    };

    var placeholders = {
      First_Name: "firstName",
      Last_Name: "lastName",
      Insert_Address: "address",
      Insert_Country: "country",
      Insert_Pcode: "postalCode",
      invoice_in: "invoiceNumber",
      duedate_in: "dueDate",
      today_in: "invoiceDate",
      Visa_Service: "visaname",
      Priority: "prioname",
      qty1: "qty1",
      unit_price: "visa",
      unit_price2: "prio",
      amount_in: "visa",
      amount_in1: "prio",
      currency_: "currency",
      total_: "amount",

      // Add other placeholders here
    };

    // Call the createInvoicePdf function with the placeholders object
    var pdfBlob = createInvoicePdf(
      invoiceTemplateId,
      invoiceData,
      placeholders
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

function createInvoicePdf(templateId, invoiceData, placeholders) {
  var template = DriveApp.getFileById(templateId);
  var tempDoc = template.makeCopy().getId();
  var doc = DocumentApp.openById(tempDoc);
  var body = doc.getBody();

  // Iterate through the placeholders object and replace the placeholders with their respective values
  for (var key in placeholders) {
    if (placeholders.hasOwnProperty(key)) {
      // Get the value from the invoiceData object
      var value = invoiceData[placeholders[key]];

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
        body.replaceText("{{" + key + "}}", value);
      } else {
        console.error("Value is not a string: ", value);
      }
    }
  }

  doc.saveAndClose();

  var pdfBlob = DriveApp.getFileById(tempDoc).getAs("application/pdf");
  pdfBlob.setName("Invoice-" + invoiceData.invoiceNumber + ".pdf");

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
  Logger.log(fileData.randomInvoiceNumber);

  var ss = SpreadsheetApp.openById(spreadsheetId);
  var ws = ss.getSheetByName(invoicesheet);

  var data = ws.getRange(1, 1, ws.getLastRow(), ws.getLastColumn()).getValues();
  var emailColumn = 4; // Change this to the index of the email column in your sheet (0-based)
  var fileUrlColumn = 6; // Change this to the index of the file URL column in your sheet (0-based)

  for (var i = 0; i < data.length; i++) {
    if (data[i][emailColumn] === fileData.randomInvoiceNumber) {
      ws.getRange(i + 1, fileUrlColumn + 1).setValue(file.getUrl());
      break;
    }
  }
}
