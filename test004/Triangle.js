(function()
{
	window.Triangle = (function()
	{
		function Triangle(fill, w, h, u0, v0, u1, v1, u2, v2)
		{
			this.fill = fill;

			var det = ( (u1 - u0) * (v2 - v0) - (v1 - v0) * (u2 - u0) ) * w * h;

			this.w = w;
			this.h = h;

			this.u0 = u0;
			this.v0 = v0;
			
			this.u1 = u1;
			this.v1 = v1;
			
			this.u2 = u2;
			this.v2 = v2;
			
			this.a = (v2 - v0) * h/det;
			this.b = -(v1 - v0) * h/det;
			this.c = -(u2 - u0) * w/det;
			this.d = (u1 - u0) * w/det;
			this.e = ((u2 - u0)*v0 - (v2 - v0)*u0) * h*w/det;
			this.f = ((v1 - v0)*u0 - (u1 - u0)*v0) * h*w/det;
		}

		Triangle.prototype.draw = function(ctx, x0, y0, x1, y1, x2, y2)
		{
			var v0x, v0y, v1x, v1y;

			v0x = x1-x0;
			v0y = y1-y0;

			v1x = x2-x0;
			v1y = y2-y0;

			if( v1x * v0y - v1y * v0x > 0 ) return;

			var a, b, c, d, e, f;

			a = v0x*this.a+v1x*this.b;
			b = v0y*this.a+v1y*this.b;
			c = v0x*this.c+v1x*this.d;
			d = v0y*this.c+v1y*this.d;
			e = v0x*this.e+v1x*this.f+x0;
			f = v0y*this.e+v1y*this.f+y0;

			ctx.setTransform(a, b, c, d, e, f);

			ctx.beginPath();
			ctx.moveTo(this.u0*this.w, this.v0*this.h);
			ctx.lineTo(this.u1*this.w, this.v1*this.h);
			ctx.lineTo(this.u2*this.w, this.v2*this.h);
			ctx.lineTo(this.u0*this.w, this.v0*this.h);
			ctx.closePath();

			ctx.fillStyle = this.fill;
			ctx.fill();
		}

		return Triangle;
	})();
})(window);