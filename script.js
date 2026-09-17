// =====================================
// SMART PANTRY
// =====================================

let pantryItems =
    JSON.parse(
        localStorage.getItem(
            "pantryItems"
        )
    ) || [

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


// =====================================
// FOOD ICONS
// =====================================

function getFoodIcon(name) {

    const item =
        name.toLowerCase();


    if (item.includes("rice"))
        return "🍚";

    if (item.includes("coffee"))
        return "☕";

    if (item.includes("cereal"))
        return "🥣";

    if (item.includes("milk"))
        return "🥛";

    if (item.includes("bread"))
        return "🍞";

    if (item.includes("egg"))
        return "🥚";

    if (item.includes("apple"))
        return "🍎";

    if (item.includes("banana"))
        return "🍌";

    if (item.includes("pasta"))
        return "🍝";

    if (item.includes("flour"))
        return "🌾";

    if (item.includes("sugar"))
        return "🧂";

    if (item.includes("oil"))
        return "🫗";

    if (item.includes("potato"))
        return "🥔";

    if (item.includes("tomato"))
        return "🍅";

    if (item.includes("cookie"))
        return "🍪";


    return "🥫";
}


// =====================================
// SAVE
// =====================================

function saveData() {

    localStorage.setItem(

        "pantryItems",

        JSON.stringify(
            pantryItems
        )

    );

}


// =====================================
// NAVIGATION
// =====================================

function showPage(
    pageId,
    button
) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    document
        .getElementById(pageId)
        .classList.add(
            "active"
        );


    document
        .querySelectorAll(
            ".nav-button"
        )
        .forEach(nav => {

            nav.classList.remove(
                "active"
            );

        });


    button.classList.add(
        "active"
    );


    renderApp();
}


// =====================================
// MODAL
// =====================================

function openAddModal() {

    document
        .getElementById(
            "addModal"
        )
        .classList.add(
            "show"
        );

}


function closeAddModal() {

    document
        .getElementById(
            "addModal"
        )
        .classList.remove(
            "show"
        );

}


// =====================================
// ADD ITEM
// =====================================

function addItem() {

    const name =
        document
            .getElementById(
                "itemName"
            )
            .value
            .trim();


    const weight =
        Number(
            document
                .getElementById(
                    "itemWeight"
                )
                .value
        );


    const limit =
        Number(
            document
                .getElementById(
                    "itemLimit"
                )
                .value
        );


    if (
        name === "" ||
        !Number.isFinite(weight) ||
        !Number.isFinite(limit) ||
        weight < 0 ||
        limit < 0
    ) {

        alert(
            "Please enter valid item information."
        );

        return;
    }


    pantryItems.push({

        name,
        weight,
        limit

    });


    saveData();


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


// =====================================
// DELETE ITEM
// =====================================

function deleteItem(index) {

    const item =
        pantryItems[index];


    if (
        confirm(
            `Remove ${item.name} from your pantry?`
        )
    ) {

        pantryItems.splice(
            index,
            1
        );

        saveData();

        renderApp();

    }

}


// =====================================
// SENSOR WEIGHT
// =====================================

function updateWeight(
    index,
    newWeight
) {

    pantryItems[index].weight =
        Number(newWeight);


    saveData();

    renderApp();
}


// =====================================
// THRESHOLD
// =====================================

function updateLimit(
    index,
    newLimit
) {

    pantryItems[index].limit =
        Number(newLimit);


    saveData();

    renderApp();
}


// =====================================
// LOW STOCK
// =====================================

function isLow(item) {

    return (
        item.weight <=
        item.limit
    );

}


// =====================================
// PANTRY
// =====================================

function renderPantry() {

    const container =
        document.getElementById(
            "pantryItems"
        );


    container.innerHTML = "";


    if (
        pantryItems.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-message">

                <div class="emoji">
                    🥫
                </div>

                <h3>
                    Your pantry is empty
                </h3>

                <p>
                    Tap Add to add your
                    first grocery.
                </p>

            </div>

        `;

        return;
    }


    pantryItems.forEach(
        (item, index) => {

            const low =
                isLow(item);


            const icon =
                getFoodIcon(
                    item.name
                );


            /*
             * Progress is relative to
             * twice the user's threshold.
             *
             * At threshold = about 50%.
             */

            let percentage;

            if (item.limit > 0) {

                percentage =
                    (
                        item.weight /
                        (
                            item.limit *
                            2
                        )
                    ) * 100;

            } else {

                percentage = 100;

            }


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

                            <div class="food-icon">
                                ${icon}
                            </div>

                            ${item.name}

                        </div>


                        <span
                            class="
                                status
                                ${
                                    low
                                    ? "low"
                                    : "good"
                                }
                            "
                        >

                            ${
                                low
                                ? "LOW STOCK"
                                : "IN STOCK"
                            }

                        </span>

                    </div>


                    <div class="weight">

                        ${Math.round(
                            item.weight
                        )}

                        <small>
                            g
                        </small>

                    </div>


                    <div class="weight-label">
                        Current measured weight
                    </div>


                    <div class="progress">

                        <div
                            class="
                                progress-bar
                                ${
                                    low
                                    ? "low"
                                    : ""
                                }
                            "

                            style="
                                width:
                                ${percentage}%
                            "
                        ></div>

                    </div>


                    <div class="control-box">

                        <div class="control-title">

                            <span>
                                ⚖️ Sensor weight
                            </span>

                            <strong>
                                ${Math.round(
                                    item.weight
                                )} g
                            </strong>

                        </div>


                        <input
                            type="range"

                            min="0"
                            max="1000"
                            step="10"

                            value="
                                ${item.weight}
                            "

                            oninput="
                                updateWeight(
                                    ${index},
                                    this.value
                                )
                            "
                        >

                    </div>


                    <div class="control-box">

                        <div class="control-title">

                            <span>
                                🔔 Restock level
                            </span>

                            <strong>
                                ${Math.round(
                                    item.limit
                                )} g
                            </strong>

                        </div>


                        <input
                            type="range"

                            min="0"
                            max="1000"
                            step="10"

                            value="
                                ${item.limit}
                            "

                            oninput="
                                updateLimit(
                                    ${index},
                                    this.value
                                )
                            "
                        >

                    </div>


                    <div class="item-actions">

                        <span class="limit-text">

                            ${
                                low
                                ? "⚠️ Add this item to your grocery list"
                                : `You'll be alerted below ${Math.round(item.limit)} g`
                            }

                        </span>


                        <button
                            class="delete-button"

                            onclick="
                                deleteItem(
                                    ${index}
                                )
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


// =====================================
// GROCERY LIST
// =====================================

function renderGroceryList() {

    const container =
        document.getElementById(
            "groceryList"
        );


    const lowItems =
        pantryItems.filter(
            item =>
                isLow(item)
        );


    container.innerHTML = "";


    if (
        lowItems.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-message">

                <div class="emoji">
                    🛍️
                </div>

                <h3>
                    Grocery list is empty
                </h3>

                <p>
                    We'll automatically add
                    items when they're
                    running low.
                </p>

            </div>

        `;

        return;
    }


    lowItems.forEach(
        item => {

            const icon =
                getFoodIcon(
                    item.name
                );


            container.innerHTML += `

                <div class="grocery-item">

                    <input
                        type="checkbox"
                    >


                    <div class="food-icon">
                        ${icon}
                    </div>


                    <div class="grocery-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>

                            ${Math.round(
                                item.weight
                            )} g remaining

                            • Restock below

                            ${Math.round(
                                item.limit
                            )} g

                        </p>

                    </div>


                    <div
                        class="
                            grocery-warning
                        "
                    >
                        ⚠️
                    </div>

                </div>

            `;

        }
    );

}


// =====================================
// DASHBOARD
// =====================================

function renderDashboard() {

    const lowItems =
        pantryItems.filter(
            item =>
                isLow(item)
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


    if (
        lowItems.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-message">

                <div class="emoji">
                    ✨
                </div>

                <h3>
                    Pantry looking good!
                </h3>

                <p>
                    Everything is currently
                    above its restock level.
                </p>

            </div>

        `;

        return;
    }


    lowItems.forEach(
        item => {

            const icon =
                getFoodIcon(
                    item.name
                );


            container.innerHTML += `

                <div class="grocery-item">

                    <div class="food-icon">
                        ${icon}
                    </div>


                    <div class="grocery-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>

                            Only

                            ${Math.round(
                                item.weight
                            )} g

                            remaining

                        </p>

                    </div>


                    <span
                        class="status low"
                    >
                        LOW
                    </span>

                </div>

            `;

        }
    );

}


// =====================================
// UPDATE APP
// =====================================

function renderApp() {

    renderDashboard();

    renderPantry();

    renderGroceryList();

}


renderApp();
