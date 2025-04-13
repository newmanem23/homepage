            function IEdetection() { 
                var ua = window.navigator.userAgent; 
                var msie = ua.indexOf('MSIE '); 
                if (msie > 0) { 
                    // IE 10 or older, return version number 
                    return ('IE ' + parseInt(ua.substring( 
                      msie + 5, ua.indexOf('.', msie)), 10)); 
                } 
                var trident = ua.indexOf('Trident/'); 
                if (trident > 0) { 
                    // IE 11, return version number 
                    var rv = ua.indexOf('rv:'); 
                    return ('IE ' + parseInt(ua.substring( 
                      rv + 3, ua.indexOf('.', rv)), 10)); 
                } 
                
                // User uses other browser 
                return ('Not IE'); 
            } 
            var result = IEdetection(); 
            if(result != 'Not IE'){
                alert('This browser is not supported'); 
            }