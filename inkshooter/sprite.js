function Sprite(img, x, y, hp){
  this.x = x;
  this.y = y;
  this.hp = hp;
  if(typeof img == 'string'){
    loadImageAsync(img, function(res){
      if(!this.w)this.w = res.width;
      if(!this.h)this.h = res.height;
      if(!this.cx)this.cx = Math.floor(this.w / 2);
      if(!this.cy)this.cy = Math.floor(this.h / 2);
      if(!this.bounds)this.updateBounds();
      this.img = res;
    }.bind(this));
  }else{
    this.w = img.width;
    this.h = img.height;
    this.img = img;
    if(!this.bounds)this.updateBounds();
  }
}

Sprite.prototype.updateBounds = function(){
  this.bounds = {left:this.x,top:this.y,right:this.w+this.x,bottom:this.h+this.y};
};

Sprite.prototype.isDead = function(){
  return this.hp <= 0;
};

Sprite.prototype.addHP = function(hp){
  this.hp += hp;
};

Sprite.prototype.setCenter = function(w, h){
  this.cx = w/2;this.cy = h/2;
  return this;
};

Sprite.prototype.setWidth = function(w){
  this.w = w;
  return this;
};

Sprite.prototype.setHeight = function(h){
  this.h = h;
  return this;
};

Sprite.prototype.setSize = function(w,h){
  if(h){
    this.setHeight(h);
  }else{
    this.setHeight(w);
  }
  this.setWidth(w);
  return this;
};

Sprite.prototype.addSize = function(n){
  this.setSize(this.w + n, this.h + n);
  return this;
};

Sprite.prototype.touching = function(r2){
  if(!this.bounds)this.updateBounds();
  if(r2){
    var r1 = this.bounds;
    if( !(r2.left > r1.right || 
           r2.right < r1.left || 
           r2.top > r1.bottom ||
           r2.bottom < r1.top)){
      return true;
    }
    return false;
  }
  return false;
};

Sprite.prototype.draw = function(ctx){
  this.updateBounds();
  if(this.img){
    ctx.drawImage(this.img,this.x - this.cx,this.y - this.cy, this.w, this.h);
  }else{
    ctx.fillRect(this.x - this.cx,this.y - this.cy, this.w, this.h);
  }
  return this;
};