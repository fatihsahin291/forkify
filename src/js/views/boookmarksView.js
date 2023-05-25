import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2;

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a new recipe and bookmark it :)`;
  _message = '';

  addHandleRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
