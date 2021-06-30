// テクスチャを持つ物体を追加
function getTexture(texture='brick.jpg', geometry='sphere', size=[300, 10, 10]) {
    var URL = 'https://www.gakujutsu.co.jp/text/isbn978-4-7806-0708-6/file/';
    var loader = new THREE.TextureLoader();
    var texture_img = loader.load(URL +texture);
    var material = new THREE.MeshStandardMaterial({map: texture_img});
    console.log(geometry);
    if (geometry == 'sphere') {
        var geometry = new THREE.SphereGeometry(size[0], size[1], size[2]);
        var sphere = new THREE.Mesh(geometry, material);
        return sphere
    } else if (geometry == 'cube') {
        var geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
        var cube = new THREE.Mesh(geometry, material);
        return cube
    }
}

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
