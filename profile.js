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

loadProfile();