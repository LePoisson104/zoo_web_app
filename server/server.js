const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const dbService = require("./db");

app.use(cors());
app.use(express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/admin/insert", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const { image, name, species, enclosure, age, gender, weight } = request.body;
  const result = db.insertNewAnimal(
    image,
    name,
    species,
    enclosure,
    age,
    gender,
    weight
  );

  result
    //send this data back to the front end
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});
//get
app.get("/admin/animaltable", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const results = db.getAllAnimalData();
  results
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/admin/getall_enclosure_report", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const results = db.getAllReport();

  results
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});
//update
app.patch("/admin/update_animal", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const { id, image, name, species, enclosure, age, gender, weight } =
    request.body;
  const result = db.update_animal(
    id,
    image,
    name,
    species,
    enclosure,
    age,
    gender,
    weight
  );

  result
    //send this data back to the front end
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});
//delete
app.delete("/admin/delete_animal_row/:id", (request, response) => {
  // get id from this prams "admin/delete_animal_row/:id"
  const { id } = request.params;
  //   console.log(request.params);
  const db = dbService.getDbServiceInstance();
  const result = db.delete_animal_row(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
