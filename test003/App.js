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

			var xml;

			if (window.XMLHttpRequest)
			{
				xml = new XMLHttpRequest();
			}
			else
			{
				xml = new ActiveXObject("Microsoft.XMLHTTP");
			}

			xml.open("GET", "skull.dae", true);

			xml.onreadystatechange = bind(onComplete, this);

			xml.send(null);
		}

		function onComplete(event)
		{
			var xml = event.target;
			
			if (xml.readyState != 4) return;

			var data = xml.responseXML
			var mesh = data.getElementsByTagName("mesh")[0];
			var list = mesh.getElementsByTagName("source");

			var floatBuffer = [];

			var i, t;

			t = list.length;

			for(i = 0; i<t; i++)
			{
				if(list[i].getElementsByTagName("technique_common")[0].getElementsByTagName("accessor")[0].attributes.stride.nodeValue == 3)
				{
					floatBuffer = floatBuffer.concat(list[i].getElementsByTagName("float_array")[0].childNodes[0].data.split(" "));
				}
			}

			var x, y, z;

			this.vertexBuffer = [];

			while(floatBuffer.length>0)
			{
				x = floatBuffer.shift()*5;
				y = -floatBuffer.shift()*5;
				z = floatBuffer.shift()*5;

				this.vertexBuffer.push(new Vector3D(x, y, z));
			}

			var polyList = mesh.getElementsByTagName("polylist")[0];

			var v = polyList.getElementsByTagName("vcount")[0].childNodes[0].data.split(" ");
			var p = polyList.getElementsByTagName("p")[0].childNodes[0].data.split(" ");

			var c;

			this.indexBuffer = [];
			this.polyBuffer = [];

			while(v.length>0)
			{
				c = v.shift();

				if(c == 3)
				{
					while(--c>-1)
					{
						this.indexBuffer.push(p.shift());
						p.shift();
						p.shift();
					}
				}
				else
				{
					var poly = [];

					for(i = 0; i<c; i++)
					{
						poly.push(p.shift());
						p.shift();
						p.shift();
					}

					this.polyBuffer.push(poly);
				}
			}

			this.matrix = new Matrix3D();
			this.light = new Vector3D(0, 0, .5);
			this.light.normalize();

			this.rotation = new Vector3D();

			this.buffer = [];

			this.onResize();

			onEnterFrame.apply(this);
		}

		function onEnterFrame()
		{
			requestFrame(bind(onEnterFrame, this));

			update.apply(this);
			render.apply(this);
		}

		function update()
		{
			//this.rotation.x +=.1;
			this.rotation.y +=.1;

			this.matrix.identity();
			this.matrix.appendRotation(this.rotation.x, Vector3D.X_AXIS);
			this.matrix.appendRotation(this.rotation.y, Vector3D.Y_AXIS);

			var vertex, i, t, scale, zoom

			zoom = this.canvas.height/500;

			this.buffer = [];

			t = this.vertexBuffer.length;

			for(i = 0; i<t; i++)
			{
				vertex = this.matrix.transformVector(this.vertexBuffer[i]);
				scale = zoom*500/(500+vertex.z);

				this.buffer[i] = {vertex:vertex, scale:scale};
			}
		}

		function render()
		{
			var buffer, data, i, j, t, i0, i1, i2, x0, y0, x1, y1, x2, y2, scale, r, g, b, color, normal, diffuse, v, x, y, z, offsetX, offsetY;

			buffer = [];

			offsetX = this.canvas.width*.5;
			offsetY = this.canvas.height*.5;

			t = this.indexBuffer.length;

			r = 65;
			g = 18;
			b = 81;

			for(i = 0; i<t; i+=3)
			{
				i0 = this.indexBuffer[i];
				i1 = this.indexBuffer[i+1];
				i2 = this.indexBuffer[i+2];

				v0 =this.buffer[i0].vertex;
				v1 =this.buffer[i1].vertex;
				v2 =this.buffer[i2].vertex;

				x0 = offsetX+v0.x*this.buffer[i0].scale;
				y0 = offsetY+v0.y*this.buffer[i0].scale;

				x1 = offsetX+v1.x*this.buffer[i1].scale;
				y1 = offsetY+v1.y*this.buffer[i1].scale;

				x2 = offsetX+v2.x*this.buffer[i2].scale;
				y2 = offsetY+v2.y*this.buffer[i2].scale;

				if( (x2-x0) * (y1-y0) - (y2-y0) * (x1-x0) < 0 )
				{
					normal = v1.subtract(v0).crossProduct(v2.subtract(v0));
					normal.normalize();

					diffuse = normal.dotProduct(this.light);

					color = '#'+Number((r*diffuse) << 16 | (g*diffuse) << 8 | (b*diffuse)).toString(16);

					z = Math.min(v0.z, v1.z, v2.z);

					buffer.push({color:color, data:[x0, y0, x1, y1, x2, y2], z:z});
				}
			}

			t = this.polyBuffer.length;

			for(i = 0; i<t; i++)
			{
				i0 = this.polyBuffer[i][0];
				i1 = this.polyBuffer[i][1];
				i2 = this.polyBuffer[i][2];

				v0 =this.buffer[i0].vertex;
				v1 =this.buffer[i1].vertex;
				v2 =this.buffer[i2].vertex;

				x0 = offsetX+v0.x*this.buffer[i0].scale;
				y0 = offsetY+v0.y*this.buffer[i0].scale;

				x1 = offsetX+v1.x*this.buffer[i1].scale;
				y1 = offsetY+v1.y*this.buffer[i1].scale;

				x2 = offsetX+v2.x*this.buffer[i2].scale;
				y2 = offsetY+v2.y*this.buffer[i2].scale;

				if( (x2-x0) * (y1-y0) - (y2-y0) * (x1-x0) < 0 )
				{
					normal = v1.subtract(v0).crossProduct(v2.subtract(v0));
					normal.normalize();

					diffuse = normal.dotProduct(this.light);

					color = '#'+Number((r*diffuse) << 16 | (g*diffuse) << 8 | (b*diffuse)).toString(16);

					z = Math.min(v0.z, v1.z, v2.z);

					data = [x0, y0, x1, y1, x2, y2];

					for(j = 3; j<this.polyBuffer[i].length; j++)
					{
						v = this.buffer[this.polyBuffer[i][j]].vertex;

						x = offsetX+v.x*this.buffer[this.polyBuffer[i][j]].scale;
						y = offsetY+v.y*this.buffer[this.polyBuffer[i][j]].scale;
						z = Math.min(z, v.z);

						data.push(x, y);
					}

					buffer.push({color:color, data:data, z:z});
				}

				
			}

			buffer.sort(function(a,b){return b.z-a.z})

			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);

			t = buffer.length;

			for(i = 0; i<t; i++)
			{
				this.ctx.strokeStyle = buffer[i].color;
				this.ctx.fillStyle = buffer[i].color;

				this.ctx.beginPath();

				data = buffer[i].data;

				this.ctx.moveTo(data.shift(), data.shift());

				while(data.length>0) this.ctx.lineTo(data.shift(), data.shift());
				
				this.ctx.closePath();

				this.ctx.fill();
				this.ctx.stroke();
			}
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