// thanks to "http://www.clockworkcoders.com/oglsl/tutorial5.htm"
// also "http://pages.cpsc.ucalgary.ca/~brosz/wiki/pmwiki.php/CSharp/08022008"
// also "http://www.ozone3d.net/tutorials/glsl_lighting_phong_p2.php"

uniform vec3 aki_cameraPosition;

uniform sampler2D aki_diffuseTex;
uniform sampler2D aki_specularTex;
uniform sampler2D aki_emmissionTex;
uniform sampler2D aki_normalTex;

varying vec3 v_normal;
varying vec3 v_tangent;
varying vec3 v_binormal;

varying vec3 v_pos;
varying vec4 v_color;
varying vec2 v_uv;

vec3 f_norm;
vec4 amb = vec4(0,0,0,0);
vec4 diff = vec4(0,0,0,0);
vec4 spec = vec4(0,0,0,0);

varying vec3 lightDirection;
varying vec3 lightToVert;
varying float lightDistance;

void directionalLight( in float intensity )
{
	float NdotL, NdotHV;

	if( lightDistance > 0 )
	{
		float attenuationDenominator = (gl_LightSource[0].constantAttenuation +
										gl_LightSource[0].linearAttenuation * lightDistance +
										gl_LightSource[0].quadraticAttenuation * lightDistance * lightDistance);

		if( attenuationDenominator != 0 ) intensity /= attenuationDenominator;
	}

	amb += gl_FrontLightProduct[0].ambient;

	NdotL = max( dot(f_norm, normalize(lightToVert)), 0.0 );
	if( NdotL > 0.0 )
	{
		diff += gl_FrontLightProduct[0].diffuse * NdotL * intensity;

		vec3 reflection = normalize(reflect(lightToVert, f_norm));
		NdotHV = max(dot(normalize(v_pos + aki_cameraPosition), reflection),0.0);
		spec += gl_FrontLightProduct[0].specular * pow(NdotHV,gl_FrontMaterial.shininess*0.3) * intensity;
	}
}

void spotLight()
{
	float spotCosCutoff = cos(gl_LightSource[0].spotCutoff*3.1415/180); // for some reason: gl_LightSource[0].spotCosCutoff doesnt work
	float dotProd = dot(lightDirection, -lightToVert);

	if ( dotProd > spotCosCutoff ) // for some reason: gl_LightSource[0].spotCosCutoff doesnt work
	{
		float intensity = 1.0;
		float percent = (dotProd - spotCosCutoff) / (1.0 - spotCosCutoff);
		float innerPercent = (gl_LightSource[0].spotExponent / 128.0);

		// this somewhat more closely emulates regular openGL - still not quite
		innerPercent *= innerPercent;

		if( innerPercent > 0 && percent < innerPercent )
		{
			intensity = percent / innerPercent;
		}
		directionalLight( intensity );
	}
}

void main() 
{
	vec4 localNorm = texture2D(aki_normalTex,v_uv) * 2 - 1;
	f_norm = v_tangent * localNorm.x + 
			 v_binormal * localNorm.y +
		     v_normal * localNorm.z;

	spotLight();

	// gl_FrontLightModelProduct.sceneColor: emission + ambient * global scene ambience
	// as such, i want to remove emission, so we can add that seperately
	vec4 emsn = gl_FrontMaterial.emission;
	vec4 baseColor = gl_LightModel.ambient * gl_FrontMaterial.ambient;

	vec4 matColor = (baseColor + amb + diff) * texture2D(aki_diffuseTex,v_uv);
	matColor += spec * texture2D(aki_specularTex,v_uv);
	matColor += emsn * texture2D(aki_emmissionTex,v_uv);

	gl_FragColor = v_color * matColor;
}

