// Task 1: Form Validation
const form = document.getElementById('reservationForm');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('inputName').value;
        const email = document.getElementById('inputEmail').value;
        const date = document.getElementById('inputDate').value;
        const password = document.getElementById('inputPassword').value;
        const passwordConfirm = document.getElementById('inputPasswordConfirm').value;
        
        let errors = [];
        
        if (name.length < 2) {
            errors.push('Name is too short');
        }
        
        if (!email.includes('@')) {
            errors.push('Invalid email');
        }
        
        if (!date) {
            errors.push('Please select a date');
        }
        
        if (password.length < 8) {
            errors.push('Password must be 8+ characters');
        }
        
        if (password !== passwordConfirm) {
            errors.push('Passwords do not match');
        }
        
        if (errors.length > 0) {
            alert('Errors:\n' + errors.join('\n'));
        } else {
            alert('Reservation successful!');
            form.reset();
        }
    });
}

// Task 2: Accordion
const accordionHeaders = document.querySelectorAll('.accordion-header-custom');

accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const item = this.parentElement;
        const content = item.querySelector('.accordion-content-custom');
        
        if (item.classList.contains('active')) {
            item.classList.remove('active');
            content.style.maxHeight = null;
        } else {
            document.querySelectorAll('.accordion-item-custom').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content-custom').style.maxHeight = null;
            });
            
            item.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
});

// Task 3: Popup Form
const subscribeBtn = document.getElementById('subscribeBtn');
const popupOverlay = document.getElementById('popupOverlay');
const closePopup = document.getElementById('closePopup');
const subscriptionForm = document.getElementById('subscriptionForm');

if (subscribeBtn) {
    subscribeBtn.addEventListener('click', function() {
        popupOverlay.style.display = 'flex';
        setTimeout(() => popupOverlay.classList.add('active'), 10);
    });
}

if (closePopup) {
    closePopup.addEventListener('click', function() {
        popupOverlay.classList.remove('active');
        setTimeout(() => popupOverlay.style.display = 'none', 300);
    });
}

if (popupOverlay) {
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            popupOverlay.classList.remove('active');
            setTimeout(() => popupOverlay.style.display = 'none', 300);
        }
    });
}

if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('popupEmail').value;
        
        if (email.includes('@')) {
            alert('Thank you for subscribing!');
            subscriptionForm.reset();
            popupOverlay.classList.remove('active');
            setTimeout(() => popupOverlay.style.display = 'none', 300);
        } else {
            alert('Please enter valid email');
        }
    });
}

// Task 4: Change Background Color
const bgBtn = document.getElementById('bgChangeBtn');
const colors = ['#242323', '#1a1a2e', '#16213e', '#0f3460', '#533483', '#2d4a2b', '#3d1f1f'];
let colorIndex = 0;

if (bgBtn) {
    bgBtn.addEventListener('click', function() {
        colorIndex = (colorIndex + 1) % colors.length;
        document.body.style.backgroundColor = colors[colorIndex];
    });
}

// Task 5: Date and Time
const dateTimeEl = document.getElementById('currentDateTime');

if (dateTimeEl) {
    function updateTime() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        dateTimeEl.textContent = now.toLocaleDateString('en-US', options);
    }
    
    updateTime();
    setInterval(updateTime, 1000);
}