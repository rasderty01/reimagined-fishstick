const url =
  "https://script.google.com/macros/s/AKfycbxIXjjkwQ1AaVIbMWJuZnveFeaHHz1O9lwCP9ywVWHP0yhJtHEU2KrSGSBCug7-qs66kg/exec";

document.addEventListener("DOMContentLoaded", function () {
  var form1 = document.getElementById("VV"); //visitvisa
  var form2 = document.getElementById("FV"); //fiancevisa
  var form3 = document.getElementById("SV"); //spousevisa
  var form4 = document.getElementById("MV"); //marriedvisa
  var form5 = document.getElementById("UMVV"); //unmarriedvisa

  // Bind validation function to the form submit event
  function validateForm(form, validationFunction) {
    form.addEventListener("submit", function (event) {
      if (!form.checkValidity()) {
        event.preventDefault(); // Prevent form submission if not valid
      } else {
        validationFunction(event); // Call the validation function if the form is valid
      }
    });
  }

  validateForm(form1, validateForm1);
  validateForm(form2, validateForm2);
  validateForm(form3, validateForm3);
  validateForm(form4, validateForm4);
  validateForm(form5, validateForm5);

  function validateForm1(e) {
    // Prevent the default form submission
    e.preventDefault();

    // Perform validation for Form 1
    const formAlerts = document.getElementById("form_alerts");
    const metSponsor = document.querySelector(
      'input[name="metSponsor"]:checked'
    ).value;
    const applicantSourceOfIncome =
      document.querySelector("#applicant-income").value;
    const sponsorSourceOfIncome =
      document.querySelector("#sponsor-income").value;
    const lname = document.querySelector("#lname").value;
    const fname = document.querySelector("#fname").value;
    const email = document.querySelector("#email").value;
    const pnumber = document.querySelector("#pnumber").value;
    const address = document.querySelector("#address").value;
    const pcode = document.querySelector("#pcode").value;
    const relationship = document.querySelector("#relationship").value;
    const salary = document.querySelector("#salary").value;
    var eligibility = true;

    if (
      applicantSourceOfIncome === "Business (less than a year)" ||
      applicantSourceOfIncome === "Employment (less than a year)"
    ) {
      eligibility = false;
      showSweetAlert(
        "Not Eligible:\n\n",
        "Based on your current circumstances, we may not be able to assist you with your application for a visit visa. If you do not have a sponsor, we recommend that you meet the following criteria:\n\n- You have been employed for more than a year.\n- Your income (minus monthly expenses) can cover the cost of your trip to the United Kingdom, which is estimated to be at least £2,000.\n\nIf your circumstances change, we would be happy to assist you, and you are free to fill out the eligibility assessment form again."
      );
    } else if (metSponsor === "No") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "Although it is still possible to proceed with the application, there is a high risk of the Home Office questioning the genuineness of your relationship if you have not met your sponsor in person."
      );
    } else if (applicantSourceOfIncome === "Unemployed/Student") {
      eligibility = true;
      Unemployed(
        "Eligible\n",
        "The risk of establishing strong ties is high. Nevertheless, you may proceed but ensure to prepare other information that demonstrates your strong ties, such as family relationships and a deed of sale."
      );
      setTimeout(AppendData, 10000);
    } else {
      AppendData();
    }
    // Rest of the function remains the same

    function AppendData() {
      const visaType = document.getElementById("choosevisatype").value;

      // Create a FormData object and append the form data
      const formData = new FormData();
      formData.append("formName", "VV"); // Change this value to the name or identifier of the form being submitted
      formData.append("visaType", visaType);
      formData.append("eligibility", eligibility ? "Eligible" : "Not Eligible");
      formData.append("lname", lname);
      formData.append("fname", fname);
      formData.append("email", email);
      formData.append("pnumber", pnumber);
      formData.append("address", address);

      const countryValue = document.querySelector("#country").value;
      const otherCountryValue = document.querySelector("#otherCountry").value;

      formData.append("country", countryValue);
      formData.append("otherCountry", otherCountryValue);

      formData.append("pcode", pcode);
      formData.append("relationship", relationship);
      formData.append("metSponsor", metSponsor);
      formData.append("applicant-income", applicantSourceOfIncome);
      formData.append("sponsor-income", sponsorSourceOfIncome);
      formData.append("salary", salary);
      // Send data to the Google Apps Script
      const options = {
        method: "post",
        body: formData,
      };
      fetch(url, options)
        .then((response) => {
          if (response.ok) {
            let countdown = 5;

            const countdownInterval = setInterval(() => {
              countdown--;
              if (countdown >= 0) {
                Swal.update({
                  icon: "success",
                  title: "Succesfully Submitted!",
                  text: `Redirecting in ${countdown}...`,
                });
              } else {
                clearInterval(countdownInterval);
                window.location.href = "consultation.html"; // Replace with your desired URL
              }
            }, 1000);

            Swal.fire({
              icon: "success",
              title: "Succesfully Submitted!",
              text: `Redirecting in ${countdown}...`,
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          } else {
            formAlerts.innerHTML =
              "<div class='alert alert-danger'>Error: " +
              response.statusText +
              "</div>";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          formAlerts.innerHTML =
            "<div class='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role='alert'>Not Sent.</div>";
        });
    }
  }

  function validateForm2(e) {
    // Prevent the default form submission
    e.preventDefault();

    const fiance = document.getElementById("FV");

    const sponsor = fiance.elements["sponsor"].value;
    const lname = fiance.elements["lname"].value;
    const fname = fiance.elements["fname"].value;
    const email = fiance.elements["email"].value;
    const pnumber = fiance.elements["pnumber"].value;
    const address = fiance.elements["address"].value;
    const pcode = fiance.elements["pcode"].value;
    const amrital = fiance.elements["AMaritalStatus"].value;
    const smrital = fiance.elements["SMaritalStatus"].value;
    const financialrequirement = document.querySelector(
      'input[name="financialrequirement"]:checked'
    ).value;

    // Perform validation for Form 2
    const formAlerts = document.getElementById("form_alerts");
    const metSponsor = document.querySelector(
      'input[name="metSponsor"]:checked'
    ).value;
    var eligibility = true;

    if (smrital === "Married") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible:\n\n",
        "We regret to inform you that due to your sponsor's marital status, you are not eligible to proceed with this process at this time. We apologize for any inconvenience this may cause."
      );
    } else if (metSponsor === "No") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "Although it is still possible to proceed with the application, there is a high risk of the Home Office questioning the genuineness of your relationship if you have not met your sponsor in person."
      );
    } else if (amrital === "Married") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "We regret to inform you that due to your marital status, you are not eligible to proceed with this process at this time. We apologize for any inconvenience this may cause."
      );
    } else if (sponsor === "On Benefits") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "We're sorry, but it looks like you've indicated that you receive benefits as your source of income. Unfortunately, we are unable to proceed with your application at this time."
      );
    } else if (financialrequirement === "No") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "We're sorry, but it looks like you've indicated that you do not meet the financial requirement for this application. Unfortunately, we are unable to proceed with your application at this time."
      );
    } else {
      AppendData();
    }

    function AppendData() {
      const visaType = document.getElementById("choosevisatype").value;

      // Create a FormData object and append the form data
      const formData = new FormData();
      formData.append("formName", "FV"); // Change this value to the name or identifier of the form being submitted
      formData.append("visaType", visaType);
      formData.append("eligibility", eligibility ? "Eligible" : "Not Eligible");
      formData.append("lname", lname);
      formData.append("fname", fname);
      formData.append("email", email);
      formData.append("pnumber", pnumber);
      formData.append("address", address);

      const countryValue = fiance.elements["country"].value;
      const otherCountryValue = fiance.elements["otherCountry"].value;

      formData.append("country", countryValue);
      formData.append("otherCountry", otherCountryValue);

      formData.append("pcode", pcode);
      formData.append("amrital", amrital);
      formData.append("smrital", smrital);
      formData.append("metSponsor", metSponsor);
      formData.append("financialrequirement", financialrequirement);
      formData.append("sponsor-income", sponsor);

      // Send data to the Google Apps Script
      const options = {
        method: "post",
        body: formData,
      };
      fetch(url, options)
        .then((response) => {
          if (response.ok) {
            let countdown = 5;

            const countdownInterval = setInterval(() => {
              countdown--;
              if (countdown >= 0) {
                Swal.update({
                  icon: "success",
                  title: "Succesfully Submitted!",
                  text: `Redirecting in ${countdown}...`,
                });
              } else {
                clearInterval(countdownInterval);
                window.location.href = "consultation.html"; // Replace with your desired URL
              }
            }, 1000);

            Swal.fire({
              icon: "success",
              title: "Succesfully Submitted!",
              text: `Redirecting in ${countdown}...`,
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          } else {
            formAlerts.innerHTML =
              "<div class='alert alert-danger'>Error: " +
              response.statusText +
              "</div>";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          formAlerts.innerHTML =
            "<div class='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role='alert'>Not Sent.</div>";
        });
    }
  }
  //spousevisafunc
  function validateForm3(e) {
    // Prevent the default form submission
    e.preventDefault();

    const spouse = document.getElementById("SV");

    const sponsor = spouse.elements["sponsor-income"].value;
    const lname = spouse.elements["lname"].value;
    const fname = spouse.elements["fname"].value;
    const email = spouse.elements["email"].value;
    const pnumber = spouse.elements["pnumber"].value;
    const address = spouse.elements["address"].value;
    const pcode = spouse.elements["pcode"].value;
    const financialrequirement = document.querySelector(
      'input[name="financialrequirement"]:checked'
    ).value;
    const pom1 = spouse.elements["pofmarriage"].value;
    const dom1 = spouse.elements["dofmarriage"].value;
    const benefits3 = spouse.elements["benefits-type"].value;
    // Perform validation for Form 3
    const formAlerts = document.getElementById("form_alerts");

    var eligibility = true;
    if (financialrequirement === "No") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible:\n\n",
        "We're sorry, but it looks like you've indicated that you do not meet the financial requirement for this application. Unfortunately, we are unable to proceed with your application at this time."
      );
    } else {
      AppendData();
    }

    function AppendData() {
      const visaType = document.getElementById("choosevisatype").value;

      // Create a FormData object and append the form data
      const formData = new FormData();
      formData.append("formName", "SV"); // Change this value to the name or identifier of the form being submitted
      formData.append("visaType", visaType);
      formData.append("eligibility", eligibility ? "Eligible" : "Not Eligible");
      formData.append("lname", lname);
      formData.append("fname", fname);
      formData.append("email", email);
      formData.append("pnumber", pnumber);
      formData.append("address", address);

      const countryValue = spouse.elements["country"].value;
      const otherCountryValue = spouse.elements["otherCountry"].value;

      formData.append("country", countryValue);
      formData.append("otherCountry", otherCountryValue);

      formData.append("pcode", pcode);
      formData.append("financialrequirement", financialrequirement);
      formData.append("benefits", benefits3);
      formData.append("pom", pom1);
      formData.append("dom", dom1);
      formData.append("sponsor-income", sponsor);
      // Send data to the Google Apps Script
      const options = {
        method: "post",
        body: formData,
      };
      fetch(url, options)
        .then((response) => {
          if (response.ok) {
            let countdown = 5;

            const countdownInterval = setInterval(() => {
              countdown--;
              if (countdown >= 0) {
                Swal.update({
                  icon: "success",
                  title: "Succesfully Submitted!",
                  text: `Redirecting in ${countdown}...`,
                });
              } else {
                clearInterval(countdownInterval);
                window.location.href = "consultation.html"; // Replace with your desired URL
              }
            }, 1000);

            Swal.fire({
              icon: "success",
              title: "Succesfully Submitted!",
              text: `Redirecting in ${countdown}...`,
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          } else {
            formAlerts.innerHTML =
              "<div class='alert alert-danger'>Error: " +
              response.statusText +
              "</div>";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          formAlerts.innerHTML =
            "<div class='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role='alert'>Not Sent.</div>";
        });
    }
  }
  //marriedvisitvisafunc
  function validateForm4(e) {
    // Prevent the default form submission
    e.preventDefault();

    const married = document.getElementById("MV");

    const lname = married.elements["lname"].value;
    const fname = married.elements["fname"].value;
    const email = married.elements["email"].value;
    const pnumber = married.elements["pnumber"].value;
    const address = married.elements["address"].value;
    const pcode = married.elements["pcode"].value;
    const amrital = married.elements["AMaritalStatus"].value;
    const smrital = married.elements["SMaritalStatus"].value;
    const sties = married.elements["sties"].value;

    // Perform validation for Form 4
    const formAlerts = document.getElementById("form_alerts");
    const metSponsor = document.querySelector(
      'input[name="metSponsor"]:checked'
    ).value;
    const sponsorSourceOfIncome = married.elements["sponsor-income"].value;
    const applicantSourceOfIncome = married.elements["applicant-income"].value;

    var eligibility = true;

    if (smrital === "Married") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible:\n\n",
        "We regret to inform you that due to your sponsor's marital status, you are not eligible to proceed with this process at this time. We apologize for any inconvenience this may cause."
      );
    } else if (metSponsor === "No") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "Although it is still possible to proceed with the application, there is a high risk of the Home Office questioning the genuineness of your relationship if you have not met your sponsor in person."
      );
    } else if (amrital === "Married") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "We regret to inform you that due to your marital status, you are not eligible to proceed with this process at this time. We apologize for any inconvenience this may cause."
      );
    } else if (sponsorSourceOfIncome === "On Benefits") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "We're sorry, but it looks like you've indicated that you receive benefits as your source of income. Unfortunately, we are unable to proceed with your application at this time."
      );
    } else if (
      applicantSourceOfIncome === "Business (less than a year)" ||
      applicantSourceOfIncome === "Employment (less than a year)"
    ) {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "We apologize for the inconvenience, but it appears that you have indicated that your source of income from employment or business is less than a year. Regrettably, we cannot proceed with your application as we require a minimum of one year of continuous income to be considered."
      );
    } else {
      AppendData();
    }

    function AppendData() {
      const visaType = document.getElementById("choosevisatype").value;

      // Create a FormData object and append the form data
      const formData = new FormData();
      formData.append("formName", "MV"); // Change this value to the name or identifier of the form being submitted
      formData.append("visaType", visaType);
      formData.append("eligibility", eligibility ? "Eligible" : "Not Eligible");
      formData.append("lname", lname);
      formData.append("fname", fname);
      formData.append("email", email);
      formData.append("pnumber", pnumber);
      formData.append("address", address);

      const countryValue = married.elements["country"].value;
      const otherCountryValue = married.elements["otherCountry"].value;

      formData.append("country", countryValue);
      formData.append("otherCountry", otherCountryValue);

      formData.append("pcode", pcode);
      formData.append("amrital", amrital);
      formData.append("metSponsor", metSponsor);
      formData.append("applicant-income", applicantSourceOfIncome);
      formData.append("sties", sties);
      formData.append("smrital", smrital);
      formData.append("sponsor-income", sponsorSourceOfIncome);

      // Send data to the Google Apps Script
      const options = {
        method: "post",
        body: formData,
      };
      fetch(url, options)
        .then((response) => {
          if (response.ok) {
            let countdown = 5;

            const countdownInterval = setInterval(() => {
              countdown--;
              if (countdown >= 0) {
                Swal.update({
                  icon: "success",
                  title: "Succesfully Submitted!!",
                  text: `Redirecting in ${countdown}...`,
                });
              } else {
                clearInterval(countdownInterval);
                window.location.href = "consultation.html"; // Replace with your desired URL
              }
            }, 1000);

            Swal.fire({
              icon: "success",
              title: "Succesfully Submitted!",
              text: `Redirecting in ${countdown}...`,
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          } else {
            formAlerts.innerHTML =
              "<div class='alert alert-danger'>Error: " +
              response.statusText +
              "</div>";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          formAlerts.innerHTML =
            "<div class='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role='alert'>Not Sent.</div>";
        });
    }
  }
  //unmarriedvisitvisafunc
  function validateForm5(e) {
    // Prevent the default form submission
    e.preventDefault();

    const umarried = document.getElementById("UMVV");

    const lname = umarried.elements["lname"].value;
    const fname = umarried.elements["fname"].value;
    const email = umarried.elements["email"].value;
    const pnumber = umarried.elements["pnumber"].value;
    const address = umarried.elements["address"].value;
    const pcode = umarried.elements["pcode"].value;
    const amrital = umarried.elements["AMaritalStatus"].value;
    const smrital = umarried.elements["SMaritalStatus"].value;
    const financialrequirement = document.querySelector(
      'input[name="financialrequirement"]:checked'
    ).value;
    // Perform validation for Form 5
    const formAlerts = document.getElementById("form_alerts");
    const metSponsor = document.querySelector(
      'input[name="metSponsor"]:checked'
    ).value;
    const lived = document.querySelector('input[name="lived"]:checked').value;
    const sponsorSourceOfIncome = umarried.elements["sponsor-income"].value;
    var eligibility = true;

    if (lived === "No") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible:\n\n",
        "We're sorry, but it looks like you've indicated that you and your partner have not lived together for a minimum of 2 years. Unfortunately, we require a minimum of 2 years of continuous cohabitation to be considered for this application."
      );
    } else if (metSponsor === "No") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "Although it is still possible to proceed with the application, there is a high risk of the Home Office questioning the genuineness of your relationship if you have not met your sponsor in person."
      );
    } else if (amrital === "Married") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible\n",
        "We regret to inform you that due to your marital status, you are not eligible to proceed with this process at this time. We apologize for any inconvenience this may cause."
      );
    } else if (financialrequirement === "No") {
      eligibility = false;
      showSweetAlert(
        "Not Eligible:\n\n",
        "We're sorry, but it looks like you've indicated that you do not meet the financial requirement for this application. Unfortunately, we are unable to proceed with your application at this time."
      );
    } else {
      AppendData();
    }

    function AppendData() {
      const visaType = document.getElementById("choosevisatype").value;

      // Create a FormData object and append the form data
      const formData = new FormData();
      formData.append("formName", "UMVV"); // Change this value to the name or identifier of the form being submitted
      formData.append("visaType", visaType);
      formData.append("eligibility", eligibility ? "Eligible" : "Not Eligible");
      formData.append("lname", lname);
      formData.append("fname", fname);
      formData.append("email", email);
      formData.append("pnumber", pnumber);
      formData.append("address", address);

      const countryValue = umarried.elements["country"].value;
      const otherCountryValue = umarried.elements["otherCountry"].value;

      formData.append("country", countryValue);
      formData.append("otherCountry", otherCountryValue);

      formData.append("pcode", pcode);
      formData.append("amrital", amrital);
      formData.append("metSponsor", metSponsor);
      formData.append("lived", lived);
      formData.append("smrital", smrital);
      formData.append("financialrequirement", financialrequirement);
      formData.append("sponsor-income", sponsorSourceOfIncome);

      // Send data to the Google Apps Script
      const options = {
        method: "post",
        body: formData,
      };
      fetch(url, options)
        .then((response) => {
          if (response.ok) {
            let countdown = 5;

            const countdownInterval = setInterval(() => {
              countdown--;
              if (countdown >= 0) {
                Swal.update({
                  icon: "success",
                  title: "Succesfully Submitted!",
                  text: `Redirecting in ${countdown}...`,
                });
              } else {
                clearInterval(countdownInterval);
                window.location.href = "consultation.html"; // Replace with your desired URL
              }
            }, 1000);

            Swal.fire({
              icon: "success",
              title: "Succesfully Submitted!",
              text: `Redirecting in ${countdown}...`,
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
          } else {
            formAlerts.innerHTML =
              "<div class='alert alert-danger'>Error: " +
              response.statusText +
              "</div>";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          formAlerts.innerHTML =
            "<div class='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role='alert'>Not Sent.</div>";
        });
    }
  }

  function showSweetAlert(title, message) {
    Swal.fire({
      html: `
      <div class="space-y-2">
        <p class="font-semibold text-red-500">${title}</p>
        <p class="text-white whitespace-pre-line text-justify">${message}</p>
      </div>`,
      icon: "error", // Change this to 'success', 'warning', or 'info' based on the desired appearance
      confirmButtonText: "Close",
      background: "rgba(42, 39, 39, 0.9)",
      customClass: {
        container: "bg-gray-900 bg-opacity-80",
        popup: "rounded-md shadow-md p-4",
        actions: "mt-4",
      },
    });
  }
  function Unemployed(title, message) {
    Swal.fire({
      html: `
      <div class="space-y-2">
        <p class="font-semibold text-yellow-500">${title}</p>
        <p class="text-white whitespace-pre-line text-justify">${message}</p>
      </div>`,
      icon: "warning", // Change this to 'success', 'warning', or 'info' based on the desired appearance
      confirmButtonText: "Close",
      background: "rgba(42, 39, 39, 0.9)",
      footer:
        "<div class='text-white'>Your details will be submitted automatically in 10 seconds.</div>",
      customClass: {
        container: "bg-gray-900 bg-opacity-80",
        popup: "rounded-md shadow-md p-4",
        actions: "mt-4",
      },
    });
  }
});

function handleCountryChange(event, containerId) {
  const countrySelect = event.target;
  const otherCountryContainer = document.getElementById(containerId);

  if (countrySelect.value === "Other") {
    otherCountryContainer.classList.remove("hidden");
  } else {
    otherCountryContainer.classList.add("hidden");
  }
}
function benefitchange(event, containerId) {
  const countrySelect1 = event.target;
  const otherCountryContainer1 = document.getElementById(containerId);

  if (countrySelect1.value === "On Benefits") {
    otherCountryContainer1.classList.remove("hidden");
  } else {
    otherCountryContainer1.classList.add("hidden");
  }
}

const benefits = document.getElementById("sponsor-income1");
const benefits1 = document.getElementById("btf");
benefits.addEventListener("change", (event) => {
  benefitchange(event, "btf");
});

const countrySelect1 = document.getElementById("country");
const otherCountryContainer1 = document.getElementById("otherCountryContainer");
countrySelect1.addEventListener("change", (event) => {
  handleCountryChange(event, "otherCountryContainer");
});

const countrySelect2 = document.getElementById("country2");
const otherCountryContainer2 = document.getElementById(
  "otherCountryContainer2"
);
countrySelect2.addEventListener("change", (event) => {
  handleCountryChange(event, "otherCountryContainer2");
});

const countrySelect3 = document.getElementById("country3");
const otherCountryContainer3 = document.getElementById(
  "otherCountryContainer3"
);
countrySelect3.addEventListener("change", (event) => {
  handleCountryChange(event, "otherCountryContainer3");
});

const countrySelect4 = document.getElementById("country4");
const otherCountryContainer4 = document.getElementById(
  "otherCountryContainer4"
);
countrySelect4.addEventListener("change", (event) => {
  handleCountryChange(event, "otherCountryContainer4");
});

const countrySelect5 = document.getElementById("country5");
const otherCountryContainer5 = document.getElementById(
  "otherCountryContainer5"
);
countrySelect5.addEventListener("change", (event) => {
  handleCountryChange(event, "otherCountryContainer5");
});
