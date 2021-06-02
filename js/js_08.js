var column_list = ["label", "watt", "time", "output"];
var term = ["1日", "1月", "1年"];
var kwh = 26;

// |使用機器 |消費電力|使用時間|電気代  |
// |label    |ele1    |time1   |output1 |
//
// ○i[term]
// [計算|calc]
//
// あなたの家の電気料金は(期間)[term_selected]で
// 合計[sum]円です。

row_count = 3;

function create_cell(col, num) {
    var newcell = document.createElement("td");

    if (col == "label") {
        newcell.innerHTML = "使用機器" + (num + 1);
    } else if (col == "watt") {
        var textform = document.createElement("input")
        textform.setAttribute("type", "text");
        textform.setAttribute("id", "ele" + num);
        newcell.appendChild(textform);
        newcell.appendChild(document.createTextNode("W"));
    } else if (col == "time") {
        var select = document.createElement("select");
        select.setAttribute("id", "time" + num);
        for(var i=0; i<25; i++) {
            var opt = document.createElement("option");
            opt.setAttribute("value", i);
            opt.innerHTML = i;
            select.appendChild(opt);
        }
        newcell.appendChild(select);
        newcell.appendChild(document.createTextNode("時間/日"));
    } else if (col == "output") {
        var textform = document.createElement("input");
        textform.setAttribute("type", "text");
        textform.setAttribute("id", "charge" + num);
        newcell.appendChild(textform);
        newcell.appendChild(document.createTextNode("円/日"));
    }
    return newcell;
}

function create_row(num) {
    var newrow = document.createElement("tr");
    for(var i=0; i < 4; i++) {
        cell = create_cell(column_list[i], num);
        newrow.appendChild(cell)
    }
    return newrow;
}

function create_form(){
    var main_table = document.getElementById("main_table");
    var myform = document.getElementById("myform");
    for(var i=0; i < row_count; i++) {
        main_table.appendChild(create_row(i));
    }

    myform.appendChild(document.createElement("br"));
    myform.appendChild(document.createTextNode("期間:"));

    for(var i=0; i<3; i++) {
        var radio = document.createElement("input");
        radio.setAttribute("name", "term");
        radio.setAttribute("type", "radio");
        if (i == 1){
            radio.setAttribute("checked", true);
        }
        myform.appendChild(radio);
        myform.appendChild(document.createTextNode(term[i]));
    }

    myform.appendChild(document.createElement("br"));

    var calc = document.createElement("input");
    calc.setAttribute("type", "button");
    calc.setAttribute("value", "計算");
    calc.setAttribute("onclick", "calculate();");
    myform.appendChild(calc);
    
    myform.appendChild(document.createElement("br"));
    myform.innerHTML += "あなたの家の電気料金は(期間)";

    var term_selected = document.createElement("input");
    term_selected.setAttribute("type", "text");
    term_selected.setAttribute("name", "term_selected");
    term_selected.setAttribute("id", "term_selected");
    myform.appendChild(term_selected);

    myform.innerHTML += "で<br>合計";

    var sum = document.createElement("input");
    sum.setAttribute("type", "text");
    sum.setAttribute("name", "sum");
    sum.setAttribute("id", "sum");
    myform.appendChild(sum);
    myform.innerHTML += "円です。";
}

function calculate() {
    var sum = 0;
    var term_selected = 0;
    for (var i=0; i < 3; i++) {
        if (document.myform.term[i].checked) {
            document.getElementById("term_selected").value = term[i];
            term_selected = i
        }
    }
    for(var i=0; i < row_count; i++){
        var ele = Number(document.getElementById("ele" + i).value);
        var time = Number(document.getElementById("time" + i).value);
        var sum_dev = ele * time * kwh / 1000;
        document.getElementById("charge" + i).value = sum_dev;
        sum += sum_dev;
    }

    if (term_selected == 0) {
        document.getElementById("sum").value = sum;
    } else if (term_selected == 1) {
        document.getElementById("sum").value = sum * 30;
    } else {
        document.getElementById("sum").value = sum * 30 * 12;
    }
}
