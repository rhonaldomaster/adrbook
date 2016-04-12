$(document).ready(function(){
    adrbook.init();
    adrbook.listContacts();
    adrbook.listFavorites();
    $(".js-openModal").off("click").on("click",function(){
        adrbook.openModal();
    });
});
var adrbook = (function () {
  var contacts = null;
  var init = function () {
    contacts = localStorage.getItem("adrbcontacts");
    if(contacts) contacts = JSON.parse(contacts);
    searchFavorites();
  };
  var renderContact = function (cnt) {
    var $ctmpl = $("#contact-template");
    var source = $ctmpl.html();
    var template = Handlebars.compile(source);
    var html = template(cnt);
    return html;
  };
  var isFavorite = function(id){
    var isf = false;
    if(contacts){
      $.each(contacts,function (ixd,obj) {
        if(obj!= null && obj.id==id && obj.startype=="textyellow") isf = true;
      });
    }
    return isf;
  };
  var searchFavorites = function () {
    var favorites = [];
    if(contacts){
      $.each(contacts,function (ixd,obj) {
        if(obj.startype=="textyellow") favorites.push(obj);
      });
    }
    return favorites;
  };
  var countContacts = function(){
    return contacts.length;
  };
  var saveContacts = function () {
    var strc = JSON.stringify(contacts);
    localStorage.setItem("adrbcontacts",strc);
  };
  var listContactsType = function (div,arrContacts) {
    var $divcnt = $(div);
    $divcnt.html("");
    $.each(arrContacts,function (ixd,obj) {
      var isf = isFavorite(obj.id);
      if(isf) obj.startype = "textyellow";
      var cnthtml = renderContact(obj);
      $divcnt.append(cnthtml);
    });
    bindviewContact();
    bindClickStars();
  };
  var setEmptyContacts = function (div) {
    var source = $("#nocontacts-template").html();
    var template = Handlebars.compile(source);
    $(div).html(template());
  };
  var createContact = function () {
    var nombre = $.trim($("#nombre").val());
    var twitter = $.trim($("#twitter").val());
    var email = $.trim($("#email").val());
    var telefono = $.trim($("#telefono").val());
    var direccion = $.trim($("#direccion").val());
    var nxtid = countContacts() + 1;
    var cnt = {
      "id":nxtid,"nombre":nombre,"twitter":twitter,
      "email":email,"telefono":telefono,"direccion":direccion,
      "modify":"true","startype":"textlgray"
    };
    contacts.push(cnt);
    saveContacts();
    bindClickStars();
    bindviewContact();
    closeModal();
  };
  var closeModal = function() {
    $(".bgmodal").fadeOut();
  };
  var searchContact = function (id) {
    var contact = null;
    $.each(contacts,function (ixd,obj) {
      if(id==obj.id) contact = obj;
    });
    return contact;
  };
  var addFavorite = function(id,elem){
    var $element = $(elem);
    $.each(contacts,function (ixd,obj) {
      if(obj.id==id){
        if(obj.startype == "textyellow"){
          contacts[ixd].startype = "textlgray";
          $element.removeClass("textyellow").addClass("textlgray");
        }
        else {
          contacts[ixd].startype = "textyellow";
          $element.removeClass("textlgray").addClass("textyellow");
        }
      }
    });
    listFavorites();
    listContacts();
  };
  var listContacts = function () {
    if(contacts.length) listContactsType(".maincontent__contacts .contact-list",contacts);
    else setEmptyContacts(".maincontent__contacts .contact-list");
  };
  var listFavorites = function () {
    var listfvs = searchFavorites();
    if(listfvs.length) listContactsType(".maincontent__favorites .contact-list",listfvs);
    else setEmptyContacts(".maincontent__favorites .contact-list");
  };
  var viewContact = function (id) {
    var usr = searchContact(id);
    openModal(usr);
  };
  var openModal = function(datos) {
    var source = "";
    var contx = "";
    if(typeof datos === "undefined"){
      source = $("#wmodal-template-create").html();
      contx = {
        id:0,nombre:"",twitter:"",email:"",telefono:"",
        direccion:"",modify:false,startype:"textlgray"
      };
    }
    else{
      source = $("#wmodal-template").html();
      contx = datos;
    }
    var template = Handlebars.compile(source);
    $(".wmodal").html(template(contx));
    $(".bgmodal").fadeIn();
    bindCloseModal();
    addToFavoriteBtn();
    bindCreateContact();
    bindUpdateContact();
    bindRemoveContact();
  };
  var editContact = function(id) {
      var nombre = $.trim($("#nombre").val());
      var twitter = $.trim($("#twitter").val());
      var email = $.trim($("#email").val());
      var telefono = $.trim($("#telefono").val());
      var direccion = $.trim($("#direccion").val());
      $.each(contacts,function (ixd,obj) {
        if(id==obj.id){
          contacts[ixd] = {
            "id":id,"nombre":nombre,"twitter":twitter,
            "email":email,"telefono":telefono,"direccion":direccion,
            "modify":obj.modify,"startype":obj.startype
          };
        }
      });
      Lobibox.notify('success',{
        size: 'mini', rounded: true,
        msg:"Datos actualizados!"
      });
      saveContacts();
      closeModal();
      listContacts();
      listFavorites();
  };
  var deleteContact = function (id) {
    $.each(contacts,function (ixd,obj) {
      if(id==obj.id) contacts.splice(ixd,1);
    });
    saveContacts();
    listContacts();
    listFavorites();
    closeModal();
  };
  var bindClickStars = function() {
    $(".icon-star-full").off("click").on("click",function(){
      addFavorite($(this).data("id"),this);
    });
  };
  var bindCloseModal = function() {
    $(".js-closeModal").off("click").on("click",function(){
      closeModal();
    });
  };
  var addToFavoriteBtn = function() {
    $(".js-addFavorite").off("click").on("click",function(){
      addFavorite($(this).data("id"),this);
    });
  };
  var bindUpdateContact = function() {
    $(".js-saveButton").off("click").on("click",function(){
      editContact($(this).data("id"));
    });
  };
  var bindCreateContact = function() {
    $(".js-createContact").off("click").on("click",function(){
      createContact();
    });
  };
  var bindRemoveContact = function () {
    $(".js-deleteContact").off("click");
    $(".js-deleteContact").on("click",function(){
      deleteContact($(this).data("id"));
    });
  };
  var bindviewContact = function () {
    $(".js-viewContact").off("click").on("click",function(){
      viewContact($(this).data("id"));
    });
  };
  return{
    init: init,
    listContacts: listContacts,
    listFavorites: listFavorites,
    addFavorite: addFavorite,
    editContact: editContact,
    viewContact: viewContact,
    openModal: openModal,
    closeModal: closeModal,
    createContact: createContact,
    deleteContact: deleteContact
  };
})();
//localStorage.setItem("adrbcontacts",'[{"id":"1","nombre":"Maria","twitter":"@mariagal","email":"maria@mail.com","telefono":"+573103000000","direccion":"Anywhere","modify":"true","startype":"textlgray"}]');
//localStorage.removeItem("adrbcontacts");
//"[{id:1,nombre:'Maria',twitter:'@mariagal',email:'maria@mail.com',telefono:'+573103000000',direccion:'Anywhere',modify:true,startype:'textlgray'}]"
//console.log(localStorage.getItem("adrbcontacts"));
