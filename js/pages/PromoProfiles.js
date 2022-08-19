$(function () {
    var $loadIndicator = $("<div>").dxLoadIndicator({ visible: false });

        $('#region').dxSelectBox({
            dataSource: new DevExpress.data.ArrayStore({
                data: regions,
                key: 'ID',
            }),
            displayExpr: 'Name',
            valueExpr: 'ID',
            value: regions[0].ID,
            dropDownButtonTemplate: function (data, element) {
                $(element).append($loadIndicator);
            },
            onValueChanged: function (e) {
                let personSelectBox = $("#person").dxSelectBox('instance');
                let distrSelectBox = $("#distr").dxSelectBox('instance');
                var loadIndicator = $loadIndicator.dxLoadIndicator("instance");

                let dataSource = personSelectBox.getDataSource();
                loadIndicator.option("visible", true);
                if (e.value != -1 && distrSelectBox.option('value') == -1) {
                    dataSource.filter("RegionID", "=", e.value);
                }
                else if (e.value == -1 && distrSelectBox.option('value') != -1) {
                    dataSource.filter("DistrID", "=", distrSelectBox.option('value'));
                }
                else if (e.value == -1 && distrSelectBox.option('value') == -1)
                    dataSource.filter(null);
                else {
                    dataSource.filter(
                        ["RegionID", "=", e.value],
                        "and",
                        ["DistrID", "=", distrSelectBox.option('value')]);
                }

                dataSource.load();
                personSelectBox.option("value", dataSource._store._array[0].ID);
                loadIndicator.option("visible", false);
            },
            searchEnabled: true
        });

            $('#distr').dxSelectBox({
                dataSource: new DevExpress.data.ArrayStore({
                    data: distrs,
                    key: 'ID',
                }),
                displayExpr: 'Name',
                valueExpr: 'ID',
                value: distrs[0].ID,
                dropDownButtonTemplate: function (data, element) {
                    $(element).append($loadIndicator);
                },
                onValueChanged: function (e) {
                    let regionSelectBox = $("#region").dxSelectBox('instance');
                    var loadIndicator = $loadIndicator.dxLoadIndicator("instance");

                    loadIndicator.option("visible", true);
                    let dataSource = $("#person").dxSelectBox('instance').getDataSource();
                    if (e.value != -1 && regionSelectBox.option('value') == -1) {
                        dataSource.filter("DistrID", "=", e.value);
                    }
                    else if (e.value == -1 && regionSelectBox.option('value') != -1) {
                        dataSource.filter("RegionID", "=", regionSelectBox.option('value'));
                    }
                    else if (e.value == -1 && regionSelectBox.option('value') == -1) {
                        dataSource.filter(null);
                    }
                    else {
                        dataSource.filter(
                            ["RegionID", "=", regionSelectBox.option('value')],
                            "and",
                            ["DistrID", "=", e.value]);
                    }
                    dataSource.load();
                    $("#person").dxSelectBox('instance').option("value", dataSource._store._array[0].ID);
                    loadIndicator.option("visible", false);
                },
                searchEnabled: true
            });

                var personSelectBox = $('#person').dxSelectBox({
                    dataSource:
                    {
                        store: {
                            type: "array",
                            key: "ID",
                            data: persons
                        },
                        paginate: true
                    },
                    //paginate: true,
                    //pageSize: 50,
                    dropDownButtonTemplate: function (data, element) {
                        $(element).append($loadIndicator);
                    },
                    displayExpr: 'Name',
                    valueExpr: 'ID',
                    value: persons[0].ID,
                    searchEnabled: true
                });

        const promoBox = $('#promo').dxSelectBox({
            dataSource: new DevExpress.data.ArrayStore({
                data: promos,
                key: 'ID',
            }),
            displayExpr: 'Name',
            valueExpr: 'ID',
            value: promos[0].ID,
            onValueChanged: function (e) {
                //debugger;
                updatePeridBoxes(e.value);
            },
            searchEnabled: true
        });
        updatePeridBoxes($("#promo").dxSelectBox('instance').option('value'));

    function updatePeridBoxes(promo) {
            $('#periodFrom').dxSelectBox({
                dataSource: new DevExpress.data.ArrayStore({
                    data: periods,
                    key: 'ID',
                }),
                displayExpr: 'Name',
                valueExpr: 'ID',
                value: periods[0].ID,
                onValueChanged: function (e) {
                    if (e.value > periodToSelectBox.value)
                        periodToSelectBox.option('value') = e.value;
                },
                searchEnabled: true
            });

            $('#periodTo').dxSelectBox({
                dataSource: new DevExpress.data.ArrayStore({
                    data: periods,
                    key: 'ID',
                }),
                displayExpr: 'Name',
                valueExpr: 'ID',
                value: periods[0].ID,
                searchEnabled: true
            });
    };



    var dataGrid = $("#gridContainer").dxDataGrid({
        paging: {
            pageSize: 100,
        },
        //width: 400,
        //function() {
        //    return window.innerWidth;
        //},
        //allowColumnResizing: true,
        //columnResizingMode: 'widget',
        //columnAutoWidth: true,
        //columnHidingEnabled: true,
        columnChooser: {
            enabled: true,
            mode: 'select',
        },
        export: {
            enabled: true
        },
        filterRow: {
            visible: true,
            applyFilter: 'auto',
        },
        headerFilter: {
            visible: true,
        },
        onExporting: function (e) {
            var workbook = new ExcelJS.Workbook();
            var worksheet = workbook.addWorksheet('Main sheet');
            DevExpress.excelExporter.exportDataGrid({
                worksheet: worksheet,
                component: e.component,
                customizeCell: function (options) {
                    var excelCell = options;
                    excelCell.font = { name: 'Arial', size: 12 };
                    excelCell.alignment = { horizontal: 'left' };
                }
            }).then(function () {
                workbook.xlsx.writeBuffer().then(function (buffer) {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PromoProfiles.xlsx');
                });
            });
            e.cancel = true;
        },
        onRowClick: function (e) {
            if (e.rowType === "data") {
                openDetails(e.component.cellValue(e.rowIndex, 'ParticipantID'), e.component.cellValue(e.rowIndex, 'PeriodID'));
                //e.component.editRow(e.rowIndex);
            }
        },
        //editing: {
        //    mode: "cell",
        //    allowUpdating: true
        //},
        //selection: {
        //    mode: "multiple"
        //},
        //onSelectionChanged: function (data) {
        //    deleteButton.option("disabled", !data.selectedRowsData.length)
        //},
        columns: [
            {
                dataField: "PointUUID",
                caption: "ID Клиента",
                width: 60
            },
            {
                dataField: "PointType",
                caption: "Тип клиента"
            },
            {
                dataField: "ParticipantID",
                visible: false
            },
            {
                dataField: "ParticipantUUID",
                caption: "ID участника"
            },
            {
                dataField: "PeriodID",
                visible: false
            },
            {
                dataField: "PeriodName",
                caption: "Этап"
            },
            {
                dataField: "RegionName",
                caption: "Регион"
            },
            {
                dataField: "DistrName",
                caption: "Дистрибьютор"
            },
            {
                dataField: "WorkerName",
                caption: "Сотрудник"
            },
            {
                dataField: "PointName",
                caption: "Клиент"
            },
            {
                dataField: "PersonType",
                caption: "Должность"
            },
            {
                dataField: "ParticipantName",
                caption: "ФИО"
            },
            {
                dataField: "Phone",
                caption: "Телефон"
            },
            {
                dataField: "Email",
                caption: "E-mail",
                hidingPriority: 7
            },
            {
                dataField: "PassSeria",
                caption: "Серия паспорта",
                hidingPriority: 6
            },
            {
                dataField: "PassNum",
                caption: "Номер паспорта",
                hidingPriority: 5
            },
            {
                dataField: "BonusTemp",
                caption: "Предварительный бонус",
                hidingPriority: 4
            },
            {
                dataField: "Bonus",
                caption: "Подтвержденный Бонус"
            },
            {
                dataField: "PaymentStatus",
                caption: "Статус отправки"
            },
            {
                dataField: "PayType",
                caption: "Способ выплат"
            },
            {
                dataField: "BonusCardNum",
                caption: "Номер бонусной карты",
                hidingPriority: 3
            },
            {
                dataField: "IsConnect",
                caption: "Статус подключения"
            },
            /*
            {
                dataField: "ToCorrection",
                caption: "На корректировку"
            },  */
            //{
            //    dataField: "SendBonus",
            //    caption: "Отправленный бонус"
            //}, {
            //    dataField: "NDFL",
            //    caption: "НДФЛ"
            //}, {
            //    dataField: "isReturnPayment",
            //    caption: "Возврат"
            //}, {
            //    dataField: "IsNDFLPayed",
            //    caption: "НДФЛ оплачен"
            //},
            {
                dataField: "IsCheckedProfile",
                caption: "Анкета проверена модератором",
                hidingPriority: 2
            },
            {
                dataField: "Checked",
                caption: "Дата проверки",
                dataType: "date",
                hidingPriority: 1
            }, {
                dataField: "Author",
                caption: "Проверил",
                hidingPriority: 0
            }
            //,
            //"FirstName",
            //"LastName", {
            //    dataField: "Position",
            //    width: 170
            //}, {
            //    dataField: "StateID",
            //    caption: "State",
            //    width: 125,
            //    lookup: {
            //        dataSource: states,
            //        displayExpr: "Name",
            //        valueExpr: "ID"
            //    }
            //}, {
            //    dataField: "BirthDate",
            //    dataType: "date"
            //}
        ]
    }).dxDataGrid("instance");

    $("#onlinedemo.button").dxButton({
        text: "Обновить данные",
        onClick: function () {
                    var dataSource = new DevExpress.data.DataSource({
                        store: {
                            type: "array",
                            key: "ParticipantID",
                            data: promoProfiles
                        }
                    });
                    var dataGrid = $('#gridContainer').dxDataGrid('instance');
                    dataGrid.option("dataSource", dataSource);
                    $("#gridContainer").dxDataGrid("updateDimensions");
        }
    });

        $('#docTypeBox').dxSelectBox({
            width: 300,
            dataSource:
            {
                store: {
                    type: "array",
                    key: "ID",
                    data: docTypes
                }
            },
            onValueChanged: function (e) {
                var newValue = e.value;
                if (newValue != e.previousValue) {
                    var uploader = $("#uploadDocFile").dxFileUploader("instance");
                    var data = uploader.option("uploadCustomData");
                    //debugger;

                    data.docType = newValue;

                    uploader.option("uploadCustomData", data);

                    //uploader.option("uploadCustomData", {
                    //    __RequestVerificationToken: document.getElementsByName("__RequestVerificationToken")[0].value,
                    //    docType: newValue,
                    //    participantid: 10
                    //});
                    //var url = uploader.option("uploadUrl");
                    //url = updateQueryStringParameter(url, "fileDescription", newValue);
                    //uploader.option("uploadUrl", url);

                }
            },
            displayExpr: 'Name',
            valueExpr: 'ID',
            value: docTypes[0].ID
        });
});

function openDetails(partID, periodID) {

    var Role;

        Role = 0;

        SetKeyValue('ParticipantID', partID);
        SetKeyValue('PeriodID', periodID);

        var w = getClientWidth();
        var h = getClientHeight();
        $('body').prepend('<div id="overlay" style=""width: ' + w + '; height: ' + h + '"" />');

        $('#popupBigProfiles').show();

                const detailsData = new DevExpress.data.CustomStore({
                    key: 'FieldID',
                    load() {
                        return participantDetails;
                    },
                    update(key, values) {
                        sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(values)
                        );
                    }
                });

                        const gridDetails = $("#gridDetailsContainer").dxDataGrid({
                            dataSource: detailsData,
                            paging: {
                                pageSize: 100,
                            },
                            //width: 400,
                            //function() {
                            //    return window.innerWidth;
                            //},
                            //allowColumnResizing: true,
                            //columnResizingMode: 'widget',
                            //columnAutoWidth: true,
                            //columnHidingEnabled: true,
                            columnChooser: {
                                enabled: false
                            },
                            export: {
                                enabled: false
                            },
                            filterRow: {
                                visible: false,
                            },
                            headerFilter: {
                                visible: false
                            },
                            editing: {
                                //mode: "cell",
                                allowUpdating: false
                            },
                            //onEditorPreparing: function (e) {
                            //    if (e.dataField == "FieldName") {
                            //        e.editorOptions.disabled = true;
                            //    }
                            //    //else
                            //    //    if (e.dataField == "Value" && e.row.key == 1) {
                            //    //        e.cancel = true;
                            //    //        //e.editorOptions.disabled = true;
                            //    //        //e.event.stopImmediatePropagation();
                            //    //        //$(':focus').blur();
                            //    //        //let el = document.querySelector(':focus');
                            //    //        //if (el) el.blur();
                            //    //    }
                            //},
                            onCellPrepared(e) {
                                if (e.rowType == "header") {
                                    e.cellElement.css("text-align", "left");
                                }
                                if (e.rowType == "data" && e.dataField == "FieldName")
                                    e.cellElement.css("text-align", "center");
                            },
                            //onCellClick: function (e) {
                            //    if(e.rowType == "data" && e.dataField == "FieldName"){
                            //        e.event.stopPropagation();
                            //    }
                            //}, 
                            onRowUpdating: function (options) {
                                $.extend(options.newData, $.extend({}, options.oldData, options.newData));
                            },
                            showColumnLines: true,
                            showRowLines: true,
                            rowAlternationEnabled: true,
                            showBorders: true,
                            //selection: {
                            //    mode: "multiple"
                            //},
                            //onSelectionChanged: function (data) {
                            //    deleteButton.option("disabled", !data.selectedRowsData.length)
                            //},
                            columns: [
                                {
                                    dataField: "FieldID",
                                    visible: false
                                },
                                {
                                    dataField: "FieldName",
                                    caption: "Название поля",
                                    allowSorting: false,
                                    width: 200
                                },
                                {
                                    dataField: "Value",
                                    caption: "Значение",
                                    allowSorting: false,
                                    alignment: 'center',
                                    width: 300,
                                    cellTemplate(container, options) {
                                        if (options.data.FieldID == 1) {
                                            //container.empty();
                                            $("<div>").dxCheckBox({
                                                value: options.data.Value == 1,
                                                disabled: Role != "0",
                                                onValueChanged: function (e) {
                                                    var result = DevExpress.ui.dialog.confirm("<i>Вы уверены?</i>", "Изменить статус");
                                                    result.done(function (dialogResult) {
                                                        if (dialogResult) {
                                                            sendRequest(`/PromoProfiles?handler=ParticipantChecked`, 'POST', JSON.stringify({
                                                                "ParticipantID": options.data.ParticipantID,
                                                                "Checked": e.value
                                                            }));
                                                            detailsDataRefresh();
                                                        }
                                                        else
                                                            value = e.previousValue;
                                                    });
                                                }
                                            }).appendTo(container);
                                        }
                                        else if (options.data.FieldID == 10) {
                                            $("<div>").dxSelectBox({
                                                dataSource: new DevExpress.data.ArrayStore({
                                                    data: paytypes,
                                                    key: 'ID',
                                                }),
                                                value: parseInt(options.data.Value, 10),
                                                displayExpr: 'Name',
                                                valueExpr: 'ID',
                                                onValueChanged: function (e) {
                                                    sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(
                                                        {
                                                            "ParticipantID": options.data.ParticipantID,
                                                            "FieldID": options.data.FieldID,
                                                            "Value": e.value.toString()
                                                        }));
                                                }
                                            }).appendTo(container);
                                        }
                                        else if (options.data.FieldID == 28 || options.data.FieldID == 30 || options.data.FieldID == 37) {
                                            $("<div>").dxDateBox({
                                                format: "datetime",
                                                value: options.data.Value,
                                                onValueChanged: function (e) {
                                                    sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(
                                                        {
                                                            "ParticipantID": options.data.ParticipantID,
                                                            "FieldID": options.data.FieldID,
                                                            "Value": e.value
                                                        }));
                                                }
                                            }).appendTo(container)
                                        }
                                        else if (options.data.FieldID == 15) {
                                            $("<div>").dxTextBox({
                                                value: options.data.Value,
                                                mask: "00000000000",
                                                maskInvalidMessage: "В формате 79XXXXXXXXX (11 цифр)",
                                                placeholder: "В формате 79XXXXXXXXX (11 цифр)",
                                                hint: "В формате 79XXXXXXXXX (11 цифр)",
                                                label: "В формате 79XXXXXXXXX (11 цифр)",
                                                labelMode: "floating",
                                                onValueChanged: function (e) {
                                                    sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(
                                                        {
                                                            "ParticipantID": options.data.ParticipantID,
                                                            "FieldID": options.data.FieldID,
                                                            "Value": e.value
                                                        }));
                                                }
                                            }).appendTo(container)
                                        }
                                        else if (options.data.FieldID == 25 || options.data.FieldID == 35) {
                                            $("<div>").dxTextBox({
                                                value: options.data.Value,
                                                mask: "0000",
                                                maskInvalidMessage: "В формате XXXX (4 цифры)",
                                                placeholder: "В формате XXXX (4 цифры)",
                                                hint: "В формате XXXX (4 цифры)",
                                                label: "В формате XXXX (4 цифры)",
                                                labelMode: "floating",
                                                onValueChanged: function (e) {
                                                    sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(
                                                        {
                                                            "ParticipantID": options.data.ParticipantID,
                                                            "FieldID": options.data.FieldID,
                                                            "Value": e.value
                                                        }));
                                                }
                                            }).appendTo(container)
                                        }
                                        else if (options.data.FieldID == 26 || options.data.FieldID == 36) {
                                            $("<div>").dxTextBox({
                                                value: options.data.Value,
                                                mask: "000000",
                                                maskInvalidMessage: "В формате XXXXXX (6 цифр)",
                                                placeholder: "В формате XXXXXX (6 цифр)",
                                                hint: "В формате XXXXXX (6 цифр)",
                                                label: "В формате XXXXXX (6 цифр)",
                                                labelMode: "floating",
                                                onValueChanged: function (e) {
                                                    sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(
                                                        {
                                                            "ParticipantID": options.data.ParticipantID,
                                                            "FieldID": options.data.FieldID,
                                                            "Value": e.value
                                                        }));
                                                }
                                            }).appendTo(container)
                                        }
                                        else if (options.data.FieldID == 27) {
                                            $("<div>").dxTextBox({
                                                value: options.data.Value,
                                                mask: "000000",
                                                maskInvalidMessage: "В формате XXXXXX (6 цифр)",
                                                placeholder: "В формате XXXXXX (6 цифр)",
                                                hint: "В формате XXXXXX (6 цифр)",
                                                label: "В формате XXXX (4 цифры)",
                                                labelMode: "floating",
                                                onValueChanged: function (e) {
                                                    sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(
                                                        {
                                                            "ParticipantID": options.data.ParticipantID,
                                                            "FieldID": options.data.FieldID,
                                                            "Value": e.value
                                                        }));
                                                }
                                            }).appendTo(container)
                                        }
                                        else if (options.data.FieldID == 50) {
                                            $("<div>").dxTextBox({
                                                value: options.data.Value,
                                                mask: "000000000000",
                                                maskInvalidMessage: "В формате XXXXXXXXXXXX (12 цифр максимум)",
                                                placeholder: "В формате XXXXXXXXXXXX (12 цифр максимум)",
                                                hint: "В формате XXXXXXXXXXXX (12 цифр максимум)",
                                                label: "В формате XXXXXXXXXXXX (12 цифр максимум)",
                                                labelMode: "floating",
                                                onValueChanged: function (e) {
                                                    sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(
                                                        {
                                                            "ParticipantID": options.data.ParticipantID,
                                                            "FieldID": options.data.FieldID,
                                                            "Value": e.value
                                                        }));
                                                }
                                            }).appendTo(container)
                                        } else if (options.data.FieldID == 20) {
                                            $("<div>").dxTextBox({
                                                value: options.data.Value,
                                                onValueChanged: function (e) {
                                                    debugger;
                                                    //dxValidator('instace').
                                                    validateRes = e.element.dxValidator("instance").validate().isValid;
                                                    if (validateRes)
                                                        sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(
                                                            {
                                                                "ParticipantID": options.data.ParticipantID,
                                                                "FieldID": options.data.FieldID,
                                                                "Value": e.value
                                                            }));
                                                }
                                            }).dxValidator({
                                                validationRules: [{
                                                    type: 'email',
                                                    message: 'Email некорректен',
                                                }]
                                            }).appendTo(container)
                                        }

                                        else
                                            $("<div>").dxTextBox({
                                                value: options.data.Value,
                                                onValueChanged: function (e) {
                                                    sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(
                                                        {
                                                            "ParticipantID": options.data.ParticipantID,
                                                            "FieldID": options.data.FieldID,
                                                            "Value": e.value
                                                        }));
                                                }
                                            }).appendTo(container)
                                    }
                                }
                            ]
                        }).dxDataGrid("instance");

    $('#uploadDocFile').dxFileUploader({
        name: 'ParticipantDocPhoto',
        dialogTrigger: '#dropzone-external',
        dropZone: '#dropzone-external',
        visible: false,
        selectButtonText: 'Выберите фото',
        labelText: '',
        multiple: false,
        //uploadMode: 'useForm', 
        uploadMode: 'instantly',
        allowedFileExtensions: ['.jpg', '.jpeg', '.pdf', '.png'],
        uploadUrl: '/PromoProfiles?handler=ParticipantPhoto',
        maxFileSize: 5000000,
        //onBeforeSend: function (e) {
        //    debugger;
        //    e.component.option("uploadCustomData", {
        //        __RequestVerificationToken: document.getElementsByName("__RequestVerificationToken")[0].value,
        //        docType: $('#docTypeBox').dxSelectBox('instance').option("value"),
        //        participantid: partID
        //    });
        //    //var dataGrid = $('#gridContainer').dxDataGrid('instance');
        //    //dataGrid.option("dataSource", dataSource);
        //},
        //inputAttr: {
        //    __RequestVerificationToken: document.getElementsByName("__RequestVerificationToken")[0].value,
        //    docType: $('#docTypeBox').dxSelectBox('instance').option("value"),
        //    participantid: partID
        //},
        uploadCustomData: {
            //__RequestVerificationToken: document.getElementsByName("__RequestVerificationToken")[0].value,
            docType: $('#docTypeBox').dxSelectBox('instance').option("value"),
            participantid: partID
        },
        onDropZoneEnter(e) {
            if (e.dropZoneElement.id === 'dropzone-external') { toggleDropZoneActive(e.dropZoneElement, true); }
        },
        onDropZoneLeave(e) {
            if (e.dropZoneElement.id === 'dropzone-external') { toggleDropZoneActive(e.dropZoneElement, false); }
        },
        onUploadError: function (e) {
            var xhttp = e.request;
            if (xhttp.readyState == 4 && xhttp.status == 0) {
                console.log("Connection refused.");
            }
            else
                DevExpress.ui.dialog.alert("<i>" + e.error.responseText + "</i>", "Ошибка");
        },
        onUploaded(e) {
            const { file } = e;
            const dropZoneText = document.getElementById('dropzone-text');
            const fileReader = new FileReader();
            fileReader.onload = function () {
                toggleDropZoneActive(document.getElementById('dropzone-external'), false);
                const dropZoneImage = document.getElementById('dropzone-image');
                dropZoneImage.src = fileReader.result;
            };
            DevExpress.ui.dialog.alert("<i>Файл успешно загружен!</i>", "Результат");

            fileReader.readAsDataURL(file);
            dropZoneText.style.display = 'none';
            uploadProgressBar.option({
                visible: false,
                value: 0,
            });

            gridPhotoRefresh(partID, periodID);
        },
        onProgress(e) {
            uploadProgressBar.option('value', (e.bytesLoaded / e.bytesTotal) * 100);
        },
        onUploadStarted() {
            toggleImageVisible(false);
            uploadProgressBar.option('visible', true);
        }
    });

    const uploadProgressBar = $('#upload-progress').dxProgressBar({
        min: 0,
        max: 100,
        width: '30%',
        showStatus: false,
        visible: false,
    }).dxProgressBar('instance');

    function toggleDropZoneActive(dropZone, isActive) {
        if (isActive) {
            dropZone.classList.add('dx-theme-accent-as-border-color');
            dropZone.classList.remove('dx-theme-border-color');
            dropZone.classList.add('dropzone-active');
        } else {
            dropZone.classList.remove('dx-theme-accent-as-border-color');
            dropZone.classList.add('dx-theme-border-color');
            dropZone.classList.remove('dropzone-active');
        }
    }

    function toggleImageVisible(visible) {
        const dropZoneImage = document.getElementById('dropzone-image');
        dropZoneImage.hidden = !visible;
    }

    document.getElementById('dropzone-image').onload = function () { toggleImageVisible(true); };

$("#buttonSendComment.button").dxButton({
                text: "Отправить уведомление",
                onClick: function () {

                    $('.popupComment').show();

                    const reasonBox = $('#reasonBox').dxSelectBox({
                        dataSource:
                        {
                            store: {
                                type: "array",
                                key: "ID",
                                data: reasons
                            }
                        },

                        displayExpr: 'Name',
                        valueExpr: 'ID',
                        value: reasons[0].ID
                    });

                    const memo = $('#Memo').dxTextArea({
                        value: " ",
                        height: 100,
                        width: 600
                    }).dxTextArea('instance');

                    $("#submit.button").dxButton({
                        text: "Отправить",
                        onClick: function () {
                            const d = $.Deferred();

                            $.ajax(`/PromoProfiles?handler=SendNotification`, {
                                method: 'POST',
                                contentType: "application/json; charset=utf-8",
                                // headers:
                                // {
                                    // "RequestVerificationToken": document.getElementsByName("__RequestVerificationToken")[0].value
                                // },
                                data: JSON.stringify({
                                    "PromoID": $("#promo").dxSelectBox('instance').option('value'),
                                    "ParticipantID": partID,
                                    "ReasonID": $("#reasonBox").dxSelectBox('instance').option('value'),
                                    "Comment": $("#Memo").dxTextArea('instance').option('value'),
                                    "PeriodID": periodID
                                }),
                                cache: false,
                                xhrFields: { withCredentials: true },
                            }).done((result) => {
                                d.resolve(result);
                                //$('.popupComment').hide();
                                memo.option('value', '');
                                refreshCommentsGrid(partID);

                            }).fail((xhr) => {
                                d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.responseText);
                                DevExpress.ui.dialog.alert("<i>" + xhr.responseJSON ? xhr.responseJSON.Message : xhr.responseText +"</i>", "Ошибка");
                            });

                            d.promise();
                        }
                    });

                    refreshCommentsGrid(partID);
                }
            });

    gridPhotoRefresh(partID, periodID);
}








function gridPhotoRefresh(partID, periodID) {
$("#gridPhotoContainer").dxDataGrid({
                dataSource: new DevExpress.data.DataSource({
                    store: {
                        type: "array",
                        key: "ID",
                        data: participantDocs
                    }
                }),
                paging: {
                    pageSize: 100,
                },
                //width: 400,
                //function() {
                //    return window.innerWidth;
                //},
                //allowColumnResizing: true,
                //columnResizingMode: 'widget',
                //columnAutoWidth: true,
                //columnHidingEnabled: true,
                columnChooser: {
                    enabled: false
                },
                export: {
                    enabled: true
                },
                filterRow: {
                    visible: true,
                    applyFilter: 'auto',
                },
                headerFilter: {
                    visible: true,
                },
                onExporting: function (e) {
                    var workbook = new ExcelJS.Workbook();
                    var worksheet = workbook.addWorksheet('Main sheet');
                    DevExpress.excelExporter.exportDataGrid({
                        worksheet: worksheet,
                        component: e.component,
                        customizeCell: function (options) {
                            var excelCell = options;
                            excelCell.font = { name: 'Arial', size: 12 };
                            excelCell.alignment = { horizontal: 'left' };
                        }
                    }).then(function () {
                        workbook.xlsx.writeBuffer().then(function (buffer) {
                            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'PromoProfiles.xlsx');
                        });
                    });
                    e.cancel = true;
                },
                editing: {
                    allowUpdating: false
                },
                columns: [
                    {
                        dataField: "DocType",
                        caption: "Документ",
                        alignment: 'center'
                    },
                    {
                        dataField: "FileName",
                        alignment: 'center',
                        caption: "Название файла"
                    },
                    {
                        dataField: "FilePathPhoto",
                        alignment: 'center',
                        caption: "Просмотр",
                        cellTemplate(container, options) {
                            $('<div>')
								.append($('<img onclick="FancyGroup(' + options.rowIndex + ')" src="' + options.value + '">'))
                                .append($('<a class = "fancybox-thumbs" data-fancybox-group="' + options.rowIndex + '" rel="' + options.rowIndex +'" href="' + options.value + '">'))
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: "FilePath",
                        alignment: 'center',
                        caption: "Просмотреть/Скачать",
                        cellTemplate(container, options) {
                            $('<div>')
                                .append($('<a target="_blank" href="' + options.value + '">Посмотреть</a>'))
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: "ID",
                        alignment: 'center',
                        caption: "Удалить",
                        cellTemplate(container, options) {
                            $('<div>')
                                .append($('<a href="javascript:void(0)" onclick="DeletePhoto(' + partID + ',' + periodID +',' + options.value + ');">Удалить</a>'))
                                .appendTo(container);
                        }
                    },
                    {
                        dataField: "AuthorName",
                        caption: "Автор"
                    }

                ]
            }).dxDataGrid("instance");

            if ($('.fancybox-thumbs').length > 0)
                makeFancybox();
}


function DeletePhoto(partID, periodID, id) {
    var result = DevExpress.ui.dialog.confirm("<i>Вы уверены, что хотите удалить фото?</i>", "Удаление");
    result.done(function (dialogResult) {
        if (dialogResult) {
            const d = $.Deferred();

            $.ajax(`/PromoProfiles?handler=PhotoDelete`, {
                method: 'POST',
                contentType: "application/json; charset=utf-8",
                // headers:
                // {
                    // "RequestVerificationToken": document.getElementsByName("__RequestVerificationToken")[0].value
                // },
                data: JSON.stringify({
                    "ID" : id
                }),
                cache: false,
                xhrFields: { withCredentials: true },
            }).done((result) => {
                d.resolve(result);
                gridPhotoRefresh(partID, periodID);
            }).fail((xhr) => {
                d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.responseText);
            });

            d.promise();
        }
    });
}

function detailsDataRefresh() {
const detailsData = new DevExpress.data.CustomStore({
                key: 'FieldID',
                load() {
                    return participantDetails;
                },
                update(key, values) {
                    sendRequest(`/PromoProfiles?handler=ParticipantUpdate`, 'POST', JSON.stringify(values)
                    );
                }
            });

            var gridDetails = $('#gridDetailsContainer').dxDataGrid('instance');
            gridDetails.option("dataSource", detailsData);
            $('.dx-datagrid-table.dx-datagrid-table-fixed td').trigger('click');
            $("#gridDetailsContainer").dxDataGrid("updateDimensions");
}

function refreshCommentsGrid(participantID) {
    $("#gridCommentsContainer").dxDataGrid({
                dataSource: new DevExpress.data.DataSource({
                    store: {
                        type: "array",
                        data: partProblems
                    }
                }),
                paging: {
                    pageSize: 100,
                },
                //width: 400,
                //function() {
                //    return window.innerWidth;
                //},
                //allowColumnResizing: true,
                //columnResizingMode: 'widget',
                //columnAutoWidth: true,
                //columnHidingEnabled: true,
                columnChooser: {
                    enabled: false
                },
                export: {
                    enabled: false
                },
                filterRow: {
                    visible: false,
                },
                headerFilter: {
                    visible: false
                },
                editing: {
                    allowUpdating: false
                },
                //selection: {
                //    mode: "multiple"
                //},
                //onSelectionChanged: function (data) {
                //    deleteButton.option("disabled", !data.selectedRowsData.length)
                //},
                columns: [
                    {
                        dataField: "Promo",
                        caption: "Акция"
                    },
                    {
                        dataField: "PeriodName",
                        caption: "Этап"
                    },
                    {
                        dataField: "Problem",
                        caption: "Проблемы"
                    },
                    {
                        dataField: "Comment",
                        caption: "Комментарий"
                    },
                    {
                        dataField: "Borned",
                        caption: "Дата добавления",
                        dataType: "datetime"
                    }
                ]
            }).dxDataGrid("instance");
}
