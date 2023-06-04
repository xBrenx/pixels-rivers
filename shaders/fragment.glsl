
uniform float time;
uniform float progress;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.14159;
void main(){
    vec4 color = texture2D(uTexture, vUv);

    
    gl_FragColor = color;
}