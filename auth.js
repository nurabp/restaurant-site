// ====================================================================
// AUTHENTICATION SYSTEM WITH LOCAL STORAGE
// ====================================================================

let currentUser = null;

$(document).ready(function() {
    initAuth();
    checkAuthStatus();
    initFilterAndSearch();
});

function initAuth() {
    // Add auth buttons to navbar if not exist
    if ($('#authButtons').length === 0) {
        $('.navbar-nav').prepend(`
            <li class="nav-item" id="authButtons">
                <button class="btn btn-outline-warning btn-sm me-2" id="loginBtn">Log In</button>
                <button class="btn btn-warning btn-sm" id="signupBtn">Sign Up</button>
            </li>
            <li class="nav-item d-none" id="userProfile">
                <a class="nav-link" href="#" id="profileLink">
                    <span class="text-warning">👤 <span id="userName"></span></span>
                </a>
            </li>
        `);
    }

    // Add auth modal if not exist
    if ($('#authModal').length === 0) {
        $('body').append(`
            <div id="authModal" class="auth-modal">
                <div class="auth-modal-content">
                    <button class="auth-close">&times;</button>
                    
                    <!-- Login Form -->
                    <div id="loginForm" class="auth-form">
                        <h2 class="text-center mb-4">🔐 Log In</h2>
                        <form id="loginFormElement">
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="loginEmail" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control" id="loginPassword" required>
                            </div>
                            <button type="submit" class="btn btn-warning w-100 btn-lg">Log In</button>
                            <p class="text-center mt-3">
                                Don't have an account? 
                                <a href="#" id="showSignup" class="text-warning">Sign Up</a>
                            </p>
                        </form>
                    </div>

                    <!-- Signup Form -->
                    <div id="signupForm" class="auth-form d-none">
                        <h2 class="text-center mb-4">📝 Sign Up</h2>
                        <form id="signupFormElement">
                            <div class="mb-3">
                                <label class="form-label">Full Name</label>
                                <input type="text" class="form-control" id="signupName" required minlength="2">
                                <small class="form-text">At least 2 characters</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" id="signupEmail" required>
                                <small class="form-text">Valid email format required</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phone Number</label>
                                <input type="tel" class="form-control" id="signupPhone" required pattern="[0-9+\\-\\s()]{10,}">
                                <small class="form-text">Format: +1234567890 or (123) 456-7890</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Password</label>
                                <input type="password" class="form-control" id="signupPassword" required minlength="8">
                                <small class="form-text">Min 8 characters, include uppercase, lowercase, and number</small>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirm Password</label>
                                <input type="password" class="form-control" id="signupPasswordConfirm" required>
                            </div>
                            <button type="submit" class="btn btn-warning w-100 btn-lg">Sign Up</button>
                            <p class="text-center mt-3">
                                Already have an account? 
                                <a href="#" id="showLogin" class="text-warning">Log In</a>
                            </p>
                        </form>
                    </div>

                    <!-- Profile View -->
                    <div id="profileView" class="auth-form d-none">
                        <h2 class="text-center mb-4">👤 My Profile</h2>
                        <div class="profile-info">
                            <div class="profile-item">
                                <strong>Name:</strong>
                                <span id="profileName"></span>
                            </div>
                            <div class="profile-item">
                                <strong>Email:</strong>
                                <span id="profileEmail"></span>
                            </div>
                            <div class="profile-item">
                                <strong>Phone:</strong>
                                <span id="profilePhone"></span>
                            </div>
                            <div class="profile-item">
                                <strong>Member Since:</strong>
                                <span id="profileDate"></span>
                            </div>
                        </div>
                        <button id="logoutBtn" class="btn btn-danger w-100 btn-lg mt-4">Log Out</button>
                    </div>
                </div>
            </div>
        `);
    }

    // Add auth styles
    if ($('#authStyles').length === 0) {
        $('head').append(`
            <style id="authStyles">
                .auth-modal {
                    display: none;
                    position: fixed;
                    z-index: 10002;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.8);
                    animation: fadeIn 0.3s;
                }
                
                .auth-modal-content {
                    position: relative;
                    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
                    margin: 5% auto;
                    padding: 40px;
                    width: 90%;
                    max-width: 500px;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    animation: slideDown 0.3s;
                    color: #fff;
                }
                
                .auth-close {
                    position: absolute;
                    right: 20px;
                    top: 20px;
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                
                .auth-close:hover {
                    transform: scale(1.2);
                    color: #ffc107;
                }
                
                .auth-form h2 {
                    color: #ffc107;
                }
                
                .auth-form .form-label {
                    color: #fff;
                    font-weight: 500;
                }
                
                .auth-form .form-control {
                    background-color: #3d4550;
                    border: 2px solid #6c757d;
                    color: #fff;
                }
                
                .auth-form .form-control:focus {
                    background-color: #4a5261;
                    border-color: #ffc107;
                    color: #fff;
                }
                
                .auth-form .form-text {
                    color: #adb5bd;
                    font-size: 0.85rem;
                }
                
                .profile-info {
                    background-color: #2d2d2d;
                    padding: 20px;
                    border-radius: 10px;
                    border: 2px solid #ffc107;
                }
                
                .profile-item {
                    padding: 15px 0;
                    border-bottom: 1px solid #444;
                    display: flex;
                    justify-content: space-between;
                }
                
                .profile-item:last-child {
                    border-bottom: none;
                }
                
                .profile-item strong {
                    color: #ffc107;
                }
            </style>
        `);
    }

    // Event listeners
    $('#loginBtn').on('click', () => openAuthModal('login'));
    $('#signupBtn').on('click', () => openAuthModal('signup'));
    $('#profileLink').on('click', (e) => {
        e.preventDefault();
        openAuthModal('profile');
    });
    
    $('.auth-close').on('click', closeAuthModal);
    
    $('#authModal').on('click', function(e) {
        if (e.target === this) {
            closeAuthModal();
        }
    });

    $('#showSignup').on('click', (e) => {
        e.preventDefault();
        switchAuthForm('signup');
    });

    $('#showLogin').on('click', (e) => {
        e.preventDefault();
        switchAuthForm('login');
    });

    $('#loginFormElement').on('submit', handleLogin);
    $('#signupFormElement').on('submit', handleSignup);
    $('#logoutBtn').on('click', handleLogout);
}

function openAuthModal(type) {
    $('#authModal').fadeIn(300);
    $('body').css('overflow', 'hidden');
    switchAuthForm(type);
}

function closeAuthModal() {
    $('#authModal').fadeOut(300);
    $('body').css('overflow', 'auto');
}

function switchAuthForm(type) {
    $('#loginForm, #signupForm, #profileView').addClass('d-none');
    
    if (type === 'login') {
        $('#loginForm').removeClass('d-none');
    } else if (type === 'signup') {
        $('#signupForm').removeClass('d-none');
    } else if (type === 'profile') {
        $('#profileView').removeClass('d-none');
        displayProfile();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = $('#loginEmail').val().trim();
    const password = $('#loginPassword').val();
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI();
        closeAuthModal();
        showNotification('success', `✅ Welcome back, ${user.name}!`);
        $('#loginFormElement')[0].reset();
    } else {
        showNotification('error', '❌ Invalid email or password');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = $('#signupName').val().trim();
    const email = $('#signupEmail').val().trim();
    const phone = $('#signupPhone').val().trim();
    const password = $('#signupPassword').val();
    const passwordConfirm = $('#signupPasswordConfirm').val();
    
    // Validation
    let isValid = true;
    $('.form-control').removeClass('is-invalid');
    
    if (name.length < 2) {
        $('#signupName').addClass('is-invalid');
        isValid = false;
    }
    
    if (!isValidEmail(email)) {
        $('#signupEmail').addClass('is-invalid');
        showNotification('error', '❌ Invalid email format');
        isValid = false;
    }
    
    if (!isValidPhone(phone)) {
        $('#signupPhone').addClass('is-invalid');
        showNotification('error', '❌ Invalid phone number format');
        isValid = false;
    }
    
    if (!isValidPassword(password)) {
        $('#signupPassword').addClass('is-invalid');
        showNotification('error', '❌ Password must be 8+ chars with uppercase, lowercase, and number');
        isValid = false;
    }
    
    if (password !== passwordConfirm) {
        $('#signupPasswordConfirm').addClass('is-invalid');
        showNotification('error', '❌ Passwords do not match');
        isValid = false;
    }
    
    if (!isValid) return;
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        showNotification('error', '❌ Email already registered');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    updateAuthUI();
    closeAuthModal();
    showNotification('success', `🎉 Account created! Welcome, ${name}!`);
    $('#signupFormElement')[0].reset();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    closeAuthModal();
    showNotification('info', '👋 Logged out successfully');
}

function checkAuthStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
}

function updateAuthUI() {
    if (currentUser) {
        $('#authButtons').addClass('d-none');
        $('#userProfile').removeClass('d-none');
        $('#userName').text(currentUser.name);
    } else {
        $('#authButtons').removeClass('d-none');
        $('#userProfile').addClass('d-none');
    }
}

function displayProfile() {
    if (currentUser) {
        $('#profileName').text(currentUser.name);
        $('#profileEmail').text(currentUser.email);
        $('#profilePhone').text(currentUser.phone);
        $('#profileDate').text(new Date(currentUser.createdAt).toLocaleDateString());
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[0-9+\-\s()]{10,}$/;
    return re.test(phone);
}

function isValidPassword(password) {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
}

// ====================================================================
// RATING SYSTEM WITH LOCAL STORAGE
// ====================================================================

function initRatingSystem() {
    // Add rating to each card
    $('.card').each(function() {
        const $card = $(this);
        const itemName = $card.find('.card-title').text().trim();
        
        if ($card.find('.rating-container').length === 0 && itemName) {
            const savedRating = getRating(itemName);
            
            $card.find('.card-body').append(`
                <div class="rating-container mt-3">
                    <div class="stars" data-item="${itemName}">
                        ${[1,2,3,4,5].map(i => 
                            `<span class="star ${i <= savedRating ? 'active' : ''}" data-value="${i}">★</span>`
                        ).join('')}
                    </div>
                    <small class="rating-count">${savedRating > 0 ? savedRating + ' stars' : 'Not rated'}</small>
                </div>
            `);
        }
    });

    // Add rating styles
    if ($('#ratingStyles').length === 0) {
        $('head').append(`
            <style id="ratingStyles">
                .rating-container {
                    text-align: center;
                }
                
                .stars {
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                
                .star {
                    color: #444;
                    transition: color 0.2s;
                }
                
                .star:hover,
                .star.hover {
                    color: #ffc107;
                }
                
                .star.active {
                    color: #ffc107;
                }
                
                .rating-count {
                    display: block;
                    color: #adb5bd;
                    margin-top: 5px;
                }
            </style>
        `);
    }

    // Event listeners
    $(document).on('click', '.star', function() {
        const $star = $(this);
        const value = parseInt($star.data('value'));
        const itemName = $star.parent().data('item');
        
        saveRating(itemName, value);
        
        // Update UI
        $star.parent().find('.star').each(function(index) {
            if (index < value) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
        
        $star.parent().next('.rating-count').text(value + ' stars');
        showNotification('success', `⭐ Rated ${itemName}: ${value} stars`);
    });

    $(document).on('mouseenter', '.star', function() {
        const value = parseInt($(this).data('value'));
        $(this).parent().find('.star').each(function(index) {
            if (index < value) {
                $(this).addClass('hover');
            } else {
                $(this).removeClass('hover');
            }
        });
    });

    $(document).on('mouseleave', '.stars', function() {
        $(this).find('.star').removeClass('hover');
    });
}

function saveRating(itemName, rating) {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
    ratings[itemName] = rating;
    localStorage.setItem('ratings', JSON.stringify(ratings));
}

function getRating(itemName) {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
    return ratings[itemName] || 0;
}

// ====================================================================
// ADVANCED SEARCH AND FILTER WITH LOCAL STORAGE
// ====================================================================

function initFilterAndSearch() {
    // Add filter buttons
    if ($('#filterButtons').length === 0 && $('.card').length > 0) {
        $('.menu, .bestsellers').first().before(`
            <div class="container mb-4">
                <div class="filter-container">
                    <h4 class="text-warning mb-3">🔍 Filter & Search</h4>
                    <div class="btn-group mb-3" role="group">
                        <button class="btn btn-outline-warning filter-btn active" data-filter="all">All Items</button>
                        <button class="btn btn-outline-warning filter-btn" data-filter="appetizer">Appetizers</button>
                        <button class="btn btn-outline-warning filter-btn" data-filter="main">Main Course</button>
                        <button class="btn btn-outline-warning filter-btn" data-filter="dessert">Desserts</button>
                    </div>
                    <div class="mb-3">
                        <label class="form-label text-warning">Price Range: $<span id="priceValue">0-50</span></label>
                        <input type="range" class="form-range" id="priceFilter" min="0" max="50" value="50">
                    </div>
                    <button class="btn btn-info" id="saveFilters">💾 Save Filters</button>
                    <button class="btn btn-secondary" id="clearFilters">🔄 Clear Filters</button>
                    <div id="filterStatus" class="mt-2 text-warning"></div>
                </div>
            </div>
        `);
    }

    // Load saved filters
    loadSavedFilters();

    // Event listeners
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        applyFilters();
    });

    $('#priceFilter').on('input', function() {
        const value = $(this).val();
        $('#priceValue').text('0-' + value);
        applyFilters();
    });

    $('#saveFilters').on('click', saveCurrentFilters);
    $('#clearFilters').on('click', clearAllFilters);

    // Initialize rating system
    initRatingSystem();
}

function applyFilters() {
    const activeFilter = $('.filter-btn.active').data('filter');
    const maxPrice = parseInt($('#priceFilter').val());
    let visibleCount = 0;

    $('.card').each(function() {
        const $card = $(this);
        const title = $card.find('.card-title').text().toLowerCase();
        const priceText = $card.find('.price, .text-warning.fw-bold').first().text();
        const price = parseFloat(priceText.replace('$', '')) || 0;

        let show = true;

        // Category filter
        if (activeFilter !== 'all') {
            if (activeFilter === 'appetizer' && !title.includes('salad') && !title.includes('bruschetta') && !title.includes('cocktail')) {
                show = false;
            } else if (activeFilter === 'main' && !title.includes('steak') && !title.includes('pasta')) {
                show = false;
            } else if (activeFilter === 'dessert' && !title.includes('cake') && !title.includes('tiramisu')) {
                show = false;
            }
        }

        // Price filter
        if (price > maxPrice) {
            show = false;
        }

        if (show) {
            $card.parent().show();
            visibleCount++;
        } else {
            $card.parent().hide();
        }
    });

    $('#filterStatus').text(`Showing ${visibleCount} item(s)`);
}

function saveCurrentFilters() {
    const filters = {
        category: $('.filter-btn.active').data('filter'),
        maxPrice: $('#priceFilter').val(),
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('savedFilters', JSON.stringify(filters));
    showNotification('success', '💾 Filters saved successfully!');
}

function loadSavedFilters() {
    const saved = localStorage.getItem('savedFilters');
    if (saved) {
        const filters = JSON.parse(saved);
        
        $(`.filter-btn[data-filter="${filters.category}"]`).click();
        $('#priceFilter').val(filters.maxPrice).trigger('input');
        
    }
}

function clearAllFilters() {
    localStorage.removeItem('savedFilters');
    $('.filter-btn[data-filter="all"]').click();
    $('#priceFilter').val(50).trigger('input');
    $('#filterStatus').text('');
    showNotification('info', '🔄 Filters cleared');
}

// Initialize on page load
$(document).ready(function() {
    initRatingSystem();
    
    // Auto-save search results
    $('#menuSearchBar').on('keyup', function() {
        const searchTerm = $(this).val();
        if (searchTerm.length > 0) {
            const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
            if (!searches.includes(searchTerm)) {
                searches.unshift(searchTerm);
                if (searches.length > 10) searches.pop();
                localStorage.setItem('recentSearches', JSON.stringify(searches));
            }
        }
    });
});