// MineSweeper program, in glorious JavaScript
var MineSweeper = {
    height: 8,
    width: 8,
    num_mines: 10,
    mines_array: null,
    // Object controlling the whole minesweeper
    init: function() {
        var self = this;
        // Create a new empty MineSweeper table
        self.mines_array = new Array(self.width);
        for(var i=0; i < self.width; i++) {
           self.mines_array[i] = new Array(self.height); 
        }
        self.generate_new_field();
        self.print_field();
    },
    get_mines_adjacent: function(x,y) {
        var self = this;
        var start_x = Math.max(x - 1, 0);
        var end_x = Math.min(x + 1, self.width - 1);
        var start_y = Math.max(y - 1, 0);
        var end_y = Math.min(y + 1, self.height - 1);
        var adjacent_mines = 0;
        for(var i=start_x; i <= end_x;i++) {
           for(var j=start_y; j <= end_y; j++) {
               if(self.mines_array[i][j][1] == 'MINE') {
                   adjacent_mines += 1;
               }
           }
        }
        return adjacent_mines;

    },
    generate_new_field: function() {
        var self = this;
        // Empty the field
        for(var i=0; i < self.width; i++) {
           for(var j=0; j < self.height; j++) {
                self.mines_array[i][j] = ['HIDDEN','EMPTY', 0]
           }
        }
        
        // Populate the field with random mines
        for(var i=0; i < self.num_mines; i++) {
            // Get a random empty position for a mine
            do {
                var pos_x=Math.floor(Math.random()*self.width);
                var pos_y=Math.floor(Math.random()*self.width);
            } while (self.mines_array[pos_x][pos_y][1] != 'EMPTY');
            self.mines_array[pos_x][pos_y][1] = 'MINE'
        }

        // Calculate the number of adjacent mines to each cell
        for(var i=0; i < self.width; i++) {
            for(var j=0; j < self.height; j++) {
                self.mines_array[i][j][2] = self.get_mines_adjacent(i,j);
            }
        }
    },
    check_win: function() {
        var self = this;
        var win = true;
        // check if all the mines are clear
        for(var i=0; (i < self.width) && win; i++) {
            for(var j=0; (j < self.height) && win; j++) {
                var cell_info = self.mines_array[i][j];
                if(cell_info[0] == 'HIDDEN' && cell_info[1] == 'EMPTY') {
                    win = false;
                }
            }
        }
 
        if(win) {
            alert('You win!!!!');
        }

    },
    show_cell: function(x, y, print_field) {
        var self = this;
        var cell_info = self.mines_array[x][y];
        var loose = false;
        cell_info[0] = 'REVEAL';
        if(cell_info[1] == 'EMPTY') {
            // Check for revealing more cells
            if(cell_info[2] == 0) {
                // Reveal surrounding cells
                var start_x = Math.max(x - 1, 0);
                var end_x = Math.min(x + 1, self.width - 1);
                var start_y = Math.max(y - 1, 0);
                var end_y = Math.min(y + 1, self.height - 1);
                for(var i=start_x; i <= end_x; i++) {
                    for(var j=start_y; j <= end_y; j++) {
                        if(self.mines_array[i][j][0] == 'HIDDEN' && self.mines_array[i][j][1] == 'EMPTY') {
                            self.show_cell(i,j, false);
                        }
                    }
                }
     
            }
        } else {
            // You loose!
            loose = true;
        }
        if(print_field) {
            self.print_field();
            self.check_win();
        }
        if(loose) {
            alert('Mine, you loose');
        }
    },
    flag_cell: function(x, y) {
        var self = this;
        var cell_info = self.mines_array[x][y];
        if(cell_info[0] == 'REVEAL') {
            // Already revealed, don't do anything
            return;
        } else if(cell_info[0] == 'FLAGGED') {
            cell_info[0] = 'HIDDEN';
        } else if(cell_info[0] == 'HIDDEN') {
            cell_info[0] = 'FLAGGED';
        }

        self.print_field();

    },
    print_field: function() {
        var self = this;
        var main_frame = $('#minesweeper')
        // Remove previous table
        $('table').remove()
        var table = $('<table></table>');
        for(var i=0; i < self.width; i++) {
            var new_row = $('<tr></tr>');
            for(var j=0; j < self.height; j++) {
                var new_cell = $('<td></td>');
                new_cell.attr('x', i).attr('y', j);
                var mine_info = self.mines_array[i][j];
                if(mine_info[0] == 'HIDDEN') {
                    new_cell.addClass('hidden');
                    new_cell.click(function() {
                        var x = $(this).attr('x');
                        var y = $(this).attr('y');
                        self.show_cell(x,y, true);
                    });
                    // Disable context menu and set rigth click for flag cell
                    new_cell.bind("contextmenu", function() {
                        var x = $(this).attr('x');
                        var y = $(this).attr('y');
                        self.flag_cell(x,y);
                        return false;
                    });
                } else if(mine_info[0] == 'FLAGGED') {
                    new_cell.addClass('flagged');
                    // Disable context menu and set rigth click for flag cell
                    new_cell.bind("contextmenu", function() {
                        var x = $(this).attr('x');
                        var y = $(this).attr('y');
                        self.flag_cell(x,y);
                        return false;
                    });

                } else if(mine_info[1] == 'MINE') {
                    new_cell.addClass('mine');
                } else if(mine_info[2]) {
                    var num_mines = mine_info[2];
                    new_cell.html(num_mines);
                    new_cell.addClass('number');
                    switch(num_mines) {
                        case 1:
                            new_cell.addClass('one_mine');
                            break;
                        case 2:
                            new_cell.addClass('two_mines');
                            break;
                        case 3:
                            new_cell.addClass('three_mines');
                            break;
                        case 4:
                            new_cell.addClass('four_mines');
                            break;
                        default:
                            new_cell.addClass('five_plus_mines');
                            break;
                    }
                    
                } else {
                    new_cell.addClass('number');
                }
                new_row.append(new_cell);
            }
            table.append(new_row);
        }
        main_frame.append(table);
    }
};


 $(document).ready(function(){
     MineSweeper.init();

 });
