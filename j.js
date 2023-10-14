document.addEventListener('DOMContentLoaded', function() {
    const recipeCard = document.getElementById('recipeCard');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    async function fetchRecipeData(searchTerm) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
            const data = await response.json();
            return data.meals ? data.meals[0] : null;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    function displayRecipe(recipe) {
        if (recipe) {
            recipeCard.innerHTML = `
                <h2>${recipe.strCategory}</h2>
                <img src="${recipe.strMealThumb}" alt="${recipe.title}" style="width: 100px; height: 100px; border-radius: 50%;">
                <h3>Ingredients:</h3>
                <ul>
                    ${Array.from({ length: 20 }, (_, i) => i + 1)
                        .map(index => recipe[`strIngredient${index}`])
                        .filter(ingredient => ingredient)
                        .map(ingredient => `<li>${ingredient}</li>`)
                        .join('')}
                </ul>
                <h3>Instructions:</h3>
                <p>${recipe.strInstructions}</p>
            `;

            const videoUrl = recipe.strYoutube ? `https://www.youtube.com/embed/${recipe.strYoutube.slice(-11)}` : null;
            if (videoUrl) {
                const iframe = document.createElement('iframe');
                iframe.setAttribute('src', videoUrl);
                iframe.setAttribute('width', '560');
                iframe.setAttribute('height', '315');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allowfullscreen', 'true');

                recipeCard.appendChild(iframe);
            }
        } else {
            recipeCard.innerHTML = '<p>No matching recipes found.</p>';
        }
    }

    function searchRecipes() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            fetchRecipeData(searchTerm).then(recipe => {
                displayRecipe(recipe);
            });
        } else {
            recipeCard.innerHTML = '<p>Please enter a recipe name.</p>';
        }
    }

    searchButton.addEventListener('click', searchRecipes);
});
