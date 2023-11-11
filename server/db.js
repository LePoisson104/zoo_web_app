const mysql = require("mysql");
const { message } = require("prompt");
let instance = null;

const connection = mysql.createConnection({
  host: "team7db.cymql2sd4zy7.us-east-1.rds.amazonaws.com",
  database: "zoo",
  user: "team7db",
  password: "Team71042002",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("database conneced successfully!");
});

//class contains all the functions to add create delete
class dbService {
  //create new instance
  static getDbServiceInstance() {
    //if not null create new instance
    return instance ? instance : new dbService();
  }
  //get animal info from database to appears on the table
  async getAllAnimalData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT animal_id, image, animal_name, species, enclosure, age, gender, weight FROM animals;";
        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err, message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  //insert new animal into database
  async insertNewAnimal(
    image,
    name,
    species,
    enclosure,
    enclosure_id,
    age,
    gender,
    weight
  ) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO animals (image, animal_name, species, enclosure, enclosure_id, age, gender, weight) VALUES (?,?,?,?,?,?,?,?);";
        connection.query(
          query,
          [image, name, species, enclosure, enclosure_id, age, gender, weight],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.insertId);
          }
        );
      });
      return {
        id: insertId,
        image: image,
        name: name,
        species: species,
        enclosure: enclosure,
        age: age,
        gender: gender,
        weight: weight,
      };
    } catch {
      console.log(error);
    }
  }
  //function to delete animal row
  async delete_animal_row(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM animals WHERE animal_id = ?;";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async update_animal(
    id,
    image,
    name,
    species,
    enclosure,
    age,
    gender,
    weight
  ) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query =
          "UPDATE animals SET image = ?, animal_name = ?, species = ?, enclosure = ?, age = ?, gender = ?, weight = ? WHERE animal_id = ?";

        connection.query(
          query,
          [image, name, species, enclosure, age, gender, weight, id],
          (err, result) => {
            if (err) reject(new Error(err.message));
            resolve(result.affectedRows);
          }
        );
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  //report
  async getAllReport() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT enclosures.enclosure_id, enclosures.enclosure_name, enclosures.capacity, GROUP_CONCAT(animals.animal_name ORDER BY animals.animal_name) AS name_list, COUNT(animals.animal_id) AS animal_count FROM enclosures LEFT JOIN animals ON enclosures.enclosure_id = animals.enclosure_id GROUP BY enclosures.enclosure_id, enclosures.enclosure_name;";
        connection.query(query, (err, results) => {
          if (err) {
            reject(new Error(err, message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  async authenticateUser(username, password) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT username, role FROM login WHERE username = ? AND password = ?;";
        connection.query(query, [username, password], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async user_register(username, password, role) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "INSERT INTO login (username, password, role) VALUES (?,?,?);";
        connection.query(query, [username, password, role], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });
      return response === 0 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async checkUsernameExists(username) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT COUNT(*) as count FROM login WHERE username = ?;";
        connection.query(query, [username], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result[0].count > 0);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async get_animal_by_id(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT image, animal_name as name, species, enclosure, age, gender, weight FROM animals WHERE animal_id = ?;";
        connection.query(query, [id], (err, results) => {
          if (err) {
            reject(new Error(err, message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async load_animal_by_enclosure(id) {
    try {
      const response = await new Promise((resolve, reject) => {
        const query =
          "SELECT animal_id, image, animal_name, species, enclosure, age, gender, weight FROM animals WHERE enclosure_id = ?;";
        connection.query(query, [id], (err, results) => {
          if (err) {
            reject(new Error(err, message));
          } else {
            resolve(results);
          }
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = dbService;
