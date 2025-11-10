// ====================================================================
// EXTERNAL API INTEGRATION - TheMealDB API (Free, No Key Required)
// ====================================================================

$(document).ready(function() {
    initAPIFeatures();
});

function initAPIFeatures() {
    // Add API section button to navbar
    if ($('#apiSectionBtn').length === 0) {
        $('.navbar-nav').append(`
            <li class="nav-item">
                <a class="nav-link" href="#apiSection" id="apiSectionBtn">🍳 Recipes</a>
            </li>
        `);
    }

    // Add API section to page
    if ($('#apiSection').length === 0) {
        $('main').append(`
            <section id="apiSection" class="container my-5 py-5">
                <h2 class="text-center mb-5 text-light">🍳 Discover Popular Recipes</h2>
                
                <div class="row mb-4">
                    <div class="col-md-8 mx-auto">
                        <div class="input-group input-group-lg">
                            <input type="text" class="form-control" id="recipeSearch" 
                                   placeholder="Search recipes (e.g., chicken, pasta, cake)...">
                            <button class="btn btn-warning" id="searchRecipeBtn">🔍 Search</button>
                        </div>
                    </div>
                </div>

                <div class="text-center mb-4">
                    <button class="btn btn-outline-warning me-2 category-btn" data-category="Seafood">🦐 Seafood</button>
                    <button class="btn btn-outline-warning me-2 category-btn" data-category="Beef">🥩 Beef</button>
                    <button class="btn btn-outline-warning me-2 category-btn" data-category="Chicken">🍗 Chicken</button>
                    <button class="btn btn-outline-warning me-2 category-btn" data-category="Dessert">🍰 Dessert</button>
                    <button class="btn btn-outline-warning me-2 category-btn" data-category="Vegetarian">🥗 Vegetarian</button>
                </div>

                <div id="recipeResults" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    <!-- Results will be inserted here -->
                </div>

                <div id="recipeLoading" class="text-center d-none">
                    <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="text-light mt-3">Loading delicious recipes...</p>
                </div>

                <div id="recipeEmpty" class="text-center d-none">
                    <p class="text-light fs-4">🔍 No recipes found. Try another search!</p>
                </div>
            </section>
        `);
    }

    // Add recipe modal
    if ($('#recipeModal').length === 0) {
        $('body').append(`
            <div id="recipeModal" class="recipe-modal">
                <div class="recipe-modal-content">
                    <button class="recipe-close">&times;</button>
                    <div id="recipeDetails"></div>
                </div>
            </div>
        `);
    }

    // Add styles
    if ($('#apiStyles').length === 0) {
        $('head').append(`
            <style id="apiStyles">
                .recipe-modal {
                    display: none;
                    position: fixed;
                    z-index: 10003;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.9);
                    overflow-y: auto;
                }
                
                .recipe-modal-content {
                    position: relative;
                    background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
                    margin: 50px auto;
                    padding: 40px;
                    width: 90%;
                    max-width: 900px;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    color: #fff;
                }
                
                .recipe-close {
                    position: absolute;
                    right: 20px;
                    top: 20px;
                    background: none;
                    border: none;
                    color: #fff;
                    font-size: 2rem;
                    cursor: pointer;
                    z-index: 1;
                }
                
                .recipe-close:hover {
                    color: #ffc107;
                }
                
                .recipe-image {
                    width: 100%;
                    max-height: 400px;
                    object-fit: cover;
                    border-radius: 10px;
                    margin-bottom: 20px;
                }
                
                .recipe-title {
                    color: #ffc107;
                    font-size: 2rem;
                    margin-bottom: 20px;
                }
                
                .recipe-info {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                
                .recipe-badge {
                    background: #ffc107;
                    color: #000;
                    padding: 8px 15px;
                    border-radius: 20px;
                    font-weight: bold;
                }
                
                .recipe-section {
                    margin: 30px 0;
                }
                
                .recipe-section h3 {
                    color: #ffc107;
                    border-bottom: 2px solid #ffc107;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                
                .ingredient-list {
                    list-style: none;
                    padding: 0;
                }
                
                .ingredient-list li {
                    padding: 10px;
                    margin-bottom: 8px;
                    background: #3d3d3d;
                    border-radius: 5px;
                    border-left: 3px solid #ffc107;
                }
                
                .instructions {
                    line-height: 1.8;
                    font-size: 1.1rem;
                }
                
                .category-btn {
                    margin-bottom: 10px;
                }
                
                .category-btn:hover {
                    background-color: #ffc107;
                    color: #000;
                }
                
                .recipe-card {
                    cursor: pointer;
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                
                .recipe-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 10px 30px rgba(255, 193, 7, 0.3);
                }
                
                #recipeLoading {
                    padding: 60px 0;
                }
                
                #recipeEmpty {
                    padding: 60px 0;
                }
            </style>
        `);
    }

    // Event listeners
    $('#searchRecipeBtn').on('click', () => {
        const query = $('#recipeSearch').val().trim();
        if (query) {
            searchRecipes(query);
        }
    });

    $('#recipeSearch').on('keypress', function(e) {
        if (e.which === 13) {
            const query = $(this).val().trim();
            if (query) {
                searchRecipes(query);
            }
        }
    });

    $('.category-btn').on('click', function() {
        const category = $(this).data('category');
        searchByCategory(category);
    });

    $('.recipe-close').on('click', closeRecipeModal);

    $('#recipeModal').on('click', function(e) {
        if (e.target === this) {
            closeRecipeModal();
        }
    });

    // Load random recipes on page load
    loadRandomRecipes();
}

async function searchRecipes(query) {
    showLoading();
    
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        
        if (data.meals) {
            displayRecipes(data.meals);
            showNotification('success', `🍳 Found ${data.meals.length} recipes!`);
        } else {
            showEmpty();
            showNotification('info', '🔍 No recipes found for "' + query + '"');
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        showNotification('error', '❌ Failed to load recipes. Please try again.');
        hideLoading();
    }
}

async function searchByCategory(category) {
    showLoading();
    
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        
        if (data.meals) {
            displayRecipes(data.meals);
            showNotification('success', `🍳 Showing ${category} recipes`);
        } else {
            showEmpty();
        }
    } catch (error) {
        console.error('Error fetching recipes:', error);
        showNotification('error', '❌ Failed to load recipes');
        hideLoading();
    }
}

async function loadRandomRecipes() {
    showLoading();
    
    try {
        // Load 6 random recipes
        const promises = [];
        for (let i = 0; i < 6; i++) {
            promises.push(fetch('https://www.themealdb.com/api/json/v1/1/random.php'));
        }
        
        const responses = await Promise.all(promises);
        const dataArray = await Promise.all(responses.map(r => r.json()));
        const meals = dataArray.map(d => d.meals[0]);
        
        displayRecipes(meals);
    } catch (error) {
        console.error('Error loading random recipes:', error);
        hideLoading();
    }
}

function displayRecipes(meals) {
    const $results = $('#recipeResults');
    $results.empty();
    
    meals.forEach(meal => {
        $results.append(`
            <div class="col">
                <div class="card h-100 bg-dark text-white border-warning recipe-card" data-id="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h5 class="card-title text-warning">${meal.strMeal}</h5>
                        <p class="card-text">
                            ${meal.strCategory ? `<span class="badge bg-warning text-dark me-2">${meal.strCategory}</span>` : ''}
                            ${meal.strArea ? `<span class="badge bg-info">${meal.strArea}</span>` : ''}
                        </p>
                        <button class="btn btn-warning w-100 view-recipe-btn">View Recipe</button>
                    </div>
                </div>
            </div>
        `);
    });
    
    hideLoading();
    
    // Add click handler
    $('.view-recipe-btn').on('click', function() {
        const mealId = $(this).closest('.recipe-card').data('id');
        loadRecipeDetails(mealId);
    });
}

async function loadRecipeDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        
        if (data.meals && data.meals[0]) {
            displayRecipeDetails(data.meals[0]);
        }
    } catch (error) {
        console.error('Error loading recipe details:', error);
        showNotification('error', '❌ Failed to load recipe details');
    }
}

function displayRecipeDetails(meal) {
    // Get ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure} ${ingredient}`);
        }
    }
    
    const html = `
        <img src="${meal.strMealThumb}" class="recipe-image" alt="${meal.strMeal}">
        <h2 class="recipe-title">${meal.strMeal}</h2>
        
        <div class="recipe-info">
            <span class="recipe-badge">🍽️ ${meal.strCategory}</span>
            <span class="recipe-badge">🌍 ${meal.strArea}</span>
            ${meal.strTags ? meal.strTags.split(',').map(tag => 
                `<span class="recipe-badge">🏷️ ${tag.trim()}</span>`
            ).join('') : ''}
        </div>
        
        <div class="recipe-section">
            <h3>📝 Ingredients</h3>
            <ul class="ingredient-list">
                ${ingredients.map(ing => `<li>✓ ${ing}</li>`).join('')}
            </ul>
        </div>
        
        <div class="recipe-section">
            <h3>👨‍🍳 Instructions</h3>
            <div class="instructions">
                ${meal.strInstructions.split('\n').map(line => 
                    line.trim() ? `<p>${line}</p>` : ''
                ).join('')}
            </div>
        </div>
        
        ${meal.strYoutube ? `
            <div class="recipe-section text-center">
                <h3>📺 Video Tutorial</h3>
                <a href="${meal.strYoutube}" target="_blank" class="btn btn-danger btn-lg">
                    Watch on YouTube
                </a>
            </div>
        ` : ''}
    `;
    
    $('#recipeDetails').html(html);
    openRecipeModal();
}

function openRecipeModal() {
    $('#recipeModal').fadeIn(300);
    $('body').css('overflow', 'hidden');
}

function closeRecipeModal() {
    $('#recipeModal').fadeOut(300);
    $('body').css('overflow', 'auto');
}

function showLoading() {
    $('#recipeResults').hide();
    $('#recipeEmpty').addClass('d-none');
    $('#recipeLoading').removeClass('d-none');
}

function hideLoading() {
    $('#recipeLoading').addClass('d-none');
    $('#recipeResults').show();
}

function showEmpty() {
    $('#recipeLoading').addClass('d-none');
    $('#recipeResults').hide();
    $('#recipeEmpty').removeClass('d-none');
}