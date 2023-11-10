// TODO:
// add enclosure id into animal table
// show animals in different enclosure when select
// if can make enclosure_id foreign and get name from enclosure table
// add trigger to present adding animal when rached capacity
// add trigger if animal not suppose to be in the wrong exhibit
// add feature in edit, when user click edit pull data from that row into the form

document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3000/admin/getall_enclosure_report")
    .then((response) => response.json())
    .then((data) => load_report_table(data["data"]));
});

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
  const all_enclosure = document.querySelector("#all_enclosure");
  const lion_habitat = document.querySelector("#lion_habitat");
  const elephant_zone = document.querySelector("#elephant_zone");
  const giraffe_exhibit = document.querySelector("#giraffe_exhibit");
  const bird_aviary = document.querySelector("#bird_aviary");

  //show section
  if (selectedValue === "all_enclosure") {
    all_enclosure.hidden = false;
    lion_habitat.hidden = true;
    elephant_zone.hidden = true;
    giraffe_exhibit.hidden = true;
    bird_aviary.hidden = true;
  } else if (selectedValue === "lion_habitat") {
    all_enclosure.hidden = true;
    lion_habitat.hidden = false;
    elephant_zone.hidden = true;
    giraffe_exhibit.hidden = true;
    bird_aviary.hidden = true;
  } else if (selectedValue === "elephant_zone") {
    all_enclosure.hidden = true;
    lion_habitat.hidden = true;
    elephant_zone.hidden = false;
    giraffe_exhibit.hidden = true;
    bird_aviary.hidden = true;
  } else if (selectedValue === "giraffe_exhibit") {
    all_enclosure.hidden = true;
    lion_habitat.hidden = true;
    elephant_zone.hidden = true;
    giraffe_exhibit.hidden = false;
    bird_aviary.hidden = true;
  } else if (selectedValue === "bird_aviary") {
    all_enclosure.hidden = true;
    lion_habitat.hidden = true;
    elephant_zone.hidden = true;
    giraffe_exhibit.hidden = true;
    bird_aviary.hidden = false;
  }
}
