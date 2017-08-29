varying vec3 v_pos;
varying vec2 v_uv;

void main()
{ 
	v_uv = gl_MultiTexCoord0.st; 

	v_pos = vec3(gl_ModelViewMatrix * gl_Vertex);

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
