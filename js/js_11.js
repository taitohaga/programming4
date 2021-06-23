// 初期化console.log("initializing...");

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, 1000 / 500, 0.1, 10000);
var renderer = new THREE.WebGLRenderer();
var light = new THREE.DirectionalLight(0xffffff);

// rendererの設置
renderer.setSize(1000, 500);
document.body.appendChild(renderer.domElement);

// lightの追加
light.position.set(0, 1000, 0);
scene.add(light);

// カメラをセッティング
camera.position.set(0, 0, 2000);


// 立方体を追加
function add_cube(size=[0, 0, 0], position=[0, 0, 0], color=0xffffff){
    var geometry = new THREE.BoxGeometry(size[0], size[1], size[2]); //w, h, d
    var material = new THREE.MeshStandardMaterial({color: color});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(position[0], position[1], position[2]);
    return cube
}


// 球体を追加
function add_sphere(size=[300, 10, 10], position=[0, 0, 0], color=0xffffff){
    var geometry = new THREE.SphereGeometry(size[0], size[1], size[2]); //w, h, d
    var material = new THREE.MeshStandardMaterial({color: color});
    var sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position[0], position[1], position[2]);
    return sphere
}


// 乱数を取得
function get_random(min=0, max=1) {
    return Number(min + Math.random() * (max - min));
}


var r = 500
var theta = 0.0;

var satellite0 = add_sphere([80, 10, 10], [r, 0, 0], 0xff0000);
var satellite1 = add_sphere([80, 10, 10], [0, r, 0], 0x00ff00);
var satellite2 = add_sphere([80, 10, 10], [0, 0, r], 0x0000ff);
scene.add(satellite0);
scene.add(satellite1);
scene.add(satellite2);

var max_meteors = 500;
var capacity = 10;
var meteor = [];
var speed = [];
var flying = [];
for (var i = 0; i < max_meteors; i++){
    meteor[i] = add_sphere([10, 10, 10], [get_random(-1000, 1000), get_random(-500, 500), -5200], 0xffffff);
    flying[i] = false;
    speed[i] = get_random(5, 40);
    scene.add(meteor[i]);
}


function meteor_set(i) {
    meteor[i].position.set(get_random(-1000, 1000), get_random(-500, 500), 5000);
    speed[i] = get_random(30, 100);
    flying[i] = true;
}

function meteor_shoot_break() {
    var meteor_count = 0;
    var shot = 0;
    for (var i = 0; i < max_meteors; i++) {
        if (!flying[i] && shot <= capacity) {
            meteor_set(i);
            shot++;
        }
    }
    for (var i = 0; i < max_meteors; i++) {
        if (flying[i]) {
            meteor_count++;
        }
        if (meteor[i].position.z < -5020) {
            flying[i] = false;
        }
    }

    console.log(meteor_count);
    
}

function meteor_move() {
    for (var i= 0; i< max_meteors; i++) {
        if (flying[i]) {
            meteor[i].position.z -= speed[i];
        }
    }
}

var count = 0;


console.log("successfully initialized.");


function draw() {
    // レンダリングループ

    satellite0.position.set(r * Math.cos(theta * 1.5), r * Math.sin(theta * 1.5), 0);
    satellite1.position.set(0, r * Math.cos(theta * 1), r * Math.sin(theta * 1));
    satellite2.position.set(r * Math.cos(theta * 0.5), 0, r * Math.sin(theta * 0.5));

    meteor_move();
    meteor_shoot_break();
    count = (count + 1) % 5

    theta += 0.05;
    requestAnimationFrame(draw);
    renderer.render(scene, camera);
}

console.log("draw");
draw();
