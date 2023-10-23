document.addEventListener("DOMContentLoaded", function () {
    const clients = [
        { id: 1, name: "Client 1", email: "client1@example.com" },
        { id: 2, name: "Client 2", email: "client2@example.com" },
        { id: 3, name: "Client 3", email: "client3@example.com" },
    ];

    const clientDetails = document.getElementById("client-details");
    const clientList = document.getElementById("client-list");

    clients.forEach((client) => {
        const li = document.createElement("li");
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        li.textContent = client.name;

        editButton.addEventListener("click", () => showEditForm(client));

        li.appendChild(editButton);

        li.addEventListener("click", () => showClientDetails(client));
        clientList.appendChild(li);
    });

    function showClientDetails(client) {
        clientDetails.innerHTML = `
            <h3>${client.name}</h3>
            <p>ID: ${client.id}</p>
            <p>Email: ${client.email}</p>
        `;
    }

    function showEditForm(client) {
        const editForm = generateEditForm(client);
        clientDetails.innerHTML = '';
        clientDetails.appendChild(editForm);
    }

    function generateEditForm(client) {
        const form = document.createElement("form");

        const nameLabel = document.createElement("label");
        nameLabel.textContent = "Name:";
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = client.name;

        const emailLabel = document.createElement("label");
        emailLabel.textContent = "Email:";
        const emailInput = document.createElement("input");
        emailInput.type = "text";
        emailInput.value = client.email;

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.addEventListener("click", () => saveChanges(client, nameInput.value, emailInput.value));

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel";
        cancelButton.addEventListener("click", () => showClientDetails(client));

        form.appendChild(nameLabel);
        form.appendChild(nameInput);
        form.appendChild(emailLabel);
        form.appendChild(emailInput);
        form.appendChild(saveButton);
        form.appendChild(cancelButton);

        return form;
    }

    function saveChanges(client, newName, newEmail) {
        // Update the client's data here
        client.name = newName;
        client.email = newEmail;
        showClientDetails(client);
    }
});
