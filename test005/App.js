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

			this.canvas.style.top = 50+'px';
			this.canvas.style.left = 50+'px';
			this.canvas.style.background = '#cccccc';
			this.canvas.style.display = 'block';
			this.canvas.style.position = 'relative';

			this.ctx = this.canvas.getContext("2d");

			document.getElementsByTagName('body')[0].appendChild(this.canvas);

			this.onResize();

			this.canvas.onmousemove = bind(onMouseMove, this);
		}

		function onMouseMove(event)
		{
			console.log(event);

			//this.canvas.onmousemove = null;
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
			this.canvas.width = window.innerWidth-100;
			this.canvas.height = window.innerHeight-100;
		}

		return App;
	})();

	window.onLoad = function()
	{
		var app = new App();

		window.onresize = bind(app.onResize, app);
	}

})(window);