/* global $, demo */

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

var render = {

  view: function(id=null) {
    if(STORE.view === 'list') {
      api.listItems().then(response => this.listItems(response));
    }
    if(STORE.view === 'create') {
      this.createItem();
    }
    if(STORE.view === 'edit') {
      this.editItem(id);
    }
    // if(STORE.view === 'delete') {

    // }
  },

  welcome: function (response) {
    const message = response.message;
    const createItemButton =  '<button type="button" class="create-btn">List New Item</button>';
    $('.js-welcome').html(message).append(createItemButton);
  },

  userContextSwitcher: function(){
    // Get array from api.listUsers
    const usersList = api.listUsers();
    // format user from usersList to option tag
    const userOptions = usersList.map(user => {
      return `<option>${user}</option>`;
    });

   //append userOptions to select element
    let selectEl = '<select class="user">';
    userOptions.forEach(u => selectEl += u);
    selectEl += '</select>';

    // inject select element to div
    $('.js-mvp-user').html(selectEl);
  },
  
  listItems: function (items) {
    const item = items.map(item => {
      return `
      <div class="listing">
        <div class="item-info">
        <img src="${(item.image ? item.image : '//lorempixel.com/80/80/cats')}" alt="${item.name}">
        <h2>${item.name}</h2>
        <em>Type: ${item.type}</em>
        <p>${item.description}</p>
        </div>
        <div class="actions">
        <p>Posted by: ${item.postedBy}</p>
        ${(item.acceptedBy ? item.status+' by: '+item.acceptedBy : '')}
        ${(((item.status === 'Borrow' || item.status === 'Claim' || item.status === 'Make Offer') && (item.postedBy !== STORE.currentUser)) ? `<button type="button" data-item-id="${item._id}" data-item-type="${item.type}" class="action-btn btn ${item.status.replace(' ','-')}">${item.status}</button>` : '')}
        ${((item.status === 'On Loan' || item.status === 'Claimed' || item.status === 'Purchased') ? `<div class="js-status-tag"> ${item.status} </div>`: '')}
        ${(item.postedBy === STORE.currentUser ? `<button type="button" data-item-id="${item._id}" class="btn btn-info edit-btn">Edit</button>`:'')}
        ${(item.postedBy === STORE.currentUser ? `<button type="button" data-item-id="${item._id}" class="btn btn-danger delete-btn">Delete</button>`:'')}
        
        </div>
      </div>
      `;
    }
    ); 
    $('.js-view').html(item);
  },

  _renderForm: function(className, id = null){
  /**
     * These should come from a possible endpoint listing valid combinations
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

    $('.js-view').html(editTemplate);
    $('.js-view > form#edit').find('.js-title').val(item.name);
    $('.js-view > form#edit').find('.js-image').val(item.image);
    $('.js-view > form#edit .js-type option[value='+item.type+']').attr('selected', 'true');
    $('.js-view > form#edit').find('.js-description').val(item.description);
  },

  claimItem: function(item) {
    const createTemplate = this._renderForm('create');
    $('.js-view').html(createTemplate);
  },
  
};

$(() =>{
  // Do stuff here e.g. call api.welcome()
  api.welcome().then(response => render.welcome(response));
  api.listUsers();
  render.userContextSwitcher();
  render.view();
});

/*

var render = {

  page: function (store) {
    if (demo) {
      $('.view').css('background-color', 'gray');
      $('#' + store.view).css('background-color', 'white');
    } else {
      $('.view').hide();
      $('#' + store.view).show();
    }
  },

  results: function (store) {
    const listItems = store.list.map((item) => {
      let tags = [];
      if (item.tags) {
        tags = item.tags.map(tag => {
          return `<li>${tag.name}</li>`;
        });
      }

      return `<li id="${item.id}">
                <a href="${item.url}" class="detail">${item.title}</a> <span>by: ${item.author}</span>
                <ul class="tags">Tags: ${tags.length?tags.join(''):'None'}</ul>
              </li>`;
    });
    $('#result').empty().append('<ul>').find('ul').append(listItems);
  },

  edit: function (store) {
    const el = $('#edit');
    const item = store.item;
    const userOptions = store.users.map((user) => {
      return `<option value="${user.id}">${user.username}</option>`;
    });
    el.find('select[name=author]').empty().append('<option>Select an Author</option>').append(userOptions);

    let tagOptions = [];
    if (store.tags.length) {
      tagOptions = store.tags.map((tag) => {
        return `<option value="${tag.id}">${tag.name}</option>`;
      });
      el.find('select[name=tags]').empty().append(tagOptions);
    }

    let selectedTags = [];
    if (store.tags && item.tags) {
      selectedTags = item.tags.map(tag => tag.id);
      el.find('select[name=tags]').val(selectedTags);
    }

    el.find('[name=title]').val(item.title);
    el.find('[name=author]').val(item.authorId);
    el.find('[name=content]').val(item.content);

  },

  detail: function (store) {
    const el = $('#detail');
    const item = store.item;
    el.find('.title').text(item.title);
    el.find('.author').text(item.author);

    let tags = [];
    if (item.tags) {
      tags = item.tags.map(tag => {
        return `<li>${tag.name}</li>`;
      });
    }
    if (tags.length) {
      el.find('.tags').empty().append('<ul>').find('ul').append(tags);
    }
    el.find('.content').text(item.content);
  },

  create: function (store) {
    const el = $('#create');
    const userOptions = store.users.map((user) => {
      return `<option value="${user.id}">${user.username}</option>`;
    });
    el.find('select[name=author]').empty().append('<option>Select an Author</option>').append(userOptions);

    let tagOptions = [];
    if (store.tags.length) {
      tagOptions = store.tags.map((tag) => {
        return `<option value="${tag.id}">${tag.name}</option>`;
      });
      el.find('select[name=tags]').empty().append(tagOptions);
    }

  }

};
*/