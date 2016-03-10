$(document).ready(function(){
    adrbook.listContacts();
    adrbook.listFavorites();
    $(".js-openModal").off("click");
    $(".js-openModal").on("click",function(){
        adrbook.openModal();
    });
});
var adrbook = (function() {
    var dmodal = $(".bgmodal");
    var listcontacts = "";
    var listfavs = localStorage.getItem("adrbfavorites");
    var searchContact = function(id) {
        var cnt = {
            id:0,nombre:"",twitter:"",email:"",telefono:"",
            direccion:"",modify:false,startype:"textlgray"
        };
        if(listcontacts){
            var lst = listcontacts.split("|");
            for(i=0;i<lst.length;i++){
                var elem = lst[i].split(";");
                if(id==elem[0]){
                    var isfavo = isFavorite(elem[0]);
                    cnt.id = elem[0];
                    cnt.nombre = elem[1];
                    cnt.twitter = elem[2];
                    cnt.email = elem[3];
                    cnt.telefono = elem[4];
                    cnt.direccion = elem[5];
                    cnt.modify = true;
                    cnt.startype = isfavo?"textyellow":"textlgray";
				}
			}
        }
        return cnt;
    }
    var viewEditModal = function(id) {
        var usr = searchContact(id);
        showModal(usr);
    };
    var showModal = function(datos) {
        $(".wmodal").html("");
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
        dmodal.fadeIn();
        bindCloseModal();
        addToFavoriteBtn();
        bindCreateContact();
        bindUpdateContact();
        bindRemoveContact();
    };
    var hideModal = function() {
        dmodal.fadeOut();
    };
    var addToFavorite = function(id,elem){
        var flist = "";
        var nuevo = false;
        var element = $(elem);
        var isfavo = isFavorite(id);
        if(isfavo){
            element.removeClass("textyellow");
            element.addClass("textlgray");
            var afavs = (listfavs+"").split("|");
			$.each(afavs,function(i2,v){
				if(id!=v){
					if(i2>0) flist += "|";
					flist += v;
				}
			});
            listfavs = flist;
            localStorage.setItem("adrbfavorites",listfavs);
            viewFavorites();
            viewContacts();
        }
        else{
            if(!listfavs){
                listfavs = id;
                nuevo = true;
            }
            else listfavs += "|"+id;
            localStorage.setItem("adrbfavorites",listfavs);
            element.removeClass("textlgray");
            element.addClass("textyellow");
            var divcnt = $(".maincontent__favorites .contact-list");
            var ctmpl = $("#contact-template");
            if(nuevo) divcnt.html("");
            var source = ctmpl.html();
            var template = Handlebars.compile(source);
            var cnt = searchContact(id);
            divcnt.append(template(cnt));
            viewContacts();
        }
    };
    var isFavorite = function(id){
        var isf = false;
        var listfvs = listfavs;
        if(listfvs){
            var lst = (listfvs+"").split("|");
            for(var i=0;i<lst.length;i++){
                if(id==lst[i]) isf = true;
            }
        }
        return isf;
    };
    var addContact = function() {
        var nxtid = countContacts() + 1;
        var lc = "";
        var nombre = $.trim($("#nombre").val());
        var twitter = $.trim($("#twitter").val());
        var email = $.trim($("#email").val());
        var telefono = $.trim($("#telefono").val());
        var direccion = $.trim($("#direccion").val());
        if(listcontacts!="" && listcontacts!=null){
            lc = listcontacts;
            lc += "|";
        }
        lc += nxtid+";"+nombre+";"+twitter+";"+email+";"+telefono+";"+direccion;
        listcontacts = lc;
        localStorage.setItem("adrbcontacts",lc);
        Lobibox.notify('success',{
            size: 'mini', rounded: true,
            msg:"Contacto agregado!"
        });
        hideModal();
        var cnt = {
            id:nxtid,nombre:nombre,twitter:twitter,
            email:email,telefono:telefono,direccion:direccion,
            modify:true,startype:"textlgray"
        };
        var divcnt = $(".maincontent__contacts .contact-list");
        var ctmpl = $("#contact-template");
        if(cnt.id==1) divcnt.html("");
        var source = ctmpl.html();
        var template = Handlebars.compile(source);
        divcnt.append(template(cnt));
        bindClickStars();
        bindviewContact();
    };
    var updateContact = function(id) {
        var nombre = $.trim($("#nombre").val());
        var twitter = $.trim($("#twitter").val());
        var email = $.trim($("#email").val());
        var telefono = $.trim($("#telefono").val());
        var direccion = $.trim($("#direccion").val());
        var alcont = (listcontacts+"").split("|");
        var flist = "";
        $.each(alcont,function(i2,v){
            var vx = v.split(";");
            if(i2>0) flist += "|";
            if(id!=vx[0]) flist += v;
            else flist += id+";"+nombre+";"+twitter+";"+email+";"+telefono+";"+direccion;
        });
        if(flist=="") localStorage.removeItem("adrbcontacts");
        else {
            listcontacts = flist;
            localStorage.setItem("adrbcontacts",flist);
        }
        Lobibox.notify('success',{
            size: 'mini', rounded: true,
            msg:"Datos actualizados!"
        });
        hideModal();
        viewContacts();
        viewFavorites();
    };
    var countContacts = function(){
        var cant = 0;
        if(listcontacts){
            var lst = listcontacts.split("|");
            cant = lst.length;
        }
        return cant;
    };
    var viewContacts = function() {
        var divcnt = $(".maincontent__contacts .contact-list");
        var ctmpl = $("#contact-template");
        divcnt.html("");
        var cnt = {id:0,nombre:"",twitter:"",email:"",telefono:"",direccion:"",funcion:"createContact()",modify:false,startype:"textlgray"};
        listcontacts = localStorage.getItem("adrbcontacts");
        if(listcontacts){
            var lst = listcontacts.split("|");
            var source = ctmpl.html();
            var template = Handlebars.compile(source);
            for(var i=0;i<lst.length;i++){
                var elem = lst[i].split(";");
                var isfavo = isFavorite(elem[0]);
                cnt.id = elem[0];
                cnt.nombre = elem[1];
                cnt.twitter = elem[2];
                cnt.email = elem[3];
                cnt.telefono = elem[4];
                cnt.direccion = elem[5];
                cnt.funcion = "viewContact("+elem[0]+")";
                cnt.modify = true;
                cnt.startype = isfavo?"textyellow":"textlgray";
                divcnt.append(template(cnt));
			}
            bindClickStars();
            bindviewContact();
        }
        else {
            var source = $("#nocontacts-template").html();
            var template = Handlebars.compile(source);
            divcnt.html(template());
        }
    };
    var viewFavorites = function() {
        var divcnt = $(".maincontent__favorites .contact-list");
        var ctmpl = $("#contact-template");
        divcnt.html("");
        if(listfavs) {
            var lst = (listfavs+"").split("|");
            var source = ctmpl.html();
            var template = Handlebars.compile(source);
            for(var i=0;i<lst.length;i++){
                var cnt = searchContact(lst[i]);
                divcnt.append(template(cnt));
			}
            bindClickStars();
            bindviewContact();
        }
        else{
            var source = $("#nocontacts-template").html();
            var template = Handlebars.compile(source);
            divcnt.html(template());
        }
    };
    var bindClickStars = function() {
        $(".icon-star-full").off("click");
        $(".icon-star-full").on("click",function(){
            var id = $(this).data("id");
            addToFavorite(id,this);
        });
    };
    var bindCloseModal = function() {
        $(".js-closeModal").off("click");
        $(".js-closeModal").on("click",function(){
            hideModal();
        });
    };
    var addToFavoriteBtn = function() {
        $(".js-addFavorite").off("click");
        $(".js-addFavorite").on("click",function(){
            var id = $(this).data("id");
            addToFavorite(id,this);
        });
    };
    var bindUpdateContact = function() {
        $(".js-saveButton").off("click");
        $(".js-saveButton").on("click",function(){
            var id = $(this).data("id");
            updateContact(id);
        });
    };
    var bindCreateContact = function() {
        $(".js-createContact").off("click");
        $(".js-createContact").on("click",function(){
            addContact();
        });
    };
    var bindRemoveContact = function () {
        $(".js-deleteContact").off("click");
        $(".js-deleteContact").on("click",function(){
            var id = $(this).data("id");
            removeContact(id);
        });
    };
    var bindviewContact = function () {
        $(".js-viewContact").off("click");
        $(".js-viewContact").on("click",function(){
            var id = $(this).data("id");
            viewEditModal(id);
        });
    };
    var removeContact = function(id) {
        var alcont = (listcontacts+"").split("|");
        var flist = "";
        var idn = 1;
        $.each(alcont,function(i2,v){
            var vx = v.split(";");
            if(id!=vx[0]){
                if(i2>0) flist += "|";
                flist += idn+";"+vx[1]+";"+vx[2]+";"+vx[3]+";"+vx[4]+";"+vx[5];
                idn++;
            }
        });
        console.log(flist);
        listcontacts = flist;
        localStorage.setItem("adrbcontacts",listcontacts);
        Lobibox.notify('success',{
            size: 'mini', rounded: true,
            msg: "Contacto eliminado!"
        });
        var isfavo = isFavorite(id);
        if(isfavo) addToFavorite(id);
        else{
            viewContacts();
            viewFavorites();
        }
        hideModal();
    }
    return{
        addFavorite: addToFavorite,
        viewContact: viewEditModal,
        openModal: showModal,
        closeModal: hideModal,
        createContact: addContact,
        editContact: updateContact,
        listContacts: viewContacts,
        listFavorites: viewFavorites,
        deleteContact: removeContact
    };
})();
/*
//Testing only:
localStorage.setItem("adrbcontacts","1;Maria;@mariagal;maria@mail.com;+573103000000;Anywhere;0");
localStorage.setItem("adrbfavorites","1");
console.log(localStorage.getItem("adrbfavorites"));
localStorage.removeItem("adrbcontacts");
localStorage.removeItem("adrbfavorites");
*/
//localStorage.removeItem("adrbcontacts");
//console.log(localStorage.getItem("adrbcontacts"));
