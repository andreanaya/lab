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


			this.matrix = new Matrix3D();

			this.vertices = [
				new Vector3D(-100, -100, 100),
				new Vector3D(100, -100, 100),
				new Vector3D(-100, 100, 100),
				new Vector3D(100, 100, 100),

				new Vector3D(100, -100, -100),
				new Vector3D(-100, -100, -100),
				new Vector3D(100, 100, -100),
				new Vector3D(-100, 100, -100)
			];

			this.triangles = [
				0, 1, 2, 2, 1, 3,
				1, 4, 3, 3, 4, 6,
				4, 5, 6, 6, 5, 7,
				5, 0, 7, 7, 0, 2,
				5, 4, 0, 0, 4, 1,
				6, 7, 3, 3, 7, 2
				]

			this.angle = new Vector3D();

			onEnterFrame.apply(this);
		}

		function onEnterFrame()
		{
			requestFrame(bind(onEnterFrame, this));
			render.apply(this);
		}

		function render()
		{
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


			this.angle.x += .1;
			this.angle.y += .1;
			this.angle.z += .1;

			this.matrix.identity();
			this.matrix.appendRotation(this.angle.x, Vector3D.X_AXIS);
			this.matrix.appendRotation(this.angle.y, Vector3D.Y_AXIS);
			//this.matrix.appendTranslation(Math.sin(this.angle.z)*50, 0, 0);

			var i, t, data, scale, zoom, i0, i1, i2;

			zoom = this.canvas.height/500;

			data = [];

			t = this.vertices.length;

			for(i = 0; i<t; i++)
			{
				data[i] = this.matrix.transformVector(this.vertices[i]);

				scale = zoom*500/(500+data[i].z);

				data[i].x = this.canvas.width*.5+data[i].x*scale;
				data[i].y = this.canvas.height*.5+data[i].y*scale;
			}


			this.ctx.strokeStyle = "#FF0000";

			this.ctx.beginPath();

			t = this.triangles.length;

			for(i = 0; i<t; i+=3)
			{
				i0 = this.triangles[i];
				i1 = this.triangles[i+1];
				i2 = this.triangles[i+2];

				if( (data[i2].x-data[i0].x) * (data[i1].y-data[i0].y) - (data[i2].y-data[i0].y) * (data[i1].x-data[i0].x) > 0 )
				{	
					this.ctx.moveTo(data[i0].x, data[i0].y);
					this.ctx.lineTo(data[i1].x, data[i1].y);
					this.ctx.lineTo(data[i2].x, data[i2].y);
					this.ctx.lineTo(data[i0].x, data[i0].y);
				}
			}

			this.ctx.stroke();
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