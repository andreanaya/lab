(function(window)
{
	window.Matrix = (function()
	{
		function Matrix(m)
		{
			this.rawData = m || [1, 0, 0, 0, 1, 0, 0, 0, 1];
		}

		Matrix.prototype.identity = function()
		{
			this.rawData = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		}

		Matrix.prototype.clone = function()
		{
			var m = this.rawData;
			return new Matrix([m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]]);
		}

		Matrix.prototype.concat = function(m)
		{
			var m1=m.rawData;
			var m2=this.rawData;

			this.rawData=[
				m1[0]*m2[0]+m1[1]*m2[3]+m1[2]*m2[6],
				m1[0]*m2[1]+m1[1]*m2[4]+m1[2]*m2[7],
				m1[0]*m2[2]+m1[1]*m2[5]+m1[2]*m2[8],
				m1[3]*m2[0]+m1[4]*m2[3]+m1[5]*m2[6],
				m1[3]*m2[1]+m1[4]*m2[4]+m1[5]*m2[7],
				m1[3]*m2[2]+m1[4]*m2[5]+m1[5]*m2[8],
				m1[6]*m2[0]+m1[7]*m2[3]+m1[8]*m2[6],
				m1[6]*m2[1]+m1[7]*m2[4]+m1[8]*m2[7],
				m1[6]*m2[2]+m1[7]*m2[5]+m1[8]*m2[8]
			];
		}

		Matrix.prototype.det = function()
		{
			var m = this.rawData;

			return m[0]*m[4]*m[8]+m[3]*m[7]*m[2]+m[6]*m[1]*m[5]-m[2]*m[4]*m[6]-m[5]*m[7]*m[0]-m[8]*m[1]*m[3];
		}

		Matrix.prototype.transpose = function()
		{
			var m = this.rawData;

			var data = [
				m[0], m[3], m[6],
				m[1], m[4], m[7],
				m[2], m[5], m[8]
			];

			this.rawData = data;
		}

		Matrix.prototype.invert = function()
		{
			var m, det

			m = this.clone().rawData;
			det = this.det();

			this.rawData = [
				(m[4]*m[8]-m[5]*m[7])/det,
				(m[2]*m[7]-m[1]*m[8])/det,
				(m[1]*m[5]-m[2]*m[4])/det,
				(m[5]*m[6]-m[3]*m[8])/det,
				(m[0]*m[8]-m[2]*m[6])/det,
				(m[2]*m[3]-m[0]*m[5])/det,
				(m[3]*m[7]-m[4]*m[6])/det,
				(m[1]*m[6]-m[0]*m[7])/det,
				(m[0]*m[4]-m[1]*m[3])/det
			];
		}

		Matrix.prototype.toString = function()
		{
			return '['+this.rawData.join(', ')+']';
		}

		return Matrix;
	})();
})(window);