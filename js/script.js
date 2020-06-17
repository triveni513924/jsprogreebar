//Consume data
function getJSON(url) {
        var resp ;
        var xmlHttp ;

        resp  = '' ;
        xmlHttp = new XMLHttpRequest();
       if(xmlHttp != null)
        {
            xmlHttp.open( "GET", url, false );
            xmlHttp.send( null );
            resp = xmlHttp.responseText;
        }

        return resp ;
}

//API Endpoint
var jdata = JSON.parse(getJSON( 'https://pb-api.herokuapp.com/bars' ));

console.log(jdata);

//Data
var Allbars = jdata.bars, //Bars and default value
    maxProgress = jdata.limit,  //Progress bar max value
    buttons = jdata.buttons; //Buttons 

/*
* Create Progress bars 
* Parameters:
*   bars - Progress bar data ( length, default value )
*   buttons - Buttons ( length, increments/decrements )
*/
function createBars(bars, buttons){
    var barElem = '',
        defaultValue = 0,
        progRate = 0;

   for(i=1; i<=bars.length ; i++){
        defaultValue = bars[i-1];
        progRate = Math.floor((defaultValue/maxProgress)*100);
        barElem += '<div id="progress-'+i+'" class="progress-bars" data-progress="'+defaultValue+'" data-percent="'+ progRate +'"><div class="progress-rate" style="width:'+progRate+'%;"></div><span>'+progRate+'%</span></div>';
   
    }

    //Remove preloader and show progress bar
    document.getElementById("selector").classList.remove("hidden");
    document.getElementById("preload").remove();

   document.getElementById("Allbars").innerHTML = barElem;

   //Create Buttons
   createButtons(buttons);

    //Create Selectors   
    createSelectors(bars.length);

}

/*
* Create dropdown for progress bar
* Parameters:
*   id - Prgress bar element ID
*/
function createSelectors(bar){
    var selector = '';

    for(i=1; i<=bar ; i++){
        selector += ( i == 1 ) ? '<option selected="selected"' : '<option';
        selector += ' value="progress-'+ i +'">Progress Bar '+ i +'</option>';
    }

    document.getElementById("selector").innerHTML=selector;

}


/*
*Create button increment/decrement for progress bar
* Parameters:
*   buttons - Length and values
*/
function createButtons(buttons){
    var buttonElem = '';

   for(i=1; i<=buttons.length ; i++){
        defaultValue = buttons[i-1];
        buttonElem += '<button type="button" value="'+defaultValue+'">'+defaultValue+'</button>';
    }

    document.getElementById("buttons").innerHTML = buttonElem;

}

/*
* Change progress of progress bar
* Parameters:
*   progID - Progress Bar ID
*   inc    - Increment/Decrement value from button
*/
function updateProgressBar(progID,inc){
    var defaultValue,
        newNum,
        prevNum,
        newProg = 0,
        newProgRate = 0,
        max = parseInt(maxProgress),
        nProg = 0,
        addClass;

   prevNum = parseInt(document.getElementById(progID).getAttribute("data-percent"));
   defaultValue = parseInt(document.getElementById(progID).getAttribute("data-progress"));
   newNum = defaultValue + parseInt(inc);
   newProg = Math.floor((newNum/max)*100);

   if( newProg < 0 ){
        nProg = 0;
        newProgRate = 0;

   }else if( newProg > 100 ){
        nProg = 100;
        newProgRate = newProg;
        addClass = 'overlimit';
   }else{
        nProg = newProg;
        newProgRate = newProg;
   }

   document.getElementById(progID).setAttribute("data-progress", newNum);
   document.getElementById(progID).setAttribute("data-percent", newProgRate);
   document.getElementById(progID).getElementsByClassName('progress-rate')[0].style.width = nProg+'%';
   document.getElementById(progID).children[1].innerHTML = newProgRate+'%';
   
   if( addClass ){
        document.getElementById(progID).getElementsByClassName('progress-rate')[0].classList.add( addClass );
   }else{
        document.getElementById(progID).getElementsByClassName('progress-rate')[0].classList.remove("overlimit");
   }

}

/*
* Change progress of progress bar on click and change events
*
*/

document.getElementById("buttons").addEventListener("click", function(e){

    if(e.target.tagName == "BUTTON"){

        var selectedBar = document.getElementById("selector"),
            cbutton = e.target.value;

        //Update progress bar
        updateProgressBar(selectedBar.options[selectedBar.selectedIndex].value, cbutton);

    }

});

document.querySelector('select').addEventListener("change", function(e){

console.log(document.getElementById("selector").options);
    var selectedBar = document.getElementById("selector");

    selectedBar.options[selectedBar.options.selectedIndex].selected = true;

});


/*
* Load script
*/

window.onload = function(){
    createBars(jdata.bars, jdata.buttons);
};

