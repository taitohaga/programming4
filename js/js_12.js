// 初期化
console.log("initializing...");

var mouseX = 0;
var mouseY = 0;

document.addEventListener("mousemove", (event) => {
    mouseX = event.pageX / window.innerWidth;
    mouseY = event.pageY / window.innerHeight;
});

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, 1000 / 500, 0.1, 10000);
var renderer = new THREE.WebGLRenderer();

// 環境光
var light = new THREE.AmbientLight(0xffffff, 1.0);

// rendererの設置
renderer.setSize(1000, 500);
document.body.appendChild(renderer.domElement);

// lightの追加
light.position.set(0, 1000, 0);
scene.add(light);

// カメラをセッティング
camera.position.set(0, 0, 2000);


function camera_move() {
    var rot = mouseX * 2 * Math.PI;
    var h = mouseY * 2000 - 1000;

    camera.position.set(r_camera * Math.cos(rot), h, r_camera * Math.sin(rot));
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}


var r_camera = 2000;

var sun = getTexture('sun.jpg', geometry='sphere', size=[200, 10, 10]);
var r_sun = 1500;
sun.position.set(0, 0, 0);
scene.add(sun);

var earth = getTexture('earth.jpg', geometry='sphere', size=[100, 10, 10]);
var r_earth = 800;
earth.position.set(r_earth, 0, 0);
sun.add(earth);

var moon = getTexture('moon.jpg', geometry='sphere', size=[70, 10, 10]);
var r_moon = 400;
moon.position.set(r_moon, 0, 0);
earth.add(moon);

var point_light = new THREE.PointLight(0xffffff, 3, 2000, 1.0);
point_light.position.set(0, 0, 0);
moon.add(point_light);

console.log("successfully initialized.");

var theta = 0.0


function draw() {
    // レンダリングループ
    camera_move();

    sun.position.set(r_sun * Math.cos(theta * 1), 0, r_sun * Math.sin(theta * 1));
    earth.position.set(r_earth * Math.cos(theta * 2.0), 0, r_earth * Math.sin(theta * 2.0));
    moon.position.set(r_moon * Math.cos(theta * 3.0), 0, r_moon * Math.sin(theta * 3.0));

    sun.rotation.y += 0.1;
    earth.rotation.y += 0.1;
    moon.rotation.y += 0.1;


    theta += 0.01;
    requestAnimationFrame(draw);
    renderer.render(scene, camera);
}

console.log("draw");
draw();
