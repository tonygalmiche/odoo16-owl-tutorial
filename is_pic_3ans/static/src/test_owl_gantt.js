/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { getDefaultConfig } from "@web/views/view";
import { useService } from "@web/core/utils/hooks";
import { DhtmlxGantt } from "./dhtmlx_gantt/dhtmlx_gantt";


const { Component, useSubEnv, useState, onWillStart, onMounted } = owl;



class TestOwlGantt extends Component {
    setup() {
        this.user_id = useService("user").context.uid;
        this.action  = useService("action");
        this.orm     = useService("orm");
        this.state   = useState({
            'gantt' : {},
            'input1': false,
            'input2': false,
        });

        // The useSubEnv below can be deleted if you're > 16.0
        useSubEnv({
            config: {
                ...getDefaultConfig(),
                ...this.env.config,
            },
        });

        this.display = {
            controlPanel: { "top-right": false, "bottom-right": false },
        };

        onWillStart(async () => {
            this.state.input1 = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "input1"]);
            this.state.input2 = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "input2"]);
        });


        onMounted(() => {
            this.state.gantt = gantt;
            // Je n'ai pas trouvé d'autre solution que d'intégrer l'objet owl dans l'objet gantt pour pouvoir 
            //l'utiliser dans les évènements du Gantt
            gantt.owl = this; 


            this.state.gantt.i18n.setLocale("fr");

            this.state.gantt.config.xml_date = "%Y-%m-%d %H:%i";
            this.state.gantt.scales = [
                { unit: "year", step: 1, format: "%Y" }
            ];

            this.state.gantt.config.lightbox.sections = [
                {name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
                {name: "time", type: "duration", map_to: "auto"}
            ];
        
            // this.state.gantt.config.scale_height = 50;
        
            // this.state.gantt.config.scales = [
            //     {unit: "month", format: "%F, %Y"},
            //     {unit: "day", step: 1, format: "%D %j"}
            //     //{unit: "day", step: 1, format: "%j, %D"}
            // ];

            // this.state.gantt.attachEvent("onLightboxSave", function (id, task, is_new) {
            //     task.unscheduled = !task.start_date;
            //     return true;
            // });


            
            this.state.gantt.plugins({
                keyboard_navigation: true,
                undo: true,
                tooltip: true, /* Infobulle sur les taches => Cela fonctionne */
                marker: true,
            });


            this.state.gantt.attachEvent("onGanttReady", function(){
                var tooltips = gantt.ext.tooltips;
                tooltips.tooltip.setViewport(gantt.$task_data);
            });





            this.state.gantt.config.grid_width = 380;
            this.state.gantt.config.add_column = false;
            this.state.gantt.templates.grid_row_class = function (start_date, end_date, item) {
                if (item.progress == 0) return "red";
                if (item.progress >= 1) return "green";
            };
            this.state.gantt.templates.task_row_class = function (start_date, end_date, item) {
                if (item.progress == 0) return "red";
                if (item.progress >= 1) return "green";
            };
            this.state.gantt.config.columns = [
                {name: "text", label: "Task name", tree: true, width: '*'},
                {
                    name: "progress", label: "Progress", width: 80, align: "center",
                    template: function (item) {
                        if (item.progress >= 0.5)
                            return "Complete";
                        if (item.progress == 0)
                            return "Not started";
                        return Math.round(item.progress * 100) + "%";
                    }
                },
                {
                    name: "assigned", label: "Assigned to", align: "center", width: 100,
                    template: function (item) {
                        if (!item.users) return "Nobody";
                        return item.users.join(", ");
                    }
                }
            ];



            // var hourToStr = gantt.date.date_to_str("%H:%i");
            // var hourRangeFormat = function(step){
            //     return function(date){
            //         var intervalEnd = new Date(gantt.date.add(date, step, "hour") - 1)
            //         return hourToStr(date) + " - " + hourToStr(intervalEnd);
            //     };
            // };
        

            /* ZOOM */
            var zoomConfig = {
                levels: [
                    {
                        name:"day",
                        scale_height: 45,
                        min_column_width:30,
                        scales:[
                            {unit: "day" , step: 1, format: "%D %d %F %Y"}, /* https://docs.dhtmlx.com/gantt/desktop__date_format.html */
                            {unit: "hour", step: 2, format: "%HH"}
                        ]
                    },
                    {
                        name:"week",
                        scale_height: 45,
                        min_column_width:25,
                        scales:[
                            {unit: "week", format: "%F %Y S%W"},
                            {unit: "day", format: "%d"},
                        ]
                    },
                    {
                        name:"month",
                        scale_height: 45,
                        min_column_width:30,
                        scales:[
                            {unit: "month", format: "%F %Y"},
                            {unit: "week", format: "S%W"},
                        ]
                    },
                    {
                        name:"year",
                        scale_height: 45,
                        min_column_width: 35,
                        scales:[
                            {unit: "year" , step: 1, format: "%Y"},
                            {unit: "month", step: 1, format: "%M"},
                        ]
                    }
                ],
                useKey: "ctrlKey",
                trigger: "wheel",
                element: function(){
                    return gantt.$root.querySelector(".gantt_task");
                }
            };
            this.state.gantt.ext.zoom.init(zoomConfig);




            //Cela devrait permette de faire fonctionner le scroll du gantt à la souris, mais ca ne fonctionne pas
            /*
            this.state.gantt.config.layout = {
                css: "gantt_container",
                rows:[
                    {
                    cols: [
                        {
                        // the default grid view  
                        view: "grid",  
                        scrollable: true,
                        scrollX:"scrollHor", 
                        scrollY:"scrollVer"
                        },
                        {
                        view: "scrollbar", 
                        id:"scrollVer"
                        }
                    ]},
                    {
                        view: "scrollbar", 
                        id:"scrollHor"
                    }
                ]
            }
            */
            // this.state.gantt.config.layout = {
            //     //css: "gantt_container",
            //     cols: [
            //         {
            //             width:400,
            //             min_width: 300,
            //             rows:[
            //                 {view: "grid", scrollX: "gridScroll", scrollable: true, scrollY: "scrollVer"},
            //                 {view: "scrollbar", id: "gridScroll", group:"horizontal"}
            //             ]
            //         },
            //         {resizer: true, width: 5},
            //         {
            //             rows:[
            //                 {view: "timeline", scrollX: "scrollHor", scrollY: "scrollVer"},
            //                 {view: "scrollbar", id: "scrollHor", group:"horizontal"}
            //             ]
            //         },
            //         {view: "scrollbar", id: "scrollVer"}
            //     ]
            // };



            this.state.gantt.message({
                text: "<p>Keyboard shortcuts:</p>" +
        
                "<b>Global</b>" +
                "<ul>" +
                "<li><b>Tab</b> - select gantt</li>" +
                "<li><b>Alt + Up/Down/Left/Right</b> - scroll gantt</li>" +
                "<li><b>Ctrl + Enter</b> - create new task</li>" +
                "<li><b>Ctrl + Z</b> - undo</li>" +
                "<li><b>Ctrl + R</b> - redo</li>" +
                "</ul>" +
                "<b>Header Cells</b>" +
                "<ul>" +
                "<li><b>Left/Right</b> - navigate over cells</li>" +
                "<li><b>Home/End</b> - navigate to the first/last column</li>" +
                "<li><b>Down</b> - navigate to task rows</li>" +
                "<li><b>Space/Enter</b> - click header</li>" +
                "</ul>" +
                "<b>Task rows</b>" +
                "<ul>" +
                "<li><b>Up/Down</b> - navigate rows</li>" +
                "<li><b>PageDown/PageUp</b> - navigate to the first/last task</li>" +
                "<li><b>Space</b> - select task</li>" +
                "<li><b>Ctrl + Enter</b> - create new task</li>" +
                "<li><b>Delete</b> - delete selected task</li>" +
                "<li><b>Enter</b> - open the lightbox</li>" +
                "<li><b>Ctrl + Left/Right</b> - expand, collapse tree</li>" +
                "</ul>",
                expire: 2000
            });
        

            this.state.gantt.config.sort = true;
            this.state.gantt.config.row_height = 25;


            /* Text à gauche de la task => https://docs.dhtmlx.com/gantt/desktop__timeline_templates.html */
            const formatter = gantt.ext.formatters.durationFormatter({
                format: ["day"]
            });
            this.state.gantt.templates.leftside_text = function(start, end, task){
                return formatter.format(task.duration);
            };

            /* Text à droite de la task */
            this.state.gantt.templates.rightside_text = function(start, end, task){
                return "ID: #" + task.id;
            };

            /* Text de progression de la task */
            this.state.gantt.templates.progress_text=function(start, end, task){
                return task.progress;
            };

            /* Text de l'infobulle de la task */
            this.state.gantt.templates.tooltip_text = function(start,end,task){
                return "<b>toto et tutu Task:</b> "+task.text+"<br/><b>Start date:</b> " + 
                gantt.templates.tooltip_date_format(start)+ 
                "<br/><b>End date:</b> "+gantt.templates.tooltip_date_format(end)+
                "<br/><b>Progress:</b> "+task.progress+
                "<br/>Durée: "+task.duration;
            };



            this.state.gantt.$click.advanced_details_button=function(e, id, trg){
                gantt.message("These are advanced details"); 
                return false; //blocks the default behavior
            };


            //Ajuster la plage des dates automatiquement => Ce paramètre n'a aucun effet => L'ajustement fonctionne dans tous les cas
            this.state.gantt.config.fit_tasks = true; 

            this.state.gantt.init("gantt_here");
            //this.state.gantt.init("gantt_here", new Date(2023, 04, 15), new Date(2023, 12, 31));
            //this.state.gantt.init("gantt_here", "2023-06-14", "2023-12-31"); //=> Cela ne fonctionne pas et en plus la ligne du proejt disparait
            //this.state.gantt.init("gantt_here", new Date(2023, 02, 10), new Date(2023, 03, 20));


            // this.state.gantt.message({
            //     text:"Use <b>ctrl + mousewheel</b> in order to zoom",
            //     expire: -1
            // });





            this.state.gantt.config.columns = [
                {name: "text", label: "Tâche", tree: true, width: "*", resize: true},
                {name: "start_date", label: "Date", align: "center", resize: true},
                {
                    name: "priority", label: "Priorité", align: "center", template: function (obj) {
                        return obj.priority
                        /*
                        if (obj.priority == 1) {
                            return "High"
                        }
                        if (obj.priority == 2) {
                            return "Medium"
                        }
                        return "Low"
                        */
                    }
                }
            ];


            //Met une couleur sur les task en fonction de la priority
            this.state.gantt.templates.task_class = function (start, end, task) {
                var cl="";
                switch (task.priority) {
                    case 0:
                        cl = "high";
                        break;
                    case 1:
                        cl = "medium";
                        break;
                    case 2:
                        cl= "low";
                        break;
                }
                return cl;
            };
    
    





        });
    } 


    rnd() {
        return Math.floor(Math.random() * this.state.input2);
    }
    
    OKclick(ev) {
        //var start = new Date().toISOString().slice(0, 10)+" 00:00";
        var start = new Date();
        const start_date_gantt = new Date(start);
        var data=[];
        data.push({id: 1, text: "Project #1", start_date: null, duration: null, parent:0, progress: 0, open: true});
        for (let i = 1; i <= this.state.input1; i++) {
            var progress = Math.random();
            if (progress>0.6){
                progress = 1;
            }
            var priority=Math.floor(Math.random() * 3);
            var duration = this.rnd();
            var start_date = start.toISOString().slice(0, 10)+" 00:00"
            var text = "Tâche "+i+"<br><h1>Test</h1>" // Le code HTML sera affiché dans l'infobulle de la task
            data.push({id: i+1, text: text, start_date: start_date, duration:duration, parent:1, progress: progress, priority:priority});
            start.setDate(start.getDate()+duration+0.5);
            console.log("start=", start);



        }
        const start_end_gantt = new Date(start);

        var links=[];
        for (let i = 2; i <= this.state.input1; i++) {
            links.push({id:i, source:i, target:i+1, type:"0"});
        }
        this.state.gantt.clearAll(); 
        this.state.gantt.parse({
            data: data, 
            links: links,
        });

        //L'initialisation de la plage de dates ne fonctionne pas avec le init, mais fonctionne comme cela
        console.log(start_date_gantt, start_end_gantt);
        this.state.gantt.config.start_date = start_date_gantt;
        this.state.gantt.config.end_date = start_end_gantt;
        //this.state.gantt.config.start_date = new Date(2023, 5, 1);
        //this.state.gantt.config.end_date = new Date(2023, 6, 1);


        //Positionner un marker sur la task n°5 pour pouvoir ensuite se déplacer dessus avec le bouton OKclickMarker
        var current_time = this.state.gantt.getTask(5).start_date;
        this.state.todayMarker = this.state.gantt.addMarker({ 
            start_date: current_time, 
            css: "today", 
            text: "Le marqueur de "+current_time,
        });




        //En cliquant sur une task dans le tableau, cela scroll vers celle-ci => Cela fonctionne mais entre en conflit avec le onclick pour owl
        /*
        var timeline_area = document.getElementsByClassName("gantt_task_bg")[0]
        console.log("timeline_area =",timeline_area);
        timeline_area.onmousedown = function(event){
            click = true;
            scroll_state = gantt.getScrollState().x;
            //original_mouse_position = event.clientX;
        }
        */
        






        this.state.gantt.attachEvent("onLinkClick", function (id) {
            var link = this.getLink(id),
                src = this.getTask(link.source),
                trg = this.getTask(link.target),
                types = this.config.links;
    
            var first = "", second = "";
            switch (link.type) {
                case types.finish_to_start:
                    first = "finish";
                    second = "start";
                    break;
                case types.start_to_start:
                    first = "start";
                    second = "start";
                    break;
                case types.finish_to_finish:
                    first = "finish";
                    second = "finish";
                    break;
            }
    
            gantt.message("Must " + first + " <b>" + src.text + "</b> to " + second + " <b>" + trg.text + "</b>");
        });
    

        //En cliqant sur une task, cela affiche la liste des clients d'Odoo
        this.state.gantt.attachEvent("onTaskClick", function(id,e){
            console.log(id,e,e.target,e.target.className);
            if (e.target.className=="gantt_task_content"){
                gantt.owl.action.doAction({
                    type: "ir.actions.act_window",
                    name: "Tâche",
                    res_model: "res.partner",
                    views: [
                        [false, "list"],
                        [false, "form"],
                    ],
                });
            }
            return true;
        });


    }

    OKclickAnnee(ev) {
        this.state.gantt.ext.zoom.setLevel("year");
        console.log("min_date, max_date =",  this.state.gantt.getState().min_date,  this.state.gantt.getState().max_date);
    }

    OKclickMois(ev) {
        this.state.gantt.ext.zoom.setLevel("month");
        console.log("min_date, max_date =",  this.state.gantt.getState().min_date,  this.state.gantt.getState().max_date);
    }

    OKclickSemaine(ev) {
        this.state.gantt.ext.zoom.setLevel("week");
        console.log("min_date, max_date =",  this.state.gantt.getState().min_date,  this.state.gantt.getState().max_date);
    }

    OKclickJour(ev) {
        this.state.gantt.ext.zoom.setLevel("day");
        console.log("min_date, max_date =",  this.state.gantt.getState().min_date,  this.state.gantt.getState().max_date);
    }

    OKclickMarker(ev) {
        var marker = gantt.getMarker(this.state.todayMarker);
        var marker_date = marker.start_date;
        this.state.gantt.showDate(marker_date)
    }

    OKclickGoToDate(ev) {
        var go_date = new Date();
        go_date.setDate(go_date.getDate()+14); //Date du jour + 14 jours
        console.log(go_date);
        this.state.gantt.showDate(go_date);
    }

    onChangeInput(ev) {
        this.state[ev.target.name] = ev.target.value;
        this.orm.call("is.mem.var", 'set', [false, this.user_id, ev.target.name, ev.target.value]);
    }

}
TestOwlGantt.components = { Layout, DhtmlxGantt };
TestOwlGantt.template = "is_pic_3ans.test_owl_gantt_template";
registry.category("actions").add("is_pic_3ans.test_owl_gantt_registry", TestOwlGantt);

