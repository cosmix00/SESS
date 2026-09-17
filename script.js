/ ------------------------------------
// SMART PANTRY
// ------------------------------------

// Load saved items.
// If there aren't any, use example groceries.

let pantryItems =
    JSON.parse(localStorage.getItem("pantryItems")) || [

        {
            name: "Rice",
            weight: 620,
            limit: 300
        },

        {
            name: "Flour",
            weight: 180,
            limit: 250
        },

        {
            name: "Coffee",
            weight: 160,
            limit: 100
        },

        {
            name: "Cereal",
            weight: 80,
            limit: 150
        }

    ];


// ------------------------------------
// SAVE DATA
// ------------------------------------

function saveData() {

    localStorage.setItem(
        "pantryItems",
        JSON.stringify(pantryItems)
    );

}


// ------------------------------------
// CHANGE PAGE
// ------------------------------------

function showPage(pageId, button) {

    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active");
        });


    document
        .getElementById(pageId)
        .classList.add("active");


    document
        .querySelectorAll(".nav-button")
        .forEach(nav => {
            nav.classList.remove("active");
        });


    button.classList.add("active");


    renderApp();
}


// ------------------------------------
// OPEN ADD ITEM
// ------------------------------------

function openAddModal() {

    document
        .getElementById("addModal")
        .classList.add("show");

}


// ------------------------------------
// CLOSE ADD ITEM
// ------------------------------------

function closeAddModal() {

    document
        .getElementById("addModal")
        .classList.remove("show");

}


// ------------------------------------
// ADD NEW ITEM
// ------------------------------------

function addItem() {

    const name =
        document
            .getElementById("itemName")
            .value
            .trim();


    const weight =
        Number(
            document
                .getElementById("itemWeight")
                .value
        );


    const limit =
        Number(
            document
                .getElementById("itemLimit")
                .value
        );


    if (
        name === "" ||
        weight < 0 ||
        limit < 0
    ) {

        alert(
            "Please enter valid item information."
        );

        return;
    }


    pantryItems.push({

        name: name,
        weight: weight,
        limit: limit

    });


    saveData();


    // Clear form

    document.getElementById(
        "itemName"
    ).value = "";

    document.getElementById(
        "itemWeight"
    ).value = "";

    document.getElementById(
        "itemLimit"
    ).value = "";


    closeAddModal();

    renderApp();
}


// ------------------------------------
// DELETE ITEM
// ------------------------------------

function deleteItem(index) {

    const confirmed =
        confirm(
            `Remove ${pantryItems[index].name} from your pantry?`
        );


    if (!confirmed) {
        return;
    }


    pantryItems.splice(index, 1);

    saveData();

    renderApp();
}


// ------------------------------------
// SENSOR WEIGHT
// ------------------------------------

// For now the slider simulates
// data from your load cell.
//
// Later this function can receive
// the actual ESP32 sensor reading.

function updateWeight(index, newWeight) {

    pantryItems[index].weight =
        Number(newWeight);


    saveData();

    renderApp();
}


// ------------------------------------
// CHANGE RESTOCK LIMIT
// ------------------------------------

function updateLimit(index, newLimit) {

    pantryItems[index].limit =
        Number(newLimit);


    saveData();

    renderApp();
}


// ------------------------------------
// LOW STOCK CHECK
// ------------------------------------

function isLow(item) {

    return item.weight <= item.limit;

}


// ------------------------------------
// PANTRY PAGE
// ------------------------------------

function renderPantry() {

    const container =
        document.getElementById(
            "pantryItems"
        );


    container.innerHTML = "";


    if (pantryItems.length === 0) {

        container.innerHTML = `

            <div class="empty-message">

                <div class="emoji">
                    🥫
                </div>

                <h3>Your pantry is empty</h3>

                <p>
                    Add your first grocery item.
                </p>

            </div>
        `;

        return;
    }


    pantryItems.forEach(
        (item, index) => {

            const low =
                isLow(item);


            // Used for visual progress bar

            let percentage =
                item.limit > 0
                    ? (
                        item.weight /
                        (item.limit * 2)
                      ) * 100
                    : 100;


            percentage =
                Math.min(
                    Math.max(
                        percentage,
                        0
                    ),
                    100
                );


            container.innerHTML += `

                <div class="pantry-card">

                    <div class="item-top">

                        <div class="item-name">
                            ${item.name}
                        </div>

                        <div
                            class="
                                status
                                ${low ? "low" : "good"}
                            "
                        >

                            ${
                                low
                                    ? "LOW STOCK"
                                    : "ENOUGH"
                            }

                        </div>

                    </div>


                    <div class="weight">

                        ${Math.round(item.weight)}
                        <small>g</small>

                    </div>

                    <div class="weight-label">
                        Current measured weight
                    </div>


                    <div class="progress">

                        <div
                            class="
                                progress-bar
                                ${low ? "low" : ""}
                            "

                            style="
                                width:
                                ${percentage}%
                            "
                        ></div>

                    </div>


                    <p class="control-title">

                        ⚖️ Simulate weight sensor:
                        ${Math.round(item.weight)} g

                    </p>


                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"

                        value="${item.weight}"

                        oninput="
                            updateWeight(
                                ${index},
                                this.value
                            )
                        "
                    >


                    <p class="control-title">

                        🔔 Restock threshold:
                        ${Math.round(item.limit)} g

                    </p>


                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"

                        value="${item.limit}"

                        oninput="
                            updateLimit(
                                ${index},
                                this.value
                            )
                        "
                    >


                    <div class="item-actions">

                        <span class="limit-text">

                            Notify below
                            ${Math.round(item.limit)} g

                        </span>

                        <button
                            class="delete-button"

                            onclick="
                                deleteItem(${index})
                            "
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;

        }
    );
}


// ------------------------------------
// GROCERY LIST
// ------------------------------------

function renderGroceryList() {

    const container =
        document.getElementById(
            "groceryList"
        );


    const lowItems =
        pantryItems.filter(
            item => isLow(item)
        );


    container.innerHTML = "";


    if (lowItems.length === 0) {

        container.innerHTML = `

            <div class="empty-message">

                <div class="emoji">
                    ✅
                </div>

                <h3>
                    You're all stocked up!
                </h3>

                <p>
                    Nothing currently needs
                    restocking.
                </p>

            </div>

        `;

        return;
    }


    lowItems.forEach(item => {

        container.innerHTML += `

            <div class="grocery-item">

                <input
                    type="checkbox"
                >

                <div class="grocery-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>

                        ${Math.round(item.weight)} g
                        remaining

                        •

                        Restock below
                        ${Math.round(item.limit)} g

                    </p>

                </div>

                <span>
                    ⚠️
                </span>

            </div>

        `;

    });
}


// ------------------------------------
// DASHBOARD
// ------------------------------------

function renderDashboard() {

    const lowItems =
        pantryItems.filter(
            item => isLow(item)
        );


    document.getElementById(
        "totalItems"
    ).textContent =
        pantryItems.length;


    document.getElementById(
        "lowItems"
    ).textContent =
        lowItems.length;


    const container =
        document.getElementById(
            "dashboardLowStock"
        );


    container.innerHTML = "";


    if (lowItems.length === 0) {

        container.innerHTML = `

            <div class="empty-message">

                <div class="emoji">
                    🎉
                </div>

                <h3>
                    Everything looks good!
                </h3>

                <p>
                    No groceries need
                    restocking.
                </p>

            </div>

        `;

        return;
    }


    lowItems.forEach(item => {

        container.innerHTML += `

            <div class="grocery-item">

                <span>
                    ⚠️
                </span>

                <div class="grocery-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>

                        Only
                        ${Math.round(item.weight)} g
                        remaining

                    </p>

                </div>

                <span class="status low">
                    LOW
                </span>

            </div>

        `;

    });

}


// ------------------------------------
// RENDER EVERYTHING
// ------------------------------------

function renderApp() {

    renderDashboard();

    renderPantry();

    renderGroceryList();

}


// Start application

renderApp();
// =====================================
// PROFILE
// =====================================

let profile =
    JSON.parse(
        localStorage.getItem(
            "smartPantryProfile"
        )
    ) || {
        name: "Prashansa",
        email: ""
    };


function openProfile() {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    document
        .getElementById(
            "profilePage"
        )
        .classList.add(
            "active"
        );


    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(button => {

            button.classList.remove(
                "active"
            );

        });


    loadProfile();

}


function closeProfile() {

    document
        .getElementById(
            "profilePage"
        )
        .classList.remove(
            "active"
        );


    document
        .getElementById(
            "dashboardPage"
        )
        .classList.add(
            "active"
        );


    const homeButton =
        document.querySelector(
            ".nav-button"
        );


    if (homeButton) {
        homeButton.classList.add(
            "active"
        );
    }

}


function saveProfile() {

    const name =
        document
            .getElementById(
                "profileName"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "profileEmail"
            )
            .value
            .trim();


    if (name === "") {

        alert(
            "Please enter your name."
        );

        return;
    }


    profile.name = name;

    profile.email = email;


    localStorage.setItem(
        "smartPantryProfile",
        JSON.stringify(profile)
    );


    loadProfile();


    alert(
        "Profile saved!"
    );

}


function loadProfile() {

    const initial =
        profile.name
            ? profile.name
                .charAt(0)
                .toUpperCase()
            : "P";


    document.getElementById(
        "profileInitial"
    ).textContent =
        initial;


    document.getElementById(
        "largeProfileInitial"
    ).textContent =
        initial;


    document.getElementById(
        "displayName"
    ).textContent =
        profile.name;


    document.getElementById(
        "displayEmail"
    ).textContent =
        profile.email ||
        "Smart Pantry User";


    document.getElementById(
        "profileName"
    ).value =
        profile.name;


    document.getElementById(
        "profileEmail"
    ).value =
        profile.email;

}


// Load profile when app starts

loadProfile();