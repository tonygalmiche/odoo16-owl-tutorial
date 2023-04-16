# -*- coding: utf-8 -*-
{
    'name': "is_pic_3ans",

    'summary': """
        PIC 3 ans
    """,
    'description': """
        PIC 3 ans
    """,

    'author': "InfoSaône",
    'website': "https://infosaone.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Productivity',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'web'],
    'application': True,
    'installable': True,
    'data': [
        "security/ir.model.access.csv",
        "views/templates.xml",
        "views/is_mem_var_view.xml",
        "views/menu_view.xml",
    ],

   'assets': {
        'web.assets_backend': [
            'is_pic_3ans/static/src/**/*',
            #'is_pic_3ans/static/lib/gantt-master/codebase/dhtmlxgantt.js',
            #'is_pic_3ans/static/lib/gantt-master/codebase/dhtmlxgantt.css',
            #'is_pic_3ans/static/lib/gantt-master/codebase/skins/dhtmlxgantt_broadway.css?v=8.0.1',
            'is_pic_3ans/static/lib/gantt-master/codebase/skins/dhtmlxgantt_meadow.css',

            'is_pic_3ans/static/lib/dhtmlx_gantt.css',

	# <link rel="stylesheet" href="../../codebase/skins/dhtmlxgantt_broadway.css?v=8.0.1">

            #'is_pic_3ans/static/lib/gantt-master/codebase/skins/dhtmlxgantt_meadow.css?v=8.0.1',
            #'is_pic_3ans/static/src/gantt-master/codebase/skins/dhtmlxgantt_meadow.css?v=8.0.1',
        ],
    }
}
