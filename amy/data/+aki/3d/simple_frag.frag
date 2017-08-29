uniform sampler2D tex;

varying vec4 v_color;
varying vec2 v_uv;

void main() 
{
	// calc color
	vec4 finalColor = texture2D(tex,v_uv);

	// color fragment
	gl_FragColor = v_color * finalColor;
}

