let shouwaEnd = new Date("1989/01/08").getTime();
let heiseiEnd = new Date("2019/05/01").getTime();
$(() => {
    fp = flatpickr("input.date-input:not(.flatpickr-input)", {
        dateFormat: "Y/m",
        formatDate: (date, format, locale) => {
            let timeInMini = date.getTime();
            let offset = 2018;
            let genngo = "令和";
            if (timeInMini < shouwaEnd) {
                offset = 1925;
                genngo = "昭和";
            }
            if (timeInMini < heiseiEnd) {
                offset = 1988;
                genngo = "平成";
            }
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            //const day = date.getDate();
            const reiwaYear = year - offset;
            return genngo + `${reiwaYear}年${month}月`;
        },
    });

    let year = new Date().getFullYear();
    let mon = new Date().getMonth();
    let day = new Date().getDate();
    $("#or_now").text(
        "令和 " + (year - 2018) + " 年 " + (mon + 1) + " 月 " + day + " 日"
    );
    flatpickr("#or_birthdate", {
        dateFormat: "Y 年 m 月 d 日", // 显示为 2025-09-15
    });

    let t = new Date().toISOString().split("T")[0];
    $("#d").val(t);
    // Initialize language selector if present
    const $langSel = $("#lang");
    if ($langSel.length) {
        $langSel.val(getLang());
        $langSel.on("change", function () {
            setLang(this.value);
            applyTranslations();
        });
    }
    // Load i18n data then apply
    loadI18n().then(applyTranslations);

    $("#b").on("change", function () {
        let bd = new Date($(this).val()),
            td = new Date();
        let age = td.getFullYear() - bd.getFullYear();
        let md = td.getMonth() - bd.getMonth();
        if (md < 0 || (md === 0 && td.getDate() < bd.getDate())) age--;
        $("#a").val(age);
    });
    $("#or_picture").on("change", function (e) {
        let file = e.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let img = $("<img>").attr("src", e.target.result);
                let input = $("#or_picture").detach();
                $(".photo-section").empty().append(img);
                $(".photo-section").parent().append(input);
            };
            reader.readAsDataURL(file);
        }
    });
});

function addHistory() {
    $("#or_history").append(
        `<tr><td class="date-col"> <input type="text" class="date-input" placeholder="年　月" /> </td> <td class="description-col"> <div class="description-input" contenteditable="true" ></div> </td> <td style="width: 60px; text-align: center"> <button class="btn btn-remove" onclick="removeHistory(this)" >削除</button> </td></tr>`
    );
    fp = flatpickr("input.date-input:not(.flatpickr-input)", {
        dateFormat: "Y/m/d", // 显示为 2025-09-15
    });
}
function removeHistory(b) {
    if ($("#or_history tr").length > 1) $(b).closest("tr").remove();
    else alert("最低1つの項目は必要です。");
}
function al() {
    $("#l").append(
        `<tr><td class="date-col"><input type="text" class="date-input" placeholder="年　月"></td><td class="description-col"><textarea class="description-input" placeholder="取得した資格・免許を入力してください"></textarea></td><td style="width:60px;text-align:center;"><button class="btn btn-remove" onclick="rl(this)">削除</button></td></tr>`
    );
}
function rl(b) {
    if ($("#l tr").length > 1) $(b).closest("tr").remove();
    else alert("最低1つの項目は必要です。");
}
function save() {
    let d = gd();
    let s = JSON.stringify(d, null, 2);
    let blob = new Blob([s], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = url;
    link.download =
        "履歴書_" + new Date().toISOString().split("T")[0] + ".json";
    link.click();
    URL.revokeObjectURL(url);
    alert("履歴書データが保存されました！");
}
function loadAttachment() {
    $("#or_file").click();
}
$("#or_file").on("change", function (e) {
    let file = e.target.files[0];
    if (file && file.type === "application/json") {
        let reader = new FileReader();
        reader.onload = function (e) {
            try {
                let data = JSON.parse(e.target.result);
                rd(data);
                alert("データが正常に読み込まれました！");
            } catch (error) {
                alert(
                    "ファイルの読み込みに失敗しました。正しいJSONファイルを選択してください。"
                );
            }
        };
        reader.readAsText(file);
    } else {
        alert("JSON形式のファイルを選択してください。");
    }
});
function rd(d) {
    $("#d").val(d.submitDate || "");
    $("#f").val(d.furigana || "");
    $("#n").val(d.name || "");
    $("#a").val(d.age || "");
    $("#b").val(d.birthdate || "");
    if (d.gender)
        $(`input[name="g"][value="${d.gender}"]`).prop("checked", true);
    $("#ad").val(d.address || "");
    $("#ph").val(d.phone || "");
    $("#ca").val(d.contactAddress || "");
    $("#cp").val(d.contactPhone || "");
    $("#ce").val(d.contactEmail || "");
    $("#mo").val(d.motivation || "");
    $("#pn").val(d.personalNotes || "");
    if (d.photo) {
        let img = $("<img>").attr("src", d.photo);
        $(".photo-section").empty().append(img);
    }
    if (d.history && d.history.length > 0) {
        $("#h").empty();
        d.history.forEach((i) => {
            $("#h").append(
                `<tr><td class="date-col"><input type="text" class="date-input" placeholder="年　月" value="${
                    i.date || ""
                }"></td><td class="description-col"><textarea class="description-input" placeholder="学歴・職歴を入力してください">${
                    i.description || ""
                }</textarea></td><td style="width:60px;text-align:center;"><button class="btn btn-remove" onclick="rh(this)">削除</button></td></tr>`
            );
        });
    }
    if (d.licenses && d.licenses.length > 0) {
        $("#l").empty();
        d.licenses.forEach((i) => {
            $("#l").append(
                `<tr><td class="date-col"><input type="text" class="date-input" placeholder="年　月" value="${
                    i.date || ""
                }"></td><td class="description-col"><textarea class="description-input" placeholder="取得した資格・免許を入力してください">${
                    i.description || ""
                }</textarea></td><td style="width:60px;text-align:center;"><button class="btn btn-remove" onclick="rl(this)">削除</button></td></tr>`
            );
        });
    }
}
function gd() {
    let d = {
        submitDate: $("#d").val(),
        furigana: $("#f").val(),
        name: $("#n").val(),
        age: $("#a").val(),
        birthdate: $("#b").val(),
        gender: $('input[name="g"]:checked').val(),
        address: $("#ad").val(),
        phone: $("#ph").val(),
        contactAddress: $("#ca").val(),
        contactPhone: $("#cp").val(),
        contactEmail: $("#ce").val(),
        motivation: $("#mo").val(),
        personalNotes: $("#pn").val(),
        photo: $(".photo-section img").attr("src") || null,
        history: [],
        licenses: [],
    };
    $("#h tr").each(function () {
        let date = $(this).find(".date-input").val();
        let desc = $(this).find(".description-input").val();
        d.history.push({ date, description: desc });
    });
    $("#l tr").each(function () {
        let date = $(this).find(".date-input").val();
        let desc = $(this).find(".description-input").val();
        d.licenses.push({ date, description: desc });
    });
    return d;
}
function clear() {
    if (confirm("全てのデータを削除しますか？この操作は取り消せません。")) {
        $(
            'input[type="text"],input[type="email"],input[type="tel"],input[type="number"],input[type="date"],textarea'
        ).val("");
        $('input[type="radio"]').prop("checked", false);
        $(".photo-section").html(
            `<input type="file" id="p" accept="image/*"><div class="photo-placeholder">写真をはる位置<br>写真をはる必要が<br>ある場合<br><br>1.縦 36～40mm<br>　横 24～30mm<br>2.本人単身胸から上<br>3.裏面のりづけ</div>`
        );
        $(".photo-section")
            .off("click")
            .on("click", function () {
                $("#p").click();
            });
        $("#p")
            .off("change")
            .on("change", function (e) {
                let f = e.target.files[0];
                if (f) {
                    let r = new FileReader();
                    r.onload = function (e) {
                        let img = $("<img>").attr("src", e.target.result);
                        $(".photo-section").empty().append(img);
                    };
                    r.readAsDataURL(f);
                }
            });
        $("#h").html(
            `<tr><td class="date-col"><input type="text" class="date-input" placeholder="年　月"></td><td class="description-col"><textarea class="description-input" placeholder="学歴・職歴を入力してください"></textarea></td><td style="width:60px;text-align:center;"><button class="btn btn-remove" onclick="rh(this)">削除</button></td></tr>`
        );
        $("#l").html(
            `<tr><td class="date-col"><input type="text" class="date-input" placeholder="年　月"></td><td class="description-col"><textarea class="description-input" placeholder="取得した資格・免許を入力してください"></textarea></td><td style="width:60px;text-align:center;"><button class="btn btn-remove" onclick="rl(this)">削除</button></td></tr>`
        );
        let t = new Date().toISOString().split("T")[0];
        $("#d").val(t);
        D = null;
        window.resumeData = null;
        alert("全てのデータが削除されました。");
    }
}
function printDoc() {
    window.print();
}
function exportPdf() {
    alert(
        "PDF出力機能：\n\n1. ブラウザの印刷機能を使用\n2. 「送信先」で「PDFに保存」を選択\n3. 「詳細設定」で「ヘッダーとフッター」のチェックを外す\n4. 「印刷」ボタンをクリック\n\nまたは、Ctrl+P（Windows）/ Cmd+P（Mac）で印刷画面を開いてください。"
    );
    setTimeout(() => {
        window.print();
    }, 500);
}
