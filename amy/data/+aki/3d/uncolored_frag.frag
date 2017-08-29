uniform sampler2D tex;

varying vec2 v_uv;

void main() 
{
	// calc color
	vec4 finalColor = texture2D(tex,v_uv);

	// color fragment
	gl_FragColor = finalColor;
}

