// const { json } = require("body-parser");

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/admin/animaltable")
    .then((response) => response.json())
    .then((data) => load_animal_table(data["data"]));
});

let aleart_success = document.getElementById("aleart_success");

document
  .getElementById("animal_info_form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const form = document.getElementById("animal_info_form");
    const formData = new FormData(form);

    // Convert the form data to a JSON object
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    // console.log(jsonObject);
    fetch("http://localhost:3000/admin/insert", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(jsonObject),
    })
      .then((response) => response.json())
      .then((data) => {
        insert_animal_row(data["data"]);
        event.target.reset();
        aleart_success.hidden = false;
        aleart_success.classList.add("fade_animate");
        setTimeout(() => {
          aleart_success.hidden = true;
          aleart_success.classList.remove("fade_animate");
        }, 2000);
      });
  });
//insert row in animal table
function insert_animal_row(data) {
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");
  let animal_table = "<tr>";

  for (var key in data) {
    if (data.hasOwnProperty(key) && data[key].length > 50) {
      animal_table += `<td><img style="width: 5rem; height: 5rem;" src="${data[key]}" alt="picture of the animal"</td>`;
    } else if (data.hasOwnProperty(key)) {
      animal_table += `<td>${data[key]}</td>`;
    }
  }

  animal_table += `<td><button class="btn edit_btn" data-id=${data[key]} onclick="edit_animal(this)">Edit</button></td>`;
  animal_table += `<td><button class="btn delete_btn" data-id=${data[key]} onclick="deleteAnimalRow(this)">Delete</button></td>`;

  animal_table += "</tr>";

  if (isTableData) {
    table.innerHTML = animal_table;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = animal_table;
  }
}

//load table when new animal is added
function load_animal_table(data) {
  const table = document.querySelector("table tbody");
  let animal_table = "";

  if (data.length === 0) {
    //insert no data table when there is no data
    table.innerHTML = "<tr><td class='no_data' colspan='10'>NO DATA</td></tr>";
    return;
  }
  data.forEach(function ({
    animal_id,
    image,
    animal_name,
    species,
    enclosure,
    age,
    gender,
    weight,
  }) {
    animal_table += "<tr>";
    animal_table += `<td>${animal_id}</td>`;
    animal_table += `<td><img style="width: 5rem; height: 5rem;" src="${image}" alt="picture of the animal"></td>`;
    animal_table += `<td>${animal_name}</td>`;
    animal_table += `<td>${species}</td>`;
    animal_table += `<td>${enclosure}</td>`;
    animal_table += `<td>${age}</td>`;
    animal_table += `<td>${gender}</td>`;
    animal_table += `<td>${weight}</td>`;
    animal_table += `<td><button class="btn edit_btn" data-id=${animal_id} onclick="edit_animal(this)">Edit</button></td>`;
    animal_table += `<td><button class="btn delete_btn" data-id=${animal_id} onclick="deleteAnimalRow(this)">Delete</button></td>`;
    animal_table += "</tr>";
  });
  table.innerHTML = animal_table;
}
//update animal
function edit_animal(object) {
  const id = object.getAttribute("data-id");
  const updateSection = document.querySelector("#update_form");
  const inputSection = document.querySelector("#input_form");
  inputSection.hidden = true;
  updateSection.hidden = false;

  document
    .getElementById("animal_update_info_form")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent the default form submission

      const form = document.getElementById("animal_update_info_form");
      const formData = new FormData(form);
      // Convert the form data to a JSON object
      const jsonObject = {};
      formData.forEach((value, key) => {
        jsonObject[key] = value;
      });
      jsonObject.id = id;

      fetch("http://localhost:3000/admin/update_animal", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(jsonObject),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            event.target.reset();
            //hide the update form and show the add form
            const updateSection = document.querySelector("#update_form");
            const inputSection = document.querySelector("#input_form");
            inputSection.hidden = false;
            updateSection.hidden = true;
            location.reload();
          }
          //reset the form input values
        });
    });
}
function cancel_update() {
  const updateSection = document.querySelector("#update_form");
  const inputSection = document.querySelector("#input_form");
  inputSection.hidden = false;
  updateSection.hidden = true;
}
//delete animal
function deleteAnimalRow(object) {
  let id = object.getAttribute("data-id");
  //   console.log(id);
  fetch("http://localhost:3000/admin/delete_animal_row/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}
