// 外部のCSVファイルを読み込む
function getCSV(file) {
    var req = new XMLHttpRequest();
    req.open("get", file, false);
    req.send();
    var tmp = req.responseText.split("\n");
    var result = new Array();
    for(var i=0; i < tmp.length; i++){
        result[i] = tmp[i].split(",");
    }
    return result;
}



// CSVファイルをテキストとしてダウンロードさせる
function downloadText( name, content ) {
    var blob = new Blob([ content ], { "type" : "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.target = '_blank';
    a.download = name;a.click();
}

// URL, CSVデータ, 長さ
target_url = "https://www.gakujutsu.co.jp/text/isbn978-4-7806-0708-6/file/oneyear.csv";
data = getCSV(target_url);
data.shift(); //ヘッダーを消去
data.shift(); //ヘッダーを消去
n_records = data.length - 1;
n_columns = data[0].length;

var locations = ["hikone", "naha", "abashiri"];
var locations_kanji = ["彦根", "那覇", "網走"];
var items = ["sunlight", "rain", "temperature", "snow"];
var items_kanji = ["日照時間", "降水量", "気温", "積雪量"];
var items_unit = ["時間", "mm", "℃", "cm"];

// ****/**/**から月を取得
function get_month(raw="") {
    nums = raw.split("/");
    return Number(nums[1]);
}


// 指定された期間のすべての列の平均を計算
function calculate_whole(period=[1, 12]) {
    var sums = new Array();
    for (var i = 0; i < n_columns - 1; i++) {
        sums[i] = 0;
        var count = 0;
        for (var j = 0; j < n_records; j++) {
            if (period[0] <= get_month(data[j][0]) && get_month(data[j][0]) < period[1]) {
                sums[i] += Number(data[j][i + 1]);
                count++;
            }
        }
        sums[i] = sums[i] / count;
    }
    return sums;
}


// 実行
function execute() {
    var mean_list = calculate_whole(period=[fm.start.value, fm.end.value]);
    console.log(mean_list);
    var output = "";
    for (var i = 0; i < locations.length; i++) {
        for (var j = 0; j < items.length; j++) {
            if (fm[locations[i]].checked && fm[items[j]].checked) {
                output += locations_kanji[i] + "の平均" + items_kanji[j] + "は" + mean_list[i * 4 + j].toFixed(2) + items_unit[j] + "\n";
            }
        }
    }
    fm.results.value = output;
}
