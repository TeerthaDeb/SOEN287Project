document.addEventListener('DOMContentLoaded', function() {
    const editButtons = document.querySelectorAll('.edit-btn');
    const customerDetails = document.querySelector('.customer-details');

    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const customerId = this.previousElementSibling.getAttribute('data-id');
            const customerID = this.previousElementSibling.innerText;

            document.getElementById('customer-id').value = customerId;
            document.getElementById('id-id').value = customerID.slice(5 , customerID.length);

            customerDetails.classList.add('active');
        });
    });

    document.getElementById('customer-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const customerId = document.getElementById('customer-id').value;
        const newName = document.getElementById('name').value;
        const newEmail = document.getElementById('email').value;
        const newPhone = document.getElementById('phone').value;

        // Add code to update customer information here

        alert(`Customer ${customerId} updated with new information:\nName: ${newName}\nEmail: ${newEmail}\nPhone: ${newPhone}`);

        // Reset form fields
        this.reset();
        customerDetails.classList.remove('active');
    });
});
