import { Vector2 } from "three";

const CustomPass = {

    uniforms: {

        "tDiffuse": { value: null },
        "time": { value: 0 },
        "scale": { value: 0 },
        "progress": { value: 0 },
        "tSize": { value: new Vector2( 256, 256 ) },
        "center": { value: new Vector2( 0.5, 0.5 ) },
        "angle": { value: 1. },
        },

        vertexShader:
        `
        varying vec2 vUv;
        void main() {

            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(
                position, 1.0 );
        }`,

        fragmentShader: `

        uniform vec2 center;
        uniform float angle;
        uniform float time;
        uniform float scale;
        uniform float progress;
        uniform vec2 tSize;

        uniform sampler2D tDiffuse;

        varying vec2 vUv;

        float pattern() {

                float s = sin( angle ), c = cos( angle );

                vec2 tex = vUv * tSize - center;
                vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c *
                    tex.y ) * scale;

                    return ( sin( point.x ) * sin( point.y ) ) * 4.0;
        }

        void main() {


            
            vec2 newUV = vUv;

             newUV = vUv + 0.1*vec2( sin(10.*vUv.x), sin(10.*vUv.y) );
            
           

            
            vec2 p = 2.*vUv - vec2(1.);

            float scale = 1.;

             p+= 0.1*cos(scale*9.5*p.yx + 1.1*time + vec2(2.2, 29.4));
             p+= 0.1*cos(scale*8.7*p.yx + 1.4*time + vec2(15.2, 18.4));
             p+= 0.1*cos(scale*5.1*p.yx + 2.6*time + vec2(15.2, 12.4));
             p+= 0.1*cos(scale*9.5*p.yx + 1.1*time + vec2(2.2, 29.4));
             p+= 0.1*cos(scale*9.1*p.yx + 3.6*time + vec2(10.2, 28.4));
             p+= 0.1*cos(scale*9.7*p.yx + 1.4*time + vec2(25.2, 30.4));
             p+= 0.1*cos(scale*8.7*p.yx + 2.4*time + vec2(60.2, 60.2));
             p+= 0.1*cos(scale*9.5*p.yx + 1.1*time + vec2(2.2, 29.4));
             // Nuevos vectores hacia la derecha
             p += 0.1 * cos(scale * 9.5 * p.yx + 1.1 * time + vec2(80.2, 50.4));
             p += 0.1 * cos(scale * 7.5 * p.yx + 0.9 * time + vec2(65.2, 40.4));
             p += 0.1 * cos(scale * 6.5 * p.yx + 1.6 * time + vec2(100.2, 45.4));
             // Nuevos vectores más cercanos a las esquinas derechas
             p += 0.1 * cos(scale * 9.5 * p.yx + 1.1 * time + vec2(0.8, 0.9));
             p += 0.1 * cos(scale * 7.5 * p.yx + 0.9 * time + vec2(0.7, 0.6));
             p += 0.1 * cos(scale * 6.5 * p.yx + 1.6 * time + vec2(0.9, 0.5));


            newUV.x = mix( vUv.x, length(p), progress );
            newUV.y = mix(vUv.y, 0.5, progress);
            
            vec4 color = texture2D( tDiffuse, newUV );

            gl_FragColor = color;
            //gl_FragColor = vec4(length(p),0.,0.,1.);


        }`

};

export { CustomPass };