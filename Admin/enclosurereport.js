// TODO:
// show animals in different enclosure when select
// add trigger to present adding animal when rached capacity
// add trigger if animal not suppose to be in the wrong exhibit
const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";
document.addEventListener("DOMContentLoaded", function () {
  fetch(back_end_url + "/admin/getall_enclosure_report")
    .then((response) => response.json())
    .then((data) => load_report_table(data["data"]));
});

function load_animal_by_enclosure(id) {
  fetch(back_end_url + "/admin/load_animal_by_enclosure/" + id, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => load_table_by_enclosure(data["data"]));
}

function load_table_by_enclosure(data) {
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
    animal_table += `<td><img style="width=3rem, height = 3rem" class="animal_table_image" src="${image}" alt="picture of the animal"></td>`;
    animal_table += `<td>${animal_name}</td>`;
    animal_table += `<td>${species}</td>`;
    animal_table += `<td>${enclosure}</td>`;
    animal_table += `<td>${age}</td>`;
    animal_table += `<td>${gender}</td>`;
    animal_table += `<td>${weight}</td>`;
    animal_table += "</tr>";
  });
  table.innerHTML = animal_table;
}

function load_report_table(data) {
  const table = document.querySelector("table tbody");
  let animal_table = "";

  data.forEach(function ({
    enclosure_id,
    enclosure_name,
    capacity,
    name_list,
    animal_count,
  }) {
    animal_table += "<tr>";
    animal_table += `<td>${enclosure_id}</td>`;
    animal_table += `<td>${enclosure_name}</td>`;
    animal_table += `<td>${capacity}</td>`;
    animal_table += `<td>${name_list}</td>`;
    animal_table += `<td>${animal_count}</td>`;
    animal_table += "</tr>";
  });
  table.innerHTML = animal_table;
}

function show_report() {
  const selectedValue = document.getElementById("enclosure_type").value;

  const enclosures = {
    all_enclosure: {
      element: document.querySelector("#all_enclosure"),
      // animalId: null,
    },
    lion_habitat: {
      element: document.querySelector("#lion_habitat"),
      // animalId: 100,
    },
    elephant_zone: {
      element: document.querySelector("#elephant_zone"),
      // animalId: 101,
    },
    giraffe_exhibit: {
      element: document.querySelector("#giraffe_exhibit"),
      // animalId: 102,
    },
    bird_aviary: {
      element: document.querySelector("#bird_aviary"),
      // animalId: 103,
    },
    jungle_cat: {
      element: document.querySelector("#jungle_cat"),
      // animalId: 104,
    },
  };

  // Hide all enclosures by default
  for (const key in enclosures) {
    enclosures[key].element.hidden = true;
  }

  // Show the selected enclosure
  const selectedEnclosure = enclosures[selectedValue];
  if (selectedEnclosure) {
    selectedEnclosure.element.hidden = false;
    // load_animal_by_enclosure(selectedEnclosure.animalId);
  }
}
