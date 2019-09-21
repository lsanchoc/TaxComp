
//bugs found and fixed



//checks for consistency in visual node array
function testNodeArrayOrder(nodeArray){
    var previuosY = -100; // cords must be positive or 0

    for(let i = 0; i < nodeArray.length; i++){
        var node = nodeArray[i];
        if(node.y <= previuosY){
            return false;
        }

        previuosY = node.y;
    }

    return true;

}



function testNodeOverlaping(nodeArray){
    var previuosY = -100; // cords must be positive or 0
    var previuosX = -100; // cords must be positive or 0

    for(let i = 0; i < nodeArray.length; i++){
        var node = nodeArray[i];
        if(node.y == previuosY && node.x == previuosX){
            return false;
        }

        previuosY = node.y;
        previuosX = node.x;
    }

    return true;
}