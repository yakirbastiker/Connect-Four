$(document).ready(function(){
    //drow a grid
    const connect4 = new Connect4('#connect4');

    connect4.onPlayerMove = function() {
        $('#player').text(connect4.player)
        $('#player').attr('class', connect4.player)
    };

    $('#restart').click(function(){
        connect4.restart();
    });
});