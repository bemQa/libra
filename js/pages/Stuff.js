function refreshGrid() {

        var updatedData = new DevExpress.data.CustomStore({
            key: 'ID',
            load() {
                return users;
            },
            insert(values) {
                //debugger;
                return sendRequest(`/Stuff?handler=UserAdd`, 'POST', JSON.stringify(values));
            },
            update(key, values) {
                return sendRequest(`/Stuff?handler=UserUpdate`, 'POST', JSON.stringify(addValueInObject(values, "ID", key))
                );
            },
            remove(key) {
                /*return sendRequest(`/Stuff?handler=UserDelete`, 'POST', JSON.stringify(addValueInObject({}, "ID", key))*/
                return sendRequest(`/Stuff?handler=UserDelete`, 'POST', JSON.stringify(addValueInObject({}, "ID", key))
                );
            }
        });

        var dataGrid = $('#gridContainer').dxDataGrid('instance');
        dataGrid.option("dataSource", updatedData);
        $("#gridContainer").dxDataGrid("updateDimensions");
}

$(function () {
    const loadPanel = $('#loadPanel').dxLoadPanel({
        position: {
            of: '#gridContainer',
        },
        visible: false,
    }).dxLoadPanel('instance');


                    gridList = users;

                    var gridData = new DevExpress.data.CustomStore({
                        key: 'ID',
                        load() {
                            return gridList;
                        },
                        insert(values) {
                            return sendRequest(`/Stuff?handler=UserAdd`, 'POST', JSON.stringify(values));
                        },
                        update(key, values) {
                            return sendRequest(`/Stuff?handler=UserUpdate`, 'POST', JSON.stringify(addValueInObject(values, "ID", key))
                            );
                        },
                        remove(key) {
                            return sendRequest(`/Stuff?handler=UserDelete`, 'POST', JSON.stringify(addValueInObject({}, "ID", key))
                            );
                        },
                    });

                    var headsStore = new DevExpress.data.ArrayStore(gridList);
                    headsStore.insert({ ID: null, RoleGroupName: "-" }).done(function (dataObj, key) {
                        headsStore
                            .load({
                                filter: [
                                    ["RoleID", "=", 12],
                                    "or",
                                    ["RoleID", "=", 14],
                                    "or",
                                    ["RoleGroupName", "=", "-"]
                                ]
                            })
                            .done(function (heads) {
                                var dataGrid = $("#gridContainer").dxDataGrid({
                                    dataSource: gridData,
                                    paging: {
                                        pageSize: 25,
                                    },
                                    //width: 400,
                                    //function() {
                                    //    return window.innerWidth;
                                    //},
                                    //allowColumnResizing: true,
                                    //columnResizingMode: 'widget',
                                    //columnAutoWidth: true,
                                    columnHidingEnabled: true,
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
                                                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Stuff.xlsx');
                                            });
                                        });
                                        e.cancel = true;
                                    },
                                    editing: {
                                        mode: 'form',
                                        allowUpdating: true,
                                        allowDeleting: true,
                                        allowAdding: true,
                                        texts: {
                                            confirmDeleteMessage: "Уверены, что хотите изменить статус этой записи?",
                                            deleteRow: "Удалить",
                                            cancelRowChanges: "Отмена",
                                            editRow: "Править",
                                            addRow: "Добавить",
                                            cancelAllChanges: "Отмена",
                                            confirmDeleteTitle: "Удаление",
                                            saveAllChanges: "ОК",
                                            saveRowChanges: "ОК"
                                        }
                                    },
                                    onRowUpdating: function (options) {
                                        $.extend(options.newData, $.extend({}, options.oldData, options.newData));
                                    },
                                    onEditorPreparing: function (e) {
                                        if (e.parentType === "dataRow" && e.dataField == "Logon") {
                                            if (!e.row.isNewRow)
                                                e.editorOptions.disabled = true;
                                        }

                                    },
                                     columns: [
                                        {
                                            dataField: "ID",
                                            caption: "ID",
                                            formItem: {
                                                visible: false
                                            },
                                            width: 60,
                                        },
                                        {
                                            dataField: "UUID",
                                            caption: "ID Mercapp",
                                            width: 60,
                                        },
                                        {
                                            dataField: "LName",
                                            caption: "Фамилия"
                                            ,
                                            validationRules: [{ type: "required" }]
                                        }, {
                                            dataField: "Name",
                                            caption: "Имя"
                                        }, {
                                            dataField: "MName",
                                            caption: "Отчество"

                                        }, {
                                            dataField: "RoleGroupName",
                                            caption: "Сегмент",
                                            formItem: {
                                                visible: false
                                            }
                                        }, {
                                            dataField: "RegionID",
                                            caption: "Регион",
                                            validationRules: [{ type: "required" }],
                                            lookup: {
                                                dataSource: regions,
                                                valueExpr: 'ID',
                                                displayExpr: 'Name',
                                            }
                                        }, {
                                            dataField: "DistrID",
                                            caption: "Дистрибьютор",
                                            lookup: {
                                                dataSource: distrs,
                                                displayExpr: "Name",
                                                valueExpr: "ID"
                                            }
                                            ,
                                            validationRules: [{ type: "required" }]
                                        }, {
                                            dataField: "RoleID",
                                            caption: "Должность",
                                            lookup: {
                                                dataSource: roles,
                                                displayExpr: "Name",
                                                valueExpr: "ID"
                                            }
                                            ,
                                            validationRules: [{ type: "required" }]
                                        }, {
                                            dataField: "Logon",
                                            caption: "Логин"
                                            ,
                                            validationRules: [{ type: "required" }]
                                        }, {
                                            dataField: "Pass",
                                            caption: "Пароль",
                                            hidingPriority: 3,
                                            validationRules: [{ type: "required" }]
                                        }, {
                                            dataField: "MobPhone",
                                            caption: "Телефон",
                                            hidingPriority: 2
                                        }, {
                                            dataField: "Email",
                                            caption: "E-mail",
                                            validationRules: [{
                                                type: "email",
                                                message: 'Некорректный формат e-mail'
                                            }],
                                            hidingPriority: 1
                                        }, {
                                            dataField: "HeadID",
                                            caption: "Руководитель",
                                            lookup: {
                                                dataSource: heads,
                                                displayExpr: function (data) {
                                                    if (data)
                                                        result = data.RoleGroupName;
                                                    if (data.LName != undefined)
                                                        result += " " + data.LName;
                                                    if (data.Name != undefined)
                                                        result += " " + data.Name;
                                                    if (data.MName != undefined)
                                                        result += " " + data.MName;

                                                    return result;
                                                },
                                                valueExpr: "ID"
                                            }
                                        }, {
                                            dataField: "Status",
                                            caption: "Статус",
                                            formItem: {
                                                visible: false
                                            }
                                        }, {
                                            dataField: "Received",
                                            caption: "Дата изменения",
                                            formItem: {
                                                visible: false
                                            },
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

                            });
                    });


 
    $("#onlinedemo.button").dxButton({
        text: "Тест",
        onClick: function () {

            sendRequest(`/Stuff?handler=Test`, 'POST');

        }
    });


});
