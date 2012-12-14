function bind(fn, me){ return function(){ return fn.apply(me, arguments); }; };

(function(window)
{
	var requestFrame = (function(){
		return  window.requestAnimationFrame || 
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function( callback ){
					window.setTimeout(callback, 1000 / 60);
				};
	})();

	var App = (function()
	{
		function App()
		{
			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext("2d");

			document.getElementsByTagName('body')[0].appendChild(this.canvas);

			this.onResize();

			this.image = new Image();
			this.image.onload = bind(onLoad, this);
			this.image.src = 'slide1.jpg';

			var matrix = new Matrix([1, 2, 3, 4, 5, 6, 0, 0, 1]);

			var inverse = matrix.clone()
			inverse.invert();
			//console.log(inverse.toString());

			var result = inverse.clone();
			result.concat(matrix);
			//console.log(result.toString());

			//onEnterFrame.apply(this);
		}

		function onLoad()
		{
			var texture = this.ctx.createPattern(this.image, "repeat");

			var v0 = new Vector3D(50, 50);
			var v1 = new Vector3D(350, 200);
			var v2 = new Vector3D(75, 250);

			var triangle = new Triangle(v0, v1, v2, texture);
			triangle.w = this.image.width;
			triangle.h = this.image.height;

			triangle.draw(this.ctx);


			this.ctx.setTransform(1, 0, 0, 1, 0, 0);

			this.ctx.fillStyle = "#FF0000";

			this.ctx.beginPath();
			this.ctx.arc(v0.x, v0.y, 5, 0, 2*Math.PI);
			this.ctx.closePath();
			this.ctx.fill();

			this.ctx.beginPath();
			this.ctx.arc(v1.x, v1.y, 5, 0, 2*Math.PI);
			this.ctx.closePath();
			this.ctx.fill();

			this.ctx.beginPath();
			this.ctx.arc(v2.x, v2.y, 5, 0, 2*Math.PI);
			this.ctx.closePath();
			this.ctx.fill();
		}

		function onEnterFrame()
		{
			requestFrame(bind(onEnterFrame, this));
			render.apply(this);
		}

		function render()
		{
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}

		App.prototype.onResize = function()
		{
			this.canvas.width = window.innerWidth;
			this.canvas.height = window.innerHeight;
		}

		return App;
	})();

	window.onLoad = function()
	{
		var app = new App();

		window.onresize = bind(app.onResize, app);
	}

})(window);