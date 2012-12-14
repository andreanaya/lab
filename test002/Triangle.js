(function()
{
	window.Triangle = (function()
	{
		function Triangle(v0, v1, v2, texture)
		{
			this.v0 = v0;
			this.v1 = v1;
			this.v2 = v2;

			this.texture = texture;

			this.sMat = new Matrix();
			this.tMat = new Matrix();
			this.mat = new Matrix();

			var uv0 = this.uv0 = new Vector3D(0, 0);
			var uv1 = this.uv1 = new Vector3D(1, 0);
			var uv2 = this.uv2 = new Vector3D(0, 1);

			this.tMat.rawData[0] = (uv1.x - uv0.x);
			this.tMat.rawData[3] = (uv1.y - uv0.y);
			this.tMat.rawData[1] = (uv2.x - uv0.x);
			this.tMat.rawData[4] = (uv2.y - uv0.y);
			this.tMat.rawData[2] = uv0.x;
			this.tMat.rawData[5] = uv0.y;
		}

		Triangle.prototype.draw = function(ctx)
		{
			var w, h, texture, x0, y0, x1, y1, x2, y2;

			w = this.w;
			h = this.h;

			x0 = this.v0.x;
			y0 = this.v0.y;

			x1 = this.v1.x;
			y1 = this.v1.y;
			
			x2 = this.v2.x;
			y2 = this.v2.y;

			if( ( x2 - x0 ) * ( y1 - y0 ) - ( y2 - y0 ) * ( x1 - x0 ) > 0 ) return;

			this.sMat.rawData[0] = (x1 - x0);
			this.sMat.rawData[3] = (y1 - y0);
			this.sMat.rawData[1] = (x2 - x0);
			this.sMat.rawData[4] = (y2 - y0);
			this.sMat.rawData[2] = x0;
			this.sMat.rawData[5] = y0;

			this.mat.rawData[0] = this.tMat.rawData[0] * w;
			this.mat.rawData[3] = this.tMat.rawData[3] * h;
			this.mat.rawData[1] = this.tMat.rawData[1] * w;
			this.mat.rawData[4] = this.tMat.rawData[4] * h;
			this.mat.rawData[2] = this.tMat.rawData[2] * w;
			this.mat.rawData[5] = this.tMat.rawData[5] * h;

			this.mat.invert();
			this.mat.concat(this.sMat);

			ctx.setTransform(this.mat.rawData[0], this.mat.rawData[3], this.mat.rawData[1], this.mat.rawData[4], this.mat.rawData[2], this.mat.rawData[5]);

			ctx.beginPath();
			
			ctx.moveTo(this.uv0.x * w, this.uv0.y * h);
			ctx.lineTo(this.uv1.x * w, this.uv1.y * h);
			ctx.lineTo(this.uv2.x * w, this.uv2.y * h);
			ctx.lineTo(this.uv0.x * w, this.uv0.y * h);

			ctx.closePath();

			ctx.fillStyle = this.texture;
			ctx.fill();
		}

		return Triangle;
	})();
})(window);