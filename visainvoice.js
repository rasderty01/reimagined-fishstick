function doGet() {
  return HtmlService.createHtmlOutputFromFile("visaservice");
}

var spreadsheetId = "1aJnk-SiFXdgs4Czv9Jg2qi37fQhKks0373-v0hx7-_U";
var sheetNames = ["Visit", "Fiance", "Spouse", "Married", "Unmarried"];
var invoicesheet = "Payments";

function doPost(e) {
  var email = e.parameter.email;
  var visaservice = e.parameter.visaservice;
  var priority = e.parameter.priority;
  var frval = e.parameter.frval;
  var mpaval = e.parameter.mpaval;
  var rfaval = e.parameter.rfaval;

  console.log(email);
  console.log(visaservice);
  console.log(priority);
  console.log(frval);
  console.log(mpaval);
  console.log(rfaval);

  var responseText = verifyEmail(
    email,
    visaservice,
    priority,
    frval,
    mpaval,
    rfaval
  );

  return ContentService.createTextOutput(responseText);
}

function verifyEmail(email, visaservice, priority, frval, mpaval, rfaval) {
  if (visaservice === "Visit Visa") {
    var unitprice2 = 17000;
  } else if (visaservice === "Fiance Visa") {
    var unitprice2 = 40800;
  } else if (visaservice === "Spouse Visa") {
    var unitprice2 = 40800;
  } else if (visaservice === "Unmarried Visit Visa") {
    var unitprice2 = 40800;
  } else if (visaservice === "Married Visit Visa") {
    var unitprice2 = 17000;
  } else if (visaservice === "Child Dependant Visa") {
    var unitprice2 = 40800;
  }

  if (priority === "Priority 1") {
    var unitprice3 = 6800;
    var prioqty = "1";
  } else if (priority === "Priority 2") {
    var unitprice3 = 3400;
    var prioqty = "1";
  } else if (priority === "") {
    var unitprice3 = "";
    var prioqty = "";
  }

  if (frval === "Flight Reservation") {
    var misc1 = 1700;
    var misc1qty = "1";
  } else {
    var misc1 = "";
    var misc1qty = "";
  }

  if (mpaval === "Manila Personal Assistant") {
    var misc2 = 800;
    var misc2qty = "1";
  } else {
    var misc2 = "";
    var misc2qty = "";
  }

  if (rfaval === "Rent-a-flight") {
    var misc3 = 1700;
    var misc3qty = "1";
  } else {
    var misc3 = "";
    var misc3qty = "";
  }

  var sheet, dataRange, values, row;
  var lastName, firstName, address, country, postalCode;

  console.log(email, "email");
  console.log(visaservice, "visaservice");
  console.log(priority, "priority");
  console.log(frval, "frval");
  console.log(mpaval, "mpaval");
  console.log(rfaval, "rfaval");
  console.log(unitprice3, "unitprice3");
  console.log(unitprice2, "unitprice2");
  console.log(misc1, "misc2");
  console.log(misc2, "misc2");
  console.log(prioqty, "prioqty");
  console.log(misc1qty, "misc1");
  console.log(misc2qty, "misc2");
  console.log(misc3qty, "misc3");

  var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  var randomInvoiceNumber = "VS-" + Math.floor(Math.random() * 9000 + 1000);
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
    var frprice = misc1;
    var mpaprice = misc2;
    var rafprice = misc3;
    var amount = visaprice + prioprice + frprice + mpaprice + rafprice;

    // Convert the amount to the target currency using the conversion rate
    if (conversionRate !== 1) {
      visaprice = unitprice2 / conversionRate;
      prioprice = unitprice3 / conversionRate;
      frprice = misc1 / conversionRate;
      mpaprice = misc2 / conversionRate;
      rafprice = misc3 / conversionRate;
      amount = amount / conversionRate;
    }

    console.log(visaprice);
    console.log(prioprice);
    console.log(frprice);
    console.log(mpaprice);
    console.log(rafprice);
    console.log(amount);

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
      misc11: frprice,
      misc22: mpaprice,
      misc33: rafprice,
      visaname: visaservice,
      prioname: priority,
      miscname1: frval,
      miscname2: mpaval,
      miscname3: rfaval,
      prioqty: prioqty,
      misc1qty: misc1qty,
      misc2qty: misc2qty,
      misc3qty: misc3qty,

      currency: currency,
      amount: amount,
    };

    var pdfBlob = createInvoicePdf(invoiceTemplateId, invoiceData);
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

function createInvoicePdf(templateId, invoiceData) {
  var template = DriveApp.getFileById(templateId);
  var tempDoc = template.makeCopy().getId();
  var doc = DocumentApp.openById(tempDoc);
  var body = doc.getBody();

  body.replaceText("{{First_Name}}", invoiceData.firstName);
  body.replaceText("{{Last_Name}}", invoiceData.lastName);
  body.replaceText("{{Insert_Address}}", invoiceData.address);
  body.replaceText("{{Insert_Country}}", invoiceData.country);
  body.replaceText("{{Insert_Pcode}}", invoiceData.postalCode);
  body.replaceText("{{invoice_in}}", invoiceData.invoiceNumber);
  body.replaceText("{{duedate_in}}", formatDate(invoiceData.dueDate));
  body.replaceText("{{today_in}}", formatDate(invoiceData.invoiceDate));
  body.replaceText("{{Visa_Service}}", invoiceData.visaname);
  body.replaceText("{{Priority}}", invoiceData.prioname);
  body.replaceText("{{Misc1}}", invoiceData.miscname1);
  body.replaceText("{{Misc2}}", invoiceData.miscname2);
  body.replaceText("{{Misc3}}", invoiceData.miscname3);
  body.replaceText("{{qty1}}", invoiceData.prioqty);
  body.replaceText("{{qty2}}", invoiceData.misc1qty);
  body.replaceText("{{qty3}}", invoiceData.misc2qty);
  body.replaceText("{{qty4}}", invoiceData.misc3qty);
  body.replaceText("{{amount_in}}", invoiceData.visa.toFixed(2));
  body.replaceText("{{amount_in1}}", invoiceData.prio.toFixed(2));

  if (invoiceData.misc11 === "") {
    body.replaceText("{{amount_in2}}", invoiceData.misc11);
  } else {
    body.replaceText("{{amount_in2}}", invoiceData.misc11.toFixed(2));
  }

  if (invoiceData.misc22 === "") {
    body.replaceText("{{amount_in3}}", invoiceData.misc22);
  } else {
    body.replaceText("{{amount_in3}}", invoiceData.misc22.toFixed(2));
  }

  if (invoiceData.misc33 === "") {
    body.replaceText("{{amount_in4}}", invoiceData.misc33);
  } else {
    body.replaceText("{{amount_in4}}", invoiceData.misc33.toFixed(2));
  }

  body.replaceText("{{unit_price}}", invoiceData.visa.toFixed(2));

  body.replaceText("{{unit_price2}}", invoiceData.prio.toFixed(2));

  if (invoiceData.misc11 === "") {
    body.replaceText("{{unit_price3}}", invoiceData.misc11);
  } else {
    body.replaceText("{{unit_price3}}", invoiceData.misc11.toFixed(2));
  }

  if (invoiceData.misc22 === "") {
    body.replaceText("{{unit_price4}}", invoiceData.misc22);
  } else {
    body.replaceText("{{unit_price4}}", invoiceData.misc22.toFixed(2));
  }

  if (invoiceData.misc33 === "") {
    body.replaceText("{{unit_price5}}", invoiceData.misc33);
  } else {
    body.replaceText("{{unit_price5}}", invoiceData.misc33.toFixed(2));
  }

  body.replaceText("{{currency_}}", invoiceData.currency);
  body.replaceText("{{total_}}", invoiceData.amount.toFixed(2));
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
