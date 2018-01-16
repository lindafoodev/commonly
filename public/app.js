// run handle > executes fetch > returns to STORE > then we render based on STORE (view and user)

/* global jQuery, handle, render */
'use strict';
/**
 * Event Listener
 * Primary Job:
 * - Listen for user events like `click`, and call event handler methods
 * - Pass the "STORE" and the event objects and the event handlers
 * 
 * Setup:
 * jQuery's document ready "starts" the app
 * Event listeners are wrapped in jQuery's document.ready function
 * STORE is inside document.ready so it is protected
 * 
 * 
 * Rule of Thumb:
 * - Never manipulation DOM directly
 * - Never make fetch/AJAX calls directly
 * - Updates to STORE allowed
 * 
 */

//on document ready bind events
jQuery(function ($) {

  $('.js-welcome').on('click', '.create-btn', handle.create);
  //$('.js-view').on('submit', '.submit-btn', handle.addItem);
  $('.js-view').submit(event, function(e) {
    e.preventDefault();
    handle.addItem(event);
  });

  $('.js-mvp-user').on('change', function(e){
    STORE.currentUser = $('select option:selected').text();
  });
});

// function handleShoppingListAdd() {

//   $('#js-shopping-list-form').submit(function(e) {
//     e.preventDefault();
//     addShoppingItem({
//       name: $(e.currentTarget).find('#js-new-item').val(),
//       checked: false
//     });
//   });

// }


  /*
  $('#create').on('submit', STORE, handle.create);
  $('#search').on('submit', STORE, handle.search);
  $('#edit').on('submit', STORE, handle.update);

  $('#result').on('click', '.detail', STORE, handle.details);
  $('#detail').on('click', '.remove', STORE, handle.remove);
  $('#detail').on('click', '.edit', STORE, handle.viewEdit);
  
  $(document).on('click', '.viewCreate', STORE, handle.viewCreate);
  $(document).on('click', '.viewList', STORE, handle.viewList);

  // start app by triggering a search
  $('#search').trigger('submit');

});
*/