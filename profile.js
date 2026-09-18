// =====================================
// PROFILE PAGE
// =====================================

function loadProfile() {

    const profile =
        JSON.parse(
            localStorage.getItem("userProfile")
        ) || { name: "", email: "" };

    document.getElementById("profileName").value =
        profile.name;

    document.getElementById("profileEmail").value =
        profile.email;

    document.getElementById("profileInitial").textContent =
        profile.name
            ? profile.name.charAt(0).toUpperCase()
            : "P";

    document.getElementById("profileDisplayName").textContent =
        profile.name
            ? profile.name
            : "Your Name";

}

function saveProfile() {

    const name =
        document
            .getElementById("profileName")
            .value
            .trim();

    const email =
        document
            .getElementById("profileEmail")
            .value
            .trim();

    localStorage.setItem(
        "userProfile",
        JSON.stringify({ name, email })
    );

    alert("Profile saved.");

    loadProfile();

}


// =====================================
// SMART FRIDGE SETTINGS
// =====================================

function loadSettings() {

    const settings =
        JSON.parse(
            localStorage.getItem("fridgeSettings")
        ) || {
            lowStockAlerts: true,
            autoGroceryList: true
        };

    document.getElementById("lowStockToggle").checked =
        settings.lowStockAlerts;

    document.getElementById("autoGroceryToggle").checked =
        settings.autoGroceryList;

}

function saveSettings() {

    const settings = {

        lowStockAlerts:
            document.getElementById("lowStockToggle").checked,

        autoGroceryList:
            document.getElementById("autoGroceryToggle").checked

    };

    localStorage.setItem(
        "fridgeSettings",
        JSON.stringify(settings)
    );

}


loadProfile();
loadSettings();
