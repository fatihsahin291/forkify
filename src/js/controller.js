import * as modal from './modal.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import boookmarksView from './views/boookmarksView.js';
import paginationView from './views/paginationView.js';
import stable from 'core-js/stable';
import resultsView from './views/resultsView.js';
import boookmarksView from './views/boookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import recipeView from './views/recipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import View from './views/view.js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    ResultsView.renderSpinner();
    const id = window.location.hash.slice(1);

    if (!id) return;
    RecipeView.renderSpinner();

    // 0)Update results view to mark selected search result
    ResultsView.render(modal.getSearchResultsPage());

    // 3) Updating bookmarks view
    boookmarksView.update(modal.state.bookmarks);

    // 1) Loading recipe
    await modal.loadRecipe(id);

    // const res = await fetch(
    //   'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcac4'
    // );

    // 2) Rendering recipe
    RecipeView.render(modal.state.recipe);
  } catch (err) {
    RecipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    console.log(ResultsView);

    //1. Get search query
    const query = SearchView.getQuery();
    if (!query) return;

    //2. Load search results
    modal.loadSearchResults(query);

    //3. Render results
    // ResultsView.render(modal.state.search.results);
    ResultsView.render(modal.getSearchResultsPage());

    //4. Render initial pagination buttons
    paginationView.render(modal.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1. Rendernew results
  // ResultsView.render(modal.state.search.results);
  ResultsView.render(modal.getSearchResultsPage(goToPage));

  //2. Render new pagination buttons
  paginationView.render(modal.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  modal.updateServings(newServings);

  // Update the recipe view
  // RecipeView.render(modal.state.recipe);
  RecipeView.update(modal.state.recipe);
};

const controlAddBookmark = function () {
  // Add / remove bookmark
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);

  // Update recipe view
  RecipeView.render(modal.state.recipe);

  // Render bookmarks
  boookmarksView.render(modal.state.bookmarks);
};

const controlBookmarks = function () {
  boookmarksView.render(modal.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await modal.uploadRecipe(newRecipe);
    console.log(modal.state.recipe);

    // Render recipe
    recipeView.render(modal.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    boookmarksView.render(modal.state.bookmarks);

    // Change id in the url
    window.history.pushState(null, '', `#${modal.state.recipe.id}`);

    // Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

const init = function () {
  boookmarksView.addHandleRender(controlBookmarks);
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHndlerUpload(controlAddRecipe);
  newFeature();
};
init();
