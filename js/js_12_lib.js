console.log('library');

// l 13: texture_imgを渡して球を取得する
function getTextureLoader(
    texture_img,
    geometry='sphere', 
    size=[300, 10, 10], 
    side=false
) {
    var material;
    if (side) {
        material = new THREE.MeshStandardMaterial({map: texture_img, side: THREE.DoubleSide});
    } else {
        material = new THREE.MeshStandardMaterial({map: texture_img});
    }
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
// テクスチャを持つ物体を追加
function getTexture(
        URL='https://www.gakujutsu.co.jp/text/isbn978-4-7806-0708-6/file/', 
        texture='brick.jpg', 
        geometry='sphere', 
        size=[300, 10, 10], 
        side=false) {
    var loader = new THREE.TextureLoader();
    var texture_img = loader.load(URL +texture);

    var material;
    if (side) {
        material = new THREE.MeshStandardMaterial({map: texture_img, side: THREE.DoubleSide});
    } else {
        material = new THREE.MeshStandardMaterial({map: texture_img});
    }
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


// 物体検出関数の作成
function detectObject(camera, target_list, exception, u, v) {
    var vector = new THREE.Vector3( u, v ,1);
    vector.unproject(camera);
    var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position).normalize() );
    var obj_list= ray.intersectObjects( target_list);
    for (var j=0 ; j<obj_list.length; j++){
        if (obj_list[j].object != exception  ){
            return obj_list[j].object;
        }
    }

    return null;
}
