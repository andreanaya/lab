(function(window)
{
	window.Particle = (function()
	{
		function Particle(x, y, z, fixed)
		{
			setPosition(x, y, z);

			this.fixed = fixed || false;
		}

		Particle.prototype.setPosition = function(x, y, z)
		{
			this.oldX = this.x = x || 0;
			this.oldY = this.y = y || 0;
			this.oldZ = this.z = z || 0;
		}

		Particle.prototype.update = function()
		{
			var tempX, tempY, tempZ, oldX, oldY, oldZ;
			
			var x, y, z

			x = this.x;
			y = this.y;
			z = this.z;
			
			oldX = this.oldX;
			oldY = this.oldY;
			oldZ = this.oldZ;
			
			if(!this.fixed)
			{
				tempX = x;
				tempY = y;
				tempZ = z;
				
				x = 2*x - oldX;
				y = 2*y - oldY;
				z = 2*z - oldZ;
				
				oldX = tempX;
				oldY = tempY;
				oldZ = tempZ;
			}
			
			this.x = x;
			this.y = y;
			this.z = z;
			
			this.oldX = oldX;
			this.oldY = oldY;
			this.oldZ = oldZ;
		}

		return Particle;
	})();

})(window);