
export const tablesType = {
    COMMON: "common-table"
}

export const cellTypes = {
    USUAL: "usual",
    LINK: "link"
}

export const btnTypes = {
    POPUP: "popup",
    SIMPLE: "simple"
}

export const tablesMarkup = {
    [tablesType.COMMON]: {
        ids: {
            btns_list:      "title-row-objs",
            btn_temp_id:    "-title-button-template",
            headers_list:   "headers-list-id",
            header_temp:    "column-header-template",
            row_temp_id:    "row-template",
            cell_temp_id:   "-cell-template"
            
        },
        getCommonPlaceholdes(desc) { return {
            "#table-id": desc.table_id,
            "#title": desc.title,
            "#columns-num": desc.columns.length,
            "#search-id": desc.search_id
        } },

        getTitleBtnsList(table)         { return table.querySelector("#" + this.ids.btns_list);},
        getTitleBtnTemplate(table, btn) { return table.querySelector("#" + btn.type + this.ids.btn_temp_id);},
        getTitleBtnPlaceholdes(btn)     { return {
            "#button-name": btn.name,
            "#access-classes": btn.access_classes,
            "#popup_href": btn.popup_href,
            "#title-button-id": btn.id,
        } },

        getHeadersList(table)           { return table.querySelector("#" + this.ids.headers_list);},
        getHeaderTemplate(table)        { return table.querySelector("#" + this.ids.header_temp);},
        getHeaderPlaceholdes(col)       { return {
            "#column-header-name": col.name
        } },
        
        createRowTemplate(desc) { var t = document.createElement("template"); t.id = desc.row_template_id; return t;},
        getRowTemplate(table)   { return table.querySelector("#" + this.ids.row_temp_id); },
        getRowPlaceholdes(desc) { return {}; },

        getCellTemplate(table, col) { return table.querySelector("#" + col.type + this.ids.cell_temp_id); },
        getCellPlaceholdes(col)     { return {
            "#cell-inner-text": col.inner_text,
            "#object-link": col.obj_link
        } },
    }
}
