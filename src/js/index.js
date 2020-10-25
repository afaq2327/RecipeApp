//Global App Controller

//importing the models
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';

// //importing the views
import * as searchView from './views/search';
import * as recipeView from './views/recipe';
import * as listView from './views/list';
import * as likeView from './views/like';
import { elements, renderLoader, clearLoader } from './views/base';

//Creating a global state and assigning it to the window
const state = {};
window.state = state;

// #1. Search Controller
const searchController = async () => {
    //get query from the view
    const query = searchView.getInput();

    if(query){
      //New search object and add to state
      state.search = new Search(query);
      //preparing UI for results
      searchView.clearInput();
      searchView.clearResults();
      renderLoader(elements.searchRes);
      //Getting recipes
      await state.search.getResults();
      //updating UI
      clearLoader();
      searchView.renderResult(state.search.recipes);
    }
}

elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    searchController();
});

//adding event listner to the pagination buttons
elements.searchResPage.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
  
    if(btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);
      searchView.clearResList();
      searchView.renderResult(state.search.recipes, goToPage);
    }
});

// #2.Recipe COntroller 

const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
  
    if(id) {
      // 1. Prepare UI for changes
      recipeView.clearRecipe();
      renderLoader(elements.recipe);
  
      // highlight Selected item
      if(state.search) searchView.highlightSelected(id);
  
      // 2. Create New recipe object
      state.recipe = new Recipe(id);
  
      try {
        // 3. Get recipe data and parseIngredients
        await state.recipe.getRecipe();
        state.recipe.parseIngredients();
  
        // 4. Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServing();
  
        // 5. Render recipe
        clearLoader();
        recipeView.renderRecipe(
          state.recipe,
          state.likes.isLiked(id)
        );
      }
      catch(err) {
        alert(`Error processing recipes.`);
        console.log(err);
      }
    }
  };
  
    ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
  
  
  
  //#3. LIST CONTROLLER
  
    const controllList = () => {
      // Create a new List if there's none
      if(!state.list) state.list = new List();
    
      // Add each ingredient to the list
      state.recipe.ingredients.forEach(el => {
          const item = state.list.addItem(el.count, el.unit, el.ingredient)
          listView.renderItem(item);
      });
    };
  
  
  

//#4. Like CONTROLLER
  
  const controlLike = () => {
    // Create a new Like if there's none
    if(!state.likes) state.likes = new Like();
  
    const currentID = state.recipe.id;
    // if item is NOT yet liked
    if(!state.likes.isLiked(currentID)){
      // add item into liked list
      const newLike = state.likes.addLike(
        currentID,
        state.recipe.title,
        state.recipe.author,
        state.recipe.image
      )
      // toggle menu btn
      likeView.toggleLikeBtn(true);
      // add like to UI
      likeView.renderLike(newLike);
    }
    // if item HAS benn liked
    else {
      // delete item into liked list
      state.likes.deleteLike(currentID);
      // toggle menu btn
      likeView.toggleLikeBtn(false);
      // delete like to UI
      likeView.deleteLike(currentID);
    }
     likeView.toggleLikeMenu(state.likes.getNumLikes());
  };
  
  // Handling localStorage on load
    window.addEventListener('load', () => {
      state.likes = new Like();
  
      // Retrive data from localstorage
      state.likes.readStorage()
  
      // Toggle likemenu
      likeView.toggleLikeMenu(state.likes.getNumLikes());
  
      // Render existing menu
      state.likes.likes.forEach(like => likeView.renderLike(like));
    })
  
  
  
  
   // Handling update and delete list items
   elements.shopping.addEventListener('click', e => {
     const id = e.target.closest('.shopping__item').dataset.itemid;
  
     if(e.target.matches('.shopping__delete, .shopping__delete *')){
       // Delete in the state
       state.list.deleteItem(id);
  
       //Delete in the UI
       listView.deleteItem(id);
     }
     else if(e.target.matches('.shopping__count--value')){
       const val = parseFloat(e.target.value, 10);
       if(val > 0) state.list.updateCount(id, val);
     }
   });
  
  
  
  
  // Hndling Servings and Ingredients
    elements.recipe.addEventListener('click', e => {
      if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease btn
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
      }
      else if(e.target.matches('.btn-increase, .btn-increase *')){
      //Increase btn
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);
      }
      else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controllList();
      }
      else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
      }
    }
  );
  
  
  
  window.l = new List();