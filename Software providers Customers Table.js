document.addEventListener('DOMContentLoaded', function() {
    const expiryCells = document.querySelectorAll('td:nth-child(4)');
    
    expiryCells.forEach(cell => {
        const expiryDate = new Date(cell.innerText);
        const today = new Date();
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(today.getMonth() + 1);
  
        if (expiryDate < today) {
            cell.parentNode.querySelector('td:nth-child(6)').innerHTML = '🛑 Expired';
        } else if (expiryDate <= oneMonthFromNow) {
            cell.parentNode.querySelector('td:nth-child(6)').innerHTML = '🟡 Expiring Soon';
        } else {
            cell.parentNode.querySelector('td:nth-child(6)').innerHTML = "🟢 good";
        }
    });
  
    const remindButtons = document.querySelectorAll('.remind-btn');
    const sendPromoButtons = document.querySelectorAll('.send-promo-btn');
    const reminderCheckboxes = document.querySelectorAll('.reminder-checkbox');
    const promoCheckboxes = document.querySelectorAll('.promo-checkbox');
    const enableDisableButtons = document.querySelectorAll('.enable-disable');
  
    enableDisableButtons.forEach(button => {
        const accountStatusCell = button.parentNode.nextElementSibling.nextElementSibling;
        const expiryStatusCell = button.parentNode.previousElementSibling;
        const currentStatus = accountStatusCell.innerText.trim();
        const expiryStatus = expiryStatusCell.innerText.trim();
        button.classList.toggle('button-active');

        if (expiryStatus !== '🛑 Expired' && currentStatus !== 'Active') {
            button.innerText = 'Enable';
        } else if (expiryStatus !== '🛑 Expired') {
            button.innerText = 'Disable';
        } else {
            button.innerText = 'Expired';
        }
    });

    sendPromoButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const promoCheckbox = promoCheckboxes[index];
            promoCheckbox.checked = true;
        });
    });
  
    remindButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const reminderCheckbox = reminderCheckboxes[index];
            reminderCheckbox.checked = true;
        });
    });

    enableDisableButtons.forEach(button => {
        button.addEventListener('click', function() {
            const accountStatusCell = this.parentNode.nextElementSibling.nextElementSibling;
            const expiryStatusCell = this.parentNode.previousElementSibling;
            const currentStatus = accountStatusCell.innerText.trim();
            const expiryStatus = expiryStatusCell.innerText.trim();
            
            if (expiryStatus !== '🛑 Expired' && currentStatus !== 'Active') {
                accountStatusCell.innerText = 'Active';
                this.classList.toggle('button-active');
                this.innerText = 'Disable';
				this.style.backgroundColor = 'red';
            } 
			else if (expiryStatus !== '🛑 Expired') {
                accountStatusCell.innerText = 'Inactive';
                this.classList.toggle('button-active');
                this.innerText = 'Enable';
				this.style.backgroundColor = "blue";
            }
        });
    });
});
