var Background = function () {

  
  this.canvas = bg_canvas;
  
  this.context = this.canvas.getContext('2d');
  
  this.col_width = 25;
  
  this.row_height = 25;
  
  this.colors = [];
  
  var color;
  for (color = 0; color < 50; color++) {
    this.colors.push(new Color(get_random_int(10, 20), get_random_int(20, 30), get_random_int(10, 20)));
  }
  
  this.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
  this.draw = function () {
  
    var x;
    var y;
    var col;
    var row;
    var cols = this.canvas.width / this.col_width;
    var rows = this.canvas.height / this.row_height;
    
    for (row = 0; row < rows; row++) {
    
      y = row * this.row_height;
      
      for (col = 0; col < cols; col++) {
        
        x = col * this.col_width;
        c = (row + col * 5) % this.colors.length;
        
        this.context.fillStyle = this.colors[c].string; 
        this.context.fillRect(x, y, this.col_width, this.row_height);
      }
    }
    
    
    
  }
  
  this.resize = function () {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext('2d');
    redraw_background = true
  
  }
}