varying vec3 v_pos;
varying vec4 v_color;
varying vec2 v_uv;

void main()
{ 
	v_uv = gl_MultiTexCoord0.st; 
	v_color = gl_Color;

	v_pos = vec3(gl_ModelViewMatrix * gl_Vertex);

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
