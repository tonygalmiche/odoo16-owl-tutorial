/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { getDefaultConfig } from "@web/views/view";
import { loadJS } from "@web/core/assets";
import { useService } from "@web/core/utils/hooks";

const { Component, useSubEnv, onWillStart, onMounted, useState } = owl;

class GanttProject extends Component {
    setup() {
        this.orm = useService("orm");
        this.state = useState({
            'input1': false,
            'lines': [],
        });

        useSubEnv({
            config: {
                ...getDefaultConfig(),
                ...this.env.config,
            },
        });
        this.display = {
            controlPanel: { "top-right": false, "bottom-right": false },
        };

        onWillStart(() => {
            return loadJS(["/is_pic_3ans/static/lib/gantt-master/codebase/dhtmlxgantt.js"]); //Chargement de la librairie à la demande
        });

        onMounted(() => {
            gantt.i18n.setLocale("fr");             // Localisation en Français
            gantt.config.scale_height     = 65;     // Hauteur des titres
            gantt.config.min_column_width = 20;     // Largeur mini des colonnes => Doit être petite pour pouvoir afficher complètement le Gantt
            gantt.config.sort             = true;   // Pouvoir trier le tableau des tâches en cliqaunt sur le titre des colonnes
            gantt.config.row_height       = 25;     // Hauteur des lignes du Gantt
            gantt.config.duration_unit    = "hour"; //an hour

            gantt.config.xml_date = "%Y-%m-%d %H:%i";



            //Configuration des titres sur 2 lignes (en mois et en jours)
            gantt.config.scales = [
                {unit: "month", step: 1, format: "%F %Y"}, /* https://docs.dhtmlx.com/gantt/desktop__date_format.html */
                {unit: "day"  , step: 1, format: "%d"},
                {unit: "hour" , step: 8, format: "%H"},
            ];
            gantt.init("gantt_here");   // Initialisation du Gantt
        });
     }



    async GetGanttLines(){
        var lines = await this.orm.call("project.project", 'get_gantt_lines', []);
        return lines
    }

     OKclick(ev) {
        this.GetGanttLines().then(res => {
            console.log("data =",res.data);
            var links=[];



            gantt.clearAll(); 
            gantt.parse({
                data : res.data, 
                links: res.links,
            });
        }).catch(err => {
            console.log("ERR",err);
        });

     }



    /*
     OKclick(ev) {
        var start = new Date();
        var data=[];
        data.push({id: 1, text: "Projet 1", start_date: null, duration: null, parent:0, progress: 0, open: true});
        for (let i = 1; i <= 5; i++) {
            var progress = Math.random();
            var priority=Math.floor(Math.random() * 3);
            var duration = Math.floor(Math.random() * 10);
            var text = "Tâche "+i+"<br><h1>Test</h1>" // Le code HTML sera affiché dans l'infobulle de la task
            data.push({id: i+1, text: text, start_date: start, duration:duration, parent:1, progress: progress, priority:priority});
            start = new Date(start.setDate(start.getDate()+duration+0.5));
            console.log("start=", start);
        }
        var links=[];
        for (let i = 2; i <= 5; i++) {
            links.push({id:i, source:i, target:i+1, type:"0"});
        }
        gantt.clearAll(); 
        gantt.parse({
            data: data, 
            links: links,
        });
     }
     */
}

GanttProject.components = { Layout };
GanttProject.template = "is_pic_3ans.gantt_project_template";
registry.category("actions").add("is_pic_3ans.gantt_project_registry", GanttProject);

