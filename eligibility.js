// Replace this with the ID of the Google Sheet where you want to store the form data
const SPREADSHEET_ID = "1aJnk-SiFXdgs4Czv9Jg2qi37fQhKks0373-v0hx7-_U";

function doPost(e) {
  const formId = e.parameter.formName;
  const formData = extractFormData(e);

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);

  let sheet;
  switch (formId) {
    case "VV":
      sheet = spreadsheet.getSheetByName("Visit");
      break;
    case "FV":
      sheet = spreadsheet.getSheetByName("Fiance");
      break;
    case "SV":
      sheet = spreadsheet.getSheetByName("Spouse");
      break;
    case "MV":
      sheet = spreadsheet.getSheetByName("Married");
      break;
    case "UMVV":
      sheet = spreadsheet.getSheetByName("Unmarried");
      break;
    default:
      return;
  }

  saveFormDataToSheet(sheet, formData);

  // Send a response to the client-side script
  return ContentService.createTextOutput(
    JSON.stringify({ result: "success", data: formData })
  ).setMimeType(ContentService.MimeType.JSON);
}

function extractFormData(e) {
  const formName = e.parameter.formName;
  var email = e.parameter.email.toLowerCase();
  let formData = {
    formName: formName,
    lname: e.parameter.lname,
    fname: e.parameter.fname,
    email: email,
    pnumber: e.parameter.pnumber,
    address: e.parameter.address,
    country: e.parameter.country,
    otherCountry: e.parameter.otherCountry,
    pcode: e.parameter.pcode,
  };

  if (formName === "VV") {
    formData.metSponsor = e.parameter.metSponsor;
    formData.relationship = e.parameter.relationship;
    formData.applicantIncome = e.parameter["applicant-income"];
    formData.sponsorIncome = e.parameter["sponsor-income"];
    formData.salary = e.parameter.salary;
    formData.visaType = e.parameter.visaType;
    formData.eligibility = e.parameter.eligibility;
  }

  if (formName === "SV") {
    formData.financialrequirement = e.parameter.financialrequirement;
    formData.benefits = e.parameter.benefits;
    formData.pom = e.parameter.pom;
    formData.dom = e.parameter.dom;
    formData.sponsorIncome = e.parameter["sponsor-income"];
    formData.visaType = e.parameter.visaType;
    formData.eligibility = e.parameter.eligibility;
  }

  if (formName === "FV") {
    formData.metSponsor = e.parameter.metSponsor;
    formData.amrital = e.parameter.amrital;
    formData.smrital = e.parameter.smrital;
    formData.financialrequirement = e.parameter.financialrequirement;
    formData.sponsorIncome = e.parameter["sponsor-income"];
    formData.visaType = e.parameter.visaType;
    formData.eligibility = e.parameter.eligibility;
  }

  if (formName === "MV") {
    formData.amrital = e.parameter.amrital;
    formData.metSponsor = e.parameter.metSponsor;
    formData.applicantIncome = e.parameter["applicant-income"];
    formData.sties = e.parameter.sties;
    formData.smrital = e.parameter.smrital;
    formData.sponsorIncome = e.parameter["sponsor-income"];
    formData.visaType = e.parameter.visaType;
    formData.eligibility = e.parameter.eligibility;
  }

  if (formName === "UMVV") {
    formData.amrital = e.parameter.amrital;
    formData.metSponsor = e.parameter.metSponsor;
    formData.lived = e.parameter.lived;
    formData.sties = e.parameter.sties;
    formData.smrital = e.parameter.smrital;
    formData.financialrequirement = e.parameter.financialrequirement;
    formData.sponsorIncome = e.parameter["sponsor-income"];
    formData.visaType = e.parameter.visaType;
    formData.eligibility = e.parameter.eligibility;
  }

  // Add other form-specific fields as needed, similar to the examples above

  return formData;
}

function saveFormDataToSheet(sheet, formData) {
  let newRowData = [
    new Date(), // Timestamp
    formData.lname,
    formData.fname,
    formData.email.toLowerCase(),
    formData.pnumber,
    formData.address,
    formData.country,
    formData.otherCountry,
    formData.pcode,
  ];

  if (formData.formName === "VV") {
    newRowData.push(
      formData.metSponsor,
      formData.relationship,
      formData.applicantIncome,
      formData.sponsorIncome,
      formData.salary,
      formData.visaType,
      formData.eligibility
    );
  }

  if (formData.formName === "FV") {
    newRowData.push(
      formData.metSponsor,
      formData.amrital,
      formData.smrital,
      formData.financialrequirement,
      formData.sponsorIncome,
      formData.visaType,
      formData.eligibility
    );
  }

  if (formData.formName === "SV") {
    newRowData.push(
      formData.financialrequirement,
      formData.pom,
      formData.dom,
      formData.sponsorIncome,
      formData.benefits,
      formData.visaType,
      formData.eligibility
    );
  }

  if (formData.formName === "MV") {
    newRowData.push(
      formData.amrital,
      formData.metSponsor,
      formData.applicantIncome,
      formData.sties,
      formData.smrital,
      formData.sponsorIncome,
      formData.visaType,
      formData.eligibility
    );
  }

  if (formData.formName === "UMVV") {
    newRowData.push(
      formData.amrital,
      formData.financialrequirement,
      formData.metSponsor,
      formData.lived,
      formData.smrital,
      formData.sponsorIncome,
      formData.visaType,
      formData.eligibility
    );
  }

  sheet.appendRow(newRowData);
}

function emailExists(sheet, email) {
  var email = email.toLowerCase();
  const emailColumn = 4; // Assuming the email addresses are stored in column 4 (D)
  const data = sheet
    .getRange(1, emailColumn, sheet.getLastRow(), 1)
    .getValues();
  const emailList = data.map(function (row) {
    return row[0];
  });

  return emailList.includes(email);
}
