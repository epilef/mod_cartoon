#version 120
#pragma debug(on)

varying float vertexDistance;
varying vec3 normal, lightDir, eyeVec;

uniform sampler2D Texture0;
uniform sampler2D Texture1;
uniform vec4 teamcolour;
uniform int tcmask;
uniform int fogEnabled;

void main(void)
{
	vec4 mask, colour;
	vec4 light = (gl_FrontLightModelProduct.sceneColor * gl_FrontMaterial.ambient) + (gl_LightSource[0].ambient * gl_FrontMaterial.ambient);
	light += gl_LightSource[0].diffuse * gl_FrontMaterial.diffuse * 0.8;

	// Get color from texture unit 0, merge with lighting
	colour = texture2D(Texture0, gl_TexCoord[0].st) * light;

	if (tcmask == 1)
	{
		// Get tcmask information from texture unit 1
		mask = texture2D(Texture1, gl_TexCoord[0].st);
	
		// Apply color using grain merge with tcmask
		gl_FragColor = (colour + (teamcolour - 0.5) * mask.a) * gl_Color;
	}
	else
	{
		gl_FragColor = colour * gl_Color;
	}

	//if (fogEnabled > 0)
	{
		// Calculate linear fog
		float fogFactor = (1.8*gl_Fog.end - vertexDistance) / (1.8*gl_Fog.end - 1.8*gl_Fog.start);
		fogFactor = clamp(fogFactor, 0.0, 1.0);
	
		// Return fragment color
		gl_FragColor = mix(vec4(0.1, 0.05, 0.01, 1.0), gl_FragColor, fogFactor);
	}
}
