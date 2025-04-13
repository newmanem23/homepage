function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

/*====== Header Mobile Menu functionality Start ======*/

function toggle_menu() {
    // debugger;
    var navBar = document.getElementsByClassName('header-menu')[0];
    var menuIcon = document.getElementsByClassName('icon')[0];
    var menuCloseIcon = document.querySelector('.nav-main-bar .mobile-close')
    var getBody = document.body;
    var mobilMenuBtn = document.querySelector('.mobile-menu-block .mobile-menu')

    if (navBar && !hasClass(navBar, 'show') && window.innerWidth <= 1024) {
        menuIcon.classList.remove('icon-menu-1');
        getBody.classList.add('move-left');
        menuCloseIcon.classList.add("show");
        navBar.classList.add("show");
        navBar.classList.add('mobile-menu-move');
        mobilMenuBtn.setAttribute('aria-expanded','true');
        mobilMenuBtn.classList.add('hide-focus');
        navBar.focus();
        // menuIcon.childElementCount
        // getBody.style.overflow = 'hidden';
        // navBar.setAttribute('tabindex','2');
    } else {
        menuIcon.classList.add('icon-menu-1');
        getBody.classList.remove('move-left');
        menuCloseIcon.classList.remove("show");
        navBar.classList.remove("show");
        document.querySelector('.mobile-menu').focus();
        navBar.classList.remove('mobile-menu-move');
        mobilMenuBtn.setAttribute('aria-expanded','false');
        mobilMenuBtn.classList.remove('hide-focus');
        // navBar.removeAttribute('tabindex','');
        // getBody.style.overflow = '';
    }
}

/*====== Header Mobile Menu functionality End ======*/
function dropDown(){
    var DropDownBtn = document.getElementsByClassName('subnav-dropdown')[0];
    var dropDownListParent = document.getElementsByClassName('drop-down')[0];
    var subMenuNav = document.getElementsByClassName('sub-navigation')[0];
    if(DropDownBtn && subMenuNav.classList.contains('show') == true ){
        dropDownListParent.classList.remove('active');
        DropDownBtn.setAttribute('aria-expanded','false');
        subMenuNav.classList.remove('show');
        subMenuNav.setAttribute('aria-hidden','true');
    }
    else{
        dropDownListParent.classList.add('active');
        DropDownBtn.setAttribute('aria-expanded','true');
        subMenuNav.classList.add('show');
        subMenuNav.setAttribute('aria-hidden','false');
    }
}
//to hide dropdown click outside
function persona_focuse_close_menu(){
    dropDown();
}
window.onload = navigationActive();
function navigationActive(){
    var getUrlLocation = window.location.href;
    var getCurrentPage = getUrlLocation.split(phApp.baseUrl)[1];
    var getHeader = document.querySelector('.ph-header');
    var getPageAnchor = getHeader.querySelector('[data-ph-href="'+getCurrentPage+'"]');
    // sticky header styles
    
    if(!getPageAnchor){
        getPageAnchor = getHeader.querySelector('[ph-href="'+getCurrentPage+'"]');
    }
    
    if(getPageAnchor){
        getPageAnchor.parentElement.classList.add('active');
        var getBtnMenu=getPageAnchor.parentElement.parentElement.previousElementSibling;
        if(getBtnMenu){
            if(getBtnMenu.nodeName == "BUTTON"){
                getBtnMenu.classList.add('active');
            }            
        }
    }
    document.addEventListener( "click", function(e){
        var getHeader = document.querySelector('.ph-header');
        var getSubNavDropDown = getHeader.querySelector('.subnav-dropdown');
        // var personaNavBar = document.querySelector('.ph-navigation .persona-navbar') ;
        var getSubmenu = getHeader.querySelector('.drop-down .sub-navigation');
        var currentTartget = e.target;
        var getAttribute = currentTartget.getAttribute("data-ph-id");
        var isButtonEle = getSubNavDropDown.querySelector('[data-ph-id="'+getAttribute+'"]') || (getSubNavDropDown.getAttribute("data-ph-id") ==  getAttribute) || getSubmenu.querySelector('[data-ph-id="'+getAttribute+'"]');
        
       if(!isButtonEle){
            if(getSubmenu.classList.contains('show')){
                getSubmenu.classList.remove('show');
                getSubmenu.parentElement.classList.remove('active');
                // getSubmenu.classList.add('hide');
            }
            else{
                // getSubmenu.classList.remove('hide');
            }
        }
        return true;
    })
}
function acceptGdpr (getGdprAccept){
    
}

// auto header top value using gdpr height
document.addEventListener('DOMContentLoaded', function (){
    var getSkiptContent=document.getElementById('skip-content');
    var getPhpageEle=document.querySelector('.ph-page');
    var getFooterEle=document.querySelector('footer');
    if(getFooterEle){
        getFooterEle.setAttribute('role','contentinfo');
    }
    setTimeout(function(){
        var getCockiePopUpStyle = document.querySelector('.cookie-popup-top');
        var getGdprAccept = document.querySelector('.cookie-button-area button');
        if(getCockiePopUpStyle){
            var getCookiePaddingTop = getCockiePopUpStyle.style.paddingTop;
        }
        var navBar = document.getElementsByClassName('header-menu')[0];
        var getHeroBlack = document.querySelector('.hero-block');
        if(getCookiePaddingTop){
            getHeroBlack.style.top = getCookiePaddingTop;
            navBar.style.top = getCookiePaddingTop;
            if(getGdprAccept){
                getGdprAccept.addEventListener( "click", function (e, getGdprAccept){
                    var getCurrentTartget = e.target.parentElement;
                    var getHeroBlack = document.querySelector('.hero-block');
                    var navBar = document.getElementsByClassName('header-menu')[0];
                    if(getCurrentTartget){
                        getHeroBlack.style.top ="";
                        navBar.style.top = "";
                    }
                });
            }
        }
        else{
            getHeroBlack.style.top="";
            navBar.style.top = "";
        }
        navigationActive();
    }, 3000)
    // skip to main
    if(getSkiptContent){
        document.getElementById('skip-content').addEventListener('focus',function(){
            document.querySelector('.skip-main').style.height="40px";
            });
        document.getElementById("skip-content").addEventListener("focusout", function(){
            document.querySelector('.skip-main').style.height="auto";
        });
    }
    setTimeout(function(){
        if(getPhpageEle.getAttribute('role','main') == true){
            getPhpageEle.removeAttribute('role','main')
        }else{
            getPhpageEle.setAttribute('role','main')
        }
    },500);
    // skip to main end
    });
// gdpr close header top moving

document.addEventListener('DOMContentLoaded', setFocus(500));
function setFocus(setTime) {
    setTimeout(function() {
        var getHeaderLogo = document.querySelector('.nav-main-bar .mobile-logo a');
        if (getHeaderLogo) {
            getHeaderLogo.addEventListener('focus', function() {
                if (window.innerWidth <= 1024) {
                    if (document.querySelector('.nav-main-bar .nav').classList.contains('show') == true) {
                        toggle_menu();
                    }
                }
            })
        }else{
            setFocus(500)
        }

    }, setTime);
}

// Handling Multiple Main Regions
document.addEventListener('DOMContentLoaded', function() {
    var getPhpageEle=document.querySelector('.ph-page');
 
	setTimeout(function(){
		var removeRole = document.querySelector('.ph-component-cntr.ph-widget-box');
		var removeRoleInJd = document.querySelector('.banner-block');
		var removeRoleInTestimonialSlider = document.querySelector('.ph-container-content-block.ph-static-slider');
		var removeHeadingRoleInTestimonialSlider = document.querySelector('.ph-component-cntr.ph-widget-box');
	
		if(getPhpageEle){
            getPhpageEle.setAttribute('role','main');
            getPhpageEle.setAttribute('id','acc-skip-content');
		}
		if(removeRole){
			removeRole.removeAttribute('role');
		}
		if(removeRoleInJd){
			removeRoleInJd.removeAttribute('role');
		}
		if(removeRoleInTestimonialSlider){
			removeRoleInTestimonialSlider.firstElementChild.removeAttribute('role');
		}
		if(removeHeadingRoleInTestimonialSlider){
			removeHeadingRoleInTestimonialSlider.removeAttribute('role');
		}
		
	},500);
    
});
//candidate profile update
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function applyUrl() {
    // var url_string = window.location.href;
    //var url = new URL(url_string);
    var c = getParameterByName("candidateHomeUrl");
    // window.location.href = c;
    window.open(c, '_blank')
}
