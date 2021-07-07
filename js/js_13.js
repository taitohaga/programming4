var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, 1000/500, 0.1, 10000);
var renderer = new THREE.WebGLRenderer();
var loader = new THREE.TextureLoader();
renderer.setSize(1000, 500);
document.body.appendChild(renderer.domElement);

var light = new THREE.AmbientLight(0xFFFFFF, 2.0);
scene.add(light);

function setLocations() {
    var locations = [];
    locations.push([0, 0, 0]);
    locations.push([-500, 0, 0]);
    locations.push([-1000, 0, 1000]);
    locations.push([-1000, 0, 2500]);
    return locations
}
var locations = setLocations();


function get_textures() {
    var url = 'https://www.gakujutsu.co.jp/text/isbn978-4-7806-0708-6/file/';
    var texture = [];
    var loader = new THREE.TextureLoader();
    texture.push(loader.load(url + '1.jpg'));
    texture.push(loader.load(url + '2.jpg'));
    texture.push(loader.load(url + '3.jpg'));
    texture.push(loader.load(url + '4.jpg'));
    return texture
}
var texture = get_textures();


var spheres = [];
for (var i = 0; i < texture.length; i++) {
    var sp = getTextureLoader(texture[i], 'sphere', [30, 30, 30], true);
    sp.position.set(locations[i][0], locations[i][1], locations[i][2]);
    scene.add(sp);
    spheres.push(sp);
}
console.log(spheres);
spheres[2].rotation.y = Math.PI / 2;
spheres[3].rotation.y = Math.PI / 2;

var current = spheres[0];
current.scale.set(100, 100, 100);


var mouseX = 0;
var mouseY = 0;
var mouseB = 0;
var u = 0;
var v = 0;

document.addEventListener("mousemove", (event) => {
    var rect = event.target.getBoundingClientRect();
    u = (event.clientX - rect.left) * 2 / (rect.right - rect.left) - 1;
    v = (event.clientY - rect.top) * 2 / (rect.top - rect.bottom) + 1;
    mouseX = event.clientX;
    mouseY = event.clientY;
});
document.addEventListener("mousedown", (event) => {
    mouseB = 1;
});
document.addEventListener("mouseup", (event) => {
    mouseB = 0;
});

var rot = 0;
var h =0;
var pmouseX = 0;
var pmouseY = 0;
var pmouseB = 0;


function action() {

    if (mouseB == 1 && pmouseB == 0) {
        var obj = detectObject(camera, spheres, current, u, v);
        if (obj != null) {
            current.scale.set(1, 1, 1);
            obj.scale.set(100, 100, 100);
            camera.position.set(obj.position.x, obj.position.y, obj.position.z); 
            current = obj;
            console.log(current.position.x);
            console.log(current.position.y);
        }
    }
}


function move_view() {
    if (mouseB == 1) {
        rot -= (pmouseX - mouseX) * 0.005;
        h -= (pmouseY - mouseY) * 0.005;

        if (h >= Math.PI/2) h = Math.PI/2;
        if (h <= -Math.PI/2) h = -Math.PI/2;
    }
    pmouseX = mouseX;
    pmouseY = mouseY;
    pmouseB = mouseB;

    camera.lookAt(new THREE.Vector3(Math.sin(rot) * 10000, Math.sin(h) * 10000, Math.cos(rot) * 10000));
}


function draw() {
    action();
    move_view();
    requestAnimationFrame(draw);
    renderer.render(scene, camera);
};

draw();
