$(document).ready(function(){
    adrbook.listContacts();
    adrbook.listFavorites();
    $(".js-openModal").click(function(){
        adrbook.openModal();
    });
    $(".js-closeModal").click(function(){
        adrbook.closeModal();
    });
});
var adrbook = (function() {
    var dmodal = $(".bgmodal");
    var listcontacts = "";
    var listfavs = localStorage.getItem("adrbfavorites");
    var searchContact = function(id) {
        var cnt = {
            id:0,nombre:"",twitter:"",email:"",telefono:"",
            direccion:"",funcion:"createContact()",modify:false,startype:"textlgray"
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
					cnt.funcion = "editContact("+elem[0]+")";
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
                direccion:"",funcion:"createContact()",modify:false,startype:"textlgray"
            };
        }
        else{
            source = $("#wmodal-template").html();
            contx = datos;
        }
        var template = Handlebars.compile(source);
        $(".wmodal").html(template(contx));
        dmodal.show();
    };
    var hideModal = function() {
        dmodal.hide();
    };
    var addToFavorite = function(id,elem){
        var flist = "";
        var nuevo = false;
        var element = $(elem);
        if(element.hasClass("textyellow")){
            element.removeClass("textyellow");
            element.addClass("textlgray");
            var afavs = (listfavs+"").split("|");
			$.each(afavs,function(i2,v){
				if(id!=v){
					if(i2>0) flist += "|";
					flist += v;
				}
			});
            if(flist=="") localStorage.removeItem("adrbfavorites");
            else localStorage.setItem("adrbfavorites",flist);
            listfavs = flist;
            setTimeout(function () {
                viewFavorites();
                viewContacts();
            },500);
        }
        else{
            if(!listfavs){
                listfavs = id;
                nuevo = true;
            }
            else listfavs += "|"+id;
            localStorage.setItem("adrbfavorites",listfavs);
            element.addClass("textyellow");
            var divcnt = $(".maincontent__favorites .contact-list");
            var ctmpl = $("#contact-template");
            if(nuevo) divcnt.html("");
            var source = ctmpl.html();
            var template = Handlebars.compile(source);
            var cnt = searchContact(id);
            divcnt.append(template(cnt));
            setTimeout(function () {
                bindClickStars();
            },500);
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
        localStorage.setItem("contacts",lc);
        Lobibox.notify('success',{
            size: 'mini', rounded: true,
            msg:"Contacto agregado!"
        });
        hideModal();
        var cnt = {
            id:nxtid,nombre:nombre,twitter:twitter,
            email:email,telefono:telefono,direccion:direccion,
            funcion:"viewContact("+nxtid+")",modify:true,startype:"textlgray"
        };
        var divcnt = $(".maincontent__contacts .contact-list");
        var ctmpl = $("#contact-template");
        if(cnt.id==1) divcnt.html("");
        var source = ctmpl.html();
        var template = Handlebars.compile(source);
        divcnt.append(template(cnt));
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
        if(flist=="") localStorage.removeItem("contacts");
        else {
            listcontacts = flist;
            localStorage.setItem("contacts",flist);
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
        listcontacts = localStorage.getItem("contacts");
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
        }
        else{
            var source = $("#nocontacts-template").html();
            var template = Handlebars.compile(source);
            divcnt.html(template());
        }
    };
    var bindClickStars = function() {
        $(".icon-star-full").click(function(){
            var id = $(this).data("id");
            addToFavorite(id,this);
        });
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
    };
})();
/*
//Testing only:
localStorage.setItem("contacts","1;Maria;@mariagal;maria@mail.com;+573103000000;Anywhere;0");
localStorage.setItem("adrbfavorites","1");
console.log(localStorage.getItem("adrbfavorites"));
localStorage.removeItem("contacts");
localStorage.removeItem("adrbfavorites");
*/
