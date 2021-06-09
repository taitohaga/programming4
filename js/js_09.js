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
target_url = "https://www.gakujutsu.co.jp/text/isbn978-4-7806-0708-6/file/testbook.csv";
data = getCSV(target_url);
n_records = data.length - 1;

// dataから目的のデータを取り出す
function query_by_id(id=undefined) {
    if (id != undefined ) {
        return data[Number(id)];
    }
    return undefined;
}

// 年齢を絞ってリストを取り出す
function query_by_range(age=[0, 100]) {
    var result = new Array();
    var num = 0;
    for (var i = 0; i < n_records; i++) {
        if (age[0] <= Number(data[i][1]) && Number(data[i][1]) <= age[1]) {
            result[num] = data[i];
            num++;
        } 
    }
    return result;
}

// 最大、最小、平均を計算する
function calc_summary() {
    var sum = 0;
    var min = 999999;
    var max = -999999;
    for (var i = 0; i < n_records; i++) {
        var num = Number(data[i][1]);
        sum += num;
        if (num < min) {
            min = num;
        }
        if (num > max) {
            max = num;
        }
    }
    var mean = sum / n_records;
    return {"max": max, "min": min, "mean": mean};
}

// 最大、最小、平均を表示する
function summary() {
    fm.txt1.value = "";
    data_summary = calc_summary();
    fm.txt1.value += "最大: " + data_summary["max"] + "\n";
    fm.txt1.value += "最小: " + data_summary["min"] + "\n";
    fm.txt1.value += "平均: " + data_summary["mean"] + "\n";
}

// データを読み込む    
function read() {
    result = query_by_range(age=[fm.age_0.value, fm.age_1.value]);
    for (var i = 0; i < result.length; i++) {
        fm.txt1.value += "氏名: " + result[i][0] + ", 年齢: " + result[i][1] + ", 番号: " + result[i][2];
    }
}
