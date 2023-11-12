const front_end_url = "http://127.0.0.1:5500";
const back_end_url = "http://localhost:3100";
let member_ship_options = [];

document.addEventListener("DOMContentLoaded", function () {
  fetch(back_end_url + "/user/load_memberships")
    .then((response) => response.json())
    .then((data) => {
      for (let d of data["data"]) {
        member_ship_options.push({ ...d, active: false, disable: false });
      }
      let role = window.localStorage.getItem("role");
      if (role != null && role === "0") {
        get_member_info(window.localStorage.getItem("username"));
      } else {
        load_member_ship_options();
      }
    });
});

function load_member_ship_options() {
  const member_ship_card = document.getElementById("membership_container");
  member_ship_card.innerHTML = "";
  for (let member_ship of member_ship_options) {
    member_ship_card.innerHTML += `
           <div class="card text-center ${
             member_ship.active && "active"
           }" style="width: 18rem;">
                    <div class="card-header fs-4 text-capitalize">${
                      member_ship.membership_type
                    }</div>
                    <div class="card-body">
                        <div class="fw-bold"><span class="fs-2">$${
                          member_ship.price
                        }</span> <span class="text-secondary fs-3">/Year</span>
                        </div>
                        <ul class="list-unstyled mt-3 mb-4">
                            <li>Free general parking</li>
                            <li>${member_ship.discount}% discount </li>
                            <li class="text-secondary"> Biweekly : </li> 
                            <li>
                                ${member_ship.children} free children ticket 
                            </li>
                            <li>${member_ship.adults} free adult ticket</li>
                            <li ${member_ship.guests === 0 && "hidden"}>
                                ${member_ship.guests} free guest ticket
                            </li>
                        </ul>
                    </div>
                    <div class="card-footer"> 
                        <button 
                            type="button" 
                            class="w-100 btn btn-outline-success btn-lg" 
                            data-type=${member_ship.membership_type} 
                            onclick="active_membership(this)"
                            ${member_ship.disable && "disabled"}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>`;
  }
}

const modal = document.getElementById("modal");

function open_modal() {
  modal.classList.remove("d-none");
  modal.classList.add("d-block");
}

function close_modal() {
  modal.classList.remove("d-block");
  modal.classList.add("d-none");
}

let select_member_ship;
function active_membership(object) {
  let role = window.localStorage.getItem("role");
  console.log(role);
  if (role === null) {
    alert("Please login");
    return;
  }
  let member_ship_type = object.getAttribute("data-type");
  select_member_ship = member_ship_type;
  let message = "You want to sign up for this membership?";
  open_modal();
  let modal_body = document.getElementById("modal_body");
  for (let member_ship of member_ship_options) {
    if (member_ship.active) {
      message = `You already have a ${member_ship.membership_type} membership. Do you want to upgrade to ${member_ship_type} membership?`;
    }
  }
  modal_body.innerHTML = `
        <h3 class="text-capitalize">${member_ship_type} Membership</h3>
        <p>${message}</p>
    `;
}

function get_member_info(email) {
  fetch(back_end_url + "/user/get_customer_info/" + email)
    .then((res) => res.json())
    .then((data) => {
      let { membership_id } = data["data"][0];
      if (membership_id !== "1") {
        for (let member_ship of member_ship_options) {
          member_ship.disable = true;
          if (member_ship.membership_id === membership_id) {
            member_ship.active = true;
            load_member_ship_options();
            return;
          }
          member_ship.active = false;
        }
      }
    });
}

//confirm purchase
function confirm_member() {
  for (let member_ship of member_ship_options) {
    member_ship.disable = true;
    if (member_ship.membership_type === select_member_ship) {
      member_ship.active = true;
      fetch(back_end_url + "/user/update_cus_membership", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          email: window.localStorage.getItem("username"),
          membership_id: member_ship.membership_id,
        }),
      }).then((res) => {
        if (res.ok) {
          close_modal();
          load_member_ship_options();
        } else {
          alert("Server error, can't update");
        }
      });

      return;
    }
    member_ship.active = false;
  }
}
