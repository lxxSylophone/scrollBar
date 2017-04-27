/**
 * [zScroll description]
 * author:zhyp;
 * options={
 *   id: 'scroll',  //容器id
 *   containerHeight: 280, //容器高度
 *  hideBlock:true 是否隐藏滑块，//默认显示滑块
 *};
 */
function zScroll(options) {
  this.options = options || {};
  if (this.options.id) {
    this.container = document.getElementById(this.options.id);
    this.container.className=this.container.className+' z-scroll';
    if (this.options.containerHeight) {
      this.container.style.height = this.options.containerHeight + 'px'
    } else {
      this.options.containerHeight = this.container.offsetHeight;
    }
	if (this.options.containerWidth)
	{
		this.container.style.width=this.options.containerWidth+'px';
	}
	else
	{
		this.options.containerWidth=this.container.offsetWidth;
	}
    this.render(); //加载内容
    this.swiperPanel = this.container.children[1].children[0];//z-scroll-content
    this.shank = this.container.children[0]; //z-scroll-shank 滚动条
    this.h_shank=this.container.children[2]; //h-scroll-shank 
    this.swiperBlock = this.shank.children[0];//z-scroll-shank 滑块
     this.h_swiperBlock = this.h_shank.children[0];//横向滑块
    if (this.options.hideBlock) {
      this.shank.style.display = 'none';
      this.swiperPanel.parentNode.style.marginRight = 0;  //z-scroll-box
    } else {
      /** [if description]设置滑块宽度 */
      if (!isNaN(this.options.blockWidth)) {
        this.shank.style.width = (this.options.blockWidth + 2) + 'px'; //滚动条的大小
        this.swiperBlock.style.width = this.options.blockWidth + 'px'; //滑块的width
        this.swiperPanel.parentNode.style.marginRight = (this.options.blockWidth + 5) + 'px'; //z-scroll-box marginRight
      }
      if (!isNaN(this.options.blockHeight)) {
        this.h_shank.style.height = (this.options.blockHeight + 2) + 'px'; //滚动条的大小
        this.h_swiperBlock.style.height = this.options.blockHeight + 'px'; //滑块的width
      }
    }
    this.initBlockPosition();
  } else {
    console.log('add the id of element');
  }
};
/** [render description]渲染 */
zScroll.prototype.render = function() {
  var content = this.container.innerHTML;
  this.container.innerHTML = '<div class="z-scroll-shank"><span class="z-scroll-block"></span></div><div class="z-scroll-box"><div class="z-scroll-content">' + content + '</div></div><div class="h-scroll-shank"><span class="h-scroll-block"></span></div>';
};
/** [initBlockPosition description]初始化滑块位置 */
zScroll.prototype.initBlockPosition = function() {
  if (this.shank && this.swiperBlock) { 
    var shank_ht = this.shank.offsetHeight;
    if (!shank_ht) {
      shank_ht = this.options.containerHeight;  //设置滚动条的长度
    }
    this.swiperBlock.style.webkitTransform = 'translateY(-' + shank_ht + 'px)';
    this.swiperPanel.style.webkitTransform = 'translateY(0px) translateX(0px)';  //内容也的初始位置
    this.moveBlock(shank_ht);//移动滑块
  }

  if (this.h_shank && this.h_swiperBlock) { 
    var h_shank_wt = this.h_shank.offsetWidth;
    if (!h_shank_wt) {
      h_shank_wt = this.options.containerWidth;  //设置滚动条的长度
    }
    this.h_swiperBlock.style.webkitTransform = 'translateX(-' + h_shank_wt + 'px)';
    this.swiperPanel.style.webkitTransform = 'translateY(0px) translateX(0px)';  //内容也的初始位置
    this.moveBlock(h_shank_wt);//移动滑块
  }

};
/** [moveBlock description]移动滑块位置 */
zScroll.prototype.moveBlock = function(shank_ht) {   //滚动条
  var _this = this;
  this.startY = 0;
  this.startX=0;
  this.y = 0;
  this.x=0;
  this.startPanelY = 0;
  this.startPanelX=0;
  this.panelY=0;
  this.panelY = 0;
  this.aboveX=0;
  this.aboveY = -shank_ht;  //滑块的初始位置在-shank_ht
  this.aboveX= -shank_ht;
  this.abovePanelX = 0;
  this.abovePanelY = 0;   //面板滑动的初始位置
  this.timeRange = 0;
  if (_this.container) {
    _this.container.addEventListener('touchstart', function(e) {
      e.preventDefault();
      var target = e.target || e.srcElement, //获取触发的目标
        swipePanelClass = _this.swiperPanel.className;//获取className判断是否是触发滑块
      if (target.className == _this.swiperBlock.className||target.className==_this.h_swiperBlock.className) {
        _this.touchStart.call(_this, e);//用call使得_this对象的touch_start方法
      } 
      else if (_this.swiperPanel.contains(target)) {
        _this.touchStartPanel.call(_this, e); //如果是z-scroll-content，则触发面板移动事件
        
      }
    });
    _this.container.addEventListener('touchmove', function(e) {
      e.preventDefault();
      var target = e.target || e.srcElement;
      if (target.className == _this.swiperBlock.className||target.className ==_this.h_swiperBlock.className) {
        _this.touchMove.call(_this, e);
      } else if (_this.swiperPanel.contains(target)) {
        _this.touchMovePanel.call(_this, e);
      }
    });
    _this.container.addEventListener('touchend', function(e) {
      e.preventDefault();
      var target = e.target || e.srcElement;
      if (target.className == _this.swiperBlock.className||target.className == _this.h_swiperBlock.className) {
        _this.touchEnd.call(_this, e);
      } else if (_this.swiperPanel.contains(target)) {
        _this.touchEndPanel.call(_this, e);
      }
      return true;
    });

  }
};
zScroll.prototype.touchStart = function(e) {
  var touch = e.touches[0];    //获取触点的初始坐标
  this.startY = touch.pageY;
  this.startX=touch.pageX;
};
zScroll.prototype.touchMove = function(e) {
  var target = e.target || e.srcElement;
  var touch = e.touches[0],
    shank_ht = this.shank.offsetHeight,  //竖向滚动条的高度
    h_shank_wt=this.h_shank.offsetWidth, //横向滚动条的长度
    h_block_wt=this.h_swiperBlock.offsetWidth, //横向滚动条的长度
    block_ht = this.swiperBlock.offsetHeight;//竖向滑块的高度



   if (target.className == "z-scroll-block")
   {
       this.y = parseInt(this.aboveY + touch.pageY - this.startY); // this.aboveY+滑块移动的距离=滑块的上一个最终位置+移动的距离=y(滑块的末位置)
      if (this.y <= -block_ht && this.y >= -shank_ht) 
      {     //滑块的末位置在滚动条内部
        this.swiperBlock.style.webkitTransform = 'translateY(' + this.y + 'px)';
        this.moveSwipePanel_Y();
      } 
      else
      {
         if (this.y < -shank_ht) 
        {  //滑块的末位置在滚动条的上面还要上面
           this.y = -shank_ht;
           this.swiperBlock.style.webkitTransform = 'translateY(' + this.y + 'px)';//滑块的位置置为滚动条顶端
           this.moveSwipePanel_Y();  //移动面板
        } 
        else if (this.y > -block_ht) 
        {   //滑块的末位置在滚动条的最底端
           this.y = -block_ht;
           this.swiperBlock.style.webkitTransform = 'translateY(' + this.y + 'px)';
           this.moveSwipePanel_Y();
        }
      } 

   }
   
    if (target.className== "h-scroll-block")
    {
        this.x = parseInt(this.aboveX + touch.pageX - this.startX);
       if (this.x <= -h_block_wt && this.x >= -h_shank_wt )
       {
          this.h_swiperBlock.style.webkitTransform ='translateX('+ this.x +'px)';
          this.moveSwipePanel_X();
       }
       else
       {
          if(this.x> -h_block_wt)
          {
            this.x=-h_block_wt;
            this.h_swiperBlock.style.webkitTransform='translateX('+this.x+'px)';
            this.moveSwipePanel_X();
          }
          else if(this.x < -h_shank_wt)
          {
            this.x= -h_shank_wt;
            this.h_swiperBlock.style.webkitTransform='translateX('+this.x+'px)';
            this.moveSwipePanel_X();
          }
       }
    }

};
zScroll.prototype.touchEnd = function(e) {
  var cssPanel = this.swiperPanel.style.webkitTransform,//文章内容页移动的距离
    cssBlock = this.swiperBlock.style.webkitTransform;  //竖向滑块移动的距离
    css_hBlock=this.h_swiperBlock.style.webkitTransform;//
     var target = e.target || e.srcElement;
    
     var cssPanel_X=parseInt(cssPanel.split('(')[1].split(')')[0].replace('px',''));
      
     var cssPanel_Y=parseInt(cssPanel.split('(')[2].split(')')[0].replace('px',''));
    //split() 方法用于把一个字符串分割成字符串数组  translateY(5px); 下面为获取移动的数字
    //滑块的最终位置是否等于滑块的webkit移动距离
     this.aboveY = cssBlock ? parseInt(cssBlock.split('(')[1].split(')')[0].replace('px', '')) : -this.shank.offsetHeight;
     this.abovePanelY = cssPanel ? cssPanel_Y: 0;
  
     this.aboveX=css_hBlock ? parseInt(css_hBlock.split('(')[1].split(')')[0].replace('px','')): -this.h_shank.offsetWidth;
     this.abovePanelX=cssPanel ? cssPanel_X:0;
     
   
};
/** [moveSwipePanel description]移动内容 */

zScroll.prototype.moveSwipePanel_Y = function() {
  var shank_ht = this.shank.offsetHeight;
  var x1 = this.swiperPanel.offsetHeight - shank_ht,//内容页能够移动的距离
    x2 = shank_ht - this.swiperBlock.offsetHeight;//滑块能够移动的距离
  if (x2 != 0) {
     var cssPanel = this.swiperPanel.style.webkitTransform;
      var cssPanel_X=parseInt(cssPanel.split('(')[1].split(')')[0].replace('px',''));
    var moveY = parseInt(x1 / x2 * (this.y + shank_ht));//内容页应该移动的距离
    this.swiperPanel.style.webkitTransform = 'translateX(' + cssPanel_X + 'px) translateY('+ -moveY+'px)';
   
  }
};

zScroll.prototype.moveSwipePanel_X = function() {
  var h_shank_wt = this.h_shank.offsetWidth;
  var x1 = this.swiperPanel.offsetWidth - h_shank_wt,//内容页能够移动的距离
    x2 = h_shank_wt - this.h_swiperBlock.offsetWidth;//滑块能够移动的距离
  if (x2 != 0) {
     var cssPanel = this.swiperPanel.style.webkitTransform;
      var cssPanel_Y=parseInt(cssPanel.split('(')[2].split(')')[0].replace('px',''));
   var moveX = parseInt(x1 / x2 * (this.x + h_shank_wt));//内容页应该移动的距离
    this.swiperPanel.style.webkitTransform = 'translateX(' + -moveX + 'px) translateY(' + cssPanel_Y+'px)';
   
  }
};



/** [touchStartBlock description]面板滑动事件 */
zScroll.prototype.touchStartPanel = function(e) {
  var touch = e.touches[0];
  this.startPanelX = touch.pageX;
  this.startPanelY = touch.pageY;
  this.timeRange = e.timeStamp || Date.now();//返回一个时间戳
};
zScroll.prototype.touchMovePanel = function(e) {
  var touch = e.touches[0],
    shank_ht = this.swiperPanel.parentNode.offsetHeight, //box的高度
    h_shank_wt = this.swiperPanel.parentNode.offsetWidth,
    panel_ht = this.swiperPanel.offsetHeight,  //内容页的高度
    panel_wt = this.swiperPanel.offsetWidth,
    swipePanelClass = this.swiperPanel.className;//获取className
 
  
  //判断屏幕是左右滑动还是上下滑动
   var changeX=touch.pageX - this.startPanelX;
   var changeY=touch.pageY - this.startPanelY;
   //上下滑动
   if(Math.abs(changeX)<Math.abs(changeY))
   {
      var cssPanel = this.swiperPanel.style.webkitTransform;
      var cssPanel_X=parseInt(cssPanel.split('(')[1].split(')')[0].replace('px',''));

      this.panelY = parseInt(this.abovePanelY + touch.pageY - this.startPanelY);//内容页的最终位置
       if (this.panelY <= 0 && this.panelY >= -(panel_ht - shank_ht))
     {
       this.swiperPanel.style.webkitTransform = 'translateX(' + cssPanel_X + 'px) translateY('+ this.panelY+'px)';
       this.moveSwipeBlock_Y();
     } 
       else 
     {
        if (this.panelY > 0) 
       {
        this.panelY = 0;
        this.swiperPanel.style.webkitTransform = 'translateX(' + cssPanel_X + 'px) translateY('+ this.panelY+'px)';
        this.moveSwipeBlock_Y();
       } 
       else if (this.panelY < -(panel_ht - shank_ht)) 
      {
         this.panelY = -(panel_ht - shank_ht);
         this.swiperPanel.style.webkitTransform = 'translateX(' + cssPanel_X + 'px) translateY('+ this.panelY+'px)';
         this.moveSwipeBlock_Y();
      }
    }
   }
   //左右滑动
   else
   {

      var cssPanel = this.swiperPanel.style.webkitTransform;
      var cssPanel_Y=parseInt(cssPanel.split('(')[2].split(')')[0].replace('px',''));

    this.panelX = parseInt(this.abovePanelX + touch.pageX - this.startPanelX);
       if(this.panelX <= 0 && this.panelX>= -(panel_wt - h_shank_wt))
       {
         this.swiperPanel.style.webkitTransform='translateX(' + this.panelX + 'px) translateY('+ cssPanel_Y+'px)';
         this.moveSwipeBlock_X();
       }
       else
       {
         if(this.panelX >0)
         {
           this.panelX = 0;
           this.swiperPanel.style.webkitTransform='translateX(' + this.panelX + 'px) translateY('+ cssPanel_Y+'px)';
           this.moveSwipeBlock_X();
         }
         else if (this.panelX < -(panel_wt-h_shank_wt))
         {
           this.panelX= -(panel_wt - h_shank_wt);
           this.swiperPanel.style.webkitTransform='translateX(' + this.panelX + 'px) translateY('+ cssPanel_Y+'px)';
           this.moveSwipeBlock_X();
         }
       }
   }

};
zScroll.prototype.touchEndPanel = function(e) {
var cssPanel = this.swiperPanel.style.webkitTransform,//文章内容页移动的距离
    cssBlock = this.swiperBlock.style.webkitTransform;  //竖向滑块移动的距离
    css_hBlock=this.h_swiperBlock.style.webkitTransform;
   
   
var cssPanel_X=parseInt(cssPanel.split('(')[1].split(')')[0].replace('px',''));

 var cssPanel_Y=parseInt(cssPanel.split('(')[2].split(')')[0].replace('px',''));
     this.aboveY = cssBlock ? parseInt(cssBlock.split('(')[1].split(')')[0].replace('px', '')) : -this.shank.offsetHeight;
     this.abovePanelY = cssPanel ? cssPanel_Y: 0;
  
     this.aboveX=css_hBlock ? parseInt(css_hBlock.split('(')[1].split(')')[0].replace('px','')): -this.h_shank.offsetWidth;
     this.abovePanelX=cssPanel ? cssPanel_X:0;

     
};
/** [moveSwipePanel description]移动内容 */
zScroll.prototype.moveSwipeBlock_Y = function() {
  var shank_ht = this.swiperPanel.parentNode.offsetHeight;
  var x1 = this.swiperPanel.offsetHeight - shank_ht,
    x2 = shank_ht - this.swiperBlock.offsetHeight;
  if (x1 != 0) {
    var y2 = parseInt(x2 * this.panelY / x1 + shank_ht);
    if (Math.abs(y2) <= shank_ht) {
      this.swiperBlock.style.webkitTransform = 'translateY(' + -y2 + 'px)';
      //this.aboveY=-y2;
    }
  }
};

zScroll.prototype.moveSwipeBlock_X = function() {
  var h_shank_wt = this.swiperPanel.parentNode.offsetWidth;
  var x1 = this.swiperPanel.offsetWidth - h_shank_wt,
    x2 = h_shank_wt - this.h_swiperBlock.offsetWidth;
  if (x1 != 0) {
    var y2 = parseInt(x2 * this.panelX / x1 + h_shank_wt);
    if (Math.abs(y2) <= h_shank_wt) {
      this.h_swiperBlock.style.webkitTransform = 'translateX(' + -y2 + 'px)';
     // this.aboveX=-y2;
    }
  }
};

// ----  其他 -------//
/** [addStyle description]添加样式 */
zScroll.prototype.addStyle = function(el, classStyle) {
  if (typeof classStyle == 'object' && el) {
    for (var name in classStyle) {
      el.style[name] = classStyle[name];
    }
  }
};