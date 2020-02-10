class Connect4 {
    constructor(selector) {
        this.rows = 6;
        this.cols =7;
        this.player = 'red';
        this.selector = selector;
        this.isGameOver = false;
        this.onPlayerMove = function(){};
        this.createGrid();
        this.setupEventListeners();
    }

    createGrid() {
        const $board = $(this.selector);
        $board.empty();
        this.isGameOver = false;
        this.player = 'red';
        for(let row = 0; row < this.rows; row++) {
            const $row = $('<div>').addClass('row');

            for(let col = 0; col < this.cols; col++) {
                const $col = $('<div>').addClass('col empty')
                .attr('data-col', col)
                .attr('data-row', row);
                $row.append($col);
            }
            $board.append($row);
        }
        
    }

    setupEventListeners() {
        const $board = $(this.selector);
        const that = this;

        function findLastEmptyCell(col) {
            const cells = $(`.col[data-col='${col}']`);

            for(let i = cells.length -1; i>=0; i--){
                const $cell = $(cells[i]);
                if($cell.hasClass('empty')) {
                    return $cell;
                }
            }
            return null;
        }



        $board.on('mouseenter', '.col.empty', function() {

            if(that.isGameOver) return;
            const col = $(this).data('col');

           //need to select the empty cell
           const $lastEmptyCell = findLastEmptyCell(col);
           $lastEmptyCell.addClass(`next-${that.player}`);
        });


        $board.on('mouseleave', '.col', function(){
            $('.col').removeClass(`next-${that.player}`);
        });

        $board.on('click','.col.empty', function(){

            if(that.isGameOver) return;

            const col = $(this).data('col');
            const row = $(this).data('row');

            //find last empty cell
            const $lastEmptyCell = findLastEmptyCell(col);
            $lastEmptyCell.removeClass(`empty next-${that.player}`);
            $lastEmptyCell.addClass(that.player);
            $lastEmptyCell.data('player', that.player);


            const winner = that.checkForWinner(
                $lastEmptyCell.data('row'),
                $lastEmptyCell.data('col')
            );

            if(winner) {
                that.isGameOver = true;
                let messege = `<div class="messege"><p>Game Over! ${that.player}  has won</p></div>`;
                $("body").append(messege);
                
                $('.col.empty').removeClass('empty');
                return;
            }

            
            that.player = (that.player === 'red') ? 'black' : 'red';
            that.onPlayerMove();
            $(this).trigger('mouseenter');
        });
    }


    checkForWinner(row, col) {
        const that = this;

        function getCell(row,col) {
            return $(`.col[data-row='${row}'][data-col='${col}']`);
        }

        function checkDirection(direction) {
            let total = 0;
            let i = row + direction.i;
            let j =col + direction.j;
            let $next = getCell(i, j);

            while (i > 0 &&
                   i < that.rows &&
                   j >= 0 &&
                   j< that.cols &&
                   $next.data('player') === that.player ) {
                       total++;
                       i += direction.i;
                       j += direction.j;
                       $next = getCell(i, j);
                   }

                   return total;
        }

        function checkWin(directionA, directionB) {
            const total = 1 + 
            checkDirection(directionA) +
            checkDirection(directionB);

            if(total >=4) {
                return that.player;
            }else {
                return null;
            }
        }

        function checkDiagonalBLtoTR() {
            return checkWin({i: 1, j:-1}, {i:1, j:1});
        }

        function checkDiagonaTLLtoBR() {
            return checkWin({i: 1, j:1}, {i:-1, j:-1});
        }

        function checkVerticals(){
            return checkWin({i: -1, j:0}, {i:1, j:0});
        }


        function checkHorizontals(){
            return checkWin({i: 0, j:-1}, {i:0, j:1});
        }

        return checkVerticals() || checkHorizontals() || checkDiagonalBLtoTR() || checkDiagonaTLLtoBR()
       }


       restart() {
           if($(".messege")){
            $(".messege").remove();
           }
           this.createGrid();
           this.onPlayerMove();
       }

}