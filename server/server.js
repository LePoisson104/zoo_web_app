const express = require("express");
const app = express();
const cors = require("cors");
const port = 3100;
const dbService = require("./db");

app.use(cors());
app.use(express());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//create
app.post("/admin/insert", (request, response) => {
  const db = dbService.getDbServiceInstance();
  const { image, name, species, enclosure, enclosure_id, age, gender, weight } =
    request.body;
  const result = db.insertNewAnimal(
    image,
    name,
    species,
    enclosure,
    enclosure_id,
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
app.get("/admin/get_animal_by_id/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const results = db.get_animal_by_id(id);

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/admin/load_animal_by_enclosure/:id", (req, res) => {
  const { id } = req.params;
  const db = dbService.getDbServiceInstance();
  const results = db.load_animal_by_enclosure(id);

  results
    .then((data) => res.json({ data: data }))
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

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const db = dbService.getDbServiceInstance();
  const results = db.authenticateUser(username, password);

  results
    .then((data) => {
      if (data.length === 0)
        throw new Error("Username or password does not match");
      return res.json({ data });
    })
    .catch((err) => {
      return res.status(401).json({ message: err.message });
    });
});
app.post("/user/register", async (req, res) => {
  const { username, password, role } = req.body;
  const db = dbService.getDbServiceInstance();

  try {
    const usernameExists = await db.checkUsernameExists(username);

    if (usernameExists) {
      // Username already exists, handle accordingly
      return res.status(400).json({ message: "Email already exists" });
    }

    const registrationResult = await db.user_register(username, password, role);

    if (registrationResult) {
      // Registration successful
      return res.status(200).json({ message: "User registered successfully" });
    } else {
      // Registration failed
      return res.status(500).json({ message: "User registration failed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
