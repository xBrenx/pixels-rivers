varying vec2 vUv;

void main(){
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);

    //gl_PointSize = 2000. * (1. / - mvPosition.z);
     gl_PointSize = 10.0;  // Tamaño constante para los puntos
    mvPosition.xy *= vec2(1.5);  // Aumentar el ancho ocupado por los puntos

     // Mover los puntos hacia la derecha
    mvPosition.x += 3.9;  // Puedes ajustar el valor según tu preferencia

    gl_Position = projectionMatrix * mvPosition;
}