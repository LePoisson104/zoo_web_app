const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";

document.addEventListener("DOMContentLoaded", function () {
  let role = window.localStorage.getItem("role");
  if (role === undefined || role != 2)
    window.location.replace(front_end_url + "/Login/login.html");
  // else show_report();
  else get_all_purchse_history();
});

let selected_start_date = "";
let selected_end_date = "";

function setStartDate(val) {
  selected_start_date = val;
}

function setEndDate(val) {
  selected_end_date = val;
}
// rename
function is_valid_date(date, i) {
  let start_date = document.getElementsByClassName("start_date")[i].value;
  let end_date = document.getElementsByClassName("end_date")[i].value;
  return (
    (compare_date(start_date, date) === 0 ||
      compare_date(start_date, date) === 2) &&
    (compare_date(end_date, date) === 0 || compare_date(end_date, date) === 1)
  );
}

function filter(i) {
  let start_date = document.getElementsByClassName("start_date")[i].value;
  let end_date = document.getElementsByClassName("end_date")[i].value;
  console.log(start_date, end_date);
  if (
    start_date === "" ||
    end_date === "" ||
    compare_date(start_date, end_date) === 1
  ) {
    alert("Invalid date");
    return;
  }

  show_report(i);
}

function compare_date(date1, date2) {
  // Create two date objects
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Compare dates return largest date
  if (d1 < d2) {
    return 2;
  } else if (d1 > d2) {
    return 1;
  } else {
    return 0;
  }
}

function get_all_purchse_history() {
  fetch(back_end_url + "/admin/get_all_purchase_history")
    .then((response) => response.json())
    .then((data) => {
      let filter_data = data["data"].filter((d) => {
        if (is_valid_date(d.date_of_purchase, 0)) {
          return d;
        }
      });
      load_report_table(filter_data);
    });
}
async function load_report_by_type(type, element, i) {
  // let res = await fetch(back_end_url + "/admin/load_report_by_type/" + type, {
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   method: "GET",
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     console.log(i);
  //     let filter_data = data["data"].filter((d) => {
  //       if (is_valid_date(d.date_of_purchase, i)) {
  //         return d;
  //       }
  //     });
  //     load_report_table_type(filter_data, element);
  //   });
  let res = await fetch(back_end_url + "/admin/load_report_by_type/" + type, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  let data = await res.json();
  console.log(i);
  let filter_data = data["data"].filter((d) => {
    if (is_valid_date(d.date_of_purchase, i)) {
      return d;
    }
  });
  load_report_table_type(filter_data, element);
}
function load_report_table_type(data, element) {
  let animal_table = "";
  // console.log(element);
  let table = element
    .getElementsByTagName("table")[0]
    .getElementsByTagName("tbody")[0];

  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML = "<tr><td class='no_data' colspan='6'>NO DATA</td></tr>";
    return;
  }

  data.forEach(function ({
    purchase_id,
    date_of_purchase,
    item_id,
    item_name,
    quantity,
    amount,
  }) {
    animal_table += "<tr>";
    animal_table += `<td>${purchase_id}</td>`;
    animal_table += `<td>${date_of_purchase}</td>`;
    animal_table += `<td>${item_id}</td>`;
    animal_table += `<td>${item_name}</td>`;
    animal_table += `<td>${quantity}</td>`;
    animal_table += `<td>$${amount}</td>`;
    animal_table += "</tr>";
  });
  animal_table += `<tr><td colspan='5'></td><td>Total: $${data[0].total_revenue}</td></tr>`;
  table.innerHTML = animal_table;
}
function load_report_table(data) {
  const table = document.querySelector("table tbody");
  let animal_table = "";

  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML = "<tr><td class='no_data' colspan='6'>NO DATA</td></tr>";
    return;
  }

  data.forEach(function ({
    purchase_id,
    date_of_purchase,
    item_id,
    quantity,
    amount,
    item_name,
  }) {
    animal_table += "<tr>";
    animal_table += `<td>${purchase_id}</td>`;
    animal_table += `<td>${date_of_purchase}</td>`;
    animal_table += `<td>${item_id}</td>`;
    animal_table += `<td>${item_name}</td>`;
    animal_table += `<td>${quantity}</td>`;
    animal_table += `<td>$${amount}</td>`;
    animal_table += "</tr>";
  });
  animal_table += `<tr><td colspan='5'></td><td>Total: $${data[0].total_revenue}</td></tr>`;
  table.innerHTML = animal_table;
}

function show_report() {
  const selectedValue = document.getElementById("report_type").value;
  const reports = {
    total_revenue: {
      element: document.querySelector("#total_revenue"),
      type: "null",
      i: 0,
    },
    gift_shop_sales: {
      element: document.querySelector("#gift_shop_sales"),
      type: "gift_shop",
      i: 1,
    },
    membership_sales: {
      element: document.querySelector("#membership_sales"),
      type: "membership",
      i: 2,
    },
    tickets_sales: {
      element: document.querySelector("#ticket_sales"),
      type: "tickets",
      i: 3,
    },
  };

  // Hide all enclosures by default
  for (const key in reports) {
    reports[key].element.hidden = true;
  }

  // Show the selected enclosure
  const selectedEnclosure = reports[selectedValue];
  if (selectedEnclosure) {
    selectedEnclosure.element.hidden = false;
    if (selectedEnclosure.type != null)
      load_report_by_type(
        selectedEnclosure.type,
        selectedEnclosure.element,
        selectedEnclosure.i
      );
    get_all_purchse_history();
  }
  // selected_start_date = "";
  // selected_end_date = "";
  // document.getElementById("start_date").value = "";
  // document.getElementById("end_date").value = "";
}
