/* global $ */

'use strict';
/**
 * RENDER METHODS
 * 
 * Primary Job: Direct DOM Manipulation
 * 
 * Rule of Thumb:
 * - Direct DOM manipulation OK
 * - Never update store
 * 
 */

let render = { //RN: const

  view: function(id=null) {
    switch(STORE.view) { //RN: indent
      case 'signon':
        api.welcome().then(response => render.introduction(response));
        break;
      case 'list':
        api.welcome().then(response => render.welcome(response))
        api.listItems().then(response => this.listItems(response));
        break;
      case 'create':
        this.createItem();
        break;
      case 'edit':
        this.editItem(id);
        break;
    }
  },

  welcome: function (response) {
    const message = response.message; //RN: just put rsponse.message in html - save yourself a line; variable only for something you need more than once (rot)
    const createItemButton =  '<button type="button" class="create-btn">Click Here! <br>List New Item</button>';
    $('.js-welcome').html(message).append(createItemButton);
  },

  introduction: function (response) {
    const message = response.message;//RN: just put rsponse.message in html - save yourself a line; variable only for something you need more than once (rot)
    const introText = '<div class="js-intro-text">Your online source for <br/> sharing, giving away and selling your stuff <br/> to members of your community. </div>';
    const startButton = '<button type="button" class="start-btn">Start Demo!</button>';
    $('.js-welcome').html(message).append(introText).append(startButton);
  },

  userContextSwitcher: function(){
    // Get array from api.listUsers
    const usersList = api.listUsers();
    // format user from usersList to option tag
    const userOptions = usersList.map(user => {
      return `<option>${user}</option>`;
    });

   //append userOptions to select element
    let selectEl = '<select class="user">'; //RN: const, use reduce - takes an array - gives more options
    userOptions.forEach(u => selectEl += u);
    selectEl += '</select>';

    //RN!!!!!!!
    const renderString = usersList.reduce(function (str,user) {
      return str + `<option>${user}</option>`
    }, selectEl).concat('</select>')
    
    //console.log('what is renderString',renderString);

    // inject select element to div
    $('.js-mvp-user').html(selectEl);
  },
  
  listItems: function (items) { //RN: break out terniary into variable function
    const item = items.map(item => {
      return `
      <div class="listing">
        <div class="item-info">
        <img src="${(item.image ? item.image : '//lorempixel.com/80/80/cats')}" alt="${item.name}">
        <h2>${item.name}</h2>
        <em>Type: ${item.type}</em>
        <p>${item.description}</p>
        <p>Posted by: ${item.postedBy}</p>
        <p>${(((item.acceptedBy) && (item.type !== 'Loan')) ? item.status+' by: '+item.acceptedBy : '')}</p>
        <p>${(((item.acceptedBy !== null) && (item.type === 'Loan') && (item.status !== 'Borrow'))? item.status+' by: '+item.acceptedBy : '')}</p>
        </div>
        <div class="actions">
        ${(((item.status === 'Borrow' || item.status === 'Claim' || item.status === 'Make Offer') && (item.postedBy !== STORE.currentUser)) ? `<button type="button" data-item-id="${item._id}" data-item-type="${item.type}" class="action-btn btn ${item.status.replace(' ','-')}">${item.status}</button>` : '')}
        ${((item.status === 'On Loan' || item.status === 'Claimed' || item.status === 'Purchased') ? `<button class="js-status-tag" disabled> ${item.status} </button>`: '')}
        ${((item.status === 'On Loan' && item.acceptedBy === STORE.currentUser) ? `<button type="button" data-item-id="${item._id}" data-item-status="${item.status}" class="btn btn-info return-btn">Return</button>` : '')}
        ${(item.postedBy === STORE.currentUser ? `<button type="button" data-item-id="${item._id}" class="btn btn-info edit-btn">Edit</button>`:'')}
        ${(item.postedBy === STORE.currentUser ? `<button type="button" data-item-id="${item._id}" class="btn btn-danger delete-btn">Delete</button>`:'')}
        
        </div>
      </div>
      `;
    }); 
    $('.js-view').html(item);
  },

  _renderForm: function(className, id = null){ //RN: break pieces into function 125-127 lines
    /**
     * These should come from a possible endpoint listing valid combinations, put invokation of function - only 1 html template and putting slices where needed
     * of 
     */
    const typeList = ['Sell', 'Loan', 'Free']; 

    let templateCreate = `<form id="${className}" `;
    
    templateCreate += (id ? `data-item-id=${id}`:'');
    
    templateCreate+=` class="js-view-form form-group">
      <fieldset>
      <legend>${className[0].toUpperCase()+className.substring(1)}</legend>
      <div>
        <label for="name">Item Title</label>
        <input type="text" class="js-title form-control" name="name" required>
      </div>
      <div>
        <label for="image">Item Image</label>
        <input type="text" class="js-image form-control" name="image" placeholder="e.g. http://lorempixel.com/80/80/cat">
      </div>
      <div>
        <label for="type">Type</label>
        <select class="form-control js-type" name="type">`;
        
    typeList.forEach(t =>{
      templateCreate+=`<option value="${t}">${t}</option>`;
    });

    templateCreate+=`</select>
      </div>
      <div>
        <label for="description">Item Description</label>
        <textarea rows="4" cols="50" name="description"  class="js-description form-control"></textarea>

      </div>
      <button type="submit" class="btn-primary btn submit-${className}-btn">Submit</button>
      <button type="cancel" class="btn-outline-warning btn cancel-btn">Cancel</button>
      </fieldset>
      </form>
    `;
    return templateCreate;
  },

  createItem: function() {
    const createTemplate = this._renderForm('create');
    $('.js-view').html(createTemplate);
  },

  editItem: function(item) {
    const editTemplate = this._renderForm('edit', item._id);

    $('.js-view').html(editTemplate); //RN: issue directly going to DOM (expensive), extract value once and use find $el
    $('.js-view > form#edit').find('.js-title').val(item.name);
    $('.js-view > form#edit').find('.js-image').val(item.image);
    $('.js-view > form#edit .js-type option[value='+item.type+']').attr('selected', 'true');
    $('.js-view > form#edit').find('.js-description').val(item.description);
  },

};

$(() =>{ //RN: looking for consistency
  //Do stuff here e.g. call api.welcome()
  render.view();
  api.listUsers();
  render.userContextSwitcher();
});