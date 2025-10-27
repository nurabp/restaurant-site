$(document).ready(function(){
    console.log("jQuery is ready!");
    
    // Call all functions
    initSearch();
    initScrollProgress();
    initAnimatedCounter();
    initFormSubmit();
    initNotifications();
    initClipboard();
    initLazyLoading();
});


// TASK 1: Real-time Search
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
    
    // TASK 2: Autocomplete
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

// TASK 3: Search Highlighting
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

// ============================================================
// PART 2: UX Engagement Elements
// ============================================================

// TASK 4: Scroll Progress Bar
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

// TASK 5: Animated Number Counter
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
    
    // Animate on scroll
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

// TASK 6: Loading Spinner
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
        
        var isValid = true;
        $('.form-control').removeClass('is-invalid');
        
        if (name.length < 2) {
            $('#inputName').addClass('is-invalid');
            isValid = false;
        }
        if (email.indexOf('@') === -1) {
            $('#inputEmail').addClass('is-invalid');
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
                showNotification('success', '✅ Reservation confirmed!');
                $('#reservationForm')[0].reset();
            } else {
                showNotification('error', '❌ Please fix errors');
            }
            
            $button.prop('disabled', false);
            $button.html(oldText);
        }, 2000);
    });
}


// TASK 7: Notification System
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

// TASK 8: Copy to Clipboard
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

// TASK 9: Lazy Loading
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


// Accordion
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

// Popup
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

// Background changer
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
    showNotification('info', '🎨 Background changed');
});

// DateTime
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