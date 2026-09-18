// =====================================
// SMART FRIDGE
// =====================================

// Reflect saved profile initial in the header, if one is set.
(function () {

    const profile =
        JSON.parse(
            localStorage.getItem("userProfile")
        );

    if (profile && profile.name) {

        const profileEl =
            document.getElementById("profileIcon");

        if (profileEl) {
            profileEl.textContent =
                profile.name.charAt(0).toUpperCase();
        }

    }

})();


let fridgeItems =
    JSON.parse(
        localStorage.getItem(
            "fridgeItems"
        )
    ) || [

        {
            name: "Milk",
            weight: 620,
            limit: 300
        },

        {
            name: "Eggs",
            weight: 480,
            limit: 200
        },

        {
            name: "Butter",
            weight: 160,
            limit: 80
        },

        {
            name: "Cheese",
            weight: 220,
            limit: 100
        }

    ];


// =====================================
// CAMERA + WEIGHT FUSION (SIMULATED)
// =====================================

// In the real system, a camera identifies WHICH item was
// touched, and the weight sensor reports HOW MUCH changed.
// We don't have real hardware yet, so this simulates that
// fusion: moving an item's own sensor slider stands in for
// "the camera confirmed this item, and the sensor reported
// this new weight."

let activityLog =
    JSON.parse(
        localStorage.getItem("activityLog")
    ) || [];

// Ignore tiny sensor jitter below this many grams so the
// feed doesn't fill up with noise from small slider nudges.
const DETECTION_THRESHOLD = 5;

function logActivity(message) {

    activityLog.unshift({
        message,
        time:
            new Date().toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
            )
    });

    // Keep only the most recent 10 events.
    activityLog = activityLog.slice(0, 10);

    localStorage.setItem(
        "activityLog",
        JSON.stringify(activityLog)
    );

}

function renderActivityFeed() {

    const container =
        document.getElementById("activityFeed");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (activityLog.length === 0) {

        container.innerHTML = `

            <div class="empty-message">

                <div class="emoji">
                    📷
                </div>

                <h3>
                    No detections yet
                </h3>

                <p>
                    Move a sensor slider on the
                    Fridge page to simulate a
                    camera + weight detection.
                </p>

            </div>

        `;

        return;
    }

    activityLog.forEach(entry => {

        container.innerHTML += `

            <div class="grocery-item">

                <div class="food-icon">
                    📷
                </div>

                <div class="grocery-info">

                    <h3>
                        ${entry.message}
                    </h3>

                    <p>
                        ${entry.time}
                    </p>

                </div>

            </div>

        `;

    });

}


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

    if (item.includes("butter"))
        return "🧈";

    if (item.includes("cheese"))
        return "🧀";

    if (item.includes("yogurt") || item.includes("yoghurt"))
        return "🥣";

    if (item.includes("juice"))
        return "🧃";

    if (item.includes("water"))
        return "💧";


    return "🥫";
}


// =====================================
// SAVE
// =====================================

function saveData() {

    localStorage.setItem(

        "fridgeItems",

        JSON.stringify(
            fridgeItems
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


    fridgeItems.push({

        name,
        weight,
        limit

    });


    logActivity(
        `📷 Camera detected new item added: ${name}`
    );


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
        fridgeItems[index];


    if (
        confirm(
            `Remove ${item.name} from your fridge?`
        )
    ) {

        logActivity(
            `📷 Camera detected item removed entirely: ${item.name}`
        );

        fridgeItems.splice(
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

// This slider simulates the fused camera + weight reading:
// the camera has already confirmed WHICH item this is (you
// selected its card), and the slider stands in for the
// sensor reporting a new total weight for it.

function updateWeight(
    index,
    newWeight
) {

    const item =
        fridgeItems[index];

    const oldWeight =
        item.weight;

    const updatedWeight =
        Number(newWeight);

    const delta =
        oldWeight - updatedWeight;


    item.weight =
        updatedWeight;


    if (Math.abs(delta) >= DETECTION_THRESHOLD) {

        if (delta > 0) {

            logActivity(
                `📷 Camera detected ${item.name} removed — ${Math.round(delta)}g used`
            );

        } else {

            logActivity(
                `📷 Camera detected ${item.name} added — ${Math.round(-delta)}g restocked`
            );

        }

    }


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

    fridgeItems[index].limit =
        Number(newLimit);


    saveData();

    renderApp();
}


// =====================================
// CALIBRATION
// =====================================

// Captures the current weight as the item's known "full"
// weight, the way the real flow works: place the item on
// the sensor, select it in the app, and lock in that
// reading as its calibrated max.

function calibrateItem(index) {

    const item =
        fridgeItems[index];


    item.maxWeight =
        item.weight;


    logActivity(
        `📷 Calibrated ${item.name} — full weight set to ${Math.round(item.weight)}g`
    );


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
// FRIDGE
// =====================================

function renderFridge() {

    const container =
        document.getElementById(
            "fridgeItems"
        );


    container.innerHTML = "";


    if (
        fridgeItems.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-message">

                <div class="emoji">
                    🧊
                </div>

                <h3>
                    Your fridge is empty
                </h3>

                <p>
                    Tap Add to add your
                    first grocery.
                </p>

            </div>

        `;

        return;
    }


    fridgeItems.forEach(
        (item, index) => {

            const low =
                isLow(item);


            const icon =
                getFoodIcon(
                    item.name
                );


            /*
             * If the item has been calibrated,
             * progress is relative to its real
             * captured full weight. Otherwise we
             * fall back to twice the threshold as
             * a rough estimate (at threshold = 50%).
             */

            const capacity =
                item.maxWeight && item.maxWeight > 0
                    ? item.maxWeight
                    : item.limit * 2;

            let percentage;

            if (capacity > 0) {

                percentage =
                    (
                        item.weight /
                        capacity
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

                <div class="fridge-card">

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

                        ${
                            item.maxWeight
                            ? `Calibrated full weight: ${Math.round(item.maxWeight)}g`
                            : "Not calibrated yet"
                        }

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


                        <button
                            class="delete-button"
                            style="margin-top: 10px;"

                            onclick="
                                calibrateItem(
                                    ${index}
                                )
                            "
                        >
                            📌 Capture as Full
                        </button>

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
        fridgeItems.filter(
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
        fridgeItems.filter(
            item =>
                isLow(item)
        );


    document.getElementById(
        "totalItems"
    ).textContent =
        fridgeItems.length;


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
                    Fridge looking good!
                </h3>

                <p>
                    Everything is currently
                    above its restock level.
                </p>

            </div>

        `;

    } else {

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


    renderActivityFeed();

}


// =====================================
// UPDATE APP
// =====================================

function renderApp() {

    renderDashboard();

    renderFridge();

    renderGroceryList();

}


renderApp();