document.addEventListener('DOMContentLoaded', function() {
    const customers = [
        { name: 'John Doe', expiryDate: '2023-10-15' },
        // Add more customer data as needed
    ];

    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);

    const existingCustomers = customers.length;
    const expiringCustomers = customers.filter(customer => {
        const expiryDate = new Date(customer.expiryDate);
        return expiryDate > today && expiryDate <= oneMonthFromNow;
    }).length;

    const expiredCustomers = customers.filter(customer => {
        const expiryDate = new Date(customer.expiryDate);
        return expiryDate < today;
    }).length;

    document.getElementById('existing-customers').textContent = existingCustomers;
    document.getElementById('expiring-customers').textContent = expiringCustomers;
    document.getElementById('expired-customers').textContent = expiredCustomers;
});
