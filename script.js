$(document).ready(function(){
    console.log("jQuery is ready!");
    
    initThemeMode();
    
    initSearch();
    initScrollProgress();
    initAnimatedCounter();
    initFormSubmit();
    initNotifications();
    initClipboard();
    initLazyLoading();
});

function initThemeMode() {
    if ($('#themeToggle').length === 0) {
        $('.feature-buttons').prepend(`
            <button id="themeToggle" class="feature-btn btn-warning mb-2">
                🌙 Night Mode
            </button>
        `);
    }
    
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        applyDarkMode();
    } else {
        applyLightMode();
    }
    
    $('#themeToggle').on('click', function() {
        var currentTheme = localStorage.getItem('theme') || 'light';
        
        if (currentTheme === 'light') {
            applyDarkMode();
            localStorage.setItem('theme', 'dark');
        } else {
            applyLightMode();
            localStorage.setItem('theme', 'light');
        }
    });
}

function applyDarkMode() {
    $('body').css({
        'background-color': '#1a1a1a',
        'color': '#f1f1f1'
    });
    
    $('.form-control').css({
        'background-color': '#3d4550',
        'color': '#ffffff',
        'border': '2px solid #6c757d'
    });
    
    $('.card').css({
        'background-color': '#2d2d2d',
        'color': '#f1f1f1'
    });
    
    $('.p-4.bg-secondary, .bg-secondary').css({
        'background-color': '#4a5261',
        'color': '#ffffff'
    });
    
    $('.bg-secondary h3, .bg-secondary p').css('color', '#ffffff');
    
    $('.bg-dark').css('background-color', '#2d2d2d');
    
    $('.text-light, h1, h2, h3, p').css('color', '#f1f1f1');

    $('.form-label').css('color', '#ffffff');
    
    $('.accordion-item-custom').css({
        'background-color': '#2d2d2d',
        'color': '#f1f1f1',
        'border-color': '#ffc107'
    });
    
    $('.accordion-header-custom h3').css('color', '#ffc107');
    $('.accordion-content-custom p').css('color', '#f1f1f1');
    $('.accordion-icon').css('color', '#ffc107');
    
    $('.stat-box').css({
        'background-color': '#2d2d2d',
        'color': '#f1f1f1'
    });
    
    $('#themeToggle').html('☀️ Day Mode');

    $('.navbar').css('background-color', '#1a1a1a');
    
    showNotification('info', '🌙 Dark mode activated');
}

function applyLightMode() {
    $('body').css({
        'background-color': '#f8f9fa',
        'color': '#212529'
    });
    
    $('.form-control').css({
        'background-color': '#6c757d',
        'color': '#ffffff',
        'border': '2px solid #495057'
    });
    
    $('.card').css({
        'background-color': '#ffffff',
        'color': '#212529'
    });
    
    $('.p-4.bg-secondary, .bg-secondary').css({
        'background-color': '#6c757d',
        'color': '#ffffff'
    });
    
    $('.bg-secondary h3, .bg-secondary p').css('color', '#ffffff');

    $('.bg-dark').css('background-color', '#343a40');

    $('.text-light, h1, h2, h3').css('color', '#212529');
    $('p').css('color', '#495057');
    
    $('.form-label').css('color', '#212529');
    
    $('.accordion-item-custom').css({
        'background-color': '#ffffff',
        'color': '#212529'
    });
    
    $('.accordion-header-custom h3').css('color', '#212529');
    $('.accordion-content-custom p').css('color', '#495057');
    
    $('.stat-box').css({
        'background-color': '#ffffff',
        'color': '#212529',
        'border': '2px solid #ffc107'
    });

    $('#themeToggle').html('🌙 Night Mode');
    
    $('.navbar').css('background-color', '#343a40');
    
    showNotification('info', '☀️ Light mode activated');
}

function initSearch() {
    if ($('.menu').length > 0 && $('#menuSearchBar').length === 0) {
        $('.menu').first().before(`
            <div class="container mb-4">
                <div class="search-container">
                    <input type="text" id="menuSearchBar" class="form-control form-control-lg" 
                           placeholder="🔍 Search menu items...">
                    <ul id="autocompleteSuggestions"></ul>
                    <div id="searchResults" class="mt-2 text-warning"></div>
                </div>
            </div>
        `);
    }

    $('#menuSearchBar').on('keyup', function() {
        var searchTerm = $(this).val().toLowerCase();
        var count = 0;

        $('.card').each(function() {
            var text = $(this).text().toLowerCase();
            if (text.indexOf(searchTerm) > -1) {
                $(this).show();
                count++;
            } else {
                $(this).hide();
            }
        });

        if (searchTerm.length > 0) {
            $('#searchResults').text('Found ' + count + ' items');
        } else {
            $('#searchResults').text('');
        }
        
        highlightSearch(searchTerm);
    });
    
    var menuItems = [
        'Caesar Salad', 'Bruschetta', 'Shrimp Cocktail',
        'Grilled Steak', 'Pasta Carbonara', 'Cheesecake', 'Tiramisu'
    ];
    
    $('#menuSearchBar').on('input', function() {
        var input = $(this).val().toLowerCase();
        $('#autocompleteSuggestions').empty().hide();
        
        if (input.length > 0) {
            for (var i = 0; i < menuItems.length; i++) {
                if (menuItems[i].toLowerCase().indexOf(input) > -1) {
                    var li = $('<li>').text(menuItems[i]);
                    li.on('click', function() {
                        $('#menuSearchBar').val($(this).text()).trigger('keyup');
                        $('#autocompleteSuggestions').hide();
                    });
                    $('#autocompleteSuggestions').append(li);
                }
            }
            if ($('#autocompleteSuggestions').children().length > 0) {
                $('#autocompleteSuggestions').show();
            }
        }
    });
    
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-container').length) {
            $('#autocompleteSuggestions').hide();
        }
    });
}

function highlightSearch(searchTerm) {
    $('.card-title, .card-text').each(function() {
        var element = $(this);
        var text = element.text();
        element.html(text);
    });
    
    if (searchTerm.length < 2) return;
   
    $('.card-title, .card-text').each(function() {
        var element = $(this);
        var text = element.html();
        var newText = text.replace(new RegExp(searchTerm, 'gi'), function(match) {
            return '<span class="highlight">' + match + '</span>';
        });
        element.html(newText);
    });
}

function initScrollProgress() {
    if ($('#scrollProgress').length === 0) {
        $('body').prepend('<div id="scrollProgress"></div>');
    }
    
    $(window).on('scroll', function() {
        var scrollTop = $(window).scrollTop();
        var docHeight = $(document).height() - $(window).height();
        var scrollPercent = (scrollTop / docHeight) * 100;
        
        $('#scrollProgress').css('width', scrollPercent + '%');
    });
}

function initAnimatedCounter() {
    if ($('#currentDateTime').length > 0 && $('#statsSection').length === 0) {
        $('#currentDateTime').parent().after(`
            <section id="statsSection" class="container my-5">
                <h2 class="text-center mb-4 text-light">Our Stats</h2>
                <div class="row text-center">
                    <div class="col-md-4 mb-3">
                        <div class="stat-box p-4 bg-dark rounded">
                            <h3 class="text-warning counter" data-target="1500">0</h3>
                            <p class="text-light">Happy Customers</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="stat-box p-4 bg-dark rounded">
                            <h3 class="text-warning counter" data-target="250">0</h3>
                            <p class="text-light">Menu Items</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <div class="stat-box p-4 bg-dark rounded">
                            <h3 class="text-warning counter" data-target="15">0</h3>
                            <p class="text-light">Years Experience</p>
                        </div>
                    </div>
                </div>
            </section>
        `);
    }
    
    var animated = false;
    $(window).on('scroll', function() {
        if ($('#statsSection').length > 0 && !animated) {
            var statsPosition = $('#statsSection').offset().top;
            var scrollPosition = $(window).scrollTop() + $(window).height();
            
            if (scrollPosition > statsPosition) {
                animated = true;
                
                $('.counter').each(function() {
                    var $this = $(this);
                    var target = parseInt($this.attr('data-target'));
                    
                    $({ num: 0 }).animate({ num: target }, {
                        duration: 2000,
                        step: function() {
                            $this.text(Math.floor(this.num));
                        },
                        complete: function() {
                            $this.text(target + '+');
                        }
                    });
                });
            }
        }
    });
}

function initFormSubmit() {
    $('#reservationForm').on('submit', function(e) {
        e.preventDefault();
        
        var $button = $(this).find('button[type="submit"]');
        var oldText = $button.html();

        $button.prop('disabled', true);
        $button.html('<span class="spinner-border spinner-border-sm me-2"></span>Please wait...');
        
        var name = $('#inputName').val();
        var email = $('#inputEmail').val();
        var password = $('#inputPassword').val();
        var passwordConfirm = $('#inputPasswordConfirm').val();
        var date = $('#inputDate').val();
        var time = $('#inputTime').val();
        var guests = $('#inputGuests').val();
        
        var isValid = true;
        $('.form-control').removeClass('is-invalid');
        
        if (name.length < 2) {
            $('#inputName').addClass('is-invalid');
            isValid = false;
        }
        if (email.indexOf('@') === -1 || email.length < 5) {
            $('#inputEmail').addClass('is-invalid');
            isValid = false;
        }
        if (!date) {
            $('#inputDate').addClass('is-invalid');
            isValid = false;
        }
        if (!time) {
            $('#inputTime').addClass('is-invalid');
            isValid = false;
        }
        if (guests < 1 || guests > 10) {
            $('#inputGuests').addClass('is-invalid');
            isValid = false;
        }
        if (password.length < 8) {
            $('#inputPassword').addClass('is-invalid');
            isValid = false;
        }
        if (password !== passwordConfirm) {
            $('#inputPasswordConfirm').addClass('is-invalid');
            isValid = false;
        }
        
        setTimeout(function() {
            if (isValid) {
                showNotification('success', '✅ Reservation confirmed for ' + name + '!');
                $('#reservationForm')[0].reset();
            } else {
                showNotification('error', '❌ Please fix all errors in the form');
            }
            
            $button.prop('disabled', false);
            $button.html(oldText);
        }, 2000);
    });
}

function initNotifications() {
    if ($('#notificationContainer').length === 0) {
        $('body').append('<div id="notificationContainer"></div>');
    }
    
    $('.btn-primary').on('click', function(e) {
        var buttonText = $(this).text();
        if (buttonText.indexOf('Order Now') > -1) {
            e.preventDefault();
            var itemName = $(this).closest('.card').find('.card-title').text();
            showNotification('success', '🛒 ' + itemName + ' added to cart!');
        }
    });
}

function showNotification(type, message) {
    var icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'info') icon = 'ℹ️';
    if (type === 'warning') icon = '⚠️';
    
    var notification = $('<div class="notification notification-' + type + '"></div>');
    notification.append('<span class="notification-icon">' + icon + '</span>');
    notification.append('<span class="notification-message">' + message + '</span>');
    
    $('#notificationContainer').append(notification);
    
    setTimeout(function() {
        notification.addClass('show');
    }, 10);
    
    setTimeout(function() {
        notification.removeClass('show');
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
}

function initClipboard() {
    $('.accordion-content-custom p').each(function() {
        if ($(this).find('.copy-btn').length === 0) {
            $(this).append('<button class="copy-btn">📋 Copy</button>');
        }
    });
   
    $(document).on('click', '.copy-btn', function(e) {
        e.stopPropagation();
        var button = $(this);
        var text = button.parent().text().replace('📋 Copy', '').trim();
        
        navigator.clipboard.writeText(text).then(function() {
            button.html('✓ Copied!').addClass('copied');
            showNotification('success', '📋 Copied to clipboard!');
            
            setTimeout(function() {
                button.html('📋 Copy').removeClass('copied');
            }, 2000);
        });
    });
}

function initLazyLoading() {
    $('img').each(function() {
        var img = $(this);
        if (img.attr('data-src')) return;
        
        var src = img.attr('src');
        if (src && src.indexOf('data:') !== 0) {
            img.attr('data-src', src);
            img.attr('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect fill="%23333" width="800" height="600"/%3E%3Ctext fill="%23ffc107" x="50%25" y="50%25" text-anchor="middle"%3ELoading...%3C/text%3E%3C/svg%3E');
            img.addClass('lazy-image');
        }
    });

    function loadImages() {
        $('.lazy-image[data-src]').each(function() {
            var img = $(this);
            var imgTop = img.offset().top;
            var scrollTop = $(window).scrollTop();
            var windowHeight = $(window).height();
            
            if (scrollTop + windowHeight + 200 > imgTop) {
                var src = img.attr('data-src');
                img.attr('src', src);
                img.removeAttr('data-src');
                img.removeClass('lazy-image');
                img.addClass('loaded');
            }
        });
    }
    
    $(window).on('scroll', loadImages);
    loadImages();
}

$('.accordion-item-custom').each(function() {
    var item = $(this);
    var header = item.find('.accordion-header-custom');
    var content = item.find('.accordion-content-custom');

    header.on('click', function() {
        var isOpen = item.hasClass('active');

        $('.accordion-item-custom.active').each(function() {
            $(this).removeClass('active');
            $(this).find('.accordion-content-custom').slideUp(300);
        });

        if (!isOpen) {
            item.addClass('active');
            content.slideDown(300);
        }
    });
});

$('#subscribeBtn').on('click', function() {
    $('#popupOverlay').fadeIn(300).addClass('active');
});

$('#closePopup, #popupOverlay').on('click', function(e) {
    if (e.target === this) {
        $('#popupOverlay').fadeOut(300).removeClass('active');
    }
});

$('#subscriptionForm').on('submit', function(e) {
    e.preventDefault();
    var email = $('#popupEmail').val();
    
    if (email.indexOf('@') > -1 && email.length > 5) {
        showNotification('success', '🎉 Subscribed: ' + email);
        $('#popupOverlay').fadeOut(300);
        $(this)[0].reset();
    } else {
        showNotification('error', '❌ Invalid email');
    }
});

var colors = [
    { code: '#242323', name: 'Original' },
    { code: '#34495e', name: 'Dark Blue' },
    { code: '#16a085', name: 'Dark Teal' },
    { code: '#7f8c8d', name: 'Gray' },
    { code: '#2c3e50', name: 'Midnight' }
];
var colorIndex = 0;

$('#bgChangeBtn').on('click', function() {
    colorIndex = (colorIndex + 1) % colors.length;
    $('body').css('background-color', colors[colorIndex].code);
    $(this).text('🎨 Color: ' + colors[colorIndex].name);
    showNotification('info', '🎨 Background changed to ' + colors[colorIndex].name);
});

function updateDateTime() {
    var now = new Date();
    var dateStr = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    var timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });

    $('#currentDateTime').html(
        '<span class="fw-bold text-warning">' + dateStr + '</span> | ' +
        '<span class="fw-bold text-warning">' + timeStr + '</span>'
    );
}

if ($('#currentDateTime').length > 0) {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

let cart = [];

$(document).ready(function(){
    initCart();
    updateCartDisplay();
    
    addOrderButtonsToMenu();
});

function initCart() {
    if ($('#cartIcon').length === 0) {
        $('.navbar-nav').append(`
            <li class="nav-item ms-3">
                <a class="nav-link position-relative" href="#" id="cartIcon">
                    🛒 Cart
                    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" id="cartCount">
                        0
                    </span>
                </a>
            </li>
        `);
    }
    
    if ($('#cartModal').length === 0) {
        $('body').append(`
            <div id="cartModal" class="cart-modal">
                <div class="cart-modal-content">
                    <div class="cart-header">
                        <h2>🛒 Your Cart</h2>
                        <button class="cart-close">&times;</button>
                    </div>
                    <div class="cart-body">
                        <div id="cartItems"></div>
                        <div class="cart-empty" style="display: none;">
                            <p>Your cart is empty</p>
                            <button class="btn btn-primary" onclick="closeCart()">Continue Shopping</button>
                        </div>
                    </div>
                    <div class="cart-footer">
                        <div class="cart-total">
                            <strong>Total:</strong>
                            <span id="cartTotal">$0</span>
                        </div>
                        <button class="btn btn-danger btn-lg w-100 mt-3" id="checkoutBtn">
                            Proceed to Checkout
                        </button>
                        <button class="btn btn-outline-warning w-100 mt-2" onclick="clearCart()">
                            Clear Cart
                        </button>
                    </div>
                </div>
            </div>
        `);
    }

    if ($('#cartStyles').length === 0) {
        $('head').append(`
            <style id="cartStyles">
                .cart-modal {
                    display: none;
                    position: fixed;
                    z-index: 10001;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.7);
                    animation: fadeIn 0.3s;
                }
                
                .cart-modal-content {
                    position: relative;
                    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
                    margin: 2% auto;
                    padding: 0;
                    width: 90%;
                    max-width: 600px;
                    max-height: 90vh;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    display: flex;
                    flex-direction: column;
                    animation: slideDown 0.3s;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideDown {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .cart-header {
                    padding: 20px 30px;
                    border-bottom: 2px solid #ffc107;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .cart-header h2 {
                    color: #ffc107;
                    margin: 0;
                    font-size: 1.8rem;
                }
                
                .cart-close {
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                
                .cart-close:hover {
                    transform: scale(1.2);
                    color: #ffc107;
                }
                
                .cart-body {
                    padding: 20px 30px;
                    overflow-y: auto;
                    flex: 1;
                    max-height: 50vh;
                }
                
                .cart-item {
                    background-color: #3d3d3d;
                    padding: 15px;
                    margin-bottom: 15px;
                    border-radius: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 2px solid transparent;
                    transition: all 0.3s;
                }
                
                .cart-item:hover {
                    border-color: #ffc107;
                    transform: translateX(5px);
                }
                
                .cart-item-info {
                    flex: 1;
                }
                
                .cart-item-name {
                    color: #ffc107;
                    font-weight: bold;
                    font-size: 1.1rem;
                    margin-bottom: 5px;
                }
                
                .cart-item-price {
                    color: #fff;
                    font-size: 1rem;
                }
                
                .cart-item-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .quantity-control {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background-color: #2d2d2d;
                    padding: 5px 10px;
                    border-radius: 20px;
                }
                
                .quantity-btn {
                    background: #ffc107;
                    border: none;
                    color: #000;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.2s;
                }
                
                .quantity-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 0 10px #ffc107;
                }
                
                .quantity-display {
                    color: #fff;
                    font-weight: bold;
                    min-width: 30px;
                    text-align: center;
                }
                
                .remove-btn {
                    background: #dc3545;
                    border: none;
                    color: #fff;
                    padding: 8px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .remove-btn:hover {
                    background: #c82333;
                    transform: scale(1.05);
                }
                
                .cart-footer {
                    padding: 20px 30px;
                    border-top: 2px solid #ffc107;
                    background-color: #2d2d2d;
                    border-radius: 0 0 15px 15px;
                }
                
                .cart-total {
                    display: flex;
                    justify-content: space-between;
                    font-size: 1.5rem;
                    color: #fff;
                    margin-bottom: 10px;
                }
                
                .cart-total span {
                    color: #ffc107;
                    font-weight: bold;
                }
                
                .cart-empty {
                    text-align: center;
                    padding: 40px 20px;
                    color: #adb5bd;
                }
                
                .cart-empty p {
                    font-size: 1.2rem;
                    margin-bottom: 20px;
                }
                
                #cartCount {
                    font-size: 0.7rem;
                    padding: 2px 6px;
                }
                
                /* Animation for adding items */
                @keyframes itemAdded {
                    0% { transform: scale(0.8); opacity: 0; }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                
                .item-added-animation {
                    animation: itemAdded 0.4s ease-out;
                }
            </style>
        `);
    }
    
    $('#cartIcon').on('click', function(e) {
        e.preventDefault();
        openCart();
    });
    
    $('.cart-close').on('click', closeCart);
    
    $('#cartModal').on('click', function(e) {
        if (e.target === this) {
            closeCart();
        }
    });
    
    $('#checkoutBtn').on('click', handleCheckout);
}

function addOrderButtonsToMenu() {
    $('.card').each(function() {
        const $card = $(this);
        const $footer = $card.find('.card-footer');
    
        if ($card.find('.order-now-btn').length > 0 || $footer.length === 0) {
            return;
        }
        
        const itemName = $card.find('.card-title').text().trim();
        const itemPrice = $footer.find('.price').text().trim();
        
        if (itemName && itemPrice) {
            $footer.append(`
                <button class="btn btn-primary w-100 mt-2 order-now-btn">
                    Order Now
                </button>
            `);
        }
    });
    
    $(document).off('click', '.order-now-btn, .btn-primary:contains("Order Now")');
    $(document).on('click', '.order-now-btn, .btn-primary:contains("Order Now")', function(e) {
        e.preventDefault();
        
        const $card = $(this).closest('.card');
        const itemName = $card.find('.card-title').text().trim();
        const itemPriceText = $card.find('.price, .text-warning.fw-bold').first().text().trim();
        const itemPrice = parseFloat(itemPriceText.replace('$', ''));
        const itemImage = $card.find('img').attr('src') || '';
        
        if (itemName && !isNaN(itemPrice)) {
            addToCart({
                name: itemName,
                price: itemPrice,
                image: itemImage
            });
        }
    });
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...item,
            quantity: 1,
            id: Date.now()
        });
    }
    
    updateCartDisplay();
    showNotification('success', `🛒 ${item.name} added to cart!`);

    $('#cartIcon').addClass('item-added-animation');
    setTimeout(() => {
        $('#cartIcon').removeClass('item-added-animation');
    }, 400);
}

function removeFromCart(itemId) {
    const item = cart.find(item => item.id === itemId);
    cart = cart.filter(item => item.id !== itemId);
    
    updateCartDisplay();
    if (item) {
        showNotification('info', `${item.name} removed from cart`);
    }
}

function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    $('#cartCount').text(totalItems);
    
    if (totalItems > 0) {
        $('#cartCount').show();
    } else {
        $('#cartCount').hide();
    }
    
    const $cartItems = $('#cartItems');
    const $cartEmpty = $('.cart-empty');
    
    if (cart.length === 0) {
        $cartItems.hide();
        $cartEmpty.show();
        $('#cartTotal').text('$0');
        return;
    }
    
    $cartItems.show();
    $cartEmpty.hide();
    
    $cartItems.empty();
    
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        
        $cartItems.append(`
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity} = $${itemTotal}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
                </div>
            </div>
        `);
    });
    
    $('#cartTotal').text('$' + totalPrice.toFixed(2));
}

function openCart() {
    $('#cartModal').fadeIn(300);
    $('body').css('overflow', 'hidden');
}

function closeCart() {
    $('#cartModal').fadeOut(300);
    $('body').css('overflow', 'auto');
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCartDisplay();
        showNotification('info', 'Cart cleared');
    }
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('warning', '⚠️ Your cart is empty!');
        return;
    }
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    showNotification('success', `🎉 Order placed! Total: $${totalPrice.toFixed(2)} (${itemCount} items)`);

    console.log('Order Details:', {
        items: cart,
        total: totalPrice,
        timestamp: new Date()
    });
    
    cart = [];
    updateCartDisplay();
    closeCart();
    
    setTimeout(() => {
        showNotification('info', '✉️ Confirmation email sent!');
    }, 1500);
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.openCart = openCart;
window.closeCart = closeCart;
// ====================================================================
// НОВЫЙ БЛОК: Инициализация и Управление Звуками
// ====================================================================

// Создаем глобальные аудио-объекты
const clickSound = new Audio('sounds/click.mp3'); 
const successSound = new Audio('sounds/success.mp3'); 
const errorSound = new Audio('sounds/error.mp3');

function playSound(audioElement) {
    audioElement.currentTime = 0; // Сбрасываем звук, чтобы он мог быть воспроизведен снова, даже если он еще играет
    audioElement.play().catch(e => console.error("Could not play sound:", e));
}

// ====================================================================
// Инициализация звуков в document.ready
// ====================================================================
$(document).ready(function(){
    console.log("jQuery is ready!");
    
    // Новая функция для предзагрузки звуков (опционально)
    initSounds(); 

    initThemeMode();
    
    initSearch();
    initScrollProgress();
    initAnimatedCounter();
    initFormSubmit();
    initNotifications();
    initClipboard();
    initLazyLoading();

    initCart();
    updateCartDisplay();
    addOrderButtonsToMenu();
});

// ====================================================================
// MOBILE & TABLET JAVASCRIPT FIXES
// ====================================================================

$(document).ready(function() {
    initMobileFixes();
});

function initMobileFixes() {
    
    // 1. DETECT MOBILE DEVICE
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent);
    
    if (isMobile || isTablet) {
        $('body').addClass('is-mobile-device');
    }
    
    // 2. FIX VIEWPORT FOR iOS
    fixIOSViewport();
    
    // 3. PREVENT BODY SCROLL WHEN MODAL OPEN
    fixModalScroll();
    
    // 4. FIX NAVBAR COLLAPSE ON MOBILE
    fixNavbarMobile();
    
    // 5. TOUCH-FRIENDLY STAR RATING
    fixStarRatingTouch();
    
    // 6. PREVENT DOUBLE-TAP ZOOM ON BUTTONS
    preventDoubleTapZoom();
    
    // 7. FIX AUTOCOMPLETE POSITION ON MOBILE
    fixAutocompletePosition();
    
    // 8. ADD SWIPE GESTURES FOR MODALS
    addSwipeToClose();
    
    // 9. FIX CART MODAL ON MOBILE
    fixCartModalMobile();
    
    // 10. OPTIMIZE IMAGES FOR MOBILE
    optimizeImagesForMobile();
}

// ====================================================================
// 1. FIX iOS VIEWPORT ISSUES
// ====================================================================
function fixIOSViewport() {
    // Prevent zoom on input focus (iOS)
    $('input, textarea, select').on('focus', function() {
        $('meta[name=viewport]').attr('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
        );
    });
    
    $('input, textarea, select').on('blur', function() {
        $('meta[name=viewport]').attr('content', 
            'width=device-width, initial-scale=1.0'
        );
    });
    
    // Fix iOS Safari bottom bar issue
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    $(window).on('resize', setVH);
    $(window).on('orientationchange', setVH);
}

// ====================================================================
// 2. FIX MODAL SCROLL ISSUES
// ====================================================================
function fixModalScroll() {
    let scrollPosition = 0;
    
    // Override original modal open function
    const originalOpenAuthModal = window.openAuthModal;
    window.openAuthModal = function(type) {
        scrollPosition = $(window).scrollTop();
        $('body').css({
            'overflow': 'hidden',
            'position': 'fixed',
            'top': `-${scrollPosition}px`,
            'width': '100%'
        });
        if (typeof originalOpenAuthModal === 'function') {
            originalOpenAuthModal(type);
        } else {
            $('#authModal').fadeIn(300);
            switchAuthForm(type);
        }
    };
    
    // Override original modal close function
    const originalCloseAuthModal = window.closeAuthModal;
    window.closeAuthModal = function() {
        $('body').css({
            'overflow': '',
            'position': '',
            'top': '',
            'width': ''
        });
        $(window).scrollTop(scrollPosition);
        if (typeof originalCloseAuthModal === 'function') {
            originalCloseAuthModal();
        } else {
            $('#authModal').fadeOut(300);
        }
    };
    
    // Same for cart modal
    const originalOpenCart = window.openCart;
    window.openCart = function() {
        scrollPosition = $(window).scrollTop();
        $('body').css({
            'overflow': 'hidden',
            'position': 'fixed',
            'top': `-${scrollPosition}px`,
            'width': '100%'
        });
        if (typeof originalOpenCart === 'function') {
            originalOpenCart();
        } else {
            $('#cartModal').fadeIn(300);
        }
    };
    
    const originalCloseCart = window.closeCart;
    window.closeCart = function() {
        $('body').css({
            'overflow': '',
            'position': '',
            'top': '',
            'width': ''
        });
        $(window).scrollTop(scrollPosition);
        if (typeof originalCloseCart === 'function') {
            originalCloseCart();
        } else {
            $('#cartModal').fadeOut(300);
        }
    };
}

// ====================================================================
// 3. FIX NAVBAR ON MOBILE
// ====================================================================
function fixNavbarMobile() {
    // Close navbar when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.navbar').length) {
            $('.navbar-collapse').collapse('hide');
        }
    });
    
    // Close navbar when clicking on nav link
    $('.nav-link').on('click', function() {
        if ($(window).width() < 768) {
            $('.navbar-collapse').collapse('hide');
        }
    });
    
    // Add smooth scroll for anchor links on mobile
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this.hash);
        if (target.length) {
            e.preventDefault();
            $('.navbar-collapse').collapse('hide');
            
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 500);
        }
    });
}

// ====================================================================
// 4. TOUCH-FRIENDLY STAR RATING
// ====================================================================
function fixStarRatingTouch() {
    // Remove hover effects on touch devices
    if ('ontouchstart' in window) {
        $(document).off('mouseenter mouseleave', '.star, .stars');
        
        // Use touchstart instead of click for better responsiveness
        $(document).on('touchstart', '.star', function(e) {
            e.preventDefault();
            $(this).trigger('click');
        });
    }
}

// ====================================================================
// 5. PREVENT DOUBLE-TAP ZOOM ON BUTTONS
// ====================================================================
function preventDoubleTapZoom() {
    let lastTouchEnd = 0;
    
    $(document).on('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    });
    
    // Add touch-action CSS to buttons
    $('button, .btn, a').css('touch-action', 'manipulation');
}

// ====================================================================
// 6. FIX AUTOCOMPLETE POSITION
// ====================================================================
function fixAutocompletePosition() {
    $('#menuSearchBar').on('focus', function() {
        if ($(window).width() < 768) {
            // Scroll input into view on mobile
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    });
    
    // Adjust autocomplete position for mobile
    $(window).on('resize', function() {
        if ($('#autocompleteSuggestions').is(':visible')) {
            const searchBar = $('#menuSearchBar');
            const position = searchBar.offset();
            
            $('#autocompleteSuggestions').css({
                'top': searchBar.outerHeight() + 'px',
                'width': searchBar.outerWidth() + 'px'
            });
        }
    });
}

// ====================================================================
// 7. ADD SWIPE GESTURES TO CLOSE MODALS
// ====================================================================
function addSwipeToClose() {
    let touchStartY = 0;
    let touchEndY = 0;
    
    $('.auth-modal-content, .cart-modal-content, .recipe-modal-content').on('touchstart', function(e) {
        touchStartY = e.originalEvent.touches[0].clientY;
    });
    
    $('.auth-modal-content, .cart-modal-content, .recipe-modal-content').on('touchmove', function(e) {
        touchEndY = e.originalEvent.touches[0].clientY;
        
        // Allow scrolling within modal
        const scrollTop = $(this).scrollTop();
        const scrollHeight = $(this)[0].scrollHeight;
        const height = $(this).height();
        
        // If at top and swiping down, or at bottom and swiping up, prevent default
        if ((scrollTop === 0 && touchEndY > touchStartY) || 
            (scrollTop + height >= scrollHeight && touchEndY < touchStartY)) {
            e.preventDefault();
        }
    });
    
    $('.auth-modal-content, .cart-modal-content, .recipe-modal-content').on('touchend', function() {
        const swipeDistance = touchEndY - touchStartY;
        
        // If swiped down more than 100px, close modal
        if (swipeDistance > 100) {
            const modalType = $(this).closest('.auth-modal, .cart-modal, .recipe-modal').attr('id');
            
            if (modalType === 'authModal') {
                closeAuthModal();
            } else if (modalType === 'cartModal') {
                closeCart();
            } else if (modalType === 'recipeModal') {
                closeRecipeModal();
            }
        }
    });
}

// ====================================================================
// 8. FIX CART MODAL FOR MOBILE
// ====================================================================
function fixCartModalMobile() {
    // Adjust cart item layout for mobile
    function adjustCartLayout() {
        if ($(window).width() < 768) {
            $('.cart-item').each(function() {
                const $item = $(this);
                const $controls = $item.find('.cart-item-controls');
                
                // Stack controls vertically on mobile
                $controls.css({
                    'flex-direction': 'column',
                    'align-items': 'stretch',
                    'width': '100%'
                });
            });
        } else {
            $('.cart-item .cart-item-controls').css({
                'flex-direction': 'row',
                'align-items': 'center',
                'width': 'auto'
            });
        }
    }
    
    adjustCartLayout();
    $(window).on('resize', adjustCartLayout);
    
    // Update cart display to trigger layout adjustment
    const originalUpdateCartDisplay = window.updateCartDisplay;
    if (typeof originalUpdateCartDisplay === 'function') {
        window.updateCartDisplay = function() {
            originalUpdateCartDisplay();
            setTimeout(adjustCartLayout, 100);
        };
    }
}

// ====================================================================
// 9. OPTIMIZE IMAGES FOR MOBILE
// ====================================================================
function optimizeImagesForMobile() {
    // Lazy load images on mobile for better performance
    if ($(window).width() < 768) {
        $('img').each(function() {
            const $img = $(this);
            
            // Add loading="lazy" attribute
            if (!$img.attr('loading')) {
                $img.attr('loading', 'lazy');
            }
        });
    }
}

// ====================================================================
// 10. ADD MOBILE-SPECIFIC UTILITIES
// ====================================================================

// Detect orientation change
$(window).on('orientationchange', function() {
    // Close all modals on orientation change
    $('.auth-modal, .cart-modal, .recipe-modal').fadeOut(300);
    $('body').css('overflow', 'auto');
    
    // Show notification
    showNotification('info', '📱 Screen orientation changed');
    
    // Recalculate layouts
    setTimeout(() => {
        $(window).trigger('resize');
    }, 100);
});

// Add pull-to-refresh indicator
let pullStartY = 0;
$(window).on('touchstart', function(e) {
    if ($(window).scrollTop() === 0) {
        pullStartY = e.originalEvent.touches[0].clientY;
    }
});

$(window).on('touchmove', function(e) {
    if ($(window).scrollTop() === 0) {
        const currentY = e.originalEvent.touches[0].clientY;
        const pullDistance = currentY - pullStartY;
        
        if (pullDistance > 100) {
            // Add visual indicator (optional)
            if ($('#pullToRefresh').length === 0) {
                $('body').prepend('<div id="pullToRefresh" style="position: fixed; top: 10px; left: 50%; transform: translateX(-50%); background: #ffc107; color: #000; padding: 10px 20px; border-radius: 20px; z-index: 99999;">Release to refresh</div>');
            }
        }
    }
});

$(window).on('touchend', function() {
    if ($('#pullToRefresh').length > 0) {
        $('#pullToRefresh').remove();
        location.reload();
    }
});

// ====================================================================
// 11. PERFORMANCE OPTIMIZATIONS FOR MOBILE
// ====================================================================

// Throttle scroll events on mobile
let scrollTimeout;
if ($(window).width() < 768) {
    const originalScrollHandler = $(window).data('events')?.scroll;
    
    $(window).off('scroll').on('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler.forEach(handler => handler.handler());
            }
        }, 50);
    });
}

// Reduce animation on low-end devices
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    $('*').css('animation-duration', '0.2s');
    $('*').css('transition-duration', '0.2s');
}

console.log('✅ Mobile fixes initialized successfully!');

// FIX AUTH MODAL SCROLL
$(document).ready(function() {
    // Разрешаем скролл на модалке
    $('#authModal').css({
        'overflow-y': 'auto',
        '-webkit-overflow-scrolling': 'touch'
    });
    
    // При открытии прокручиваем наверх
    $('#loginBtn, #signupBtn').on('click', function() {
        setTimeout(() => {
            $('#authModal').scrollTop(0);
        }, 100);
    });
    
    // Корректировка при изменении ориентации
    $(window).on('orientationchange resize', function() {
        if ($('#authModal').is(':visible')) {
            setTimeout(() => {
                $('#authModal').scrollTop(0);
            }, 200);
        }
    });
});

// ====================================================================
// FIX AUTO SCROLL AFTER REGISTRATION/LOGIN
// ====================================================================

// Сохраняем оригинальные функции
const originalHandleSignup = window.handleSignup;
const originalHandleLogin = window.handleLogin;
const originalCloseAuthModal = window.closeAuthModal;

// ПЕРЕОПРЕДЕЛЯЕМ handleSignup
function handleSignup(e) {
    e.preventDefault();
    
    // Сохраняем текущую позицию скролла
    const scrollPosition = $(window).scrollTop();
    
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
    
    if (!isValid) {
        // КРИТИЧЕСКИЙ ФИХ: Возвращаем скролл на место
        setTimeout(() => {
            $(window).scrollTop(scrollPosition);
        }, 10);
        return;
    }
    
    // Check if user exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        showNotification('error', '❌ Email already registered');
        // Возвращаем скролл
        setTimeout(() => {
            $(window).scrollTop(scrollPosition);
        }, 10);
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
    
    // КРИТИЧЕСКИЙ ФИХ: Закрываем модалку БЕЗ прокрутки
    closeAuthModalWithoutScroll();
    
    // Показываем уведомление
    showNotification('success', `🎉 Account created! Welcome, ${name}!`);
    
    // Сбрасываем форму
    $('#signupFormElement')[0].reset();
    
    // ГАРАНТИРОВАННО возвращаем скролл на исходную позицию
    setTimeout(() => {
        $(window).scrollTop(scrollPosition);
        $('html, body').scrollTop(scrollPosition);
    }, 50);
}

// ПЕРЕОПРЕДЕЛЯЕМ handleLogin
function handleLogin(e) {
    e.preventDefault();
    
    // Сохраняем текущую позицию скролла
    const scrollPosition = $(window).scrollTop();
    
    const email = $('#loginEmail').val().trim();
    const password = $('#loginPassword').val();
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI();
        
        // Закрываем модалку БЕЗ прокрутки
        closeAuthModalWithoutScroll();
        
        showNotification('success', `✅ Welcome back, ${user.name}!`);
        $('#loginFormElement')[0].reset();
        
        // ГАРАНТИРОВАННО возвращаем скролл
        setTimeout(() => {
            $(window).scrollTop(scrollPosition);
            $('html, body').scrollTop(scrollPosition);
        }, 50);
    } else {
        showNotification('error', '❌ Invalid email or password');
        // Возвращаем скролл
        setTimeout(() => {
            $(window).scrollTop(scrollPosition);
        }, 10);
    }
}

// НОВАЯ ФУНКЦИЯ: Закрытие модалки БЕЗ автоскролла
function closeAuthModalWithoutScroll() {
    const $modal = $('#authModal');
    const $body = $('body');
    
    // Сохраняем позицию скролла ДО закрытия
    const scrollPos = $(window).scrollTop();
    
    // Закрываем модалку
    $modal.fadeOut(300);
    
    // Восстанавливаем body
    $body.css({
        'overflow': '',
        'position': '',
        'top': '',
        'width': '',
        'height': ''
    });
    
    // КРИТИЧЕСКИЙ ФИХ: Принудительно возвращаем скролл
    $(window).scrollTop(scrollPos);
    $('html, body').scrollTop(scrollPos);
    
    // Дополнительная проверка через 100ms
    setTimeout(() => {
        $(window).scrollTop(scrollPos);
        $('html, body').scrollTop(scrollPos);
    }, 100);
    
    // И еще одна через 300ms (после анимации)
    setTimeout(() => {
        $(window).scrollTop(scrollPos);
        $('html, body').scrollTop(scrollPos);
    }, 300);
}

// ПЕРЕОПРЕДЕЛЯЕМ стандартный closeAuthModal
function closeAuthModal() {
    closeAuthModalWithoutScroll();
}

// Экспортируем функции в глобальную область
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.closeAuthModal = closeAuthModal;
window.closeAuthModalWithoutScroll = closeAuthModalWithoutScroll;

// ====================================================================
// ДОПОЛНИТЕЛЬНЫЕ ФИКСЫ
// ====================================================================

$(document).ready(function() {
    
    // 1. БЛОКИРУЕМ АВТОФОКУС НА ЭЛЕМЕНТАХ ПОСЛЕ ЗАКРЫТИЯ МОДАЛКИ
    $('#authModal').on('hide.bs.modal hidden.bs.modal', function(e) {
        e.preventDefault();
        
        // Убираем фокус со всех элементов
        $(':focus').blur();
        
        // Запрещаем автоскролл
        const scrollY = $(window).scrollTop();
        $(window).scrollTop(scrollY);
    });
    
    // 2. БЛОКИРУЕМ СКРОЛЛ ПРИ ПОКАЗЕ УВЕДОМЛЕНИЙ
    const originalShowNotification = window.showNotification;
    window.showNotification = function(type, message) {
        const scrollPos = $(window).scrollTop();
        
        if (typeof originalShowNotification === 'function') {
            originalShowNotification(type, message);
        }
        
        // Возвращаем скролл
        setTimeout(() => {
            $(window).scrollTop(scrollPos);
        }, 10);
    };
    
    // 3. ПРЕДОТВРАЩАЕМ SCROLL TO TOP ПРИ ОБНОВЛЕНИИ UI
    const originalUpdateAuthUI = window.updateAuthUI;
    window.updateAuthUI = function() {
        const scrollPos = $(window).scrollTop();
        
        if (typeof originalUpdateAuthUI === 'function') {
            originalUpdateAuthUI();
        }
        
        // Возвращаем скролл после обновления UI
        setTimeout(() => {
            $(window).scrollTop(scrollPos);
        }, 10);
    };
    
    // 4. БЛОКИРУЕМ АВТОСКРОЛЛ ПРИ ИЗМЕНЕНИИ DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Если изменился navbar (добавилось/убралось имя пользователя)
            if (mutation.target.id === 'authButtons' || mutation.target.id === 'userProfile') {
                // НЕ скроллим
                const currentScroll = $(window).scrollTop();
                setTimeout(() => {
                    $(window).scrollTop(currentScroll);
                }, 0);
            }
        });
    });
    
    // Наблюдаем за изменениями в navbar
    const navbarElement = document.querySelector('.navbar-nav');
    if (navbarElement) {
        observer.observe(navbarElement, {
            attributes: true,
            childList: true,
            subtree: true
        });
    }
    
    // 5. ПРЕДОТВРАЩАЕМ SCROLL ПРИ FADEOUT МОДАЛКИ
    $('#authModal').on('fadeOut', function() {
        const scrollPos = $(window).scrollTop();
        $(window).scrollTop(scrollPos);
    });
    
    // 6. ФИХ ДЛЯ BODY POSITION FIXED
    let bodyScrollPosition = 0;
    
    // При открытии модалки
    $('#loginBtn, #signupBtn, #profileLink').on('click', function() {
        bodyScrollPosition = $(window).scrollTop();
        
        $('body').css({
            'position': 'fixed',
            'top': `-${bodyScrollPosition}px`,
            'width': '100%'
        });
    });
    
    // При закрытии модалки - возвращаем скролл
    $('.auth-close').on('click', function() {
        $('body').css({
            'position': '',
            'top': '',
            'width': ''
        });
        
        $(window).scrollTop(bodyScrollPosition);
    });
    
    // 7. ПРЕДОТВРАЩАЕМ СКРОЛЛ ПРИ RESET ФОРМЫ
    $('#signupFormElement, #loginFormElement').on('reset', function() {
        const scrollPos = $(window).scrollTop();
        setTimeout(() => {
            $(window).scrollTop(scrollPos);
        }, 0);
    });
    
    // 8. БЛОКИРУЕМ АВТОСКРОЛЛ К ANCHOR LINKS
    $('a[href^="#"]').on('click', function(e) {
        // Если это не навигационная ссылка, блокируем скролл
        const href = $(this).attr('href');
        if (href === '#' || !document.querySelector(href)) {
            e.preventDefault();
            return false;
        }
    });
    
    // 9. ФИХ ДЛЯ iOS SAFARI
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        // Предотвращаем bounce scroll после закрытия модалки
        $(window).on('touchmove', function(e) {
            if ($('#authModal').is(':visible')) {
                // Разрешаем скролл только внутри модалки
                const $target = $(e.target);
                if (!$target.closest('#authModal').length) {
                    e.preventDefault();
                }
            }
        });
    }
    
    // 10. ГЛОБАЛЬНАЯ ЗАЩИТА ОТ АВТОСКРОЛЛА
    let isModalClosing = false;
    
    $('#authModal').on('hide', function() {
        isModalClosing = true;
        const scrollPos = $(window).scrollTop();
        
        // Блокируем любые попытки скролла на 500ms
        $(window).on('scroll.blockscroll', function() {
            if (isModalClosing) {
                $(window).scrollTop(scrollPos);
            }
        });
        
        setTimeout(() => {
            isModalClosing = false;
            $(window).off('scroll.blockscroll');
        }, 500);
    });
    
    console.log('✅ Auto-scroll prevention activated!');
});

// ====================================================================
// ЭКСТРЕННЫЙ ФИХ: CSS для предотвращения скролла
// ====================================================================

// Добавляем CSS правило для body
if ($('#preventScrollStyles').length === 0) {
    $('head').append(`
        <style id="preventScrollStyles">
            body.modal-closing {
                overflow: hidden !important;
                position: fixed !important;
                width: 100% !important;
            }
            
            /* Предотвращаем скролл при обновлении navbar */
            #authButtons, #userProfile {
                transition: none !important;
            }
        </style>
    `);
}

