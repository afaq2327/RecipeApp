import {elements} from './base'
//getting input from the form
export const getInput = () => elements.searchInput.value;

//clearing the input text
export const clearInput = () => elements.searchInput.value = '';

//clearing previous results before searching 
export const clearResults = () => elements.searchResList.innerHTML = '';

//function to print the single recipe
const renderRecipe = recipe => {
    const markup =`
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${(recipe.title).substr(1, 17)+'...'}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
  
    elements.searchResList.insertAdjacentHTML('beforeEnd', markup);
};


//Button for pagination
const creatBtn = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
</button>
`;

//clearing the list
export const clearResList = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPage.innerHTML = '';
}

//Pagination
const renderBtn = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

    let btn;
    if(page === 1 && pages > 1) {
      // only next btn
      btn = creatBtn(page, 'next');
    }
    else if(page < pages) {
      // both btns
      btn = `
      ${creatBtn(page, 'prev')}
      ${creatBtn(page, 'next')}
      `;
    }
    else if(page === pages && pages > 1){
      // only prev btn
      btn = creatBtn(page, 'prev');
    }

    elements.searchResPage.insertAdjacentHTML('afterbegin', btn);
};

//updating the UI
export const renderResult = (recipes,page = 1, resPerPage = 10) =>{
    const start = (page-1) * resPerPage;
    const end = page * resPerPage;
    if(recipes!= undefined) recipes.slice(start,end).forEach(renderRecipe);
    renderBtn(page, recipes.length, resPerPage);
} 

//highlighting the selected recipe
export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => el.classList.remove('results__link--active'));
  
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}
  
//
export const limitRecipeTitle = (title, limit = 17) => {
    let newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((a, b) => {
          if(a+b.length <= limit){
            newTitle.push(b);
          }
          return a + b.length;
        }, 0);
        return `${newTitle.join('')}...`
    }
    return title;
};