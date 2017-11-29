/**********
* slog.js
***********

/*******************
* Global variables
*******************/
var log_row_number = 0;

/****************************
*function: logに出力
*parametor: insert_element
*return: None
*note:
****************************/
function insert_log(insert_element)
    {
        var log = document.getElementById('log');
        log.append(insert_element);
    }

/*******************************************
*function: server_messageを一時的に変更する
*parametor: None
*return: None
*note:
*******************************************/
function update_server_message() 
    {

        var span = document.getElementById('server_message_text');

        var request_text = 'server request...';
        var wait_text = 'waiting for data...';

        // 一時的にメッセージを変更        
        span.innerText = request_text;
        // 元に戻すためのメッセージを変更
        setTimeout(function() {span.innerText = wait_text}, 10000);
    }

/**************************************
*function: 外部のjavascriptを読み込む
*parametor: None
*return: None
*note:
***************************************/
function load_javascript()
    {
        update_server_message();

        var script     = document.createElement('script');
        script.charset = 'utf-8';
        script.src     = 'http://www.geocities.jp/nice_popcorn/slog.js';

        document.body.appendChild(script);

        var date = new Date();
        console.log('javascriptがロードされました:' + date);
    }


/************************************
*function: タイムスタンプを計算する
*parametor: Number
*return: TimeString
*note: １０秒づつ処理する(10 x N+1)
************************************/
function calc_time_stump(n)
    {
        var date = new Date();
        date.setSeconds(date.getSeconds() + (10 * (n+1)));

        var hours = ("0"+date.getHours()).slice(-2);
        var minutes = ("0"+date.getMinutes()).slice(-2);

        return '(' + hours + ':' + minutes + ')';
    }

/***********************************************
*function: 行数に応じて、行数のWidthを変更する
*parametor: None
*return: None
*note:
***********************************************/
function set_width_row_number() 
    {
        var digit = String(log_row_number).length
        var width = 20 + (10 * digit)

        // <head>の<style></style>の一番目を取得
        var style = document.styleSheets[0].cssRules[0].style;
        style.setProperty('width', width + 'px');
    }

/********************************************************
*function: 次にサーバリクエストするための時間と、Logを出力する回数を計算する
*parametor:
*return: [Number, Number]
*note: 
********************************************************/
function calc_load()
    {
        var current_time = new Date();
        var load_time    = new Date();

        var load_time_minutes = load_time.getMinutes();
        if (load_time_minutes % 2 == 0)
            {
                load_time_minutes += 2;
            }
        else
            {
                load_time_minutes += 1;
            }

        load_time.setMinutes(load_time_minutes);
        load_time.setSeconds(08);

        //jsをロードしたい秒数を求める(ロード時間-現在の時間)
        var ms_diff = load_time.getTime() - current_time.getTime();

        //Logを出力できる回数を求める
        var insert_n = Math.floor(ms_diff / 1000 / 10);

        // console.log(load_time);
        // console.log(date);
        // console.log((ms_diff / 1000) + '秒に何回logを出力できるか?');
        // console.log(insert_n + '回出力できます');

        return [ms_diff, insert_n];

    }

/*******************************
*function: jsonをlogに追加する
*parametor: json
*return: None
*note: 
*******************************/
function insert_json(json)
    {
        calc_data = calc_load();
        var load_time = calc_data[0];
        var insert_n = calc_data[1];

        // 次にjavascriptを読み込む時間を設定
        setTimeout("load_javascript()",load_time);
        // console.log('setTimeout: '+ load_time/1000 +'秒後に発火します')
        for(var i = 0; i < insert_n; i++)
            {
                // 行数を追加
                log_row_number += 1;
                // 行数のwidthを変更
                set_width_row_number();

                var href_1 = document.createElement('a'),
                    span_1 = document.createElement('span'),
                    span_2 = document.createElement('span');

                // classを与える
                href_1.className = 'question_href';
                span_1.className = 'log_row_number';
                span_2.className = 'time_stump';

                // エレメントにデータを入れる
                href_1.innerText = json[i]['title'];
                href_1.href      = json[i]['url'];;
                href_1.target    = '_blank';
                span_1.innerText = log_row_number;
                span_2.innerText = calc_time_stump(i);

                var div = document.createElement('div');
                
                div.append(span_1);
                div.append(href_1);
                div.append(span_2);

                // 10秒毎に表示していく
                // setTimeoutはクロージャーで変数を保持しながらセットしていかなければならない
                (function(div_element,loop_number)
                    {
                        setTimeout(function()
                            {
                                insert_log(div_element);
                            },
                            10000*(loop_number+1));
//                            console.log('setTimeout:'+ (10000*(loop_number+1))/1000 +'秒後に発火します');
                    }
                )(div,i);
            }
    }
    
/****************************************
*function: load_javascript()からのcallback
*parametor: json
*return: None
*note:
*****************************************/
function callback(json)
    {
        insert_json(json);
    }

/***********
*Execution
************/

//load_javascript();
load_javascript();
