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
			this.image.src = 'texture.jpg';
		}

		function onLoad()
		{
			var texture = this.ctx.createPattern(this.image, "repeat");

			var v0 = new Vector3D(50, 50);
			var v1 = new Vector3D(350, 80);
			var v2 = new Vector3D(50, 250);
			var v3 = new Vector3D(250, 250);

			var t1 = new Triangle(texture, this.image.width, this.image.height, 0.5, 0.5, .75, 0.5, 0.5, .75);
			var t2 = new Triangle(texture, this.image.width, this.image.height, 0.5, .75, .75, 0.5, .75, .75);

			t1.draw(this.ctx, v0.x, v0.y, v1.x, v1.y, v2.x, v2.y);
			t2.draw(this.ctx, v2.x, v2.y, v1.x, v1.y, v3.x, v3.y);
			
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

			this.ctx.beginPath();
			this.ctx.arc(v3.x, v3.y, 5, 0, 2*Math.PI);
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