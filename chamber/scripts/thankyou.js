const currentUrl = window.location.href;

const urlInfo = currentUrl.split("?");

let formData = urlInfo[1].split("&");

function show(field) {
    let result = "";
    formData.forEach((element) => {
        if (element.startsWith(field)) {
            result = decodeURIComponent(element.split("=")[1]).replace(
                /\+/g,
                " "
            );
        }
    });
    return result;
}

const showInfo = document.querySelector("#application-details");
showInfo.innerHTML = `
    <p><strong>First Name:</strong> ${show("first-name")}</p>
    <p><strong>Last Name:</strong> ${show("last-name")}</p>
    <p><strong>Email:</strong> ${show("email")}</p>
    <p><strong>Mobile Phone:</strong> ${show("phone")}</p>
    <p><strong>Business/Organization Name:</strong> ${show("organization")}</p>
    <p><strong>Membership Level:</strong> ${show("membership")}</p>
    <p><strong>Application Date:</strong> ${new Date(
        show("timestamp")
    ).toLocaleString()}</p>
`;
