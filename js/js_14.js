var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(70, 1000/500, 0.1, 10000);
var renderer = new THREE.WebGLRenderer();
var loader = new THREE.TextureLoader();
renderer.setSize(1000, 500);
document.body.appendChild(renderer.domElement);

var light = new THREE.AmbientLight(0xFFFFFF, 2.0);
scene.add(light);


function getVector(loc, width, height) {
    var res = convertLocation(loc, width, height);
    console.log(res);
    res = rad(res);
    console.log(res);
    res = vec(res);
    console.log(res);
    return res;
}


function get_annot_locations() {
    var annot_locations = [];
    annot_locations.push([5188, 2281]);
    annot_locations.push([8877, 2281]);
    annot_locations.push([9146, 2281]);
    return annot_locations;
}
var annot_locations = get_annot_locations();
var img_size = [[10240, 5120], [10240, 5120], [9980, 5315]];

for (var i = 0; i < annot_locations.length; i++) {
    annot_locations[i] = getVector(annot_locations[i], img_size[i][0], img_size[i][1]);
}

console.log(annot_locations);

function setLocations() {
    var locations = [];
    locations.push([0, 0, 0]);
    locations.push([500, 0, 0]);
    locations.push([1000, 0, 0]);
    return locations
}
var locations = setLocations();


function get_textures() {
    var url = './views/';
    var texture = [];
    var loader = new THREE.TextureLoader();
    texture.push(loader.load(url + 'v1.jpg'));
    texture.push(loader.load(url + 'v2.jpg'));
    texture.push(loader.load(url + 'v3.jpg'));
    return texture
}
var texture = get_textures();
console.log(texture);


function get_annotations() {
    var url = './views/';
    var texture = [];
    var loader = new THREE.TextureLoader();
    texture.push(loader.load(url + 'a1.png'));
    texture.push(loader.load(url + 'a2.png'));
    texture.push(loader.load(url + 'a3.png'));
    return texture
}
var annotations = get_annotations();


var spheres = [];
for (var i = 0; i < texture.length; i++) {
    var sp = getTextureLoader(texture[i], 'sphere', [30, 30, 30], true);
    sp.position.set(locations[i][0], locations[i][1], locations[i][2]);
    scene.add(sp);
    spheres.push(sp);
}
spheres[0].rotation.y = Math.PI / 2;
spheres[1].rotation.y = Math.PI;
spheres[2].rotation.y = Math.PI;


var tannotations = [];
for (var i = 0; i < annotations.length; i++) {
    var an = getTextureLoader(annotations[i], 'cube', [7, 3, 0.01]);
    an.position.set(annot_locations[i][0] * 20, annot_locations[i][1] * 20, annot_locations[i][2] * 20);
    an.lookAt(new THREE.Vector3(0, 0, 0));
    spheres[i].add(an);
}

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
