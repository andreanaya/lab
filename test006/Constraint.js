(function(window)
{
	window.Constraint = (function()
	{
		function Constraint(particleA, particleB, length)
		{
			this.particleA = particleA;
			this.particleB = particleB;
			
			this.dx = this.particleA.x - this.particleB.x;
			this.dy = this.particleA.y - this.particleB.y;
			this.dz = this.particleA.z - this.particleB.z;
			this.length = length || Math.sqrt(this.dx * this.dx + this.dy * this.dy + this.dz * this.dz);
		}

		Constraint.prototype.update = function()
		{
			var length = this.length;
			
			var xa = this.particleA.x;
			var ya = this.particleA.y;
			var za = this.particleA.z;
			
			var xb = this.particleB.x;
			var yb = this.particleB.y;
			var zb = this.particleB.z;
			
			var dx = xb-xa;
			var dy = yb-ya;
			var dz = zb-za;
			
			var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
			
			var diff = length-dist;
			
			var offset = .5*diff/dist;
			
			var offsetX = dx*offset;
			var offsetY = dy*offset;
			var offsetZ = dz*offset;
			
			if(!this.particleA.fixed)
			{
				this.particleA.x = xa-offsetX;
				this.particleA.y = ya-offsetY;
				this.particleA.z = za-offsetZ;
			}
			
			if(!this.particleB.fixed)
			{
				this.particleB.x = xb+offsetX;
				this.particleB.y = yb+offsetY;
				this.particleB.z = zb+offsetZ;
			}
		}

		return Constraint;
	})();

})(window);