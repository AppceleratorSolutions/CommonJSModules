/* Sample Usage in app.js:
    var win = Ti.UI.createWindow({
        backgroundColor: "#333"
    });
    win.open();
    var slideLock = require('slideLock');
    
    var myLock = slideLock({
        button:{
            size:40,
            color:"blue",
            center:{x:50,y:50}
        },
        lock:{
            size:100,
            color:"red",
            center:{x:Ti.Platform.displayCaps.platformWidth/2, y:Ti.Platform.displayCaps.platformHeight/2},
            unlockMessage:"You have unlocked your phone!"
        },
        view:{
            obj:win,
            selectedColor:"green"
        }
    });
*/


function slideLock(args){
    
    var lockView = args.view.obj;
    var backgroundColor = lockView.backgroundColor
    this.lock = Ti.UI.createView({
        height:args.lock.size,
        width:args.lock.size,
        borderRadius:args.lock.size/2,
        borderColor:args.lock.color,
        backgroundColor:"transparent",
        borderWidth:Math.floor(args.lock.size*.05),
        center:args.lock.center,
        locked:true
    });
    lockView.add(this.lock);
    
    this.button = Ti.UI.createView({
        backgroundColor:args.button.color,
        center:args.button.center,
        height:args.button.size,
        width:args.button.size,
        borderRadius:args.button.size/2,
        borderColor:args.button.color,
        borderWidth:Math.floor(args.button.size*.05)
    });
    lockView.add(button);
     
    button.addEventListener('touchmove', buttonTouchmove);
    
    button.addEventListener('touchend', buttonTouchend);
    
    function buttonTouchmove(evt) {
        
        var point = button.convertPointToView({ x: evt.x, y: evt.y }, lockView);    
        
        button.center = point; 
        
        if(Math.pow((point.x - lock.center.x),2)+(Math.pow((point.y - lock.center.y),2))<=(Math.pow(lock.borderRadius, 2))){
            lock.locked = false;
            lock.backgroundColor = args.lock.color;
            lockView.backgroundColor = args.view.selectedColor;
            button.backgroundColor = "transparent";
        } else {
            lock.locked = true;
            lock.backgroundColor = "transparent"
            lockView.backgroundColor = backgroundColor;
            button.backgroundColor = args.button.color;
        }
        
    };
    
    function buttonTouchend(evt){
        
        var point = button.convertPointToView({ x: evt.x, y: evt.y }, lockView);    
        
        if(!lock.locked){
            alert(args.lock.unlockMessage);
        };
        
    };

}
module.exports = slideLock;