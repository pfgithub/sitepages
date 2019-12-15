

function loadImageAsync(url, callback){
  var imageObj = new Image();
  imageObj.onload = function() {
    callback(imageObj);
  };
  imageObj.src = url;
}

$(function() {
    Origami.fastclick(document.body);
});




    