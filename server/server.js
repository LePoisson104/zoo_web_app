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
app.post("/user/insert_customer_info", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { first_name, last_name, phone_number, address, city, state, zipcode } =
    req.body;
  const result = db.insert_customer_info(
    first_name,
    last_name,
    phone_number,
    address,
    city,
    state,
    zipcode
  );

  result
    .then((data) => res.json({ success: data }))
    .catch((err) => console.log(err));
});
app.post("/user/insert_into_purchase_history", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const {
    customer_id,
    date_of_purchase,
    item_id,
    quantity,
    amount,
    update_quantity,
  } = req.body;

  // Use Promise.all to wait for both promises to resolve
  Promise.all([
    db.insert_into_purchase_history(
      customer_id,
      date_of_purchase,
      item_id,
      quantity,
      amount
    ),
    db.update_inventory_quantity(update_quantity, item_id),
  ])
    .then(([purchaseResult, inventoryResult]) => {
      // Send a combined response
      res.json({ success: { purchaseResult, inventoryResult } });
    })
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
app.get("/user/load_memberships", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const results = db.load_memberships();

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/user/get_customer_info/:email", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { email } = req.params;
  const results = db.get_customer_info(email);

  results
    .then((data) => res.json({ data: data }))
    .catch((err) => console.log(err));
});
app.get("/user/load_shop_items", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const results = db.load_shop_items();

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

app.patch("/user/update_cus_membership", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { email, membership_id } = req.body;
  const result = db.update_cus_membership(email, membership_id);

  result
    //send this data back to the front end
    .then((data) => res.json({ success: data }))
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
