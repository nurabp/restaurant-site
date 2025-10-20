
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
    
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameInput = document.getElementById('inputName');
        const emailInput = document.getElementById('inputEmail');
        const dateInput = document.getElementById('inputDate');
        const timeInput = document.getElementById('inputTime');
        const passwordInput = document.getElementById('inputPassword');
        const passwordConfirmInput = document.getElementById('inputPasswordConfirm');
        const guestsInput = document.getElementById('inputGuests');
        
        let errors = [];

        document.querySelectorAll('.form-control').forEach(input => input.classList.remove('is-invalid'));
        const existingFeedback = document.getElementById('formFeedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        if (nameInput.value.length < 2) {
            errors.push('Имя должно содержать не менее 2 символов.');
            nameInput.classList.add('is-invalid');
        }

        if (!emailInput.value.includes('@') || emailInput.value.length < 5) {
            errors.push('Пожалуйста, введите корректный email адрес.');
            emailInput.classList.add('is-invalid');
        }
        
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        if (!dateInput.value || selectedDate < today) {
            errors.push('Пожалуйста, выберите будущую дату.');
            dateInput.classList.add('is-invalid');
        }

        if (passwordInput.value.length < 8) {
            errors.push('Пароль должен быть не менее 8 символов.');
            passwordInput.classList.add('is-invalid');
        }
        
        if (passwordInput.value !== passwordConfirmInput.value) {
            errors.push('Пароли не совпадают.');
            passwordConfirmInput.classList.add('is-invalid');
        }

        const guests = parseInt(guestsInput.value);
        if (isNaN(guests) || guests < 1 || guests > 10) {
            errors.push('Количество гостей должно быть от 1 до 10.');
            guestsInput.classList.add('is-invalid');
        }

        const formContainer = reservationForm.parentElement;
        
        if (errors.length > 0) {
            const errorList = errors.map(err => `<li>${err}</li>`).join('');
            const errorHtml = document.createElement('div');
            errorHtml.id = 'formFeedback';
            errorHtml.className = 'alert alert-danger mt-4';
            errorHtml.innerHTML = `<h5 class="alert-heading text-dark">🚫 Ошибка бронирования:</h5><ul class="text-dark">${errorList}</ul>`;
            
            formContainer.insertBefore(errorHtml, reservationForm);
            
            new Audio('sounds/error.mp3').play().catch(() => console.log('Error sound failed. Please add sounds/error.mp3')); 
            
        } else {
            
            new Audio('sounds/success.mp3').play().catch(() => console.log('Success sound failed. Please add sounds/success.mp3'));

            const successHtml = `
                <div id="formFeedback" class="alert alert-success mt-4 p-5 text-center bg-success text-white">
                    <h3 class="alert-heading text-white">🎉 Бронирование успешно!</h3>
                    <p class="mb-0 text-white">Спасибо, <strong>${nameInput.value}</strong>! Ваш столик на ${guests} гостей забронирован на ${dateInput.value} в ${timeInput.value}.</p>
                </div>
            `;
            reservationForm.style.display = 'none'; 
            formContainer.innerHTML += successHtml;
        }
    });
}


document.querySelectorAll('.accordion-item-custom').forEach(item => {
    const header = item.querySelector('.accordion-header-custom');
    const content = item.querySelector('.accordion-content-custom');

    if (header) { 
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.accordion-item-custom').forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content-custom').style.maxHeight = null;
                }
            });

            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = null;
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    }
});


const subscribeBtn = document.getElementById('subscribeBtn');
const popupOverlay = document.getElementById('popupOverlay');
const closePopup = document.getElementById('closePopup');
const subscriptionForm = document.getElementById('subscriptionForm');

if (subscribeBtn && popupOverlay && closePopup && subscriptionForm) {
    const closeForm = () => {
        popupOverlay.classList.remove('active');
        setTimeout(() => {
            popupOverlay.style.display = 'none';
        }, 300);
    };

    subscribeBtn.addEventListener('click', () => {
        popupOverlay.style.display = 'flex';
        setTimeout(() => popupOverlay.classList.add('active'), 10);
    });

    closePopup.addEventListener('click', closeForm);

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            closeForm();
        }
    });

    subscriptionForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        const emailInput = document.getElementById('popupEmail');
        const userEmail = emailInput.value;
        const formContent = document.getElementById('popupForm');

        if (userEmail.includes('@') && userEmail.length > 5) {
            new Audio('sounds/success_2.mp3').play().catch(() => console.log('Popup success sound failed. Please add sounds/success_2.mp3'));
            formContent.innerHTML = `
                <h2 class="text-white text-center mb-4">🎉 Вы подписаны!</h2>
                <p class="text-white text-center mb-4">Спасибо, <strong>${userEmail}</strong>! Вы скоро получите наше первое эксклюзивное предложение.</p>
                <button id="closeSuccess" class="btn btn-warning btn-lg w-100">Закрыть</button>
            `;
            document.getElementById('closeSuccess').addEventListener('click', closeForm);
        } else {
            alert('Пожалуйста, введите корректный email адрес.');
            new Audio('sounds/error.mp3').play().catch(() => console.log('Error sound failed. Please add sounds/error.mp3'));
        }
    });
}


// =================================================================
// TASK 4: Background Color Changer (Dynamic Style Changes, Arrays, Switch, Sound)
// =================================================================
const bgChangeBtn = document.getElementById('bgChangeBtn');
const body = document.body;

const colors = [
    { code: '#242323', name: 'Original' },
    { code: '#34495e', name: 'Dark Blue' },
    { code: '#16a085', name: 'Dark Teal' },
    { code: '#7f8c8d', name: 'Gray' },
    { code: '#2c3e50', name: 'Midnight' },
];
let colorIndex = 0;

if (bgChangeBtn) {
    bgChangeBtn.addEventListener('click', () => {
        new Audio('sounds/click.mp3').play().catch(() => console.log('Click sound failed. Please add sounds/click.mp3')); 
        
        colorIndex = (colorIndex + 1) % colors.length;
        const { code: newColor } = colors[colorIndex];
        
        body.style.backgroundColor = newColor;

        let descriptiveName;
        switch(newColor) {
            case '#242323':
                descriptiveName = 'Original';
                break;
            case '#34495e':
                descriptiveName = 'Blue';
                break;
            case '#16a085':
                descriptiveName = 'Teal';
                break;
            case '#7f8c8d':
                descriptiveName = 'Gray';
                break;
            case '#2c3e50':
                descriptiveName = 'Midnight';
                break;
            default:
                descriptiveName = 'Default';
        }
        
        bgChangeBtn.textContent = `🎨 color: ${descriptiveName}`;
    });
}

const dateTimeElement = document.getElementById('currentDateTime');

if (dateTimeElement) {
    function updateDateTime() {
        const now = new Date();
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };

        const dateString = now.toLocaleDateString('en-US', dateOptions);
        const timeString = now.toLocaleTimeString('en-US', timeOptions); 

        dateTimeElement.innerHTML = `<span class="fw-bold text-warning">${dateString}</span> | <span class="fw-bold text-warning">${timeString}</span>`;
    }
   
    updateDateTime();
    
    setInterval(updateDateTime, 1000);
}